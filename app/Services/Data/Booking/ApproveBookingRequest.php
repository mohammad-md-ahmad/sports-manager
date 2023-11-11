<?php

declare(strict_types=1);

namespace App\Services\Data\Booking;

use App\Models\Booking;
use App\Services\Data\Core\UuidToEntityCaster;
use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Data;

class ApproveBookingRequest extends Data
{
    public function __construct(
        #[FromRouteParameter('uuid')]
        #[WithCast(UuidToEntityCaster::class, Booking::class)]
        public string $id,
    ) {
    }
}
