<?php

namespace Database\Seeders;

use App\Enums\SubscriptionPlanType;
use App\Models\Currency;
use App\Models\SubscriptionPlan;
use Illuminate\Database\Seeder;

class SubscriptionPlanSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        SubscriptionPlan::updateOrCreate([
            'name' => 'standard',
        ], [
            'description' => 'The standard plan.',
            'type' => SubscriptionPlanType::Standard->name,
            'price' => '1000',
            'currency_id' => Currency::first()->id ?? null,
            'is_enabled' => true,
        ]);

        SubscriptionPlan::updateOrCreate([
            'name' => 'premium',
        ], [
            'description' => 'The premium plan with full access to reports.',
            'type' => SubscriptionPlanType::Premium->name,
            'price' => '2000',
            'currency_id' => Currency::first()->id ?? null,
            'is_enabled' => true,
        ]);
    }
}
