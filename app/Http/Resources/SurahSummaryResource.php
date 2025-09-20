<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SurahSummaryResource extends JsonResource
{
    public function toArray($request)
    {
        $meta = $this->meta ?? [];
        $nameBn = $meta['name_bn'] ?? $this->name_en;
        $meaningBn = $meta['meaning_bn'] ?? ($meta['meaning'] ?? null);

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'number' => $this->number,
            'number_bn' => self::convertDigits($this->number),
            'name_en' => $this->name_en,
            'name_bn' => $nameBn,
            'name_ar' => $this->name_ar,
            'meaning_bn' => $meaningBn,
            'ayah_count' => $this->ayahs_count ?? $this->ayah_count,
            'ayah_count_bn' => self::convertDigits($this->ayahs_count ?? $this->ayah_count),
            'meta' => $meta,
        ];
    }

    protected static function convertDigits($value): string
    {
        $digitsMap = ['0' => '০', '1' => '১', '2' => '২', '3' => '৩', '4' => '৪', '5' => '৫', '6' => '৬', '7' => '৭', '8' => '৮', '9' => '৯'];

        return strtr((string) $value, $digitsMap);
    }
}
