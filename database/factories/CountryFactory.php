<?php

namespace Database\Factories;

use App\Enums\DistanceMetric;
use App\Models\Currency;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Country>
 */
class CountryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'iso_short_code' => $this->faker->unique()->countryCode,
            'flag' => 'default.svg',
            'allowed_to_operate' => true,
            'distance_metric' => DistanceMetric::KILOMETRES->name,
            'currency_id' => Currency::first()->id ?? Currency::factory()->create()->id,
        ];
    }
}
