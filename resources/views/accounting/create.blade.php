<div class="modal-dialog modal-lg modal-dialog-centered">
    <div class="modal-content">
        <form action="{{ route('accounts.update',[$account->id])}}" method="post" id="ajax_form">
            @method('PATCH')
            @csrf

            <div class="modal-header">
                <h5 class="modal-title" id="accountModalLabel">নতুন অ্যাকাউন্ট</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="accountName" class="form-label">অ্যাকাউন্টের নাম</label>
                        <input type="text" name="name" 
                        value="{{ $account->name}}"
                        class="form-control" required>
                    </div>

                    <div class="col-md-6 mb-3">
                        <label for="accountCode" class="form-label">অ্যাকাউন্ট কোড</label>
                        <input type="text" class="form-control" name="account_no" 
                        value="{{ $account->account_no}}">
                    </div>

                    <div class="col-md-6 mb-3">
                        <label class="form-label">অ্যাকাউন্টের ধরণ</label>
                        <select class="form-select" name="type">
                            <option value="">selected one</option>
                            @foreach($types as $i=> $type)
                            <option value="{{ $i}}">{{ $type}}</option>
                            @endforeach
                        </select>
                    </div>

                    <div class="col-md-6 mb-3">
                        <label class="form-label">ওপেনিং ব্যালেন্স</label>
                        <input type="number" name="openning_balance" class="form-control" value="{{ $account->openning_balance}}">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">ওপেনিং ব্যালেন্স Date</label>
                        <input type="date" name="openning_balance_date" 
                        value="{{ $account->openning_balance_date}}"
                        class="form-control">

                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">বাতিল</button>
                <button type="submit" class="btn btn-primary">সংরক্ষণ করুন</button>
            </div>
        </form>
    </div>
</div>