/* ============================================================
   ÉLISE & CISEAUX — main.js
   Global : header scroll, burger menu, active nav link
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Header scroll ─────────────────────────────────────── */
    const header = document.querySelector('.header');

    if (header) {
        const onScroll = () => {
            header.classList.toggle('is-scrolled', window.scrollY > 20);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ── Active nav link ───────────────────────────────────── */
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.header__nav a, .mobile-nav a').forEach(link => {
        if (link.getAttribute('href') === page) link.classList.add('active');
    });

    /* ── Burger menu ───────────────────────────────────────── */
    const burger = document.querySelector('.header__burger');
    const mobileNav = document.querySelector('.mobile-nav');

    if (burger && mobileNav) {
        let open = false;

        const toggle = () => {
            open = !open;
            mobileNav.classList.toggle('is-open', open);
            document.body.style.overflow = open ? 'hidden' : '';
            burger.setAttribute('aria-expanded', open);

            const [s1, s2, s3] = burger.querySelectorAll('span');
            if (open) {
                s1.style.transform = 'rotate(45deg) translate(4px, 4px)';
                s2.style.opacity = '0';
                s3.style.transform = 'rotate(-45deg) translate(4px, -4px)';
            } else {
                s1.style.transform = s2.style.opacity = s3.style.transform = '';
                s2.style.opacity = '';
            }
        };

        burger.addEventListener('click', toggle);
        mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
            if (open) toggle();
        }));
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && open) toggle();
        });
    }

    /* ── Smooth anchor ─────────────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const offset = parseInt(getComputedStyle(document.documentElement)
                .getPropertyValue('--header-h')) || 68;
            window.scrollTo({ top: target.offsetTop - offset - 12, behavior: 'smooth' });
        });
    });

});