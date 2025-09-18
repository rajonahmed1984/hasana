<?php

namespace App\Http\Controllers;

use App\Models\Discount;
use Illuminate\Http\Request;
use App\Utils\ProductUtil;

class DiscountController extends Controller
{
    public $productUtil;
    
    function __construct(ProductUtil $productUtil)
    {
        // $this->middleware('permission:discounts.view|discounts.create|discounts.edit|discounts.delete', ['only' => ['index','show']]);
        // $this->middleware('permission:discounts.create', ['only' => ['create','store']]);
        // $this->middleware('permission:discounts.edit', ['only' => ['edit','update']]);
        // $this->middleware('permission:discounts.delete', ['only' => ['destroy']]);
        $this->productUtil=$productUtil;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if ($request->ajax()) {
            $items = Discount::latest()->where('is_new',0)->paginate(30);

            return view('discounts.data',compact('items'))->render();
        }

        return view('discounts.index');
    }
    

    public function create(){

        $discount=Discount::updateOrCreate(['is_new'=>1,'name'=>null]);
        return $this->edit($discount);
    }
    

    
    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function edit(Discount $discount)
    {
        return view('discounts.create', compact('discount'));
    }
    
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Discount $discount){
        $data=request()->validate([
            'name' => 'required',
            'code' => 'required',
            'mobile' => 'required',
            'email' => '',
            'address' => 'required',
        ]);
        $data['is_new']=0;
        $discount->update($data);
        
        return response()->json(['status'=>true ,'msg'=>'Discount Created !!','function'=>'getData']);
    }
    
    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {

        $discount=Discount::find($id);
        $discount->delete();
    
        return response()->json(['status'=>true ,'msg'=>'Discount Deleted !!']);
    }

}
