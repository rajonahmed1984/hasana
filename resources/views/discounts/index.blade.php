@extends('layouts.app')
@section('content')

<div id="page-content-wrapper">
    <nav class="navbar navbar-expand-lg navbar-light bg-transparent py-4 px-4">
        <div class="d-flex align-items-center">
            <i class="fas fa-align-left primary-text fs-4 me-3" id="menu-toggle"></i>
            <h2 class="fs-2 m-0">অফার/ডিসকাউন্ট</h2>
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
        <div class="row">
            <div class="col-lg-5">
                <div class="card shadow-sm border-0">
                    <div class="card-header bg-white">
                        <h4 class="mb-0"><i class="fas fa-plus-circle me-2 accent-text"></i>নতুন অফার তৈরি করুন</h4>
                    </div>
                    <div class="card-body">
                        <form id="offerForm">
                            <div class="mb-3">
                                <label for="offerName" class="form-label">অফারের নাম</label>
                                <input type="text" class="form-control" id="offerName" required>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="offerType" class="form-label">অফারের ধরন</label>
                                    <select id="offerType" class="form-select">
                                        <option value="percentage">পার্সেন্টেজ (%)</option>
                                        <option value="fixed">ফিক্সড টাকা (৳)</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="offerValue" class="form-label">পরিমাণ</label>
                                    <input type="number" class="form-control" id="offerValue" required>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="startDate" class="form-label">শুরুর তারিখ</label>
                                    <input type="date" class="form-control" id="startDate">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="endDate" class="form-label">শেষ তারিখ</label>
                                    <input type="date" class="form-control" id="endDate">
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary">সংরক্ষণ করুন</button>
                        </form>
                    </div>
                </div>
            </div>
            <div class="col-lg-7">
                <div class="card shadow-sm border-0">
                    <div class="card-header bg-white">
                        <h4 class="mb-0"><i class="fas fa-list-ul me-2 accent-text"></i>অফারের তালিকা</h4>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead class="table-header-custom">
                                    <tr><th>নাম</th><th>ধরন</th><th>পরিমাণ</th><th>স্ট্যাটাস</th><th>অ্যাকশন</th></tr>
                                </thead>
                                <tbody id="offer-table-body"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@push('js')


<script type="text/javascript">
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
        let q=$('#search').val();
        let start=$('#start').val();
        let end=$('#end').val();

        let exstart=$('#exstart').val();
        let exend=$('#exend').val();

        let type_id=$('#type_id').val();
    
        $('#member_data').html('');
        $.ajax({
            url: '{{ route("locations.index")}}?page='+page,
            type: 'GET',
            data:{q,start,end,exstart,exend,type_id},
            dataType: 'html',
            success: function(data) {
                $('#data').html(data);
            }
        });
    }
  });
</script>
@endpush