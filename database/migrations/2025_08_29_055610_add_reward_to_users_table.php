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
        Schema::table('transactions', function (Blueprint $table) {
            $table->decimal('sub_total', 8,2)->nullable()->default(0);
            $table->decimal('reward_point', 8,2)->nullable()->default(0);
            $table->decimal('redeem_amount', 8,2)->nullable()->default(0);
            $table->decimal('reddem_point', 8,2)->nullable()->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn(['sub_total','reward_point','reddem_point','redeem_amount']);
        });
    }
};
