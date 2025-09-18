@extends('layouts.app')
@section('content')
<div class="content">
	<div class="page-header">
		<div class="page-title">
			<h4>Profile</h4>
			<h6>User Profile</h6>
		</div>
	</div>
	<!-- /product list -->
	<div class="card">
		<div class="card-header">
			<h4>Profile</h4>
		</div>
		<div class="card-body profile-body">
			<form action="{{ route('users.update',[$user->id])}}" method="post" id="ajax_form">
		      @method('PATCH')
		      @csrf
			<h5 class="mb-2"><i class="ti ti-user text-primary me-1"></i>Basic Information</h5>
			<div class="profile-pic-upload image-field">
				<div class="profile-pic p-2">
					<img src="{{ getImage('users',$user->image)}}" class="object-fit-cover h-100 rounded-1" alt="user">
					<button type="button" class="close rounded-1">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="mb-3">
					<div class="image-upload mb-0 d-inline-flex">
						<input type="file" name="image">
						<div class="btn btn-primary fs-13">Change Image</div>
					</div>
					<p class="mt-2">Upload an image below 2 MB, Accepted File format JPG, PNG</p>
				</div>
			</div>
			<div class="row">
				<div class="col-lg-6 col-sm-12">
					<div class="mb-3">
						<label class="form-label">Full Name<span class="text-danger ms-1">*</span></label>
						<input type="text" name="name" class="form-control" value="{{ $user->name}}">
					</div>
				</div>
				<div class="col-lg-6 col-sm-12">
					<div class="mb-3">
						<label>Email<span class="text-danger ms-1">*</span></label>
						<input type="email" name="email" class="form-control" value="{{ $user->email}}">
					</div>
				</div>
				<div class="col-lg-6 col-sm-12">
					<div class="mb-3">
						<label class="form-label">Phone Number<span class="text-danger ms-1">*</span></label>
						<input type="text" value="{{ $user->mobile}}" name="mobile" class="form-control">
					</div>
				</div>

				<div class="col-12 d-flex justify-content-end">
					<button type="submit" class="btn btn-primary shadow-none">Save Changes</button>
				</div>
			</div>
			</form>
		</div>
	</div>
	<!-- /product list -->

	<div class="card">
		<div class="card-header">
			<h4>Vendor Profile</h4>
		</div>
		<div class="card-body profile-body">
			<form action="{{ route('vandorUpdate')}}" method="post" id="ajax_form">
		      @csrf
			<h5 class="mb-2"><i class="ti ti-user text-primary me-1"></i>Vendor Information</h5>
	
			<div class="row">
				<div class="col-lg-6 col-sm-12">
					<div class="mb-3">
						<label class="form-label"> Business Name<span class="text-danger ms-1">*</span></label>
						<input type="text" name="name" class="form-control" value="{{ $vendor->name??''}}">
					</div>
				</div>
				<div class="col-lg-6 col-sm-12">
					<div class="mb-3">
						<label>Email<span class="text-danger ms-1">*</span></label>
						<input type="email" name="email" class="form-control" value="{{ $vendor->email??''}}">
					</div>
				</div>
				<div class="col-lg-6 col-sm-12">
					<div class="mb-3">
						<label class="form-label">Phone Number<span class="text-danger ms-1">*</span></label>
						<input type="text" value="{{ $vendor->phone??''}}" name="phone" class="form-control">
					</div>
				</div>

				<div class="col-lg-6 col-sm-12">
					<div class="mb-3">
						<label class="form-label"> Address <span class="text-danger ms-1">*</span></label>
						<textarea name="address" class="form-control">{{ $vendor->address}}</textarea>
					</div>
				</div>

				<div class="col-lg-6 col-sm-12">
					<div class="mb-3">
						<label class="form-label">Return Policy<span class="text-danger ms-1">*</span></label>
						<input type="text" value="{{ $vendor->return??''}}" name="return" class="form-control">
					</div>
				</div>

				<div class="col-lg-6 col-sm-12">
					<div class="mb-3">
						<label class="form-label">Warranty Policy<span class="text-danger ms-1">*</span></label>
						<input type="text" value="{{ $vendor->warranty??''}}" name="warranty" class="form-control">
					</div>
				</div>

				<div class="col-12 d-flex justify-content-end">
					<button type="submit" class="btn btn-primary shadow-none">Save Changes</button>
				</div>
			</div>
			</form>
		</div>
	</div>
</div>


@endsection