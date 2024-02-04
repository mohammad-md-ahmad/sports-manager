<?php

namespace App\Models;

use Dyrynda\Database\Casts\EfficientUuid;
use Dyrynda\Database\Support\BindsOnUuid;
use Dyrynda\Database\Support\GeneratesUuid;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Facades\Storage;

class Gallery extends Model
{
    use BindsOnUuid;
    use GeneratesUuid;
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'uuid',
        'model_type',
        'model_id',
        'is_primary',
    ];

    protected $hidden = [
        'id',
        'model_type',
        'model_id',
        'created_at',
        'updated_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'uuid' => EfficientUuid::class,
    ];

    protected $appends = [
        // 'base64',
    ];

    public function image(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value ? config('filesystems.images_url').'?path='.$value : null
        );
    }

    public function base64(): Attribute
    {
        return Attribute::make(
            get: function () {
                $absolutePath = Storage::disk('public')->path($this->original['image']);

                if (file_exists($absolutePath)) {
                    $imageContents = file_get_contents($absolutePath);

                    $base64Image = base64_encode($imageContents);

                    // Add the "data:image/" prefix based on the image type
                    $imageType = mime_content_type($absolutePath);
                    $base64WithPrefix = 'data:'.$imageType.';base64,'.$base64Image;

                    return $base64WithPrefix;
                }

                return null;
            }
        );
    }

    public function model(): MorphTo
    {
        return $this->morphTo();
    }
}
