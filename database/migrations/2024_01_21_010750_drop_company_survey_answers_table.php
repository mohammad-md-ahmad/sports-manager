<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::dropIfExists('company_survey_answers');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
