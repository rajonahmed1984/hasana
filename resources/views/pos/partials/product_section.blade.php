@foreach($items as $item)
<div class="product-card">
    <div class="product-card-body" data-id="{{$item->variation_id}}">
    	<a href="javascript:void(0);" class="product-image" onclick="productEntry({{$item->variation_id}})">
	        <img src="{{ getImage('products',$item->image)}}" alt="{{ $item->name}}">
	        <div class="product-info">
	            <p class="product-name">{{ $item->name}}</p>
	            <p class="product-price">৳ {{ $item->sell_price}}</p>
	        </div>
    	</a>
    </div>
    <button class="btn btn-sm btn-outline-secondary stock-check-btn" data-id="{{$item->id}}"><i class="fas fa-search-location me-1"></i>স্টক চেক</button>
</div>
@endforeach
