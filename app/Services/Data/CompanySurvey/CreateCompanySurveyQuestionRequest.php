<?php

declare(strict_types=1);

namespace App\Services\Data\CompanySurvey;

use Spatie\LaravelData\Data;

class CreateCompanySurveyQuestionRequest extends Data
{
    public function __construct(
        public string $company_survey_id,
        public string $question,
        public int $question_order,
    ) {
    }
}
