<?php

declare(strict_types=1);

namespace App\Services\Data\Booking;

use App\Models\ScheduleDetails;
use App\Models\User;
use App\Services\Data\Core\UuidToEntityCaster;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Data;

class CreateBookingRequest extends Data
{
    public function __construct(
        #[MapInputName('user_uuid')]
        #[WithCast(UuidToEntityCaster::class, User::class)]
        public string $customer_user_id,
        #[MapInputName('schedule_details_uuid')]
        #[WithCast(UuidToEntityCaster::class, ScheduleDetails::class)]
        public string $schedule_details_id,
    ) {
    }
}
