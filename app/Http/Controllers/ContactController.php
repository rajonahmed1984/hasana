<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use App\Utils\ProductUtil;

class ContactController extends Controller
{
    public $productUtil;
    function __construct(ProductUtil $productUtil)
    {
        // $this->middleware('permission:locations.view|locations.create|locations.edit|locations.delete', ['only' => ['index','show']]);
        // $this->middleware('permission:locations.create', ['only' => ['create','store']]);
        // $this->middleware('permission:locations.edit', ['only' => ['edit','update']]);
        // $this->middleware('permission:locations.delete', ['only' => ['destroy']]);
        $this->productUtil=$productUtil;
    }
    
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if ($request->ajax()) {

            $type=$request->type;
            $query = Contact::latest()->where('is_new',0);

                    if ($type) {
                        $query->where('type',$type);
                    }
            $items=$query->paginate(30);

            return view('contacts.data',compact('items'))->render();
        }

        return view('suppliers.index');

    }

    public function getCustomer(Request $request){

        if ($request->ajax()) {

   
            $query = Contact::latest()->where('is_new',0);

                    $query->where('type','customer');
                    
            $items=$query->paginate(30);

            return view('customers.data',compact('items'))->render();
        }

        return view('customers.index');

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $type=$request->type;
        $contact=Contact::updateOrCreate(['is_new'=>1,'type'=>$type]);
        return view('contacts.create', compact('contact','type'));

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
    public function show(Contact $contact)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Contact $contact)
    {
        $type=$contact->type;
        return view('contacts.create', compact('contact','type'));

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Contact $contact)
    {
        
        $data=request()->validate([
            'name' => 'required',
            'mobile' => 'required',
            'email' => '',
            'address' => 'required',
        ]);
        $data['is_new']=0;
        $image=$this->productUtil->FileUpload($request,'image','contacts');

        if($image){
            $data['image']=$image;
        }
        $contact->update($data);
        
        return response()->json(['status'=>true ,'msg'=>'Contact Created !!','function'=>'getData']);


    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Contact $contact)
    {
        //
    }

    public function customerSearch(Request $request){

        $search=$request->search;
        $data=Contact::where('type', 'customer')
                        ->where(function($row) use($search){
                            $row->where('name', 'Like','%'.$search.'%');
                            $row->orwhere('mobile', 'Like','%'.$search.'%');
                        })
                        ->select('name as value','id')
                        ->get();
        return response()->json($data); 
    }

    public function customerEntry(){
        $id=request('customer_id');
        return Contact::find($id);

    }

}
