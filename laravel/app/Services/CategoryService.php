<?php

namespace App\Services;

use App\Enums\Role;
use App\Exceptions\ApiException;
use App\Models\Cafe;
use App\Models\Category;
use App\Models\User;
use App\Support\Pagination;
use Illuminate\Database\Eloquent\Collection;

class CategoryService
{
    /**
     * @param  array<string, mixed>  $attributes
     */
    public function create(string $cafeId, array $attributes, User $user): Category
    {
        $this->verifyAccess($cafeId, $user);

        if (! array_key_exists('display_order', $attributes) || $attributes['display_order'] === null) {
            $last = Category::where('cafe_id', $cafeId)->max('display_order');
            $attributes['display_order'] = $last === null ? 0 : $last + 1;
        }

        return Category::create(['cafe_id' => $cafeId, ...$attributes]);
    }

    /**
     * @return array{items: Collection<int, Category>, pagination: array<string, int>}
     */
    public function paginate(string $cafeId, ?int $page, ?int $limit, User $user): array
    {
        $this->verifyAccess($cafeId, $user);

        $pagination = Pagination::params($page, $limit);
        $query = Category::where('cafe_id', $cafeId)->orderBy('display_order');

        $total = $query->count();
        $items = $query->skip($pagination['skip'])->take($pagination['limit'])->get();

        return ['items' => $items, 'pagination' => Pagination::meta($total, $pagination)];
    }

    public function find(string $cafeId, string $categoryId, User $user): Category
    {
        $this->verifyAccess($cafeId, $user);

        return Category::where('id', $categoryId)->where('cafe_id', $cafeId)->first()
            ?? throw new ApiException('Category not found', 404);
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function update(string $cafeId, string $categoryId, array $attributes, User $user): Category
    {
        $category = $this->find($cafeId, $categoryId, $user);
        $category->update($attributes);

        return $category->refresh();
    }

    public function delete(string $cafeId, string $categoryId, User $user): void
    {
        $this->find($cafeId, $categoryId, $user)->delete();
    }

    /**
     * @param  array<int, array{id: string, display_order: int}>  $items
     * @return array{items: Collection<int, Category>, pagination: array<string, int>}
     */
    public function reorder(string $cafeId, array $items, User $user): array
    {
        $this->verifyAccess($cafeId, $user);

        $ids = collect($items)->pluck('id')->all();
        $found = Category::whereIn('id', $ids)->where('cafe_id', $cafeId)->count();

        if ($found !== count($ids)) {
            throw new ApiException('One or more categories not found in this cafe', 404);
        }

        foreach ($items as $item) {
            Category::where('id', $item['id'])->where('cafe_id', $cafeId)
                ->update(['display_order' => $item['display_order']]);
        }

        $all = Category::where('cafe_id', $cafeId)->orderBy('display_order')->orderByDesc('created_at')->get();
        foreach ($all->values() as $index => $category) {
            $category->update(['display_order' => $index]);
        }

        return $this->paginate($cafeId, null, null, $user);
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