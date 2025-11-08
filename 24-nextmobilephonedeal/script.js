const NextMobileApp = {
    init() {
        this.bindNavigation();
        this.observeElements();
        this.handleNewsletter();
    },

    bindNavigation() {
        const toggle = document.getElementById('mobileMenuToggle');
        const mobileNav = document.getElementById('mobileNav');
        if (!toggle || !mobileNav) return;

        const closeNav = () => {
            toggle.setAttribute('aria-expanded', 'false');
            mobileNav.classList.remove('active');
        };

        toggle.addEventListener('click', () => {
            const expanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', String(!expanded));
            mobileNav.classList.toggle('active');
        });

        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeNav);
        });

        document.addEventListener('click', (event) => {
            if (!mobileNav.contains(event.target) && !toggle.contains(event.target)) {
                closeNav();
            }
        });
    },

    observeElements() {
        const revealables = document.querySelectorAll('.reveal');
        if (!revealables.length || !('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.25 });

        revealables.forEach(el => observer.observe(el));
    },

    handleNewsletter() {
        const form = document.querySelector('.newsletter-form');
        if (!form) return;
        const feedback = form.querySelector('.form-feedback');

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const emailInput = form.querySelector('input[type="email"]');
            if (!emailInput) return;

            const email = emailInput.value.trim();
            if (!this.isValidEmail(email)) {
                feedback.textContent = 'Please enter a valid email to receive alerts.';
                feedback.style.color = '#ffe6e6';
                emailInput.focus();
                return;
            }

            feedback.textContent = 'Thanks! You will start receiving price alerts soon.';
            feedback.style.color = '#ffffff';
            form.reset();
        });
    },

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
};

document.addEventListener('DOMContentLoaded', () => NextMobileApp.init());
