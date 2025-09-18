<div class="modal-dialog modal-lg">
  <div class="modal-content">
    <form action="{{ route('users.store')}}" method="post" id="ajax_form">
      @csrf
    <div class="modal-header">
      <h1 class="modal-title">নতুন ইউজার যোগ</h1>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
        <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12">
                <div class="form-group">
                    <strong>Name:</strong>
                    <input type="text" name="name" placeholder="Name" class="form-control">
                </div>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12">
                <div class="form-group">
                    <strong>Email:</strong>
                    <input type="email" name="email" placeholder="Email" class="form-control">
                </div>
            </div>

            <div class="col-12 mb-3">
                <label for="phone" class="form-label">ফোন নম্বর</label>
                <input type="tel" class="form-control" name="phone" placeholder="Phone Number">
            </div>

            <div class="col-12 mb-3">
                <label for="phone" class="form-label">Image</label>
                <input type="file" class="form-control" name="image">
            </div>
          
            <div class="col-12 mb-3">
                <label for="address" class="form-label">ঠিকানা</label>
                <textarea class="form-control" name="address" rows="3"></textarea>
            </div>

            <div class="col-xs-12 col-sm-12 col-md-12">
                <div class="form-group">
                    <strong>Password:</strong>
                    <input type="password" name="password" placeholder="Password" class="form-control">
                </div>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12">
                <div class="form-group">
                    <strong>Confirm Password:</strong>
                    <input type="password" name="confirm-password" placeholder="Confirm Password" class="form-control">
                </div>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12">
                <div class="form-group">
                    <strong>Role:</strong>
                    <select name="roles[]" class="form-control">
                        @foreach ($roles as $value => $label)
                            <option value="{{ $value }}">
                                {{ $label }}
                            </option>
                         @endforeach
                    </select>
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
