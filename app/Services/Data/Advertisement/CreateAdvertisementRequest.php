<?php

declare(strict_types=1);

namespace App\Services\Data\Advertisement;

use App\Models\Advertisement;
use Spatie\LaravelData\Attributes\Validation\Unique;
use Spatie\LaravelData\Data;

class CreateAdvertisementRequest extends Data
{
    public function __construct(
        #[Unique(Advertisement::class)]
        public string $title,
        public string $url,
        public string $effective_from,
        public ?string $effective_to = null,
        public ?string $description = null,
        public ?array $photos = null,
    ) {
    }
}
