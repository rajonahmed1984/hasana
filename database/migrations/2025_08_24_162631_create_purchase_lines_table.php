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
        Schema::create('purchase_lines', function (Blueprint $table) {
            $table->id();

            $table->bigInteger('transaction_id');
            $table->bigInteger('product_id');
            $table->bigInteger('variation_id')->nullable();
            $table->string('batch_no')->nullable();
            $table->decimal('quantity', 4,2)->nullable()->default(0);
            $table->decimal('unit_price', 8,2)->nullable()->default(0);
            $table->decimal('sell_price', 8,2)->nullable()->default(0);
            $table->date('expire_date')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_lines');
    }
};
