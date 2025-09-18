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
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('contact_id')->nullable();
            $table->string('image')->nullable();
            $table->string('type',30)->nullable();
            $table->string('mobile',30)->nullable();
            $table->string('email',100)->nullable();
            $table->text('address')->nullable();
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
        Schema::dropIfExists('contacts');
    }
};
