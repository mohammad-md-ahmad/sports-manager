<?php

namespace App\Enums;

enum DistanceMetric
{
    case KILOMETRES;
    case MILES;

    public function toString()
    {
        return match ($this) {
            self::KILOMETRES => __('Kilometres'),
            self::MILES => __('Miles'),
        };
    }
}
