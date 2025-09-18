<div class="modal-dialog modal-dialog-centered">
	<div class="modal-content">
		<div class="modal-body">
			<div class="icon-head text-center">
				<a href="javascript:void(0);">
					<img src="{{ getImage('settings',getInfo('logo'))}}" width="100" height="30" alt="Receipt Logo">
				</a>
			</div>
			<div class="text-center info text-center">
				<h6>{{getInfo('title')}}</h6>
				<p class="mb-0">Phone Number: {{getInfo('phone')}}</p>
				<p class="mb-0">Email: <a href="https://dreamspos.dreamstechnologies.com/cdn-cgi/l/email-protection#6f0a170e021f030a2f08020e0603410c0002"><span class="__cf_email__" data-cfemail="204558414d504c4560474d41494c0e434f4d">{{getInfo('email')}}</span></a></p>
			</div>
			<div class="tax-invoice">
				<h6 class="text-center">Tax Invoice</h6>
				<div class="row">
					<div class="col-sm-12 col-md-6">
						<div class="invoice-user-name"><span>Name: </span> {{ $transaction->contact->name}}</div>
						<div class="invoice-user-name"><span>Invoice No: </span>{{ $transaction->invoice_no}}</div>
					</div>
					<div class="col-sm-12 col-md-6">
						<div class="invoice-user-name"><span>Customer Mobile:</span>{{ $transaction->contact->mobile}}</div>
						<div class="invoice-user-name"><span>Date: </span>{{ $transaction->transaction_date}}</div>
					</div>
				</div>
			</div>
			<table class="table-borderless w-100 table-fit">
				<thead>
					<tr>
						<th># Item</th>
						<th>Qty</th>
						<th>Price</th>
						
						<th class="text-end">Total</th>
					</tr>
				</thead>
				<tbody>

					@foreach($transaction->lines as $line)
					<tr>
						<td>{{ $line->product->name}} 
							{{ $line->product->type=='variable' ? $line->variation->name:''}}</td>
						<td>{{ $line->quantity}}</td>
						<td>{{ $line->price}}</td>
						<td class="text-end">{{ $line->price *$line->quantity}}</td>
					</tr>
					@endforeach

					@php
						$due=$transaction->final_amount - $transaction->payments->sum('amount');
					@endphp
					<tr>
						<td colspan="4">
							<table class="table-borderless w-100 table-fit">
								<tr>
									<td class="fw-bold">Sub Total :</td>
									<td class="text-end">{{ priceFormate($transaction->final_amount)}}</td>
								</tr>
								@if($transaction->discount_amount)
								<tr>
									<td class="fw-bold">Discount :</td>
									<td class="text-end">{{ priceFormate($transaction->discount_amount)}}</td>
								</tr>
								@endif
								@if($transaction->shipping_charge)
								<tr>
									<td class="fw-bold">Shipping :</td>
									<td class="text-end">{{ priceFormate($transaction->shipping_charge)}}</td>
								</tr>
								@endif
								<tr>
									<td class="fw-bold">Total Bill :</td>
									<td class="text-end">{{ priceFormate($transaction->final_amount)}}</td>
								</tr>
								<tr>
									<td class="fw-bold">Paid :</td>
									<td class="text-end">{{ priceFormate($transaction->payments->sum('amount'))}}</td>
								</tr>
								@if($due)
								<tr>
									<td class="fw-bold">Due :</td>
									<td class="text-end">{{ priceFormate($due)}}</td>
								</tr>
								@endif
								
							</table>
						</td>
					</tr>
				</tbody>
			</table>
			<div class="text-center invoice-bar">
				<div class="border-bottom border-dashed">
					<!-- <p>**VAT against this challan is payable through central registration. Thank you for your business!</p> -->
				</div>
				<a href="javascript:void(0);">
					<!-- <img src="{{ asset('assets/img/barcode/barcode-03.jpg')}}" alt="Barcode"> -->
				</a>
				<p>Thank You For Shopping With Us. Please Come Again</p>
				
			</div>
		</div>
	</div>
</div>