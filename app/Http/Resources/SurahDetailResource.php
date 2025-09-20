<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SurahDetailResource extends JsonResource
{
    public function toArray($request)
    {
        $meta = $this->meta ?? [];
        $nameBn = $meta['name_bn'] ?? $this->name_en;
        $meaningBn = $meta['meaning_bn'] ?? ($meta['meaning'] ?? null);
        $summaryBn = $meta['summary_bn'] ?? ($meta['summary'] ?? $this->summary);
        $revelationOrder = $meta['revelation_order'] ?? null;

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'number' => $this->number,
            'number_bn' => self::convertDigits($this->number),
            'name_en' => $this->name_en,
            'name_bn' => $nameBn,
            'name_ar' => $this->name_ar,
            'meaning_bn' => $meaningBn,
            'summary_bn' => $summaryBn,
            'revelation_type' => $this->revelation_type,
            'revelation_label_bn' => $this->revelationLabelBn(),
            'revelation_order' => $revelationOrder ?? $this->revelation_order,
            'revelation_order_bn' => $revelationOrder ? self::convertDigits($revelationOrder) : null,
            'ayah_count' => $this->ayahs_count ?? $this->ayah_count,
            'ayah_count_bn' => self::convertDigits($this->ayahs_count ?? $this->ayah_count),
            'meta' => $meta,
        ];
    }

    protected function revelationLabelBn(): string
    {
        return match (strtolower($this->revelation_type ?? '')) {
            'meccan' => 'মক্কায় অবতীর্ণ',
            'medinan' => 'মদিনায় অবতীর্ণ',
            default => 'অজানা অবতরণ',
        };
    }

    protected static function convertDigits($value): string
    {
        $map = ['0' => '০', '1' => '১', '2' => '২', '3' => '৩', '4' => '৪', '5' => '৫', '6' => '৬', '7' => '৭', '8' => '৮', '9' => '৯'];

        return strtr((string) $value, $map);
    }
}
