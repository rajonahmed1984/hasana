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
        Schema::create('discounts', function (Blueprint $table) {
            $table->id();

            $table->string('title')->nullable();
            $table->string('type',50)->nullable();
            $table->decimal('amount',12,2)->nullable()->default(0);
            $table->date('start')->nullable();
            $table->date('end')->nullable();
            $table->tinyInteger('status')->nullable()->default(1);
            $table->tinyInteger('is_new')->nullable()->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('discounts');
    }
};
