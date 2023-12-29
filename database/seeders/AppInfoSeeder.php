<?php

namespace Database\Seeders;

use App\Enums\AppInfoKey;
use App\Models\AppInfo;
use Illuminate\Database\Seeder;

class AppInfoSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        AppInfo::updateOrCreate([
            'key' => AppInfoKey::About->name,
        ], [
            'value' => config('app.name').' is a platform for sport facilities management.',
        ]);
    }
}
