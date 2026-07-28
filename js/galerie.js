/* ============================================================
   ÉLISE & CISEAUX — galerie.js — VERSION CORRIGÉE
   Filtres par catégorie + Lightbox navigation clavier/tactile
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ────────────────────────────────────────────────────────────
       FILTRES
    ──────────────────────────────────────────────────────────── */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.gallery-item');
    const counter = document.querySelector('.gallery-filters__count');

    const updateCounter = () => {
        const visible = document.querySelectorAll('.gallery-item:not(.is-hidden)').length;
        if (counter) counter.textContent = `${visible} réalisation${visible > 1 ? 's' : ''}`;
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            filterBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');

            items.forEach(item => {
                const cat = item.getAttribute('data-cat');
                if (filter === 'tout' || cat === filter) {
                    item.classList.remove('is-hidden');
                } else {
                    item.classList.add('is-hidden');
                }
            });

            updateCounter();
        });
    });

    updateCounter();


    /* ────────────────────────────────────────────────────────────
       LIGHTBOX
    ──────────────────────────────────────────────────────────── */
    const lightbox = document.querySelector('.lightbox');
    const lbImgWrap = document.querySelector('.lightbox__img-wrap');
    const lbCounter = document.querySelector('.lightbox__counter');
    const lbClose = document.querySelector('.lightbox__close');
    const lbPrev = document.querySelector('.lightbox__prev');
    const lbNext = document.querySelector('.lightbox__next');

    if (!lightbox) return;

    let currentIndex = 0;
    let visibleItems = [];
    let lastFocusedItem = null;

    const openLightbox = (index, triggerEl) => {
        visibleItems = [...document.querySelectorAll('.gallery-item:not(.is-hidden)')];
        currentIndex = index;
        lastFocusedItem = triggerEl || document.activeElement;
        renderLightbox();
        lightbox.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        lbClose?.focus();
    };

    const closeLightbox = () => {
        lightbox.classList.remove('is-open');
        document.body.style.overflow = '';
        // Rend le focus à l'élément d'origine (accessibilité clavier)
        lastFocusedItem?.focus();
    };

    const renderLightbox = () => {
        const item = visibleItems[currentIndex];
        const img = item?.querySelector('img');
        const caption = item?.getAttribute('data-caption') || '';

        lbImgWrap.innerHTML = '';

        if (img) {
            const newImg = document.createElement('img');
            newImg.src = img.src;
            newImg.alt = img.alt;
            newImg.className = 'lightbox__img';
            lbImgWrap.appendChild(newImg);
        }

        if (caption) {
            const cap = document.createElement('div');
            cap.className = 'lightbox__caption';
            cap.textContent = caption;
            lbImgWrap.appendChild(cap);
        }

        if (lbCounter) {
            lbCounter.textContent = `${currentIndex + 1} / ${visibleItems.length}`;
        }
    };

    const goTo = (dir) => {
        currentIndex = (currentIndex + dir + visibleItems.length) % visibleItems.length;
        renderLightbox();
    };

    const bindItems = () => {
        document.querySelectorAll('.gallery-item').forEach((item) => {
            item.addEventListener('click', () => {
                visibleItems = [...document.querySelectorAll('.gallery-item:not(.is-hidden)')];
                const visibleIndex = visibleItems.indexOf(item);
                if (visibleIndex !== -1) openLightbox(visibleIndex, item);
            });

            // Ouverture au clavier (Entrée / Espace) — les items sont
            // focusables via tabindex="0", il leur manquait ce handler
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    visibleItems = [...document.querySelectorAll('.gallery-item:not(.is-hidden)')];
                    const visibleIndex = visibleItems.indexOf(item);
                    if (visibleIndex !== -1) openLightbox(visibleIndex, item);
                }
            });
        });
    };

    bindItems();

    lbClose?.addEventListener('click', closeLightbox);
    lbPrev?.addEventListener('click', () => goTo(-1));
    lbNext?.addEventListener('click', () => goTo(+1));

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('is-open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') goTo(-1);
        if (e.key === 'ArrowRight') goTo(+1);
    });

    let touchStartX = 0;

    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) goTo(diff > 0 ? 1 : -1);
    }, { passive: true });

});