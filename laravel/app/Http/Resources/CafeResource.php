<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Cafe */
class CafeResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            '_id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'logo' => $this->logo,
            'address' => $this->address,
            'phone' => $this->phone,
            'admin' => $this->admin_id,
            'isActive' => $this->is_active,
            'createdAt' => $this->created_at?->toISOString(),
            'updatedAt' => $this->updated_at?->toISOString(),
            'adminName' => $this->when(isset($this->resource->adminName), fn () => $this->resource->adminName),
            'dishCount' => $this->when(isset($this->resource->dishCount), fn () => (int) $this->resource->dishCount),
        ];
    }
}