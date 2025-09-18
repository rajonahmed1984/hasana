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
        Schema::create('transaction_payments', function (Blueprint $table) {
            $table->id();
            $table->string('method',50)->nullable();
            $table->bigInteger('transaction_id')->nullable();
            $table->smallInteger('user_id')->nullable();
            $table->smallInteger('account_id')->nullable();
            $table->decimal('amount',12,2)->nullable()->default(0);
            $table->text('note')->nullable();
            $table->dateTime('paid_on')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaction_payments');
    }
};
