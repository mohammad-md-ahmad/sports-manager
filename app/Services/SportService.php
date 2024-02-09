<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\Services\SportServiceInterface;
use App\Models\Advertisement;
use App\Models\Sport;
use App\Services\Data\Sport\CreateSportRequest;
use App\Services\Data\Sport\DeleteSportRequest;
use App\Services\Data\Sport\GetAllSportsRequest;
use App\Services\Data\Sport\GetSportRequest;
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

    /**
     * @throws Exception
     */
    public function get(GetSportRequest $data): Sport
    {
        try {
            /** @var Sport $sport */
            $sport = Sport::findOrFail($data->id);

            return $sport;
        } catch (Exception $exception) {
            Log::error('SportService::get: '.$exception->getMessage());

            throw $exception;
        }
    }

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

    /**
     * @throws Exception
     */
    public function delete(DeleteSportRequest $data): bool
    {
        try {
            /** @var Sport $sport */
            $sport = Sport::findOrFail($data->id);

            DB::transaction(function () use ($sport) {
                //                $advertisement->gallery()->delete();
                $sport->delete();
            });

            return true;
        } catch (Exception $exception) {
            Log::error('SportService::delete: '.$exception->getMessage());

            throw $exception;
        }
    }
}
