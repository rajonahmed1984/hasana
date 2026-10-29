<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ayah;
use App\Models\Dua;
use App\Models\Hadith;
use App\Models\HadithCategory;
use App\Models\Surah;
use App\Services\Banglish;
use App\Services\DailyAyah;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Random\Engine\Mt19937;
use Random\Randomizer;

/**
 * Study helpers that work without any paid AI:
 * - explore(): "জানুন" — answers a question / topic with matching ayahs, hadiths and duas from our own data
 * - words():   word-by-word Bangla meaning of an ayah (from the free quran.com API, cached)
 * - quiz():    a small daily quiz generated from the database
 */
class StudyController extends Controller
{
    private const MAX_TERMS = 12;

    public function topics(): JsonResponse
    {
        $topics = config('hasana_explore.topics');

        return response()->json([
            'topics' => collect(config('hasana_explore.featured'))
                ->filter(fn ($key) => isset($topics[$key]))
                ->map(fn ($key) => ['key' => $key, 'label' => $topics[$key]['label']])
                ->values(),
        ]);
    }

    public function explore(Request $request): JsonResponse
    {
        $request->validate(['q' => 'required|string|max:200']);

        $query = (string) $request->query('q');
        [$banglaQuery, $converted] = $this->convertBanglish($query);

        $parsed = ['converted' => $converted, ...$this->parseQuery($banglaQuery), 'query' => $query];

        if (! $parsed['terms']) {
            return response()->json([
                ...$parsed,
                'ayahs' => [],
                'hadiths' => [],
                'duas' => [],
            ]);
        }

        $cacheKey = 'explore:' . md5(json_encode($parsed['terms']));
        $results = Cache::remember($cacheKey, now()->addDay(), fn () => [
            'ayahs' => $this->searchAyahs($parsed['terms']),
            'hadiths' => $this->searchHadiths($parsed['terms']),
            'duas' => $this->searchDuas($parsed['terms']),
        ]);

        return response()->json([...$parsed, ...$results]);
    }

    /**
     * Replace Banglish / English words with Bangla ones ("hotasa" → হতাশ).
     * Returns the converted query and what was converted [latin => bangla], for the UI.
     */
    private function convertBanglish(string $q): array
    {
        $dictionary = config('hasana_explore.latin');
        $converted = [];

        $banglaQuery = preg_replace_callback("/[A-Za-z']+/", function ($m) use ($dictionary, &$converted) {
            $word = strtolower($m[0]);
            $bangla = $dictionary[$word]
                ?? $dictionary[rtrim($word, 's')]
                ?? Banglish::toBangla($word);
            if ($bangla === null) {
                return $m[0];
            }
            $converted[$m[0]] = $bangla;
            return $bangla;
        }, $q);

        return [$banglaQuery, $converted];
    }

    /**
     * Turn a free-text question into weighted search terms.
     * Returns: terms [term => weight], topics (labels), focus (ayah|hadith|dua|null), is_fiqh.
     */
    private function parseQuery(string $q): array
    {
        $config = config('hasana_explore');
        $config['stopwords'] = array_map([Banglish::class, 'nfc'], $config['stopwords']);
        $normalized = trim(preg_replace('/\s+/u', ' ', mb_strtolower(Banglish::nfc($q))));

        $isFiqh = collect($config['fiqh'])->contains(fn ($phrase) => str_contains($normalized, $phrase));

        $focus = match (true) {
            (bool) preg_match('/দোয়া|দুআ|দু‘আ|মোনাজাত/u', $normalized) => 'dua',
            (bool) preg_match('/হাদিস|হাদীস/u', $normalized) => 'hadith',
            (bool) preg_match('/কুরআন|কোরআন|আয়াত/u', $normalized) => 'ayah',
            default => null,
        };

        $tokens = preg_split('/[\s,।?!؟.;:"“”()]+/u', $normalized, -1, PREG_SPLIT_NO_EMPTY);
        $tokens = array_values(array_filter(
            $tokens,
            fn ($t) => mb_strlen($t) >= 2 && ! in_array($t, $config['stopwords'], true)
        ));
        $normalized = implode(' ', $tokens);

        // A topic matches when a token starts with one of its words (so "ধৈর্যের" matches "ধৈর্য"),
        // or a multi-word alias appears in the question
        $matchesWord = function (string $word) use ($tokens, $normalized) {
            if (str_contains($word, ' ')) {
                return str_contains($normalized, $word);
            }
            foreach ($tokens as $token) {
                if (str_starts_with($token, $word)) {
                    return true;
                }
            }
            return false;
        };

        $terms = [];
        $topics = [];
        $consumed = [];
        foreach ($config['topics'] as $topic) {
            $words = [...$topic['aliases'], ...$topic['terms'], $topic['label']];
            $hit = collect($words)->first(fn ($w) => $matchesWord(mb_strtolower($w)));
            if ($hit === null) {
                continue;
            }
            $topics[] = $topic['label'];
            foreach ($topic['terms'] as $i => $term) {
                // The first terms are the topic's core words
                $terms[$term] = max($terms[$term] ?? 0, $i < 3 ? 3 : 1);
            }
            foreach ($words as $w) {
                $w = mb_strtolower($w);
                foreach ($tokens as $token) {
                    // Multi-word aliases ("মন খারাপ") cover each of their words
                    if (str_starts_with($token, $w) || (str_contains($w, ' ') && $matchesWord($w) && in_array($token, explode(' ', $w), true))) {
                        $consumed[$token] = true;
                    }
                }
            }
        }

        // Words that are not part of a known topic are searched as they are
        // (very short ones like "মা" would match inside unrelated words, so they are skipped)
        foreach ($tokens as $token) {
            if (! isset($consumed[$token]) && mb_strlen($token) >= 3) {
                $terms[$token] = max($terms[$token] ?? 0, 2);
            }
        }

        arsort($terms);
        $terms = array_slice($terms, 0, self::MAX_TERMS, true);

        // Our texts mix both encodings of য় / ড় / ঢ় (one code point, or letter + nukta): search both
        foreach ($terms as $term => $weight) {
            $composed = Banglish::composed($term);
            if ($composed !== $term) {
                $terms[$composed] = $weight;
            }
        }

        return [
            'query' => $q,
            'terms' => $terms,
            'topics' => $topics,
            'focus' => $focus,
            'is_fiqh' => $isFiqh,
        ];
    }

    /**
     * Relevance score SQL: for each term, how often it occurs in the column (counted up to 3),
     * times the term's and the column's weight. Rows scoring 0 don't mention any term.
     */
    private function scoreSql(array $columns, array $terms): array
    {
        $parts = [];
        $bindings = [];

        foreach ($columns as $column => $columnWeight) {
            $col = "COALESCE({$column}, '')";
            foreach ($terms as $term => $weight) {
                $parts[] = "LEAST(3, (CHAR_LENGTH({$col}) - CHAR_LENGTH(REPLACE({$col}, ?, ''))) DIV "
                    . mb_strlen((string) $term) . ') * ' . ((int) $weight * (int) $columnWeight);
                $bindings[] = (string) $term;
            }
        }

        return [implode(' + ', $parts), $bindings];
    }

    /**
     * FULLTEXT boolean query matching any term: words as prefixes (ধৈর্য* also finds ধৈর্যের),
     * multi-part terms ("পিতা-মাতা", "দান কর") as phrases.
     */
    private function fulltextQuery(array $terms): string
    {
        return collect(array_keys($terms))
            ->map(fn ($term) => trim(preg_replace('/[+\-<>()~*"@]+/u', ' ', (string) $term)))
            ->filter()
            ->map(fn ($term) => str_contains($term, ' ') || str_contains((string) $term, "'") ? "\"{$term}\"" : "{$term}*")
            ->implode(' ');
    }

    private function searchAyahs(array $terms): array
    {
        [$score, $bindings] = $this->scoreSql(['text_bn' => 1], $terms);

        return Ayah::query()
            ->select(['id', 'surah_id', 'number', 'text_ar', 'text_bn'])
            ->selectRaw("({$score}) AS score", $bindings)
            ->whereFullText('text_bn', $this->fulltextQuery($terms), ['mode' => 'boolean'])
            ->where('is_active', true)
            ->having('score', '>', 0)
            ->with('surah:id,number,slug,name_en,name_ar,meta')
            ->orderByDesc('score')
            ->orderBy('id')
            ->limit(8)
            ->get()
            ->map(function (Ayah $ayah) {
                $surahName = $ayah->surah?->meta['name_bn'] ?? $ayah->surah?->name_en;
                return [
                    'id' => $ayah->id,
                    'surah_name' => $surahName,
                    'surah_number' => $ayah->surah?->number,
                    'ayah_number' => $ayah->number,
                    'text_ar' => $ayah->text_ar,
                    'text_bn' => $ayah->text_bn,
                    'reference' => "সূরা {$surahName}, {$ayah->surah?->number}:{$ayah->number}",
                    'link' => "/surah/{$ayah->surah?->slug}#ayah-{$ayah->number}",
                ];
            })
            ->all();
    }

    private function searchHadiths(array $terms): array
    {
        [$score, $bindings] = $this->scoreSql(['text_bn' => 1], $terms);

        return Hadith::query()
            ->select(['id', 'hadith_category_id', 'title', 'text_bn', 'reference'])
            ->selectRaw("({$score}) AS score", $bindings)
            ->whereFullText('text_bn', $this->fulltextQuery($terms), ['mode' => 'boolean'])
            ->active()
            ->having('score', '>', 0)
            ->with('category:id,name')
            // Among equally good matches, shorter hadiths are easier to read
            ->orderByDesc('score')
            ->orderByRaw('CHAR_LENGTH(text_bn)')
            ->limit(6)
            ->get()
            ->map(fn (Hadith $hadith) => [
                'id' => $hadith->id,
                'title' => $hadith->title,
                'text_bn' => $hadith->text_bn,
                'reference' => $hadith->reference,
                'category' => $hadith->category?->name,
            ])
            ->all();
    }

    private function searchDuas(array $terms): array
    {
        [$score, $bindings] = $this->scoreSql(['title' => 3, 'text_bn' => 1], $terms);

        return Dua::query()
            ->select(['id', 'title', 'text_ar', 'text_bn', 'transliteration', 'reference'])
            ->selectRaw("({$score}) AS score", $bindings)
            ->active()
            ->having('score', '>', 0)
            ->orderByDesc('score')
            ->orderBy('sort_order')
            ->limit(5)
            ->get()
            ->map(fn (Dua $dua) => $dua->only(['id', 'title', 'text_ar', 'text_bn', 'transliteration', 'reference']))
            ->all();
    }

    /**
     * Word-by-word Bangla meaning of one ayah, from quran.com (free, no key). Cached forever once fetched.
     */
    public function words(int $surah, int $ayah): JsonResponse
    {
        abort_unless($surah >= 1 && $surah <= 114 && $ayah >= 1 && $ayah <= 286, 404);

        $cacheKey = "quran-words-bn:{$surah}:{$ayah}";
        $words = Cache::get($cacheKey);

        if ($words === null) {
            try {
                $response = Http::timeout(10)->acceptJson()->get(
                    "https://api.quran.com/api/v4/verses/by_key/{$surah}:{$ayah}",
                    ['language' => 'bn', 'words' => 'true', 'word_fields' => 'text_uthmani']
                );
            } catch (\Throwable) {
                $response = null;
            }

            if (! $response?->successful()) {
                return response()->json(['message' => 'শব্দার্থ এখন আনা যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।'], 503);
            }

            $words = collect($response->json('verse.words', []))
                ->where('char_type_name', 'word')
                ->map(fn ($w) => [
                    'ar' => $w['text_uthmani'] ?? $w['text'] ?? '',
                    'bn' => $w['translation']['text'] ?? '',
                    'tr' => $w['transliteration']['text'] ?? '',
                ])
                ->values()
                ->all();

            Cache::forever($cacheKey, $words);
        }

        return response()->json(['surah' => $surah, 'ayah' => $ayah, 'words' => $words]);
    }

    /**
     * Daily quiz — the same questions for everyone on a given date. The answer index is sent along;
     * this is a learning aid, not an exam.
     */
    public function quiz(Request $request): JsonResponse
    {
        $date = now();
        if ($request->filled('date')) {
            try {
                $date = Carbon::createFromFormat('Y-m-d', (string) $request->query('date'))->startOfDay();
            } catch (\Throwable) {
                // Invalid date: today
            }
        }
        $dateKey = $date->format('Y-m-d');

        $questions = Cache::remember("daily-quiz:{$dateKey}", now()->addDay(), function () use ($date, $dateKey) {
            $random = new Randomizer(new Mt19937(crc32('hasana-quiz-' . $dateKey)));

            return array_values(array_filter([
                ...$this->ayahQuestions($date, $random),
                $this->hadithQuestion($random),
                $this->duaQuestion($random),
            ]));
        });

        return response()->json(['date' => $dateKey, 'questions' => $questions]);
    }

    private function ayahQuestions(Carbon $date, Randomizer $random): array
    {
        $ayah = DailyAyah::forDate($date);
        if (! $ayah['id']) {
            return [];
        }

        $surah = Surah::where('number', $ayah['surah_number'])->first();
        $others = Surah::where('number', '!=', $ayah['surah_number'])->get()
            ->map(fn ($s) => $s->meta['name_bn'] ?? $s->name_en)
            ->all();

        $questions = [
            $this->makeQuestion(
                $random,
                'আজকের আয়াতটি কোন সূরার?',
                $ayah['text_bn'],
                'সূরা ' . $ayah['surah_name'],
                array_map(fn ($n) => "সূরা {$n}", $this->pick($random, $others, 3)),
                $ayah['reference'],
                "/surah/{$ayah['surah_slug']}#ayah-{$ayah['ayah_number']}",
            ),
        ];

        if (in_array($surah?->revelation_type, ['meccan', 'medinan'], true)) {
            $isMeccan = $surah->revelation_type === 'meccan';
            $questions[] = [
                'question' => "সূরা {$ayah['surah_name']} কোথায় অবতীর্ণ হয়েছে?",
                'text' => null,
                'options' => ['মক্কায় (মাক্কী সূরা)', 'মদিনায় (মাদানী সূরা)'],
                'answer' => $isMeccan ? 0 : 1,
                'explanation' => "সূরা {$ayah['surah_name']} একটি " . ($isMeccan ? 'মাক্কী' : 'মাদানী') . " সূরা, এতে {$surah->ayah_count}টি আয়াত আছে।",
                'link' => "/surah/{$surah->slug}",
            ];
        }

        return $questions;
    }

    private function hadithQuestion(Randomizer $random): ?array
    {
        $categories = HadithCategory::query()->active()->has('hadiths')->pluck('name', 'id');
        if ($categories->count() < 4) {
            return null;
        }

        $shortHadiths = Hadith::query()->active()
            ->whereNotNull('hadith_category_id')
            ->whereRaw('CHAR_LENGTH(text_bn) BETWEEN 80 AND 320');
        $count = (clone $shortHadiths)->count();
        if (! $count) {
            return null;
        }

        $hadith = $shortHadiths->orderBy('id')->skip($random->getInt(0, $count - 1))->first();
        $correct = $categories[$hadith->hadith_category_id] ?? null;
        if (! $correct) {
            return null;
        }

        // Drop the trailing cross-reference brackets, e.g. "(৬৪৮৪; মুসলিম ১/১৪ ...)"
        $text = trim(preg_replace('/(\s*\([^()]*\))+\s*$/u', '', $hadith->text_bn));

        return $this->makeQuestion(
            $random,
            'এই হাদিসটি কোন বিষয়ের অধ্যায়ে আছে?',
            $text,
            $correct,
            $this->pick($random, $categories->except($hadith->hadith_category_id)->values()->all(), 3),
            $hadith->reference,
            '/hadith',
        );
    }

    private function duaQuestion(Randomizer $random): ?array
    {
        $duas = Dua::query()->active()->whereNotNull('text_bn')->get(['id', 'title', 'text_bn', 'reference']);
        if ($duas->count() < 4) {
            return null;
        }

        $dua = $duas[$random->getInt(0, $duas->count() - 1)];
        $others = $duas->where('id', '!=', $dua->id)->pluck('title')->unique()->values()->all();

        return $this->makeQuestion(
            $random,
            'নিচের অর্থের দোয়াটি কোনটি?',
            $dua->text_bn,
            $dua->title,
            $this->pick($random, $others, 3),
            $dua->reference ? "সূত্র: {$dua->reference}" : null,
            '/duas',
        );
    }

    private function makeQuestion(Randomizer $random, string $question, ?string $text, string $correct, array $wrong, ?string $explanation, ?string $link): array
    {
        $options = $random->shuffleArray([$correct, ...$wrong]);

        return [
            'question' => $question,
            'text' => $text,
            'options' => $options,
            'answer' => array_search($correct, $options, true),
            'explanation' => $explanation,
            'link' => $link,
        ];
    }

    private function pick(Randomizer $random, array $items, int $n): array
    {
        $items = array_values(array_unique($items));
        if (count($items) <= $n) {
            return $items;
        }
        return array_map(fn ($k) => $items[$k], $random->pickArrayKeys($items, $n));
    }
}
