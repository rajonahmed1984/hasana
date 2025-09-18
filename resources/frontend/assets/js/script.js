// This function runs when the page content has fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    applyTheme();
    applyFontSettings();

    // --- General Element Selectors ---
    const menuToggle = document.getElementById('menu-toggle');
    const offcanvasMenu = document.getElementById('offcanvas-menu');
    const offcanvasOverlay = document.getElementById('offcanvas-overlay');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const closeMenuButton = document.getElementById('close-menu-btn');
    const searchToggle = document.getElementById('search-toggle');
    const searchContainer = document.getElementById('header-search-container');
    const surahListContainer = document.querySelector('.surah-list');
    const ayahContainer = document.getElementById('ayah-container');
    const bookmarkListContainer = document.getElementById('bookmark-list');
    const shareModal = document.getElementById('share-modal');
    const hadisListContainer = document.getElementById('hadis-list');

    // --- Off-canvas menu functionality ---
    if (menuToggle && offcanvasMenu && offcanvasOverlay) {
        menuToggle.addEventListener('click', () => {
            offcanvasMenu.classList.add('active');
            offcanvasOverlay.classList.add('active');
        });
        const closeMenu = () => {
            offcanvasMenu.classList.remove('active');
            offcanvasOverlay.classList.remove('active');
        };
        offcanvasOverlay.addEventListener('click', closeMenu);
        if(closeMenuButton) closeMenuButton.addEventListener('click', closeMenu);
    }
    
    // --- Dark mode toggle functionality ---
    if (darkModeToggle) {
        darkModeToggle.checked = document.body.classList.contains('dark-mode');
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
        });
    }

    // --- Header Search Toggle Logic (Works on any page with the search icon) ---
    if (searchToggle && searchContainer) {
        searchToggle.addEventListener('click', () => {
            searchContainer.classList.toggle('active');
            document.body.classList.toggle('search-active');
            if (searchContainer.classList.contains('active')) {
                document.getElementById('search-surah').focus();
            }
        });
    }

    // --- Home Page Logic ---
    if (surahListContainer) {
        renderSurahList(allSurahs);
        
        const searchInput = document.getElementById('search-surah');
        if(searchInput) {
            searchInput.addEventListener('input', (event) => {
                const searchTerm = event.target.value.toLowerCase();
                const filteredSurahs = allSurahs.filter(surah => 
                    surah.name.toLowerCase().includes(searchTerm) ||
                    surah.meaning.toLowerCase().includes(searchTerm) ||
                    surah.englishName.toLowerCase().includes(searchTerm)
                );
                renderSurahList(filteredSurahs);
            });
        }
    }
    
    // --- Home Page - Verse of the Day Logic ---
    const verseTextElem = document.getElementById('verse-text');
    if (verseTextElem) {
        const verseOfTheDayData = [
            { text: "এবং অবশ্যই আমি মানুষকে সৃষ্টি করেছি এবং তার প্রবৃত্তি তাকে যে কুমন্ত্রণা দেয়, তা আমি জানি।", ref: "(সূরা ক্বাফ, ৫০:১৬)" },
            { text: "অতএব, তোমরা আমাকেই স্মরণ করো, (তাহলে) আমিও তোমাদের স্মরণ করবো।", ref: "(সূরা আল-বাকারা, ২:১৫২)" },
            { text: "তিনিই সেই মহান সত্তা, যিনি এ পৃথিবীর সব কিছু তোমাদের (ব্যবহারের) জন্যে তৈরী করেছেন।", ref: "(সূরা আল-বাকারা, ২:২৯)" },
            { text: "তোমরা যদি আল্লাহর নেয়ামত গণনা করো, তবে তার সংখ্যা নিরূপণ করতে পারবে না।", ref: "(সূরা ইবরাহীম, ১৪:৩৪)" }
        ];
        const randomIndex = Math.floor(Math.random() * verseOfTheDayData.length);
        const randomVerse = verseOfTheDayData[randomIndex];
        document.getElementById('verse-text').textContent = `"${randomVerse.text}"`;
        document.getElementById('verse-reference').textContent = randomVerse.ref;
    }

    // --- Ayah Actions & Surah Page Logic ---
    if (ayahContainer) {
        const params = new URLSearchParams(window.location.search);
        const surahId = params.get('id');

        if (surahId) {
            const surahData = allSurahs.find(s => s.id == surahId);
            if (surahData) {
                document.title = `সূরা ${surahData.name} - Hasana`;
                document.getElementById('header-title').textContent = `সূরা ${surahData.name}`;

                const infoCard = document.getElementById('surah-info-card');
                infoCard.innerHTML = `
                    <h2>সূরা ${surahData.name}</h2>
                    <p>"${surahData.meaning}"</p>
                    <div class="surah-info-divider"></div>
                    <p class="surah-info-meta">${surahData.type} ● ${surahData.details.split(' ').pop()} আয়াত ● অবতীর্ণের ক্রম: ${surahData.revelationOrder}</p>
                    <p class="surah-info-details">${surahData.description}</p>
                `;
                
                // Load the specific translation file and then render
                loadTranslationAndRender(surahId);
            }
        }

        ayahContainer.addEventListener('click', function(e) {
            const target = e.target;
            if (target.classList.contains('play-btn')) {
                showToast("অডিও ফিচার শীঘ্রই আসছে!");
            }
            if (target.classList.contains('bookmark-btn')) {
                toggleBookmark(target.dataset.ayah, target);
            }
            if (target.classList.contains('share-btn')) {
                const ayahCard = target.closest('.ayah-card');
                const ayahTranslation = ayahCard.querySelector('.ayah-translation').textContent;
                const ayahNumber = ayahCard.querySelector('.ayah-number').textContent;
                const surahName = document.getElementById('header-title').textContent.replace('সূরা ', '');
                const text = encodeURIComponent(ayahTranslation);
                const ref = encodeURIComponent(`${surahName}, ${ayahNumber}`);
                window.location.href = `share.html?text=${text}&ref=${ref}`;
            }
        });
    }

    // --- Share Modal Logic ---
    if (shareModal) {
        const closeModalBtn = document.getElementById('close-modal-btn');
        const copyTextBtn = document.getElementById('copy-text-btn');
        const closeModal = () => shareModal.classList.remove('active');
        closeModalBtn.addEventListener('click', closeModal);
        shareModal.addEventListener('click', (e) => {
            if (e.target === shareModal) closeModal();
        });
        copyTextBtn.addEventListener('click', () => {
            copyToClipboard(document.getElementById('share-text').value);
            showToast("ক্লিপবোর্ডে কপি করা হয়েছে!");
            closeModal();
        });
    }

    // --- Bookmarks Page Logic ---
    if (bookmarkListContainer) {
        renderBookmarks();
        bookmarkListContainer.addEventListener('click', function(e){
            if(e.target.classList.contains('remove-bookmark-btn')){
                const ayahId = e.target.dataset.ayah;
                let bookmarks = JSON.parse(localStorage.getItem('hasana_bookmarks')) || [];
                const index = bookmarks.indexOf(ayahId);
                if (index > -1) {
                    bookmarks.splice(index, 1);
                    localStorage.setItem('hasana_bookmarks', JSON.stringify(bookmarks));
                    showToast(`বুকমার্ক (${ayahId}) মুছে ফেলা হয়েছে।`);
                    renderBookmarks();
                }
            }
        });
    }

    // --- Hadis Page Logic ---    
    if (hadisListContainer) {
        const tabButtons = document.querySelectorAll('.tab-btn');

        // Initially load Bukhari hadiths
        renderHadisList('bukhari');

        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                tabButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to the clicked button
                this.classList.add('active');
                
                const collectionName = this.dataset.collection;
                renderHadisList(collectionName);
            });
        });
    }

});

/**
 * Dynamically loads a translation script and then renders the ayahs.
 * @param {string} surahId - The ID of the surah to load.
 */
function loadTranslationAndRender(surahId) {
    const script = document.createElement('script');
    script.src = `data/translations/${surahId}.js`;
    script.onload = () => {
        renderAyahs(surahId);
        applyBookmarks();
    };
    script.onerror = () => {
        const container = document.getElementById('ayah-container');
        if (container) {
            container.innerHTML = "<p class='no-results'>দুঃখিত, এই সূরার অনুবাদ এখনো যোগ করা হয়নি।</p>";
        }
    };
    document.body.appendChild(script);
}

/**
 * Renders the list of Surahs into the container.
 */
function renderSurahList(surahs) {
    const surahListContainer = document.querySelector('.surah-list');
    if (!surahListContainer) return;
    surahListContainer.innerHTML = ''; 
    if (surahs.length === 0) {
        surahListContainer.innerHTML = '<p class="no-results">কোনো সূরা পাওয়া যায়নি।</p>';
        return;
    }
    surahs.forEach(surah => {
        const pageLink = `surah.html?id=${surah.id}`;
        const ayahCount = surah.details.split(', ')[1] || '';
        const surahCardHTML = `
            <a href="${pageLink}" class="surah-card">
                <div class="surah-card-info">
                    <div class="surah-number-bg">${surah.id}</div>
                    <div>
                        <p class="surah-name">সূরা ${surah.name}</p>
                        <p class="surah-meaning">অর্থ: ${surah.meaning}</p>
                    </div>
                </div>
                <div class="surah-card-right">
                    <p class="surah-arabic-name">${surah.arabic}</p>
                    <p class="surah-ayat-count">${ayahCount}</p>
                </div>
            </a>`;
        surahListContainer.insertAdjacentHTML('beforeend', surahCardHTML);
    });
}

/**
 * Renders the ayahs of a specific surah.
 */
function renderAyahs(surahId) {
    const container = document.getElementById('ayah-container');
    if (!container || typeof quranTranslations === 'undefined') return;
    const translations = quranTranslations[surahId];
    if (!translations) {
        container.innerHTML = "<p class='no-results'>দুঃখিত, এই সূরার অনুবাদ এখনো যোগ করা হয়নি।</p>";
        return;
    }
    let content = '';
    for (const ayahNum in translations) {
        const ayahId = `${surahId}:${ayahNum}`;
        content += `
            <div class="ayah-card">
                <div class="ayah-header">
                    <span class="ayah-number">${ayahId}</span>
                    <div class="ayah-actions">
                        <i class="bi bi-play-circle play-btn" title="Play Audio"></i>
                        <i class="bi bi-bookmark bookmark-btn" data-ayah="${ayahId}" title="Bookmark"></i>
                        <i class="bi bi-share share-btn" data-ayah="${ayahId}" title="Share"></i>
                    </div>
                </div>
                <div class="ayah-content">
                    <p class="ayah-translation">${translations[ayahNum]}</p>
                </div>
            </div>`;
    }
    container.innerHTML = content;
}

/**
 * Renders the list of bookmarked ayahs.
 */
function renderBookmarks() {
    const bookmarkListContainer = document.getElementById('bookmark-list');
    if (!bookmarkListContainer) return;
    const bookmarks = JSON.parse(localStorage.getItem('hasana_bookmarks')) || [];
    bookmarkListContainer.innerHTML = ''; 
    if (bookmarks.length === 0) {
        bookmarkListContainer.innerHTML = '<p class="no-results">কোনো বুকমার্ক পাওয়া যায়নি।</p>';
        return;
    }
    bookmarks.forEach(ayahId => {
        const [surahId, ayahNum] = ayahId.split(':');
        const surahInfo = allSurahs.find(s => s.id == surahId);
        let translationText = "অনুবাদ শীঘ্রই যোগ করা হবে।";
        if (typeof quranTranslations !== 'undefined' && quranTranslations[surahId] && quranTranslations[surahId][ayahNum]) {
            translationText = quranTranslations[surahId][ayahNum];
        }
        if (surahInfo) {
            const bookmarkCardHTML = `
                <div class="ayah-card">
                    <div class="ayah-header">
                        <span class="ayah-number">${surahInfo.name} (${ayahId})</span>
                        <div class="ayah-actions">
                            <i class="bi bi-trash3 remove-bookmark-btn" data-ayah="${ayahId}" title="Remove Bookmark"></i>
                        </div>
                    </div>
                    <div class="ayah-content">
                        <p class="ayah-translation">${translationText}</p>
                    </div>
                </div>`;
            bookmarkListContainer.insertAdjacentHTML('beforeend', bookmarkCardHTML);
        }
    });
}

/**
 * Checks localStorage and applies the saved theme.
 */
function applyTheme() {
    const savedTheme = localStorage.getItem('theme');
    document.body.classList.toggle('dark-mode', savedTheme === 'dark');
}

/**
 * Shows a toast notification.
 */
function showToast(message) {
    const toast = document.getElementById('toast-notification');
    if (toast) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    }
}

/**
 * Toggles a bookmark for a given Ayah ID.
 */
function toggleBookmark(ayahId, iconElement) {
    let bookmarks = JSON.parse(localStorage.getItem('hasana_bookmarks')) || [];
    const index = bookmarks.indexOf(ayahId);
    if (index > -1) {
        bookmarks.splice(index, 1);
        iconElement.classList.remove('bookmarked', 'bi-bookmark-fill');
        iconElement.classList.add('bi-bookmark');
        showToast(`বুকমার্ক (${ayahId}) মুছে ফেলা হয়েছে।`);
    } else {
        bookmarks.push(ayahId);
        iconElement.classList.add('bookmarked', 'bi-bookmark-fill');
        iconElement.classList.remove('bi-bookmark');
        showToast(`আয়াত (${ayahId}) বুকমার্ক করা হয়েছে।`);
    }
    localStorage.setItem('hasana_bookmarks', JSON.stringify(bookmarks));
}

/**
 * Applies the 'bookmarked' class to icons of bookmarked ayahs on page load.
 */
function applyBookmarks() {
    let bookmarks = JSON.parse(localStorage.getItem('hasana_bookmarks')) || [];
    bookmarks.forEach(ayahId => {
        const icon = document.querySelector(`.bookmark-btn[data-ayah="${ayahId}"]`);
        if (icon) {
            icon.classList.add('bookmarked', 'bi-bookmark-fill');
            icon.classList.remove('bi-bookmark');
        }
    });
}

/**
 * Copies a string to the user's clipboard.
 */
function copyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }
    document.body.removeChild(textArea);
}

/**
 * Opens the share modal with the specified text.
 */
function openShareModal(text) {
    const shareModal = document.getElementById('share-modal');
    const shareTextarea = document.getElementById('share-text');
    if (shareModal && shareTextarea) {
        shareTextarea.value = text;
        shareModal.classList.add('active');
    }
}

/**
 * Checks localStorage for font settings and applies them.
 */
function applyFontSettings() {
    const savedTranslationSize = localStorage.getItem('translationFontSize');
    if (savedTranslationSize) {
        const customStyles = `.ayah-translation { font-size: ${savedTranslationSize}px !important; }`;
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = customStyles;
        document.head.appendChild(styleSheet);
    }
}

/**
 * Renders the list of Hadiths for a specific collection.
 * @param {string} collectionName - The name of the collection (e.g., "bukhari").
 */
function renderHadisList(collectionName) {
    const container = document.getElementById('hadis-list');
    if (!container || typeof hadisData === 'undefined') return;

    const hadiths = hadisData[collectionName];
    container.innerHTML = ''; // Clear previous list

    if (!hadiths || hadiths.length === 0) {
        container.innerHTML = "<p class='no-results'>এই সংগ্রহে কোনো হাদিস যোগ করা হয়নি।</p>";
        return;
    }

    let content = '';
    hadiths.forEach(hadis => {
        content += `
            <div class="hadis-card">
                <p class="hadis-text">"${hadis.text}"</p>
                <p class="hadis-ref">${hadis.ref}</p>
            </div>
        `;
    });
    container.innerHTML = content;
}