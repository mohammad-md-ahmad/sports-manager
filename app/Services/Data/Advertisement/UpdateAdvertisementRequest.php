<?php

declare(strict_types=1);

namespace App\Services\Data\Advertisement;

use App\Models\Advertisement;
use App\Services\Data\Core\UuidToEntityCaster;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Data;

class UpdateAdvertisementRequest extends Data
{
    public function __construct(
        #[FromRouteParameter('uuid')]
        #[WithCast(UuidToEntityCaster::class, Advertisement::class)]
        public string $id,
        public string $title,
        public string $url,
        public string $effective_from,
        public ?string $effective_to = null,
        public ?string $description = null,
        public ?array $photos = null,
    ) {
    }

    public static function rules(Request $request)
    {
        $uuid = $request->route()->parameter('uuid');
        $advertisement = Advertisement::query()->whereUuid($uuid)->first();

        return [
            'title' => Rule::unique('advertisements')->ignore($advertisement->id, 'id'),
        ];
    }
}
