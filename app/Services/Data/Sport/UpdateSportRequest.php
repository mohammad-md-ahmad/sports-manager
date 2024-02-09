<?php

declare(strict_types=1);

namespace App\Services\Data\Sport;

use App\Models\Sport;
use App\Services\Data\Core\UuidToEntityCaster;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Data;

class UpdateSportRequest extends Data
{
    public function __construct(
        #[FromRouteParameter('uuid')]
        #[WithCast(UuidToEntityCaster::class, Sport::class)]
        public string $id,
        public ?string $name = null,
        public ?string $description = null,
        public ?string $icon = null,
        public ?bool $is_enabled = true,
    ) {
    }

    public static function rules(Request $request)
    {
        $uuid = $request->route()->parameter('uuid');
        $sport = Sport::query()->whereUuid($uuid)->first();

        return [
            'name' => Rule::unique('sports')->ignore($sport->id, 'id'),
        ];
    }
}
