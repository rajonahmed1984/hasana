<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // Bangla words of the Quran / Hadith / Dua texts with their Banglish spelling (see App\Services\Banglish)
    public function up(): void
    {
        Schema::create('search_words', function (Blueprint $table) {
            $table->id();
            $table->string('word', 64)->unique();
            $table->string('roman', 96);
            $table->string('skeleton', 48)->index();
            $table->unsignedInteger('freq')->default(0);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('search_words');
    }
};
