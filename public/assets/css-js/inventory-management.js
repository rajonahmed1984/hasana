document.addEventListener('DOMContentLoaded', () => {
    // --- Mock Data ---
    let products = [
        { 
            id: 1, name: 'ফ্রেশ আটা', sku: 'GRO-001', category: 'গ্রোসারি', price: 60, cost: 50, reorderLevel: 15,
            batches: [
                { batchNo: 'B001', stock: 20, expiry: '2023-12-31' }, // Expired
                { batchNo: 'B002', stock: 30, expiry: '2026-06-30' }  // Not expired
            ] 
        },
        { 
            id: 2, name: 'Apex লেদার শু', sku: 'SHOE-001', category: 'জুতা', price: 2500, cost: 1800, reorderLevel: 10,
            batches: [
                { batchNo: 'SHB-A1', stock: 15, expiry: null } // No expiry
            ] 
        },
        { 
            id: 3, name: 'ঔষধ X', sku: 'MED-001', category: 'ফার্মাসি', price: 100, cost: 80, reorderLevel: 20,
            batches: [
                { batchNo: 'MX-101', stock: 50, expiry: '2024-06-20' } // Expired
            ] 
        }
    ];

    // --- Element Selections ---
    const productTableBody = document.getElementById('product-table-body');
    const batchModalEl = document.getElementById('batchModal');
    const batchModal = batchModalEl ? new bootstrap.Modal(batchModalEl) : null;
    const batchProductName = document.getElementById('batchProductName');
    const batchTableBody = document.getElementById('batch-table-body');

    // --- Product Page Logic ---
    const renderProducts = () => {
        if (!productTableBody) return;
        productTableBody.innerHTML = '';
        products.forEach(p => {
            const totalStock = p.batches.reduce((sum, batch) => sum + batch.stock, 0);
            const row = `
                <tr>
                    <td><strong>${p.name}</strong></td>
                    <td>${p.sku}</td>
                    <td>${p.category}</td>
                    <td>${totalStock}</td>
                    <td>৳${p.price}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-info btn-view-batches" data-id="${p.id}" title="ব্যাচ দেখুন"><i class="fas fa-boxes"></i></button>
                        <button class="btn btn-sm btn-outline-primary btn-edit-product" data-id="${p.id}" title="এডিট"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-outline-danger btn-delete-product" data-id="${p.id}" title="ডিলিট"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
            productTableBody.insertAdjacentHTML('beforeend', row);
        });
    };

    const renderBatchDetails = (productId) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        batchProductName.textContent = product.name;
        batchTableBody.innerHTML = '';

        if (product.batches.length === 0) {
            batchTableBody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">এই পণ্যের জন্য কোনো ব্যাচের তথ্য নেই।</td></tr>';
            return;
        }

        product.batches.forEach(batch => {
            const expiryDate = batch.expiry ? new Date(batch.expiry).toLocaleDateString('bn-BD') : 'N/A';
            const row = `
                <tr>
                    <td>${batch.batchNo}</td>
                    <td>${batch.stock}</td>
                    <td>${expiryDate}</td>
                </tr>
            `;
            batchTableBody.insertAdjacentHTML('beforeend', row);
        });
    };

    if (productTableBody) {
        productTableBody.addEventListener('click', (e) => {
            const viewBatchesBtn = e.target.closest('.btn-view-batches');
            if (viewBatchesBtn) {
                const id = parseInt(viewBatchesBtn.dataset.id);
                renderBatchDetails(id);
                if(batchModal) batchModal.show();
            }
        });
    }

    // --- Reorder Level Page Logic ---
    const reorderTableBody = document.getElementById('reorder-table-body');
    const renderReorderList = () => {
        if (!reorderTableBody) return;
        const lowStockProducts = products.filter(p => {
            const totalStock = p.batches.reduce((sum, batch) => sum + batch.stock, 0);
            return totalStock <= p.reorderLevel;
        });
        // ... (rest of the reorder logic)
    };

    // --- Expired Products Report Logic ---
    const expiredProductsTableBody = document.getElementById('expired-products-table-body');
    const renderExpiredProductsReport = () => {
        if (!expiredProductsTableBody) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Compare with the start of today

        const expiredBatches = [];
        products.forEach(product => {
            product.batches.forEach(batch => {
                if (batch.expiry) {
                    const expiryDate = new Date(batch.expiry);
                    if (expiryDate < today) {
                        expiredBatches.push({ ...product, ...batch });
                    }
                }
            });
        });

        expiredProductsTableBody.innerHTML = '';
        if (expiredBatches.length === 0) {
            expiredProductsTableBody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">কোনো মেয়াদোত্তীর্ণ পণ্য নেই।</td></tr>';
            return;
        }

        expiredBatches.forEach(item => {
            const totalCost = item.stock * (item.cost || 0);
            const row = `
                <tr>
                    <td><strong>${item.name}</strong></td>
                    <td>${item.batchNo}</td>
                    <td><span class="badge bg-danger">${new Date(item.expiry).toLocaleDateString('bn-BD')}</span></td>
                    <td>${item.stock}</td>
                    <td>৳${totalCost.toLocaleString('bn-BD')}</td>
                </tr>
            `;
            expiredProductsTableBody.insertAdjacentHTML('beforeend', row);
        });
    };

    // --- Initial Render ---
    renderProducts();
    renderReorderList();
    renderExpiredProductsReport();
});
