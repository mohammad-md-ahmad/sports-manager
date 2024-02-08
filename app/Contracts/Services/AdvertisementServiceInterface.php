<?php

namespace App\Contracts\Services;

use App\Services\Data\Advertisement\GetAllAdvertisementsRequest;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface AdvertisementServiceInterface
{
    public function getAll(GetAllAdvertisementsRequest $data): LengthAwarePaginator;

    // public function store(CreateAddressRequest $data): Address;

    // public function update(UpdateAddressRequest $data): Address;

    // public function delete(DeleteCompanyRequest $data): bool;
}
