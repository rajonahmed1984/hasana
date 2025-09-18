<div class="table-responsive">
	<table class="table ">
		<thead class="table-header-custom">
	        <tr>
	            <th>তারিখ</th>
	            <th>রেফারেন্স নং</th>
	            <th>সাপ্লায়ার</th>
	            <th>স্ট্যাটাস</th>
	            <th>মোট টাকা</th>
	            <th>অ্যাকশন</th>
	        </tr>
	    </thead>
	    
		<tbody>
			@foreach($items as $item)
			<tr>
				<td>{{ dateFormate($item->transaction_date)}}</td>
				<td>{{ $item->invoice_no}}</td>
				<td>{{ $item->contact->name ??''}}</td>
				
				
				<td>{{ $item->shipping_status}}</td>
				<td>{{ $item->final_amount}}</td>
				<td>{{ $item->final_amount}}</td>
				<td>{{ $item->final_amount}}</td>
				<td>{{ $item->payment_status}}</td>
				
				<td class="action-table-data">
					<div class="edit-delete-action">
						<a class="me-2 edit-icon p-2 btn_modal" href="{{ route('purchases.show',[$item->id])}}">
							<i class="fa fa-eye"></i>
						</a>

						<a class="me-2 p-2 btn_modal" href="{{ route('purchases.edit',[$item->id])}}">
							<i class="fa fa-edit"></i>
						</a>
						<a  href="{{ route('purchases.destroy',[$item->id])}}" class="delete">
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
