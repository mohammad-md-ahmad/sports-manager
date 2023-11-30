<?php

declare(strict_types=1);

namespace App\Services\Integrations;

enum HttpErrorsEnum
{
    case BadRequest;
    case UnAuthorised;
    case Forbidden;
    case NotFound;
    case BadMethod;
    case InternalServerError;
    case BadGateway;
    case ServiceUnavailable;
    case GatewayTimeout;
    case Unhandled;
    case Timeout;

    public function message(): string
    {
        return match ($this) {
            self::Unhandled => __('Unhandled Error'),
            self::Timeout => __('Operation Timed Out'),
            default => __('Operation Not Available due to Remote Service Failure'),
        };
    }

    public function internalDescription(): string
    {
        return match ($this) {
            self::BadRequest => __('Request contained errors'),
            self::UnAuthorised => __('Operation Unauthorised'),
            self::Forbidden => __('Operation Forbidden'),
            self::NotFound => __('Resource Not Found for the requested operation'),
            self::BadMethod => __('Request Method Not Supported'),
            self::InternalServerError => __('Remote Service Internal Server Error'),
            self::BadGateway => __('Remote Service Bad Gateway'),
            self::ServiceUnavailable => __('Remote Service Unavailable'),
            self::GatewayTimeout => __('Remote Service Gateway Timed Out'),
            self::Unhandled => __('Unexpected Error'),
            self::Timeout => __('Operation Timed Out'),
        };
    }

    public static function fromCode($code): self
    {
        return match (intval($code)) {
            400 => self::BadRequest,
            401 => self::UnAuthorised,
            403 => self::Forbidden,
            404 => self::NotFound,
            405 => self::BadMethod,
            500 => self::InternalServerError,
            502 => self::BadGateway,
            503 => self::ServiceUnavailable,
            504 => self::GatewayTimeout,
            default => self::Unhandled,
        };
    }
}
