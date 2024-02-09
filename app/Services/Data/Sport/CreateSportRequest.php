<?php

declare(strict_types=1);

namespace App\Services\Data\Sport;

use App\Models\Advertisement;
use Spatie\LaravelData\Attributes\Validation\Unique;
use Spatie\LaravelData\Data;

class CreateSportRequest extends Data
{
    public function __construct(
        #[Unique(Advertisement::class)]
        public string $name,
        public ?string $description = null,
        public ?string $icon = null,
        public ?bool $is_enabled = true,
    ) {
    }
}
