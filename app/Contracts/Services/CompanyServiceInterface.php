<?php

namespace App\Contracts\Services;

use App\Models\Company;
use App\Services\Data\Company\CreateCompanyRequest;
use App\Services\Data\Company\DeleteCompanyRequest;
use App\Services\Data\Company\GetCompanyRequest;
use App\Services\Data\Company\SearchCompaniesRequest;
use App\Services\Data\Company\UpdateCompanyRequest;
use Illuminate\Pagination\LengthAwarePaginator;

interface CompanyServiceInterface
{
    public function get(GetCompanyRequest $data): Company;

    public function getAll(SearchCompaniesRequest $data): LengthAwarePaginator;

    public function store(CreateCompanyRequest $data): Company;

    public function update(UpdateCompanyRequest $data): Company;

    public function delete(DeleteCompanyRequest $data): bool;
}
