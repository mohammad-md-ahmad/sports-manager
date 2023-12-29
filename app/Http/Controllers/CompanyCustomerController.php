<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Contracts\Services\CompanyCustomerServiceInterface;
use App\Services\Data\CompanyCustomer\CreateCompanyCustomerRequest;
use App\Services\Data\CompanyCustomer\DeleteCompanyCustomerRequest;
use App\Services\Data\CompanyCustomer\GetCompanyCustomersRequest;
use App\Services\Data\CompanyCustomer\ToggleAutoApproveCompanyCustomerRequest;
use App\Services\Data\CompanyCustomer\UpdateCompanyCustomerRequest;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use LogicException;

class CompanyCustomerController extends Controller
{
    public function __construct(
        protected CompanyCustomerServiceInterface $companyCustomerService
    ) {
    }

    public function getAll(GetCompanyCustomersRequest $request): JsonResponse
    {
        try {
            $data = $this->companyCustomerService->getAll($request);

            return response()->json([
                'message' => __('Company Customers has been retrieved successfully!'),
                'data' => $data,
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error($exception->getMessage());

            return response()->json([
                'message' => __('Unable to retrieve Company Customers!'),
                'errors' => $exception->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    public function store(CreateCompanyCustomerRequest $request): JsonResponse
    {
        try {
            $data = $this->companyCustomerService->store($request);

            return response()->json([
                'message' => __('Company Customers has been created successfully.'),
                'data' => $data->toArray(),
            ], Response::HTTP_OK);
        } catch (LogicException $exception) {
            Log::error('Unable to store Company Customers: '.$exception->getMessage());

            return response()->json(['message' => $exception->getMessage()], Response::HTTP_BAD_REQUEST);
        } catch (Exception $exception) {
            Log::error('Unable to store Company Customers: '.$exception->getMessage());

            return response()->json(['message' => __('Failed to complete Company Customers.')], Response::HTTP_BAD_REQUEST);
        }
    }

    public function update(UpdateCompanyCustomerRequest $request): JsonResponse
    {
        try {
            $data = $this->companyCustomerService->update($request);

            return response()->json([
                'message' => __('Company Customer has been updated successfully.'),
                'data' => $data->toArray(),
            ], Response::HTTP_OK);
        } catch (ValidationException $exception) {
            Log::error('Unable to store Company Customer : '.$exception->getMessage());

            return response()->json([
                'message' => __('Failed to update Company Customer.'),
                'errors' => $exception->validator->errors()->messages(),
            ], Response::HTTP_BAD_REQUEST);
        } catch (Exception $exception) {
            Log::error('Unable to update Company Customer: '.$exception->getMessage());

            return response()->json(['message' => __('Failed to update Company Customer.')], Response::HTTP_BAD_REQUEST);
        }
    }

    public function delete(DeleteCompanyCustomerRequest $request): JsonResponse
    {
        try {
            $this->companyCustomerService->delete($request);

            return response()->json([
                'message' => __('Company Customer has been deleted successfully.'),
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error('Unable to delete Company Customer: '.$exception->getMessage());

            return response()->json(['message' => __('Failed to delete Company Customer.')], Response::HTTP_BAD_REQUEST);
        }
    }

    public function toggleAutoApprove(ToggleAutoApproveCompanyCustomerRequest $request): JsonResponse
    {
        try {
            $data = $this->companyCustomerService->toggleAutoApprove($request);

            return response()->json([
                'message' => __('Company Customer has been updated successfully.'),
            ], Response::HTTP_OK);
        } catch (ValidationException $exception) {
            Log::error('Unable to store Company Customer : '.$exception->getMessage());

            return response()->json([
                'message' => __('Failed to update Company Customer.'),
                'errors' => $exception->validator->errors()->messages(),
            ], Response::HTTP_BAD_REQUEST);
        } catch (Exception $exception) {
            Log::error('Unable to update Company Customer: '.$exception->getMessage());

            return response()->json(['message' => __('Failed to update Company Customer.')], Response::HTTP_BAD_REQUEST);
        }
    }
}
