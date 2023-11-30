<?php

declare(strict_types=1);

namespace App\Services\Integrations;

enum HttpMethodsEnum
{
    case GET;
    case POST;
    case PUT;
    case PATCH;
    case DELETE;
}
