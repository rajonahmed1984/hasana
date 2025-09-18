document.addEventListener('DOMContentLoaded', () => {
    // --- Mock Data ---
    let products = [
        { id: 1, name: 'কোকাকোলা ১ লিটার', sku: 'BEV-001', category: 'বেভারেজ', stock: 50, price: 80, status: 'In Stock' },
        { id: 2, name: 'ফ্রেশ আটা', sku: 'GRO-001', category: 'গ্রোসারি', stock: 0, price: 60, status: 'Out of Stock' },
    ];
    let categories = [{ id: 1, name: 'গ্রোসারি' }, { id: 2, name: 'বেভারেজ' }];
    let brands = [{ id: 1, name: 'ইউনিলিভার' }, { id: 2, name: 'কোকাকোলা' }];
    let units = [{ id: 1, name: 'পিস' }, { id: 2, name: 'কেজি' }];
    let attributes = [{ id: 1, name: 'রঙ' }, { id: 2, name: 'সাইজ' }];
    let countries = [{ id: 1, name: 'বাংলাদেশ' }, { id: 2, name: 'ভারত' }];
    let suppliers = [
        { id: 1, name: 'রহিম ট্রেডার্স', person: 'মোঃ রহিম', phone: '01712345678', purchase: 120000, return: 2000, paid: 100000, advance: 5000 },
        { id: 2, name: 'করিম এন্টারপ্রাইজ', person: 'করিম শেখ', phone: '01812345678', purchase: 75000, return: 0, paid: 75000, advance: 0 },
        { id: 3, name: 'যমুনা গ্রুপ', person: 'আরিফ হোসেন', phone: '01912345678', purchase: 1500000, return: 50000, paid: 1250000, advance: 0 },
        { id: 4, name: 'স্কয়ার টয়লেট্রিজ', person: 'সুমন চৌধুরী', phone: '01612345678', purchase: 550000, return: 15000, paid: 500000, advance: 25000 },
        { id: 5, name: 'মেঘনা গ্রুপ', person: 'ইমরান খান', phone: '01512345678', purchase: 250000, return: 0, paid: 250000, advance: 0 }
    ];

    // --- General CRUD Logic for single-field forms ---
    // ... (This function remains the same as before)

    // --- Product Page Logic (Existing) ---
    // ... (Your existing product logic remains here) ...

    // --- Supplier Page Logic ---
    const supplierTableBody = document.getElementById('supplier-table-body');
    const supplierModalEl = document.getElementById('supplierModal');
    const supplierForm = document.getElementById('supplierForm');

    if (supplierModalEl) {
        const supplierModal = new bootstrap.Modal(supplierModalEl);
        const addSupplierBtn = document.getElementById('addSupplierBtn');

        const renderSuppliers = () => {
            if (!supplierTableBody) return;
            supplierTableBody.innerHTML = '';
            suppliers.forEach(s => {
                const due = (s.purchase - s.return) - (s.paid - s.advance);
                const row = `
                    <tr>
                        <td>
                            <strong>${s.name}</strong>
                            <small class="d-block text-muted">${s.person || ''}</small>
                        </td>
                        <td>${s.phone}</td>
                        <td>৳${s.purchase.toLocaleString('bn-BD')}</td>
                        <td>৳${s.return.toLocaleString('bn-BD')}</td>
                        <td>৳${s.paid.toLocaleString('bn-BD')}</td>
                        <td>৳${s.advance.toLocaleString('bn-BD')}</td>
                        <td><span class="${due > 0 ? 'text-danger' : 'text-success'} fw-bold">৳${due.toLocaleString('bn-BD')}</span></td>
                        <td>
                            <button class="btn btn-sm btn-outline-primary btn-edit-supplier" data-id="${s.id}"><i class="fas fa-edit"></i></button>
                            <button class="btn btn-sm btn-outline-danger btn-delete-supplier" data-id="${s.id}"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;
                supplierTableBody.insertAdjacentHTML('beforeend', row);
            });
        };

        const resetSupplierForm = () => {
            supplierForm.reset();
            document.getElementById('supplierId').value = '';
            document.getElementById('supplierModalLabel').textContent = 'নতুন সাপ্লায়ার';
        };

        addSupplierBtn.addEventListener('click', () => {
            resetSupplierForm();
        });

        supplierForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('supplierId').value;
            const supplierData = {
                name: document.getElementById('supplierName').value,
                person: document.getElementById('contactPerson').value,
                email: document.getElementById('supplierEmail').value,
                phone: document.getElementById('supplierPhone').value,
                address: document.getElementById('supplierAddress').value,
            };

            if (id) { // Editing
                const existingSupplier = suppliers.find(s => s.id === parseInt(id));
                suppliers = suppliers.map(s => s.id === parseInt(id) ? { ...existingSupplier, ...supplierData } : s);
            } else { // Adding
                const newSupplier = {
                    id: Date.now(),
                    ...supplierData,
                    purchase: 0, return: 0, paid: 0, advance: 0 // Default values for new supplier
                };
                suppliers.push(newSupplier);
            }
            renderSuppliers();
            supplierModal.hide();
        });

        supplierTableBody.addEventListener('click', (e) => {
            const target = e.target.closest('button');
            if (!target) return;
            const id = parseInt(target.dataset.id);

            if (target.matches('.btn-edit-supplier')) {
                const supplier = suppliers.find(s => s.id === id);
                document.getElementById('supplierModalLabel').textContent = 'সাপ্লায়ার এডিট করুন';
                document.getElementById('supplierId').value = supplier.id;
                document.getElementById('supplierName').value = supplier.name;
                document.getElementById('contactPerson').value = supplier.person;
                document.getElementById('supplierEmail').value = supplier.email;
                document.getElementById('supplierPhone').value = supplier.phone;
                document.getElementById('supplierAddress').value = supplier.address;
                supplierModal.show();
            } else if (target.matches('.btn-delete-supplier')) {
                if (confirm('আপনি কি এই সাপ্লায়ারকে মুছে ফেলতে নিশ্চিত?')) {
                    suppliers = suppliers.filter(s => s.id !== id);
                    renderSuppliers();
                }
            }
        });
        
        // Initial Render
        renderSuppliers();
    }
    
    // --- Initialize CRUD for other entities ---
    // ... (Your other CRUD initializations) ...
});
