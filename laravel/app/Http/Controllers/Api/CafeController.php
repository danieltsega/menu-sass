<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cafe\StoreCafeRequest;
use App\Http\Requests\Cafe\UpdateCafeRequest;
use App\Http\Resources\CafeResource;
use App\Services\CafeService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CafeController extends Controller
{
    public function __construct(private readonly CafeService $cafes)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $result = $this->cafes->paginate(
            $request->integer('page') ?: null,
            $request->integer('limit') ?: null,
        );

        return ApiResponse::success(CafeResource::collection($result['items']), $result['pagination']);
    }

    public function store(StoreCafeRequest $request): JsonResponse
    {
        $data = $request->validated();

        $cafe = $this->cafes->create([
            'name' => $data['name'],
            'slug' => $data['slug'],
            'admin_id' => $data['admin'],
            'logo' => $data['logo'] ?? null,
            'description' => $data['description'] ?? null,
            'address' => $data['address'] ?? null,
            'phone' => $data['phone'] ?? null,
        ]);

        return ApiResponse::success(new CafeResource($cafe), null, 201);
    }

    public function show(string $cafe): JsonResponse
    {
        return ApiResponse::success(new CafeResource($this->cafes->find($cafe)));
    }

    public function update(UpdateCafeRequest $request, string $cafe): JsonResponse
    {
        $data = $request->validated();
        $attributes = [];

        foreach (['name', 'slug', 'description', 'logo', 'address', 'phone'] as $field) {
            if (array_key_exists($field, $data)) {
                $attributes[$field] = $data[$field];
            }
        }

        if (array_key_exists('isActive', $data)) {
            $attributes['is_active'] = $data['isActive'];
        }

        return ApiResponse::success(new CafeResource($this->cafes->update($cafe, $attributes)));
    }

    public function destroy(string $cafe): JsonResponse
    {
        $this->cafes->delete($cafe);

        return ApiResponse::success(null);
    }

    public function getMyCafe(Request $request): JsonResponse
    {
        return ApiResponse::success(new CafeResource($this->cafes->findByAdmin($request->user()->id)));
    }

    public function updateMyCafe(UpdateCafeRequest $request): JsonResponse
    {
        $data = $request->validated();
        $attributes = [];

        foreach (['name', 'slug', 'description', 'logo', 'address', 'phone'] as $field) {
            if (array_key_exists($field, $data)) {
                $attributes[$field] = $data[$field];
            }
        }

        return ApiResponse::success(
            new CafeResource($this->cafes->updateByAdmin($request->user()->id, $attributes))
        );
    }
}