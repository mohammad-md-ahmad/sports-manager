<?php

namespace App\Contracts\Services;

use App\Models\Rating;
use App\Services\Data\Rating\CreateRatingRequest;
use App\Services\Data\Rating\GetEntityRatingsRequest;

interface RatingServiceInterface
{
    public function store(CreateRatingRequest $data): Rating;

    public function getEntityRatings(GetEntityRatingsRequest $data): array;
}
