<?php

namespace App\Contracts\Services;

use App\Services\Data\Company\CreateCompanyRequest;
use App\Services\Data\Company\DeleteCompanyRequest;
use App\Services\Data\Company\GetCompanyRequest;
use App\Services\Data\Company\UpdateCompanyRequest;

interface AddressServiceInterface
{
    public function get(GetCompanyRequest $data): array;

    public function store(CreateCompanyRequest $data): array;

    public function update(UpdateCompanyRequest $data): array;

    public function delete(DeleteCompanyRequest $data): bool;
}
