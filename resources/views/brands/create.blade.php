<div class="modal-dialog modal-lg">
  <div class="modal-content">
    <form action="{{ route('brands.update',[$brand->id])}}" method="post" id="ajax_form">
      @method('PATCH')
      @csrf
    <div class="modal-header">
      <h1 class="modal-title">Brand</h1>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      
          <div class="col-12">
            <div class="form-group">
                <label> name</label>
                <input type="text" name="name" class="form-control" value="{{ $brand->name }}" />
            </div>

            <div class="form-group">
                <label> Image</label>
                <input type="file" name="image" class="form-control" />
            </div>
          </div>
          

    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      <button type="submit" class="btn btn-primary">Submit</button>
    </div>
    </form>
  </div>
</div>