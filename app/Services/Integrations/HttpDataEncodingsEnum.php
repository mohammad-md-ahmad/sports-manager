<?php

declare(strict_types=1);

namespace App\Services\Integrations;

enum HttpDataEncodingsEnum
{
    case Json;
    case Form;
    case Body;
    case Query;
}
