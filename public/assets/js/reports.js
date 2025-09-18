document.addEventListener('DOMContentLoaded', () => {
    // --- Simulate Active Module ---
    const activeModule = 'supershop'; // Change to 'tiles', 'wholesaler', 'medical' to see different report structures

    // --- Mock Data ---
    const mockData = {
        sales: {
            supershop: [ { invoice: 'INV-001', customer: 'রহিম শেখ', amount: 5200, cashier: 'Admin' } ],
            tiles: [ { invoice: 'T-INV-001', project: 'প্রজেক্ট আলফা', amount: 150000, contractor: 'রহিম' } ],
        },
        inventory: {
            supershop: [ { product: 'ফ্রেশ আটা', sku: 'GRO-001', stock: 50, batch: 'B002', expiry: '2026-06-30' } ],
            tiles: [ { product: 'RAK টাইলস', sku: 'TILE-001', stock: 500, batch: 'RAK-A1', dimensions: '24x24 inch' } ],
        },
        customerDue: [ { name: 'রহিম শেখ', phone: '01712345678', totalBill: 50000, totalPaid: 30000, due: 20000 } ],
        supplierDue: [ { name: 'রহিম ট্রেডার্স', phone: '01711111111', totalPurchase: 120000, totalPaid: 100000, due: 20000 } ],
    };

    // --- Page Router ---
    const currentPage = window.location.pathname.split("/").pop();

    // --- Sales Report Logic ---
    if (currentPage === 'sales-report.html') {
        const tableHead = document.getElementById('sales-report-table-head');
        const tableBody = document.getElementById('sales-report-table-body');
        const headers = {
            supershop: `<tr><th>ইনভয়েস নং</th><th>গ্রাহক</th><th>পরিমাণ</th><th>ক্যাশিয়ার</th></tr>`,
            tiles: `<tr><th>ইনভয়েস নং</th><th>প্রজেক্ট</th><th>পরিমাণ</th><th>ঠিকাদার</th></tr>`,
        };
        tableHead.innerHTML = headers[activeModule] || headers.supershop;
        const data = mockData.sales[activeModule] || [];
        tableBody.innerHTML = '';
        data.forEach(item => {
            let row = (activeModule === 'tiles') ? `<tr><td>${item.invoice}</td><td>${item.project}</td><td>৳${item.amount}</td><td>${item.contractor}</td></tr>` : `<tr><td>${item.invoice}</td><td>${item.customer}</td><td>৳${item.amount}</td><td>${item.cashier}</td></tr>`;
            tableBody.insertAdjacentHTML('beforeend', row);
        });
    }

    // --- Inventory Report Logic ---
    if (currentPage === 'inventory-report.html') {
        const tableHead = document.getElementById('inventory-report-table-head');
        const tableBody = document.getElementById('inventory-report-table-body');
        const headers = {
            supershop: `<tr><th>পণ্য</th><th>SKU</th><th>স্টক</th><th>ব্যাচ নং</th><th>মেয়াদ</th></tr>`,
            tiles: `<tr><th>পণ্য</th><th>SKU</th><th>স্টক</th><th>ব্যাচ নং</th><th>ডাইমেনশন</th></tr>`,
        };
        tableHead.innerHTML = headers[activeModule] || headers.supershop;
        const data = mockData.inventory[activeModule] || [];
        tableBody.innerHTML = '';
        data.forEach(item => {
            let row = (activeModule === 'tiles') ? `<tr><td>${item.product}</td><td>${item.sku}</td><td>${item.stock}</td><td>${item.batch}</td><td>${item.dimensions}</td></tr>` : `<tr><td>${item.product}</td><td>${item.sku}</td><td>${item.stock}</td><td>${item.batch}</td><td>${item.expiry}</td></tr>`;
            tableBody.insertAdjacentHTML('beforeend', row);
        });
    }

    // --- Due Report Logic ---
    if (currentPage === 'due-report.html') {
        const customerDueTable = document.getElementById('customer-due-table-body');
        const supplierDueTable = document.getElementById('supplier-due-table-body');
        customerDueTable.innerHTML = '';
        mockData.customerDue.forEach(item => {
            customerDueTable.insertAdjacentHTML('beforeend', `<tr><td>${item.name}</td><td>${item.phone}</td><td>৳${item.totalBill}</td><td>৳${item.totalPaid}</td><td><span class="text-danger fw-bold">৳${item.due}</span></td></tr>`);
        });
        supplierDueTable.innerHTML = '';
        mockData.supplierDue.forEach(item => {
            supplierDueTable.insertAdjacentHTML('beforeend', `<tr><td>${item.name}</td><td>${item.phone}</td><td>৳${item.totalPurchase}</td><td>৳${item.totalPaid}</td><td><span class="text-danger fw-bold">৳${item.due}</span></td></tr>`);
        });
    }
});
