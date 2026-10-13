<?php

namespace App\Services;

use App\Enums\Role;
use App\Exceptions\ApiException;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    public function register(string $name, string $email, string $password, Role $role): User
    {
        if (User::where('email', $email)->exists()) {
            throw new ApiException('Email already in use', 409);
        }

        return User::create([
            'name' => $name,
            'email' => $email,
            'password' => $password,
            'role' => $role,
            'is_active' => true,
        ]);
    }

    public function login(string $email, string $password): User
    {
        $user = User::where('email', $email)->first();

        if (! $user || ! $user->is_active || ! Hash::check($password, $user->password)) {
            throw new ApiException('Invalid email or password', 401);
        }

        return $user;
    }

    public function changePassword(User $user, string $currentPassword, string $newPassword): User
    {
        if (! Hash::check($currentPassword, $user->password)) {
            throw new ApiException('Current password is incorrect', 400);
        }

        $user->password = $newPassword;
        $user->save();

        return $user;
    }
}