@extends('layouts.app')
@section('content')

<div id="page-content-wrapper">
    <nav class="navbar navbar-expand-lg navbar-light bg-transparent py-4 px-4">
        <div class="d-flex align-items-center">
            <i class="fas fa-align-left primary-text fs-4 me-3" id="menu-toggle"></i>
            <h2 class="fs-2 m-0">রেওয়ামিল (Trial Balance)</h2>
        </div>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle second-text fw-bold" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fas fa-user me-2"></i>ইউজার নেম
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                        <li><a class="dropdown-item" href="#">প্রোফাইল</a></li>
                        <li><a class="dropdown-item" href="#">লগ আউট</a></li>
                    </ul>
                </li>
            </ul>
        </div>
    </nav>

    <div class="container-fluid px-4">
        <div class="card shadow-sm border-0">
            <div class="card-header bg-white">
                <div class="row g-3 align-items-end">
                    <div class="col-md-4">
                        <label for="asOfDate" class="form-label">তারিখ অনুযায়ী</label>
                        <input type="date" class="form-control" id="asOfDate">
                    </div>
                    <div class="col-md-2">
                        <button class="btn btn-primary w-100" id="filterBtn">দেখুন</button>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div class="text-center mb-4">
                    <h3 class="mb-0">ABC Tiles & Sanitary</h3>
                    <h4 class="mb-0">রেওয়ামিল</h4>
                    <p class="mb-0"> তারিখ: <span id="report-date"></span></p>
                </div>
                <div class="table-responsive">
                    <table class="table table-bordered">
                        <thead class="table-header-custom">
                            <tr>
                                <th>অ্যাকাউন্ট কোড</th>
                                <th>অ্যাকাউন্টের নাম</th>
                                <th class="text-end">ডেবিট (৳)</th>
                                <th class="text-end">ক্রেডিট (৳)</th>
                            </tr>
                        </thead>
                        <tbody id="trial-balance-tbody"></tbody>
                        <tfoot id="trial-balance-tfoot" class="fw-bold table-light"></tfoot>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@push('js')
<script>
document.addEventListener('DOMContentLoaded', () => {
    // --- Mock Data ---
    const trialBalanceData = [
        { code: '1001', name: 'Cash In Hand', type: 'Asset', balance: 150000 },
        { code: '1002', name: 'City Bank - 1234', type: 'Asset', balance: 424000 },
        { code: '1003', name: 'Accounts Receivable', type: 'Asset', balance: 138500 },
        { code: '1004', name: 'Inventory', type: 'Asset', balance: 2500000 },
        { code: '2001', name: 'Accounts Payable', type: 'Liability', balance: 325000 },
        { code: '3001', name: 'Owner\'s Equity', type: 'Equity', balance: 2000000 },
        { code: '4001', name: 'Sales Revenue', type: 'Income', balance: 850000 },
        { code: '5001', name: 'Cost of Goods Sold', type: 'Expense', balance: 550000 },
        { code: '5002', name: 'Salary Expense', type: 'Expense', balance: 50000 },
        { code: '5003', name: 'Rent Expense', type: 'Expense', balance: 25000 },
        { code: '5004', name: 'Utilities Expense', type: 'Expense', balance: 8500 },
    ];

    const tableBody = document.getElementById('trial-balance-tbody');
    const tableFoot = document.getElementById('trial-balance-tfoot');
    const reportDateEl = document.getElementById('report-date');
    const asOfDateInput = document.getElementById('asOfDate');

    const renderTable = () => {
        tableBody.innerHTML = '';
        let totalDebit = 0;
        let totalCredit = 0;

        trialBalanceData.forEach(acc => {
            let debit = 0;
            let credit = 0;

            if (['Asset', 'Expense'].includes(acc.type)) {
                debit = acc.balance;
            } else {
                credit = acc.balance;
            }
            
            totalDebit += debit;
            totalCredit += credit;

            tableBody.innerHTML += `
                <tr>
                    <td>${acc.code}</td>
                    <td>${acc.name}</td>
                    <td class="text-end">${debit > 0 ? `৳ ${debit.toLocaleString('bn-BD')}` : '-'}</td>
                    <td class="text-end">${credit > 0 ? `৳ ${credit.toLocaleString('bn-BD')}` : '-'}</td>
                </tr>
            `;
        });
        
        tableFoot.innerHTML = `
            <tr>
                <td colspan="2" class="text-end"><strong>মোট</strong></td>
                <td class="text-end"><strong>৳ ${totalDebit.toLocaleString('bn-BD')}</strong></td>
                <td class="text-end"><strong>৳ ${totalCredit.toLocaleString('bn-BD')}</strong></td>
            </tr>
        `;
    };

    const setReportDate = () => {
        const date = new Date(asOfDateInput.value || Date.now());
        reportDateEl.textContent = date.toLocaleDateString('bn-BD');
    };

    // Initial Load
    asOfDateInput.valueAsDate = new Date();
    setReportDate();
    renderTable();
    
    document.getElementById('filterBtn').addEventListener('click', () => {
        setReportDate();
        renderTable(); // In a real app, you would refetch data here
    });
});
</script>
@endpush