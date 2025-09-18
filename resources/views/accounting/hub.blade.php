@extends('layouts.app')
@section('content')

<div id="page-content-wrapper">
    <nav class="navbar navbar-expand-lg navbar-light bg-transparent py-4 px-4">
        <div class="d-flex align-items-center">
            <i class="fas fa-align-left primary-text fs-4 me-3" id="menu-toggle"></i>
            <h2 class="fs-2 m-0">অ্যাকাউন্টিং হাব</h2>
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
        <div class="row g-4">
            <div class="col-lg-4 col-md-6">
                <a href="{{ route('accounts.index')}}" class="report-card">
                    <i class="fas fa-sitemap"></i>
                    <h4>হিসাবের তালিকা</h4>
                    <p>সকল অ্যাকাউন্টিং হেড তৈরি ও পরিচালনা করুন।</p>
                </a>
            </div>
            <div class="col-lg-4 col-md-6">
                <a href="{{ route('journal')}}" class="report-card">
                    <i class="fas fa-book"></i>
                    <h4>জাবেদা</h4>
                    <p>দৈনিক লেনদেনগুলো ডেবিট ও ক্রেডিট করুন।</p>
                </a>
            </div>
            <div class="col-lg-4 col-md-6">
                <a href="{{ route('ledger')}}" class="report-card">
                    <i class="fas fa-balance-scale-right"></i>
                    <h4>খতিয়ান</h4>
                    <p>যেকোনো হিসাবের বিস্তারিত লেনদেন দেখুন।</p>
                </a>
            </div>
            <div class="col-lg-4 col-md-6">
                <a href="{{ route('trailBalance')}}" class="report-card">
                    <i class="fas fa-file-alt"></i>
                    <h4>রেওয়ামিল</h4>
                    <p>সকল হিসাবের ডেবিট ও ক্রেডিট ব্যালেন্স মেলান।</p>
                </a>
            </div>
        </div>
    </div>
</div>

@endsection

@push('js')
<script type="text/javascript">
  
</script>
@endpush