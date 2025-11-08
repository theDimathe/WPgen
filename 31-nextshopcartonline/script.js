const NextShopCartOnline = {
    init() {
        this.bindNavigation();
        this.handleNewsletter();
    },

    bindNavigation() {
        const toggle = document.getElementById('mobileMenuToggle');
        const mobileNav = document.getElementById('mobileNav');
        if (!toggle || !mobileNav) return;

        const closeNav = () => {
            toggle.setAttribute('aria-expanded', 'false');
            mobileNav.classList.remove('open');
        };

        toggle.addEventListener('click', () => {
            const expanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', String(!expanded));
            mobileNav.classList.toggle('open');
        });

        mobileNav.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', closeNav);
        });

        document.addEventListener('click', (event) => {
            if (!mobileNav.contains(event.target) && !toggle.contains(event.target)) {
                closeNav();
            }
        });
    },

    handleNewsletter() {
        const form = document.querySelector('.newsletter-form');
        if (!form) return;

        const note = form.querySelector('.form-note');

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const emailInput = form.querySelector('input[type="email"]');
            if (!emailInput) return;

            const email = emailInput.value.trim();
            if (!this.isValidEmail(email)) {
                if (note) {
                    note.textContent = 'Please enter a valid email address to receive coupons.';
                }
                emailInput.focus();
                return;
            }

            if (note) {
                note.textContent = 'Thanks! Check your inbox for your first round of coupons.';
            }
            form.reset();
        });
    },

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
};

document.addEventListener('DOMContentLoaded', () => NextShopCartOnline.init());
