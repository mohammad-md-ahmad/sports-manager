<?php

namespace App\Contracts\Services;

use App\Models\Sport;
use App\Services\Data\Sport\CreateSportRequest;
use App\Services\Data\Sport\DeleteSportRequest;
use App\Services\Data\Sport\GetAllSportsRequest;
use App\Services\Data\Sport\GetSportRequest;
use App\Services\Data\Sport\UpdateSportRequest;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface SportServiceInterface
{
    public function getAll(GetAllSportsRequest $data): LengthAwarePaginator;

    public function get(GetSportRequest $data): Sport;

    public function store(CreateSportRequest $data): Sport;

    public function update(UpdateSportRequest $data): Sport;

    public function delete(DeleteSportRequest $data): bool;
}
