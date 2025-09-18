<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\TransactionLine;
use App\Models\Contact;
use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Variation;
use App\Models\TransactionPayment;
use App\Models\RewardSetting;
use App\Models\Location;
use Illuminate\Http\Request;
use App\Utils\ProductUtil;
use Illuminate\Support\Facades\DB;

class PosController extends Controller
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


    public function index(Request $request)
    {
        if ($request->ajax()) {
            $items = Transaction::whereNotNull('contact_id')->latest()->where(['is_new'=>0,'type'=>'sell'])->paginate(30);

            return view('pos.data',compact('items'))->render();
        }

        return view('pos.index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $transaction=Transaction::updateOrCreate(['is_new'=>1,'type'=>'sell']);

        return $this->edit($transaction->id);
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $transaction=Transaction::find($id);
        return view('pos.show', compact('transaction'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $transaction=Transaction::find($id); 
        $contacts = Contact::where(['is_new'=>0,'type'=>'customer'])->get();
        $locations = Location::where(['is_new'=>0])->get();
        $cats = Category::latest()->where(['is_new'=>0,'parent_id'=>null])->get();
        $brands = Brand::latest()->where('is_new',0)->get();
        $reward_settings=RewardSetting::first();

        $olditems=DB::table('transaction_lines as tl')
                    ->join('variations' ,'variations.id','tl.variation_id')
                    ->join('products as p' ,'p.id','tl.product_id')
                    ->join('product_stocks as ps' ,'ps.variation_id','variations.id')
                    ->select('variations.*','ps.qty_available','p.name as product_name','tl.id as line_id','tl.quantity as ordered_qty',

                        DB::raw("SUM(ps.qty_available + tl.quantity) AS stock")
                    )
                    ->where('tl.transaction_id', $id)
                    ->where('ps.location_id', $transaction->location_id)
                    ->groupBy('tl.id')
                    ->get();

        $method='cash';
        if($transaction->payments->count()){
            $method=$transaction->payments[0]->method;
        }
        return view('pos.create', compact('reward_settings','contacts','transaction','locations','cats','brands','olditems','method'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id){
        $chckeid=Transaction::find($id)->location_id;
        $transaction=Transaction::find($id);
        $data=$request->validate([
             'note'=> '',
             'transaction_date'=> '',
             'final_amount'=> 'required|numeric',
             'invoice_no'=> '',
             'product_id'=> 'required',
             'location_id'=> 'required',
             'contact_id'=> 'required',
             'shipping_charge'=> '',
             'discount_type'=> '',
             'discount_amount'=> '',
             'reddem_point'=> '',
        ]);
        $data['is_new']=0;
        $data['type']='sell';
        $data['user_id']=auth()->user()->id;
        $data['invoice_no']=rand();
        $data['transaction_date']=date('Y-m-d H:i:s');

         DB::beginTransaction();

        try {
            unset($data['product_id']);
            $transaction->update($data);

            $location_id=$transaction->location_id;
            if (isset($request->line_id)) {
                $delete_line=TransactionLine::where('transaction_id', $id)
                                ->whereNotIn('id', $request->line_id)
                                ->get(); 


                if ($delete_line->count()) {
                    foreach ($delete_line as $key => $line) {

                        $this->productUtil->increaseProductStock($line->product_id,$line->variation_id, $location_id,$line->quantity);
                        
                        $line->delete();
                    }
                }
            } else if($transaction->lines){
                foreach ($transaction->lines as $key => $line) {
                    
                    $this->productUtil->increaseProductStock($line->product_id,$line->variation_id, $location_id,$line->quantity);

                    $line->delete();
                }
            }

            
            // update purchase line and product stock
            if (isset($request->product_id)) {
                $data=[];
                foreach ($request->product_id as $key => $product_id) {
                    //product stock increase/decrease
                    $variation_id=$request->variation_id[$key];

                    if (isset($request->line_id[$key])) {

                        
                        $qty=$request->quantity[$key];
                        $line_id=$request->line_id[$key];
                        $line=TransactionLine::find($line_id);
                        $this->productUtil->updateProductStock($line->product_id,$line->variation_id, $location_id,$line->quantity,$qty);

                        $line->quantity=$qty;
                        $line->price=$request->unit_price[$key];
                        $line->save();

                    }
                    //product stock increase
                    else{
                        $qty=$request->quantity[$key];
                        $data[]=[
                            'product_id'=>$product_id,
                            'variation_id'=>$variation_id,
                            'quantity'=>$qty,
                            'price'=>$request->unit_price[$key],
                        ];

                        $this->productUtil->decreaseProductStock($product_id,$variation_id, $location_id,$qty);                 
                    }
                    
                }
                if (!empty($data)) {
                    $transaction->lines()->createMany($data);
                }
                
            }

            

            if($request->pay_amount >0){

          
                if(isset($request->pay_id)){
                    $pay=TransactionPayment::find($request->pay_id);
                }else{
                    $pay=new TransactionPayment();
                }
                
                $pay->transaction_id=$transaction->id;
                $pay->paid_on=date('Y-m-d');
                $pay->method=$request->method;
                $pay->amount=$request->pay_amount;
                $pay->user_id=auth()->user()->id;
                $pay->save();

            }
            

            $this->productUtil->transactionStatus($transaction);
            $this->productUtil->customerReward($transaction);

            $url='';
            $msg='Sell Added Successfully';
            if($chckeid){
                $url=route('pos.create');
                $msg='Sell Update Successfully';
            }

            DB::commit();
            $html=view('pos.partials.invoice',compact('transaction'))->render();
            return response()->json(['url'=>$url,'status'=>true ,'msg'=>$msg,'html'=>$html]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['status'=>false ,'msg'=>$e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {

        $transaction=Transaction::find($id);

        foreach ($transaction->lines as $key => $line) {
            $this->productUtil->increaseProductStock($line->product_id,$line->variation_id, $transaction->location_id,$line->quantity);
            $line->delete();
        }

        $transaction->payments()->delete();
        $transaction->delete();
        return response()->json(['status'=>true ,'msg'=>'Deleted Successfully !!']);

    }


    public function getSellProduct(Request $request){

        $search=$request->get('search');
        $data=Variation::join('products as p' ,'p.id','variations.product_id')
                    ->join('product_stocks as ps' ,'ps.variation_id','variations.id')
                    ->select('variations.*','ps.qty_available','p.name as product_name',

                        DB::raw("SUM(ps.qty_available) AS stock")
                    )
                    ->where(function($row) use($search){
                        $row->where('p.name', 'LIKE', '%'.$search . '%');
                        $row->orwhere('p.sku', 'LIKE', '%'.$search . '%');
                    })
                    ->having('stock','>',0)
                    ->get();

    
        return response()->json($data); 

    }


    public function sellProductEntry(Request $request){

        $id=$request->variation_id;
        $location_id=$request->location_id;

        $item=Variation::join('products as p' ,'p.id','variations.product_id')
                    ->join('product_stocks as ps' ,'ps.variation_id','variations.id')
                    ->select('variations.*','ps.qty_available','p.name as product_name',

                        DB::raw("SUM(ps.qty_available) AS stock")
                    )
                    ->having('stock','>',0)
                    ->where('ps.location_id', $location_id)
                    ->where('variations.id', $id)
                    ->first();

        if ($item) {
            $html=view('sells.partials.product_row', compact('item'))->render();

            return response()->json(['success'=>true,'html'=>$html]);
        }else{
            return response()->json(['success'=>false,'msg'=>'Stock Not Available !!']);
        }
    }
    

    public function getPosProduct(Request $request){

            
        $category_id=$request->category_id;
        $brand_id=$request->brand_id;
        $location_id=$request->location_id;
        $search=$request->search;
        $query = DB::table('variations as v')
                    ->join('products as p','p.id','v.product_id')
                    ->leftjoin('product_stocks as ps' ,'ps.variation_id','v.id')
                    // ->where('product_stocks.location_id', $location_id)
                    ->select('p.id','p.name','p.sku','p.image','p.created_at','v.id as variation_id','v.sub_sku','p.type','v.purchase_price','v.sell_price',
                        DB::raw("SUM(ps.qty_available) AS stock")

                )
                // ->where('outlet_stocks.qty_available','>',0)
                ->where(function($row) use($search){
                    $row->where('p.name', 'LIKE', '%'. $search. '%')
                        ->orwhere('p.sku', 'LIKE', '%'. $search. '%')
                        ->orwhere('v.sub_sku', 'LIKE', '%'. $search. '%');
                });

                if ($location_id) {
                    $query->where('ps.location_id', $location_id);
                }

                if ($location_id) {
                    $query->where('ps.location_id', $location_id);
                }

                if ($category_id && $category_id !='all') {
                    $query->where('p.category_id', $category_id);
                }

                if ($brand_id) {
                    $query->where('p.brand_id', $brand_id);
                }
                
                $items=$query->groupBy('v.id')
                ->get();

            return view('pos.partials.product_section',compact('items'))->render();
        


    }
}
