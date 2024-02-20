<?php

namespace App\Contracts\Services;

use App\Services\Data\Report\GetCompanyReportByKey;
use App\Services\Data\Report\GetReportByKey;
use Illuminate\Support\Collection;

interface ReportServiceInterface
{
    public function get(GetReportByKey $data): Collection;

    public function getByCompany(GetCompanyReportByKey $data): Collection;
}
