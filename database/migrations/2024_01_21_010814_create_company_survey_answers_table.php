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
        Schema::create('company_survey_answers', function (Blueprint $table) {
            $table->id();
            $table->efficientUuid('uuid')->unique();
            $table->unsignedBigInteger('company_survey_user_response_id');
            $table->foreign('company_survey_user_response_id')->references('id')->on('company_survey_user_response')->onUpdate('cascade')->onDelete('cascade');
            $table->unsignedBigInteger('company_survey_question_id');
            $table->foreign('company_survey_question_id')->references('id')->on('company_survey_questions')->onUpdate('cascade')->onDelete('cascade');
            $table->unique(['company_survey_user_response_id', 'company_survey_question_id'], 'company_survey_answer_unique_1');
            $table->string('answer', 1000);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('company_survey_answers');
    }
};
