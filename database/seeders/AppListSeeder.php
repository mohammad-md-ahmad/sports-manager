<?php

namespace Database\Seeders;

use App\Enums\AppListKey;
use App\Models\AppList;
use Illuminate\Database\Seeder;

class AppListSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        AppList::updateOrCreate([
            'key' => AppListKey::Payment_methods->name,
        ], [
            'value' => [
                'cash',
                'visa card',
                'master card',
                'wish',
            ],
        ]);
    }
}
