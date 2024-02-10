<?php

namespace App\Services\Integrations\OneSignal;

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
            'app_id' => self::APP_ID,
            'include_aliases' => ['external_id' => $data['user_uuids']],
            'target_channel' => 'push',
            'contents' => ['en' => $data['message']],
            'data' => $data['custom_data'] ?? null,
        ];

        if (! empty($data['buttons'])) {
            $requestBody['buttons'] = $data['buttons'];
        }

        $this->httpWrapper->buildRequest(
            self::CREATE_NOTIFICATION,
            'POST',
            $requestBody,
            [
                'Authorization' => 'Basic '.config('providers.one-signal.rest_api_key'),
            ]
        );

        $result = $this->httpWrapper->makeRequest(HttpRequestTypesEnum::Basic);

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
