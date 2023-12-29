<?php

namespace App\Enums;

use App\Traits\EnumFromName;

enum AppListKey
{
    use EnumFromName;

    case Payment_methods;

    public function toString()
    {
        return match ($this) {
            self::Payment_methods => __('Payment methods'),
        };
    }
}
