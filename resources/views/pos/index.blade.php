@extends('layouts.app')
@section('content')
<div class="content">
	<div class="page-header">
		<div class="add-item d-flex">
			<div class="page-title">
				<h4>POS Orders</h4>
				<h6>Manage Your pos orders</h6>
			</div>
		</div>
	</div>
	
	<!-- /product list -->
	<div class="card">
		<div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
			<div class="search-set">
				<div class="search-input">
					<input type="text" id="search" class="form-control" placeholder="search">
				</div>
			</div>
			<div class="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
				<div class="dropdown me-2">
					<a href="javascript:void(0);" class="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
						Customer
					</a>
					<ul class="dropdown-menu  dropdown-menu-end p-3">
						<li>
							<a href="javascript:void(0);" class="dropdown-item rounded-1">Carl Evans</a>
						</li>
						<li>
							<a href="javascript:void(0);" class="dropdown-item rounded-1">Minerva Rameriz</a>
						</li>
						<li>
							<a href="javascript:void(0);" class="dropdown-item rounded-1">Robert Lamon</a>
						</li>
						<li>
							<a href="javascript:void(0);" class="dropdown-item rounded-1">Patricia Lewis</a>
						</li>
					</ul>
				</div>
				<div class="dropdown me-2">
					<a href="javascript:void(0);" class="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
						Staus
					</a>
					<ul class="dropdown-menu  dropdown-menu-end p-3">
						<li>
							<a href="javascript:void(0);" class="dropdown-item rounded-1">Completed</a>
						</li>
						<li>
							<a href="javascript:void(0);" class="dropdown-item rounded-1">Pending</a>
						</li>
					</ul>
				</div>
				<div class="dropdown me-2">
					<a href="javascript:void(0);" class="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
						Payment Status
					</a>
					<ul class="dropdown-menu  dropdown-menu-end p-3">
						<li>
							<a href="javascript:void(0);" class="dropdown-item rounded-1">Paid</a>
						</li>
						<li>
							<a href="javascript:void(0);" class="dropdown-item rounded-1">Unpaid</a>
						</li>
						<li>
							<a href="javascript:void(0);" class="dropdown-item rounded-1">Overdue</a>
						</li>
					</ul>
				</div>
				<div class="dropdown">
					<a href="javascript:void(0);" class="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
						Sort By : Last 7 Days
					</a>
					<ul class="dropdown-menu  dropdown-menu-end p-3">
						<li>
							<a href="javascript:void(0);" class="dropdown-item rounded-1">Recently Added</a>
						</li>
						<li>
							<a href="javascript:void(0);" class="dropdown-item rounded-1">Ascending</a>
						</li>
						<li>
							<a href="javascript:void(0);" class="dropdown-item rounded-1">Desending</a>
						</li>
						<li>
							<a href="javascript:void(0);" class="dropdown-item rounded-1">Last Month</a>
						</li>
						<li>
							<a href="javascript:void(0);" class="dropdown-item rounded-1">Last 7 Days</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="card-body p-0 sell_data">
			
		</div>
	</div>
	<!-- /product list -->
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
    
        $('.sell_data').html('');
        $.ajax({
            url: '{{ route("pos.index")}}?page='+page,
            type: 'GET',
            data:{q,start,end,exstart,exend,type_id},
            dataType: 'html',
            success: function(data) {
                $('.sell_data').html(data);
            }
        });
    }
  });
</script>
@endpush