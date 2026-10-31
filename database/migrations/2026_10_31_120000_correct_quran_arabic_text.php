<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

/**
 * Replaces ayah Arabic that differs from the official King Fahd Complex (KFGQPC) Hafs text:
 * stray tatweels ("يَـٰٓأَيُّهَا") plus the wrong marks in 2:72 and 11:41.
 * The corrections are keyed "surah number:ayah number".
 */
return new class extends Migration
{
    public function up(): void
    {
        $corrections = json_decode(file_get_contents(database_path('data/ayah_text_ar_corrections.json')), true);
        $surahIds = DB::table('surahs')->pluck('id', 'number');

        DB::transaction(function () use ($corrections, $surahIds) {
            foreach ($corrections as $key => $text) {
                [$surah, $ayah] = explode(':', $key);

                DB::table('ayahs')
                    ->where('surah_id', $surahIds[(int) $surah] ?? 0)
                    ->where('number', (int) $ayah)
                    ->update(['text_ar' => $text]);
            }
        });

        Cache::forget('offline-pack:quran');
    }

    public function down(): void
    {
        // The previous text was incorrect, so there is nothing to restore
    }
};
