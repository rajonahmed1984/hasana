<?php

namespace App\Http\Controllers;

use App\Models\RewardSetting;
use Illuminate\Http\Request;
use App\Utils\ProductUtil;
use Illuminate\Support\Facades\Session;


class RewardSettingController extends Controller
{
    function __construct()
    {
        // $this->middleware('permission:brands.view|brands.create|brands.edit|brands.delete', ['only' => ['index','show']]);
        // $this->middleware('permission:brands.create', ['only' => ['create','store']]);
        // $this->middleware('permission:brands.edit', ['only' => ['edit','update']]);
        // $this->middleware('permission:brands.delete', ['only' => ['destroy']]);
    }
    
    public function index(Request $request)
    {
        $item=RewardSetting::first();
        return view('settings.reward', compact('item'));
    }
    

    public function store(Request $request){
        $data=request()->validate([
            'amount_per_unit_rp' => 'required',
            'min_order_amount_rp' => 'required',
            'redeem_amount_per_unit_rp' => 'required',
            'min_order_total_for_redeem' => 'required',
            'status' => 'required',
        ]);
        $item=RewardSetting::first();
        if (empty($item)) {
            RewardSetting::create($data);
        }else{
            $item->update($data);
        }
        
        
        return response()->json(['status'=>true ,'msg'=>'RewardSetting updated !!']);
    }
    


}
