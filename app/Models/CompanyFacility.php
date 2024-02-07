<?php

namespace App\Models;

use App\Casts\JsonCast;
use Dyrynda\Database\Casts\EfficientUuid;
use Dyrynda\Database\Support\BindsOnUuid;
use Dyrynda\Database\Support\GeneratesUuid;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property string $id
 * @property string $uuid
 * @property string $name
 * @property Company $company
 * @property Address $address
 * @property Gallery $gallery
 * @property Schedule $schedule
 * @property Currency $currency
 * @property Sport $sport
 */
class CompanyFacility extends Model
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
        'company_id',
        'type',
        'details',
        'sport_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'uuid' => EfficientUuid::class,
        'details' => JsonCast::class,
    ];

    protected $hidden = [
        'id',
        'company_id',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected $appends = [
        'total_rating',
    ];

    public function totalRating(): Attribute
    {
        return Attribute::make(
            get: function () {
                return $this->ratings()->avg('rating');
            }
        );
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function address(): MorphOne
    {
        return $this->morphOne(Address::class, 'model');
    }

    public function gallery(): MorphMany
    {
        return $this->morphMany(Gallery::class, 'model');
    }

    public function ratings(): MorphMany
    {
        return $this->morphMany(Rating::class, 'rated_entity');
    }

    public function schedule(): HasOne
    {
        return $this->hasOne(Schedule::class);
    }

    public function currency(): BelongsTo
    {
        return $this->company->currency();
    }

    public function sport(): BelongsTo
    {
        return $this->belongsTo(Sport::class);
    }
}
