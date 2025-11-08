const menuToggle = document.querySelector('.menu-toggle');
const primaryNav = document.getElementById('primary-nav');

if (menuToggle && primaryNav) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    primaryNav.setAttribute('aria-expanded', String(!expanded));
  });

  primaryNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      primaryNav.setAttribute('aria-expanded', 'false');
    });
  });
}

const heroVisual = document.querySelector('[data-js-hero-visual]');

if (heroVisual) {
  const layers = heroVisual.querySelectorAll('[data-js-layer]');
  window.addEventListener('mousemove', (event) => {
    const { innerWidth, innerHeight } = window;
    const offsetX = (event.clientX / innerWidth - 0.5) * 10;
    const offsetY = (event.clientY / innerHeight - 0.5) * 10;

    layers.forEach((layer, index) => {
      const depth = (index + 1) / layers.length;
      layer.style.transform = `translate3d(${offsetX * depth}px, ${offsetY * depth}px, 0)`;
    });
  });
}

const contactForm = document.querySelector('.contact__form');

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    alert(`Thanks, ${name || 'angler'}! Our team will reach out shortly.`);
    contactForm.reset();
  });
}

const newsletterForm = document.querySelector('.newsletter');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    if (emailInput) {
      alert(`Newsletter subscription confirmed for ${emailInput.value}.`);
      emailInput.value = '';
    }
  });
}
