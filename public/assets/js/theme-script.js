document.addEventListener("DOMContentLoaded", function() {
    /**
     * Sidebar Toggle Logic
     * This handles the opening and closing of the sidebar menu.
     */
    const menuToggleButton = document.getElementById("menu-toggle");
    if (menuToggleButton) {
        menuToggleButton.addEventListener("click", function() {
            const wrapper = document.getElementById("wrapper");
            if (wrapper) {
                wrapper.classList.toggle("toggled");
            }
        });
    }

    /**
     * Active Sidebar Menu Logic
     * This automatically highlights the current page in the sidebar menu
     * and opens its parent submenu if it exists.
     */
    const currentPath = window.location.pathname.split("/").pop();
    if (currentPath) {
        const allLinks = document.querySelectorAll('.sidebar-container .list-group-item');
        
        allLinks.forEach(link => {
            if (link.href.includes(currentPath) && link.getAttribute('data-bs-toggle') !== 'collapse') {
                // This is the active item
                link.classList.add('active');
                
                // Find the parent collapse element and show it
                const parentCollapse = link.closest('.collapse');
                if (parentCollapse) {
                    parentCollapse.classList.add('show');
                    
                    // Find the parent menu trigger and mark it as active
                    const parentTrigger = document.querySelector(`[data-bs-target="#${parentCollapse.id}"]`);
                    if(parentTrigger) {
                        parentTrigger.setAttribute('aria-expanded', 'true');
                        parentTrigger.classList.add('parent-active'); // A class to style the parent
                    }
                }
            }
        });
    }
    /**
     * User Profile Page Edit/Save Logic
     * This handles the form editing functionality on the user profile page.
     */
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        const editProfileBtn = document.getElementById('editProfileBtn');
        const saveProfileBtn = document.getElementById('saveProfileBtn');

        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', () => {
                const inputs = profileForm.querySelectorAll('input, textarea');
                inputs.forEach(input => input.disabled = false);
                editProfileBtn.classList.add('d-none');
                saveProfileBtn.classList.remove('d-none');
            });
        }

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


