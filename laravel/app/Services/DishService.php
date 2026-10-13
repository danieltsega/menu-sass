<?php

namespace App\Services;

use App\Enums\Role;
use App\Exceptions\ApiException;
use App\Models\Cafe;
use App\Models\Category;
use App\Models\Dish;
use App\Models\User;
use App\Support\Pagination;
use Illuminate\Database\Eloquent\Collection;

class DishService
{
    /**
     * @param  array<string, mixed>  $attributes
     */
    public function create(string $cafeId, string $categoryId, array $attributes, User $user): Dish
    {
        $this->verifyAccess($cafeId, $user);
        $this->assertCategoryInCafe($cafeId, $categoryId);

        $last = Dish::where('cafe_id', $cafeId)->where('category_id', $categoryId)->max('display_order');
        $attributes['display_order'] = $last === null ? 0 : $last + 1;

        return Dish::create(['cafe_id' => $cafeId, 'category_id' => $categoryId, ...$attributes]);
    }

    /**
     * @return array{items: Collection<int, Dish>, pagination: array<string, int>}
     */
    public function paginate(string $cafeId, ?int $page, ?int $limit, User $user): array
    {
        $this->verifyAccess($cafeId, $user);

        $pagination = Pagination::params($page, $limit);
        $query = Dish::where('cafe_id', $cafeId)->orderBy('display_order')->orderByDesc('created_at');

        $total = $query->count();
        $items = $query->skip($pagination['skip'])->take($pagination['limit'])->get();

        return ['items' => $items, 'pagination' => Pagination::meta($total, $pagination)];
    }

    public function find(string $cafeId, string $dishId, User $user): Dish
    {
        $this->verifyAccess($cafeId, $user);

        return Dish::where('id', $dishId)->where('cafe_id', $cafeId)->first()
            ?? throw new ApiException('Dish not found', 404);
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function update(string $cafeId, string $dishId, array $attributes, User $user): Dish
    {
        $this->verifyAccess($cafeId, $user);

        if (isset($attributes['category_id'])) {
            $this->assertCategoryInCafe($cafeId, $attributes['category_id']);
        }

        $dish = Dish::where('id', $dishId)->where('cafe_id', $cafeId)->first()
            ?? throw new ApiException('Dish not found', 404);

        $dish->update($attributes);

        return $dish->refresh();
    }

    public function delete(string $cafeId, string $dishId, User $user): void
    {
        $this->find($cafeId, $dishId, $user)->delete();
    }

    /**
     * @param  array<int, array{id: string, category_id: string, display_order: int}>  $items
     * @return array{items: Collection<int, Dish>, pagination: array<string, int>}
     */
    public function reorder(string $cafeId, array $items, User $user): array
    {
        $this->verifyAccess($cafeId, $user);

        $ids = collect($items)->pluck('id')->all();
        $found = Dish::whereIn('id', $ids)->where('cafe_id', $cafeId)->count();

        if ($found !== count($ids)) {
            throw new ApiException('One or more dishes not found in this cafe', 404);
        }

        $categoryIds = collect($items)->pluck('category_id')->unique()->values()->all();
        $categoriesFound = Category::whereIn('id', $categoryIds)->where('cafe_id', $cafeId)->count();

        if ($categoriesFound !== count($categoryIds)) {
            throw new ApiException('One or more categories not found in this cafe', 404);
        }

        foreach ($items as $item) {
            Dish::where('id', $item['id'])->where('cafe_id', $cafeId)
                ->update(['category_id' => $item['category_id'], 'display_order' => $item['display_order']]);
        }

        foreach ($categoryIds as $categoryId) {
            $all = Dish::where('cafe_id', $cafeId)
                ->where('category_id', $categoryId)
                ->orderBy('display_order')
                ->orderByDesc('created_at')
                ->get();

            foreach ($all->values() as $index => $dish) {
                $dish->update(['display_order' => $index]);
            }
        }

        return $this->paginate($cafeId, null, null, $user);
    }

    private function assertCategoryInCafe(string $cafeId, string $categoryId): void
    {
        $exists = Category::where('id', $categoryId)->where('cafe_id', $cafeId)->exists();

        if (! $exists) {
            throw new ApiException('Category not found in this cafe', 404);
        }
    }

    private function verifyAccess(string $cafeId, User $user): void
    {
        if ($user->role === Role::SuperAdmin) {
            return;
        }

        $cafe = Cafe::find($cafeId);

        if (! $cafe || $cafe->admin_id !== $user->id) {
            throw new ApiException('Not authorized to manage this cafe', 403);
        }
    }
}