<?php

namespace App\Enums;

use App\Traits\EnumFromName;

enum Report
{
    use EnumFromName;

    case CustomerDemographics;

    public function toString()
    {
        return match ($this) {
            self::CustomerDemographics => __('Customer Demographics'),
        };
    }
}
