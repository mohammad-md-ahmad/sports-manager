<?php

use App\Enums\ScheduleDetailsStatus;
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
        Schema::table('schedule_details', function (Blueprint $table) {
            $table->string('status', 20)->after('date_time_to')->default(ScheduleDetailsStatus::Available->name);
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
