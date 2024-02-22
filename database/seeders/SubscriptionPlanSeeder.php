<?php

namespace Database\Seeders;

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
            'price' => '1000',
            'currency_id' => Currency::first()->id ?? null,
            'is_enabled' => true,
        ]);

        SubscriptionPlan::updateOrCreate([
            'name' => 'premium',
        ], [
            'description' => 'The premium plan with full access to reports.',
            'price' => '2000',
            'currency_id' => Currency::first()->id ?? null,
            'is_enabled' => true,
        ]);
    }
}
