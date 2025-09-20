<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'description' => $this->description,
            'sort_order' => $this->sort_order,
            'is_active' => (bool) ($this->is_active ?? true),
            'items_count' => $this->when(isset($this->hadiths_count) || isset($this->duas_count), $this->hadiths_count ?? $this->duas_count ?? 0),
        ];
    }
}
