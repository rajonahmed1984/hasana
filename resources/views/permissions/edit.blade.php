<div class="modal-dialog modal-lg">
  <div class="modal-content">
    <form action="{{ route('permissions.update',[$user->id])}}" method="post" id="ajax_form">
      @csrf
      @method('PATCH')
    <div class="modal-header">
      <h1 class="modal-title"> পারমিশন আপডেট</h1>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
        <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12">
                <div class="form-group">
                    <strong>Name:</strong>
                    <input type="text" name="name" value="{{ $user->name}}" placeholder="Name" class="form-control">
                </div>
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
