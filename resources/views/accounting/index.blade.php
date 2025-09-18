@extends('layouts.app')
@section('content')

<div id="page-content-wrapper">
    <nav class="navbar navbar-expand-lg navbar-light bg-transparent py-4 px-4">
        <div class="d-flex align-items-center">
            <i class="fas fa-align-left primary-text fs-4 me-3" id="menu-toggle"></i>
            <h2 class="fs-2 m-0">হিসাবের তালিকা (Chart of Accounts)</h2>
        </div>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle second-text fw-bold" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fas fa-user me-2"></i>ইউজার নেম
                    </a>

                    

                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                        <li><a class="dropdown-item" href="#">প্রোফাইল</a></li>
                        <li><a class="dropdown-item" href="#">লগ আউট</a></li>
                    </ul>
                </li>
            </ul>
        </div>
    </nav>

    <div class="container-fluid px-4">
        <div class="card shadow-sm border-0">
             <div class="card-header bg-white d-flex justify-content-between align-items-center">
                <h4 class="mb-0"><i class="fas fa-list-ul me-2 accent-text"></i>সকল অ্যাকাউন্ট</h4>

                <a class="btn btn-primary btn_modal" href="{{ route('accounts.create')}}">
                        <i class="fas fa-plus-circle me-2"></i> নতুন অ্যাকাউন্ট
                    </a>

            </div>
            <div class="card-body">
                <div class="row mb-3 justify-content-end">
                    <div class="col-md-4">
                        <input type="text" class="form-control" id="search" placeholder="অ্যাকাউন্টের নাম বা কোড দিয়ে খুঁজুন...">
                    </div>
                </div>
                <div class="table-responsive">
                    <table class="table table-hover align-middle">
                        <thead class="table-header-custom">
                            <tr>
                                <th>অ্যাকাউন্ট কোড</th>
                                <th>অ্যাকাউন্টের নাম</th>
                                <th>অ্যাকাউন্টের ধরণ</th>
                                <th>ব্যালেন্স</th>
                                <th>স্ট্যাটাস</th>
                                <th class="text-center">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody id="accounts-list-tbody">
                            @foreach($items as $item)
                            <tr>
                                <td>{{ $item->account_no}}</td>
                                <td>{{ $item->name}}</td>
                                <td>{{ $item->type}}</td>
                                <td>{{ $item->openning_balance}}</td>
                                <td>{{ $item->openning_balance_date}}</td>
                                <td><span class=" {{ $item->status}}">{{ $item->status==1?'active':'de-active'}}</span></td>
                                <td class="text-center">
                                    <a href="{{ route('accounts.show',[$item->id])}}" class="btn btn-sm btn-outline-primary" title="লেজার দেখুন">
                                        <i class="fas fa-eye"></i>
                                    </a>
                                    <a class="btn btn-sm btn-outline-secondary mx-1 btn_modal"
                                        href="{{ route('accounts.edit',[$item->id])}}"
                                        title="সম্পাদনা">
                                        <i class="fas fa-edit"></i>
                                    </a>
                                    <a class="btn btn-sm btn-outline-danger delete" title="মুছুন" href="{{ route('accounts.destroy',[$item->id])}}">
                                        <i class="fas fa-trash-alt"></i>
                                    </a>
                                </td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
                <div class="d-flex justify-content-between align-items-center mt-3">
                    <div class="text-muted" id="pagination-info"></div>
                    <nav><ul class="pagination mb-0" id="pagination-container"></ul></nav>
                </div>
            </div>
        </div>
    </div>
</div>

@endsection

@push('js')

@endpush