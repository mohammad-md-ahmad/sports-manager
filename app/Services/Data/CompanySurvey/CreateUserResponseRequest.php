<?php

declare(strict_types=1);

namespace App\Services\Data\CompanySurvey;

use App\Models\CompanySurvey;
use App\Models\User;
use App\Services\Data\Core\UuidToEntityCaster;
use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Data;

class CreateUserResponseRequest extends Data
{
    public function __construct(
        #[FromRouteParameter('uuid')]
        #[WithCast(UuidToEntityCaster::class, CompanySurvey::class)]
        public string $company_survey_id,
        #[WithCast(UuidToEntityCaster::class, User::class)]
        public string $user_id,
        public array $answers,
    ) {
    }
}
