<div class="table-responsive">
    <table class="table table-hover align-middle">
        <thead class="table-header-custom">
            <tr>
                <th>তারিখ</th>
                <th>চালান নং</th>
                <th>গ্রাহক</th>
                <th>মোট পরিমাণ</th>
                <th>পরিশোধিত</th>
                <th>বকেয়া</th>
                <th>লাভ</th>
            </tr>
        </thead>
        <tbody id="sales-report-tbody">
            @foreach($items as $item)
            <tr>
                <td>{{ dateFormate($item->transaction_date)}}</td>
                <td>{{ $item->invoice_no}}</td>
                <td>{{ $item->contact->name ??''}}
                    <br>{{ $item->contact->mobile ??''}}
                </td>
                
                
                
                <td>{{ $item->final_amount}}</td>
                <td>{{ $item->payments->sum('amount')}}</td>
                <td>{{ $item->final_amount - $item->payments->sum('amount')}}</td>
                <td>0</td>
            </tr>

            @endforeach
        </tbody>
    </table>
</div>