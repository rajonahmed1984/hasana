<?php
    
namespace App\Http\Controllers;
    
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Arr;
use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;
use App\Utils\ProductUtil;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
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
    public function index(Request $request): View
    {
        $items = User::latest()->paginate(5);
  
        return view('users.index',compact('items'));
    }
    
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(): View
    {
        $roles = Role::pluck('name','name')->all();

        return view('users.create',compact('roles'));
    }
    
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'name' => 'required',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|unique:users,phone',
            'password' => 'required|same:confirm-password',
            'address' => '',
            'roles' => 'required'
        ]);
    
        $input = $request->all();
        $input['password'] = Hash::make($input['password']);

        $image=$this->productUtil->FileUpload($request,'image','users'); 

        if($image){
            $input['image']=$image;
        }

    
        $user = User::create($input);
        $user->assignRole($request->input('roles'));

        return response()->json(['status'=>true ,'msg'=>'User created successfully !!']);
    }
    
    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id): View
    {
        $user = Auth::user();

        $vendor=$user->vendor_address;
        return view('users.show',compact('user','vendor'));
    }
    
    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id): View
    {
        $user = User::find($id);
        $roles = Role::pluck('name','name')->all();
        $userRole = $user->roles->pluck('name','name')->all();
    
        return view('users.edit',compact('user','roles','userRole'));
    }
    
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $user = User::find($id);
        $input=$this->validate($request, [
            'name' => 'required',
            'email' => 'required|email|unique:users,email,'.$id,
            'phone' => 'required|unique:users,phone,'.$id,
            'address' => '',
        ]);

        $image=$this->productUtil->FileUpload($request,'image','users'); 

        if($image){
            deleteImage('users', $user->image);
            $input['image']=$image;
        }

        
        $user->update($input);
        if (isset($request->roles)) {
            DB::table('model_has_roles')->where('model_id',$id)->delete();
            $user->assignRole($request->input('roles'));
        }
        return response()->json(['status'=>true ,'msg'=>'User Updated !!']);
    }

    
    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id): RedirectResponse
    {
        User::find($id)->delete();
        return redirect()->route('users.index')
                        ->with('success','User deleted successfully');
    }

    public function userProfile(){
        $user = Auth::user();
        return view('users.profile',compact('user'));
    }

    public function userProfileUPdate(Request $request){
        $user = Auth::user();
        $input=$this->validate($request, [
            'name' => 'required',
            'email' => 'required|email|unique:users,email,'.$user->id,
            'phone' => 'required|unique:users,phone,'.$user->id,
            'address' => '',
            'designation' => '',
        ]);

        $image=$this->productUtil->FileUpload($request,'image','users'); 

        if($image){
            deleteImage('user',$user->image);
            $input['image']=$image;
        }

        $user->update($input);
        return response()->json(['status'=>true ,'msg'=>'Profile Updated !!']);
    }

    public function userPasswordUpdate(Request $request){
        $request->validate([
            'current_password' => ['required'],
            'new_password' => ['required', 'string', 'min:6', 'confirmed'],
        ]);

        // Check current password
        if (!Hash::check($request->current_password, Auth::user()->password)) {

            return response()->json(['status'=>false ,'msg'=>'Current password does not match.']);

        }

        // Update new password
        Auth::user()->update([
            'password' => Hash::make($request->new_password),
        ]);
        return response()->json(['status'=>true ,'msg'=>'Password changed successfully!']);
    }

}