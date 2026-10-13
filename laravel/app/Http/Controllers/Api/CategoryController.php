<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Category\ReorderCategoriesRequest;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Services\CategoryService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function __construct(private readonly CategoryService $categories)
    {
    }

    public function index(Request $request, string $cafe): JsonResponse
    {
        $result = $this->categories->paginate(
            $cafe,
            $request->integer('page') ?: null,
            $request->integer('limit') ?: null,
            $request->user(),
        );

        return ApiResponse::success(CategoryResource::collection($result['items']), $result['pagination']);
    }

    public function store(StoreCategoryRequest $request, string $cafe): JsonResponse
    {
        $data = $request->validated();
        $attributes = ['name' => $data['name']];

        if (array_key_exists('description', $data)) {
            $attributes['description'] = $data['description'];
        }

        if (array_key_exists('displayOrder', $data) && $data['displayOrder'] !== null) {
            $attributes['display_order'] = $data['displayOrder'];
        }

        $category = $this->categories->create($cafe, $attributes, $request->user());

        return ApiResponse::success(new CategoryResource($category), null, 201);
    }

    public function show(Request $request, string $cafe, string $category): JsonResponse
    {
        return ApiResponse::success(
            new CategoryResource($this->categories->find($cafe, $category, $request->user()))
        );
    }

    public function update(UpdateCategoryRequest $request, string $cafe, string $category): JsonResponse
    {
        $data = $request->validated();
        $attributes = [];

        foreach (['name', 'description'] as $field) {
            if (array_key_exists($field, $data)) {
                $attributes[$field] = $data[$field];
            }
        }

        if (array_key_exists('displayOrder', $data) && $data['displayOrder'] !== null) {
            $attributes['display_order'] = $data['displayOrder'];
        }

        if (array_key_exists('isActive', $data)) {
            $attributes['is_active'] = $data['isActive'];
        }

        return ApiResponse::success(
            new CategoryResource($this->categories->update($cafe, $category, $attributes, $request->user()))
        );
    }

    public function destroy(Request $request, string $cafe, string $category): JsonResponse
    {
        $this->categories->delete($cafe, $category, $request->user());

        return ApiResponse::success(null);
    }

    public function reorder(ReorderCategoriesRequest $request, string $cafe): JsonResponse
    {
        $items = collect($request->validated('items'))
            ->map(fn (array $item): array => [
                'id' => $item['id'],
                'display_order' => $item['displayOrder'],
            ])
            ->all();

        $result = $this->categories->reorder($cafe, $items, $request->user());

        return ApiResponse::success(CategoryResource::collection($result['items']), $result['pagination']);
    }
}