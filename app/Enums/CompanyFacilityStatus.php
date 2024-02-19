<?php

namespace App\Enums;

use App\Traits\EnumFromName;

enum CompanyFacilityStatus
{
    use EnumFromName;

    case PendingApproval;
    case Active;
    case Disabled;

    public function toString()
    {
        return match ($this) {
            self::PendingApproval => __('Pending Approval'),
            self::Active => __('Active'),
            self::Disabled => __('Disabled'),
        };
    }
}
