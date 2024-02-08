<?php

namespace App\Models;

use Dyrynda\Database\Casts\EfficientUuid;
use Dyrynda\Database\Support\BindsOnUuid;
use Dyrynda\Database\Support\GeneratesUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property string $id
 * @property string $uuid
 * @property string $title
 * @property string $description
 * @property Carbon $effective_from
 * @property Carbon $effective_to
 * @property string $url
 * @property Gallery $gallery
 */
class Advertisement extends Model
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
        'title',
        'description',
        'effective_from',
        'effective_to',
        'url',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'uuid' => EfficientUuid::class,
        'effective_from' => 'datetime:Y-m-d H:i:s',
        'effective_to' => 'datetime:Y-m-d H:i:s',
    ];

    protected $hidden = [
        'id',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function gallery(): MorphMany
    {
        return $this->morphMany(Gallery::class, 'model');
    }
}
