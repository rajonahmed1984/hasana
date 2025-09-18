@extends('layouts.app')
@section('content')

<div id="page-content-wrapper">
            <nav class="navbar navbar-expand-lg navbar-light bg-transparent py-4 px-4">
                <div class="d-flex align-items-center">
                    <i class="fas fa-align-left primary-text fs-4 me-3" id="menu-toggle"></i>
                    <h2 class="fs-2 m-0">সেটিংস</h2>
                </div>
            </nav>

            <div class="container-fluid px-4">
                <!-- Company Information Card -->
                <div class="card shadow-sm border-0 mb-4">
                    <div class="card-header">
                        <h4 class="mb-0"><i class="fas fa-building me-2 accent-text"></i>কোম্পানির তথ্য</h4>
                    </div>
                    <div class="card-body p-4">
                        <form action="{{ route('settings.update',[$item->id])}}" method="post" id="ajax_form">
                        	@method('PATCH')
      						@csrf
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="companyName" class="form-label">কোম্পানির নাম</label>
                                    <input type="text" name="title" value="{{ $item->title}}" class="form-control" id="companyName">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="companyLogo" class="form-label">কোম্পানির লোগো</label>
                                    <input type="file" name="logo" class="form-control" id="companyLogo">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="companyLogo" class="form-label">কোম্পানির Mobile</label>
                                    <input type="text" name="phone" value="{{ $item->phone}}" class="form-control" id="companyName">
                                </div>

                                <div class="col-6 mb-3">
                                    <label for="companyAddress" class="form-label">ঠিকানা</label>
                                    <textarea class="form-control" name="address" id="companyAddress" rows="2">{{ $item->address}}</textarea>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary">সংরক্ষণ করুন</button>
                        </form>
                    </div>
                </div>

                <!-- Change Password Card -->
                <div class="card shadow-sm border-0">
                    <div class="card-header">
                        <h4 class="mb-0"><i class="fas fa-key me-2 accent-text"></i>পাসওয়ার্ড পরিবর্তন</h4>
                    </div>
                    <div class="card-body p-4">
                        <form>
                            <div class="row">
                                <div class="col-md-4 mb-3">
                                    <label for="currentPassword" class="form-label">বর্তমান পাসওয়ার্ড</label>
                                    <input type="password" class="form-control" id="currentPassword">
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label for="newPassword" class="form-label">নতুন পাসওয়ার্ড</label>
                                    <input type="password" class="form-control" id="newPassword">
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label for="confirmPassword" class="form-label">পাসওয়ার্ড নিশ্চিত করুন</label>
                                    <input type="password" class="form-control" id="confirmPassword">
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary">পাসওয়ার্ড আপডেট করুন</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>



<div class="content d-none">
	<div class="page-header">
		<div class="add-item d-flex">
			<div class="page-title">
				<h4 class="fw-bold">Setting</h4>
				<h6>Manage your Setting</h6>
			</div>
		</div>

	</div>
	<!-- /product list -->
	
	<div class="card flex-fill mb-0">
		<div class="card-header">
			<h4 class="fs-18 fw-bold">Company Settings</h4>
		</div>
		<div class="card-body">
			<form action="{{ route('settings.update',[$item->id])}}" method="post" id="ajax_form">
		      @method('PATCH')
		      @csrf
				<div class="border-bottom mb-3">
					<div class="card-title-head">
						<h6 class="fs-16 fw-bold mb-2">
							<span class="fs-16 me-2"><i class="ti ti-building"></i></span> 
							Company Information
						</h6>
					</div>
					<div class="row">
						<div class="col-xl-4 col-lg-6 col-md-4">
							<div class="mb-3">
								<label class="form-label">
									Company Name  <span class="text-danger">*</span>
								</label>
								<input type="text" class="form-control" name="title" value="{{ $item->title}}">
							</div>
						</div>
						<div class="col-xl-4 col-lg-6 col-md-4">
							<div class="mb-3">
								<label class="form-label">
									Company Email Address  <span class="text-danger">*</span>
								</label>
								<input type="email" class="form-control" name="email" value="{{ $item->email}}">
							</div>
						</div>
						<div class="col-md-4">
							<div class="mb-3">
								<label class="form-label">
									Phone Number <span class="text-danger">*</span>
								</label>
								<input type="text" class="form-control" name="mobile" value="{{ $item->mobile}}">
							</div>
						</div>

					</div>
				</div>
				<div class="border-bottom mb-3 pb-3">
					<div class="card-title-head">
						<h6 class="fs-16 fw-bold mb-2">
							<span class="fs-16 me-2"><i class="ti ti-photo"></i></span> 
							Company Images
						</h6>
					</div>
					<div class="row align-items-center gy-3">
						<div class="col-xl-9">
							<div class="row gy-3 align-items-center">
								<div class="col-lg-4">
									<div class="logo-info">
										<h6 class="fw-medium">Company Icon</h6>
										<p>Upload Icon of your Company</p>
									</div>
								</div>
								<div class="col-lg-8">
									<div class="profile-pic-upload mb-0 justify-content-lg-end">
										<div class="new-employee-field">
											<div class="mb-0">
												<div class="image-upload mb-0">
													<input type="file" name="icon">
													<div class="image-uploads">
														<h4><i class="ti ti-upload me-1"></i>Upload Image</h4>
													</div>
												</div>
												<span class="mt-1">Recommended size is 450px x 450px. Max size 5mb.</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="col-xl-3">
							<div class="new-logo ms-xl-auto">
								<a href="#">
									<img src="assets/img/logo-small.png" alt="Logo">
									<span><i class="ti ti-x"></i></span>
								</a>
							</div>
						</div>
						<div class="col-xl-9">
							<div class="row gy-3 align-items-center">
								<div class="col-lg-4">
									<div class="logo-info">
										<h6 class="fw-medium">Favicon</h6>
										<p>Upload Favicon of your Company</p>
									</div>
								</div>
								<div class="col-lg-8">
									<div class="profile-pic-upload mb-0 justify-content-lg-end">
										<div class="new-employee-field">
											<div class="mb-0">
												<div class="image-upload mb-0">
													<input type="file" name="favicon">
													<div class="image-uploads">
														<h4><i class="ti ti-upload me-1"></i>Upload Image</h4>
													</div>
												</div>
												<span class="mt-1">Recommended size is 450px x 450px. Max size 5mb.</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="col-xl-3">
							<div class="new-logo ms-xl-auto">
								<a href="#">
									<img src="assets/img/logo-small.png" alt="Logo">
									<span><i class="ti ti-x"></i></span>
								</a>
							</div>
						</div>
						<div class="col-xl-9">
							<div class="row gy-3 align-items-center">
								<div class="col-lg-4">
									<div class="logo-info">
										<h6 class="fw-medium">Company Logo</h6>
										<p>Upload Logo of your Company</p>
									</div>
								</div>
								<div class="col-lg-8">
									<div class="profile-pic-upload mb-0 justify-content-lg-end">
										<div class="new-employee-field">
											<div class="mb-0">
												<div class="image-upload mb-0">
													<input type="file" name="logo">
													<div class="image-uploads">
														<h4><i class="ti ti-upload me-1"></i>Upload Image</h4>
													</div>
												</div>
												<span class="mt-1">Recommended size is 450px x 450px. Max size 5mb.</span>
											</div>
										</div>
									</div>
								</div>
							</div>
							
						</div>
						<div class="col-xl-3">
							<div class="new-logo ms-xl-auto">
								<a href="#">
									<img src="{{ getImage('settings',$item->logo)}}" alt="Logo">
									<span><i class="ti ti-x"></i></span>
								</a>
							</div>
						</div>
						
					</div>
				</div>
				<div class="company-address">
					<div class="card-title-head">
						<h6 class="fs-16 fw-bold mb-2">
							<span class="fs-16 me-2"><i class="ti ti-map-pin"></i></span> 
							Address Information
						</h6>
					</div>
					<div class="row">
						<div class="col-md-12">
							<div class="mb-3">
								<label class="form-label">
									Address <span class="text-danger">*</span>
								</label>
								<textarea class="form-control" name="address">{{ $item->address}}</textarea>
							</div>
						</div>
						
					</div>
				</div>
				<div class="text-end settings-bottom-btn mt-0">
					<button type="submit" class="btn btn-primary">Save Changes</button>
				</div>
			</form>
		</div>
	</div>

	<!-- /product list -->
</div>
@endsection

@push('js')

@endpush