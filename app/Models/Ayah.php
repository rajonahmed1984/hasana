<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ayah extends Model
{
    use HasFactory;

    protected $fillable = [
        'surah_id',
        'number',
        'text_ar',
        'text_en',
        'transliteration',
        'audio_url',
        'footnotes',
        'meta',
        'is_active',
    ];

    protected $casts = [
        'meta' => 'array',
        'is_active' => 'bool',
    ];

    public function surah()
    {
        return $this->belongsTo(Surah::class);
    }
}
