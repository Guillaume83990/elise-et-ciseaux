/* ============================================================
   ÉLISE & CISEAUX — avis.js — VERSION CORRIGÉE (v4)
   Filtres (pastilles desktop + select mobile), tri, barres
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ────────────────────────────────────────────────────────────
       ANIMATION BARRES DE NOTATION (IntersectionObserver)
    ──────────────────────────────────────────────────────────── */
    const bars = document.querySelectorAll('.rating-bar__fill[data-width]');

    if (bars.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    bar.style.width = bar.getAttribute('data-width');
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.3 });

        bars.forEach(bar => observer.observe(bar));
    }


    /* ────────────────────────────────────────────────────────────
       FILTRES PAR PRESTATION — pastilles (desktop) + select (mobile)
       Les deux interfaces restent synchronisées entre elles via
       une seule fonction applyFilter, quel que soit l'écran utilisé.
    ──────────────────────────────────────────────────────────── */
    const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
    const mobileFilterSelect = document.querySelector('#reviews-filter-mobile');
    const cards = document.querySelectorAll('.review-card[data-cat]');
    const countEl = document.querySelector('.reviews-count');

    const updateCount = () => {
        const n = document.querySelectorAll('.review-card:not(.is-hidden)').length;
        if (countEl) countEl.textContent = `${n} avis`;
    };

    const applyFilter = (filter) => {
        filterBtns.forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-filter') === filter);
        });
        if (mobileFilterSelect) mobileFilterSelect.value = filter;

        cards.forEach(card => {
            const cat = card.getAttribute('data-cat');
            card.classList.toggle('is-hidden', !(filter === 'tout' || cat === filter));
        });

        updateCount();
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => applyFilter(btn.getAttribute('data-filter')));
    });

    mobileFilterSelect?.addEventListener('change', () => {
        applyFilter(mobileFilterSelect.value);
    });

    updateCount();


    /* ────────────────────────────────────────────────────────────
       TRI
    ──────────────────────────────────────────────────────────── */
    const sortSelect = document.querySelector('#reviews-sort');
    const grid = document.querySelector('.reviews-grid');

    if (sortSelect && grid) {
        sortSelect.addEventListener('change', () => {
            const val = sortSelect.value;
            const items = [...grid.querySelectorAll('.review-card')];

            items.sort((a, b) => {
                if (val === 'recent') {
                    return parseInt(b.getAttribute('data-date') || 0) -
                        parseInt(a.getAttribute('data-date') || 0);
                }
                if (val === 'ancien') {
                    return parseInt(a.getAttribute('data-date') || 0) -
                        parseInt(b.getAttribute('data-date') || 0);
                }
                return 0; // 'pertinence' = ordre HTML original
            });

            items.forEach(item => grid.appendChild(item));
        });
    }

});