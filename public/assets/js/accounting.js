document.addEventListener('DOMContentLoaded', () => {
    // --- Mock Data ---
    let chartOfAccounts = [
        { id: 1, name: 'ক্যাশ', type: 'সম্পদ (Asset)' },
        { id: 2, name: 'ব্যাংক', type: 'সম্পদ (Asset)' },
        { id: 3, name: 'বিক্রয়', type: 'আয় (Revenue)' },
        { id: 4, name: 'ক্রয়', type: 'ব্যয় (Expense)' },
        { id: 5, name: 'বেতন খরচ', type: 'ব্যয় (Expense)' },
    ];
    const ledgerData = {
        1: [ { date: '2024-07-20', details: 'বিক্রয়', debit: 5200, credit: 0 }, { date: '2024-07-21', details: 'বেতন প্রদান', debit: 0, credit: 3000 } ],
        3: [ { date: '2024-07-20', details: 'ক্যাশ বিক্রয়', debit: 0, credit: 5200 } ],
        5: [ { date: '2024-07-21', details: 'ক্যাশ প্রদান', debit: 3000, credit: 0 } ],
    };

    // --- Page Router ---
    const currentPage = window.location.pathname.split("/").pop();

    // --- Chart of Accounts Page Logic ---
    if (currentPage === 'chart-of-accounts.html') {
        const accountsTableBody = document.getElementById('accounts-table-body');
        const renderAccounts = () => {
            accountsTableBody.innerHTML = '';
            chartOfAccounts.forEach(acc => {
                const row = `<tr><td>${acc.name}</td><td>${acc.type}</td><td><button class="btn btn-sm btn-outline-primary"><i class="fas fa-edit"></i></button></td></tr>`;
                accountsTableBody.insertAdjacentHTML('beforeend', row);
            });
        };
        renderAccounts();
    }

    // --- Ledger Page Logic ---
    if (currentPage === 'ledger.html') {
        const ledgerAccountSelect = document.getElementById('ledgerAccount');
        const ledgerTableBody = document.getElementById('ledger-table-body');
        const filterLedgerBtn = document.getElementById('filterLedgerBtn');
        const ledgerTitle = document.getElementById('ledger-title');

        chartOfAccounts.forEach(acc => {
            ledgerAccountSelect.add(new Option(`${acc.name} (${acc.type})`, acc.id));
        });

        const renderLedger = () => {
            const accountId = parseInt(ledgerAccountSelect.value);
            const account = chartOfAccounts.find(acc => acc.id === accountId);
            const transactions = ledgerData[accountId] || [];
            
            ledgerTitle.textContent = `${account.name} - খতিয়ান`;
            ledgerTableBody.innerHTML = '';
            let balance = 0;

            transactions.forEach(t => {
                balance += t.debit - t.credit;
                const row = `<tr><td>${new Date(t.date).toLocaleDateString('bn-BD')}</td><td>${t.details}</td><td class="text-end">${t.debit > 0 ? `৳${t.debit}` : '-'}</td><td class="text-end">${t.credit > 0 ? `৳${t.credit}` : '-'}</td><td class="text-end fw-bold">৳${balance}</td></tr>`;
                ledgerTableBody.insertAdjacentHTML('beforeend', row);
            });
        };

        filterLedgerBtn.addEventListener('click', renderLedger);
        renderLedger(); // Initial render
    }

    // --- Journal Voucher Page Logic ---
    if (currentPage === 'journal-voucher.html') {
        const journalEntryBody = document.getElementById('journal-entry-body');
        const addRowBtn = document.getElementById('add-journal-row-btn');
        const totalDebitEl = document.getElementById('total-debit');
        const totalCreditEl = document.getElementById('total-credit');
        
        const createJournalRow = () => {
            const tr = document.createElement('tr');
            const accountOptions = chartOfAccounts.map(acc => `<option value="${acc.id}">${acc.name}</option>`).join('');
            tr.innerHTML = `<td><select class="form-select">${accountOptions}</select></td><td><input type="number" class="form-control debit-input" value="0"></td><td><input type="number" class="form-control credit-input" value="0"></td><td><button type="button" class="btn btn-sm btn-danger btn-remove-row"><i class="fas fa-trash"></i></button></td>`;
            journalEntryBody.appendChild(tr);
        };

        const updateTotals = () => {
            let totalDebit = 0, totalCredit = 0;
            journalEntryBody.querySelectorAll('.debit-input').forEach(input => totalDebit += parseFloat(input.value) || 0);
            journalEntryBody.querySelectorAll('.credit-input').forEach(input => totalCredit += parseFloat(input.value) || 0);
            totalDebitEl.value = `৳${totalDebit.toFixed(2)}`;
            totalCreditEl.value = `৳${totalCredit.toFixed(2)}`;
            if (totalDebit !== totalCredit) {
                totalDebitEl.classList.add('is-invalid');
                totalCreditEl.classList.add('is-invalid');
            } else {
                totalDebitEl.classList.remove('is-invalid');
                totalCreditEl.classList.remove('is-invalid');
            }
        };

        addRowBtn.addEventListener('click', createJournalRow);
        journalEntryBody.addEventListener('input', updateTotals);
        journalEntryBody.addEventListener('click', (e) => {
            if (e.target.closest('.btn-remove-row')) {
                e.target.closest('tr').remove();
                updateTotals();
            }
        });

        createJournalRow();
        createJournalRow();
    }

    // --- Trial Balance Page Logic ---
    if (currentPage === 'trial-balance.html') {
        const trialBalanceTableBody = document.getElementById('trial-balance-table-body');
        const renderTrialBalance = () => {
            let totalDebitBalance = 0, totalCreditBalance = 0;
            trialBalanceTableBody.innerHTML = '';
            chartOfAccounts.forEach(account => {
                const transactions = ledgerData[account.id] || [];
                const balance = transactions.reduce((bal, t) => bal + t.debit - t.credit, 0);
                let debitAmount = '', creditAmount = '';
                if (balance > 0) {
                    debitAmount = `৳${balance.toLocaleString('bn-BD')}`;
                    totalDebitBalance += balance;
                } else if (balance < 0) {
                    creditAmount = `৳${(balance * -1).toLocaleString('bn-BD')}`;
                    totalCreditBalance += (balance * -1);
                }
                if (balance !== 0) {
                    trialBalanceTableBody.insertAdjacentHTML('beforeend', `<tr><td>${account.name}</td><td class="text-end">${debitAmount}</td><td class="text-end">${creditAmount}</td></tr>`);
                }
            });
            document.getElementById('total-debit-balance').textContent = `৳${totalDebitBalance.toLocaleString('bn-BD')}`;
            document.getElementById('total-credit-balance').textContent = `৳${totalCreditBalance.toLocaleString('bn-BD')}`;
        };
        renderTrialBalance();
    }
});
