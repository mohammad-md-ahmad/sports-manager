<?php

namespace App\Enums;

use App\Traits\EnumFromName;

enum SubscriptionPlanType
{
    use EnumFromName;

    case Standard;

    case Premium;

    public function toString()
    {
        return match ($this) {
            self::Standard => __('Standard'),
            self::Premium => __('Premium'),
        };
    }

    public static function toArray()
    {
        return [
            self::Standard->name => __('Standard'),
            self::Premium->name => __('Premium'),
        ];
    }
}
