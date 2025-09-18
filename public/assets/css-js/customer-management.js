document.addEventListener('DOMContentLoaded', () => {
    // --- Mock Data ---
    let offers = [
        { id: 1, name: 'ঈদ অফার', type: 'percentage', value: 10, status: 'Active' },
        { id: 2, name: 'বৈশাখী ছাড়', type: 'fixed', value: 100, status: 'Expired' },
    ];
    let customers = [
        { id: 1, name: 'রহিম শেখ', phone: '01712345678', email: 'rahim@example.com', address: 'ঢাকা', totalPurchase: 15200, loyaltyPoints: 152 },
        { id: 2, name: 'করিম চৌধুরী', phone: '01812345678', email: 'karim@example.com', address: 'চট্টগ্রাম', totalPurchase: 8500, loyaltyPoints: 85 },
    ];
    const purchaseHistory = [
        { customerId: 1, date: '২০/০৭/২০২৪', invoice: 'INV-001', amount: 5200 },
        { customerId: 1, date: '১৫/০৭/২০২৪', invoice: 'INV-002', amount: 10000 },
        { customerId: 2, date: '১৮/০৭/২০২৪', invoice: 'INV-003', amount: 8500 },
    ];
    const invoiceDetails = {
        "INV-001": { items: [{ name: 'Apex লেদার শু', qty: 1, price: 2500 }, { name: 'Polo শার্ট', qty: 1, price: 2700 }] },
        "INV-002": { items: [{ name: 'Bata স্যান্ডেল', qty: 2, price: 1200 }, { name: 'শার্ট', qty: 3, price: 2533.33 }] },
        "INV-003": { items: [{ name: 'টি-শার্ট', qty: 5, price: 1700 }] },
    };

    // --- Offers Page Logic ---
    const offerTableBody = document.getElementById('offer-table-body');
    const renderOffers = () => {
        if (!offerTableBody) return;
        offerTableBody.innerHTML = '';
        offers.forEach(offer => {
            const row = `
                <tr>
                    <td>${offer.name}</td>
                    <td>${offer.type === 'percentage' ? 'পার্সেন্টেজ' : 'ফিক্সড'}</td>
                    <td>${offer.type === 'percentage' ? offer.value + '%' : '৳' + offer.value}</td>
                    <td><span class="badge ${offer.status === 'Active' ? 'bg-success' : 'bg-danger'}">${offer.status}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-outline-danger"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
            offerTableBody.insertAdjacentHTML('beforeend', row);
        });
    };

    // --- Loyalty Page Logic ---
    const loyaltyTableBody = document.getElementById('loyalty-table-body');
    const renderLoyaltyData = () => {
        if (!loyaltyTableBody) return;
        loyaltyTableBody.innerHTML = '';
        customers.forEach(customer => {
            const row = `
                <tr>
                    <td>${customer.name}</td>
                    <td>${customer.phone}</td>
                    <td>${customer.loyaltyPoints}</td>
                </tr>
            `;
            loyaltyTableBody.insertAdjacentHTML('beforeend', row);
        });
    };

    // --- Customers Page Logic ---
    const customerTableBody = document.getElementById('customer-table-body');
    const customerModalEl = document.getElementById('customerModal');
    const customerForm = document.getElementById('customerForm');
    
    if (customerModalEl) {
        const customerModal = new bootstrap.Modal(customerModalEl);
        const addCustomerBtn = document.getElementById('addCustomerBtn');

        const renderCustomers = () => {
            if (!customerTableBody) return;
            customerTableBody.innerHTML = '';
            customers.forEach(customer => {
                const row = `
                    <tr>
                        <td><strong>${customer.name}</strong></td>
                        <td>${customer.phone}</td>
                        <td>৳${customer.totalPurchase.toLocaleString('bn-BD')}</td>
                        <td>
                            <a href="customer-profile.html?id=${customer.id}" class="btn btn-sm btn-outline-primary"><i class="fas fa-user-alt me-1"></i>প্রোফাইল</a>
                            <button class="btn btn-sm btn-outline-secondary btn-edit-customer" data-id="${customer.id}"><i class="fas fa-edit"></i></button>
                        </td>
                    </tr>
                `;
                customerTableBody.insertAdjacentHTML('beforeend', row);
            });
        };

        const resetCustomerForm = () => {
            customerForm.reset();
            document.getElementById('customerId').value = '';
            document.getElementById('customerModalLabel').textContent = 'নতুন গ্রাহক';
        };

        addCustomerBtn.addEventListener('click', resetCustomerForm);

        customerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('customerId').value;
            const customerData = {
                name: document.getElementById('customerName').value,
                phone: document.getElementById('customerPhone').value,
                email: document.getElementById('customerEmail').value,
                address: document.getElementById('customerAddress').value,
            };
            if (id) {
                const existing = customers.find(c => c.id === parseInt(id));
                customers = customers.map(c => c.id === parseInt(id) ? { ...existing, ...customerData } : c);
            } else {
                customers.push({ id: Date.now(), ...customerData, totalPurchase: 0, loyaltyPoints: 0 });
            }
            renderCustomers();
            customerModal.hide();
        });

        customerTableBody.addEventListener('click', (e) => {
            const editBtn = e.target.closest('.btn-edit-customer');
            if (editBtn) {
                const id = parseInt(editBtn.dataset.id);
                const customer = customers.find(c => c.id === id);
                document.getElementById('customerModalLabel').textContent = 'গ্রাহকের তথ্য এডিট করুন';
                document.getElementById('customerId').value = customer.id;
                document.getElementById('customerName').value = customer.name;
                document.getElementById('customerPhone').value = customer.phone;
                document.getElementById('customerEmail').value = customer.email;
                document.getElementById('customerAddress').value = customer.address;
                customerModal.show();
            }
        });
        
        renderCustomers();
    }
    
    // --- Customer Profile Page Logic ---
    const populateInvoiceModal = (invoiceId, customer) => {
        const invoiceModalContent = document.getElementById('invoice-modal-content');
        const invoiceModalLabel = document.getElementById('invoiceViewModalLabel');
        if (!invoiceModalContent || !invoiceModalLabel) return;

        const invoiceData = purchaseHistory.find(inv => inv.invoice === invoiceId);
        const details = invoiceDetails[invoiceId];
        if (!invoiceData || !details) return;

        invoiceModalLabel.textContent = `ইনভয়েস বিবরণ: ${invoiceId}`;
        
        let subtotal = 0;
        let itemsHTML = details.items.map((item, index) => {
            const total = item.qty * item.price;
            subtotal += total;
            return `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.name}</td>
                    <td class="text-center">${item.qty}</td>
                    <td class="text-end">৳${item.price.toLocaleString('bn-BD')}</td>
                    <td class="text-end">৳${total.toLocaleString('bn-BD')}</td>
                </tr>
            `;
        }).join('');
        
        const vat = subtotal * 0.05;
        const grandTotal = subtotal + vat;

        invoiceModalContent.innerHTML = `
            <div class="row mb-4">
                <div class="col-6">
                    <h5>বিল টু:</h5>
                    <p class="mb-1"><strong>নাম:</strong> ${customer.name}</p>
                    <p class="mb-1"><strong>ফোন:</strong> ${customer.phone}</p>
                </div>
                <div class="col-6 text-end">
                    <p class="mb-1"><strong>ইনভয়েস নং:</strong> ${invoiceData.invoice}</p>
                    <p class="mb-1"><strong>তারিখ:</strong> ${invoiceData.date}</p>
                </div>
            </div>
            <div class="table-responsive">
                <table class="table table-bordered">
                    <thead class="table-light">
                        <tr><th>#</th><th>পণ্য</th><th class="text-center">পরিমাণ</th><th class="text-end">মূল্য</th><th class="text-end">মোট</th></tr>
                    </thead>
                    <tbody>${itemsHTML}</tbody>
                </table>
            </div>
            <div class="row justify-content-end">
                <div class="col-md-5">
                    <table class="table table-sm">
                        <tbody>
                            <tr><td>সাব-টোটাল</td><td class="text-end fw-bold">৳${subtotal.toLocaleString('bn-BD')}</td></tr>
                            <tr><td>ভ্যাট (৫%)</td><td class="text-end fw-bold">৳${vat.toLocaleString('bn-BD')}</td></tr>
                            <tr class="border-top"><td class="fw-bolder fs-5">সর্বমোট</td><td class="text-end fw-bolder fs-5 accent-text">৳${grandTotal.toLocaleString('bn-BD')}</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    };

    const renderCustomerProfile = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const customerId = parseInt(urlParams.get('id'));
        if (!customerId) return;

        const customer = customers.find(c => c.id === customerId);
        if (!customer) {
            const contentWrapper = document.getElementById('page-content-wrapper');
            if(contentWrapper) contentWrapper.innerHTML = '<div class="container-fluid px-4"><h1>গ্রাহক পাওয়া যায়নি।</h1></div>';
            return;
        }

        document.getElementById('profile-customer-name').textContent = customer.name;
        document.getElementById('profile-customer-phone').textContent = customer.phone;
        document.getElementById('profile-customer-email').textContent = customer.email;
        document.getElementById('profile-total-purchase').textContent = `৳${customer.totalPurchase.toLocaleString('bn-BD')}`;
        document.getElementById('profile-loyalty-points').textContent = customer.loyaltyPoints;

        const historyTableBody = document.getElementById('purchase-history-table-body');
        const history = purchaseHistory.filter(h => h.customerId === customerId);
        if(historyTableBody) {
            historyTableBody.innerHTML = '';
            history.forEach(item => {
                const row = `
                    <tr>
                        <td>${item.date}</td>
                        <td>${item.invoice}</td>
                        <td>৳${item.amount.toLocaleString('bn-BD')}</td>
                        <td>
                            <button class="btn btn-sm btn-outline-primary btn-view-invoice" data-bs-toggle="modal" data-bs-target="#invoiceViewModal" data-invoice-id="${item.invoice}" title="ইনভয়েস দেখুন">
                                <i class="fas fa-eye"></i>
                            </button>
                            <a href="invoice-view.html?id=${item.invoice}" class="btn btn-sm btn-outline-secondary" title="নতুন পেইজে দেখুন">
                                <i class="fas fa-external-link-alt"></i>
                            </a>
                        </td>
                    </tr>
                `;
                historyTableBody.insertAdjacentHTML('beforeend', row);
            });

            historyTableBody.addEventListener('click', (e) => {
                const viewBtn = e.target.closest('.btn-view-invoice');
                if (viewBtn) {
                    populateInvoiceModal(viewBtn.dataset.invoiceId, customer);
                }
            });
        }
    };

    // --- Initial Render ---
    renderOffers();
    renderLoyaltyData();
    renderCustomerProfile();
});
