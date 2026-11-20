<?php

namespace App\Services;

use Anthropic\Client;
use Anthropic\Core\Exceptions\APIException;
use Anthropic\RequestOptions;
use Illuminate\Support\Facades\Log;

/**
 * Claude-powered helpers for "জানুন" (Explore).
 *
 * The AI never writes religious content shown to the user. It only:
 *  - understand(): reads the user's question (Bangla, Banglish, English, with typos) and returns
 *    search keywords, matching topics and follow-up questions;
 *  - rank(): orders the ayahs / hadiths / duas our own search found by relevance and drops unrelated ones.
 * Everything displayed still comes from the verified texts in the database.
 *
 * Disabled (returns null) when the SDK is not installed or no API key is set; callers then use
 * the plain keyword search.
 */
class ExploreAI
{
    public static function enabled(): bool
    {
        return class_exists(Client::class) && filled(config('services.anthropic.key'));
    }

    /**
     * @param  string[]  $topicKeys  known topic keys => labels, so the model can pick from them
     * @return array{understood:string, corrected_query:string, keywords:string[], topics:string[], focus:string, is_fiqh:bool, related:string[]}|null
     */
    public static function understand(string $query, array $topicLabels): ?array
    {
        $topicList = collect($topicLabels)->map(fn ($label, $key) => "{$key}: {$label}")->implode("\n");

        $system = <<<PROMPT
You help a Bangla Islamic app search its own collection of Quran translations, hadiths and duas (all in Bangla).
Users type questions in Bangla, Banglish (Bangla in Latin letters, often misspelled) or English.

Read the question and return:
- understood: one short, warm Bangla sentence saying what the user wants, starting with "আপনি জানতে চাইছেন".
- corrected_query: the question rewritten as clean, correctly spelled Bangla.
- keywords: 4 to 10 Bangla words or short word stems that are likely to literally appear in Bangla translations of
  relevant ayahs, hadiths or duas (e.g. for "mon kharap" → "দুশ্চিন্তা", "দুঃখ", "প্রশান্তি", "অন্তর"). Prefer the
  formal words used in translations. Single words, no sentences.
- topics: keys from the topic list below that clearly match (may be empty).
- focus: "dua" if the user asks for a dua, "hadith" for a hadith, "ayah" for the Quran, otherwise "any".
- is_fiqh: true if it asks for a ruling (halal/haram, how-to of worship, permissibility), else false.
- related: 3 short follow-up questions in Bangla the user may want to search next.

Do not answer the question itself and do not state any religious ruling.

Topic list:
{$topicList}
PROMPT;

        $data = self::call($system, "প্রশ্ন: {$query}", [
            'type' => 'object',
            'properties' => [
                'understood' => ['type' => 'string'],
                'corrected_query' => ['type' => 'string'],
                'keywords' => ['type' => 'array', 'items' => ['type' => 'string']],
                'topics' => ['type' => 'array', 'items' => ['type' => 'string', 'enum' => array_keys($topicLabels)]],
                'focus' => ['type' => 'string', 'enum' => ['ayah', 'hadith', 'dua', 'any']],
                'is_fiqh' => ['type' => 'boolean'],
                'related' => ['type' => 'array', 'items' => ['type' => 'string']],
            ],
            'required' => ['understood', 'corrected_query', 'keywords', 'topics', 'focus', 'is_fiqh', 'related'],
            'additionalProperties' => false,
        ], 1500);

        if (! $data) {
            return null;
        }

        $clean = fn ($list, $max) => array_slice(array_values(array_filter(array_map(
            fn ($s) => trim((string) $s),
            (array) $list
        ))), 0, $max);

        return [
            'understood' => trim((string) $data['understood']),
            'corrected_query' => trim((string) $data['corrected_query']),
            'keywords' => $clean($data['keywords'], 10),
            'topics' => $clean($data['topics'], 4),
            'focus' => $data['focus'] === 'any' ? null : $data['focus'],
            'is_fiqh' => (bool) $data['is_fiqh'],
            'related' => $clean($data['related'], 3),
        ];
    }

    /**
     * Order candidate results by relevance to the question.
     *
     * @param  array<string, array<int, string>>  $candidates  ['ayah' => [id => snippet], 'hadith' => [...], 'dua' => [...]]
     * @return array{ayah:int[], hadith:int[], dua:int[]}|null  ids, most relevant first; unrelated ones left out
     */
    public static function rank(string $query, string $understood, array $candidates): ?array
    {
        $lines = [];
        foreach ($candidates as $kind => $items) {
            foreach ($items as $id => $snippet) {
                $lines[] = "[{$kind} {$id}] " . mb_substr(preg_replace('/\s+/u', ' ', $snippet), 0, 260);
            }
        }
        if (! $lines) {
            return null;
        }

        $system = <<<'PROMPT'
You rank search results for a Bangla Islamic app. You get the user's question and numbered candidate texts
(Quran ayah translations, hadiths, duas). For each kind, return the ids of the candidates that genuinely help with
the question, most relevant first. Leave out candidates that only share a word but are about something else.
Use only ids from the list.
PROMPT;

        $user = "প্রশ্ন: {$query}\nঅর্থ: {$understood}\n\nCandidates:\n" . implode("\n", $lines);

        $data = self::call($system, $user, [
            'type' => 'object',
            'properties' => [
                'ayah' => ['type' => 'array', 'items' => ['type' => 'integer']],
                'hadith' => ['type' => 'array', 'items' => ['type' => 'integer']],
                'dua' => ['type' => 'array', 'items' => ['type' => 'integer']],
            ],
            'required' => ['ayah', 'hadith', 'dua'],
            'additionalProperties' => false,
        ], 1500);

        if (! $data) {
            return null;
        }

        // Keep only ids we actually sent
        $out = [];
        foreach (['ayah', 'hadith', 'dua'] as $kind) {
            $allowed = array_keys($candidates[$kind] ?? []);
            $out[$kind] = array_values(array_unique(array_filter(
                array_map('intval', (array) ($data[$kind] ?? [])),
                fn ($id) => in_array($id, $allowed, true)
            )));
        }

        return $out;
    }

    /**
     * One structured-output request. Returns the decoded JSON, or null on any failure.
     */
    private static function call(string $system, string $user, array $schema, int $maxTokens): ?array
    {
        if (! self::enabled()) {
            return null;
        }

        try {
            $client = new Client(
                apiKey: config('services.anthropic.key'),
                // A search request should fail fast to the keyword fallback instead of waiting on retries
                requestOptions: RequestOptions::with(maxRetries: 1),
            );

            $message = $client->messages->create(
                model: config('services.anthropic.model'),
                maxTokens: $maxTokens,
                system: $system,
                messages: [['role' => 'user', 'content' => $user]],
                outputConfig: [
                    'effort' => 'low',
                    'format' => ['type' => 'json_schema', 'schema' => $schema],
                ],
            );

            if ($message->stopReason !== 'end_turn') {
                Log::info('ExploreAI: no usable answer', ['stop_reason' => $message->stopReason]);
                return null;
            }

            foreach ($message->content as $block) {
                if ($block->type === 'text') {
                    $data = json_decode($block->text, true);
                    return is_array($data) ? $data : null;
                }
            }
        } catch (APIException $e) {
            Log::warning('ExploreAI: API error', ['message' => $e->getMessage()]);
        } catch (\Throwable $e) {
            Log::warning('ExploreAI: failed', ['message' => $e->getMessage()]);
        }

        return null;
    }
}
