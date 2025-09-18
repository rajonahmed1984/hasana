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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_no')->nullable();
            $table->bigInteger('contact_id')->nullable();
            $table->smallInteger('user_id')->nullable();
            $table->smallInteger('location_id')->nullable();
            $table->string('type',30)->nullable();
            $table->string('shipping_status',40)->nullable()->default('ordered');
            $table->string('payment_status',40)->nullable()->default('due');
            $table->string('discount_type',30)->nullable();
            $table->decimal('final_amount',12,2)->nullable()->default(0);
            $table->decimal('discount_amount',12,2)->nullable()->default(0);
            $table->decimal('shipping_charge',12,2)->nullable()->default(0);
            $table->text('note')->nullable();
            $table->dateTime('transaction_date')->nullable();
            $table->tinyInteger('is_new')->nullable()->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
