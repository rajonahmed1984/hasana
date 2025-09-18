<div class="modal-dialog modal-md">
    <div class="modal-content">

      <form action="{{ route('productImportStore')}}" method="post" id="ajax_form">
        @csrf
        <div class="modal-header">
            <h5 class="modal-title" id="productModalLabel">নতুন পণ্য</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div class="row">
                <div class="col-10">
                  <div class="form-group">
                      <label> File</label>
                      <input type="file" name="products_csv" class="form-control" />
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