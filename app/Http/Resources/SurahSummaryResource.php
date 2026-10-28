<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SurahSummaryResource extends JsonResource
{
    public function toArray($request)
    {
        $meta = $this->meta ?? [];
        $nameBn = $meta['name_bn'] ?? $this->name_en;
        $meaningBn = $meta['meaning_bn'] ?? ($meta['meaning'] ?? null);
        $translatorBn = $meta['translator_bn'] ?? null;

        $ayahCount = ($this->ayahs_count ?? 0) > 0 ? $this->ayahs_count : ($this->ayah_count ?: 0);

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'number' => $this->number,
            'number_bn' => self::convertDigits($this->number),
            'name_en' => $this->name_en,
            'name_bn' => $nameBn,
            'name_ar' => $this->name_ar,
            'meaning_bn' => $meaningBn,
            'translator_bn' => $translatorBn,
            'revelation_type' => $this->revelation_type,
            'revelation_type_bn' => $this->revelation_type === 'meccan' ? 'মাক্কী' : ($this->revelation_type === 'medinan' ? 'মাদানী' : ''),
            'ayah_count' => $ayahCount,
            'ayah_count_bn' => self::convertDigits($ayahCount),
            'meta' => $meta,
        ];
    }

    protected static function convertDigits($value): string
    {
        $digitsMap = ['0' => '0', '1' => '1', '2' => '2', '3' => '3', '4' => '4', '5' => '5', '6' => '6', '7' => '7', '8' => '8', '9' => '9'];

        return strtr((string) $value, $digitsMap);
    }
}
