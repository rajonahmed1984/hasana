<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use App\Utils\ProductUtil;
use DB;
class CategoryController extends Controller
{
    function __construct(ProductUtil $productUtil)
    {
        // $this->middleware('permission:categories.view|categories.create|categories.edit|categories.delete', ['only' => ['index','show']]);
        // $this->middleware('permission:categories.create', ['only' => ['create','store']]);
        // $this->middleware('permission:categories.edit', ['only' => ['edit','update']]);
        // $this->middleware('permission:categories.delete', ['only' => ['destroy']]);
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
            $items = Category::latest()->where('is_new',0)->paginate(30);

            return view('categories.data',compact('items'))->render();
        }

        return view('categories.index');
    }
    

    public function create(){

        $category=Category::updateOrCreate(['is_new'=>1,'name'=>null]);
        return $this->edit($category);
    }
    
    public function show(Category $product)
    {
        return view('categories.show',compact('product'));
    }
    
    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function edit(Category $category)
    {
        $cats = Category::where(['is_new'=>0,'parent_id'=>null])->whereNotIn('id', [$category->id])->get();
        return view('categories.create', compact('category','cats'));
    }
    
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Category $category){
        $data=request()->validate([
            'name' => 'required',
            'status' => '',
            'parent_id' => '',
        ]);
        $data['is_new']=0;
        $image=$this->productUtil->FileUpload($request,'image','categories');

        if($image){
            $data['image']=$image;
        }
        $category->update($data);
        
        return response()->json(['status'=>true ,'msg'=>'Category Created !!','function'=>'getData']);
    }
    
    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {

        $cat=Category::find($id);
        deleteImage('categories',$cat->image);
        $cat->delete();
    
        return response()->json(['status'=>true ,'msg'=>'Category Deleted !!']);
    }


    public function categoryStatus(Request $request){

        $name='is_top';
        if (isset($request->is_home)) {
            $name='is_home';
        }else if (isset($request->is_menu)) {
            $name='is_menu';
        }
        

        $ids=$request->product_ids;

        $status=(request($name)==1)?1:0;

        DB::table('categories')->whereIn('id', $ids)->update([$name=>$status]);


        return response()->json(['status'=>true ,'msg'=>'Product Updated Status !!']);
    }



}
