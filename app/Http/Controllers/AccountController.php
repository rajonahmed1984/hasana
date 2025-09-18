<?php

namespace App\Http\Controllers;

use App\Models\Account;
use Illuminate\Http\Request;
use App\Utils\ProductUtil;

class AccountController extends Controller
{
    public $productUtil;
    function __construct(ProductUtil $productUtil)
    {
        // $this->middleware('permission:brands.view|brands.create|brands.edit|brands.delete', ['only' => ['index','show']]);
        // $this->middleware('permission:brands.create', ['only' => ['create','store']]);
        // $this->middleware('permission:brands.edit', ['only' => ['edit','update']]);
        // $this->middleware('permission:brands.delete', ['only' => ['destroy']]);
        $this->productUtil=$productUtil;
    }

    public function index(){

        $items=Account::latest()->whereIsNew(0)->get();
        return view('accounting.index', compact('items'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $account=Account::updateOrCreate(['is_new'=>1]);
        return $this->edit($account);
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
    public function show(Account $account){
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Account $account){

        $types=$this->productUtil->getAccountType();
        return view('accounting.create', compact('account','types'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Account $account)
    {
        $data=request()->validate([
            'name' => 'required',
            'account_no' => 'required',
            'type' => 'required',
            'openning_balance' => '',
            'openning_balance_date' => '',
        ]);
        $data['is_new']=0;
        $account->update($data);
        
        return response()->json(['status'=>true ,'msg'=>'Account Created !!','function'=>'']);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Account $account)
    {
        //
    }

    public function accountingHub(Request $request){

        return view('accounting.hub');
    }

    public function journal(Request $request){

        return view('accounting.journal');
    }

    public function ledger(Request $request){
        $items=Account::latest()->whereIsNew(0)->get();
        return view('accounting.ledger', compact('items'));
    }

    public function trailBalance(Request $request){

        return view('accounting.trial_balance');
    }

}
