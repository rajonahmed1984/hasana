<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Fills hadiths whose Bangla was empty, from ihadis.com pages whose Arabic was matched against ours.
 * That text is not the Islamic Foundation's, so the reference names where it came from.
 * Keyed by hadith id; the number guards against an id that holds another hadith on this database.
 */
return new class extends Migration
{
    private const SOURCE_NOTE = ' | অনুবাদ সূত্র: ihadis.com';

    public function up(): void
    {
        foreach ($this->translations() as $id => $hadith) {
            DB::table('hadiths')
                ->where('id', $id)
                ->where('reference', 'like', "%হাদিস নং {$hadith['number']},%")
                ->where(fn ($q) => $q->whereNull('text_bn')->orWhere('text_bn', ''))
                ->update([
                    'text_bn' => $hadith['text_bn'],
                    'reference' => DB::raw('CONCAT(reference, '.DB::getPdo()->quote(self::SOURCE_NOTE).')'),
                ]);
        }
    }

    public function down(): void
    {
        foreach ($this->translations() as $id => $hadith) {
            DB::table('hadiths')
                ->where('id', $id)
                ->where('text_bn', $hadith['text_bn'])
                ->update([
                    'text_bn' => '',
                    'reference' => DB::raw('REPLACE(reference, '.DB::getPdo()->quote(self::SOURCE_NOTE).', \'\')'),
                ]);
        }
    }

    private function translations(): array
    {
        return json_decode(file_get_contents(database_path('data/hadith_missing_translations.json')), true);
    }
};
