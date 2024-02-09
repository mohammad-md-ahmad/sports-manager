<?php

declare(strict_types=1);

namespace App\Services\Data\Advertisement;

use App\Models\Advertisement;
use App\Services\Data\Core\UuidToEntityCaster;
use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Data;

class GetAdvertisementsRequest extends Data
{
    public function __construct(
        #[FromRouteParameter('uuid')]
        #[WithCast(UuidToEntityCaster::class, Advertisement::class)]
        public string $id,
    ) {
    }
}
