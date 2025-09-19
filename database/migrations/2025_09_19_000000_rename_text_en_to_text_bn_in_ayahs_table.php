<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('ayahs', 'text_en')) {
            Schema::table('ayahs', function (Blueprint $table) {
                $table->renameColumn('text_en', 'text_bn');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('ayahs', 'text_bn')) {
            Schema::table('ayahs', function (Blueprint $table) {
                $table->renameColumn('text_bn', 'text_en');
            });
        }
    }
};
