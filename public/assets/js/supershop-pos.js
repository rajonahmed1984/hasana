document.addEventListener('DOMContentLoaded', () => {
    // --- Mock Data ---
    const allProducts = [
        { id: 1, name: 'Apex লেদার শু', price: 2500, category: 'shoes', img: 'https://placehold.co/150x100/2A3A8D/FFFFFF?text=Shoe' },
        { id: 2, name: 'Bata স্যান্ডেল', price: 1200, category: 'shoes', img: 'https://placehold.co/150x100/F47C20/FFFFFF?text=Sandal' },
        { id: 3, name: 'Polo শার্ট', price: 1800, category: 'clothing', img: 'https://placehold.co/150x100/198754/FFFFFF?text=Shirt' }
    ];
    const outletInventory = [
        { productId: 1, outlet: 'ধানমন্ডি আউটলেট', variants: [{ size: 32, stock: 5 }, { size: 35, stock: 0 }, { size: 38, stock: 12 }] },
        { productId: 1, outlet: 'গুলশান আউটলেট', variants: [{ size: 32, stock: 2 }, { size: 35, stock: 10 }, { size: 38, stock: 3 }] },
        { productId: 2, outlet: 'ধানমন্ডি আউটলেট', variants: [{ size: 'M', stock: 15 }, { size: 'L', stock: 4 }] },
    ];

    // --- Element Selections ---
    const productGrid = document.getElementById('product-grid');
    const categoryLinks = document.querySelectorAll('.category-section .list-group-item');
    const productSearchInput = document.getElementById('product-search-input');
    const cartBody = document.getElementById('cart-body');
    const cartTable = document.getElementById('cart-table');
    const cartEmptyMsg = document.getElementById('cart-empty');
    const subtotalEl = document.getElementById('subtotal');
    const vatEl = document.getElementById('vat');
    const grandTotalEl = document.getElementById('grand-total');
    const discountInput = document.getElementById('discount-input');
    const paymentBtn = document.getElementById('payment-btn');
    const cancelSaleBtn = document.getElementById('cancel-sale-btn');
    const holdBillBtn = document.getElementById('hold-bill-btn');
    const recallModalEl = document.getElementById('recallModal');
    const recallModal = new bootstrap.Modal(recallModalEl);
    const heldBillsList = document.getElementById('held-bills-list');
    const stockCheckModalEl = document.getElementById('stockCheckModal');
    const stockCheckModal = new bootstrap.Modal(stockCheckModalEl);
    const stockCheckModalBody = document.getElementById('stock-check-modal-body');
    const stockCheckModalLabel = document.getElementById('stockCheckModalLabel');
    const paymentModalEl = document.getElementById('paymentModal');
    const paymentModal = new bootstrap.Modal(paymentModalEl);
    const paymentOptionsContainer = paymentModalEl.querySelector('.payment-options');
    const paymentDetailsContainer = document.getElementById('payment-details-container');
    const confirmPaymentBtn = document.getElementById('confirm-payment-btn');
    const printModalEl = document.getElementById('printReceiptModal');
    const printModal = new bootstrap.Modal(printModalEl);
    const receiptContent = document.getElementById('receipt-content');
    const printBtn = document.getElementById('print-btn');

    let cart = [];
    let heldCarts = [];

    // --- Main Functions ---
    const renderProducts = (category = 'all', searchTerm = '') => {
        productGrid.innerHTML = '';
        const filteredProducts = allProducts.filter(p => (category === 'all' || p.category === category) && p.name.toLowerCase().includes(searchTerm.toLowerCase()));
        
        filteredProducts.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-card-body" data-id="${product.id}">
                    <img src="${product.img}" alt="${product.name}">
                    <div class="product-info">
                        <p class="product-name">${product.name}</p>
                        <p class="product-price">৳ ${product.price}</p>
                    </div>
                </div>
                <button class="btn btn-sm btn-outline-secondary stock-check-btn" data-id="${product.id}"><i class="fas fa-search-location me-1"></i>স্টক চেক</button>
            `;
            productGrid.appendChild(card);
        });
    };

    const addToCart = (productId) => {
        const product = allProducts.find(p => p.id === productId);
        if (!product) return;
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        renderCart();
    };

    const renderCart = () => {
        cartTable.style.display = cart.length > 0 ? 'table' : 'none';
        cartEmptyMsg.style.display = cart.length > 0 ? 'none' : 'flex';
        paymentBtn.disabled = cart.length === 0;
        cartBody.innerHTML = '';
        cart.forEach(item => {
            const tr = document.createElement('tr');
            tr.className = 'cart-item-row';
            tr.innerHTML = `<td><p class="mb-0 fw-bold small">${item.name}</p><small class="text-muted">৳ ${item.price}</small></td><td><div class="input-group input-group-sm quantity-selector"><button class="btn btn-outline-secondary btn-decrease" data-id="${item.id}">-</button><input type="text" class="form-control text-center px-1" value="${item.quantity}" readonly><button class="btn btn-outline-secondary btn-increase" data-id="${item.id}">+</button></div></td><td class="text-end fw-bold">৳ ${item.price * item.quantity}</td><td><a href="#" class="text-danger btn-remove" data-id="${item.id}"><i class="fas fa-times-circle"></i></a></td>`;
            cartBody.appendChild(tr);
        });
        updateSummary();
    };

    const updateSummary = () => {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const discount = parseFloat(discountInput.value) || 0;
        const discountedTotal = subtotal - discount;
        const vat = discountedTotal > 0 ? discountedTotal * 0.05 : 0;
        const grandTotal = discountedTotal + vat;
        subtotalEl.textContent = `৳ ${subtotal.toFixed(2)}`;
        vatEl.textContent = `৳ ${vat.toFixed(2)}`;
        grandTotalEl.textContent = `৳ ${grandTotal.toFixed(2)}`;
    };

    const handleCartAction = (e) => {
        const target = e.target.closest('button, a');
        if (!target) return;
        e.preventDefault();

        const id = parseInt(target.dataset.id);
        const item = cart.find(i => i.id === id);
        if (!item) return;

        if (target.matches('.btn-increase')) {
            item.quantity++;
        } else if (target.matches('.btn-decrease')) {
            item.quantity--;
            if (item.quantity === 0) {
                cart = cart.filter(i => i.id !== id);
            }
        } else if (target.matches('.btn-remove')) {
            cart = cart.filter(i => i.id !== id);
        }
        renderCart();
    };

    // --- Hold & Recall ---
    const holdBill = () => {
        if (cart.length === 0) return alert("কার্ট খালি আছে।");
        const ref = `হোল্ড-${heldCarts.length + 1} (${new Date().toLocaleTimeString()})`;
        heldCarts.push({ ref, items: [...cart] });
        cart = [];
        renderCart();
        alert(`বিল "${ref}" সফলভাবে হোল্ড করা হয়েছে।`);
    };

    const populateRecallModal = () => {
        heldBillsList.innerHTML = '';
        if (heldCarts.length === 0) {
            heldBillsList.innerHTML = '<p class="text-center text-muted">কোনো হোল্ড করা বিল নেই।</p>';
            return;
        }
        const listGroup = document.createElement('div');
        listGroup.className = 'list-group';
        heldCarts.forEach((heldBill, index) => {
            const totalItems = heldBill.items.reduce((sum, item) => sum + item.quantity, 0);
            const totalAmount = heldBill.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const listItem = document.createElement('div');
            listItem.className = 'list-group-item';
            listItem.innerHTML = `<div class="bill-info">${heldBill.ref}<small>আইটেম: ${totalItems} | মোট: ৳${totalAmount.toFixed(2)}</small></div><div><button class="btn btn-sm btn-success btn-recall" data-index="${index}">রিকল</button><button class="btn btn-sm btn-danger btn-delete-hold" data-index="${index}"><i class="fas fa-trash"></i></button></div>`;
            listGroup.appendChild(listItem);
        });
        heldBillsList.appendChild(listGroup);
    };

    const recallBill = (index) => {
        if (cart.length > 0 && !confirm('বর্তমান কার্টে পণ্য আছে। আপনি কি এটি বাতিল করে হোল্ড করা বিলটি রিকল করতে চান?')) {
            return;
        }
        const recalledBill = heldCarts.splice(index, 1)[0];
        cart = recalledBill.items;
        renderCart();
        recallModal.hide();
    };

    const deleteHeldBill = (index) => {
        if (confirm('আপনি কি এই হোল্ড করা বিলটি মুছে ফেলতে নিশ্চিত?')) {
            heldCarts.splice(index, 1);
            populateRecallModal();
        }
    };
    
    // --- Stock Check ---
    const populateStockCheckModal = (productId) => {
        const product = allProducts.find(p => p.id === productId);
        stockCheckModalLabel.textContent = `${product.name} - স্টক প্রাপ্যতা`;
        const inventory = outletInventory.filter(inv => inv.productId === productId);
        if (inventory.length === 0) {
            stockCheckModalBody.innerHTML = '<p class="text-center text-muted">এই পণ্যের জন্য কোনো আউটলেটের তথ্য পাওয়া যায়নি।</p>';
            return;
        }
        let tableHTML = '<table class="table table-bordered stock-table"><thead><tr><th>আউটলেট</th><th>সাইজ</th><th>স্টক</th></tr></thead><tbody>';
        inventory.forEach(outletInv => {
            outletInv.variants.forEach((variant, index) => {
                tableHTML += `<tr>${index === 0 ? `<td rowspan="${outletInv.variants.length}">${outletInv.outlet}</td>` : ''}<td>${variant.size}</td><td><span class="${variant.stock > 0 ? 'stock-available' : 'stock-unavailable'}">${variant.stock > 0 ? `${variant.stock} পিস` : 'নেই'}</span></td></tr>`;
            });
        });
        tableHTML += '</tbody></table>';
        stockCheckModalBody.innerHTML = tableHTML;
    };

    // --- Payment & Print ---
    const setupPaymentModal = () => {
        const paymentDetailsHTML = {
            cash: `<div class="text-center p-3"><p class="lead mb-1">ক্যাশ পেমেন্ট</p><p class="text-muted small">কাস্টমার থেকে প্রাপ্ত টাকার পরিমাণ নিশ্চিত করুন।</p></div>`,
            card: `<div class="text-center p-3"><p class="lead mb-1">কার্ড পেমেন্ট</p><p class="text-muted small">কার্ড সোয়াইপ বা ট্যাপ করে পেমেন্ট নিন।</p></div>`,
            mobile: `<div class="mobile-gateways d-flex justify-content-center gap-2 mb-3"><img src="https://i.imgur.com/JZR9urt.png" alt="bKash" class="gateway-logo active"><img src="https://i.imgur.com/O5g3a2U.png" alt="Nagad" class="gateway-logo"><img src="https://i.imgur.com/5f22DAA.png" alt="Rocket" class="gateway-logo"></div><div><label class="form-label small">ট্রানজেকশন আইডি</label><input type="text" class="form-control" placeholder="TrxID"></div>`
        };
        
        const updatePaymentDetails = (method) => paymentDetailsContainer.innerHTML = paymentDetailsHTML[method] || '';
        
        paymentOptionsContainer.addEventListener('click', (e) => {
            const target = e.target.closest('.payment-option');
            if (!target) return;
            paymentOptionsContainer.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('active'));
            target.classList.add('active');
            updatePaymentDetails(target.dataset.target);
        });
        updatePaymentDetails('cash'); // Initialize
    };

    const generateReceipt = (paymentMethod) => {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const discount = parseFloat(discountInput.value) || 0;
        const discountedTotal = subtotal - discount;
        const vat = discountedTotal > 0 ? discountedTotal * 0.05 : 0;
        const grandTotal = discountedTotal + vat;
        const salesperson = 'Admin'; 
        const counter = 'Counter 01';

        let itemsHTML = cart.map(item => `<tr><td>${item.name}</td><td class="text-center">${item.quantity}</td><td class="text-end">৳${(item.price * item.quantity).toFixed(2)}</td></tr>`).join('');

        receiptContent.innerHTML = `
            <div class="receipt-header">
                <img src="https://googleusercontent.com/file_content/0" style="width: 100px; margin-bottom: 10px;" alt="Logo">
                <p class="mb-0">হাউস #১২, রোড #৩, ধানমন্ডি, ঢাকা</p>
                <p class="small">তারিখ: ${new Date().toLocaleString('bn-BD')}</p>
            </div>
            <hr class="my-2">
            <div class="receipt-info small">
                <p class="mb-0"><strong>কাউন্টার:</strong> ${counter}</p>
                <p class="mb-0"><strong>বিক্রয় করেছেন:</strong> ${salesperson}</p>
            </div>
            <hr class="my-2">
            <table class="receipt-table">
                <thead><tr><th>পণ্য</th><th class="text-center">পরিমাণ</th><th class="text-end">দাম</th></tr></thead>
                <tbody>${itemsHTML}</tbody>
            </table>
            <div class="receipt-total">
                <p>সাব-টোটাল: <span class="float-end">৳${subtotal.toFixed(2)}</span></p>
                <p>ডিসকাউন্ট: <span class="float-end">৳${discount.toFixed(2)}</span></p>
                <p>ভ্যাট (৫%): <span class="float-end">৳${vat.toFixed(2)}</span></p>
                <p class="fw-bold fs-5 mt-2">মোট: <span class="float-end">৳${grandTotal.toFixed(2)}</span></p>
                <p><strong>পেমেন্ট পদ্ধতি:</strong> <span class="float-end">${paymentMethod}</span></p>
            </div>
            <p class="text-center mt-3 small">ধন্যবাদ!</p>
        `;
    };

    // --- Event Listeners ---
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            categoryLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            renderProducts(link.dataset.category, productSearchInput.value);
        });
    });

    productSearchInput.addEventListener('input', (e) => {
        const activeCategory = document.querySelector('.category-section .list-group-item.active').dataset.category;
        renderProducts(activeCategory, e.target.value);
    });

    productGrid.addEventListener('click', e => {
        const cardBody = e.target.closest('.product-card-body');
        const stockBtn = e.target.closest('.stock-check-btn');
        if (cardBody) addToCart(parseInt(cardBody.dataset.id));
        if (stockBtn) {
            populateStockCheckModal(parseInt(stockBtn.dataset.id));
            stockCheckModal.show();
        }
    });
    
    cartBody.addEventListener('click', handleCartAction);
    discountInput.addEventListener('input', updateSummary);
    cancelSaleBtn.addEventListener('click', () => {
        if (cart.length > 0 && confirm('আপনি কি এই বিক্রয় বাতিল করতে নিশ্চিত?')) {
            cart = [];
            discountInput.value = 0;
            renderCart();
        }
    });

    holdBillBtn.addEventListener('click', holdBill);
    recallModalEl.addEventListener('show.bs.modal', populateRecallModal);
    heldBillsList.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if(!target) return;
        const index = parseInt(target.dataset.index);
        if (target.matches('.btn-recall')) recallBill(index);
        if (target.matches('.btn-delete-hold')) deleteHeldBill(index);
    });

    confirmPaymentBtn.addEventListener('click', () => {
        if (cart.length === 0) return;
        const paymentMethod = paymentOptionsContainer.querySelector('.payment-option.active span').textContent;
        generateReceipt(paymentMethod);
        paymentModal.hide();
        printModal.show();
        cart = [];
        discountInput.value = 0;
        renderCart();
    });

    printBtn.addEventListener('click', () => window.print());

    // --- Initial Load ---
    renderProducts();
    renderCart();
    setupPaymentModal();
});
