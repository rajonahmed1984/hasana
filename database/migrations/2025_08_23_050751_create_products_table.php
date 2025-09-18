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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('image')->nullable();
            $table->string('slug')->nullable();
            $table->string('sku',100)->nullable();
            $table->string('type',50)->nullable();
            $table->text('description')->nullable();
            $table->decimal('stock_alert',4,2)->nullable()->default(1);
            $table->smallInteger('brand_id')->nullable();
            $table->smallInteger('unit_id')->nullable();
            $table->smallInteger('category_id')->nullable();
            $table->smallInteger('sub_category_id')->nullable();
            
            $table->tinyInteger('status')->nullable()->default(1);
            $table->tinyInteger('is_feature')->nullable()->default(0);
            $table->tinyInteger('is_new')->nullable()->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
