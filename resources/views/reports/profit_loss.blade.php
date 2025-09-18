@extends('layouts.app')
@section('content')
<div id="page-content-wrapper">
    <nav class="navbar navbar-expand-lg navbar-light bg-transparent py-4 px-4">
        <div class="d-flex align-items-center">
            <i class="fas fa-align-left primary-text fs-4 me-3" id="menu-toggle"></i>
            <h2 class="fs-2 m-0">লাভ-ক্ষতি রিপোর্ট</h2>
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
                    <div class="col-md-3"><label for="startDate" class="form-label">শুরুর তারিখ</label><input type="date" class="form-control" id="startDate"></div>
                    <div class="col-md-3"><label for="endDate" class="form-label">শেষ তারিখ</label><input type="date" class="form-control" id="endDate"></div>
                    <div class="col-md-2"><button class="btn btn-primary w-100" id="filterBtn">দেখুন</button></div>
                </div>
            </div>
            <div class="card-body">
                <div class="text-center mb-4">
                    <h3 class="mb-0">ABC Tiles & Sanitary</h3>
                    <h4 class="mb-0">লাভ-ক্ষতির বিবরণী</h4>
                    <p class="mb-0"> তারিখ: <span id="report-date-range"></span></p>
                </div>
                <div class="table-responsive">
                    <table class="table table-bordered">
                        <tbody id="pl-report-tbody">
                            <!-- P&L rows will be inserted here by JS -->
                        </tbody>
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
        const reportData = {
            income: [
                { account: 'Sales Revenue', amount: 850000 },
                { account: 'Other Income', amount: 15000 },
            ],
            costOfGoodsSold: [
                { account: 'Cost of Goods Sold', amount: 550000 },
            ],
            expenses: [
                { account: 'Salary Expense', amount: 50000 },
                { account: 'Rent Expense', amount: 25000 },
                { account: 'Utilities Expense', amount: 8500 },
                { account: 'Marketing Expense', amount: 12000 },
            ]
        };

        const tableBody = document.getElementById('pl-report-tbody');
        const reportDateEl = document.getElementById('report-date-range');
        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');

        const renderReport = () => {
            tableBody.innerHTML = '';
            let totalIncome = 0;
            let totalCOGS = 0;
            let totalExpenses = 0;

            // Income Section
            tableBody.innerHTML += `<tr class="table-light"><td colspan="2"><strong>আয় (Income)</strong></td></tr>`;
            reportData.income.forEach(item => {
                totalIncome += item.amount;
                tableBody.innerHTML += `<tr><td>${item.account}</td><td class="text-end">৳ ${item.amount.toLocaleString('bn-BD')}</td></tr>`;
            });
            tableBody.innerHTML += `<tr class="fw-bold"><td>মোট আয়</td><td class="text-end">৳ ${totalIncome.toLocaleString('bn-BD')}</td></tr>`;

            // COGS Section
            tableBody.innerHTML += `<tr class="table-light"><td colspan="2"><strong>বিক্রিত পণ্যের ব্যয় (Cost of Goods Sold)</strong></td></tr>`;
            reportData.costOfGoodsSold.forEach(item => {
                totalCOGS += item.amount;
                tableBody.innerHTML += `<tr><td>${item.account}</td><td class="text-end">৳ ${item.amount.toLocaleString('bn-BD')}</td></tr>`;
            });
            
            // Gross Profit
            const grossProfit = totalIncome - totalCOGS;
            tableBody.innerHTML += `<tr class="fw-bold table-success"><td>মোট লাভ (Gross Profit)</td><td class="text-end">৳ ${grossProfit.toLocaleString('bn-BD')}</td></tr>`;

            // Expenses Section
            tableBody.innerHTML += `<tr class="table-light"><td colspan="2"><strong>পরিচালন ব্যয় (Operating Expenses)</strong></td></tr>`;
            reportData.expenses.forEach(item => {
                totalExpenses += item.amount;
                tableBody.innerHTML += `<tr><td>${item.account}</td><td class="text-end">৳ ${item.amount.toLocaleString('bn-BD')}</td></tr>`;
            });
            tableBody.innerHTML += `<tr class="fw-bold"><td>মোট ব্যয়</td><td class="text-end">৳ ${totalExpenses.toLocaleString('bn-BD')}</td></tr>`;

            // Net Profit
            const netProfit = grossProfit - totalExpenses;
            const netProfitClass = netProfit >= 0 ? 'table-success' : 'table-danger';
            tableBody.innerHTML += `<tr class="fw-bold ${netProfitClass}"><td>নীট লাভ/ক্ষতি (Net Profit/Loss)</td><td class="text-end">৳ ${netProfit.toLocaleString('bn-BD')}</td></tr>`;
        };

        const setReportDate = () => {
            const startDate = startDateInput.value ? new Date(startDateInput.value).toLocaleDateString('bn-BD') : 'শুরু';
            const endDate = endDateInput.value ? new Date(endDateInput.value).toLocaleDateString('bn-BD') : 'আজ';
            reportDateEl.textContent = `${startDate} থেকে ${endDate}`;
        };

        // Initial Load
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        startDateInput.valueAsDate = firstDayOfMonth;
        endDateInput.valueAsDate = today;
        
        setReportDate();
        renderReport();
        
        document.getElementById('filterBtn').addEventListener('click', () => {
            setReportDate();
            // In a real app, you would refetch data for the selected date range
            renderReport(); 
        });
    });
</script>
@endpush