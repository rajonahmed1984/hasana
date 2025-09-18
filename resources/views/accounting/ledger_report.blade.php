@extends('layouts.app')
@section('content')

<div id="page-content-wrapper">
    <nav class="navbar navbar-expand-lg navbar-light bg-transparent py-4 px-4">
        <div class="d-flex align-items-center">
            <i class="fas fa-align-left primary-text fs-4 me-3" id="menu-toggle"></i>
            <h2 class="fs-2 m-0">লেজার রিপোর্ট</h2>
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
        <!-- Filter Section -->
        <div class="card shadow-sm border-0 mb-4">
            <div class="card-body">
                <div class="row g-3 align-items-end">
                    <div class="col-md-4"><label for="accountSelect" class="form-label">হিসাব নির্বাচন করুন</label><select id="accountSelect" class="form-select"></select></div>
                    <div class="col-md-3"><label for="startDate" class="form-label">শুরুর তারিখ</label><input type="date" class="form-control" id="startDate"></div>
                    <div class="col-md-3"><label for="endDate" class="form-label">শেষ তারিখ</label><input type="date" class="form-control" id="endDate"></div>
                    <div class="col-md-2"><button class="btn btn-primary w-100" id="filterBtn">দেখুন</button></div>
                </div>
            </div>
        </div>

        <!-- Summary Cards -->
        <div class="row g-3 mb-4">
            <div class="col-md-3"><div class="p-3 bg-white shadow-sm text-center rounded stat-card"><h4 class="fs-4" id="opening-balance"></h4><p class="fs-6 mb-0">ওপেনিং ব্যালেন্স</p></div></div>
            <div class="col-md-3"><div class="p-3 bg-white shadow-sm text-center rounded stat-card"><h4 class="fs-4 text-success" id="total-debit"></h4><p class="fs-6 mb-0">মোট ডেবিট</p></div></div>
            <div class="col-md-3"><div class="p-3 bg-white shadow-sm text-center rounded stat-card"><h4 class="fs-4 text-danger" id="total-credit"></h4><p class="fs-6 mb-0">মোট ক্রেডিট</p></div></div>
            <div class="col-md-3"><div class="p-3 bg-white shadow-sm text-center rounded stat-card"><h4 class="fs-4" id="closing-balance"></h4><p class="fs-6 mb-0">ক্লোজিং ব্যালেন্স</p></div></div>
        </div>

        <!-- Ledger Table -->
        <div class="card shadow-sm border-0">
             <div class="card-header bg-white">
                <h4 class="mb-0"><i class="fas fa-list-ul me-2 accent-text"></i>লেনদেনের বিস্তারিত</h4>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover align-middle">
                        <thead class="table-header-custom">
                            <tr><th>তারিখ</th><th>বিবরণ</th><th>রেফারেন্স নং</th><th class="text-end">ডেবিট</th><th class="text-end">ক্রেডিট</th><th class="text-end">ব্যালেন্স</th></tr>
                        </thead>
                        <tbody id="ledger-table-body"></tbody>
                    </table>
                </div>
                <div class="d-flex justify-content-between align-items-center mt-3">
                    <div class="text-muted" id="pagination-info"></div>
                    <nav><ul class="pagination mb-0" id="pagination-container"></ul></nav>
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
        const accounts = [
            { id: 1, name: 'Cash In Hand', opening_balance: 150000, transactions: [{ date: '2025-08-04', description: 'ক্যাশ জমা', ref: 'JV-005', debit: 0, credit: 100000 }] },
            { id: 2, name: 'City Bank - 1234', opening_balance: 500000, transactions: [
                { date: '2025-08-01', description: 'গ্রাহক পেমেন্ট - প্রজেক্ট আলফা', ref: 'RCPT-001', debit: 50000, credit: 0 },
                { date: '2025-08-02', description: 'সাপ্লায়ার পেমেন্ট - RAK Ceramics', ref: 'PAY-001', debit: 0, credit: 120000 },
                { date: '2025-08-03', description: 'বিদ্যুৎ বিল প্রদান', ref: 'EXP-003', debit: 0, credit: 8500 },
            ]},
        ];

        const accountSelect = document.getElementById('accountSelect');
        accountSelect.innerHTML = '<option value="">সকল অ্যাকাউন্ট</option>';
        accounts.forEach(acc => {
            accountSelect.innerHTML += `<option value="${acc.id}">${acc.name}</option>`;
        });

        const tableBody = document.getElementById('ledger-table-body');
        const paginationContainer = document.getElementById('pagination-container');
        const paginationInfo = document.getElementById('pagination-info');
        
        let currentPage = 1, rowsPerPage = 5, filteredData = [];

        const renderTable = (data, page, openingBalance) => {
            tableBody.innerHTML = '';
            const start = (page - 1) * rowsPerPage;
            const end = start + rowsPerPage;
            let balance = openingBalance;
            
            for (let i = 0; i < start; i++) {
                balance += data[i].debit - data[i].credit;
            }

            data.slice(start, end).forEach(t => {
                balance += t.debit - t.credit;
                tableBody.innerHTML += `
                    <tr>
                        <td>${new Date(t.date).toLocaleDateString('bn-BD')}</td>
                        <td>${t.description}</td>
                        <td>${t.ref}</td>
                        <td class="text-end text-success">${t.debit > 0 ? `৳ ${t.debit.toLocaleString('bn-BD')}` : '-'}</td>
                        <td class="text-end text-danger">${t.credit > 0 ? `৳ ${t.credit.toLocaleString('bn-BD')}` : '-'}</td>
                        <td class="text-end">৳ ${balance.toLocaleString('bn-BD')}</td>
                    </tr>
                `;
            });
            paginationInfo.textContent = `${data.length} টির মধ্যে ${start + 1} থেকে ${Math.min(end, data.length)} টি দেখানো হচ্ছে`;
        };
        
        const updateUI = (account) => {
            const totalDebit = account.transactions.reduce((sum, t) => sum + t.debit, 0);
            const totalCredit = account.transactions.reduce((sum, t) => sum + t.credit, 0);
            const closingBalance = account.opening_balance + totalDebit - totalCredit;

            document.getElementById('opening-balance').textContent = `৳ ${account.opening_balance.toLocaleString('bn-BD')}`;
            document.getElementById('total-debit').textContent = `৳ ${totalDebit.toLocaleString('bn-BD')}`;
            document.getElementById('total-credit').textContent = `৳ ${totalCredit.toLocaleString('bn-BD')}`;
            document.getElementById('closing-balance').textContent = `৳ ${closingBalance.toLocaleString('bn-BD')}`;
            
            renderTable(account.transactions, currentPage, account.opening_balance);
            setupPagination(account.transactions);
        };

        const setupPagination = (data) => {
            paginationContainer.innerHTML = '';
            const pageCount = Math.ceil(data.length / rowsPerPage);
            for (let i = 1; i <= pageCount; i++) {
                paginationContainer.innerHTML += `<li class="page-item ${i === currentPage ? 'active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
            }
        };

        document.getElementById('filterBtn').addEventListener('click', () => {
            const accountId = accountSelect.value;
            if(accountId) {
                const selectedAccount = accounts.find(acc => acc.id == accountId);
                currentPage = 1;
                updateUI(selectedAccount);
            } else {
                alert('অনুগ্রহ করে একটি হিসাব নির্বাচন করুন।');
            }
        });

        paginationContainer.addEventListener('click', (e) => {
            e.preventDefault();
            if (e.target.matches('.page-link')) { 
                currentPage = parseInt(e.target.dataset.page);
                const selectedAccount = accounts.find(acc => acc.id == accountSelect.value);
                renderTable(selectedAccount.transactions, currentPage, selectedAccount.opening_balance);
                setupPagination(selectedAccount.transactions);
            }
        });
    });
</script>
@endpush