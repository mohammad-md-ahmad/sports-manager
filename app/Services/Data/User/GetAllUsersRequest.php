<?php

declare(strict_types=1);

namespace App\Services\Data\User;

use Spatie\LaravelData\Data;

class GetAllUsersRequest extends Data
{
    public function __construct(
        public ?string $type = null,
    ) {
    }
}
