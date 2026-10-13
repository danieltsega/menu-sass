<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Services\UserService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct(private readonly UserService $users)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $result = $this->users->paginate(
            $request->integer('page') ?: null,
            $request->integer('limit') ?: null,
            $request->user()?->id,
        );

        return ApiResponse::success(UserResource::collection($result['items']), $result['pagination']);
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $data = $request->validated();

        $user = $this->users->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'role' => $data['role'],
            'is_active' => $data['isActive'] ?? true,
        ]);

        return ApiResponse::success(new UserResource($user), null, 201);
    }

    public function show(string $user): JsonResponse
    {
        return ApiResponse::success(new UserResource($this->users->find($user)));
    }

    public function update(UpdateUserRequest $request, string $user): JsonResponse
    {
        $data = $request->validated();
        $attributes = [];

        foreach (['name', 'email', 'role'] as $field) {
            if (array_key_exists($field, $data)) {
                $attributes[$field] = $data[$field];
            }
        }

        if (array_key_exists('password', $data) && $data['password'] !== null) {
            $attributes['password'] = $data['password'];
        }

        if (array_key_exists('isActive', $data)) {
            $attributes['is_active'] = $data['isActive'];
        }

        return ApiResponse::success(new UserResource($this->users->update($user, $attributes)));
    }

    public function destroy(string $user): JsonResponse
    {
        $this->users->delete($user);

        return ApiResponse::success(null);
    }
}