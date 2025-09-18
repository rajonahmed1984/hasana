<div class="modal-dialog modal-xl">
  <div class="modal-content">
    <div class="modal-header">
      <h2 class="modal-title"> Purchases </h2>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>

    <form action="{{ route('purchases.update',[$transaction->id])}}" method="post" id="ajax_form">

      @method('PATCH')
      @csrf

      <div class="modal-body">
        <div class="row">
          <div class="card shadow-sm border-0">
            <div class="card-body p-4">
                <div class="row mb-4">

                    <div class="col-md-4">
                      <label for="location_id" class="form-label"> Outlet </label>
                      <select class="form-control" name="location_id">
                        <option value="">Select</option>
                        @foreach($locations as $location)
                        <option value="{{$location->id}}" {{$transaction->location_id==$location->id ? 'selected':'disable'}}>{{$location->name}}</option>
                        @endforeach
                        
                      </select>
                    </div>

                    <div class="col-md-4">
                        <label for="contact_id" class="form-label">সাপ্লায়ার</label>
                        <select id="contact_id" class="form-select" name="contact_id">
                            <option value="">সাপ্লায়ার নির্বাচন করুন...</option>
                            @foreach($contacts as $contact)
                            <option value="{{$contact->id}}" {{$transaction->contact_id==$contact->id ? 'selected':''}}>{{$contact->name}}</option>
                            @endforeach
                        </select>
                    </div>

                    <div class="col-md-4">
                      <div class="mb-3">
                        <label class="form-label">Reference<span class="text-danger ms-1">*</span></label>
                        <input type="text" class="form-control" name="invoice_no" value="{{ $transaction->invoice_no}}">
                      </div>
                    </div>

                    <div class="col-md-4">
                        <label for="purchaseDate" class="form-label">পারচেজের তারিখ</label>
                        <input type="date" name="transaction_date" class="form-control" value="{{ $transaction->transaction_date}}" id="purchaseDate">
                    </div>
                    <div class="col-md-4">
                        <label for="purchaseStatus" class="form-label">স্ট্যাটাস</label>
                        <select id="purchaseStatus" class="form-select" name="shipping_status">
                            <option value="received" {{$transaction->shipping_status=='received' ? 'selected':''}}>Received</option>
                            <option value="pending" {{$transaction->shipping_status=='pending' ? 'selected':''}}>Pending</option>
                            <option value="ordered" {{$transaction->shipping_status=='ordered' ? 'selected':''}}>Ordered</option>
                        </select>
                    </div>
                </div>

                <div class="mb-3">
                    <label class="form-label">পণ্য যোগ করুন</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="fas fa-search"></i></span>
                        <input type="text" class="form-control" id="purchases_product" placeholder="পণ্য খুঁজুন...">
                    </div>
                </div>

                <div class="table-responsive mb-4">
                    <table class="table table-bordered" id="purchase_product">
                        <thead class="table-light">
                            <tr>
                                <th>পণ্য</th>
                                <th>ব্যাচ নং</th>
                                <th>মেয়াদ</th>
                                <th>পরিমাণ</th>
                                <th>ক্রয়মূল্য</th>
                                <th>সাব-টোটাল</th>
                                <th><i class="fas fa-trash"></i></th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($transaction->purchase_lines as $line)
                              @include('purchases.edit_product_row', ['line'=>$line])
                            @endforeach
                        </tbody>
                    </table>
                </div>

                
            </div>
        </div>


          
        </div>

        <div class="col-lg-12 mt-3">
          <div class="mb-3 summer-description-box">
            <label class="form-label"> Note </label>
            <textarea class="form-control" name="note">{{ $transaction->note}}</textarea>
          </div>
        </div>

        <div class="row justify-content-end">
          <div class="col-md-4">
              <div class="table-responsive">
                  <table class="table">
                      <tbody>
                          <tr>
                              <td> Shipping </td>
                              <td><input type="number" class="form-control shipping_charge" value="{{ $transaction->shipping_charge}}"></td>
                          </tr>

                          <tr>
                              <td>ডিসকাউন্ট</td>
                              <td><input type="number" class="form-control discount_amount" value="{{ $transaction->discount_amount}}"></td>
                          </tr>
                          <tr>
                              <td>ট্যাক্স</td>
                              <td class="fw-bold">৳৩৭.৫০</td>
                          </tr>
                          <tr>
                              <td class="fw-bold">মোট টাকা</td>
                              <td class="fw-bold">৳৭৮৭.৫০</td>
                          </tr>
                      </tbody>
                  </table>
                  <input type="hidden" class="final_amount" name="final_amount" value="{{ $transaction->final_amount}}">
              </div>
          </div>
      </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn me-2 btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="submit" class="btn btn-primary">পারচেজ সংরক্ষণ করুন</button>
      </div>
    </form>
  </div>
</div>

