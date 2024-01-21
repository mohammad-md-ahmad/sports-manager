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
 * @property CompanySurveyUserResponse $companySurveyUserResponse
 * @property CompanySurveyQuestion $question
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
        'company_survey_user_response_id',
        'company_survey_question_id',
        'answer',
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
        'company_survey_user_response_id',
        'company_survey_question_id',
        'created_at',
        'updated_at',
    ];

    public function question(): BelongsTo
    {
        return $this->belongsTo(CompanySurveyQuestion::class, 'company_survey_question_id');
    }

    public function companySurveyUserResponse(): BelongsTo
    {
        return $this->belongsTo(CompanySurveyUserResponse::class);
    }
}
