<?php

namespace App\Http\Requests\Dish;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDishRequest extends FormRequest
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
            'name' => ['sometimes', 'string', 'max:200'],
            'description' => ['nullable', 'string', 'max:1000'],
            'ingredients' => ['nullable', 'array'],
            'ingredients.*' => ['string', 'min:1'],
            'price' => ['sometimes', 'numeric', 'gt:0'],
            'image' => ['nullable', 'string', 'max:500'],
            'category' => ['sometimes', 'string'],
            'isAvailable' => ['sometimes', 'boolean'],
            'isFeatured' => ['sometimes', 'boolean'],
        ];
    }
}