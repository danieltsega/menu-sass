<?php

namespace App\Http\Requests\Dish;

use Illuminate\Foundation\Http\FormRequest;

class StoreDishRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:200'],
            'description' => ['nullable', 'string', 'max:1000'],
            'ingredients' => ['nullable', 'array'],
            'ingredients.*' => ['string', 'min:1'],
            'price' => ['required', 'numeric', 'gt:0'],
            'image' => ['nullable', 'string', 'max:500'],
            'category' => ['required', 'string'],
            'isAvailable' => ['sometimes', 'boolean'],
            'isFeatured' => ['sometimes', 'boolean'],
        ];
    }
}