<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Surah extends Model
{
    use HasFactory;

    protected $fillable = [
        'number',
        'name_ar',
        'name_en',
        'slug',
        'revelation_type',
        'ayah_count',
        'summary',
        'meta',
    ];

    protected $casts = [
        'meta' => 'array',
    ];

    public function ayahs()
    {
        return $this->hasMany(Ayah::class)->orderBy('number');
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
