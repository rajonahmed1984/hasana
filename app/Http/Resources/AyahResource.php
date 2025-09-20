<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AyahResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'number' => $this->number,
            'number_bn' => self::convertDigits($this->number),
            'text_ar' => $this->text_ar,
            'text_bn' => $this->text_bn,
            'transliteration' => $this->transliteration,
            'audio_url' => $this->audio_url,
            'footnotes' => $this->footnotes,
        ];
    }

    protected static function convertDigits($value): string
    {
        $map = ['0' => '০', '1' => '১', '2' => '২', '3' => '৩', '4' => '৪', '5' => '৫', '6' => '৬', '7' => '৭', '8' => '৮', '9' => '৯'];

        return strtr((string) $value, $map);
    }
}
