<?php

declare(strict_types=1);

namespace App\Services\Data\CompanySurvey;

use App\Models\Booking;
use App\Models\CompanySurveyQuestion;
use App\Services\Data\Core\UuidToEntityCaster;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Data;

class CreateSurveyAnswerRequest extends Data
{
    public function __construct(
        #[WithCast(UuidToEntityCaster::class, CompanySurveyQuestion::class)]
        public string $company_survey_question_id,
        public string $user_id,
        public string $answer,
        #[WithCast(UuidToEntityCaster::class, Booking::class)]
        public ?string $booking_id = null,
    ) {
    }
}
