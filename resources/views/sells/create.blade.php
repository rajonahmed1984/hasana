@extends('sells.partials.app')
@section('sell_content')

<div class="ctrlbar">
    <div class="row g-2">
      <div class="col-2">
        <div class="label">Item Code/Barcode</div> 
        <div class="input-group input-group-sm">
          <span class="input-group-text"><i class="fa fa-barcode"></i></span>
          <input class="form-control" id="sell_product_search" placeholder="Scan or type code and hit Enter">
        </div>
      </div>
      <div class="col-2">
        <div class="label">Customer</div>
        <input class="form-control form-control-sm" id="cus_name" placeholder="Name">
      </div> 
      <div class="col-2">
        <div class="label">Mobile #</div>
        <input class="form-control form-control-sm" id="cus_mobile" placeholder="017xxxxxxxx">
      </div>
      <div class="col-2">
        <div class="label">Points</div>
        <input type="number" class="form-control form-control-sm" id="cus_point" value="0">
      </div>
      <div class="col-2">
        <div class="label">Amount</div>
        <input type="number" class="form-control form-control-sm" value="0">
      </div>
      <div class="col-2">
        <div class="label">No. of items :</div>
        <div class="count-box">
          <i class="fa-solid fa-layer-group"></i>
          <div><span id="itemCount" class="ms-1">0</span></div>
        </div>
      </div>
    </div>
  </div>

<div class="main">
  <!-- LEFT: ITEMS GRID -->
  <div class="panel">
  	<form action="{{ route('pos.update',[$transaction->id])}}" method="post" id="pos_form">
        @method('PATCH')
        @csrf

        <div class="form-group d-none">
            <select name="location_id" id="location_id" class="form-control">
                @foreach($locations as $location)
                <option value="{{ $location->id}}"
                    {{$transaction->location_id==$location->id ? 'selected':'disable'}}>
                    {{ $location->name}}
                </option>
                @endforeach
            </select>
        </div>

    <div class="head"><strong>Items</strong>
    	<span class="text-muted small">F2: focus barcode • +/-: adjust qty</span>
    </div>
    <div class="body items-wrap">
      <div class="table-responsive" style="max-height:100%">
        <table class="table table-sm table-bordered items-table align-middle" id="itemsTable">
          <thead>
            <tr>
              <th style="width:44px">#</th>
              <th style="width:120px">Code</th>
              <th>Description</th>
              <th style="width:110px" class="text-center">Stock</th>
              <th style="width:120px" class="text-end">Unit Price</th>
              <th style="width:140px" class="text-end">Quantity</th>
              <th style="width:120px" class="text-end">Line Total</th>
              <th style="width:42px"></th>
            </tr>
          </thead>
          <tbody id="itemRows">
            
          </tbody>

        </table>
      </div>
    </div>
    <!-- Tender table under items -->
    <div class="cardish">
      <div class="tender-head">
        <strong>Tender Details</strong>
        <div class="btn-group btn-group-sm">
          <button id="addTender" class="btn btn-outline-secondary"><i class="fa fa-plus"></i> Add</button>
        </div>
      </div>
      <div class="table-responsive">
        <table class="table table-bordered table-sm tender-table" id="tenderTable">
          <thead><tr><th style="width:38%">Tender</th><th style="width:28%" class="text-end">Amount</th><th>Ref No</th><th style="width:36px"></th></tr></thead>
          <tbody id="tenderBody"></tbody>
          <tfoot>
            <tr>
              <th class="text-end">Tender Total</th>
              <th class="text-end"><span id="tenderTotal">0.00</span></th>
              <th colspan="2"></th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>

  <!-- RIGHT: SUMMARY + PAYMENT -->
  <div class="panel">
    <div class="head">
      <strong>Checkout</strong>
      <div class="mt-1">
        <span id="statusChip" class="status-chip status-warn"><i class="fa-regular fa-circle-question"></i> Waiting for payment…</span>
      </div>
    </div>
    <div class="body" style="display:grid;grid-auto-rows:min-content;gap:10px; height: 100%; align-content: space-between;">
      <div class="cardish sumbox">
        <div class="rowline"><span>MRP Total</span><strong id="mrpTotal">0.00</strong></div>
        <div class="rowline"><span>(+) SD</span><strong id="sd">0.00</strong></div>
        <div class="rowline"><span>(-) Discount</span>
          <input id="disc" name="discount_amount" type="number" class="discount_amount form-control form-control-sm text-end" placeholder="0.00"></div>
        <div class="rowline total"><span>TOTAL</span><span id="grand">0.00</span></div>
      </div>

      <div class="cardish paybox">
        <div class="rowline"><span>Round Off</span><span id="roundOff" class="amt text-success">0.00</span></div>
        <div class="rowline payable"><span>Payable Amount</span><span id="payable" class="amt">0.00</span></div>
        <div class="rowline"><span>Cash Receive</span><input id="cashReceive" type="number" class="form-control form-control-sm text-end" placeholder="0"></div>
        <div class="rowline"><span>Change Amount</span><span id="changeAmt" class="amt text-success">0.00</span></div>            
      </div>

      <div class="d-grid gap-2">
        <button class="btn btn-primary py-2" id="printBtn"><i class="fa fa-print me-1"></i>PRINT</button>
      </div>
    </div>
  </div>
</form>
</div>
@endsection