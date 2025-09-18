<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Transaction;

class ReportController extends Controller
{
    public function hub(Request $request){

        return view('reports.hub');
    }

    public function sells(Request $request){

        if ($request->ajax()) {
            $items = Transaction::latest()->where(['is_new'=>0,'type'=>'sell'])->paginate(30);

            return view('reports.partials.sell_data',compact('items'))->render();
        }

        return view('reports.sells');
    }

    public function dueSells(Request $request){

        return view('reports.due_sells');
    }

    public function profitLoss(Request $request){

        return view('reports.profit_loss');
    }

    public function productStock(Request $request){

        if ($request->ajax()) {

            $location_id=$request->location_id;
            $category_id=$request->category_id;
            $brand_id=$request->brand_id;
            $search=$request->search;

            $query=DB::table('variations as v')
                    ->join('products as p','p.id','v.product_id')
                    ->leftjoin('categories as c','p.category_id','c.id')
                    ->leftjoin('units','p.unit_id','units.id')
                    ->join('product_stocks as ps','ps.variation_id','v.id')
                    ->select('p.name','p.sku','v.sell_price','p.image','units.name as unit_name',
                        'v.purchase_price','v.sub_sku','c.name as category',
                        DB::raw("SUM(ps.qty_available) as stock"),
                        DB::raw("SUM(ps.qty_available *v.purchase_price) as stock_price")

                )->groupBy('v.id');
            if ($search) {
                $query->where(function($row) use($search){
                    $row->where('p.name', 'LIKE', '%'. $search. '%');
                    $row->orwhere('p.sku', 'LIKE', '%'. $search. '%');

                });
            }

            if ($location_id) {
                $query->where('ps.location_id', $location_id);
            }

            if ($category_id) {
                $query->where('p.category_id', $category_id);
            }

            if ($brand_id) {
                $query->where('p.brand_id', $brand_id);
            }

            $items=$query->paginate(40);
            
            return view('reports.partials.product_stock_data', compact('items'))->render();
        }


        return view('reports.product_stock');
    }

    



}
