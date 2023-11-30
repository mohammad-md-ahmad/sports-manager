<?php

declare(strict_types=1);

namespace App\Services\Integrations;

class HttpWrapperResponse
{
    public function __construct(
        protected string $url,
        protected string $method,
        protected ?array $data,
        protected int $responseStatus,
        protected ?array $response = null,
        protected ?array $errors = null,
    ) {
    }

    public function url(): string
    {
        return $this->url;
    }

    public function method(): string
    {
        return $this->method;
    }

    public function data(): ?array
    {
        return $this->data;
    }

    public function responseStatus(): ?int
    {
        return $this->responseStatus;
    }

    public function response(): ?array
    {
        return $this->response;
    }

    public function toArray(): array
    {
        return [
            'url' => $this->url,
            'method' => $this->method,
            'data' => $this->data,
            'response_status' => $this->responseStatus,
            'response' => $this->response,
            'errors' => $this->errors,
        ];
    }

    public function errors(): ?array
    {
        return $this->errors;
    }
}
