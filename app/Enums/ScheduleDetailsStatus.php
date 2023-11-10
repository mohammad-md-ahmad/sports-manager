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
}
