@extends('layouts.app')
@section('content')

<div id="page-content-wrapper">
    <nav class="navbar navbar-expand-lg navbar-light bg-transparent py-4 px-4">
        <div class="d-flex align-items-center">
            <i class="fas fa-align-left primary-text fs-4 me-3" id="menu-toggle"></i>
            <h2 class="fs-2 m-0">খতিয়ান</h2>
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
            <div class="card-header bg-white">
                <div class="row g-3 align-items-end">
                    <div class="col-md-4">
                        <label  class="form-label">হিসাব নির্বাচন করুন</label>
                        <select class="form-select" name="account_id">
                            <option value="">নির্বাচন করুন</option>
                            @foreach($items as $item)
                            <option value="{{ $item->id}}">{{ $item->name}}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label for="startDate" class="form-label">শুরুর তারিখ</label>
                        <input type="date" class="form-control" id="startDate">
                    </div>
                    <div class="col-md-3">
                        <label for="endDate" class="form-label">শেষ তারিখ</label>
                        <input type="date" class="form-control" id="endDate">
                    </div>
                    <div class="col-md-2">
                        <button class="btn btn-primary w-100" id="filterLedgerBtn">দেখুন</button>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <h3 class="text-center primary-text mb-4" id="ledger-title">অনুগ্রহ করে একটি হিসাব নির্বাচন করুন</h3>
                <div class="table-responsive">
                    <table class="table table-bordered">
                        <thead class="table-header-custom">
                            <tr>
                                <th>তারিখ</th>
                                <th>বিবরণ</th>
                                <th>তথ্যসূত্র</th>
                                <th class="text-end">ডেবিট</th>
                                <th class="text-end">ক্রেডিট</th>
                                <th class="text-end">ব্যালেন্স</th>
                            </tr>
                        </thead>
                        <tbody id="ledger-table-body"></tbody>
                        <tfoot id="ledger-table-foot"></tfoot>
                    </table>
                </div>
                 <!-- Pagination Controls -->
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