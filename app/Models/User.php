<?php

namespace App\Models;

use App\Enums\UserType;
use Dyrynda\Database\Casts\EfficientUuid;
use Dyrynda\Database\Support\BindsOnUuid;
use Dyrynda\Database\Support\GeneratesUuid;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Collection;
use Laravel\Sanctum\HasApiTokens;

/**
 * @property string $id
 * @property string $uuid
 * @property string $first_name
 * @property string $last_name
 * @property string $full_name
 * @property string $username
 * @property string $email
 * @property UserType $type
 * @property string $profile_picture
 * @property UserPersonalInfo $userPersonalInfo
 * @property Collection $bookings
 * @property Collection $notifications
 */
class User extends Authenticatable
{
    use BindsOnUuid;
    use GeneratesUuid;
    use HasApiTokens, HasFactory, Notifiable;
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'uuid',
        'first_name',
        'last_name',
        'email',
        'username',
        'password',
        'type',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'id',
        'password',
        'remember_token',
        'email_verified_at',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'uuid' => EfficientUuid::class,
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'type' => UserType::class,
    ];

    protected $appends = [
        'full_name',
        'dob',
        'gender',
    ];

    public function profilePicture(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value ? config('filesystems.images_url').'?path='.$value : null
        );
    }

    public function fullName(): Attribute
    {
        return Attribute::make(
            get: function () {
                return $this->first_name.' '.$this->last_name;
            }
        );
    }

    public function dob(): Attribute
    {
        return Attribute::make(
            get: function () {
                return $this->userPersonalInfo->dob;
            }
        );
    }

    public function gender(): Attribute
    {
        return Attribute::make(
            get: function () {
                return $this->userPersonalInfo->gender->name;
            }
        );
    }

    public function companyUser(): HasOne
    {
        return $this->hasOne(CompanyUser::class);
    }

    public function company(): Company
    {
        return $this->companyUser->company;
    }

    public function address(): MorphOne
    {
        return $this->morphOne(Address::class, 'model');
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class, 'customer_user_id');
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class, 'user_id');
    }

    public function userPersonalInfo(): HasOne
    {
        return $this->hasOne(UserPersonalInfo::class);
    }
}
