<?php

namespace Database\Factories;

use App\Models\Country;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Address>
 */
class AddressFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'line_1' => $this->faker->streetAddress,
            'city' => $this->faker->city,
            'region' => $this->faker->state,
            'postcode' => $this->faker->postcode,
            'country_id' => Country::first()->id ?? Country::factory()->create()->id,
        ];
    }
}
