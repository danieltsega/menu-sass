<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UploadImageRequest extends FormRequest
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
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp,svg', 'max:5120'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'image.required' => 'No file provided',
            'image.image' => 'Only image files (jpg, jpeg, png, webp, svg) are allowed',
            'image.mimes' => 'Only image files (jpg, jpeg, png, webp, svg) are allowed',
            'image.max' => 'File too large (max 5MB)',
        ];
    }
}