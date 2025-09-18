<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Unit;
use App\Models\VariantAttribute;
use App\Models\Variation;
use Illuminate\Http\Request;
use App\Utils\ProductUtil;
use Illuminate\Support\Facades\DB;
use App\Imports\ProductsImport;
use Maatwebsite\Excel\Facades\Excel;




class ProductController extends Controller
{
    public $productUtil;
    function __construct(ProductUtil $productUtil)
    {
        // $this->middleware('permission:products.view|products.create|products.edit|products.delete', ['only' => ['index','show']]);
        // $this->middleware('permission:products.create', ['only' => ['create','store']]);
        // $this->middleware('permission:products.edit', ['only' => ['edit','update']]);
        // $this->middleware('permission:products.delete', ['only' => ['destroy']]);
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
            $query = Product::leftjoin('categories as c','c.id','products.category_id')
                    ->leftjoin('brands','brands.id','products.brand_id')
                    ->leftjoin('variations as v','v.product_id','products.id')
                    ->leftjoin('product_stocks as ps','ps.product_id','products.id')
                    ->select('products.*','c.name as category_name','brands.name as brand_name',

                    DB::raw('SUM(ps.qty_available) as total_stock'),
                    DB::raw('MAX(v.purchase_price) as purchase_price'),
                    DB::raw('MAX(v.sell_price) as sell_price'),
                    )
                    ->groupBy('products.id')
                    ->latest()->where('products.is_new',0);

            $items=$query->paginate(30);

            return view('products.data',compact('items'))->render();
        }

        return view('products.index');
    }
    

    public function create(){

        $product=Product::updateOrCreate(['is_new'=>1,'name'=>null]);

        return $this->edit($product);

        
    }
    
    public function show(Product $product){
        
        return view('products.show',compact('product'));
    }
    
    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function edit(Product $product)
    {
        
        $cats = Category::where(['is_new'=>0,'parent_id'=>null])->get();
        $brands = Brand::whereIsNew(0)->get();
        $units = Unit::whereIsNew(0)->get();
        $sub_cats = [];
        if($product->category_id){
            $sub_cats = Category::where(['is_new'=>0,'parent_id'=>$product->category_id])->get();;
        }
        return view('products.create', compact('product','cats', 'brands','units','sub_cats'));
    }
    
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Product $product){


        $data=request()->validate([
            'name' => 'required',
            'category_id' => 'required',
            'sub_category_id' => '',
            'status' => '',
            'sku' => '',
            'type' => '',
            'description' => '',
            'stock_alert' => '',
            'brand_id' => '',
            'unit_id' => '',
            'type' => ''
        ]);
        
        $data['is_new']=0;
        
        
        if (isset($request->variations)) {
            $variations=$request->variations;
            $data['is_new']=0;
        }else{
            $variations[]=[
                    'name'=>'dummy',
                    'sub_sku'=> $data['sku'].'-1',
                    'purchase_price'=> $request->purchase_price,
                    'sell_price'=> $request->sell_price,
            ];
        }
        $image=$this->productUtil->FileUpload($request,'image','products'); 

        if($image){
            deleteImage('products',$product->image);
            $data['image']=$image;
        }
        $product->update($data);


        $ids=[];
        foreach ($variations as $key => $variation) {

            $vname=$variation['name'];
            unset($variation['name']);
            $item=Variation::updateOrCreate(['product_id'=>$product->id,'name'=>$vname],$variation);
            $ids[] = $item->id;
        }
        $product->variations()->whereNotIn('id', $ids)->delete();

        return response()->json(['status'=>true ,'msg'=>'product Created !!','function'=>'getData']);
    }
    
    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {

        $product=Product::find($id);
        deleteImage('products',$product->image);
        $product->variations()->delete();
        $product->delete();
    
        return response()->json(['status'=>true ,'msg'=>'Product Deleted !!']);
    }

    public function productUpdate(Request $request){

        $name='is_ecom';
        if (isset($request->is_reco)) {
            $name='is_reco';
        }else if (isset($request->is_feature)) {
            $name='is_feature';
        }
        

        $ids=$request->product_ids;

        $status=(request($name)==1)?1:0;

        DB::table('products')->whereIn('id', $ids)->update([$name=>$status]);


        return response()->json(['status'=>true ,'msg'=>'Product Updated Status !!']);
    }

    public function productImport(){

        return view('products.import');

    }


    public function productImportStore(Request $request){
        $request->validate([
            'products_csv' => 'required|mimes:xlsx,xls,csv'
        ]);

        DB::beginTransaction();
        try {

            $data = Excel::toArray(new ProductsImport, request()->file('products_csv'));
            $product_array = array_shift($data);
            $product_import_data = [];
            $is_valid = true;
            $error_msg = '';
            foreach ($product_array as $key => $value) {
                $row_no = $key + 1;
                // name
                $product_name = trim($value['product_name']);
                if (!empty($product_name)) {
                    $product_data['name'] = $product_name;
                    $product_data['type'] = 'single';
                    $product_data['is_new'] = 0;
                } else {
                    $is_valid =  false;
                    $error_msg = "Product name is required in row no. $row_no";
                    break;
                }

                // sku
                $sku = trim($value['sku']);
                if (!empty($sku)) {
                    $product_data['sku'] = $sku;
                } else {
                    $is_valid =  false;
                    $error_msg = "Product Sku is required in row no. $row_no";
                    break;
                }

                // purchase_price
                $purchase_price = trim($value['purchase_price']);
                if (!empty($purchase_price)) {
                    $product_data['purchase_price'] = $purchase_price;
                } else {
                    $is_valid =  false;
                    $error_msg = "Product purchase price is required in row no. $row_no";
                    break;
                }

                //sell_price
                $sell_price = trim($value['sell_price']);
                if (!empty($sell_price)) {
                    $product_data['sell_price'] = $sell_price;
                } else {
                    $is_valid =  false;
                    $error_msg = "Product purchase price is required in row no. $row_no";
                    break;
                }

                //sell_price
                $description = trim($value['description']);
                if (!empty($sell_price)) {
                    $product_data['description'] = $description;
                } else {
                    $product_data['description']=null;
                }

                //sell_price
                $stock_alert = trim($value['stock_alert']);
                if (!empty($stock_alert)) {
                    $product_data['stock_alert'] = $stock_alert;
                } else {
                    $is_valid =  false;
                    $error_msg = "Product stock Alert is required in row no. $row_no";
                    break;
                }



                //category
                $category_name = trim($value['category']);
                if (!empty($category_name)) {
                    $category = Category::firstOrCreate(['name' => $category_name], ['status' => 1]);
                    $product_data['category_id'] = $category->id;
                } else {
                    $is_valid =  false;
                    $error_msg = "Category name is required in row no. $row_no";
                    break;
                }


                //unit
                $unit_name = trim($value['unit']);
                if (!empty($unit_name)) {
                    $unit = Unit::firstOrCreate(['name' => $unit_name], ['status' => 1]);
                    $product_data['unit_id'] = $unit->id;
                }


                //Brand
                $brand_name = trim($value['brand']);
                if (!empty($brand_name)) {
                    $brand = Brand::firstOrCreate(['name' => $brand_name], ['status' => 1]);
                    $product_data['brand_id'] = $brand->id;
                }


                $product_import_data[] = $product_data;
            }

            if (!$is_valid) {
                throw new \Exception($error_msg);
            }

            if (!empty($product_import_data)) {

                foreach ($product_import_data as $key => $product) {
                    $sell_price=$product['sell_price'];
                    $purchase_price=$product['purchase_price'];

                    unset($product['sell_price'],$product['purchase_price']);
                    $prod = Product::create($product);

                    $vdata=[
                            'product_id'=>$prod->id,
                            'sell_price'=>$sell_price,
                            'name'=>'dummy',
                            'sub_sku'=>$prod->sku.'-1',
                            'purchase_price'=>$purchase_price,
                    ];

                    Variation::create($vdata);
                }
            }
            DB::commit();
            return response()->json(['status' => true, 'msg' => 'Product Is Import Successfully !!', 'url' => route('products.index')]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['status' => false, 'msg' => $e->getMessage()]);
        }
    }


}
