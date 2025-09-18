document.addEventListener("DOMContentLoaded", function() {
    // Sidebar Toggle Logic
    var menuToggleButton = document.getElementById("menu-toggle");
    if (menuToggleButton) {
        menuToggleButton.addEventListener("click", function() {
            var wrapper = document.getElementById("wrapper");
            if (wrapper) {
                wrapper.classList.toggle("toggled");
            }
        });
    }

    // --- Sidebar Submenu Logic ---
    const currentPath = window.location.pathname.split("/").pop();
    const submenuLinks = document.querySelectorAll('.list-group .collapse .list-group-item');
    
    submenuLinks.forEach(link => {
        if (link.href.includes(currentPath)) {
            // This is the active sub-item
            link.classList.add('active');
            
            // Find the parent collapse element and show it
            const parentCollapse = link.closest('.collapse');
            if (parentCollapse) {
                parentCollapse.classList.add('show');
                
                // Find the parent menu trigger and mark it as active
                const parentTrigger = document.querySelector(`[data-bs-target="#${parentCollapse.id}"]`);
                if(parentTrigger) {
                    parentTrigger.setAttribute('aria-expanded', 'true');
                    parentTrigger.classList.add('parent-active');
                }
            }
        }
    });

    // --- Chart.js Initialization for Dashboard ---
    const salesCanvas = document.getElementById('salesChart');
    const categoryCanvas = document.getElementById('categoryChart');

    if (salesCanvas) {
        const salesCtx = salesCanvas.getContext('2d');
        new Chart(salesCtx, {
            type: 'bar',
            data: {
                labels: ['শনি', 'রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র'],
                datasets: [{
                    label: 'বিক্রয় (৳)',
                    data: [12500, 19200, 14000, 21500, 18000, 25000, 22300],
                    backgroundColor: 'rgba(42, 58, 141, 0.8)',
                    borderColor: 'rgba(42, 58, 141, 1)',
                    borderWidth: 1,
                    borderRadius: 5,
                    barThickness: 20,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true } },
                plugins: { legend: { display: false } }
            }
        });
    }

    if (categoryCanvas) {
        const categoryCtx = categoryCanvas.getContext('2d');
        new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: ['গ্রোসারি', 'কসমেটিকস', 'বেভারেজ', 'স্ন্যাকস', 'অন্যান্য'],
                datasets: [{
                    data: [300, 150, 100, 80, 50],
                    backgroundColor: ['#2A3A8D', '#F47C20', '#6c757d', '#198754', '#ffc107'],
                    borderColor: '#fff',
                    borderWidth: 2,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } }
            }
        });
    }

    // --- Profile Page Edit/Save Logic ---
    const editProfileBtn = document.getElementById('editProfileBtn');
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    const profileForm = document.getElementById('profileForm');

    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            const inputs = profileForm.querySelectorAll('input, textarea');
            inputs.forEach(input => input.disabled = false);
            editProfileBtn.classList.add('d-none');
            saveProfileBtn.classList.remove('d-none');
        });
    }

    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Add logic to save data via Ajax here
            console.log('Profile data saved!');
            
            const inputs = profileForm.querySelectorAll('input, textarea');
            inputs.forEach(input => input.disabled = true);
            saveProfileBtn.classList.add('d-none');
            editProfileBtn.classList.remove('d-none');
        });
    }
});
