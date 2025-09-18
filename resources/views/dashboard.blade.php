@extends('layouts.app')

@section('content')

@php($languages = ['en' => 'English', 'bn' => 'Bangla', 'it' => 'Italian'])
<div id="page-content-wrapper">
    <nav class="navbar navbar-expand-lg navbar-light bg-transparent py-4 px-4">
        <div class="d-flex align-items-center">
            <i class="fas fa-align-left primary-text fs-4 me-3" id="menu-toggle"></i>
            <h2 class="fs-2 m-0">ড্যাশবোর্ড</h2>
        </div>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
            aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle second-text fw-bold" href="#" id="navbarDropdown"
                        role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fa-solid fa-flag me-2"></i> {{ $languages[Session::get('locale', 'en')] }}
                    </a>

                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                        <li><a class="dropdown-item" href="{{route('change.lang', ['lang' => 'en'])}}">English</a></li>
                        <li><a class="dropdown-item" href="{{route('change.lang', ['lang' => 'bn'])}}">Bangla</a></li>
                    </ul>
                </li>
            </ul>
        </div>


        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle second-text fw-bold" href="#" id="navbarDropdown"
                        role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fas fa-user me-2"></i>ইউজার নেম 
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                        <li><a class="dropdown-item" href="{{ route('userProfile') }}">প্রোফাইল</a></li>
                        <li><a class="dropdown-item" href="{{ route('settings.index') }}">সেটিংস</a></li>
                        <li><a class="dropdown-item" onclick="event.preventDefault();
                                             document.getElementById('logout-form').submit();"
                                             >লগ আউট</a></li>

                        <form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
                            @csrf
                        </form>

                    </ul>
                </li>
            </ul>
        </div>
    </nav>

    <div class="container-fluid px-4">
        <div class="row g-3 my-2">
            <div class="col-lg-3 col-md-6">
                <div class="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded stat-card">
                    <div>
                        <h3 class="fs-2">৳৭৮,৪৫৬</h3>
                        <p class="fs-5 mb-0">আজকের বিক্রি</p>
                    </div>
                    <i class="fas fa-hand-holding-usd fs-1 primary-text border rounded-full secondary-bg p-3"></i>
                </div>
            </div>

            <div class="col-lg-3 col-md-6">
                <div class="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded stat-card">
                    <div>
                        <h3 class="fs-2">৳১২,৩৫০</h3>
                        <p class="fs-5 mb-0">আজকের লাভ</p>
                    </div>
                    <i class="fas fa-chart-pie fs-1 primary-text border rounded-full secondary-bg p-3"></i>
                </div>
            </div>

            <div class="col-lg-3 col-md-6">
                <div class="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded stat-card">
                    <div>
                        <h3 class="fs-2">৳১,৫০,০০০</h3>
                        <p class="fs-5 mb-0">মোট বকেয়া</p>
                    </div>
                    <i class="fas fa-file-invoice-dollar fs-1 primary-text border rounded-full secondary-bg p-3"></i>
                </div>
            </div>

            <div class="col-lg-3 col-md-6">
                <div class="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded stat-card">
                    <div>
                        <h3 class="fs-2">১২টি</h3>
                        <p class="fs-5 mb-0">কম স্টক পণ্য</p>
                    </div>
                    <i class="fas fa-exclamation-triangle fs-1 text-danger border rounded-full secondary-bg p-3"></i>
                </div>
            </div>
        </div>

        <div class="row my-5">
            <div class="col-lg-7 mb-4 mb-lg-0">
                <div class="card shadow-sm h-100">
                    <div class="card-header">
                        <h3 class="fs-4 mb-0"><i class="fas fa-chart-bar me-2 accent-text"></i>সাপ্তাহিক বিক্রয় রিপোর্ট</h3>
                    </div>
                    <div class="card-body">
                        <canvas id="salesChart"></canvas>
                    </div>
                </div>
            </div>
            <div class="col-lg-5">
                <div class="card shadow-sm h-100">
                     <div class="card-header">
                        <h3 class="fs-4 mb-0"><i class="fas fa-chart-pie me-2 accent-text"></i>বেস্ট সেলিং ক্যাটাগরি</h3>
                    </div>
                    <div class="card-body d-flex align-items-center justify-content-center">
                        <canvas id="categoryChart"></canvas>
                    </div>
                </div>
            </div>
        </div>

        <div class="row my-5">
            <h3 class="fs-4 mb-3">সাম্প্রতিক বিক্রয়</h3>
            <div class="col">
                <div class="table-responsive">
                    <table class="table bg-white rounded shadow-sm table-hover align-middle">
                        <thead class="table-header-custom">
                            <tr>
                                <th scope="col" width="50">#</th>
                                <th scope="col">ইনভয়েস নং</th>
                                <th scope="col">গ্রাহক</th>
                                <th scope="col">মোট টাকা</th>
                                <th scope="col">স্ট্যাটাস</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">1</th>
                                <td>INV-00125</td>
                                <td>রহিম শেখ</td>
                                <td>৳২,৫০০</td>
                                <td><span class="badge bg-success-subtle text-success-emphasis">Paid</span></td>
                            </tr>
                            <tr>
                                <th scope="row">2</th>
                                <td>INV-00124</td>
                                <td>করিম স্টোর</td>
                                <td>৳৮,২০০</td>
                                <td><span class="badge bg-warning-subtle text-warning-emphasis">Due</span></td>
                            </tr>
                            <tr>
                                <th scope="row">3</th>
                                <td>INV-00123</td>
                                <td>সালাম ব্রাদার্স</td>
                                <td>৳৫,৭৫০</td>
                                <td><span class="badge bg-success-subtle text-success-emphasis">Paid</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    </div>
</div>
@endsection

@push('js')

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<script type="text/javascript">
document.addEventListener("DOMContentLoaded", function() {
    // --- Helper function to check if an element exists ---
    const elementExists = (id) => document.getElementById(id) !== null;

    /**
     * Initializes charts for the Supershop / Retail Shop Dashboard.
     */
    const initSupershopDashboard = () => {
        // Sales Chart (Bar)
        const salesCtx = document.getElementById('salesChart').getContext('2d');
        new Chart(salesCtx, {
            type: 'bar',
            data: {
                labels: ['শনি', 'রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র'],
                datasets: [{
                    label: 'বিক্রয় (৳)',
                    data: [12500, 19200, 14000, 21500, 18000, 25000, 22300],
                    backgroundColor: 'rgba(42, 58, 141, 0.8)',
                    borderColor: 'rgba(42, 58, 141, 1)',
                    borderWidth: 1,
                    borderRadius: 5
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
        });

        // Category Chart (Doughnut)
        const categoryCtx = document.getElementById('categoryChart').getContext('2d');
        new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: ['গ্রোসারি', 'কসমেটিকস', 'বেভারেজ', 'স্ন্যাকস', 'অন্যান্য'],
                datasets: [{
                    data: [300, 150, 100, 80, 50],
                    backgroundColor: ['#2A3A8D', '#F47C20', '#6c757d', '#198754', '#ffc107'],
                    hoverOffset: 4
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
        });
    };

    /**
     * Initializes charts for the Tiles & Sanitary Dashboard.
     */
    const initTilesDashboard = () => {
        // Sales vs Quotation Chart (Bar)
        const salesVsQuotationCtx = document.getElementById('salesVsQuotationChart').getContext('2d');
        new Chart(salesVsQuotationCtx, {
            type: 'bar',
            data: {
                labels: ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন'],
                datasets: [
                    { label: 'কোটেশন (৳)', data: [120000, 190000, 140000, 210000, 180000, 250000], backgroundColor: 'rgba(244, 124, 32, 0.7)' },
                    { label: 'বিক্রয় (৳)', data: [80000, 150000, 110000, 180000, 160000, 220000], backgroundColor: 'rgba(42, 58, 141, 0.8)' }
                ]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
        });

        // Project Sales Chart (Doughnut)
        const projectSalesCtx = document.getElementById('projectSalesChart').getContext('2d');
        new Chart(projectSalesCtx, {
            type: 'doughnut',
            data: {
                labels: ['প্রজেক্ট আলফা', 'প্রজেক্ট বিটা', 'প্রজেক্ট গামা', 'খুচরা বিক্রয়'],
                datasets: [{ data: [300000, 250000, 150000, 80000], backgroundColor: ['#2A3A8D', '#F47C20', '#6c757d', '#198754'] }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
        });
    };

    /**
     * Initializes charts for the Wholesaler / Distributor Dashboard.
     */
    const initWholesalerDashboard = () => {
        // Sales Order Chart (Bar)
        const salesOrderCtx = document.getElementById('salesOrderChart').getContext('2d');
        new Chart(salesOrderCtx, {
            type: 'bar',
            data: {
                labels: ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন'],
                datasets: [{
                    label: 'সেলস অর্ডার (৳)',
                    data: [850000, 1200000, 950000, 1500000, 1300000, 1800000],
                    backgroundColor: 'rgba(42, 58, 141, 0.8)'
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
        });

        // Top Dealers List
        const topDealersList = document.getElementById('top-dealers-list');
        const topDealers = [
            { name: 'রহিম ট্রেডার্স, ঢাকা', sales: 250000 },
            { name: 'করিম এন্টারপ্রাইজ, চট্টগ্রাম', sales: 220000 },
        ];
        topDealersList.innerHTML = '';
        topDealers.forEach(dealer => {
            topDealersList.insertAdjacentHTML('beforeend', `<li class="list-group-item d-flex justify-content-between align-items-center">${dealer.name}<span class="badge bg-primary rounded-pill">৳${dealer.sales.toLocaleString('bn-BD')}</span></li>`);
        });
    };

    /**
     * Initializes charts for the Medical Equipment Supplier Dashboard.
     */
    const initMedicalDashboard = () => {
        // Sales vs Tender Chart (Bar)
        const salesVsTenderCtx = document.getElementById('salesVsTenderChart').getContext('2d');
        new Chart(salesVsTenderCtx, {
            type: 'bar',
            data: {
                labels: ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন'],
                datasets: [
                    { label: 'টেন্ডার (৳)', data: [1200000, 1900000, 1400000, 2100000, 1800000, 2500000], backgroundColor: 'rgba(244, 124, 32, 0.7)' },
                    { label: 'বিক্রয় (৳)', data: [800000, 1500000, 1100000, 1800000, 1600000, 2200000], backgroundColor: 'rgba(42, 58, 141, 0.8)' }
                ]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
        });

        // Top Selling Products Chart (Doughnut)
        const topProductsCtx = document.getElementById('topProductsChart').getContext('2d');
        new Chart(topProductsCtx, {
            type: 'doughnut',
            data: {
                labels: ['Ultrasound Machine', 'ECG Machine', 'Patient Monitor', 'অন্যান্য'],
                datasets: [{ data: [1200000, 750000, 500000, 300000], backgroundColor: ['#2A3A8D', '#F47C20', '#6c757d', '#198754'] }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
        });
    };

    // --- Page Router ---
    // Checks which dashboard is active by looking for a specific chart ID.
    if (elementExists('salesChart')) {
        initSupershopDashboard();
    } else if (elementExists('salesVsQuotationChart')) {
        initTilesDashboard();
    } else if (elementExists('salesOrderChart')) {
        initWholesalerDashboard();
    } else if (elementExists('salesVsTenderChart')) {
        initMedicalDashboard();
    }
});

</script>
@endpush
