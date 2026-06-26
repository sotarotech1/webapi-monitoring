<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    "paths" => ["api/*", "sanctum/csrf-cookie", "broadcasting/auth"],

    "allowed_methods" => ["*"],

    "allowed_origins" => array_filter(
        array_map(
            "trim",
            explode(",", env("CORS_ALLOWED_ORIGINS", "http://localhost:4200")),
        ),
    ),

    "allowed_origins_patterns" => [],

    "allowed_headers" => ["*"],

    "exposed_headers" => [],

    "max_age" => 86400,

    // Bearer token auth does not use cookies, so credentials are not needed.
    // Keep false to allow wildcard-style origin lists without browser restrictions.
    "supports_credentials" => false,
];
