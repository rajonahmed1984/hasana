@extends('layouts.app')
@section('content')

<div id="page-content-wrapper">
    <nav class="navbar navbar-expand-lg navbar-light bg-transparent py-4 px-4">
        <div class="d-flex align-items-center">
            <i class="fas fa-align-left primary-text fs-4 me-3" id="menu-toggle"></i>
            <h2 class="fs-2 m-0">বকেয়া রিপোর্ট</h2>
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
        <!-- Summary Cards -->
        <div class="row g-3 mb-4">
            <div class="col-md-6"><div class="p-3 bg-white shadow-sm text-center rounded stat-card"><h3 class="fs-2 text-danger" id="total-due"></h3><p class="fs-5 mb-0">মোট বকেয়া</p></div></div>
            <div class="col-md-6"><div class="p-3 bg-white shadow-sm text-center rounded stat-card"><h3 class="fs-2" id="due-customers"></h3><p class="fs-5 mb-0">বকেয়া গ্রাহক সংখ্যা</p></div></div>
        </div>

        <!-- Due List Table -->
        <div class="card shadow-sm border-0">
             <div class="card-header bg-white">
                <div class="row justify-content-between align-items-center">
                    <div class="col-md-6"><h4 class="mb-0"><i class="fas fa-list-ul me-2 accent-text"></i>বকেয়া গ্রাহকের তালিকা</h4></div>
                    <div class="col-md-4"><input type="text" class="form-control" id="searchInput" placeholder="গ্রাহকের নাম বা ফোন দিয়ে খুঁজুন..."></div>
                </div>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover align-middle">
                        <thead class="table-header-custom">
                            <tr><th>গ্রাহক</th><th>মোট চালান</th><th>মোট বকেয়া</th><th class="text-center">অ্যাকশন</th></tr>
                        </thead>
                        <tbody id="due-report-tbody"></tbody>
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
    const dueData = [
        { id: 1, name: 'প্রজেক্ট আলফা', phone: '01711000001', total_invoices: 3, total_due: 55000 },
        { id: 3, name: 'করিম স্যানিটারি', phone: '01911000003', total_invoices: 1, total_due: 83500 },
        { id: 6, name: 'জামাল এন্টারপ্রাইজ', phone: '01811000006', total_invoices: 5, total_due: 125000 },
    ];

    const tableBody = document.getElementById('due-report-tbody');
    const paginationContainer = document.getElementById('pagination-container');
    const paginationInfo = document.getElementById('pagination-info');
    const searchInput = document.getElementById('searchInput');
    
    let currentPage = 1, rowsPerPage = 5, filteredData = [...dueData];

    const updateSummary = (data) => {
        const totalDue = data.reduce((sum, s) => sum + s.total_due, 0);
        document.getElementById('total-due').textContent = `৳ ${totalDue.toLocaleString('bn-BD')}`;
        document.getElementById('due-customers').textContent = data.length;
    };

    const renderTable = (data, page) => {
        tableBody.innerHTML = '';
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        data.slice(start, end).forEach(d => {
            tableBody.innerHTML += `
                <tr>
                    <td>
                        <strong>${d.name}</strong><br>
                        <small class="text-muted">${d.phone}</small>
                    </td>
                    <td>${d.total_invoices}</td>
                    <td>৳ ${d.total_due.toLocaleString('bn-BD')}</td>
                    <td class="text-center">
                        <a href="customer-profile.php?id=${d.id}" class="btn btn-sm btn-outline-primary"><i class="fas fa-eye me-2"></i>প্রোফাইল দেখুন</a>
                    </td>
                </tr>
            `;
        });
        paginationInfo.textContent = `${data.length} টির মধ্যে ${start + 1} থেকে ${Math.min(end, data.length)} টি দেখানো হচ্ছে`;
    };

    const setupPagination = (data) => {
        paginationContainer.innerHTML = '';
        const pageCount = Math.ceil(data.length / rowsPerPage);
        for (let i = 1; i <= pageCount; i++) {
            paginationContainer.innerHTML += `<li class="page-item ${i === currentPage ? 'active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
        }
    };
    
    const updateUI = () => {
        renderTable(filteredData, currentPage);
        setupPagination(filteredData);
        updateSummary(filteredData);
    };
    
    searchInput.addEventListener('keyup', () => {
        const term = searchInput.value.toLowerCase();
        filteredData = dueData.filter(d => d.name.toLowerCase().includes(term) || d.phone.includes(term));
        currentPage = 1;
        updateUI();
    });

    paginationContainer.addEventListener('click', (e) => {
        e.preventDefault();
        if (e.target.matches('.page-link')) { currentPage = parseInt(e.target.dataset.page); updateUI(); }
    });

    updateUI();
});
</script>
@endpush