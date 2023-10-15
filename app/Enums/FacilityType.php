<?php

namespace App\Enums;

enum UserType
{
    case MINI_FOOTBALL_PLAYGROUND;

    public function toString()
    {
        return match ($this) {
            self::MINI_FOOTBALL_PLAYGROUND => __('Mini Football Playground'),
        };
    }
}
