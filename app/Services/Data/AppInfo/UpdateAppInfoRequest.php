<?php

declare(strict_types=1);

namespace App\Services\Data\AppInfo;

use Spatie\LaravelData\Data;

class UpdateAppInfoRequest extends Data
{
    public function __construct(
        public string $key,
        public array $value,
    ) {
    }
}
