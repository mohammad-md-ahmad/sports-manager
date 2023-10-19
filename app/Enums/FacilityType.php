<?php

namespace App\Enums;

use App\Traits\EnumFromName;

enum FacilityType
{
    use EnumFromName;

    case MINI_FOOTBALL_PLAYGROUND;

    public function toString()
    {
        return match ($this) {
            self::MINI_FOOTBALL_PLAYGROUND => __('Mini Football Playground'),
        };
    }

    public static function toArray()
    {
        return [
            self::MINI_FOOTBALL_PLAYGROUND->name => __('Mini Football Playground'),
        ];
    }
}
