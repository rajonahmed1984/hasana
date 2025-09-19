<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dua extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'text_ar',
        'text_bn',
        'transliteration',
        'reference',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
