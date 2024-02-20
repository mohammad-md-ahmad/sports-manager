<?php

declare(strict_types=1);

namespace App\Services\Data\Report;

use Spatie\LaravelData\Data;

class GetReportByKey extends Data
{
    public function __construct(
        public string $key,
    ) {
    }
}
