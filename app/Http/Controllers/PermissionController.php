<?php

namespace App\Http\Controllers;

use Spatie\Permission\Models\Permission;
use Illuminate\Http\Request;
use App\Utils\ProductUtil;

class PermissionController extends Controller
{
    function __construct()
    {
        // $this->middleware('permission:units.view|units.create|units.edit|units.delete', ['only' => ['index','show']]);
        // $this->middleware('permission:units.create', ['only' => ['create','store']]);
        // $this->middleware('permission:units.edit', ['only' => ['edit','update']]);
        // $this->middleware('permission:units.delete', ['only' => ['destroy']]);\
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $items = Permission::latest()->paginate(30);

        return view('permissions.index',compact('items'));
        
    }
    

    public function create(){

        return view('permissions.create');
    }

    public function store(Request $request){
        $data=request()->validate([
            'name' => 'required',
        ]);
        Permission::create($data);
        
        return response()->json(['status'=>true ,'msg'=>'Permission Created !!']);
    }

    
    
    public function edit(Permission $permission)
    {
        return view('permissions.create', compact('permission'));
    }
    

    public function update(Request $request, Permission $permission){
        $data=request()->validate([
            'name' => 'required',
        ]);
        $permission->update($data);
        
        return response()->json(['status'=>true ,'msg'=>'Permission Updated !!']);
    }
    
    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {

        $perm=Permission::find($id);
        $perm->delete();
    
        return response()->json(['status'=>true ,'msg'=>'Permission Deleted !!']);
    }

}
