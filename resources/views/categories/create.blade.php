<div class="modal-dialog modal-lg">
  <div class="modal-content">
    <form action="{{ route('categories.update',[$category->id])}}" method="post" id="ajax_form">
      @method('PATCH')
      @csrf
    <div class="modal-header">
      <h1 class="modal-title">Category</h1>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      
          <div class="col-12">
            <div class="form-group">
                <label> name</label>
                <input type="text" name="name" class="form-control" value="{{ $category->name }}" />
            </div>

            <div class="form-group">
                <label> Parent Category</label>
                <select class="form-control" name="parent_id">
                  <option value="">Select One</option>
                  @foreach($cats as $cat)
                  <option value="{{ $cat->id}}" {{ $cat->id==$category->parent_id ? 'selected':''}}> {{ $cat->name}}</option>
                  @endforeach
                </select>
            </div>


            <div class="form-group">
                <label> Image</label>
                <input type="file" name="image" class="form-control" />
            </div>

            <div class="form-group">
                <label> Status</label>
                <select class="form-control" name="status">
                  <option value="1" {{ '1'==$category->status ? 'selected':''}}>Active</option>
                  <option value="0" {{ '0'==$category->status ? 'selected':''}}>De-Active</option>
                </select>
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