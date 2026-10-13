<?php

namespace Database\Factories;

use App\Models\Cafe;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->word(),
            'description' => fake()->sentence(),
            'display_order' => 0,
            'cafe_id' => Cafe::factory(),
            'is_active' => true,
        ];
    }
}
