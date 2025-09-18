<div class="table-responsive">
	<table class="table ">
		<thead class="table-header-custom">
            <tr>
                <th>ইনভয়েস নং</th>
                <th>গ্রাহক</th>
                <th>তারিখ</th>
                <th>মোট টাকা</th>
                <td>Paid</td>
                <td>Due</td>
                <th>স্ট্যাটাস</th>
                <th> Craeted By</th>

                <th>অ্যাকশন</th>
            </tr>
        </thead>
        
		<tbody>
			@foreach($items as $item)
			<tr>
				<td>{{ $item->invoice_no}}</td>
				<td>{{ $item->contact->name ??''}}
					<br>{{ $item->contact->mobile ??''}}
				</td>
				
				<td>{{ dateFormate($item->transaction_date)}}</td>
				
				<td>{{ $item->final_amount}}</td>
				<td>{{ $item->final_amount}}</td>
				<td>{{ $item->final_amount}}</td>
				<td>{{ $item->shipping_status}}</td>
				<td>{{ $item->user->name??''}}</td>
				
				
				<td class="action-table-data">
					<div class="edit-delete-action">

						<a class="me-2 edit-icon  p-2 btn_modal" href="{{ route('sells.show',[$item->id])}}">
							<i class="fa fa-eye"></i>
						</a>

						<a class="me-2 edit-icon  p-2 btn_print" href="{{ route('sellPrint',[$item->id])}}">
							<i class="fa fa-print"></i>
						</a>

						

						<a class="me-2 p-2" href="{{ route('pos.edit',[$item->id])}}">
							<i class="fa fa-edit"></i>
						</a>
						<a  href="{{ route('pos.destroy',[$item->id])}}" class="delete">
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
