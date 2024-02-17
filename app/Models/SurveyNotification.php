<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $company_survey_id
 * @property string $notification_id
 */
class SurveyNotification extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'company_survey_id',
        'notification_id',
    ];

    protected $hidden = [
        'id',
        'company_survey_id',
        'notification_id',
        'created_at',
        'updated_at',
    ];

    public function companySurvey(): BelongsTo
    {
        return $this->belongsTo(CompanySurvey::class);
    }

    public function notification(): BelongsTo
    {
        return $this->belongsTo(Notification::class);
    }
}
