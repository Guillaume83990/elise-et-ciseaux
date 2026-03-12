/* ============================================================
   ÉLISE & CISEAUX — home.js
   Counters animés au scroll
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Counters animés ───────────────────────────────────── */
    const counters = document.querySelectorAll('[data-counter]');

    if (counters.length === 0) return;

    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-counter'), 10);
        const dur = 1600;
        const start = performance.now();

        const tick = (now) => {
            const progress = Math.min((now - start) / dur, 1);
            // easeOutExpo
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            el.textContent = Math.round(eased * target);
            if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
    };

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(el => observer.observe(el));
    } else {
        counters.forEach(el => {
            el.textContent = el.getAttribute('data-counter');
        });
    }

});