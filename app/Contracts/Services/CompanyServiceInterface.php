<?php

namespace App\Contracts\Services;

use App\Models\Company;
use App\Services\Data\Company\CreateCompanyRequest;
use App\Services\Data\Company\DeleteCompanyRequest;
use App\Services\Data\Company\GetCompanyRequest;
use App\Services\Data\Company\UpdateCompanyRequest;

interface CompanyServiceInterface
{
    public function get(GetCompanyRequest $data): Company;

    public function store(CreateCompanyRequest $data): Company;

    public function update(UpdateCompanyRequest $data): Company;

    public function delete(DeleteCompanyRequest $data): bool;
}
