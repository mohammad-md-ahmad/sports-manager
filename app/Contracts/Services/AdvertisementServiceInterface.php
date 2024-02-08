<?php

namespace App\Contracts\Services;

use App\Services\Data\Advertisement\GetAllAdvertisementsRequest;
use Illuminate\Support\Collection;

interface AdvertisementServiceInterface
{
    public function getAll(GetAllAdvertisementsRequest $data): Collection;

    // public function store(CreateAddressRequest $data): Address;

    // public function update(UpdateAddressRequest $data): Address;

    // public function delete(DeleteCompanyRequest $data): bool;
}
