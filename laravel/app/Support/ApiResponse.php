<?php

namespace App\Support;

use Illuminate\Http\JsonResponse;

class ApiResponse
{
    public static function success(mixed $data = null, ?array $pagination = null, int $status = 200): JsonResponse
    {
        $payload = ['success' => true, 'data' => $data];

        if ($pagination !== null) {
            $payload['pagination'] = $pagination;
        }

        return response()->json($payload, $status);
    }

    public static function error(string $message, int $status = 400, ?array $details = null): JsonResponse
    {
        $payload = ['success' => false, 'error' => $message];

        if ($details !== null) {
            $payload['details'] = $details;
        }

        return response()->json($payload, $status);
    }
}
