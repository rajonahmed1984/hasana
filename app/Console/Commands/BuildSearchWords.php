<?php

namespace App\Console\Commands;

use App\Services\Banglish;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

/**
 * (Re)builds the `search_words` table used to understand Banglish searches on the "জানুন" page.
 * Run it after importing or editing a lot of content: php artisan search:build-words
 */
class BuildSearchWords extends Command
{
    protected $signature = 'search:build-words';

    protected $description = 'Index the Bangla words of ayahs, hadiths and duas for Banglish search';

    public function handle(): int
    {
        $freq = [];
        $count = function (?string $text) use (&$freq) {
            if (! $text) {
                return;
            }
            // Bangla letters and signs, without the Bangla digits / punctuation (০-৯, ।)
            preg_match_all('/[\x{0980}-\x{09E5}\x{09F0}-\x{09FF}]+/u', Banglish::nfc($text), $m);
            foreach ($m[0] as $word) {
                if (mb_strlen($word) >= 2 && mb_strlen($word) <= 30) {
                    $freq[$word] = ($freq[$word] ?? 0) + 1;
                }
            }
        };

        $sources = [
            'ayahs' => ['text_bn'],
            'hadiths' => ['text_bn'],
            'duas' => ['title', 'text_bn'],
            'hadith_categories' => ['name'],
            'dua_categories' => ['name'],
        ];
        foreach ($sources as $table => $columns) {
            $this->info("Reading {$table}...");
            DB::table($table)->select(['id', ...$columns])->orderBy('id')->chunk(1000, function ($rows) use ($columns, $count) {
                foreach ($rows as $row) {
                    foreach ($columns as $column) {
                        $count($row->{$column});
                    }
                }
            });
        }

        $rows = [];
        foreach ($freq as $word => $n) {
            $roman = Banglish::romanize($word);
            $skeleton = Banglish::skeleton($roman);
            if ($roman === '' || $skeleton === '') {
                continue;
            }
            $rows[] = [
                'word' => $word,
                'roman' => substr($roman, 0, 96),
                'skeleton' => substr($skeleton, 0, 48),
                'freq' => $n,
            ];
        }

        DB::transaction(function () use ($rows) {
            DB::table('search_words')->delete();
            foreach (array_chunk($rows, 1000) as $chunk) {
                // The collation can treat two spellings as equal; keep the first
                DB::table('search_words')->insertOrIgnore($chunk);
            }
        });

        $this->info('Indexed ' . count($rows) . ' words.');

        return self::SUCCESS;
    }
}
