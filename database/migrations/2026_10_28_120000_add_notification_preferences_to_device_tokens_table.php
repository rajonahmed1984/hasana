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
            $table->boolean('prayer_enabled')->default(false)->after('timezone');
            $table->boolean('ayah_enabled')->default(false)->after('prayer_enabled');
            $table->json('prayer_prefs')->nullable()->after('ayah_enabled');
            // Last local date each notification was sent, e.g. {"fajr":"2026-10-28","ayah":"2026-10-28"}
            $table->json('last_notified')->nullable()->after('prayer_prefs');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('device_tokens', function (Blueprint $table) {
            $table->dropColumn(['prayer_enabled', 'ayah_enabled', 'prayer_prefs', 'last_notified']);
        });
    }
};
