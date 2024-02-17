<?php

namespace App\Enums;

enum NotificationCategory
{
    case BookingRequest;
    case BookingResponse;
    case SurveyRequest;
    case General;

    public function toString()
    {
        return match ($this) {
            self::BookingRequest => __('Booking Request'),
            self::BookingResponse => __('Booking Response'),
            self::SurveyRequest => __('Survey Request'),
            self::General => __('General'),
        };
    }
}
