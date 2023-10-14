<?php

namespace App\Contracts\Services;

use App\Models\Address;
use App\Services\Data\Address\CreateAddressRequest;
use App\Services\Data\Company\DeleteCompanyRequest;
use App\Services\Data\Company\UpdateCompanyRequest;

interface AddressServiceInterface
{
    // public function get( $data): array;

    public function store(CreateAddressRequest $data): Address;

    // public function update(UpdateCompanyRequest $data): array;

    // public function delete(DeleteCompanyRequest $data): bool;
}
