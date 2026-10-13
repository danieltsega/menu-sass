<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Dish */
class DishResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            '_id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'ingredients' => $this->ingredients ?? [],
            'price' => (float) $this->price,
            'image' => $this->image,
            'category' => $this->category_id,
            'cafe' => $this->cafe_id,
            'displayOrder' => $this->display_order,
            'isAvailable' => $this->is_available,
            'isFeatured' => $this->is_featured,
            'createdAt' => $this->created_at?->toISOString(),
            'updatedAt' => $this->updated_at?->toISOString(),
        ];
    }
}