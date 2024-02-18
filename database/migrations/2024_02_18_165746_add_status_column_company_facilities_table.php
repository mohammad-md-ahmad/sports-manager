<?php

use App\Enums\CompanyFacilityStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('company_facilities', function (Blueprint $table) {
            if (! Schema::hasColumn('company_facilities', 'status')) {
                $table->string('status', 50)->nullable()->default(CompanyFacilityStatus::Active->name)->after('sport_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
