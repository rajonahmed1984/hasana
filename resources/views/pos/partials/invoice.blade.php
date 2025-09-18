@php
    
    $method='';
    if($transaction->payments->count()){
        $method=$transaction->payments[0]->method;
    }

@endphp

<div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="printReceiptModalLabel">ইনভয়েস</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" id="receipt-content">

                    <div class="receipt-header">
                        <img src="https://googleusercontent.com/file_content/0" style="width: 100px; margin-bottom: 10px;" alt="Logo">
                        <p class="mb-0">হাউস #১২, রোড #৩, ধানমন্ডি, ঢাকা</p>
                        <p class="small">তারিখ: {{ $transaction->transaction_date}} </p>
                    </div>
                    <hr class="my-2">
                    <div class="receipt-info small">
                        <p class="mb-0"><strong>কাউন্টার:</strong> {{ $transaction->location->name}}</p>
                        <p class="mb-0"><strong>বিক্রয় করেছেন:</strong> {{ $transaction->user->name}}</p>
                    </div>
                    <hr class="my-2">
                    <table class="receipt-table">
                        <thead>
                            <tr>
                                <th>পণ্য</th>
                                <th class="text-center">পরিমাণ</th>
                                <th class="text-center">দাম</th>
                                <th class="text-end">সাব-টোটাল</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($transaction->lines as $line)

                            <tr>
                                <td>{{ $line->product->name}} 
                                        {{ $line->product->type=='variable' ? $line->variation->name:''}}</td>
                         
                                <td class="text-center">{{ $line->quantity}}</td>
                                <td class="text-center">{{ $line->price}}</td>
                                <td class="text-end">{{ $line->price *$line->quantity}}</td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                    <div class="receipt-total">
                        <p>সাব-টোটাল: <span class="float-end">{{ $transaction->final_amount}}</span></p>
                        <p>ডিসকাউন্ট: <span class="float-end">{{ $transaction->discount_amount}}</span></p>
                        <p>ভ্যাট (৫%): <span class="float-end"> {{ $transaction->shipping_charge}} </span></p>
                        <p class="fw-bold fs-5 mt-2">মোট: <span class="float-end">{{ $transaction->final_amount}}</span></p>
                        @if($method)
                        <p><strong>পেমেন্ট পদ্ধতি:</strong> <span class="float-end">{{$method}}</span></p>
                        @endif
                    </div>
                    <p class="text-center mt-3 small">ধন্যবাদ!</p>

        </div>
        <div class="modal-footer justify-content-center">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">বন্ধ করুন</button>
            <button type="button" class="btn btn-primary" onclick="window.print()"><i class="fas fa-print me-2"></i>প্রিন্ট করুন</button>
        </div>
    </div>
</div>




