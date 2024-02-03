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
        Schema::table('schedule_details', function (Blueprint $table) {
            if (! Schema::hasColumn('schedule_details', 'price')) {
                $table->unsignedBigInteger('price')->nullable(false)->default(0)->after('details');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('schedule_details', function (Blueprint $table) {
            if (Schema::hasColumn('schedule_details', 'price')) {
                $table->dropColumn('price');
            }
        });
    }
};