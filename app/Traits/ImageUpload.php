<?php

namespace App\Traits;

use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

trait ImageUpload
{
    public function base64Decode(string $image): bool|string
    {
        return base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $image));
    }

    /**
     * @throws ValidationException
     */
    public function base64ToImage(string $image, string $parentDir, string $base64Decode = null): string
    {
        $imgData = ! empty($base64Decode) ? $base64Decode : $this->base64Decode($image);

        // detect the image format (JPEG, PNG)
        $imgFormat = finfo_buffer(finfo_open(), $imgData, FILEINFO_MIME_TYPE);

        // detected file extension
        $extension = $this->getImageExtensionFromMimeType($imgFormat);

        // Validation rules
        $rules = [
            'image' => [
                'required',
                'base64image', // Use the custom validation rule
            ],
        ];

        $validator = Validator::make(['image' => $image], $rules);

        if ($validator->fails()) {
            $errors = $validator->errors();

            throw ValidationException::withMessages(! empty($errors->messages()['image']) ? $errors->messages()['image'] : '');
        }

        // generate a unique filename
        $imgName = Str::random(20).'.'.$extension;

        return $parentDir.DIRECTORY_SEPARATOR.$imgName;
    }

    private function getImageExtensionFromMimeType($mimeType): string
    {
        return match ($mimeType) {
            'image/png' => 'png',
            default => 'jpg',
        };
    }
}
