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
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property string $id
 * @property string $uuid
 * @property string $model_id
 * @property Country $country
 */
class Address extends Model
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
        'model_type',
        'model_id',
        'line_1',
        'line_2',
        'line_3',
        'city',
        'region',
        'postcode',
        'geocode_data',
        'country_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'uuid' => EfficientUuid::class,
        'geocode_data' => JsonCast::class,
        'model_id' => 'string',
    ];

    protected $appends = [
        'country_uuid',
    ];

    protected $hidden = [
        'id',
        'country_id',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    public function countryUuid(): Attribute
    {
        return Attribute::make(
            get: function () {
                return $this->country->uuid;
            }
        );
    }
}
