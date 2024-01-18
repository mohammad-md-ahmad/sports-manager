<?php

declare(strict_types=1);

namespace App\Services\Data\CompanySurvey;

use App\Models\CompanySurvey;
use App\Services\Data\Core\UuidToEntityCaster;
use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Data;

class UpdateCompanySurveyRequest extends Data
{
    public function __construct(
        #[FromRouteParameter('uuid')]
        #[WithCast(UuidToEntityCaster::class, CompanySurvey::class)]
        public string $id,
        public ?string $name,
        public array $questions,
        public ?bool $is_active,
    ) {
    }
}
