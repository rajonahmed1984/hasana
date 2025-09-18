<script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.14.1/jquery-ui.min.js"></script>
<script type="text/javascript">

    let reward_min_amount='{{ $reward_settings ? $reward_settings->min_order_total_for_redeem:0}}'
    let redeem_per_unit='{{ $reward_settings ? $reward_settings->redeem_amount_per_unit_rp:0}}'
    var url = "{{ route('getSellProduct') }}";
    $(document).ready(function(){

        const products=[];
        
        $(document).find("#sell_product_search").autocomplete({
            selectFirst: true, //here
            minLength: 2,
            source: function( request, response ) {
              $.ajax({
                url: url,
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
                        
                        $('#sell_product_search').val('');


                        
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

               $('#sell_product_search').val('');
               return false;
            }
        });

        let ids=[];
            function productEntry(variation_id){
                if (ids.includes(variation_id)) {
                    return false;
                }

                let location_id=$("#location_id").val();
                $.ajax({
                    url: '{{ route("sellProductEntry")}}',
                    type: 'GET',
                    dataType: "json",
                    data: {variation_id,location_id},
                    success: function( res ) {
                            
                        if (res.html) {
                            ids.push(variation_id);
                            $('#itemsTable tbody').append(res.html);
                            calculateSum();
                        }else{
                            swal(res.msg);
                        }
                        
                    }
                });
            }

    });



    $(document).on('click',".remove",function(e) {
        var whichtr = $(this).closest("tr");
        whichtr.remove();  
        calculateSum();    
    });

    $(document).on('click',".decrease, .increase",function(e) {
                let inputqty=$(this).closest('div.qty-item').find('input.quantity');
        let qty=Number(inputqty.val());

        let max_qty=Number(inputqty.attr('max'));

        let type=$(this).data('type');
        console.log(type);
        if (type=='plus') {
            if (max_qty <qty+1) {
                swal('Stock Is Over');
            }
            if (max_qty >qty) {
                inputqty.val(qty+1);
            }
        }else if (type=='minus') {

            if (qty >1) {

                inputqty.val(qty-1);
            }
        }
        calculateSum();    
    });


    $(document).on('blur',".unit_price",function(e) {

        calculateSum();    
    });

    $(document).on('click',".savediscount ,.saveCharge",function(e) {

        calculateSum();    
    });

    $(document).ready(function(){

        calculateSum();
    });


    function calculateSum() {


        let sub_total=0;

        let tblrows = $("#itemRows tr");
        tblrows.each(function (index) {
            let tblrow = $(this);

            let product_qty=Number(tblrow.find('td input.quantity').val());
            let product_amount=Number(tblrow.find('td input.unit_price').val());

            let product_row_total=(product_qty *product_amount);
            tblrow.find('td.row_total').text(product_row_total.toFixed(2));
            tblrow.find('td.tr_row_count').text(index+1);
            sub_total+=product_row_total;  
            
        });
        $('#mrpTotal').text(sub_total.toFixed(2));

        let charge=Number($('input.service_charge').val() || 0);
        let discount=Number($('input.discount_amount').val() || 0);
        
        sub_total=(sub_total+charge - discount);
        $('td.charge').text(charge.toFixed(2));
        $('td.discount').text(discount.toFixed(2));

        $('input.final_amount').val(sub_total.toFixed(2));
        $('input.pay_amount').val(sub_total.toFixed(2));
        $('input.pay_amount').val(sub_total.toFixed(2));
        $('#grand').text(sub_total.toFixed(2));
        $('#itemCount').text(tblrows.length);
    }

    $(document).on('change', 'select[name="contact_id"]',function(e) {
        getCustomer();    
    });


    function getCustomer(){

        

    }


    $(document).on('click','.payment-item', function(e) {
        if($("#cart-body tr").length ==0){
            swal('Product Select first');
            return false;
        }

        $('#paymentModal').modal('show');
        
    });

    $(document).on('submit','#pos_form', function(e) {

        e.preventDefault();
        $('span.textdanger').text('');
        var url=$(this).attr('action');
        var method=$(this).attr('method');
        
        let button=$(this);
        button.attr("disabled", "disabled");
        $.ajax({
            type: method,
            url: url,
            data: $(this).serialize(),
            success: function(res) {
                
                if(res.status==true){
                    ids=[];
                    $("#cart-body").html('');
                    calculateSum();
                    $('#pos_form')[0].reset();
                    $('div#paymentModal').modal('hide');
                    toastr.success(res.msg);

                    if(res.html){
                        $('div#printReceiptModal').html(res.html).modal('show');
                    }

                    if(res.url){
                        setTimeout(function() {
                            window.location.href = res.url;
                        }, 3000);
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

    $(document).on('click', '.payment-option', function(){
        $('.payment-option').removeClass('active');
        $(this).addClass('active');
        let method=$(this).data('target');
        if(method=='due'){
            $(document).find('.pay_amount').val(0);
        }
        $('.method').val(method);
    });

    $(document).on('click','#print-btn', function(e){

        var printContents = $('#printReceiptModal').html();
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

    });


    


    
    var customer_url = "{{ route('customer.search') }}";
    $("#cus_name, #cus_mobile" ).autocomplete({
        selectFirst: true, //here
        minLength: 2,
        source: function( request, response ) {
          $.ajax({
            url: customer_url,
            type: 'GET',
            dataType: "json",
            data: {search: request.term},
            success: function( data ) {
                
                if (data.length ==0) {
                    toastr.error('Product Not Found');
                }
                else if (data.length ==1) {
                    customerEntry(data[0].id);
                    
                    $('#product_search').val('');


                    
                }else if (data.length >1) {
                    response(data);
                }
            }
          });
        },
        select: function (event, ui) {
           
            customerEntry(ui.item.id);
            
           $('#product_search').val('');
           return false;
        }
    });


    function customerEntry(customer_id){
    
        $.ajax({
            url: '{{ route("customer.entry")}}',
            type: 'GET',
            dataType: "json",
            data: {customer_id},
            success: function(res) {
                $('#cus_name').val(res.name);
                $('#cus_mobile').val(res.mobile);
                $('#cus_point').val(res.reward_point);
                
            }
        });
    }


    


    $(document).on('blur','.reddem_point', function(){

        let redeem_point=Number($(this).val());
        let customer_point=Number($('#cus_point').val());
        let subtotal=Number($('#subtotal').text());
        let discount_amount=Number($('.discount_amount').val());
        if(redeem_point > customer_point){
            toastr.error('Redeem Point Is Over ');
            $(this).val(0);
            return false;
        }
        if(reward_min_amount > subtotal){
            toastr.error('Total Amount Must Be min '+ reward_min_amount);
            $(this).val(0);
            return false;
        }
        
        let redeem_dis=Number(redeem_point*redeem_per_unit);
        discount_amount =redeem_dis;
        $('.discount_amount').val(discount_amount);
        calculateSum();

    });

</script>