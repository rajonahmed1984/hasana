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
        Schema::table('hadiths', function (Blueprint $table) {
            $table->mediumText('text_ar')->nullable()->change();
            $table->mediumText('text_bn')->nullable()->change();
            $table->text('reference')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hadiths', function (Blueprint $table) {
            $table->text('text_ar')->nullable()->change();
            $table->text('text_bn')->nullable()->change();
            $table->string('reference')->nullable()->change();
        });
    }
};
