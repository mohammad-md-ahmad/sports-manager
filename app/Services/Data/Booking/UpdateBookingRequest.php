<?php

declare(strict_types=1);

namespace App\Services\Data\Booking;

use App\Models\Company;
use App\Services\Data\Address\UpdateAddressRequest;
use App\Services\Data\Core\UuidToEntityCaster;
use App\Services\Data\User\UpdateUserRequest;
use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class UpdateBookingRequest extends Data
{
    public function __construct(
        #[FromRouteParameter('uuid')]
        #[WithCast(UuidToEntityCaster::class, Company::class)]
        public string $id,
        public string|Optional|null $name,
        public string|Optional|null $description,
        public string|Optional|null $logo,
        public UpdateAddressRequest|Optional|null $updateAddressRequest,
        public UpdateUserRequest|Optional|null $updateUserRequest,

    ) {
    }
}
