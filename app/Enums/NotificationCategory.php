<?php

namespace App\Enums;

enum NotificationCategory
{
    case Booking;
    case General;

    public function toString()
    {
        return match ($this) {
            self::Booking => __('Booking'),
            self::General => __('General'),
        };
    }
}
