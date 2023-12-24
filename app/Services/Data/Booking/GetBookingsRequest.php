<?php

declare(strict_types=1);

namespace App\Services\Data\Booking;

use App\Models\Company;
use App\Models\User;
use App\Services\Data\Core\UuidToEntityCaster;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Data;

class GetBookingsRequest extends Data
{
    public function __construct(
        #[MapInputName('user_uuid')]
        #[WithCast(UuidToEntityCaster::class, User::class)]
        public ?string $user_id,
        #[MapInputName('company_uuid')]
        #[WithCast(UuidToEntityCaster::class, Company::class)]
        public ?string $company_id,
    ) {
    }

    public static function rules(): array
    {
        return [
            'user_id' => 'required_without:company_id',
            'company_id' => 'required_without:user_id',
        ];
    }
}
