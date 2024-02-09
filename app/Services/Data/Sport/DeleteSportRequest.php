<?php

declare(strict_types=1);

namespace App\Services\Data\Sport;

use App\Models\Sport;
use App\Services\Data\Core\UuidToEntityCaster;
use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Data;

class DeleteSportRequest extends Data
{
    public function __construct(
        #[FromRouteParameter('uuid')]
        #[WithCast(UuidToEntityCaster::class, Sport::class)]
        public string $id,
    ) {
    }
}
