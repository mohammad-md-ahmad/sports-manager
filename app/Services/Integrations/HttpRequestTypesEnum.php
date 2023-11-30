<?php

declare(strict_types=1);

namespace App\Services\Integrations;

enum HttpRequestTypesEnum
{
    case BasicAuth;
    case Token;
}
