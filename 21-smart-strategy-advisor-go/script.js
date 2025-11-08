document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', () => {
            const isOpen = mobileNav.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', isOpen);
        });

        mobileNav.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    const applyParallax = () => {
        const scrollY = window.scrollY || window.pageYOffset;
        parallaxElements.forEach((element) => {
            const rate = 0.25;
            element.style.transform = `translate3d(0, ${scrollY * rate}px, 0)`;
        });
    };

    applyParallax();
    window.addEventListener('scroll', applyParallax, { passive: true });
});
