<tr class="cart-item-row">
    <td>
    	<p class="mb-0 fw-bold small">{{ $item->product_name}}</p>
    	<small class="text-muted">{{ $item->sub_sku}}</small>
    </td>
    <td>
    	

    	<div class="input-group input-group-sm quantity-selector qty-item">
    		<button class="btn btn-outline-secondary decrease" type="button" data-type="minus">-</button>
    		
    		@if(isset($exist))
			<input type="hidden" name="line_id[]" value="{{ $item->line_id}}">
			<input type="text" class="form-control text-center px-1 quantity" name="quantity[]" readonly value="{{ $item->ordered_qty}}" max="{{ $item->stock}}">

			@else
			<input type="text" class="form-control text-center px-1 quantity" name="quantity[]" readonly value="1" max="{{ $item->stock}}">
			@endif

    		<button class="btn btn-outline-secondary increase" type="button" data-type="plus">+</button>
    	</div>
    </td>
    <td>
    	<input type="hidden" name="product_id[]" value="{{ $item->product_id}}">
		<input type="hidden" name="variation_id[]" value="{{ $item->id}}">

		<input type="text" class="form-control text-center unit_price" name="unit_price[]" value="{{ $item->sell_price}}">
	</td>

	<td class="row_total">0</td>

    <td>
    	<a href="#" class="text-danger btn-remove">
    		<i class="fas fa-times-circle"></i>
    	</a>
    </td>

</tr>