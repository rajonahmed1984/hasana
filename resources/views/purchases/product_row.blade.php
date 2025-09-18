<tr>
    <td>{{$item->product->name}}
        <br>{{$item->product->sku}}
    </td>
    <td><input class="form-control" name="batch_no[]" type="text"/></td>
    <td><input class="form-control" name="expire_date[]" type="date"/></td>

    <td>
        <input class="form-control quantity" name="quantity[]" type="number" value="1" required min="1"/>
        <input type="hidden" class="form-control" name="product_id[]" type="number" value="{{$item->product_id}}" required/>
        <input type="hidden" class="form-control" name="variation_id[]" type="number" value="{{$item->id}}" required/>
    </td>
    <td><input class="form-control unit_price" name="unit_price[]" type="number" value="{{$item->purchase_price}}" required/></td>
    <td class="row_total">{{$item->purchase_price}}</td>
    <td><a class="remove btn btn-sm btn-danger"> <i class="fa fa-trash"></i> </a></td>
</tr>
