<?php

namespace App\Http\Controllers;

use App\Contracts\Services\CompanySurveyServiceInterface;
use App\Services\Data\CompanySurvey\CreateCompanySurveyRequest;
use App\Services\Data\CompanySurvey\CreateUserResponseRequest;
use App\Services\Data\CompanySurvey\GetAllCompanySurveysRequest;
use App\Services\Data\CompanySurvey\GetCompanySurveyRequest;
use App\Services\Data\CompanySurvey\SendCompanyLatestSurveyRequest;
use App\Services\Data\CompanySurvey\UpdateCompanySurveyRequest;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class CompanySurveyController extends Controller
{
    public function __construct(
        protected CompanySurveyServiceInterface $companySurveyService
    ) {
    }

    public function get(GetCompanySurveyRequest $request): JsonResponse
    {
        try {
            $data = $this->companySurveyService->get($request);

            return response()->json([
                'message' => __('Company Survey has been retreived successfully.'),
                'data' => $data->toArray(),
            ], Response::HTTP_OK);
        } catch (ValidationException $exception) {
            Log::error('Unable to retreived Company Survey: '.$exception->getMessage());

            return response()->json(['message' => $exception->getMessage()], Response::HTTP_BAD_REQUEST);
        } catch (Exception $exception) {
            Log::error('Unable to retreived Company Survey: '.$exception->getMessage());

            return response()->json(['message' => __('Failed to retreived Company Survey.')], Response::HTTP_BAD_REQUEST);
        }
    }

    public function getAllByCompany(GetAllCompanySurveysRequest $request): JsonResponse
    {
        try {
            $data = $this->companySurveyService->getAllByCompany($request);

            return response()->json([
                'message' => __('Company Surveys has been retreived successfully.'),
                'data' => $data->toArray(),
            ], Response::HTTP_OK);
        } catch (ValidationException $exception) {
            Log::error('Unable to retreived Company Surveys: '.$exception->getMessage());

            return response()->json(['message' => $exception->getMessage()], Response::HTTP_BAD_REQUEST);
        } catch (Exception $exception) {
            Log::error('Unable to retreived Company Surveys: '.$exception->getMessage());

            return response()->json(['message' => __('Failed to retreived Company Surveys.')], Response::HTTP_BAD_REQUEST);
        }
    }

    public function store(CreateCompanySurveyRequest $request): JsonResponse
    {
        try {
            $data = $this->companySurveyService->store($request);

            return response()->json([
                'message' => __('Company Survey has been created successfully.'),
                'data' => $data->toArray(),
            ], Response::HTTP_OK);
        } catch (ValidationException $exception) {
            Log::error('Unable to store Company Survey: '.$exception->getMessage());

            return response()->json(['message' => $exception->getMessage()], Response::HTTP_BAD_REQUEST);
        } catch (Exception $exception) {
            Log::error('Unable to store Company Survey: '.$exception->getMessage());

            return response()->json(['message' => __('Failed to create Company Survey.')], Response::HTTP_BAD_REQUEST);
        }
    }

    public function update(UpdateCompanySurveyRequest $request): JsonResponse
    {
        try {
            $data = $this->companySurveyService->update($request);

            return response()->json([
                'message' => __('Company Survey has been updated successfully.'),
                'data' => $data->toArray(),
            ], Response::HTTP_OK);
        } catch (ValidationException $exception) {
            Log::error('Unable to updated Company Survey: '.$exception->getMessage());

            return response()->json(['message' => $exception->getMessage()], Response::HTTP_BAD_REQUEST);
        } catch (Exception $exception) {
            Log::error('Unable to updated Company Survey: '.$exception->getMessage());

            return response()->json(['message' => __('Failed to updated Company Survey.')], Response::HTTP_BAD_REQUEST);
        }
    }

    public function sendSurvey(SendCompanyLatestSurveyRequest $request)
    {
        try {
            $this->companySurveyService->sendSurvey($request);
        } catch (Exception $exception) {
            Log::error('Unable to send the survey to the company customers: '.$exception->getMessage());

            return response()->json(['message' => __('Failed to send the survey to the company customers.')], Response::HTTP_BAD_REQUEST);
        }
    }

    public function userResponse(CreateUserResponseRequest $request)
    {
        try {
            $this->companySurveyService->userResponse($request);

            return response()->json(['message' => __('User Response has been submitted successfully!')], Response::HTTP_OK);
        } catch (ValidationException $exception) {
            Log::error('Failed to submit the Survey\'s User Reponse: '.$exception->getMessage());

            return response()->json(['message' => $exception->getMessage()], Response::HTTP_BAD_REQUEST);
        } catch (Exception $exception) {
            Log::error('Unable to submit the Survey\'s User Reponse: '.$exception->getMessage());

            return response()->json(['message' => __('Failed to submit the Survey\'s User Reponse.')], Response::HTTP_BAD_REQUEST);
        }
    }
}
