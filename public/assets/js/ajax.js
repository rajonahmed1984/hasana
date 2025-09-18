$(document).ready(function(){

	$(document).find('.amount').each(function() {
    let price=$(this).text();
    price=Number(price).toLocaleString('en');
    $(this).text(price);

});


$(document).on('click','.btn_modal', function(e){
    e.preventDefault();
    var url = $(this).attr('href');
    $.ajax({
       type:'GET',
       url:url,
       data:{},
       success:function(res){
          $('div#common_modal').html(res).modal('show');

        

       }
    });
});


$(document).on('click','.btn_print', function(e){
    e.preventDefault();
    var url = $(this).attr('href');
    $.ajax({
       type:'GET',
       url:url,
       data:{},
       success:function(res){
          $('div#print-receipt').html(res);
            var printContents = $('#print-receipt').html();
            var printWindow = window.open('', '', 'height=600,width=800');
            printWindow.document.write('<html><head><title>Print Modal</title>');
            printWindow.document.write(`<link rel="stylesheet" href='{{ asset("assets/css/style.css")}}'>`); // optional
            printWindow.document.write('</head><body>');
            printWindow.document.write(printContents);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
            printWindow.close();
            
       }
    });
});




$(document).on('submit','form#ajax_form', function(e) {
    e.preventDefault(); 
    $('span.textdanger').text('');
    var url=$(this).attr('action');
    var method=$(this).attr('method');
    var formData = new FormData($(this)[0]);
    
    let button=$(this).find('[type="submit"]');
    button.attr("disabled", "disabled");
    $.ajax({
        type: method,
        url: url,
        data: formData,
        async: false,
        processData: false,
        contentType: false,
        success: function(res) {
            
            if(res.status==true){

                swal(res.msg);
                $('div#common_modal').modal('hide');
                if(res.function){
                    jQuery("input#search").change();
                }else if(res.url){
                    setTimeout(function() { 
                        document.location.href = res.url;
                    }, 2000);
                    
                }else{
                    setTimeout(function() { 
                        window.location.reload();
                    }, 2000);
                    
                }
            }else if(res.status==false){
                swal(res.msg);
            }
            
        },
        error:function (response){
            button.removeAttr("disabled");
            $.each(response.responseJSON.errors,function(field_name,error){
                $(document).find('[name='+field_name+']').after('<span style="color:red">' +error+ '</span>')
              
            })
        }
    });
});


// ajax request for delete data
$(document).on('click','a.delete', function(e) {
    var form=$(this);
    e.preventDefault(); 
    swal({
      title: "Are you sure?",
      text: "You want To Delete!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#006400",
      confirmButtonText: "Yes, do it!",
      cancelButtonText: "No, cancel plz!",
      closeOnConfirm: false,
      closeOnCancel: false
    },
    function(isConfirm){
      if (isConfirm) {

        var url=$(form).attr('href');

        $.ajax({
            type: 'DELETE',
            url: url,
            headers: {
		        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		    },
            success: function(res) {
                
                if(res.status==true){
                    swal(res.msg);
                    // if(res.url){
                    //     document.location.href = res.url;
                    // }else{
                    //     window.location.reload();
                    // }
                    jQuery("input#search").change();
                }else if(res.status==false){
                    swal(res.msg);
                }
                
            },
            error:function (response){
                
            }
        });
      } else {
        swal("Cancelled", "Your imaginary file is safe :)", "error");
      }
    });
});

});