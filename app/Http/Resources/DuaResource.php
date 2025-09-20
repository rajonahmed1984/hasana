<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DuaResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'text_ar' => $this->text_ar,
            'text_bn' => $this->text_bn,
            'transliteration' => $this->transliteration,
            'reference' => $this->reference,
            'category' => $this->whenLoaded('category', function () {
                return [
                    'id' => $this->category->id,
                    'name' => $this->category->name,
                    'slug' => $this->category->slug,
                ];
            }),
        ];
    }
}
