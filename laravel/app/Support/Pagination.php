<?php

namespace App\Support;

class Pagination
{
    /**
     * @return array{page: int, limit: int, skip: int}
     */
    public static function params(?int $page, ?int $limit): array
    {
        $page = max(1, $page ?: 1);
        $limit = min(max(1, $limit ?: 20), 100);

        return ['page' => $page, 'limit' => $limit, 'skip' => ($page - 1) * $limit];
    }

    /**
     * @param  array{page: int, limit: int, skip: int}  $params
     * @return array{page: int, limit: int, total: int, totalPages: int}
     */
    public static function meta(int $total, array $params): array
    {
        return [
            'page' => $params['page'],
            'limit' => $params['limit'],
            'total' => $total,
            'totalPages' => max(1, (int) ceil($total / $params['limit'])),
        ];
    }
}
