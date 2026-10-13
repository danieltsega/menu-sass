<?php

namespace App\Services;

use App\Exceptions\ApiException;
use App\Models\Cafe;
use App\Models\Category;

class MenuService
{
    /**
     * @return array{cafe: Cafe, categories: \Illuminate\Database\Eloquent\Collection<int, Category>}
     */
    public function getPublicMenu(string $cafeSlug): array
    {
        $cafe = Cafe::where('slug', $cafeSlug)->where('is_active', true)->first();

        if (! $cafe) {
            throw new ApiException('Cafe not found', 404);
        }

        $categories = Category::where('cafe_id', $cafe->id)
            ->where('is_active', true)
            ->orderBy('display_order')
            ->get();

        $dishes = $cafe->dishes()
            ->whereIn('category_id', $categories->pluck('id'))
            ->where('is_available', true)
            ->orderBy('display_order')
            ->orderByDesc('created_at')
            ->get();

        $dishesByCategory = $dishes->groupBy('category_id');

        $categories->each(function (Category $category) use ($dishesByCategory): void {
            $category->setRelation('dishes', $dishesByCategory->get($category->id, collect()));
        });

        return ['cafe' => $cafe, 'categories' => $categories];
    }
}