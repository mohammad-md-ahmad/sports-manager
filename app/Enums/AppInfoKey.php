<?php

namespace App\Enums;

use App\Traits\EnumFromName;

enum AppInfoKey
{
    use EnumFromName;

    case About;

    public function toString()
    {
        return match ($this) {
            self::About => __('About'),
        };
    }
}
