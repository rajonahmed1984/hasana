<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

/**
 * Understands Banglish (Bangla typed in Latin letters, e.g. "hotasa" → হতাশা) without any AI.
 *
 * Every Bangla word in our texts is stored once in `search_words` with a rough Latin spelling
 * ("roman") and its consonant skeleton (hotasa → "hts"); see `php artisan search:build-words`.
 * A Banglish word is normalised the same way, candidates with the same skeleton are looked up,
 * and the closest spelling (edit distance, then how common the word is) wins.
 */
class Banglish
{
    private const CONSONANTS = [
        'ক' => 'k', 'খ' => 'k', 'গ' => 'g', 'ঘ' => 'g', 'ঙ' => 'n', 'চ' => 'c', 'ছ' => 'c', 'জ' => 'j', 'ঝ' => 'j',
        'ঞ' => 'n', 'ট' => 't', 'ঠ' => 't', 'ড' => 'd', 'ঢ' => 'd', 'ণ' => 'n', 'ত' => 't', 'থ' => 't', 'দ' => 'd',
        'ধ' => 'd', 'ন' => 'n', 'প' => 'p', 'ফ' => 'f', 'ব' => 'b', 'ভ' => 'b', 'ম' => 'm', 'য' => 'j', 'র' => 'r',
        'ল' => 'l', 'শ' => 's', 'ষ' => 's', 'স' => 's', 'হ' => 'h', 'ড়' => 'r', 'ঢ়' => 'r', 'য়' => 'i', 'ৎ' => 't',
    ];

    private const VOWELS = [
        'অ' => 'o', 'আ' => 'a', 'ই' => 'i', 'ঈ' => 'i', 'উ' => 'u', 'ঊ' => 'u', 'ঋ' => 'ri', 'এ' => 'e', 'ঐ' => 'oi',
        'ও' => 'o', 'ঔ' => 'ou',
    ];

    private const KARS = [
        'া' => 'a', 'ি' => 'i', 'ী' => 'i', 'ু' => 'u', 'ূ' => 'u', 'ৃ' => 'ri', 'ে' => 'e', 'ৈ' => 'oi', 'ো' => 'o', 'ৌ' => 'ou',
    ];

    private const HASANTA = '্';
    private const NUKTA = '়';

    /** Rough Latin spelling of a Bangla word, already normalised like normalizeLatin(). */
    public static function romanize(string $word): string
    {
        $chars = mb_str_split($word);
        $count = count($chars);
        $out = '';

        for ($i = 0; $i < $count; $i++) {
            $ch = $chars[$i];
            $next = $chars[$i + 1] ?? null;

            // ড় / ঢ় / য় may be written as base letter + nukta
            if ($next === self::NUKTA && in_array($ch, ['ড', 'ঢ', 'য'], true)) {
                $ch = ['ড' => 'ড়', 'ঢ' => 'ঢ়', 'য' => 'য়'][$ch];
                array_splice($chars, $i + 1, 1);
                $count--;
                $next = $chars[$i + 1] ?? null;
            }

            if (isset(self::VOWELS[$ch])) {
                $out .= self::VOWELS[$ch];
            } elseif (isset(self::KARS[$ch])) {
                $out .= self::KARS[$ch];
            } elseif ($ch === 'ং') {
                $out .= 'n';
            } elseif (isset(self::CONSONANTS[$ch])) {
                $out .= self::CONSONANTS[$ch];

                if ($next === self::HASANTA) {
                    $after = $chars[$i + 2] ?? null;
                    // Phala forms: য-ফলা and ব-ফলা are mostly silent, except র্য ("rj", as in ধৈর্য)
                    // and ক্ষ, which is read "kh"
                    if ($after === 'য' && $ch !== 'র' || $after === 'ব' || $ch === 'ক' && $after === 'ষ') {
                        $i += 2;
                        $next = $chars[$i + 1] ?? null;
                    } elseif ($ch === 'জ' && $after === 'ঞ') {
                        // জ্ঞ is read "gg" / "gy" (জ্ঞান → "gan")
                        $out = substr($out, 0, -1) . 'g';
                        $i += 2;
                        $next = $chars[$i + 1] ?? null;
                    } else {
                        $i++;
                        continue;
                    }
                }

                // Inherent vowel, except at the end of the word
                $isLast = $next === null;
                $takesVowel = ! $isLast && ! isset(self::KARS[$next]) && $next !== self::HASANTA && $ch !== 'য়';
                if ($takesVowel) {
                    $out .= 'o';
                }
            }
            // Anything else (ঁ, ঃ, digits, marks) is ignored
        }

        return self::collapse($out);
    }

    /** Lower-case Latin text with the usual Banglish spelling variants folded together. */
    public static function normalizeLatin(string $text): string
    {
        $text = strtolower($text);
        $text = strtr($text, [
            'ksh' => 'k', 'gy' => 'g', 'chh' => 'c', 'ch' => 'c', 'kh' => 'k', 'gh' => 'g', 'jh' => 'j', 'th' => 't', 'dh' => 'd',
            'ph' => 'f', 'bh' => 'b', 'sh' => 's', 'rh' => 'r', 'ng' => 'n', 'ee' => 'i', 'oo' => 'u',
        ]);
        $text = strtr($text, ['q' => 'k', 'z' => 'j', 'x' => 'ks', 'v' => 'b', 'w' => 'o', 'y' => 'i']);

        return self::collapse(preg_replace('/[^a-z]/', '', $text));
    }

    public static function skeleton(string $normalized): string
    {
        return preg_replace('/[aeiou]/', '', $normalized);
    }

    public static function isLatin(string $token): bool
    {
        return (bool) preg_match('/^[a-z\']+$/i', $token);
    }

    /**
     * Bangla word for one Banglish word, or null when nothing is close enough.
     */
    public static function toBangla(string $token): ?string
    {
        $normalized = self::normalizeLatin($token);
        $skeleton = self::skeleton($normalized);
        if (strlen($normalized) < 3 || $skeleton === '') {
            return null;
        }

        // One-consonant words ("bie" → বিয়ে) are too ambiguous for anything but an exact spelling
        $maxDistance = strlen($skeleton) < 2 ? 0 : (strlen($normalized) <= 4 ? 1 : 2);

        $best = null;
        foreach (DB::table('search_words')->where('skeleton', $skeleton)->orderByDesc('freq')->limit(300)->get(['word', 'roman', 'freq']) as $row) {
            $distance = levenshtein($normalized, $row->roman);
            if ($distance > $maxDistance) {
                continue;
            }
            if (! $best || $distance < $best[1] || ($distance === $best[1] && $row->freq > $best[2])) {
                $best = [$row->word, $distance, $row->freq];
            }
        }

        return $best[0] ?? null;
    }

    /** Canonical form: য় / ড় / ঢ় become letter + nukta (Unicode NFC). */
    public static function nfc(string $text): string
    {
        return \Normalizer::normalize($text, \Normalizer::FORM_C) ?: $text;
    }

    /** The single-code-point spelling of য় / ড় / ঢ় (also used in our texts). */
    public static function composed(string $text): string
    {
        return strtr($text, ["\u{09AF}\u{09BC}" => "\u{09DF}", "\u{09A1}\u{09BC}" => "\u{09DC}", "\u{09A2}\u{09BC}" => "\u{09DD}"]);
    }

    private static function collapse(string $s): string
    {
        // "allah" / আল্লাহ → "alah": doubled letters are spelled inconsistently
        return preg_replace('/(.)\1+/', '$1', $s);
    }
}
