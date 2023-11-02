<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $tableExists = DB::select('SHOW TABLES LIKE "schedule_details"');

        if (! empty($tableExists)) {
            $uniqueExists = DB::select("SHOW INDEX FROM schedule_details WHERE Key_name = 'schedule_details_name_schedule_id_unique'");
            if (! empty($uniqueExists)) {
                Schema::table('schedule_details', function (Blueprint $table) {
                    $table->dropUnique('schedule_details_name_schedule_id_unique'); // Drop the unique key constraint
                });
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
