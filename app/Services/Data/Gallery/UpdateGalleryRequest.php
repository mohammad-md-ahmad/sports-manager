<?php

declare(strict_types=1);

namespace App\Services\Data\Gallery;

use App\Models\Gallery;
use App\Services\Data\Core\UuidToEntityCaster;
use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\Validation\BooleanType;
use Spatie\LaravelData\Attributes\Validation\RequiredWithout;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class UpdateGalleryRequest extends Data
{
    public function __construct(
        #[MapInputName('uuid')]
        #[WithCast(UuidToEntityCaster::class, Gallery::class)]
        #[RequiredWithout('id_from_route')]
        public ?string $id,
        #[FromRouteParameter('uuid')]
        #[WithCast(UuidToEntityCaster::class, Gallery::class)]
        #[RequiredWithout('id')]
        public ?string $id_from_route,
        public string|Optional $image,
        #[BooleanType]
        public string|Optional $is_primary,
    ) {
    }
}
