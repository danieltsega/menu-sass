<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \Illuminate\Support\Collection */
class MenuResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'cafe' => new CafeResource($this->resource['cafe']),
            'categories' => CategoryResource::collection($this->resource['categories']),
        ];
    }
}