<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\Services\CompanySurveyServiceInterface;
use App\Models\CompanySurvey;
use App\Models\CompanySurveyAnswer;
use App\Models\CompanySurveyQuestion;
use App\Models\CompanySurveyUserResponse;
use App\Services\Data\CompanySurvey\CreateCompanySurveyQuestionRequest;
use App\Services\Data\CompanySurvey\CreateCompanySurveyRequest;
use App\Services\Data\CompanySurvey\CreateSurveyAnswerRequest;
use App\Services\Data\CompanySurvey\CreateUserResponseRequest;
use App\Services\Data\CompanySurvey\GetAllCompanySurveysRequest;
use App\Services\Data\CompanySurvey\GetCompanySurveyRequest;
use App\Services\Data\CompanySurvey\UpdateCompanySurveyRequest;
use Exception;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CompanySurveyService implements CompanySurveyServiceInterface
{
    /**
     * @throws Exception
     */
    public function get(GetCompanySurveyRequest $data): CompanySurvey
    {
        try {
            /** @var CompanySurvey $survey */
            $survey = CompanySurvey::with(['questions', 'company', 'responses.answers.question'])
                ->findOrFail($data->id);

            return $survey;
        } catch (Exception $exception) {
            Log::error('CompanySurveyService::get: '.$exception->getMessage());

            throw $exception;
        }
    }

    /**
     * @throws Exception
     */
    public function getAllByCompany(GetAllCompanySurveysRequest $data): LengthAwarePaginator
    {
        try {
            $surveys = CompanySurvey::where('company_id', $data->company->id);

            return $surveys->with(['questions', 'company'])->jsonPaginate();
        } catch (Exception $exception) {
            Log::error('CompanySurveyService::getAllByCompany: '.$exception->getMessage());

            throw $exception;
        }
    }

    /**
     * @throws Exception
     */
    public function store(CreateCompanySurveyRequest $data): CompanySurvey
    {
        try {
            DB::beginTransaction();

            $createData = $data->toArray();
            $createData['company_id'] = $data->company->id;
            unset($createData['questions']);

            /** @var CompanySurvey $survey */
            $survey = CompanySurvey::create($createData);

            for ($i = 0; $i < count($data->questions); $i++) {
                $question = $data->questions[$i];

                $createQuestionRequest = CreateCompanySurveyQuestionRequest::from([
                    'company_survey_id' => $survey->id,
                    'question' => $question,
                    'question_order' => ($i + 1),
                ]);

                CompanySurveyQuestion::create($createQuestionRequest->toArray());
            }

            DB::commit();

            return $survey;
        } catch (Exception $exception) {
            DB::rollBack();

            Log::error('CompanySurveyService::store: '.$exception->getMessage());

            throw $exception;
        }
    }

    public function update(UpdateCompanySurveyRequest $data): CompanySurvey
    {
        try {
            DB::beginTransaction();

            $updateData = $data->toArray();
            unset($updateData['questions']);

            /** @var CompanySurvey $survey */
            $survey = CompanySurvey::findOrFail($data->id);

            if ($data->is_active) {
                CompanySurvey::query()->where('company_id', $survey->company_id)->update(['is_active' => false]);
            }

            $survey->update($updateData);

            $questionsIds = [];

            for ($i = 0; $i < count($data->questions); $i++) {
                $question = $data->questions[$i];

                $createQuestionRequestArr = [
                    'company_survey_id' => $survey->id,
                    'question' => $question['question'],
                ];

                if (! empty($question['uuid'])) {
                    $questionRecord = CompanySurveyQuestion::whereUuid($question['uuid'])->first();

                    $createQuestionRequestArr['question_order'] = $question['question_order'];

                    $createQuestionRequest = CreateCompanySurveyQuestionRequest::from($createQuestionRequestArr);

                    $questionRecord->update($createQuestionRequest->toArray());

                    $questionsIds[] = $questionRecord->id;
                } elseif (! empty($question['is_new'])) {
                    $createQuestionRequestArr['question_order'] = ($i + 1);

                    $createQuestionRequest = CreateCompanySurveyQuestionRequest::from($createQuestionRequestArr);

                    $newQuestion = CompanySurveyQuestion::create($createQuestionRequest->toArray());

                    $questionsIds[] = $newQuestion->id;
                }
            }

            // delete all not sent questions - assuming the user wants to delete them
            CompanySurveyQuestion::query()
                ->where('company_survey_id', $survey->id)
                ->whereNotIn('id', $questionsIds)
                ->delete();

            DB::commit();

            return $survey;
        } catch (Exception $exception) {
            DB::rollBack();

            Log::error('CompanySurveyService::update: '.$exception->getMessage());

            throw $exception;
        }
    }

    public function userResponse(CreateUserResponseRequest $data): bool
    {
        try {
            DB::beginTransaction();

            $userResponse = CompanySurveyUserResponse::create($data->toArray());

            foreach ($data->answers as $answer) {
                $createAnswerRequest = CreateSurveyAnswerRequest::from(array_merge($answer, ['company_survey_user_response_id' => $userResponse->id]));
                // dd($createAnswerRequest->toArray());
                CompanySurveyAnswer::create($createAnswerRequest->toArray());
            }

            DB::commit();

            return true;
        } catch (Exception $exception) {
            DB::rollBack();

            Log::error('CompanySurveyService::userResponse: '.$exception->getMessage());

            throw $exception;
        }
    }
}
