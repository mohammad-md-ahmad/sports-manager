<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\Services\SportServiceInterface;
use App\Models\Sport;
use App\Services\Data\Sport\CreateSportRequest;
use App\Services\Data\Sport\DeleteSportRequest;
use App\Services\Data\Sport\GetAllSportsRequest;
use App\Services\Data\Sport\GetSportRequest;
use App\Services\Data\Sport\UpdateSportRequest;
use App\Traits\ImageUpload;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class SportService implements SportServiceInterface
{
    use ImageUpload;

    /**
     * @throws Exception
     */
    public function getAll(GetAllSportsRequest $data): LengthAwarePaginator
    {
        try {
            $sports = Sport::query()->jsonPaginate();

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
            $dataWithoutIcon = $data->toArray();
            unset($dataWithoutIcon['icon']);

            DB::beginTransaction();

            /** @var Sport $sport */
            $sport = Sport::create($dataWithoutIcon);

            if ($data->icon) {
                $uploadedImg = $this->uploadImage($data->icon, $sport->id);
                $sport->icon = $uploadedImg;
                $sport->save();
            }

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

            $dataWithoutIcon = $data->toArray();
            unset($dataWithoutIcon['icon']);

            DB::beginTransaction();

            $sport->update($dataWithoutIcon);

            if ($data->icon) {
                $uploadedImg = $this->uploadImage($data->icon, $sport->id);
                $sport->icon = $uploadedImg;
                $sport->save();
            }

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
                $sport->delete();
            });

            return true;
        } catch (Exception $exception) {
            Log::error('SportService::delete: '.$exception->getMessage());

            throw $exception;
        }
    }

    /**
     * @throws Exception
     */
    private function uploadImage(string $image, int|string $id = null): string
    {
        try {
            do {
                $imageData = $this->base64Decode($image);
                $path = $this->base64ToImage($image, 'sports', $imageData);
            } while (! Storage::disk('public')->put($path, $imageData));

            // delete the old icon
            if ($id) {
                /** @var Sport $sport */
                $sport = Sport::findOrFail($id);

                if ($sport->icon) {
                    $this->deleteImage($sport->icon);
                }
            }

            return $path;
        } catch (Exception $exception) {
            Log::error('Uploading sport icon: '.$exception->getMessage());

            throw $exception;
        }
    }

    private function deleteImage(string $image): bool
    {
        try {
            return Storage::disk('public')->delete($image);
        } catch (Exception $exception) {
            Log::error('Delete sport icon: '.$exception->getMessage());

            throw $exception;
        }
    }
}
