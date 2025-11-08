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

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('policyModal');
    if (!modal) {
        return;
    }

    const modalTitle = modal.querySelector('#policyModalTitle');
    const modalBody = modal.querySelector('[data-modal-body]');
    if (!modalTitle || !modalBody) {
        return;
    }

    const modalTriggers = document.querySelectorAll('[data-modal-target="policyModal"]');
    const modalCache = {};
    const parser = new DOMParser();

    const loadContentFromSrc = async (src) => {
        if (modalCache[src]) {
            return modalCache[src];
        }

        const response = await fetch(src, { credentials: 'same-origin' });
        if (!response.ok) {
            throw new Error(`Failed to load modal content: ${response.status}`);
        }

        const text = await response.text();
        const doc = parser.parseFromString(text, 'text/html');
        const html = doc.body ? doc.body.innerHTML : text;
        modalCache[src] = html;
        return html;
    };

    const closeModal = () => {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
    };

    const openModal = async (trigger) => {
        const { modalSrc: src, modalTemplate: templateId, modalTitle: title } = trigger.dataset;
        let content = '';

        try {
            if (templateId) {
                const template = document.getElementById(templateId);
                if (template) {
                    content = template.innerHTML.trim();
                }
            } else if (src) {
                content = await loadContentFromSrc(src);
            }
        } catch (error) {
            console.error('Modal content error', error);
            content = '<p>We\'re unable to load this content right now. Please try again later.</p>';
        }

        modalTitle.textContent = title || '';
        modalBody.innerHTML = content || '<p>Content coming soon.</p>';
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');

        const focusTarget = modal.querySelector('.modal-close');
        if (focusTarget) {
            focusTarget.focus();
        }
    };

    modalTriggers.forEach((trigger) => {
        trigger.addEventListener('click', () => {
            openModal(trigger);
        });
    });

    modal.querySelectorAll('[data-modal-close]').forEach((element) => {
        element.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });
});
