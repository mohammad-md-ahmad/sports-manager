<?php

declare(strict_types=1);

namespace App\Services\Data\AppInfo;

use Spatie\LaravelData\Data;

class GetAppInfoByKey extends Data
{
    public function __construct(
        public string $key,
    ) {
    }
}
