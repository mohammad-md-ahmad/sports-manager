<?php

namespace App\Contracts\Services;

use App\Models\Address;
use App\Services\Data\Address\CreateAddressRequest;
use App\Services\Data\Address\UpdateAddressRequest;

interface AddressServiceInterface
{
    // public function get( $data): array;

    public function store(CreateAddressRequest $data): Address;

    public function update(UpdateAddressRequest $data): Address;

    // public function delete(DeleteCompanyRequest $data): bool;
}
