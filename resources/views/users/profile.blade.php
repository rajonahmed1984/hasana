@extends('layouts.app')
@section('content')

<div id="page-content-wrapper">
    <nav class="navbar navbar-expand-lg navbar-light bg-transparent py-4 px-4">
        <div class="d-flex align-items-center">
            <i class="fas fa-align-left primary-text fs-4 me-3" id="menu-toggle"></i>
            <h2 class="fs-2 m-0">প্রোফাইল</h2>
        </div>
    </nav>

    <div class="container-fluid px-4">
        <div class="card shadow-sm border-0">
            <div class="card-body p-4">
                <div class="row">
                    <div class="col-lg-4 text-center border-end-lg">
                        <div class="profile-picture-container mx-auto mb-3">
                            <img width="200" src="{{ getImage('users', $user->image)}}" alt="User Profile" class="profile-picture">
                        </div>
                        <h4 class="fw-bold primary-text"> {{ $user->name}} </h4>
                        <p class="text-muted">{{ $user->email }}</p>
                    </div>
                    <div class="col-lg-8 ps-lg-5">
                        <h3 class="mb-4 accent-text">ব্যক্তিগত তথ্য</h3>
                        <form id="ajax_form" method="post" action="{{ route('userProfileUpdate')}}">
                            @csrf
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="name" class="form-label">পুরো নাম</label>
                                    <input type="text" class="form-control" name="name" value="{{ $user->name}}">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="email" class="form-label">ইমেইল</label>
                                    <input type="email" class="form-control" name="email" value="{{ $user->email}}">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="phone" class="form-label">ফোন নম্বর</label>
                                    <input type="tel" class="form-control" name="phone" value="{{ $user->phone}}">
                                </div>

                                <div class="col-md-6 mb-3">
                                    <label for="phone" class="form-label">Image</label>
                                    <input type="file" class="form-control" name="image">
                                </div>
                              
                                <div class="col-12 mb-3">
                                    <label for="address" class="form-label">ঠিকানা</label>
                                    <textarea class="form-control" name="address" rows="3">{{ $user->address}}</textarea>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-pencil-alt me-2"></i>তথ্য এডিট করুন
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </div>

        <div class="card shadow-sm border-0">
            <div class="card-header">
                <h4 class="mb-0"><i class="fas fa-key me-2 accent-text"></i>পাসওয়ার্ড পরিবর্তন</h4>
            </div>
            <div class="card-body p-4">
                <form id="ajax_form" method="post" action="{{ route('userPasswordUpdate')}}">
                    @csrf
                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <label  class="form-label">বর্তমান পাসওয়ার্ড</label>
                            <input type="password" class="form-control" name="current_password">
                        </div>
                        <div class="col-md-4 mb-3">
                            <label  class="form-label">নতুন পাসওয়ার্ড</label>
                            <input type="password" name="new_password" class="form-control">
                        </div>
                        <div class="col-md-4 mb-3">
                            <label  class="form-label">পাসওয়ার্ড নিশ্চিত করুন</label>
                            <input type="password" class="form-control" name="new_password_confirmation">
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary">পাসওয়ার্ড আপডেট করুন</button>
                </form>
            </div>
        </div>

    </div>
</div>
@endsection

@push('js')
@endpush