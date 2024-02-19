<?php

declare(strict_types=1);

namespace App\Services\Data\PushNotification;

use App\Enums\UserType;
use App\Models\Company;
use App\Models\Country;
use App\Models\User;
use App\Services\Data\Core\UuidToEntityCaster;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Data;

class SendPushNotificationRequest extends Data
{
    public function __construct(
        public string $message,
        #[MapInputName('company_uuid')]
        #[WithCast(UuidToEntityCaster::class, Company::class)]
        public ?string $company_id = null,
        #[MapInputName('user_uuid')]
        #[WithCast(UuidToEntityCaster::class, User::class)]
        public ?string $user_id = null,
        #[MapInputName('country_uuid')]
        #[WithCast(UuidToEntityCaster::class, Country::class)]
        public ?string $country_id = null,
        public ?string $user_type = null,
    ) {
    }

    public static function rules(): array
    {
        return [
            'user_type' => ['nullable', 'string', 'in:'.implode(',', array_column(UserType::cases(), 'name'))],
        ];
    }
}
