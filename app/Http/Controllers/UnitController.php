<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use Illuminate\Http\Request;
use App\Utils\ProductUtil;

class UnitController extends Controller
{
    function __construct(ProductUtil $productUtil)
    {
        // $this->middleware('permission:units.view|units.create|units.edit|units.delete', ['only' => ['index','show']]);
        // $this->middleware('permission:units.create', ['only' => ['create','store']]);
        // $this->middleware('permission:units.edit', ['only' => ['edit','update']]);
        // $this->middleware('permission:units.delete', ['only' => ['destroy']]);
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
            $items = Unit::latest()->where('is_new',0)->paginate(30);

            return view('units.data',compact('items'))->render();
        }

        return view('units.index');
    }
    

    public function create(){

        $unit=Unit::updateOrCreate(['is_new'=>1,'name'=>null]);
        return view('units.create', compact('unit'));
    }
    
    public function show(Unit $product): View
    {
        return view('units.show',compact('product'));
    }
    
    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function edit(Unit $unit)
    {
        return view('units.create', compact('unit'));
    }
    
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Unit $unit){
        $data=request()->validate([
            'name' => 'required',
        ]);
        $data['is_new']=0;
        $unit->update($data);
        
        return response()->json(['status'=>true ,'msg'=>'Unit Created !!','function'=>'getData']);
    }
    
    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {

        $unit=Unit::find($id);
        $unit->delete();
    
        return response()->json(['status'=>true ,'msg'=>'Unit Deleted !!']);
    }

}
