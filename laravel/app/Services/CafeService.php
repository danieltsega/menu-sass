<?php

namespace App\Services;

use App\Exceptions\ApiException;
use App\Models\Cafe;
use App\Models\Dish;
use App\Models\User;
use App\Support\Pagination;

class CafeService
{
    /**
     * @param  array<string, mixed>  $attributes
     */
    public function create(array $attributes): Cafe
    {
        if (Cafe::where('slug', $attributes['slug'])->exists()) {
            throw new ApiException('Cafe slug already exists', 409);
        }

        return Cafe::create($attributes)->refresh();
    }

    /**
     * @return array{items: \Illuminate\Database\Eloquent\Collection<int, Cafe>, pagination: array<string, int>}
     */
    public function paginate(?int $page, ?int $limit): array
    {
        $pagination = Pagination::params($page, $limit);
        $query = Cafe::orderByDesc('created_at');

        $total = $query->count();
        $cafes = $query->skip($pagination['skip'])->take($pagination['limit'])->get();

        if ($cafes->isNotEmpty()) {
            $adminIds = $cafes->pluck('admin_id')->unique()->values();
            $names = User::whereIn('id', $adminIds)->pluck('name', 'id');

            $counts = Dish::whereIn('cafe_id', $cafes->pluck('id'))
                ->selectRaw('cafe_id, count(*) as aggregate')
                ->groupBy('cafe_id')
                ->pluck('aggregate', 'cafe_id');

            $cafes->each(function (Cafe $cafe) use ($names, $counts): void {
                $cafe->adminName = $names[$cafe->admin_id] ?? null;
                $cafe->dishCount = (int) ($counts[$cafe->id] ?? 0);
            });
        }

        return ['items' => $cafes, 'pagination' => Pagination::meta($total, $pagination)];
    }

    public function find(string $id): Cafe
    {
        return Cafe::find($id) ?? throw new ApiException('Cafe not found', 404);
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function update(string $id, array $attributes): Cafe
    {
        $cafe = $this->find($id);

        if (isset($attributes['slug']) && $attributes['slug'] !== $cafe->slug
            && Cafe::where('slug', $attributes['slug'])->whereKeyNot($cafe->id)->exists()) {
            throw new ApiException('Cafe slug already exists', 409);
        }

        $cafe->update($attributes);

        return $cafe->refresh();
    }

    public function delete(string $id): void
    {
        $this->find($id)->delete();
    }

    public function findByAdmin(string $adminId): Cafe
    {
        return Cafe::where('admin_id', $adminId)->first() ?? throw new ApiException('Cafe not found', 404);
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function updateByAdmin(string $adminId, array $attributes): Cafe
    {
        $cafe = $this->findByAdmin($adminId);

        if (isset($attributes['slug']) && $attributes['slug'] !== $cafe->slug
            && Cafe::where('slug', $attributes['slug'])->whereKeyNot($cafe->id)->exists()) {
            throw new ApiException('Cafe slug already exists', 409);
        }

        $cafe->update($attributes);

        return $cafe->refresh();
    }
}