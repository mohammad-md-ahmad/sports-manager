<?php

namespace App\Enums;

enum ScheduleDetailsStatus
{
    case Available;
    case Pending;
    case Booked;

    public function toString()
    {
        return match ($this) {
            self::Available => __('Available'),
            self::Pending => __('Pending'),
            self::Booked => __('Booked'),
        };
    }

    public static function toArray(): array
    {
        return [
            self::Available->name => __('Available'),
            self::Pending->name => __('Pending'),
            self::Booked->name => __('Booked'),
        ];
    }

    public function isBookable(): bool
    {
        return in_array($this, self::bookable());
    }

    public static function bookable(): array
    {
        return [
            self::Available,
            self::Pending,
        ];
    }

    public function isBooked(): bool
    {
        return in_array($this, self::booked());
    }

    public static function booked(): array
    {
        return [
            self::Booked,
        ];
    }

    public static function declinable(): array
    {
        return [
            self::Pending,
        ];
    }

    public function isDeclinable(): bool
    {
        return in_array($this, self::declinable());
    }
}
