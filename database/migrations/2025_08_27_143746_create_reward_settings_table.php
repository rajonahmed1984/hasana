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
        Schema::create('reward_settings', function (Blueprint $table) {
            $table->id();
            $table->decimal('amount_per_unit_rp', 8,2)->nullable()->default(0);
            $table->decimal('min_order_amount_rp', 4,2)->nullable()->default(0);
            $table->decimal('redeem_amount_per_unit_rp', 4,2)->nullable()->default(0);
            $table->decimal('min_order_total_for_redeem', 4,2)->nullable()->default(0);
            $table->tinyInteger('status')->nullable()->default(1);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reward_settings');
    }
};
