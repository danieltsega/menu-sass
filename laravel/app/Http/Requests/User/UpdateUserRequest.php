<?php

namespace App\Http\Requests\User;

use App\Enums\Role;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:100'],
            'email' => ['sometimes', 'email', 'max:255'],
            'password' => ['sometimes', 'nullable', 'string', 'min:6', 'max:128'],
            'role' => ['sometimes', Rule::enum(Role::class)],
            'isActive' => ['sometimes', 'boolean'],
        ];
    }
}