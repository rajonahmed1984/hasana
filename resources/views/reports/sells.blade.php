@extends('layouts.app')
@section('content')
<div id="page-content-wrapper">
    <nav class="navbar navbar-expand-lg navbar-light bg-transparent py-4 px-4">
        <div class="d-flex align-items-center">
            <i class="fas fa-align-left primary-text fs-4 me-3" id="menu-toggle"></i>
            <h2 class="fs-2 m-0">বিক্রয় রিপোর্ট</h2>
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
        <!-- Filter Section -->
        <div class="card shadow-sm border-0 mb-4">
            <div class="card-body">
                <div class="row g-3 align-items-end">
                    <div class="col-md-3"><label for="startDate" class="form-label">শুরুর তারিখ</label><input type="date" class="form-control" id="startDate"></div>
                    <div class="col-md-3"><label for="endDate" class="form-label">শেষ তারিখ</label><input type="date" class="form-control" id="endDate"></div>
                    <div class="col-md-2"><button class="btn btn-primary w-100" id="filterBtn">ফিল্টার</button></div>
                </div>
            </div>
        </div>

        <!-- Summary Cards -->
        <div class="row g-3 mb-4">
            <div class="col-md-3"><div class="p-3 bg-white shadow-sm text-center rounded stat-card"><h3 class="fs-2" id="total-sales"></h3><p class="fs-5 mb-0">মোট বিক্রয়</p></div></div>
            <div class="col-md-3"><div class="p-3 bg-white shadow-sm text-center rounded stat-card"><h3 class="fs-2" id="total-profit"></h3><p class="fs-5 mb-0">মোট লাভ</p></div></div>
            <div class="col-md-3"><div class="p-3 bg-white shadow-sm text-center rounded stat-card"><h3 class="fs-2" id="total-invoices"></h3><p class="fs-5 mb-0">মোট চালান</p></div></div>
            <div class="col-md-3"><div class="p-3 bg-white shadow-sm text-center rounded stat-card"><h3 class="fs-2 text-danger" id="total-due"></h3><p class="fs-5 mb-0">মোট বকেয়া</p></div></div>
        </div>

        <!-- Sales List Table -->
        <div class="card shadow-sm border-0">
             <div class="card-header bg-white">
                <div class="row justify-content-between align-items-center">
                    <div class="col-md-6"><h4 class="mb-0"><i class="fas fa-list-ul me-2 accent-text"></i>বিক্রয়ের বিস্তারিত তালিকা</h4></div>
                    <div class="col-md-4"><input type="text" class="form-control" id="searchInput" placeholder="চালান নং বা গ্রাহক দিয়ে খুঁজুন..."></div>
                </div>
            </div>
            <div class="card-body sell_data">
                
            </div>
        </div>
    </div>
</div>
        
@endsection

@push('js')

<script>

$(document).ready(function () {
    
    getData();
    $('#search').change(function(){
        getData();
    });

    $('#search_btn').click(function(){
        getData();
    });

    $('#type_id').change(function(){
        getData();
    });
    
    
    $(document).on('click', ".pagination a", function(e) {
        e.preventDefault();

        $('li').removeClass('active');
        $(this).parent('li').addClass('active');

        var page = $(this).attr('href').split('page=')[1];
        getData(page);
    });
  
    function getData(page=null){
        let search=$('#search').val();

        let brand_id=$('#brand_id').val();
        let category_id=$('#category_id').val();
        let location_id=$('#location_id').val();
    
        $('#data').html('');
        $.ajax({
            url: '{{ route("reports.sells")}}?page='+page,
            type: 'GET',
            data:{search,brand_id, category_id,location_id},
            dataType: 'html',
            success: function(data) {
                $('.sell_data').html(data);
            }
        });
    }
  });        
</script>
@endpush