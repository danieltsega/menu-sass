<?php

namespace App\Services;

use App\Exceptions\ApiException;
use App\Models\User;
use App\Support\Pagination;
use Illuminate\Database\Eloquent\Collection;

class UserService
{
    /**
     * @return array{items: Collection<int, User>, pagination: array<string, int>}
     */
    public function paginate(?int $page, ?int $limit, ?string $excludeId): array
    {
        $pagination = Pagination::params($page, $limit);
        $query = User::query();

        if ($excludeId) {
            $query->whereKeyNot($excludeId);
        }

        $total = $query->count();
        $users = $query->orderByDesc('created_at')
            ->skip($pagination['skip'])
            ->take($pagination['limit'])
            ->get();

        return ['items' => $users, 'pagination' => Pagination::meta($total, $pagination)];
    }

    public function find(string $id): User
    {
        return User::find($id) ?? throw new ApiException('User not found', 404);
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function create(array $attributes): User
    {
        if (User::where('email', $attributes['email'])->exists()) {
            throw new ApiException('Email already in use', 409);
        }

        return User::create([
            'name' => $attributes['name'],
            'email' => $attributes['email'],
            'password' => $attributes['password'],
            'role' => $attributes['role'],
            'is_active' => $attributes['is_active'] ?? true,
        ]);
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function update(string $id, array $attributes): User
    {
        $user = $this->find($id);

        if (isset($attributes['email']) && $attributes['email'] !== $user->email
            && User::where('email', $attributes['email'])->whereKeyNot($user->id)->exists()) {
            throw new ApiException('Email already in use', 409);
        }

        $user->update($attributes);

        return $user->refresh();
    }

    public function delete(string $id): void
    {
        $this->find($id)->delete();
    }
}