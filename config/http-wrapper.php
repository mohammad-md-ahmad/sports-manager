<?php

return [
    'retries' => env('HTTP_WRAPPER_RETRIES', 1),
    'milliseconds_between_retries' => env('HTTP_WRAPPER_MILLISECONDS_BETWEEN_RETRIES', 500),
    'connect_timeout_in_seconds' => env('HTTP_WRAPPER_CONNECT_TIMEOUT_IN_SECONDS', 5),
    'request_timeout_in_seconds' => env('HTTP_WRAPPER_REQUEST_TIMEOUT_IN_SECONDS', 15),
];
