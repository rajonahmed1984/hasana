<?php

namespace App\Services;

use App\Models\Ayah;
use App\Models\Surah;
use Carbon\CarbonInterface;

/**
 * Picks the "Ayah of the day" (আজকের দিনের আয়াত) for a given date.
 */
class DailyAyah
{
    // Selection of well-known spiritual, inspiring Quranic verses [surah_number, ayah_number]
    private const FEATURED = [
        [1, 1], [1, 2], [1, 5], [1, 6], // Al-Fatihah
        [2, 152], [2, 186], [2, 255], [2, 286], // Al-Baqarah (including Ayat al-Kursi)
        [3, 139], [3, 159], [3, 200], // Ali 'Imran
        [4, 135], // An-Nisa
        [9, 128], [9, 129], // At-Tawbah
        [13, 28], // Ar-Ra'd
        [14, 7],  // Ibrahim
        [17, 24], [17, 82], // Al-Isra
        [21, 87], // Al-Anbiya (Dua Yunus)
        [24, 35], // An-Nur
        [25, 74], // Al-Furqan
        [39, 53], // Az-Zumar
        [55, 13], [55, 60], // Ar-Rahman
        [59, 22], [59, 23], [59, 24], // Al-Hashr
        [65, 2], [65, 3], // At-Talaq
        [93, 3], [93, 4], [93, 5], // Ad-Duha
        [94, 5], [94, 6], // Ash-Sharh
        [103, 1], [103, 2], [103, 3], // Al-'Asr
        [112, 1], [112, 2], [112, 3], [112, 4], // Al-Ikhlas
    ];

    public static function forDate(CarbonInterface $date): array
    {
        $picked = self::FEATURED[(int) $date->format('z') % count(self::FEATURED)];

        $surah = Surah::where('number', $picked[0])->first();
        $ayah = null;

        if ($surah) {
            $ayah = Ayah::where('surah_id', $surah->id)
                ->where('number', $picked[1])
                ->where('is_active', true)
                ->first();
        }

        if (! $ayah) {
            $ayah = Ayah::with('surah')->where('is_active', true)->first();
            $surah = $ayah?->surah;
        }

        $surahNameBn = $surah?->meta['name_bn'] ?? $surah?->name_en ?? 'সূরা';

        return [
            'id' => $ayah?->id,
            'date' => $date->format('Y-m-d'),
            'surah_number' => $surah?->number,
            'surah_name' => $surahNameBn,
            'surah_name_ar' => $surah?->name_ar,
            'surah_slug' => $surah?->slug,
            'ayah_number' => $ayah?->number,
            'text_ar' => $ayah?->text_ar,
            'text_bn' => $ayah?->text_bn,
            'reference' => "সূরা {$surahNameBn}, {$surah?->number}:{$ayah?->number}",
            'deep_link' => "/surah/{$surah?->slug}?ayah={$ayah?->number}",
        ];
    }
}
