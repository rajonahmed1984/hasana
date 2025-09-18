<?php

namespace App\Http\Controllers;
use App\Models\Transaction;
use App\Models\PurchaseLine;
use App\Models\Contact;
use App\Models\Product;
use App\Models\Location;
use App\Models\Variation;
use Illuminate\Http\Request;
use App\Utils\ProductUtil;
use Illuminate\Support\Facades\DB;

class PurchaseController extends Controller
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
            $items = Transaction::latest()->where(['is_new'=>0,'type'=>'purchase'])->paginate(30);

            return view('purchases.data',compact('items'))->render();
        }

        return view('purchases.index');
    }
    

    public function create(){

        $transaction=Transaction::updateOrCreate(['is_new'=>1,'type'=>'purchase']);

        return $this->edit($transaction->id);
    }
    
    public function show($id)
    {
       
        $transaction=Transaction::find($id);
        return view('purchases.show',compact('transaction'));
    }
    
    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $transaction=Transaction::find($id);

        $contacts = Contact::where(['is_new'=>0,'type'=>'supplier'])->get();
        $locations = Location::where(['is_new'=>0])->get();
        return view('purchases.create', compact('transaction','contacts','locations'));
    }
    
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request,$id){
        $purchase=Transaction::find($id);
        $data=$request->validate([
             'note'=> '',
             'transaction_date'=> 'required',
             'final_amount'=> 'required|numeric',
             'invoice_no'=> '',
             'product_id'=> 'required',
             'location_id'=> 'required',
             'contact_id'=> 'required',
             'shipping_status'=> 'required',
        ]);
        $data['is_new']=0;
        $data['type']='purchase';
        $data['user_id']=auth()->user()->id;

         DB::beginTransaction();

        try {
            unset($data['product_id']);
            $purchase->update($data);

            $location_id=$purchase->location_id;
            if (isset($request->line_id)) {
                $delete_line=PurchaseLine::where('transaction_id', $id)
                                ->whereNotIn('id', $request->line_id)
                                ->get();


                if ($delete_line->count()) {
                    foreach ($delete_line as $key => $line) {

                        $this->productUtil->decreaseProductStock($line->product_id,$line->product_id, $location_id,$line->quantity);
                        
                        $line->delete();
                    }
                }
            } else if($purchase->purchase_lines){
                foreach ($purchase->purchase_lines as $key => $line) {
                    
                    $this->productUtil->decreaseProductStock($line->product_id,$line->product_id, $location_id,$line->quantity);

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
                        $line=PurchaseLine::find($line_id);
                        $this->productUtil->updateProductStock($line->product_id,$line->variation_id, $location_id,$line->quantity,$qty);

                        $line->quantity=$qty;
                        $line->unit_price=$request->unit_price[$key];
                        $line->batch_no=$request->batch_no[$key];
                        $line->expire_date=$request->expire_date[$key];
                        $line->save();

                    }
                    //product stock increase
                    else{
                        $qty=$request->quantity[$key];
                        $data[]=[
                            'product_id'=>$product_id,
                            'variation_id'=>$variation_id,
                            'quantity'=>$qty,
                            'unit_price'=>$request->unit_price[$key],
                            'batch_no'=>$request->batch_no[$key],
                            'expire_date'=>$request->expire_date[$key],
                        ];

                        $this->productUtil->increaseProductStock($product_id,$variation_id, $location_id,$qty);                 
                    }
                    
                }
                if (!empty($data)) {
                    $purchase->purchase_lines()->createMany($data);
                }
                
            }

            

            if(isset($request->pay_amount)){

                foreach ($request->pay_amount as $key => $amount) {
                    if(isset($request->pay_id[$key])){
                        $pay=TransactionPayment::find($request->pay_id[$key]);
                    }else{
                        $pay=new TransactionPayment();
                    }
                    
                    $pay->transaction_id=$purchase->id;
                    $pay->paid_on=$purchase->date;
                    $pay->method=$request->method[$key];
                    $pay->amount=$amount;
                    $pay->note=$request->pay_note[$key];
                    $pay->date=newdate($data['date']);
                    $pay->save();

                }
            }

            // transactionStatus($purchase);

            DB::commit();
            return response()->json(['status'=>true ,'msg'=>'Purchase Is  Updated !!','function'=> 'ss']);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['status'=>false ,'msg'=>$e->getMessage()]);
        }

    }
    
    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {

        $purchase=Transaction::find($id); 

        foreach ($purchase->lines as $key => $line) {
            $this->productUtil->decreaseProductStock($line->product_id,$line->variation_id, $purchase->location_id,$line->quantity);
            $line->delete();
        }

        $purchase->payments()->delete();
        $purchase->delete();
        return response()->json(['status'=>true ,'msg'=>'Deleted Successfully !!']);

    }


    public function getPurchaseProduct(Request $request){

        
        $query=DB::table('variations as v')
                        ->join('products as p','p.id','v.product_id')
                        ->where('p.name', 'LIKE', '%'. $request->get('search'). '%')
                        ->orwhere('p.sku', 'LIKE', '%'. $request->get('search'). '%')
                        ->select('p.name as value','p.sku','p.image','p.created_at','v.id','v.sub_sku','p.type','v.purchase_price','v.sell_price');

        $data = $query->latest()->get();

        return response()->json($data); 

    }


    public function purchaseProductEntry(Request $request){

        $id=$request->id;
        $item=Variation::with('product')->find($id);

        if ($item) {
            $html=view('purchases.product_row', compact('item'))->render();

            return response()->json(['success'=>true,'html'=>$html]);
        }else{
            return response()->json(['success'=>false,'msg'=>'Product Note Found !!']);
        }
    }


}
