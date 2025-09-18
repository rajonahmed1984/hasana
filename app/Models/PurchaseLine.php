<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseLine extends Model
{
    protected $guarded=[];

    public function product(){

        return $this->belongsTo(Product::class);
    }

    public function variation(){

        return $this->belongsTo(Variation::class);
    }
    
}
