<?php

namespace App\Http\Controllers\Api;

use App\Enums\Role;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ChangePasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function __construct(private readonly AuthService $auth)
    {
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        $data = $request->validated();

        $user = $this->auth->register(
            $data['name'],
            $data['email'],
            $data['password'],
            Role::from($data['role']),
        );

        Auth::login($user);
        $request->session()->regenerate();

        return ApiResponse::success(['user' => new UserResource($user)], null, 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $data = $request->validated();

        $user = $this->auth->login($data['email'], $data['password']);

        Auth::login($user);
        $request->session()->regenerate();

        return ApiResponse::success(['user' => new UserResource($user)]);
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return ApiResponse::success(null);
    }

    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        $data = $request->validated();

        $user = $this->auth->changePassword(
            $request->user(),
            $data['currentPassword'],
            $data['newPassword'],
        );

        return ApiResponse::success(new UserResource($user));
    }
}