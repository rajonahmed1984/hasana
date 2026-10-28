<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
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
            'audio_url' => $this->audio_url,
            'footnotes' => $this->footnotes,
        ];
    }

    protected static function convertDigits($value): string
    {
        $map = ['0' => '0', '1' => '1', '2' => '2', '3' => '3', '4' => '4', '5' => '5', '6' => '6', '7' => '7', '8' => '8', '9' => '9'];

        return strtr((string) $value, $map);
    }
}