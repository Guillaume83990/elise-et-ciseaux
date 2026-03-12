/* ============================================================
   ÉLISE & CISEAUX — avis.js
   Filtres, tri, animation barres de notation
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
       FILTRES PAR PRESTATION
    ──────────────────────────────────────────────────────────── */
    const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
    const cards = document.querySelectorAll('.review-card[data-cat]');
    const countEl = document.querySelector('.reviews-count');

    const updateCount = () => {
        const n = document.querySelectorAll('.review-card:not(.is-hidden)').length;
        if (countEl) countEl.textContent = `${n} avis`;
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            cards.forEach(card => {
                const cat = card.getAttribute('data-cat');
                if (filter === 'tout' || cat === filter) {
                    card.classList.remove('is-hidden');
                } else {
                    card.classList.add('is-hidden');
                }
            });

            updateCount();
        });
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