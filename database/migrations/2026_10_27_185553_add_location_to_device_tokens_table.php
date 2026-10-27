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
        Schema::table('device_tokens', function (Blueprint $table) {
            $table->decimal('latitude', 10, 7)->nullable()->after('ip_address');
            $table->decimal('longitude', 10, 7)->nullable()->after('latitude');
            $table->string('city_name', 150)->nullable()->after('longitude');
            $table->string('timezone', 50)->nullable()->after('city_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('device_tokens', function (Blueprint $table) {
            $table->dropColumn(['latitude', 'longitude', 'city_name', 'timezone']);
        });
    }
};
