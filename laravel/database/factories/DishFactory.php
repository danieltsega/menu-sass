<?php

namespace Database\Factories;

use App\Models\Cafe;
use App\Models\Category;
use App\Models\Dish;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Dish>
 */
class DishFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->words(2, true),
            'description' => fake()->sentence(),
            'ingredients' => fake()->words(3),
            'price' => fake()->randomFloat(2, 1, 100),
            'image' => null,
            'category_id' => Category::factory(),
            'cafe_id' => Cafe::factory(),
            'display_order' => 0,
            'is_available' => true,
            'is_featured' => false,
        ];
    }
}
