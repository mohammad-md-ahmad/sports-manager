<?php

namespace App\Enums;

enum OneSignalSubscriptionStatus
{
    case Active;
    case Unsubscribed;

    public function toString()
    {
        return match ($this) {
            self::Active => __('Active'),
            self::Unsubscribed => __('Unsubscribed'),
        };
    }

    public static function toArray(): array
    {
        return [
            self::Active->name => __('Active'),
            self::Unsubscribed->name => __('Unsubscribed'),
        ];
    }
}
