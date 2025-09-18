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

class SellController extends Controller
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
     */
    public function index(Request $request) 
    {
        if ($request->ajax()) {
            $items = Transaction::latest()->where(['is_new'=>0,'type'=>'sell'])->paginate(30);

            return view('sells.data',compact('items'))->render();
        }

        return view('sells.index');
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
    public function show($id)
    {
        $transaction=Transaction::with('lines')->find($id);
     
        return view('sells.show', compact('transaction'));
    }

    public function sellPrint($id)
    {
        $transaction=Transaction::find($id);
        return view('sells.print', compact('transaction'));
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
        return view('sells.create', compact('reward_settings','contacts','transaction','locations','cats','brands','olditems','method'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Transaction $transaction)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaction $transaction)
    {
        //
    }
}
