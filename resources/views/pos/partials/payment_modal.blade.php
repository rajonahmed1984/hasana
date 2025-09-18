<div class="modal fade" id="paymentModal" tabindex="-1" aria-labelledby="paymentModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="paymentModalLabel">পেমেন্ট পদ্ধতি</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="payment-options">
                    <div class="payment-option {{ $method=='cash' ?'active':''}}" data-target="cash"><i class="fas fa-money-bill-alt fa-2x"></i><span>ক্যাশ</span></div>

                    <div class="payment-option {{ $method=='card' ?'active':''}}" data-target="card"><i class="fas fa-credit-card fa-2x"></i><span>কার্ড</span></div>
                    <div class="payment-option {{ $method=='mobile' ?'active':''}}" data-target="mobile"><i class="fas fa-mobile-alt fa-2x"></i><span>মোবাইল ব্যাংকিং</span></div>

                    <div class="payment-option {{ $method=='due' ?'active':''}}" data-target="due"><i class="fas fa-file-invoice-dollar text-warning fa-2x"></i><span>বাকিতে  বিক্রয় </span></div>

                </div>
                <hr>
                <div id="payment-details-container"></div>
                <input type="hidden" class="pay_amount" name="pay_amount" value="">
                <input type="hidden" class="method" name="method" value="{{$method}}">
            </div>
            <div class="modal-footer d-grid">
                <button type="submit" class="btn btn-success btn-lg" id="confirm-payment-btn">পেমেন্ট নিশ্চিত করুন</button>
            </div>
        </div>
    </div>
</div>