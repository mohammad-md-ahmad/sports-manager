<?php

namespace Database\Factories;

use App\Enums\UserType;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CompanyCustomer>
 */
class CompanyCustomerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'company_id' => User::query()->where('type', UserType::COMPANY_USER->name)->frist()->id ?? User::factory()->create()->id,
            'user_id' => User::query()->where('type', UserType::CUSTOMER_USER->name)->frist()->id ?? User::factory()->create()->id,
        ];
    }
}
