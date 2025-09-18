<tr>
    <td>{{$line->product->name}}
        <br>{{$line->product->sku}}
    </td>

    <td><input class="form-control" name="batch_no[]" type="text" value="{{$line->batch_no}}"/></td>
    <td><input class="form-control" name="expire_date[]" type="date" value="{{$line->expire_date}}"/></td>

    <td>
        <input class="form-control quantity" name="quantity[]" type="number" value="{{$line->quantity}}" required min="1"/>
        <input type="hidden" class="form-control" name="line_id[]" type="number" value="{{$line->id}}" required/>
        <input type="hidden" class="form-control" name="product_id[]" type="number" value="{{$line->product_id}}" required/>
        <input type="hidden" class="form-control" name="variation_id[]" type="number" value="{{$line->variation_id}}" required/>
    </td>
    <td><input class="form-control unit_price" name="unit_price[]" type="number" value="{{$line->unit_price}}" required/></td>
    <td class="row_total">{{$line->quantity  * $line->unit_price}}</td>
    <td><a class="remove btn btn-sm btn-danger"> <i class="fa fa-trash"></i> </a></td>
</tr>