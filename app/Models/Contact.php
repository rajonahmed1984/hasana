<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    protected $guarded=[];
    protected $appends = ['reward_point'];

    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'contact_id')->latest();
    }

    public function getRewardPointAttribute()
    {
        return $this->hasMany(Transaction::class, 'contact_id')->sum('reward_point')
                -$this->hasMany(Transaction::class, 'contact_id')->sum('reddem_point');
    }


}
