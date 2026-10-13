<?php

namespace Database\Seeders;

use App\Enums\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => env('SEED_ADMIN_EMAIL', 'admin@example.com')],
            [
                'name' => env('SEED_ADMIN_NAME', 'Super Admin'),
                'password' => env('SEED_ADMIN_PASSWORD', 'password123'),
                'role' => Role::SuperAdmin,
                'is_active' => true,
            ],
        );
    }
}
