<?php

namespace App\Models;

use Dyrynda\Database\Casts\EfficientUuid;
use Dyrynda\Database\Support\BindsOnUuid;
use Dyrynda\Database\Support\GeneratesUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $uuid
 * @property string $answer
 * @property CompanySurveyQuestion $companySurveyQuestion
 * @property User $user
 */
class CompanySurveyAnswer extends Model
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
        'company_survey_question_id',
        'user_id',
        'answer',
        'booking_id',
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
        'company_survey_question_id',
        'user_id',
        'created_at',
        'updated_at',
    ];

    public function companySurveyQuestion(): BelongsTo
    {
        return $this->belongsTo(CompanySurveyQuestion::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
