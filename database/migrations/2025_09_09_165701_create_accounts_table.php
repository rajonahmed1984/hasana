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
        Schema::create('accounts', function (Blueprint $table) {
            $table->id();

            $table->string('name')->nullable();
            $table->string('account_no')->nullable();
            $table->string('type',50)->nullable();
            $table->decimal('openning_balance', 12,2)->nullable()->default(0);
            $table->date('openning_balance_date')->nullable();
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
        Schema::dropIfExists('accounts');
    }
};
