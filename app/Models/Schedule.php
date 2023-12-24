<?php

namespace App\Models;

use Dyrynda\Database\Casts\EfficientUuid;
use Dyrynda\Database\Support\BindsOnUuid;
use Dyrynda\Database\Support\GeneratesUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Collection;

/**
 * @property string $id
 * @property CompanyFacility $facility
 * @property Collection $scheduleDetails
 * @property Collection $bookings
 */
class Schedule extends Model
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
        'company_facility_id',
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

    public function facility(): BelongsTo
    {
        return $this->belongsTo(CompanyFacility::class, 'company_facility_id');
    }

    public function company(): BelongsTo
    {
        return $this->facility->company();
    }

    public function scheduleDetails(): HasMany
    {
        return $this->hasMany(ScheduleDetails::class);
    }

    public function bookings(): HasManyThrough
    {
        return $this->hasManyThrough(
            Booking::class,
            ScheduleDetails::class,
            'schedule_id', // Foreign key on company_facilities table
            'schedule_details_id', // Foreign key on schedules table
            'id', // Local key on schedules table
            'id' // Local key on schedule_details table
        );
    }
}
