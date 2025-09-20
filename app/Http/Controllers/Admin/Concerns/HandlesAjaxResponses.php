<?php

namespace App\Http\Controllers\Admin\Concerns;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;

trait HandlesAjaxResponses
{
    protected function paginatedResponse(LengthAwarePaginator $paginator, callable $transformer, array $extra = []): JsonResponse
    {
        $payload = [
            'data' => $paginator->getCollection()->map(
                fn ($item) => $transformer($item)
            )->values(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'from' => $paginator->firstItem(),
                'to' => $paginator->lastItem(),
            ],
            'links' => [
                'path' => $paginator->path(),
                'next' => $paginator->nextPageUrl(),
                'prev' => $paginator->previousPageUrl(),
            ],
        ];

        if (isset($extra['meta'])) {
            $payload['meta'] = array_merge($payload['meta'], $extra['meta']);
            unset($extra['meta']);
        }

        if (!empty($extra)) {
            $payload = array_merge($payload, $extra);
        }

        return response()->json($payload);
    }

    protected function messageResponse(string $message, ?array $payload = null, int $status = 200): JsonResponse
    {
        $response = ['message' => $message];

        if ($payload !== null) {
            $response['data'] = $payload;
        }

        return response()->json($response, $status);
    }

    protected function parseBooleanFilter($value): ?bool
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (is_bool($value)) {
            return $value;
        }

        $value = strtolower((string) $value);

        if (in_array($value, ['1', 'true', 'yes', 'on'], true)) {
            return true;
        }

        if (in_array($value, ['0', 'false', 'no', 'off'], true)) {
            return false;
        }

        return null;
    }
}