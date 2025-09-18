import '../frontend/assets/js/script.js';
import "../frontend/assets/css/style.css";

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const offcanvasMenu = document.getElementById('offcanvas-menu');
    const offcanvasOverlay = document.getElementById('offcanvas-overlay');

    const toggleMenu = (show = true) => {
        if (!offcanvasMenu || !offcanvasOverlay) {
            return;
        }
        offcanvasMenu.classList.toggle('active', show);
        offcanvasOverlay.classList.toggle('active', show);
        document.body.classList.toggle('overflow-hidden', show);
    };

    if (menuToggle) {
        menuToggle.addEventListener('click', () => toggleMenu(true));
    }
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', () => toggleMenu(false));
    }
    if (offcanvasOverlay) {
        offcanvasOverlay.addEventListener('click', () => toggleMenu(false));
    }

    const searchInput = document.querySelector('[data-surah-search]');
    const surahItems = document.querySelectorAll('[data-surah-item]');

    if (searchInput && surahItems.length) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase();
            surahItems.forEach((item) => {
                const haystack = (item.dataset.search || '').toLowerCase();
                item.classList.toggle('hidden', query.length && !haystack.includes(query));
            });
        });
    }
});
