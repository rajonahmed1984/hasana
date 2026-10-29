<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Repairs Bangla text that renders broken (a lone vowel sign / ঃ shown with a dotted circle ◌):
 * - leftovers of "&#NNNN;" entities and lost reph / ে-kar from the original font conversion (fixed per ayah)
 * - "ঃ" separated from its word ("বলেন ঃ") or after a bracket / comma, and "(…)ের" in hadiths
 * - a Devanagari "सह" typed into one dua reference
 */
return new class extends Migration
{
    // ayah id => [broken text (regex) => correct text]
    private const AYAH_FIXES = [
        185 => ['/\(\x{2212}/u' => '('],
        300 => ['/\(আল্লাহর কিতাবের অপ\x{2212}\) ব্যাখ্যা/u' => '(আল্লাহর কিতাবের) অপব্যাখ্যা'],
        779 => ['/জ্ঞান-ি -বিজ্ঞান/u' => 'জ্ঞান-বিজ্ঞান'],
        1263 => ['/দারিদ্রে\?480;/u' => 'দারিদ্র্যের'],
        1321 => ['/সামর্থ\?476;ান/u' => 'সামর্থ্যবান'],
        1447 => ['/কর্ত\x{A9A3}2499;ত্বের/u' => 'কর্তৃত্বের'],
        1513 => ['/পূর্বহে\x{07E6}#2439;/u' => 'পূর্বেই'],
        1552 => ['/বলল ু তুমি/u' => 'বলল, তুমি'],
        1672 => ['/কিু\x{6826}#2438;ল্লাহ/u' => 'কিন্তু আল্লাহ'],
        1711 => ['/খজ্জ\x{A9A3}2497;র/u' => 'খর্জুর'],
        1906 => ['/আহার্যে\?2474;রিণত/u' => 'আহার্যে পরিণত'],
        1908 => ['/পরিশ্র\x{06E6}#2478;/u' => 'পরিশ্রম'],
        1945 => ['/নি\x{A9A3}2503;দশাবলী/u' => 'নির্দেশাবলী'],
        2088 => ['/কতৃ\x{A9A3}2453;/u' => 'কর্তৃক'],
        2140 => ['/মাহাত্ন\?2476;র্ণনা/u' => 'মাহাত্ম্য বর্ণনা'],
        2235 => ['/সামর্থ\?2470;/u' => 'সামর্থ্য দ'], // …দিয়েছেন
        2407 => ['/পূর্বাহে\x{07E0}/u' => 'পূর্বাহ্নে '],
        2444 => ['/পদচিহে\x{07E6}#2480;/u' => 'পদচিহ্নের'],
        2598 => ['/সম্প\x{A9A3}2503;ক/u' => 'সম্পর্কে'],
        2636 => ['/সামর্থ\?2470;ান/u' => 'সামর্থ্য দান'],
        2741 => ['/সম্প\x{A9A3}2503;ক/u' => 'সম্পর্কে'],
        2744 => ['/মধ্যবর্ত\x{A9A3}2496;/u' => 'মধ্যবর্তী'],
        2761 => ['/কতৃর্\x{A9A3}2468;্ব/u' => 'কর্তৃত্ব'],
        2846 => ['/শাসনকতৃ\x{A9A3}2468;্ব/u' => 'শাসনকর্তৃত্ব'],
        2851 => ['/\?2474;্রকাশ/u' => ' প্রকাশ'], // সৌন্দর্য প্রকাশ
        3143 => ['/সামর্থ\?451;/u' => 'সামর্থ্যও'],
        3178 => ['/সামর্থ\?2470;াও/u' => 'সামর্থ্য দাও'],
        3223 => ['/মর্ত\?2469;েকে/u' => 'মর্ত্য থেকে'],
        3292 => ['/সমু\x{02E6}#2503;দ্র/u' => 'সমুদ্রে'],
        3298 => ['/পূ\x{A9A3}2503;ব/u' => 'পূর্বে'],
        3323 => ['/কর্ণ\x{A9A3}2474;াত/u' => 'কর্ণপাত'],
        3427 => ['/অপরাহে\x{07E0}ও মধ্যাহে\x{07E6}#2404;/u' => 'অপরাহ্নে ও মধ্যাহ্নে।'],
        3823 => ['/উপাস্য েনই/u' => 'উপাস্য নেই'],
        4136 => ['/সামর্থ\?476;ান/u' => 'সামর্থ্যবান'],
        4525 => ['/সামর্থে\?480;/u' => 'সামর্থ্যের'],
        4549 => ['/তা\x{02E6}#2503;দরকে/u' => 'তাদেরকে'],
        4709 => ['/চিহি\x{07E6}#2468;/u' => 'চিহ্নিত'],
        4783 => ['/পালনকর্ত\x{A9A3}2494;র/u' => 'পালনকর্তার'],
        5149 => ['/মাহাত্ন\?486;ীল/u' => 'মাহাত্ম্যশীল'],
        5223 => ['/সামর্থ\?2437;/u' => 'সামর্থ্য অ'], // …নুযায়ী
        5232 => ['/বললেন,ঃ/u' => 'বললেন,'],
    ];

    private const HADITH_FIXES = [
        6977 => ['/বি\x{00AA}্রক করতে/u' => 'বিক্রয় করতে'],
        // A glossary "(…)" was inserted in the middle of these words
        5034 => ['/মাসহ\(মাসেহ\)্ কর/u' => 'মাসহ (মাসেহ) কর'],
        5371 => ['/ত্বলাক \(তালাক\)্ব দে/u' => 'ত্বলাক্ব (তালাক) দে'],
        8724 => ['/"মাসহ\(মাসেহ\)াফ"/u' => '"মাসহাফ"'],
        11264 => ['/ত্বলাক \(তালাক\)ে পরিণত/u' => 'ত্বলাকে (তালাকে) পরিণত'],
    ];

    public function up(): void
    {
        $this->applyFixes('ayahs', self::AYAH_FIXES);
        $this->applyFixes('hadiths', self::HADITH_FIXES);

        DB::table('hadiths')
            ->where(fn ($q) => $q->where('text_bn', 'like', '%ঃ%')->orWhere('text_bn', 'like', '%)ের%')->orWhere('text_bn', 'like', "%\u{00AD}%"))
            ->orderBy('id')
            ->chunkById(500, function ($rows) {
                foreach ($rows as $row) {
                    $fixed = $this->fixMarks($row->text_bn);
                    if ($fixed !== $row->text_bn) {
                        DB::table('hadiths')->where('id', $row->id)->update(['text_bn' => $fixed]);
                    }
                }
            });

        DB::table('duas')->where('reference', 'like', "%\u{0938}\u{0939}ীহ%")
            ->update(['reference' => DB::raw("REPLACE(reference, '\u{0938}\u{0939}ীহ', 'সহীহ')")]);
    }

    public function down(): void
    {
        // Data repair only; nothing to undo
    }

    private function applyFixes(string $table, array $fixes): void
    {
        foreach ($fixes as $id => $replacements) {
            $text = DB::table($table)->where('id', $id)->value('text_bn');
            if ($text === null) {
                continue;
            }
            $fixed = preg_replace(array_keys($replacements), array_values($replacements), $text);
            if ($fixed !== $text) {
                DB::table($table)->where('id', $id)->update(['text_bn' => $fixed]);
            }
        }
    }

    private function fixMarks(string $text): string
    {
        $letter = '\x{0981}-\x{09E3}\x{200C}\x{200D}'; // Bangla letters & signs (not digits / danda)

        return preg_replace([
            '/\x{00AD}/u',                    // invisible soft hyphens split "বলল­ঃ"
            "/([{$letter}])[ \\t]+ঃ/u",       // "বলেন ঃ" → "বলেনঃ"
            '/,\s*ঃ/u',                       // "যে,ঃ" → "যে,"
            '/-ঃ/u',                          // "প্রকাশনী-ঃ ১১৩৯" → "প্রকাশনী: ১১৩৯"
            "/(?<![{$letter}\\s])\\s*ঃ/u",    // "(…)ঃ", "৬৬ ঃ" → ":"
            '/([)\]])ের/u',                   // "(ইকামত/একামত)ের" → "(ইকামত/একামত)-এর"
        ], ['', '$1ঃ', ',', ':', ':', '$1-এর'], $text);
    }
};
