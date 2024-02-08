<?php

namespace App\Contracts\Services;

use App\Models\Advertisement;
use App\Services\Data\Advertisement\CreateAdvertisementRequest;
use App\Services\Data\Advertisement\DeleteAdvertisementRequest;
use App\Services\Data\Advertisement\GetAdvertisementsRequest;
use App\Services\Data\Advertisement\GetAllAdvertisementsRequest;
use App\Services\Data\Advertisement\UpdateAdvertisementRequest;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface AdvertisementServiceInterface
{
    public function getAll(GetAllAdvertisementsRequest $data): LengthAwarePaginator;

    public function get(GetAdvertisementsRequest $data): Advertisement;

    public function store(CreateAdvertisementRequest $data): Advertisement;

    public function update(UpdateAdvertisementRequest $data): Advertisement;

    public function delete(DeleteAdvertisementRequest $data): bool;
}
