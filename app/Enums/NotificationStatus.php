<?php

namespace App\Enums;

enum NotificationStatus
{
    case Pending;
    case Sent;
    case Opened;

    public function toString()
    {
        return match ($this) {
            self::Pending => __('Pending'),
            self::Sent => __('Sent'),
            self::Opened => __('Opened'),
        };
    }
}
