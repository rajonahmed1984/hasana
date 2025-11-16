<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Ayah;
use App\Models\Surah;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\View\View;

class HasanaController extends Controller
{
    private const BANGLA_DIGITS = [
        '0' => '০',
        '1' => '১',
        '2' => '২',
        '3' => '৩',
        '4' => '৪',
        '5' => '৫',
        '6' => '৬',
        '7' => '৭',
        '8' => '৮',
        '9' => '৯',
    ];

    public function index()
    {
        return redirect()->route('hasana.home');
    }

    public function home(): View
    {
        $verseOfDay = $this->resolveVerseOfDay();

        return view('frontend.home', compact('verseOfDay'));
    }

    public function quran(): View
    {
        return view('frontend.quran');
    }

    public function surah(Surah $surah): View
    {
        return view('frontend.surah', compact('surah'));
    }

    public function hadiths(): View
    {
        return view('frontend.hadiths');
    }

    public function duas(): View
    {
        return view('frontend.duas');
    }
    public function umrah(): View
    {
        return view('frontend.umrah');
    }

    public function bookmarks(): View
    {
        $surahs = Surah::query()
            ->select(['id', 'number', 'name_ar', 'name_en', 'meta'])
            ->orderBy('number')
            ->get()
            ->map(fn (Surah $surah) => [
                'id' => $surah->id,
                'number' => (int) $surah->number,
                'name_bn' => data_get($surah->meta, 'name_bn'),
                'name_ar' => $surah->name_ar,
                'name_en' => $surah->name_en,
            ]);

        return view('frontend.bookmarks', [
            'surahSummaries' => $surahs,
        ]);
    }

    public function settings(): View
    {
        return view('frontend.settings', [
            'defaultArabicFontSize' => 28,
            'defaultTranslationFontSize' => 16,
        ]);
    }

    public function about(): View
    {
        return view('frontend.about');
    }

    public function share(Request $request): View
    {
        $text = trim((string) $request->query('text', ''));
        $reference = trim((string) $request->query('ref', ''));

        return view('frontend.share', [
            'shareText' => $text,
            'shareReference' => $reference,
        ]);
    }

    public function bookmarkData(Request $request): JsonResponse
    {
        $keys = collect(explode(',', (string) $request->query('keys', '')))
            ->map(fn ($key) => trim($key))
            ->filter(fn ($key) => preg_match('/^\d+:\d+$/', $key));

        if ($keys->isEmpty()) {
            return response()->json(['data' => []]);
        }

        $parsedKeys = $keys->map(function (string $key) {
            [$surah, $ayah] = array_map('intval', explode(':', $key, 2));

            return [
                'raw' => $key,
                'surah' => $surah,
                'ayah' => $ayah,
            ];
        });

        $surahNumbers = $parsedKeys->pluck('surah')->unique()->values();
        $surahs = Surah::query()
            ->whereIn('number', $surahNumbers)
            ->get()
            ->keyBy('number');

        if ($surahs->isEmpty()) {
            return response()->json(['data' => []]);
        }

        $ayahNumbers = $parsedKeys->pluck('ayah')->unique()->values();
        $ayahs = Ayah::query()
            ->whereIn('surah_id', $surahs->pluck('id'))
            ->whereIn('number', $ayahNumbers)
            ->get()
            ->groupBy('surah_id')
            ->map(fn ($group) => $group->keyBy('number'));

        $data = [];

        foreach ($parsedKeys as $item) {
            $surah = $surahs->get($item['surah']);
            if (!$surah) {
                continue;
            }

            $ayah = optional($ayahs->get($surah->id))->get($item['ayah']);
            if (!$ayah) {
                continue;
            }

            $data[] = [
                'key' => $item['raw'],
                'surah_number' => $item['surah'],
                'ayah_number' => $item['ayah'],
                'surah_name' => $this->resolveSurahName($surah),
                'surah_name_en' => $surah->name_en,
                'surah_name_ar' => $surah->name_ar,
                'text_bn' => $ayah->text_bn,
                'text_ar' => $ayah->text_ar,
                'transliteration' => $ayah->transliteration,
                'footnotes' => $ayah->footnotes,
                'reference_bn' => sprintf(
                    '%s:%s',
                    $this->formatBanglaNumber($item['surah']),
                    $this->formatBanglaNumber($item['ayah'])
                ),
            ];
        }

        return response()->json(['data' => $data]);
    }

    protected function resolveVerseOfDay(): ?array
    {
        $query = Ayah::query()
            ->with('surah')
            ->where('is_active', true);

        $count = (clone $query)->count();
        if ($count === 0) {
            return null;
        }

        $offset = Carbon::today()->dayOfYear % $count;

        $ayah = (clone $query)
            ->orderBy('surah_id')
            ->orderBy('number')
            ->skip($offset)
            ->first();

        if (!$ayah) {
            $ayah = $query->inRandomOrder()->first();
        }

        if (!$ayah) {
            return null;
        }

        $surah = $ayah->surah;
        $reference = $surah
            ? sprintf('(সূরা %s, %s:%s)', $this->resolveSurahName($surah), $this->formatBanglaNumber($surah->number), $this->formatBanglaNumber($ayah->number))
            : sprintf('(আয়াত %s)', $this->formatBanglaNumber($ayah->number));

        return [
            'title' => 'আজকের দিনের আয়াত',
            'text' => $ayah->text_bn ?: $ayah->text_ar,
            'reference' => $reference,
        ];
    }

    private function formatBanglaNumber(int $number): string
    {
        return strtr((string) $number, self::BANGLA_DIGITS);
    }

    private function resolveSurahName(Surah $surah): string
    {
        $meta = $surah->meta ?? [];
        $name = data_get($meta, 'name_bn');

        return $name ?: ($surah->name_ar ?: $surah->name_en);
    }
}











