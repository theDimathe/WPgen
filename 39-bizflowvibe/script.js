const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');

if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
        const isOpen = mobileNav.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        document.body.classList.toggle('nav-open', isOpen);
    });

    mobileNav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('nav-open');
        });
    });
}

document.getElementById('currentYear').textContent = new Date().getFullYear();

const policyModal = document.getElementById('policyModal');
const modalTriggers = document.querySelectorAll('.footer-links a');
const modalTitle = document.getElementById('policyModalTitle');
const modalBody = policyModal ? policyModal.querySelector('[data-modal-body]') : null;
const modalCache = {};

const openModal = async (url, title) => {
    if (!policyModal || !modalBody || !modalTitle) {
        return;
    }

    try {
        if (!modalCache[url]) {
            const response = await fetch(url, { credentials: 'same-origin' });
            if (!response.ok) {
                throw new Error(`Unable to load ${url}`);
            }
            modalCache[url] = await response.text();
        }
        modalBody.innerHTML = modalCache[url];
    } catch (error) {
        modalBody.innerHTML = `<p>We can't display this content right now. Please try again later.</p>`;
        console.error(error);
    }

    modalTitle.textContent = title;
    policyModal.classList.add('is-open');
    policyModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
};

modalTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
        event.preventDefault();
        const url = trigger.getAttribute('href');
        const title = trigger.textContent + ' Policy';
        openModal(url, title);
    });
});

if (policyModal) {
    const closeButtons = policyModal.querySelectorAll('[data-modal-close]');
    closeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            policyModal.classList.remove('is-open');
            policyModal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open');
        });
    });

    policyModal.addEventListener('click', (event) => {
        if (event.target === policyModal) {
            policyModal.classList.remove('is-open');
            policyModal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open');
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && policyModal.classList.contains('is-open')) {
            policyModal.classList.remove('is-open');
            policyModal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open');
        }
    });
}

const forms = document.querySelectorAll('form');
forms.forEach((form) => {
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.textContent = 'Thanks!';
            submitButton.disabled = true;
        }
    });
});
