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
        Schema::create('company_survey_questions', function (Blueprint $table) {
            $table->id();
            $table->efficientUuid('uuid')->unique();
            $table->unsignedBigInteger('company_survey_id');
            $table->foreign('company_survey_id')->references('id')->on('company_surveys')->onUpdate('cascade')->onDelete('cascade');
            $table->string('question', 1000);
            $table->unsignedTinyInteger('question_order');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('company_survey_questions');
    }
};
