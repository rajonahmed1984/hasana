<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AyahSeeder extends Seeder
{
    /**
     * Seed all 6,236 Ayahs with Arabic and Bengali translation.
     */
    public function run(): void
    {
        $sqlPath = database_path('seeders/ayahs_all.sql');
        if (file_exists($sqlPath)) {
            DB::unprepared(file_get_contents($sqlPath));
        }
    }
}
