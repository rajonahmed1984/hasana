<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Hides hadiths with no text in any language; the source has these numbers empty too.
 * Rows stay in the table, so an admin can fill one in and turn it back on.
 */
return new class extends Migration
{
    public function up(): void
    {
        $this->blankHadiths()->where('is_active', true)->update(['is_active' => false]);
    }

    public function down(): void
    {
        $this->blankHadiths()->where('is_active', false)->update(['is_active' => true]);
    }

    private function blankHadiths()
    {
        return DB::table('hadiths')
            ->where(fn ($q) => $q->whereNull('text_bn')->orWhereRaw("TRIM(text_bn) = ''"))
            ->where(fn ($q) => $q->whereNull('text_ar')->orWhereRaw("TRIM(text_ar) = ''"));
    }
};
