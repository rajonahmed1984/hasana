<div class="table-responsive">
	<table class="table ">
		<thead class="thead-light">
			<tr>
				<th class="no-sort">
					<label class="checkboxs">
						<input type="checkbox" id="select-all">
						<span class="checkmarks"></span>
					</label>
				</th>
				<th>Customer</th>
				<th>Reference</th>
				<th>Date</th>
				<th>Status</th>
				<th>Grand Total</th>
				<th>Paid</th>
				<th>Due</th>
				<th>Payment Status</th>
				<th>Biller</th>
				<th></th>
										
			</tr>
		</thead>
		<tbody>
			@foreach($items as $item)
			<tr>
				<td>
					<label class="checkboxs">
						<input type="checkbox">
						<span class="checkmarks"></span>
					</label>
				</td>

				<td>{{ $item->contact->name ??''}}</td>
				<td>{{ $item->invoice_no}}</td>
				<td>{{ dateFormate($item->transaction_date)}}</td>
				<td>{{ $item->status}}</td>
				<td>{{ $item->final_amount}}</td>
				<td>{{ $item->final_amount}}</td>
				<td>{{ $item->final_amount}}</td>
				<td>{{ $item->payment_status}}</td>
				<td>{{ $item->user->name??''}}</td>
				
				<td class="action-table-data">
					<div class="edit-delete-action">
						<a class="me-2 edit-icon  p-2 btn_modal" href="{{ route('pos.show',[$item->id])}}">
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
