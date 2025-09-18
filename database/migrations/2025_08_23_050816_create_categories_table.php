<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->smallInteger('parent_id')->nullable();
            $table->string('image')->nullable();
            $table->string('slug')->nullable();
            $table->tinyInteger('status')->nullable()->default(1);
            $table->tinyInteger('is_top')->nullable()->default(0);
            $table->tinyInteger('is_new')->nullable()->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
