<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // Lets the "জানুন" search pick candidate rows from an index instead of scanning every text
    public function up(): void
    {
        if (! in_array(DB::getDriverName(), ['mysql', 'mariadb'], true)) {
            return;
        }

        Schema::table('ayahs', fn (Blueprint $table) => $table->fullText('text_bn'));
        Schema::table('hadiths', fn (Blueprint $table) => $table->fullText('text_bn'));
    }

    public function down(): void
    {
        if (! in_array(DB::getDriverName(), ['mysql', 'mariadb'], true)) {
            return;
        }

        Schema::table('ayahs', fn (Blueprint $table) => $table->dropFullText(['text_bn']));
        Schema::table('hadiths', fn (Blueprint $table) => $table->dropFullText(['text_bn']));
    }
};
