<div class="table-responsive">
    <table class="table table-hover align-middle">
        <thead class="table-header-custom">
            <tr>
            	<th>পণ্য</th>
            	<th>SKU</th>
            	<th>ক্যাটাগরি</th>
            	<th>স্টক পরিমাণ</th>
            	<th>স্টক ভ্যালু (ক্রয়মূল্যে)</th>
            	<th>স্ট্যাটাস</th>
            </tr>
        </thead>
        <tbody id="stock-report-tbody">

        	@foreach($items as $item)
			<tr>
				
				<td>
					<strong>{{ $item->name}}</strong>
				</td>
				<td>{{ $item->sku}} </td>
				<td>{{ $item->category}} </td>
				<td>{{ $item->stock}}</td>
				<td>{{ $item->stock_price}}</td>
				<td> <span class="badge bg-warning text-dark">Low Stock</span> </td>
			</tr>
			@endforeach

        </tbody>
    </table>
</div>
<p> {{$items->render()}} </p>