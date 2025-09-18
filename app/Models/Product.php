<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $guarded=[];

    public function category(){

        return $this->belongsTo(Category::class);
    }

    public function brand(){

        return $this->belongsTo(Brand::class);
    }

    public function subcategory(){

        return $this->belongsTo(Category::class, 'sub_category_id');
    }

    public function unit(){

        return $this->belongsTo(Unit::class);
    }

    public function variations(){

        return $this->hasMany(Variation::class);
    }

    public function variation(){

        return $this->belongsTo(Variation::class,'id','product_id');
    }

}
