@extends('layouts.app')
@section('content')

<div id="page-content-wrapper">
    <nav class="navbar navbar-expand-lg navbar-light bg-transparent py-4 px-4">
        <div class="d-flex align-items-center">
            <i class="fas fa-align-left primary-text fs-4 me-3" id="menu-toggle"></i>
            <h2 class="fs-2 m-0">ক্যাটাগরি তালিকা</h2>
        </div>
    </nav>

    <div class="container-fluid px-4">
        <div class="card shadow-sm border-0">
            <div class="card-header bg-white d-flex justify-content-between align-items-center">
                <h4 class="mb-0"><i class="fas fa-list-ul me-2 accent-text"></i>সকল ক্যাটাগরি</h4>
                <div>
                    <a class="btn btn-primary btn_modal" href="{{ route('categories.create')}}">
                        <i class="fas fa-plus-circle me-2"></i>নতুন ক্যাটাগরি যোগ করুন
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
            toastr.error('Please Select A Category First !');
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
            url: '{{ route("categories.index")}}?page='+page,
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