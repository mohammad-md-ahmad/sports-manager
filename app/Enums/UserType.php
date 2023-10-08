<?php

namespace App\Enums;

enum UserType
{
    case ADMIN;
    case COMPANY_USER;
    case CUSTOMER_USER;

    public function toString()
    {
        return match($this) {
            self::ADMIN => __('Admin'),
            self::COMPANY_USER => __('Company User'),
            self::CUSTOMER_USER => __('Customer User'),
        };
    }
}
