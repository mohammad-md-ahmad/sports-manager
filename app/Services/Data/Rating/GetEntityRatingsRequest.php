<?php

declare(strict_types=1);

namespace App\Services\Data\Rating;

use App\Rules\MorphModelExists;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;

class GetEntityRatingsRequest extends Data
{
    public function __construct(
        public string $rated_entity_type,
        #[MapInputName('rated_entity_uuid')]
        public string $rated_entity_id,
    ) {
    }

    public static function rules()
    {
        $ratedEntityType = request()->get('rated_entity_type');

        return [
            'rated_entity_uuid' => [new MorphModelExists($ratedEntityType)],
        ];
    }
}
