<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\Services\CompanySurveyServiceInterface;
use App\Models\CompanyFacility;
use App\Models\CompanySurvey;
use App\Models\CompanySurveyQuestion;
use App\Services\Data\CompanyFacility\GetCompanyFacilitiesRequest;
use App\Services\Data\CompanyFacility\GetCompanyFacilityRequest;
use App\Services\Data\CompanyFacility\SearchCompanyFacilitiesRequest;
use App\Services\Data\CompanySurvey\CreateCompanySurveyQuestionRequest;
use App\Services\Data\CompanySurvey\CreateCompanySurveyRequest;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CompanySurveyService implements CompanySurveyServiceInterface
{
    // /**
    //  * @throws Exception
    //  */
    // public function get(GetCompanyFacilityRequest $data): CompanyFacility
    // {
    //     try {
    //         /** @var CompanyFacility $companyFacility */
    //         $companyFacility = CompanyFacility::findOrFail($data->id);

    //         return $companyFacility->with(['company', 'address.country', 'gallery'])->first();
    //     } catch (Exception $exception) {
    //         Log::error('CompanyFacilityService::get: '.$exception->getMessage());

    //         throw $exception;
    //     }
    // }

    // /**
    //  * @throws Exception
    //  */
    // public function getAll(SearchCompanyFacilitiesRequest $data): LengthAwarePaginator
    // {
    //     try {
    //         $facilitiesQuery = CompanyFacility::query();

    //         $facilitiesQuery->when($data->name, function (Builder $query) use ($data) {
    //             $query->where('name', 'LIKE', '%'.$data->name.'%');
    //         });

    //         $facilitiesQuery->when($data->type, function (Builder $query) use ($data) {
    //             $query->where('type', $data->type);
    //         });

    //         $facilitiesQuery->when($data->country_id, function (Builder $query) use ($data) {
    //             $query->whereHas('address', function (Builder $query) use ($data) {
    //                 $query->where('country_id', $data->country_id);
    //             });
    //         });

    //         $facilitiesQuery->when($data->city, function (Builder $query) use ($data) {
    //             $query->whereHas('address', function (Builder $query) use ($data) {
    //                 $query->where('city', 'LIKE', '%'.$data->city.'%');
    //             });
    //         });

    //         return $facilitiesQuery->with(['company', 'address.country', 'gallery', 'schedule.bookings'])->jsonPaginate();
    //     } catch (Exception $exception) {
    //         Log::error('CompanyFacilityService::getAll: '.$exception->getMessage());

    //         throw $exception;
    //     }
    // }

    // /**
    //  * @throws Exception
    //  */
    // public function getAllByCompany(GetCompanyFacilitiesRequest $data): Collection
    // {
    //     try {
    //         return $data->company->facilities()->with(['company', 'address.country', 'gallery'])->get();
    //     } catch (Exception $exception) {
    //         Log::error('CompanyFacilityService::getAllByCompany: '.$exception->getMessage());

    //         throw $exception;
    //     }
    // }

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

            return $survey->with(['questions'])->first();
        } catch (Exception $exception) {
            DB::rollBack();

            Log::error('CompanySurveyService::store: '.$exception->getMessage());

            throw $exception;
        }
    }
}
