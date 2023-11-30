<?php

declare(strict_types=1);

namespace App\Services\Integrations;

use Exception;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Generic HttpWrapper class
 */
class HttpWrapper
{
    const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

    protected string $baseUrl;

    protected string $url;

    protected string $method;

    protected array $data;

    protected array $headers = ['Content-Type' => 'application/json'];

    protected ?Response $response = null;

    protected int $responseStatus = 0;

    /**
     * @var ?array
     */
    protected ?array $errors = null;

    protected string $basicAuthKey;

    protected string $basicAuthValue;

    protected ?string $token = null;

    protected int $retries;

    protected int $millisecondsBetweenRetries;

    protected int $connectTimeOutInSeconds;

    protected int $requestTimeOutInSeconds;

    /**
     * @throws Exception
     */
    public function __construct(string $configuration_key)
    {
        $this->retries = (int) config('http-wrapper.retries');
        $this->millisecondsBetweenRetries = (int) config('http-wrapper.milliseconds_between_retries');
        $this->connectTimeOutInSeconds = (int) config('http-wrapper.connect_timeout_in_seconds');
        $this->requestTimeOutInSeconds = (int) config('http-wrapper.request_timeout_in_seconds');

        $key = 'providers.'.$configuration_key;
        $providerConfiguration = config($key);

        if (empty($providerConfiguration['base_url'])) {
            throw new Exception('Unable to instantiate HttpWrapper Class without a base url');
        }

        $this->baseUrl = $this->trimPath($providerConfiguration['base_url']);
        $this->basicAuthKey = $providerConfiguration['username'] ?? '';
        $this->basicAuthValue = $providerConfiguration['password'] ?? '';
    }

    public function buildRequest(string $endpoint, string $method, array $data = [], array $headers = null, string $token = ''): self
    {
        $this->setUrl($endpoint);
        $this->setMethod($method);
        $this->setData($data);
        $this->setHeaders($headers);
        $this->setToken($token);

        return $this;
    }

    public function makeRequest(HttpRequestTypesEnum $type, HttpDataEncodingsEnum $contentType = HttpDataEncodingsEnum::Json, bool $throwAllErrorsAsExceptions = false)
    {
        try {
            $response = match ($type) {
                HttpRequestTypesEnum::BasicAuth => match ($contentType) {
                    HttpDataEncodingsEnum::Form => $this->makeBasicAuthRequest(asForm: true),
                    default => $this->makeBasicAuthRequest()
                },
                HttpRequestTypesEnum::Token => $this->makeTokenRequest()
            };

            $this->setResponseStatus($response->status());
            $this->setResponse($response);

            if (! $response->successful()) {
                Log::error('Unsuccessful Response', ['response' => $response->body()]);
                if (empty($response->body())) {
                    throw new Exception('Unable to Connect to Payment Provider API', $response->status());
                }
                if ($throwAllErrorsAsExceptions) {
                    throw new Exception('Unsuccessful response from Payment Provider API', $response->status());
                }
            }
        } catch (ConnectionException $exception) {
            Log::error($exception->getMessage());
            $this->setErrors([HttpErrorsEnum::Timeout]);
        } catch (Exception $exception) {
            Log::error('Caught exception in HttpWrapper '.$exception->getMessage());
            $this->setErrors([HttpErrorsEnum::fromCode($exception->getCode())]);
        }

        return $this->buildResponse();
    }

    protected function makeBasicAuthRequest(bool $asForm = false): Response
    {
        $method = $this->method ?? HttpMethodsEnum::GET->name;

        if ($asForm) {
            return Http::withBasicAuth($this->basicAuthKey, $this->basicAuthValue)
                ->retry(times: $this->retries, sleepMilliseconds: $this->millisecondsBetweenRetries, when: function (Exception $exception, PendingRequest $request) {
                    return $exception instanceof ConnectionException;
                }, throw: false)
                ->connectTimeout($this->connectTimeOutInSeconds)
                ->timeout($this->requestTimeOutInSeconds)
                ->withHeaders($this->headers)
                ->asForm()
                ->$method(
                    $this->url,
                    $this->data ? $this->data : []
                );
        }

        return Http::withBasicAuth($this->basicAuthKey, $this->basicAuthValue)
            ->retry(times: $this->retries, sleepMilliseconds: $this->millisecondsBetweenRetries, when: function (Exception $exception, PendingRequest $request) {
                return $exception instanceof ConnectionException;
            }, throw: false)
            ->connectTimeout($this->connectTimeOutInSeconds)
            ->timeout($this->requestTimeOutInSeconds)
            ->withHeaders($this->headers)
            ->$method(
                $this->url,
                $this->data ? $this->data : []
            );

    }

    private function makeTokenRequest(): Response
    {
        $method = $this->method ?? HttpMethodsEnum::GET->name;

        return Http::withToken($this->token)
            ->retry(times: $this->retries, sleepMilliseconds: $this->millisecondsBetweenRetries, when: function (Exception $exception, PendingRequest $request) {
                return $exception instanceof ConnectionException;
            }, throw: false)
            ->connectTimeout($this->connectTimeOutInSeconds)
            ->timeout($this->requestTimeOutInSeconds)
            ->withHeaders($this->headers)
            ->$method(
                $this->url,
                $this->data ? $this->data : []
            );
    }

    public function getUrl(): string
    {
        return $this->url;
    }

    public function getMethod(): string
    {
        return $this->method;
    }

    public function getData(): array
    {
        return $this->data;
    }

    public function getHeaders(): array
    {
        return $this->headers;
    }

    private function setUrl(string $endpoint): void
    {
        $this->url = sprintf('%s/%s', $this->baseUrl, $this->trimPath($endpoint));
    }

    private function setMethod(string $method): void
    {
        $method = strtoupper($method);
        if (! in_array($method, self::METHODS)) {
            throw new Exception('Unknown HTTP method: '.$method);
        }
        $this->method = $method;
    }

    private function setData(array $data): void
    {
        $this->data = $data;
    }

    private function setHeaders(?array $headers = []): void
    {
        $this->headers = $headers ? array_merge($headers, $this->headers) : $this->headers;
    }

    private function setToken(string $token): void
    {
        $this->token = $token;
    }

    private function setResponse(Response $response = null): void
    {
        $this->response = $response;
    }

    private function setResponseStatus(int $responseStatus): void
    {
        $this->responseStatus = $responseStatus;
    }

    public function setErrors(?array $errors): void
    {
        $this->errors = $errors;
    }

    public function getErrors(): ?array
    {
        return $this->errors;
    }

    private function buildResponse()
    {
        $responseBody = $this->response && method_exists($this->response, 'json') ? $this->response->json() : null;
        if (! $this->response?->successful() && empty($this->errors) && empty($responseBody)) {
            $responseBody = ['error' => 'Unhandled error: no further information'];
        }
        $wrappedResponse = new HttpWrapperResponse(
            $this->url,
            $this->method,
            $this->data,
            $this->responseStatus,
            $responseBody,
            $this->errors
        );

        return $wrappedResponse;
    }

    private function trimPath(string $path)
    {
        return trim($path, ' /');
    }
}
