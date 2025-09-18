@extends('layouts.app')
@section('content')
<div id="page-content-wrapper">
    <nav class="navbar navbar-expand-lg navbar-light bg-transparent py-4 px-4">
        <div class="d-flex align-items-center">
            <i class="fas fa-align-left primary-text fs-4 me-3" id="menu-toggle"></i>
            <h2 class="fs-2 m-0">পণ্যের তালিকা</h2>
        </div>
    </nav>

    <div class="container-fluid px-4">
        <div class="card shadow-sm border-0">
            <div class="card-header bg-white d-flex justify-content-between align-items-center">
                <h4 class="mb-0"><i class="fas fa-list-ul me-2 accent-text"></i>সকল পণ্য</h4>
                <div>
                    <a class="btn btn-primary btn_modal" href="{{ route('productImport')}}">
                        <i class="fas fa-plus-circle me-2"></i>Import Product
                    </a>

                    <a class="btn btn-primary btn_modal" href="{{ route('products.create')}}">
                        <i class="fas fa-plus-circle me-2"></i>নতুন পণ্য যোগ করুন
                    </a>
                </div>
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
    
    $(document).on('click', 'a.show_update', function(e){
        e.preventDefault();
        var url = $(this).attr('href');
    
        var product = $('input.checkbox:checked').map(function(){
          return $(this).val();
        });
        var product_ids=product.get();
        
        if(product_ids.length ==0){
            toastr.error('Please Select A Product First !');
            return ;
        }
        
        $.ajax({
           type:'GET',
           url:url,
           data:{product_ids},
           success:function(res){
               if(res.status==true){
                toastr.success(res.msg);
                getData();
                
            }else if(res.status==false){
                toastr.error(res.msg);
            }
           }
        });
    
    });

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
            url: '{{ route("products.index")}}?page='+page,
            type: 'GET',
            data:{q,start,end,exstart,exend,type_id},
            dataType: 'html',
            success: function(data) {
                $('#data').html(data);
            }
        });
    }
  });

  $('#common_modal').on('shown.bs.modal', function () {
    	
    	productType();

    	$('.product_type').change(function(){
	        productType();
	    });

    	function productType(){
    		let type=$('.product_type').val();
    		if (type=='single') {
    			$('.variable_section').hide();
    		}else if (type=='variable') {
    			$('.variable_section').show();
    		}

    	}


    	$('#generate').on('click', function () {

    		let variants=[];
    		let new_variants=[];
    		$('.variants').each(function(index) {
			    var text = $(this).text().trim();
			    let values=$('.'+text+':checked').map(function () { return this.value; }).get();
			    if (values.length) {
			    	variants[text]=values;

			    	new_variants.push({
		                [text]: values,
		            });
			    }
			    
			});
    		
    		let jsonData = JSON.stringify(new_variants);

    		$('.variant_values').val(jsonData);

    		
            let variantValues = Object.values(variants);

            // Cartesian product function
            function cartesian(arr) {
                return arr.reduce((a, b) => a.flatMap(d => b.map(e => [].concat(d, e))));
            }

            let combinations = cartesian(variantValues);
            
          

   
            let old_ids=[];
            let new_ids=[];

            $('#variationTable tbody tr').each(function() {
			    var rowText = $(this).attr('class');
			    old_ids.push(rowText);
			});

            combinations.forEach(function (combo, index) {
                let variationName = combo.join('-');
                new_ids.push(variationName);
            });

            let notInNew = old_ids.filter(item => !new_ids.includes(item));

            $.each(notInNew, function(index, value) {
			    $(`tr.${value}`).remove();
			});

            combinations.forEach(function (combo, index) {
                let variationName = combo.join('-');
                let sku = combo.map(val => val.substring(0, 10).toLowerCase()).join('-');
                let main_sku=$('.main_sku').val();

                sku = `${main_sku}-${sku}-${index+1}`;
                let pprice=0;
                let sprice=0;
                let existtr = $(`tr.${variationName}`);
                if (existtr.length > 0) {
                	pprice=existtr.find('td.pprice input').val();
                	sprice=existtr.find('td.sprice input').val();
                	existtr.remove();
                }

                let row = `
                    <tr class="${variationName}">
                        <td>
                            ${variationName}
                            <input type="hidden" name="variations[${index}][name]" value="${variationName}">
                        </td>
                        <td>
                            <input type="text" class="form-control" name="variations[${index}][sub_sku]" value="${sku}">
                        </td>
                        <td class="pprice">
                            <input type="number" class="form-control" name="variations[${index}][purchase_price]" value="${pprice}" step="any">
                        </td>
                        <td class="sprice">
                            <input type="number" class="form-control" name="variations[${index}][sell_price]" value="${sprice}" step="any">
                        </td>
                    </tr>
                `;
                $('#variationTable tbody').append(row);
            });
        });
    	
	});


  	

</script>
@endpush


