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
        Schema::table('company_facilities', function (Blueprint $table) {
            if (! Schema::hasColumn('company_facilities', 'sport_id')) {
                $table->unsignedBigInteger('sport_id')->nullable()->after('details');
                $table->foreign('sport_id')->references('id')->on('sports')->onUpdate('cascade')->onDelete('cascade');
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
