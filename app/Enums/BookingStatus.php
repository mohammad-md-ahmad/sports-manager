<?php

namespace App\Enums;

use App\Traits\EnumFromName;

enum BookingStatus
{
    use EnumFromName;

    case Approved;
    case Declined;
    case Pending;

    public function toString()
    {
        return match ($this) {
            self::Approved => __('Approved'),
            self::Declined => __('Declined'),
            self::Pending => __('Pending'),
        };
    }

    public function isBookable(): bool
    {
        return in_array($this, self::bookable());
    }

    public static function bookable(): array
    {
        return [
            self::Pending,
        ];
    }

    public static function booked(): array
    {
        return [
            self::Approved,
        ];
    }

    public static function declineable(): array
    {
        return [
            self::Pending,
        ];
    }

    public function isBooked(): bool
    {
        return in_array($this, self::booked());
    }

    public function isDeclinable(): bool
    {
        return in_array($this, self::declineable());
    }
}
