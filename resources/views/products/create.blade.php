<div class="modal-dialog modal-xl">
    <div class="modal-content">

      <form action="{{ route('products.update',[$product->id])}}" method="post" id="ajax_form">
        @method('PATCH')
        @csrf
        <div class="modal-header">
            <h5 class="modal-title" id="productModalLabel">নতুন পণ্য</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div class="row">
                <div class="col-md-8 mb-3">
                    <label for="productName" class="form-label">পণ্যের নাম</label>
                    <input type="text" name="name" class="form-control" value="{{ $product->name }}" />
                </div>
                <div class="col-md-4 mb-3">
                    <label for="productSKU" class="form-label">SKU / কোড</label>
                    <input type="text" name="sku" class="form-control main_sku" value="{{ $product->sku ?? $product->id }}" />
                </div>


                <div class="col-md-6 mb-3">
                    <label for="productCategory" class="form-label">ক্যাটাগরি</label>
                    <select class="form-control" name="category_id">
                        <option value="">Select One</option>
                        @foreach($cats as $cat)
                        <option value="{{ $cat->id}}" 
                            {{ $cat->id==$product->category_id ? 'selected':''}}> {{ $cat->name}}</option>
                        @endforeach
                  </select>
                </div>

                <div class="col-4">
                  <div class="form-group">
                      <label>Sub Category</label>
                      <select class="form-control" name="sub_category_id">
                        <option value="">Select One</option>
                        @foreach($sub_cats as $sub_cat)
                        <option value="{{ $sub_cat->id}}" {{ $sub_cat->id==$product->sub_category_id ? 'selected':''}}> {{ $sub_cat->name}}</option>
                        @endforeach
                      </select>
                  </div>
                </div>

                <div class="col-4">
                  <div class="form-group">
                      <label>Brand</label>
                      <select class="form-control" name="brand_id">
                        <option value="">Select One</option>
                        @foreach($brands as $brand)
                        <option value="{{ $brand->id}}" {{ $brand->id==$product->brand_id ? 'selected':''}}> {{ $brand->name}}</option>
                        @endforeach
                      </select>
                  </div>
                </div>

                <div class="col-4">
                  <div class="form-group">
                      <label>Unit</label>
                      <select class="form-control" name="unit_id">
                        <option value="">Select One</option>
                        @foreach($units as $unit)
                        <option value="{{ $unit->id}}" {{ $unit->id==$product->unit_id ? 'selected':''}}> {{ $unit->name}}</option>
                        @endforeach
                      </select>
                  </div>
                </div>



                <div class="col-4">
                  <div class="form-group">
                      <label> Image</label>
                      <input type="file" name="image" class="form-control" />
                  </div>
                </div>

                <div class="col-4">
                  <div class="form-group">
                      <label> Stock Alert</label>
                      <input type="text" name="stock_alert" class="form-control" value="{{ $product->stock_alert }}" />
                  </div>
                </div>

                <div class="col-4">
                  <div class="form-group">
                      <label> Purchase Price</label>
                      <input type="text" name="purchase_price" class="form-control" 
                      value="{{ $item->variation->purchase_price??0}}" />
                  </div>
                </div>

                <div class="col-4">
                  <div class="form-group">
                      <label> Sell Price</label>
                      <input type="text" name="sell_price" class="form-control" 
                        value="{{ $item->variation->purchase_price??0}}" />
                  </div>
                </div>


                <div class="col-6">
                  <div class="form-group">
                      <label> Description</label>
                      <textarea class="form-control" name="description"></textarea>
                  </div>
                </div>

                <div class="col-3 hide">
                  <div class="form-group">
                      <label> Type</label>
                      <select class="form-control product_type" name="type">
                        <option value="single" {{ 'single'==$product->type ? 'selected':''}}>Single</option>
                        <option value="variable" {{ 'variable'==$product->type ? 'selected':''}}> Variable </option>
                      </select>
                  </div>
                </div>

                <div class="col-3">
                  <div class="form-group">
                      <label> Status</label>
                      <select class="form-control" name="status">
                        <option value="1" {{ '1'==$product->status ? 'selected':''}}>Active</option>
                        <option value="0" {{ '0'==$product->status ? 'selected':''}}>De-Active</option>
                      </select>
                  </div>
                </div>
                

            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">বন্ধ করুন</button>
            <button type="submit" class="btn btn-primary">সংরক্ষণ করুন</button>
        </div>
      </form>
    </div>
</div>