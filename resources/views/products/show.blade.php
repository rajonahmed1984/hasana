<div class="modal-dialog modal-xl">
	<div class="modal-content">		
		<div class="modal-header">
	      <h1 class="modal-title">Product Detail </h1>
	      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
	    </div>

		<div class="card border-0">
			<div class="card-body pb-0">
				<div class="invoice-box table-height" style="max-width: 1600px;width:100%;padding: 0;font-size: 14px;line-height: 24px;color: #555;">
					<div class="row sales-details-items d-flex">
						<div class="col-md-4 details-item">
							<h4 class="mb-1"> {{ $product->name}} </h4>
							<p class="mb-0"> {{ $product->sku}} </p>
							<p class="mb-0"> {{ $product->type}} </p>
							<p class="mb-0">Phone<span> {{ $product->stock_alert}}</span></p>
						</div>

						<div class="col-md-4 details-item">
							<h4 class="mb-1"> {{ $product->category->name??''}} </h4>
							<h4 class="mb-1"> {{ $product->subcategory->name??''}} </h4>
							<h4 class="mb-1"> {{ $product->brand->name??''}} </h4>
							<h4 class="mb-1"> {{ $product->unit->name??''}} </h4>
						</div>

						<div class="col-md-4 details-item">
							<img class="object-fit-contain" src="{{ getImage('products',$product->image)}}" alt="img">
						</div>

						
					</div>
					<h5 class="order-text"> Product Variation </h5>
					<div class="table-responsive no-pagination mb-3">
						<table class="table  datanew">
							<thead>
								<tr>
									<th>Name</th>
									<th>Sku</th>
									<th>Purchase Price</th>
									<th>Sell Price</th>
									
								</tr>
							</thead>
							<tbody>
								@foreach($product->variations as $variation)
								<tr>
									<td>{{ $variation->name}}</td>
									<td>{{ $variation->sub_sku}}</td>
									<td>{{ $variation->purchase_price}}</td>
									<td>{{ $variation->sell_price}}</td>
								</tr>
								@endforeach
								
							</tbody>
						</table>
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