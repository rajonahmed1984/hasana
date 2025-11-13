<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Keep the default demo account
        User::updateOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
            ]
        );

        // Primary admin account requested by client
        User::updateOrCreate(
            ['email' => 'project@rdnetworkbd.com'],
            [
                'name' => 'Project Admin',
                'password' => Hash::make('12345678'),
            ]
        );
    }
}
