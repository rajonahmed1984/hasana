<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use App\Utils\ProductUtil;
use Illuminate\Support\Facades\Session;


class SettingController extends Controller
{
    function __construct(ProductUtil $productUtil)
    {
        // $this->middleware('permission:brands.view|brands.create|brands.edit|brands.delete', ['only' => ['index','show']]);
        // $this->middleware('permission:brands.create', ['only' => ['create','store']]);
        // $this->middleware('permission:brands.edit', ['only' => ['edit','update']]);
        // $this->middleware('permission:brands.delete', ['only' => ['destroy']]);
        $this->productUtil=$productUtil;
    }
    
    public function index(Request $request)
    {
        $item=Setting::updateOrCreate(['is_new'=>1]);
        return view('settings.index', compact('item'));
    }
    

    public function update(Request $request, Setting $setting){
        $data=request()->validate([
            'title' => 'required',
            'logo' => '',
            'email' => '',
            'phone' => '',
        ]);
        $image=$this->productUtil->FileUpload($request,'logo','settings');

        if($image){
            deleteImage('settings',$setting->image);
            $data['logo']=$image;
        }
        $setting->update($data);
        \Cache::forget('info');

        \Cache::rememberForever('info', function() {

            return Setting::first()->toArray();
        });
        
        return response()->json(['status'=>true ,'msg'=>'Setting updated !!']);
    }

    public function change(Request $request){

        $lang = $request->lang;

        if (!in_array($lang, ['en', 'bn', 'fr'])) {
            abort(400);
        }

        Session::put('locale', $lang);

        return redirect()->back();
    }
    


}
