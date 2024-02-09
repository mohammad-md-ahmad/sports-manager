<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\Services\SportServiceInterface;
use App\Models\Advertisement;
use App\Models\Sport;
use App\Services\Data\Advertisement\DeleteAdvertisementRequest;
use App\Services\Data\Advertisement\GetAdvertisementsRequest;
use App\Services\Data\Sport\CreateSportRequest;
use App\Services\Data\Sport\GetAllSportsRequest;
use App\Services\Data\Sport\UpdateSportRequest;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SportService implements SportServiceInterface
{
    /**
     * @throws Exception
     */
    public function getAll(GetAllSportsRequest $data): LengthAwarePaginator
    {
        try {
            $sports = Advertisement::query()->jsonPaginate();

            return $sports;
        } catch (Exception $exception) {
            Log::error('SportService::getAll: '.$exception->getMessage());

            throw $exception;
        }
    }

    //    public function get(GetAdvertisementsRequest $data): Advertisement
    //    {
    //        try {
    //            /** @var Advertisement $advertisement */
    //            $advertisement = Advertisement::with(['gallery'])->findOrFail($data->id);
    //
    //            return $advertisement;
    //        } catch (Exception $exception) {
    //            Log::error('AdvertisementService::get: '.$exception->getMessage());
    //
    //            throw $exception;
    //        }
    //    }

    /**
     * @throws Exception
     */
    public function store(CreateSportRequest $data): Sport
    {
        try {
            DB::beginTransaction();

            /** @var Sport $sport */
            $sport = Sport::create($data->toArray());

            DB::commit();

            $sport->refresh();

            return $sport;
        } catch (Exception $exception) {
            DB::rollBack();

            Log::error('SportService::store: '.$exception->getMessage());

            throw $exception;
        }
    }

    /**
     * @throws Exception
     */
    public function update(UpdateSportRequest $data): Sport
    {
        try {
            /** @var Sport $sport */
            $sport = Sport::findOrFail($data->id);

            DB::beginTransaction();

            $sport->update($data->toArray());

            DB::commit();

            $sport->refresh();

            return $sport;
        } catch (Exception $exception) {
            DB::rollBack();

            Log::error('SportService::update: '.$exception->getMessage());

            throw $exception;
        }
    }

    //    public function delete(DeleteAdvertisementRequest $data): bool
    //    {
    //        try {
    //            /** @var Advertisement $advertisement */
    //            $advertisement = Advertisement::findOrFail($data->id);
    //
    //            DB::transaction(function () use ($advertisement) {
    //                $advertisement->gallery()->delete();
    //                $advertisement->delete();
    //            });
    //
    //            return true;
    //        } catch (Exception $exception) {
    //            Log::error('AdvertisementService::delete: '.$exception->getMessage());
    //
    //            throw $exception;
    //        }
    //    }
}
