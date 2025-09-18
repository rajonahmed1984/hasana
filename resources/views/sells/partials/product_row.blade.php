<tr class="cart-item-row">
    
    <td class="text-center tr_row_count">0</td>
    <td class="">{{ $item->sub_sku}}</td>
    <td>
      	{{ $item->product_name}}
    	<div class='mt-1 small text-muted'>
      		<span class="badge bg-success ms-1">FREE of </span>
  		</div>
    </td>
    <td class="text-center">
    	<button type="button"

    	data-bs-toggle="modal" data-bs-target="#stockModal"
    	class="btn btn-sm btn-outline-info stock" data-code="{{ $item->id}}">
    	<i class="fas fa-search-location"></i> Stock</button>
    </td>
    <td class="text-end">
    	<input type="number" class="form-control form-control-sm text-end price unit_price"
    	name="unit_price[]"
    	value="{{ $item->sell_price}}">

    	<input type="hidden" name="product_id[]" value="{{ $item->product_id}}">
		<input type="hidden" name="variation_id[]" value="{{ $item->id}}">

    </td>
    <td class="text-end">
      <div class="input-group input-group-sm qty-ctrl qty-item">
        <button type="button" class="btn btn-outline-secondary decrease" data-type="minus">−</button>

        @if(isset($exist))
		<input type="hidden" name="line_id[]" value="{{ $item->line_id}}">
		<input type="text" class="form-control text-center px-1 quantity" name="quantity[]" readonly value="{{ $item->ordered_qty}}" max="{{ $item->stock}}">

		@else
		<input type="text" class="form-control text-center quantity" name="quantity[]" readonly value="1" max="{{ $item->stock}}">
		@endif

        <button type="button" class="btn btn-outline-secondary increase" data-type="plus">+</button>
      </div>
    </td>
    <td class="text-end mono row_total">0</td>
    <td class="text-center">
    	<button type="button" class="btn btn-sm btn-link text-danger del btn-remove" data-i="">
    		<i class="fa-regular fa-circle-xmark"></i>
    	</button>
    </td>


</tr>