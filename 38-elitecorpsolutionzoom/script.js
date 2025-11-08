const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.main-nav ul');
const navLinks = document.querySelectorAll('.main-nav a');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
    });
}

navLinks.forEach(link => {
    link.addEventListener('click', event => {
        event.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
        if (navMenu.classList.contains('open')) {
            navMenu.classList.remove('open');
        }
    });
});

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', event => {
        event.preventDefault();
        contactForm.reset();
        alert('Thank you! Our consultants will reach out shortly.');
    });
}
