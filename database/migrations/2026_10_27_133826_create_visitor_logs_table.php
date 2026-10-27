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
        Schema::create('visitor_logs', function (Blueprint $table) {
            $table->id();
            $table->string('session_id', 64)->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->string('device_type', 20)->default('mobile');
            $table->string('browser', 50)->default('Chrome');
            $table->string('platform', 50)->default('Android');
            $table->string('path', 255);
            $table->string('page_type', 30)->default('other')->index();
            $table->string('item_id', 50)->nullable()->index();
            $table->string('item_name', 255)->nullable();
            $table->unsignedInteger('duration_seconds')->default(10);
            $table->timestamp('visited_at')->useCurrent()->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visitor_logs');
    }
};
