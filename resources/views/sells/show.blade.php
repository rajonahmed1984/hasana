<div class="modal-dialog modal-xl">
	<div class="modal-content">		
		<div class="modal-header">
	      <h1 class="modal-title">Online Sell Details </h1>
	      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
	    </div>

		<div class="card border-0">
			<div class="card-body pb-0">
				<div class="invoice-box table-height" style="max-width: 1600px;width:100%;padding: 0;font-size: 14px;line-height: 24px;color: #555;">
					<div class="row">
						<div class="col-md-4">
							<p class="mb-0">Invoice No :<span> {{ $transaction->invoice_no}} </span></p>
							<p class="mb-0">Transaction Date :<span> {{ $transaction->transaction_date}} </span></p>
							<p class="mb-0">Shipping Status :<span> {{ $transaction->shipping_status}}</span></p>
						</div>

						@if($transaction->contact)
						<div class="col-md-4">
							<h4 class="mb-1"> Customer </h4>
							<p class="mb-1"> {{ $transaction->contact->name}} </p>
							<p class="mb-1"> {{ $transaction->contact->mobile}} </p>
							<p class="mb-1"> {{ $transaction->contact->address}} </p>
						</div>
						@endif
						<div class="col-md-4">
							<p class="mb-0">Location :<span> {{ $transaction->location->name}} </span></p>
						</div>
						
					</div>
					<h5 class="order-text"> Product Details </h5>
					<div class="table-responsive no-pagination mb-3">
						<table class="table table-bordered table-stripped table-hovered">
							<thead>
	                            <tr>
	                                <th>পণ্য</th>
	                                <th class="text-center">পরিমাণ</th>
	                                <th class="text-center">দাম</th>
	                                <th class="text-end">সাব-টোটাল</th>
	                            </tr>
	                        </thead>
	                        <tbody>
	                            @foreach($transaction->lines as $line)

	                            <tr>
	                                <td>{{ $line->product->name}} 
	                                        {{ $line->product->type=='variable' ? $line->variation->name:''}}</td>
	                         
	                                <td class="text-center">{{ $line->quantity}}</td>
	                                <td class="text-center">{{ $line->price}}</td>
	                                <td class="text-end">{{ $line->price *$line->quantity}}</td>
	                            </tr>
	                            @endforeach
	                        </tbody>
						</table>
					</div>

					<div class="row">
						<div class="col-md-8">
							<div class="table-responsive no-pagination mb-3">
								<table class="table table-bordered table-stripped table-hovered">
									<thead>
										<tr class="bg-green">
											<th>Date</th>
											<th>Amount</th>
											<th>Method </th>
											<th>Note</th>
											<th>Account</th>
											<th>User</th>
											
										</tr>
									</thead>
									<tbody>
										@foreach($transaction->payments as $payment)
										<tr>
											<td>{{ $payment->paid_on}} </td>
											<td>{{ $payment->amount}}</td>
											<td>{{ $payment->method}}</td>
											<td>{{ $payment->note}}</td>
											<td>{{ $payment->note}}</td>
											<td>{{ $payment->user->name}}</td>
										</tr>
										@endforeach
										
									</tbody>
								</table>
							</div>
						</div>

						<div class="col-md-4">
							<div class="table-responsive no-pagination mb-3">
								<table class="table table-bordered table-stripped table-hovered">
									<tbody>
										<tr>
											<th>SubTotal</th>
											<td> {{ $transaction->final_amount}}</td>
										</tr>
										<tr>
											<th>Discount</th>
											<td>{{ $transaction->discount_amount}}</td>
										</tr>
										<tr>
											<th>Shipping Charge</th>
											<td>{{ $transaction->shipping_charge}}</td>
										</tr>
										<tr>
											<th>Final Amount</th>
											<td>{{ $transaction->final_amount}}</td>
										</tr>
										<tr>
											<th>Paid</th>
											<td>{{ $transaction->payments->sum('amount')}}</td>
										</tr>
										<tr>
											<th>Due</th>
											<td>{{ $transaction->final_amount - $transaction->payments->sum('amount')}}</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>

					</div>
				</div>

			</div>
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">Cancel</button>
			<button type="submit" class="btn btn-primary">Submit</button>
		</div>
	</div>
</div>