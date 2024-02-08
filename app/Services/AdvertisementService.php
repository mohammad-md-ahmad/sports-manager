<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\Services\AdvertisementServiceInterface;
use App\Models\Advertisement;
use App\Services\Data\Advertisement\GetAllAdvertisementsRequest;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;

class AdvertisementService implements AdvertisementServiceInterface
{
    public function getAll(GetAllAdvertisementsRequest $data): LengthAwarePaginator
    {
        try {
            $advertisements = Advertisement::query()->jsonPaginate();

            return $advertisements;
        } catch (Exception $exception) {
            Log::error('AdvertisementService::getAll: '.$exception->getMessage());

            throw $exception;
        }
    }
}
