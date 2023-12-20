<?php

namespace Database\Seeders;

use App\Models\Currency;
use Illuminate\Database\Seeder;

class CurrencySeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Currency::updateOrCreate([
            'name' => 'Lebanese Lira',
            'iso_short_code' => 'LBP',
        ], [
            'is_enabled' => true,
        ]);

        Currency::updateOrCreate([
            'name' => 'US Dollar',
            'iso_short_code' => 'USD',
        ], [
            'is_enabled' => true,
        ]);
    }
}
