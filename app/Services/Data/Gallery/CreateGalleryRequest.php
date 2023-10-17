<?php

declare(strict_types=1);

namespace App\Services\Data\Gallery;

use Spatie\LaravelData\Attributes\Validation\BooleanType;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class CreateGalleryRequest extends Data
{
    public function __construct(
        public string $model_type,
        public string $model_id,
        public string $image,
        #[BooleanType]
        public string|Optional $is_primary,
    ) {
    }
}
