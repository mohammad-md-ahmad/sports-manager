<?php

declare(strict_types=1);

namespace App\Services\Data\AppList;

use Spatie\LaravelData\Data;

class UpdateListRequest extends Data
{
    public function __construct(
        public string $key,
        public array $value,
    ) {
    }
}
