<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\Services\AdvertisementServiceInterface;
use App\Contracts\Services\GalleryServiceInterface;
use App\Models\Advertisement;
use App\Services\Data\Advertisement\CreateAdvertisementRequest;
use App\Services\Data\Advertisement\DeleteAdvertisementRequest;
use App\Services\Data\Advertisement\GetAdvertisementsRequest;
use App\Services\Data\Advertisement\GetAllAdvertisementsRequest;
use App\Services\Data\Advertisement\UpdateAdvertisementRequest;
use App\Services\Data\Gallery\CreateGalleryRequest;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AdvertisementService implements AdvertisementServiceInterface
{
    public function __construct(
        protected GalleryServiceInterface $galleryService,
    ) {
    }

    public function getAll(GetAllAdvertisementsRequest $data): LengthAwarePaginator
    {
        try {
            $advertisements = Advertisement::query()->with(['gallery'])->jsonPaginate();

            return $advertisements;
        } catch (Exception $exception) {
            Log::error('AdvertisementService::getAll: '.$exception->getMessage());

            throw $exception;
        }
    }

    public function get(GetAdvertisementsRequest $data): Advertisement
    {
        try {
            /** @var Advertisement $advertisement */
            $advertisement = Advertisement::with(['gallery'])->findOrFail($data->id);

            return $advertisement;
        } catch (Exception $exception) {
            Log::error('AdvertisementService::get: '.$exception->getMessage());

            throw $exception;
        }
    }

    /**
     * @throws Exception
     */
    public function store(CreateAdvertisementRequest $data): Advertisement
    {
        try {
            DB::beginTransaction();

            /** @var Advertisement $advertisement */
            $advertisement = Advertisement::create($data->toArray());

            if ($data->photos && count($data->photos) > 0) {
                foreach ($data->photos as $photo) {
                    $createGalleryRequest = new CreateGalleryRequest(
                        model_type: Advertisement::class,
                        model_id: (string) $advertisement->id,
                        image: $photo,
                    );

                    $this->galleryService->store($createGalleryRequest);
                }
            }

            DB::commit();

            $advertisement->refresh();

            return $advertisement;
        } catch (Exception $exception) {
            DB::rollBack();

            Log::error('AdvertisementService::store: '.$exception->getMessage());

            throw $exception;
        }
    }

    /**
     * @throws Exception
     */
    public function update(UpdateAdvertisementRequest $data): Advertisement
    {
        try {
            /** @var Advertisement $advertisement */
            $advertisement = Advertisement::findOrFail($data->id);

            DB::beginTransaction();

            $advertisement->update($data->toArray());

            if ($data->photos && count($data->photos) > 0) {
                $this->deleteOldGallery($advertisement);

                foreach ($data->photos as $photo) {
                    $galleryData = [
                        'model_type' => Advertisement::class,
                        'model_id' => (string) $advertisement->id,
                        'image' => $photo,
                    ];

                    CreateGalleryRequest::validate($galleryData);

                    $createGalleryRequest = CreateGalleryRequest::from($galleryData);

                    $this->galleryService->store($createGalleryRequest);
                }
            }

            DB::commit();

            $advertisement->refresh();

            return $advertisement;
        } catch (Exception $exception) {
            DB::rollBack();

            Log::error('AdvertisementService::update: '.$exception->getMessage());

            throw $exception;
        }
    }

    public function delete(DeleteAdvertisementRequest $data): bool
    {
        try {
            /** @var Advertisement $advertisement */
            $advertisement = Advertisement::findOrFail($data->id);

            DB::transaction(function () use ($advertisement) {
                $advertisement->gallery()->delete();
                $advertisement->delete();
            });

            return true;
        } catch (Exception $exception) {
            Log::error('AdvertisementService::delete: '.$exception->getMessage());

            throw $exception;
        }
    }

    private function deleteOldGallery(Advertisement $advertisement)
    {
        try {
            DB::transaction(function () use ($advertisement) {
                $advertisement->gallery()->delete();
            });
        } catch (Exception $exception) {
            throw $exception;
        }
    }
}
