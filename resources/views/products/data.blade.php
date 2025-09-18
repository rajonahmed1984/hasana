<div class="table-responsive">
	<table class="table ">
		<thead class="thead-light">
			<tr>
				<th>পণ্য</th>
                <th>SKU</th>
                <th>ক্যাটাগরি</th>
                <th>ব্র্যান্ড</th>
                <th>স্টক</th>
                <th>মূল্য</th>
                <th>মূল্য</th>
                <th>স্ট্যাটাস</th>
                <th>অ্যাকশন</th>
			</tr>
		</thead>
		<tbody>
			@foreach($items as $item)
			<tr>
				<td>
					<div class="d-flex align-items-center">
						<a href="javascript:void(0);" class="avatar avatar-md bg-light-900 p-1 me-2">
							<img width="80" class="object-fit-contain" width="80" src="{{ getImage('products',$item->image)}}" alt="img">
						</a>
						<a href="javascript:void(0);">{{ $item->name}}</a>
					</div>
				</td>
				<td>{{ $item->sku}}</td>
				<td>{{ $item->category_name}}</td>
				<td>{{ $item->brand_name}}</td>
				<td>{{ $item->total_stock}}</td>
				<td>{{ $item->purchase_price}}</td>
				<td>{{ $item->sell_price}}</td>
				
				<td><span class="badge table-badge bg-success fw-medium fs-10">Active</span></td>
				<td class="action-table-data">
					<div class="edit-delete-action">
						<a class="me-2 edit-icon p-2 btn_modal" href="{{ route('products.show',[$item->id])}}">
							<i class="fa fa-eye"></i>
						</a>

						<a class="me-2 p-2 btn_modal" href="{{ route('products.edit',[$item->id])}}">
							<i class="fa fa-edit"></i>
						</a>
						<a  href="{{ route('products.destroy',[$item->id])}}" class="delete">
							<i class="fa fa-trash"></i>
						</a>
					</div>
					
				</td>
			</tr>

			@endforeach
		</tbody>
	</table>
</div>
<p> {{$items->render()}} </p>
