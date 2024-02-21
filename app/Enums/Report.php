<?php

namespace App\Enums;

use App\Traits\EnumFromName;

enum Report
{
    use EnumFromName;

    case CustomerDemographics;
    case SystemMetrics;

    public function toString()
    {
        return match ($this) {
            self::CustomerDemographics => __('Customer Demographics'),
            self::SystemMetrics => __('System Metrics and Totals')
        };
    }

    public static function toArray()
    {
        return [
            self::CustomerDemographics->name => __('Customer Demographics'),
            self::SystemMetrics->name => __('System Metrics and Totals'),
        ];
    }
}
