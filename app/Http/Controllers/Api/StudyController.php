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
use App\Services\ExploreAI;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Random\Engine\Mt19937;
use Random\Randomizer;

/**
 * Study helpers:
 * - explore(): "জানুন" — answers a question / topic with matching ayahs, hadiths and duas from our own data.
 *   With an Anthropic key set, Claude reads the question and ranks the matches (see ExploreAI);
 *   without one, keyword search only.
 * - suggest(): type-ahead suggestions for the search box
 * - words():   word-by-word Bangla meaning of an ayah (from the free quran.com API, cached)
 * - quiz():    a small daily quiz generated from the database
 */
class StudyController extends Controller
{
    // At most this many concepts (parts) of a question are searched
    private const MAX_CONCEPTS = 6;

    // How much covering a topic concept is worth in the score (plain words: 40-70, AI keywords: 100)
    private const TOPIC_IMPORTANCE = 150;

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

        $parsed = [
            'converted' => $converted,
            // The whole sentence as it was understood, shown instead of word-by-word conversions
            'converted_query' => $converted ? trim(preg_replace('/\s+/u', ' ', $banglaQuery)) : null,
            ...$this->parseQuery($banglaQuery),
            'query' => $query,
        ];

        if (! $parsed['concepts']) {
            unset($parsed['concepts']);
            return response()->json([
                ...$parsed,
                'ayahs' => [],
                'hadiths' => [],
                'duas' => [],
            ]);
        }

        if (ExploreAI::enabled()) {
            $normalized = mb_strtolower(trim(preg_replace('/\s+/u', ' ', Banglish::nfc($query))));
            $aiResult = Cache::remember('explore-ai-v6:' . md5($normalized), now()->addWeek(), fn () => $this->exploreWithAI($query, $parsed));
            if ($aiResult) {
                return response()->json($aiResult);
            }
        }

        $cacheKey = 'explore-v6:' . md5(json_encode($parsed['concepts']));
        $results = Cache::remember($cacheKey, now()->addDay(), fn () => [
            'ayahs' => $this->searchAyahs($parsed['concepts']),
            'hadiths' => $this->searchHadiths($parsed['concepts']),
            'duas' => $this->searchDuas($parsed['concepts']),
        ]);

        unset($parsed['concepts']);
        return response()->json([...$parsed, ...$results, 'ai' => null]);
    }

    /**
     * Claude reads the question → its keywords and topics widen our search → Claude ranks what we found.
     * Returns null when the AI is unavailable, so the caller falls back to the keyword search
     * (null is not cached by Cache::remember, so the next request tries the AI again).
     */
    private function exploreWithAI(string $query, array $parsed): ?array
    {
        $topics = config('hasana_explore.topics');
        $ai = ExploreAI::understand($query, array_map(fn ($t) => $t['label'], $topics));
        if (! $ai) {
            return null;
        }

        // The AI's topics and keywords become extra concepts next to the ones read from the sentence
        $concepts = $parsed['concepts'];
        $topicLabels = $parsed['topics'];
        foreach ($ai['topics'] as $key) {
            if (in_array($topics[$key]['label'], $topicLabels, true)) {
                continue;
            }
            $topicLabels[] = $topics[$key]['label'];
            $group = [];
            foreach ($topics[$key]['terms'] as $i => $term) {
                $group[$term] = $i < 3 ? 3 : 1;
            }
            $concepts[] = ['importance' => self::TOPIC_IMPORTANCE, 'terms' => $group];
        }
        $known = $this->flattenConcepts($concepts);
        foreach ($ai['keywords'] as $word) {
            $word = mb_strtolower(Banglish::nfc($word));
            if (mb_strlen($word) >= 2 && ! isset($known[$word])) {
                $concepts[] = ['importance' => 100, 'terms' => [$word => 3]];
            }
        }
        $concepts = $this->finishConcepts(array_slice($concepts, 0, self::MAX_CONCEPTS + 4));
        $terms = $this->flattenConcepts($concepts);

        // A wider net than the final list, so the ranking has something to choose from
        $found = [
            'ayah' => $concepts ? $this->searchAyahs($concepts, 16) : [],
            'hadith' => $concepts ? $this->searchHadiths($concepts, 12) : [],
            'dua' => $concepts ? $this->searchDuas($concepts, 8) : [],
        ];
        $limits = ['ayah' => 8, 'hadith' => 6, 'dua' => 5];

        $ranking = ExploreAI::rank($query, $ai['understood'], [
            'ayah' => collect($found['ayah'])->mapWithKeys(fn ($a) => [$a['id'] => $a['text_bn']])->all(),
            'hadith' => collect($found['hadith'])->mapWithKeys(fn ($h) => [$h['id'] => $h['text_bn']])->all(),
            'dua' => collect($found['dua'])->mapWithKeys(fn ($d) => [$d['id'] => "{$d['title']} — {$d['text_bn']}"])->all(),
        ]);

        $results = [];
        foreach ($found as $kind => $items) {
            $byId = collect($items)->keyBy('id');
            $ordered = $ranking
                ? collect($ranking[$kind])->map(fn ($id) => $byId[$id])->all()
                : $items;
            // If the ranking kept nothing of a kind while the database had strong matches, show the top few
            if ($ranking && ! $ordered && ! $ranking['ayah'] && ! $ranking['hadith'] && ! $ranking['dua']) {
                $ordered = array_slice($items, 0, 3);
            }
            $results[$kind] = array_values(array_slice($ordered, 0, $limits[$kind]));
        }

        return [
            'query' => $query,
            'converted' => $parsed['converted'],
            'converted_query' => $parsed['converted_query'],
            'terms' => $terms,
            'topics' => array_values(array_unique($topicLabels)),
            'focus' => $ai['focus'] ?? $parsed['focus'],
            'is_fiqh' => $ai['is_fiqh'] || $parsed['is_fiqh'],
            'ayahs' => $results['ayah'],
            'hadiths' => $results['hadith'],
            'duas' => $results['dua'],
            'ai' => [
                'understood' => $ai['understood'],
                'corrected_query' => $ai['corrected_query'],
                'related' => $ai['related'],
                'ranked' => $ranking !== null,
            ],
        ];
    }

    /**
     * Type-ahead suggestions while the user types (no AI, so it answers instantly):
     * matching topics turned into ready questions, dua titles and surah names.
     */
    public function suggest(Request $request): JsonResponse
    {
        $request->validate(['q' => 'nullable|string|max:100']);
        $raw = trim((string) $request->query('q'));
        // One letter matches almost everything
        if (mb_strlen($raw) < 2) {
            return response()->json(['suggestions' => []]);
        }

        [$bangla] = $this->convertBanglish($raw);
        $needle = mb_strtolower(trim(Banglish::nfc($bangla)));
        $tokens = preg_split('/\s+/u', $needle, -1, PREG_SPLIT_NO_EMPTY);
        $last = end($tokens) ?: $needle;

        $matches = fn (string $word) => ($w = mb_strtolower(Banglish::nfc($word))) !== ''
            && (str_contains($w, $needle) || str_contains($needle, $w) || (mb_strlen($last) >= 2 && str_starts_with($w, $last)));

        $suggestions = [];
        foreach (config('hasana_explore.topics') as $topic) {
            $words = [$topic['label'], ...$topic['aliases'], ...$topic['terms']];
            if (! collect($words)->contains($matches)) {
                continue;
            }
            $label = $topic['label'];
            $suggestions[] = ['text' => $label, 'type' => 'topic'];
            $suggestions[] = ['text' => "{$label} নিয়ে কুরআনে কী বলা হয়েছে?", 'type' => 'question'];
            $suggestions[] = ['text' => "{$label} সম্পর্কে হাদিস", 'type' => 'question'];
            $suggestions[] = ['text' => "{$label} বিষয়ে দোয়া", 'type' => 'question'];
            if (count($suggestions) >= 8) {
                break;
            }
        }

        if (mb_strlen($needle) >= 2) {
            Dua::query()->active()
                ->where('title', 'like', '%' . $needle . '%')
                ->orderBy('sort_order')
                ->limit(4)
                ->pluck('title')
                ->each(function ($title) use (&$suggestions) {
                    $suggestions[] = ['text' => $title, 'type' => 'dua'];
                });

            Surah::query()
                ->where(fn ($q) => $q
                    ->where('meta->name_bn', 'like', '%' . $needle . '%')
                    ->orWhere('name_en', 'like', '%' . $raw . '%'))
                ->orderBy('number')
                ->limit(3)
                ->get(['number', 'slug', 'name_en', 'meta'])
                ->each(function (Surah $surah) use (&$suggestions) {
                    $suggestions[] = [
                        'text' => 'সূরা ' . ($surah->meta['name_bn'] ?? $surah->name_en),
                        'type' => 'surah',
                        'link' => "/surah/{$surah->slug}",
                    ];
                });
        }

        return response()->json([
            'suggestions' => collect($suggestions)->unique('text')->take(10)->values(),
        ]);
    }

    /**
     * Replace Banglish / English words with Bangla ones ("hotasa" → হতাশ).
     * Returns the converted query and what was converted [latin => bangla], for the UI.
     */
    private function convertBanglish(string $q): array
    {
        $dictionary = config('hasana_explore.latin');
        $suffixes = config('hasana_explore.latin_suffixes');
        $converted = [];

        // A word optionally followed by a suffix typed apart ("nari der" → নারী + দের = নারীদের)
        $suffixAlt = implode('|', array_map('preg_quote', array_keys($suffixes)));
        $pattern = "/([A-Za-z']+)(?:\\s+({$suffixAlt}))?(?![A-Za-z'])/i";

        $banglaQuery = preg_replace_callback($pattern, function ($m) use ($dictionary, $suffixes, &$converted) {
            $word = strtolower($m[1]);
            $bangla = $dictionary[$word]
                ?? $dictionary[rtrim($word, 's')]
                ?? Banglish::toBangla($word);
            $suffix = isset($m[2]) && $m[2] !== '' ? $suffixes[strtolower($m[2])] : '';
            if ($bangla === null) {
                return $m[0];
            }
            $bangla .= $suffix;
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

        // The question is split into concepts: "নারীদের পর্দা নিয়ে কী আছে" → [নারী], [পর্দা].
        // Each concept is a group of interchangeable words; results that cover every concept rank first.
        $concepts = [];
        $topics = [];
        $consumed = [];
        foreach ($config['topics'] as $topic) {
            $words = [...$topic['aliases'], ...$topic['terms'], $topic['label']];
            $hit = collect($words)->first(fn ($w) => $matchesWord(mb_strtolower($w)));
            if ($hit === null) {
                continue;
            }
            $topics[] = $topic['label'];
            $group = [];
            foreach ($topic['terms'] as $i => $term) {
                // The first terms are the topic's core words
                $group[$term] = $i < 3 ? 3 : 1;
            }
            $concepts[] = ['importance' => self::TOPIC_IMPORTANCE, 'terms' => $group];
            // Only the topic's own names absorb a word of the sentence; any other word stays a concept
            // of its own ("বাবা মায়ের সাথে সদ্ব্যবহার" → [বাবা-মা], [সদ্ব্যবহার]), so texts with both rank first
            foreach ([...$topic['aliases'], $topic['label']] as $w) {
                $w = mb_strtolower($w);
                foreach ($tokens as $token) {
                    // Multi-word aliases ("মন খারাপ") cover each of their words
                    if (str_starts_with($token, $w) || (str_contains($w, ' ') && $matchesWord($w) && in_array($token, explode(' ', $w), true))) {
                        $consumed[$token] = true;
                    }
                }
            }
        }

        // Words that are not part of a known topic are searched by their stem ("পর্দার" → "পর্দা")
        // (very short ones like "মা" would match inside unrelated words, so they are skipped)
        $seen = [];
        foreach ($tokens as $token) {
            $stem = $this->stem($token);
            if (! isset($consumed[$token]) && ! isset($seen[$stem]) && mb_strlen($stem) >= 3 && ! in_array($stem, $config['stopwords'], true)) {
                $seen[$stem] = true;
                // A plain word counts less than a topic, and a common word less than a specific one
                // ("সুদ খাওয়ার শাস্তি": the subject is সুদ, not খাওয়া), so it can't outweigh the subject
                $concepts[] = [
                    'importance' => 40 + 15 * ($this->rarity($stem) - 1),
                    'terms' => [$stem => 2] + array_fill_keys($this->synonymsOf($stem), 2),
                ];
            }
        }

        $concepts = $this->finishConcepts(array_slice($concepts, 0, self::MAX_CONCEPTS));

        return [
            'query' => $q,
            'concepts' => $concepts,
            'terms' => $this->flattenConcepts($concepts),
            'topics' => $topics,
            'focus' => $focus,
            'is_fiqh' => $isFiqh,
        ];
    }

    /**
     * Our texts mix both encodings of য় / ড় / ঢ় (one code point, or letter + nukta): every term is
     * searched in both. Also caps each group's size so the score SQL stays small.
     */
    private function finishConcepts(array $concepts): array
    {
        return array_values(array_filter(array_map(function (array $concept) {
            $group = $concept['terms'];
            arsort($group);
            $group = array_slice($group, 0, 8, true);
            foreach ($group as $term => $weight) {
                $composed = Banglish::composed((string) $term);
                if ($composed !== (string) $term) {
                    $group[$composed] = $weight;
                }
            }
            return $group ? ['importance' => $concept['importance'], 'terms' => $group] : null;
        }, $concepts)));
    }

    /** All terms of all concepts [term => weight], for the FULLTEXT pre-filter and for highlighting. */
    private function flattenConcepts(array $concepts): array
    {
        $terms = [];
        foreach ($concepts as $concept) {
            foreach ($concept['terms'] as $term => $weight) {
                $terms[$term] = max($terms[$term] ?? 0, $weight);
            }
        }
        arsort($terms);
        return $terms;
    }

    /**
     * Other words for a plain word, from the 'synonyms' groups in config/hasana_explore.php
     * (people write "পুরস্কার", translations say "প্রতিদান").
     */
    private function synonymsOf(string $stem): array
    {
        foreach (config('hasana_explore.synonyms', []) as $group) {
            foreach ($group as $word) {
                $word = Banglish::nfc($word);
                if ($stem === $word || (mb_strlen($word) >= 3 && str_starts_with($stem, $word))) {
                    return array_values(array_diff(array_map([Banglish::class, 'nfc'], $group), [$stem]));
                }
            }
        }
        return [];
    }

    /**
     * Strip a Bangla case / plural ending so the word matches all its forms:
     * নারীদের / নারীরা / নারীকে → নারী, পর্দার → পর্দা, মানুষের → মানুষ.
     * "র" / "রা" / "কে" are only taken off after a vowel sign, so অন্তর or আকাশকে-like roots stay whole.
     */
    private function stem(string $token): string
    {
        $vowelSign = '[\x{09BE}-\x{09CC}]';
        $rules = [
            '/^(.{2,}?)(দেরকে|দের|গুলো|গুলি|গুলা|েরা|ের)$/u',
            "/^(.{2,}?{$vowelSign})(রা|র|কে)$/u",
        ];
        foreach ($rules as $rule) {
            if (preg_match($rule, $token, $m)) {
                return $m[1];
            }
        }
        return $token;
    }

    /**
     * How specific a term is, from how many ayahs and hadiths contain it: a rare word like
     * "পর্দা" says more about the question than a common one like "নারী" or "আল্লাহ".
     * Returns a multiplier from 1 (very common) to 3 (rare). Cached, as the texts rarely change.
     */
    private function rarity(string $term): int
    {
        // Both encodings of য় / ড় share one rarity; multi-word terms are judged by their first word
        $word = Banglish::nfc(explode(' ', $term)[0]);
        $freq = Cache::remember('explore-freq:' . md5($word), now()->addMonth(), function () use ($word) {
            // search_words holds every word of our texts with its frequency (php artisan search:build-words);
            // a prefix lookup on its unique index takes a few milliseconds
            $sum = 0;
            foreach (array_unique([$word, Banglish::composed($word)]) as $form) {
                $sum += (int) DB::table('search_words')->where('word', 'like', addcslashes($form, '%_\\') . '%')->sum('freq');
            }
            return $sum;
        });

        return match (true) {
            $freq <= 80 => 3,
            $freq <= 500 => 2,
            default => 1,
        };
    }

    /**
     * SQL test (a sprintf pattern taking the column) and its binding for "the text contains this term".
     * Short words (3 letters or fewer: সুদ, রাগ) must stand as a word or carry a common ending, so
     * "সুদ" finds সুদ / সুদের / সুদখোর but not সুদক্ষ / সুদূর / মাসুদ. Longer words use a plain, much
     * faster substring test; they rarely hide inside unrelated words.
     */
    private function matchSql(string $term): array
    {
        $length = mb_strlen($term);
        if ($length > 5) {
            return ['(LOCATE(?, %s) > 0)', $term];
        }

        $letter = '\x{0980}-\x{09FF}\x{200C}\x{200D}';
        $start = "(^|[^{$letter}])" . addcslashes($term, '.^$*+?()[]{}|\\');
        if ($length > 3) {
            // 4-5 letters: must start a word ("রিবা" is not in "পরিবার"), any ending allowed
            return ['(%s REGEXP ?)', $start];
        }

        // 3 letters or fewer: a whole word or the word plus a common ending
        $endings = 'ের|এর|কে|রা|দের|খোর|ও|ই|টি|টা|গুলো|সমূহ';
        return ['(%s REGEXP ?)', "{$start}($|[^{$letter}]|{$endings})"];
    }

    /**
     * Relevance score SQL, built so the whole sentence matters, not single words:
     * for every concept the row mentions it earns that concept's importance (a topic 150, a plain word
     * 40-70 by how specific it is), plus the weight × rarity of the best word it used for it. So a text
     * covering the whole question outranks one that repeats a single word, and the subject of the
     * question outweighs incidental words; among equal coverage, specific words beat common ones.
     * Rows scoring 0 mention no concept.
     */
    private function scoreSql(array $columns, array $concepts): array
    {
        $parts = [];
        $bindings = [];

        foreach ($concepts as $concept) {
            $importance = (int) $concept['importance'];
            $best = [];
            $extra = [];
            $groupBindings = [];
            foreach ($concept['terms'] as $term => $weight) {
                $term = (string) $term;
                $rarity = $this->rarity($term);
                [$test, $needle] = $this->matchSql($term);
                foreach ($columns as $column => $columnWeight) {
                    $w = (int) $weight * $rarity * (int) $columnWeight;
                    $hit = sprintf($test, "COALESCE({$column}, '')");
                    $best[] = "{$hit} * " . ($importance + $w);
                    $extra[] = "{$hit} * {$w}";
                    $groupBindings[] = $needle;
                }
            }
            // The concept's importance for covering it + the best word's weight, plus a little for each further
            // synonym of the same concept the text uses (a text about the concept uses several)
            $parts[] = (count($best) === 1 ? $best[0] : 'GREATEST(' . implode(', ', $best) . ')')
                . ' + (' . implode(' + ', $extra) . ') DIV 2';
            array_push($bindings, ...$groupBindings, ...$groupBindings);
        }

        return [implode(' + ', $parts) ?: '0', $bindings];
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

    private function searchAyahs(array $concepts, int $limit = 8): array
    {
        [$score, $bindings] = $this->scoreSql(['text_bn' => 1], $concepts);

        return Ayah::query()
            ->select(['id', 'surah_id', 'number', 'text_ar', 'text_bn'])
            ->selectRaw("({$score}) AS score", $bindings)
            ->whereFullText('text_bn', $this->fulltextQuery($this->flattenConcepts($concepts)), ['mode' => 'boolean'])
            ->where('is_active', true)
            ->having('score', '>', 0)
            ->with('surah:id,number,slug,name_en,name_ar,meta')
            ->orderByDesc('score')
            // Equal scores: a short ayah that mentions the concepts is more about them than a long one
            ->orderByRaw('CHAR_LENGTH(text_bn)')
            ->orderBy('id')
            ->limit($limit)
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

    private function searchHadiths(array $concepts, int $limit = 6): array
    {
        [$score, $bindings] = $this->scoreSql(['text_bn' => 1], $concepts);

        return Hadith::query()
            ->select(['id', 'hadith_category_id', 'title', 'text_bn', 'reference'])
            ->selectRaw("({$score}) AS score", $bindings)
            ->whereFullText('text_bn', $this->fulltextQuery($this->flattenConcepts($concepts)), ['mode' => 'boolean'])
            ->active()
            ->having('score', '>', 0)
            ->with('category:id,name')
            // Among equally good matches, shorter hadiths are easier to read
            ->orderByDesc('score')
            ->orderByRaw('CHAR_LENGTH(text_bn)')
            // Fetch extra: the collections hold some hadiths twice, duplicates are dropped below
            ->limit($limit * 2)
            ->get()
            ->unique(fn (Hadith $hadith) => mb_substr(preg_replace('/\s+/u', '', $hadith->text_bn), 0, 160))
            ->take($limit)
            ->values()
            ->map(fn (Hadith $hadith) => [
                'id' => $hadith->id,
                'title' => $hadith->title,
                'text_bn' => $hadith->text_bn,
                'reference' => $hadith->reference,
                'category' => $hadith->category?->name,
            ])
            ->all();
    }

    private function searchDuas(array $concepts, int $limit = 5): array
    {
        [$score, $bindings] = $this->scoreSql(['title' => 3, 'text_bn' => 1], $concepts);

        return Dua::query()
            ->select(['id', 'title', 'text_ar', 'text_bn', 'transliteration', 'reference'])
            ->selectRaw("({$score}) AS score", $bindings)
            ->active()
            ->having('score', '>', 0)
            ->orderByDesc('score')
            ->orderBy('sort_order')
            ->limit($limit)
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
