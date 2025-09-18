@extends('pos.app')
@section('pos_content')
<main class="pos-main-content">
    <!-- Left: Categories -->
    <div class="category-section">
        <div class="list-group">
            <a class="list-group-item list-group-item-action category active" data-category="all">সকল ক্যাটাগরি</a>
            @foreach($cats as $cat)
            <a class="list-group-item list-group-item-action category" data-category="{{ $cat->id}}">{{ $cat->name}}</a>
            @endforeach
        </div>
    </div>

    <!-- Middle: Products -->
    <div class="product-section">
        <div class="search-bar">
            <div class="input-group">
                <span class="input-group-text"><i class="fas fa-search"></i></span>
                <input type="text" id="psearch" class="form-control" placeholder="পণ্য খুঁজুন...">
            </div>
        </div>
        <div class="product-grid" id="product-grid">
            <!-- Products will be loaded by JS -->
        </div>
    </div>

    <!-- Right: Cart -->
    <div class="cart-section">
        <form action="{{ route('pos.update',[$transaction->id])}}" method="post" id="pos_form">
            @method('PATCH')
            @csrf
        <div class="cart-items row">
            <div class="col-md-4">
                <div class="form-group">
                    <select name="location_id" id="location_id" class="form-control">
                        @foreach($locations as $location)
                        <option value="{{ $location->id}}"
                            {{$transaction->location_id==$location->id ? 'selected':'disable'}}>
                            {{ $location->name}}
                        </option>
                        @endforeach
                    </select>
                </div>
            </div>

            <div class="col-md-4">
                <div class="form-group">
                    <select name="contact_id" id="contact_id" class="form-control">
                        @foreach($contacts as $contact)
                        <option value="{{ $contact->id}}"
                            {{$transaction->contact_id==$contact->id ? 'selected':''}}
                            >{{ $contact->name}}</option>
                        @endforeach
                    </select>
                </div>
            </div>

        </div>
        <div class="cart-items">
   
            <table class="table">
                <tbody id="cart-body">
                    @foreach($olditems as $olditem)
                    @include('pos.partials.product_row',['item'=>$olditem,'exist'=>1])
                    @endforeach
                </tbody>
            </table>
        </div>
        <div class="cart-summary">
            <div class="summary-row">
                <span>সাব-টোটাল</span>
                <span class="fw-bold" id="subtotal">৳ ০.০০</span>
            </div>
            <div class="summary-row">
                <span>ডিসকাউন্ট</span>
                <input type="number" class="form-control form-control-sm discount_amount" name="discount_amount"
                 value="{{ $transaction->discount_amount}}">
                <input type="hidden" class="final_amount" name="final_amount" value="{{ $transaction->final_amount}}">
            </div>

            <div class="summary-row">
                <span>রিডিম পয়েন্ট</span>
                <input type="number" class="form-control form-control-sm reddem_point" name="reddem_point"
                 value="{{ $transaction->reddem_point}}">
                
            </div>

            <div class="summary-row">
                <span>ভ্যাট/ট্যাক্স (৫%)</span>
                <span class="fw-bold" id="vat">৳ ০.০০</span>
            </div>
            <hr>
            <div class="summary-row total">
                <span class="fs-5 ">মোট টাকা</span>
                <span class="fs-4 fw-bolder accent-text final_amount">৳ ০.০০</span>
            </div>
            <div class="d-grid mt-3">
                <button type="button" class="btn btn-primary btn-lg payment-item">
                    <i class="fas fa-money-bill-wave me-2"></i>পেমেন্ট
                </button>
            </div>
        </div>
        @include('pos.partials.payment_modal')
        </form>
    </div>
</main>
@endsection

@push('js')
@include('pos.partials.js')
@endpush
