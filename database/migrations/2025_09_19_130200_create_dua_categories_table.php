<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dua_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });

        Schema::table('duas', function (Blueprint $table) {
            $table->foreignId('dua_category_id')
                ->nullable()
                ->after('id')
                ->constrained('dua_categories')
                ->nullOnDelete();

            $table->unsignedInteger('sort_order')
                ->default(0)
                ->after('reference');
        });
    }

    public function down(): void
    {
        Schema::table('duas', function (Blueprint $table) {
            $table->dropForeign(['dua_category_id']);
            $table->dropColumn(['dua_category_id', 'sort_order']);
        });

        Schema::dropIfExists('dua_categories');
    }
};
