<?php

namespace App\Models;

use Dyrynda\Database\Casts\EfficientUuid;
use Dyrynda\Database\Support\BindsOnUuid;
use Dyrynda\Database\Support\GeneratesUuid;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Collection;
use Staudenmeir\EloquentHasManyDeep\HasManyDeep;
use Staudenmeir\EloquentHasManyDeep\HasRelationships;

/**
 * @property string $id
 * @property string $uuid
 * @property string $logo
 * @property CompanyUser $companyUser
 * @property Gallery $gallery
 * @property Address $address
 * @property Collection $bookings
 */
class Company extends Model
{
    use BindsOnUuid;
    use GeneratesUuid;
    use HasFactory;
    use HasRelationships;
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'uuid',
        'name',
        'description',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'uuid' => EfficientUuid::class,
    ];

    protected $hidden = [
        'id',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected $appends = [
        // 'hasBookedSlot',
        'total_rating',
    ];

    public function logo(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value ? config('filesystems.images_url').'?path='.$value : null
        );
    }

    public function totalRating(): Attribute
    {
        return Attribute::make(
            get: function () {
                return $this->ratings()->avg('rating');
            }
        );
    }

    public function facilities(): HasMany
    {
        return $this->hasMany(CompanyFacility::class);
    }

    public function address(): MorphOne
    {
        return $this->morphOne(Address::class, 'model');
    }

    public function gallery(): MorphMany
    {
        return $this->morphMany(Gallery::class, 'model');
    }

    public function companyUser(): ?CompanyUser
    {
        /** @var CompanyUser $companyUser */
        $companyUser = $this->hasMany(CompanyUser::class)->first();

        return $companyUser;
    }

    public function ratings(): MorphMany
    {
        return $this->morphMany(Rating::class, 'rated_entity');
    }

    public function bookings(): HasManyDeep
    {
        return $this->hasManyDeep(Booking::class, [CompanyFacility::class, Schedule::class, ScheduleDetails::class]);
    }
}
