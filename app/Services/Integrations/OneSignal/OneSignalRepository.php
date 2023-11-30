<?php

namespace App\Services\Integrations\OneSignal;

//use App\Enums\PaymentInstrumentProviderConfigurationKeyEnum;
//use App\Services\Integrations\B4B\ApiEventLogRepository;
//use App\Services\Integrations\B4B\Data\B4BResponse;
use App\Services\Integrations\HttpRequestTypesEnum;
use App\Services\Integrations\HttpWrapper;
use Exception;

class OneSignalRepository
{
    const APP_ID = 'c9163259-17f6-4cd0-b6c6-6d3a9241f1b4';

    const CREATE_NOTIFICATION = '/notifications';

    const CREATE_USER = '/apps/'.self::APP_ID.'/users';

    private HttpWrapper $httpWrapper;

    /**
     * @throws Exception
     */
    public function __construct()
    {
        $this->httpWrapper = new HttpWrapper('one-signal');
    }

    public function createNotification($data): OneSignalResponse
    {
        $requestBody = [
            'tag' => $data['one_signal_user_id'],
        ];

        $this->httpWrapper->buildRequest(
            self::CREATE_NOTIFICATION,
            'POST',
            $requestBody,
        );

        $result = $this->httpWrapper->makeRequest(HttpRequestTypesEnum::BasicAuth);
        dd($result);
        $response = new OneSignalResponse(
            'company_information',
            $result->responseStatus(),
            $result->response(),
            $result->errors()
        );

        return $response;
    }

    public function createUser(): OneSignalResponse
    {
        $data = [];

        $this->httpWrapper->buildRequest(
            self::CREATE_USER,
            'POST',
            $data,
        );

        $result = $this->httpWrapper->makeRequest(HttpRequestTypesEnum::BasicAuth);

        $response = new OneSignalResponse(
            'company_information',
            $result->responseStatus(),
            $result->response(),
            $result->errors()
        );

        return $response;
    }
}
