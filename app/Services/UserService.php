<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\Services\UserServiceInterface;
use App\Enums\UserGender;
use App\Models\User;
use App\Models\UserPersonalInfo;
use App\Services\Data\User\CreateUserRequest;
use App\Services\Data\User\DeleteUserRequest;
use App\Services\Data\User\GetUserRequest;
use App\Services\Data\User\UpdateUserRequest;
use App\Traits\ImageUpload;
use Exception;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class UserService implements UserServiceInterface
{
    use ImageUpload;

    /**
     * @throws Exception
     */
    public function getAll(): LengthAwarePaginator
    {
        try {
            return User::jsonPaginate();
        } catch (Exception $exception) {
            Log::error($exception->getMessage());

            throw $exception;
        }
    }

    public function get(GetUserRequest $data): User
    {
        try {
            /** @var User $user */
            $user = User::findOrFail($data->id);

            return User::with([])->find($user->id);
        } catch (Exception $exception) {
            Log::error('UserService::get: '.$exception->getMessage());

            throw $exception;
        }
    }

    public function store(CreateUserRequest $data): User
    {
        try {
            $uploadedImg = null;

            $data->password = Hash::make($data->password);

            $userData = $data->toArray();
            unset($userData['gender']);
            unset($userData['dob']);

            DB::beginTransaction();

            /** @var User $user */
            $user = User::create($userData);

            // after company got updated successfully, upload and update the logo
            if ($data->profile_picture && is_string($data->profile_picture)) {
                $uploadedImg = $this->uploadImage($data->profile_picture, $user->id);
                $user->profile_picture = $uploadedImg;
                $user->save();
            }

            $genderEnum = UserGender::tryFromName($data->gender);

            UserPersonalInfo::create([
                'user_id' => $user->id,
                'gender' => $genderEnum ? $genderEnum->name : null,
                'dob' => $data->dob,
            ]);

            DB::commit();

            return User::with([])->find($user->id);
        } catch (Exception $exception) {
            DB::rollBack();

            if ($uploadedImg) {
                $this->deleteImage($uploadedImg);
            }

            Log::error('UserService::store: '.$exception->getMessage());

            throw $exception;
        }
    }

    public function update(UpdateUserRequest $data): User
    {
        $uploadedImg = null;

        try {
            $userId = $data->id ?? $data->id_from_route;

            if (! $userId) {
                throw ValidationException::withMessages(['id' => __('id is required.')]);
            }

            /** @var User $user */
            $user = User::findOrFail($userId);

            DB::beginTransaction();

            $userData = $data->toArray();
            unset($userData['gender']);
            unset($userData['dob']);

            $user->update($userData);

            // after company got updated successfully, upload and update the logo
            if ($data->profile_picture && is_string($data->profile_picture)) {
                $uploadedImg = $this->uploadImage($data->profile_picture, $user->id);
                $user->profile_picture = $uploadedImg;
                $user->save();
            }

            $userPersonalInfo = UserPersonalInfo::query()->where('user_id', $user->id)->first();
            $genderEnum = UserGender::tryFromName($data->gender);

            if ($userPersonalInfo) {
                $userPersonalInfo->update([
                    'gender' => $genderEnum ? $genderEnum->name : null,
                    'dob' => $data->dob,
                ]);
            } else {
                UserPersonalInfo::create([
                    'user_id' => $user->id,
                    'gender' => $genderEnum ? $genderEnum->name : null,
                    'dob' => $data->dob,
                ]);
            }

            DB::commit();

            return User::with([])->find($user->id);
        } catch (Exception $exception) {
            DB::rollBack();

            if ($uploadedImg) {
                $this->deleteImage($uploadedImg);
            }

            Log::error('UserService::update: '.$exception->getMessage());

            throw $exception;
        }
    }

    public function delete(DeleteUserRequest $data): bool
    {
        try {
            return User::findOrFail($data->id)->delete();
        } catch (Exception $exception) {
            Log::error('UserService::delete: '.$exception->getMessage());

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
                $path = $this->base64ToImage($image, 'user-profile-pictures', $imageData);
            } while (! Storage::disk('public')->put($path, $imageData));

            // delete the old logo
            if ($id) {
                /** @var User $user */
                $user = User::findOrFail($id);

                if ($user->profile_picture) {
                    $this->deleteImage($user->profile_picture);
                }
            }

            return $path;
        } catch (Exception $exception) {
            Log::error('Uploading user profile picture: '.$exception->getMessage());

            throw $exception;
        }
    }

    private function deleteImage(string $image): bool
    {
        try {
            return Storage::disk('public')->delete($image);
        } catch (Exception $exception) {
            Log::error('Delete user profile picture: '.$exception->getMessage());

            throw $exception;
        }
    }
}
