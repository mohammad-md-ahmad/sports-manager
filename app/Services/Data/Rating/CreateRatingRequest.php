<?php

declare(strict_types=1);

namespace App\Services\Data\Rating;

use App\Models\Booking;
use App\Models\User;
use App\Rules\MorphModelExists;
use App\Services\Data\Core\UuidToEntityCaster;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Data;

class CreateRatingRequest extends Data
{
    public function __construct(
        public string $rated_entity_type,
        #[MapInputName('rated_entity_uuid')]
        public string $rated_entity_id,
        public int $rating,
        public string $comment,
        public ?string $commenter_name,
        #[MapInputName('user_uuid')]
        #[WithCast(UuidToEntityCaster::class, User::class)]
        public ?string $user_id = null,
        #[MapInputName('booking_uuid')]
        #[WithCast(UuidToEntityCaster::class, Booking::class)]
        public ?string $booking_id = null,
    ) {
        $this->rated_entity_id = (string) app($this->rated_entity_type)::whereUuid($this->rated_entity_id)->first()->id ?? null;

        if ($this->user_id) {
            $user = User::findOrFail($this->user_id);

            $this->commenter_name = $user->full_name;
        }
    }

    public static function rules()
    {
        $ratedEntityType = request()->get('rated_entity_type');

        return [
            'rated_entity_uuid' => [new MorphModelExists($ratedEntityType)],
            'commenter_name' => ['required_without:user_id'],
            'rating' => ['required', 'numeric', 'min:1', 'max:5'],
        ];
    }
}
