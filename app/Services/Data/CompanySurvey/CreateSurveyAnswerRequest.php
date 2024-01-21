<?php

declare(strict_types=1);

namespace App\Services\Data\CompanySurvey;

use App\Models\CompanySurveyQuestion;
use App\Models\CompanySurveyUserResponse;
use App\Services\Data\Core\UuidToEntityCaster;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Data;

class CreateSurveyAnswerRequest extends Data
{
    public function __construct(
        #[WithCast(UuidToEntityCaster::class, CompanySurveyUserResponse::class)]
        public string $company_survey_user_response_id,
        #[WithCast(UuidToEntityCaster::class, CompanySurveyQuestion::class)]
        public string $company_survey_question_id,
        public string $answer,
    ) {
    }
}
