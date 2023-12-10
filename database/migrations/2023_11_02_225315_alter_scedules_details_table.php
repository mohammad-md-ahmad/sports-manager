<?php

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
        if (Schema::hasColumn('schedule_details', 'name')) {
            Schema::table('schedule_details', function (Blueprint $table) {
                $table->dropUnique(['name', 'schedule_id']);
                $table->dropColumn('name');
            });
        }

        Schema::table('schedule_details', function (Blueprint $table) {
            $table->json('details')->after('date_time_to')->nullable();
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
