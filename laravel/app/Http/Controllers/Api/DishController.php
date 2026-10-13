<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dish\ReorderDishesRequest;
use App\Http\Requests\Dish\StoreDishRequest;
use App\Http\Requests\Dish\UpdateDishRequest;
use App\Http\Resources\DishResource;
use App\Services\DishService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DishController extends Controller
{
    public function __construct(private readonly DishService $dishes)
    {
    }

    public function index(Request $request, string $cafe): JsonResponse
    {
        $result = $this->dishes->paginate(
            $cafe,
            $request->integer('page') ?: null,
            $request->integer('limit') ?: null,
            $request->user(),
        );

        return ApiResponse::success(DishResource::collection($result['items']), $result['pagination']);
    }

    public function store(StoreDishRequest $request, string $cafe): JsonResponse
    {
        $data = $request->validated();
        $attributes = [
            'name' => $data['name'],
            'price' => $data['price'],
        ];

        foreach (['description', 'ingredients', 'image'] as $field) {
            if (array_key_exists($field, $data)) {
                $attributes[$field] = $data[$field];
            }
        }

        if (array_key_exists('isAvailable', $data)) {
            $attributes['is_available'] = $data['isAvailable'];
        }

        if (array_key_exists('isFeatured', $data)) {
            $attributes['is_featured'] = $data['isFeatured'];
        }

        $dish = $this->dishes->create($cafe, $data['category'], $attributes, $request->user());

        return ApiResponse::success(new DishResource($dish), null, 201);
    }

    public function show(Request $request, string $cafe, string $dish): JsonResponse
    {
        return ApiResponse::success(
            new DishResource($this->dishes->find($cafe, $dish, $request->user()))
        );
    }

    public function update(UpdateDishRequest $request, string $cafe, string $dish): JsonResponse
    {
        $data = $request->validated();
        $attributes = [];

        foreach (['name', 'description', 'ingredients', 'price', 'image'] as $field) {
            if (array_key_exists($field, $data)) {
                $attributes[$field] = $data[$field];
            }
        }

        if (array_key_exists('category', $data)) {
            $attributes['category_id'] = $data['category'];
        }

        if (array_key_exists('isAvailable', $data)) {
            $attributes['is_available'] = $data['isAvailable'];
        }

        if (array_key_exists('isFeatured', $data)) {
            $attributes['is_featured'] = $data['isFeatured'];
        }

        return ApiResponse::success(
            new DishResource($this->dishes->update($cafe, $dish, $attributes, $request->user()))
        );
    }

    public function destroy(Request $request, string $cafe, string $dish): JsonResponse
    {
        $this->dishes->delete($cafe, $dish, $request->user());

        return ApiResponse::success(null);
    }

    public function reorder(ReorderDishesRequest $request, string $cafe): JsonResponse
    {
        $items = collect($request->validated('items'))
            ->map(fn (array $item): array => [
                'id' => $item['id'],
                'category_id' => $item['category'],
                'display_order' => $item['displayOrder'],
            ])
            ->all();

        $result = $this->dishes->reorder($cafe, $items, $request->user());

        return ApiResponse::success(DishResource::collection($result['items']), $result['pagination']);
    }
}