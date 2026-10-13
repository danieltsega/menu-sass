<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MenuResource;
use App\Services\MenuService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class MenuController extends Controller
{
    public function __construct(private readonly MenuService $menus)
    {
    }

    public function getMenu(string $cafeSlug): JsonResponse
    {
        return ApiResponse::success(new MenuResource($this->menus->getPublicMenu($cafeSlug)));
    }
}