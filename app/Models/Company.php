<?php

namespace App\Models;

use Dyrynda\Database\Casts\EfficientUuid;
use Dyrynda\Database\Support\BindsOnUuid;
use Dyrynda\Database\Support\GeneratesUuid;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property string $id
 * @property string $uuid
 * @property CompanyUser $companyUser
 */
class Company extends Model
{
    use BindsOnUuid;
    use GeneratesUuid;
    use HasFactory;
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

    //    protected $appends = [
    //        'hasBookedSlot',
    //    ];

    public function logo(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value ? config('filesystems.images_url').'?path='.$value : null
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

    public function companyUser(): ?CompanyUser
    {
        /** @var CompanyUser $companyUser */
        $companyUser = $this->hasMany(CompanyUser::class)->first();

        return $companyUser;
    }
}
