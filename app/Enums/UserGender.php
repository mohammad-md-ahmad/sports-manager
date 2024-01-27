<?php

namespace App\Enums;

use App\Traits\EnumFromName;

enum UserGender
{
    use EnumFromName;

    case Male;

    case Female;

    public function toString()
    {
        return match ($this) {
            self::Male => __('Male'),
            self::Female => __('Female'),
        };
    }

    public static function toArray()
    {
        return [
            self::Male->name => __('Male'),
            self::Female->name => __('Female'),
        ];
    }
}
