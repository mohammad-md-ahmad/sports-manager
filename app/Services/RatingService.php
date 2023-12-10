<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\Services\RatingServiceInterface;
use App\Models\Rating;
use App\Services\Data\Rating\CreateRatingRequest;
use App\Services\Data\Rating\GetEntityRatingsRequest;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RatingService implements RatingServiceInterface
{
    public function store(CreateRatingRequest $data): Rating
    {
        try {
            DB::beginTransaction();

            /** @var Rating $rating */
            $rating = Rating::create($data->toArray());

            DB::commit();

            return $rating;
        } catch (Exception $exception) {
            DB::rollBack();

            Log::error('RatingService::store: '.$exception->getMessage());

            throw $exception;
        }
    }

    public function getEntityRatings(GetEntityRatingsRequest $data): array
    {
        try {
            /** @var Model $ratedEntity */
            $ratedEntity = app($data->rated_entity_type)::whereUuid($data->rated_entity_id)->first();

            return [
                'ratings' => $ratedEntity->ratings,
                'total_rating' => $ratedEntity->total_rating,
            ];
        } catch (Exception $exception) {
            DB::rollBack();

            Log::error('RatingService::getEntityRatings: '.$exception->getMessage());

            throw $exception;
        }
    }
}
