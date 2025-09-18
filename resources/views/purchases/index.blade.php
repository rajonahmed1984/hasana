@extends('layouts.app')
@section('content')
<div id="page-content-wrapper">
    <nav class="navbar navbar-expand-lg navbar-light bg-transparent py-4 px-4">
        <div class="d-flex align-items-center">
            <i class="fas fa-align-left primary-text fs-4 me-3" id="menu-toggle"></i>
            <h2 class="fs-2 m-0">পারচেজ তালিকা</h2>
        </div>
    </nav>

    <div class="container-fluid px-4">
        <div class="card shadow-sm border-0">
            <div class="card-header bg-white d-flex justify-content-between align-items-center">
                <h4 class="mb-0"><i class="fas fa-list-ul me-2 accent-text"></i>সকল পারচেজ</h4>
                <a href="{{ route('purchases.create')}}" class="btn btn-primary btn_modal">
                    <i class="fas fa-plus-circle me-2"></i>নতুন পারচেজ যোগ করুন
                </a>
            </div>
            <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                <div class="search-set">
                    <div class="search-input">
                        <input type="text" id="search" class="form-control" placeholder="search"> 
                    </div>
                </div>
                
            </div>
            
            <div class="card-body" id="data">
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
    
        $('#data').html('');
        $.ajax({
            url: '{{ route("purchases.index")}}?page='+page,
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


<script type="text/javascript">

    var product_url = "{{ route('getPurchaseProduct') }}";

    $('#common_modal').on('shown.bs.modal', function () {
    	const products=[];
    	
	    $(document).find("#purchases_product").autocomplete({
	        selectFirst: true, //here
	        minLength: 2,
	        source: function( request, response ) {
	          $.ajax({
	            url: product_url,
	            type: 'GET',
	            dataType: "json",
	            data: {search: request.term},
	            success: function( data ) {
	                
	                if (data.length ==0) {
	                    toastr.error('Product Not Found');
	                }
	                else if (data.length ==1) {

	                    if(products.indexOf(data[0].id) ==-1){
	                        productEntry(data[0]);
	                        products.push(data[0].id);
	                    }
	                    
	                    $('#purchases_product').val('');


	                    
	                }else if (data.length >1) {
	                    response(data);
	                }
	            }
	          });
	        },
	        select: function (event, ui) {
	           
	           if(products.indexOf(ui.item.id) ==-1){
	                productEntry(ui.item);
	                products.push(ui.item.id);
	            }

	           $('#purchases_product').val('');
	           return false;
	        }
	    });

	});
    function productEntry(item){

        $.ajax({
            url: '{{ route("purchaseProductEntry")}}',
            type: 'GET',
            dataType: "json",
            data: {id:item.id},
            success: function( res ) {
                    
                if (res.html) {
                    $('#purchase_product tbody').append(res.html);
                    calculateSum();
                }
                
            }
        });
    }


    $(document).on('click',".remove",function(e) {
        var whichtr = $(this).closest("tr");
        whichtr.remove();  
        calculateSum();    
    });


    $(document).on('blur',".quantity, .unit_price",function(e) {

        calculateSum();    
    });


    function calculateSum() {


        let sub_total=0;

        let tblrows = $("#purchase_product tbody tr");
        tblrows.each(function (index) {
            let tblrow = $(this);

            let product_qty=Number(tblrow.find('td input.quantity').val());
            let product_amount=Number(tblrow.find('td input.unit_price').val());

            let product_row_total=(product_qty *product_amount);
            tblrow.find('td.row_total').text(product_row_total.toFixed(2));
            sub_total+=product_row_total;
         
            
        });

        $('input.final_amount').val(sub_total.toFixed(2));
    }
  
</script>

@endpush


