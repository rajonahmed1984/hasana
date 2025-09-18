@extends('layouts.app')
@section('content')

<div id="page-content-wrapper">
    <nav class="navbar navbar-expand-lg navbar-light bg-transparent py-4 px-4">
        <div class="d-flex align-items-center">
            <i class="fas fa-align-left primary-text fs-4 me-3" id="menu-toggle"></i>
            <h2 class="fs-2 m-0">রিপোর্ট হাব</h2>
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
                <a href="{{ route('reports.sells')}}" class="report-card">
                    <i class="fas fa-chart-line"></i>
                    <h4>বিক্রয় রিপোর্ট</h4>
                    <p>দৈনিক, সাপ্তাহিক, মাসিক বিক্রয়ের বিস্তারিত দেখুন।</p>
                </a>
            </div>
            <div class="col-lg-4 col-md-6">
                <a href="{{ route('reports.productStock')}}" class="report-card">
                    <i class="fas fa-boxes-stacked"></i>
                    <h4>ইনভেন্টরি রিপোর্ট</h4>
                    <p>বর্তমান স্টক, ব্যাচ এবং মেয়াদ অনুযায়ী রিপোর্ট।</p>
                </a>
            </div>
            <div class="col-lg-4 col-md-6">
                <a href="{{ route('reports.profitLoss')}}" class="report-card">
                    <i class="fas fa-calculator"></i>
                    <h4>লাভ-ক্ষতির রিপোর্ট</h4>
                    <p>আপনার ব্যবসার লাভ বা ক্ষতির হিসাব দেখুন।</p>
                </a>
            </div>
            <div class="col-lg-4 col-md-6">
                <a href="{{ route('reports.dueSells')}}" class="report-card">
                    <i class="fas fa-file-invoice-dollar"></i>
                    <h4>বকেয়া রিপোর্ট</h4>
                    <p>গ্রাহক ও সাপ্লায়ারদের বকেয়ার তালিকা।</p>
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