<?php

namespace Database\Seeders;

use App\Enums\UserType;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::updateOrCreate([
            'username' => 'super_admin',
        ], [
            'first_name' => 'Super',
            'last_name' => 'Admin',
            'email' => 'super_admin@sports-manager.com',
            'password' => Hash::make('P@ssw0rd'),
            'type' => UserType::ADMIN->name,
        ]);
    }
}
