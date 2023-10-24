<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\Services\GalleryServiceInterface;
use App\Models\Gallery;
use App\Services\Data\Gallery\CreateGalleryRequest;
use App\Services\Data\Gallery\UpdateGalleryRequest;
use App\Traits\ImageUpload;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class GalleryService implements GalleryServiceInterface
{
    use ImageUpload;

    public function store(CreateGalleryRequest $data): Gallery
    {
        $uploadedImg = null;

        try {
            DB::beginTransaction();

            /** @var Gallery $gallery */
            $gallery = Gallery::create($data->toArray());

            if ($data->image) {
                $uploadedImg = $this->uploadImage($data->image, $gallery->id);
                $gallery->image = $uploadedImg;
                $gallery->save();
            }

            DB::commit();

            return $gallery;
        } catch (Exception $exception) {
            DB::rollBack();

            if ($uploadedImg) {
                $this->deleteImage($uploadedImg);
            }

            Log::error('GalleryService::store: '.$exception->getMessage());

            throw $exception;
        }
    }

    public function update(UpdateGalleryRequest $data): Gallery
    {
        try {
            $id = $data->id ?? $data->id_from_route;

            if (! $id) {
                throw ValidationException::withMessages(['id' => __('id is required.')]);
            }

            /** @var Gallery $gallery */
            $gallery = Gallery::findOrFail($id);

            DB::beginTransaction();

            $gallery->update($data->toArray());

            $uploadedImg = null;

            if ($data->image) {
                $uploadedImg = $this->uploadImage($data->image, $gallery->id);
                $gallery->image = $uploadedImg;
                $gallery->save();
            }

            DB::commit();

            return $gallery;
        } catch (Exception $exception) {
            DB::rollBack();

            if (! empty($uploadedImg)) {
                $this->deleteImage($uploadedImg);
            }

            Log::error('GalleryService::update: '.$exception->getMessage());

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
                $path = $this->base64ToImage($image, 'galleries', $imageData);
            } while (! Storage::disk('public')->put($path, $imageData));

            // delete the old logo
            if ($id) {
                /** @var Gallery $gallery */
                $gallery = Gallery::findOrFail($id);

                if ($gallery->image) {
                    $this->deleteImage($gallery->image);
                }
            }

            return $path;
        } catch (Exception $exception) {
            Log::error('Uploading gallery picture: '.$exception->getMessage());

            throw $exception;
        }
    }

    private function deleteImage(string $image): bool
    {
        try {
            return Storage::disk('public')->delete($image);
        } catch (Exception $exception) {
            Log::error('Delete gallery picture: '.$exception->getMessage());

            throw $exception;
        }
    }
}
