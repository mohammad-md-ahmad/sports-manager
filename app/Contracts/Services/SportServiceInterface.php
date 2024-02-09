<?php

namespace App\Contracts\Services;

use App\Models\Sport;
use App\Services\Data\Sport\CreateSportRequest;
use App\Services\Data\Sport\DeleteSportRequest;
use App\Services\Data\Sport\GetAllSportsRequest;
use App\Services\Data\Sport\GetSportRequest;
use App\Services\Data\Sport\UpdateSportRequest;
use App\Services\Data\Sport\UpdateUserFavoriteSports;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface SportServiceInterface
{
    public function getAll(GetAllSportsRequest $data): LengthAwarePaginator;

    public function get(GetSportRequest $data): Sport;

    public function store(CreateSportRequest $data): Sport;

    public function update(UpdateSportRequest $data): Sport;

    public function delete(DeleteSportRequest $data): bool;

    public function updateUserFavoriteSports(UpdateUserFavoriteSports $data): Collection;
}
