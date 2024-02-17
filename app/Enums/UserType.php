<?php

namespace App\Enums;

use App\Traits\EnumFromName;

enum UserType
{
    use EnumFromName;

    case ADMIN;
    case COMPANY_USER;
    case CUSTOMER_USER;

    public function toString()
    {
        return match ($this) {
            self::ADMIN => __('Admin'),
            self::COMPANY_USER => __('Company User'),
            self::CUSTOMER_USER => __('Customer User'),
        };
    }

    public static function toArray()
    {
        return [
            self::ADMIN->name => __('Admin'),
            self::COMPANY_USER->name => __('Company User'),
            self::CUSTOMER_USER->name => __('Customer User'),
        ];
    }
}
