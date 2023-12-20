<?php

namespace Database\Seeders;

use App\Enums\DistanceMetric;
use App\Models\Country;
use App\Models\Currency;
use Illuminate\Database\Seeder;

class CountrySeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Country::updateOrCreate([
            'name' => 'Lebanon',
            'iso_short_code' => 'LB',
        ], [
            'allowed_to_operate' => true,
            'distance_metric' => DistanceMetric::KILOMETRES->name,
            'currency_id' => Currency::query()->where('iso_short_code', 'LBP')->first()->id ?? Currency::factory()->create()->id,
        ]);

        Country::updateOrCreate([
            'name' => 'Palestine',
            'iso_short_code' => 'PS',
        ], [
            'allowed_to_operate' => true,
            'distance_metric' => DistanceMetric::KILOMETRES->name,
            'currency_id' => Currency::query()->where('iso_short_code', 'USD')->first()->id ?? Currency::factory()->create()->id,
        ]);
    }
}
