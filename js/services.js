/* ============================================================
   ÉLISE & CISEAUX — services.js
   Scroll-spy : surligne le bon lien de la nav sticky
   au fil du scroll dans les sections de prestations
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    const navLinks = document.querySelectorAll('.services-nav__link');
    if (navLinks.length === 0) return;

    const sections = Array.from(navLinks)
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    if (sections.length === 0) return;

    const setActive = (id) => {
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });

        // Centre le lien actif dans la nav horizontale scrollable (mobile)
        const activeLink = document.querySelector('.services-nav__link.active');
        const nav = document.querySelector('.services-nav__inner');
        if (activeLink && nav) {
            const linkLeft = activeLink.offsetLeft;
            const linkWidth = activeLink.offsetWidth;
            const navWidth = nav.clientWidth;
            nav.scrollTo({
                left: linkLeft - navWidth / 2 + linkWidth / 2,
                behavior: 'smooth'
            });
        }
    };

    if ('IntersectionObserver' in window) {
        const navHeight = document.querySelector('.services-nav')?.offsetHeight || 56;
        const headerHeight = parseInt(
            getComputedStyle(document.documentElement).getPropertyValue('--header-h')
        ) || 68;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActive(entry.target.id);
                }
            });
        }, {
            rootMargin: `-${headerHeight + navHeight + 1}px 0px -70% 0px`,
            threshold: 0
        });

        sections.forEach(section => observer.observe(section));
    }

});