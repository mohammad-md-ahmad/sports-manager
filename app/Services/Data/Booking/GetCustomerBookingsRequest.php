<?php

declare(strict_types=1);

namespace App\Services\Data\Booking;

use App\Models\CompanyCustomer;
use App\Services\Data\Core\UuidToEntityCaster;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Data;

class GetCustomerBookingsRequest extends Data
{
    public function __construct(
        #[MapInputName('company_customer_record_uuid')]
        #[WithCast(UuidToEntityCaster::class, CompanyCustomer::class)]
        public string $company_customer_record_id,
    ) {
    }
}
