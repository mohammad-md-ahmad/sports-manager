<?php

namespace App\Enums;

enum CompanyCustomerStatus
{
    case Active;
    case Inactive;

    public function toString()
    {
        return match ($this) {
            self::Active => __('Active'),
            self::Inactive => __('Inactive'),
        };
    }
}
