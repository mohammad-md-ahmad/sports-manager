<?php

namespace App\Contracts\Services;

use App\Models\Advertisement;
use App\Models\Sport;
use App\Services\Data\Advertisement\DeleteAdvertisementRequest;
use App\Services\Data\Advertisement\GetAdvertisementsRequest;
use App\Services\Data\Sport\CreateSportRequest;
use App\Services\Data\Sport\GetAllSportsRequest;
use App\Services\Data\Sport\UpdateSportRequest;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface SportServiceInterface
{
    public function getAll(GetAllSportsRequest $data): LengthAwarePaginator;

    //    public function get(GetAdvertisementsRequest $data): Advertisement;

    public function store(CreateSportRequest $data): Sport;

    public function update(UpdateSportRequest $data): Sport;

    //    public function delete(DeleteAdvertisementRequest $data): bool;
}
