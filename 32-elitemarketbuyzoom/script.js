document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const heroImage = document.querySelector('.hero-image');
  const links = document.querySelectorAll('a[href^="#"]');

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mobileNav.addEventListener('click', (event) => {
      if (event.target.tagName === 'A') {
        mobileNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#' || targetId.startsWith('mailto') || targetId.startsWith('tel') || targetId.startsWith('_')) {
        return;
      }

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        event.preventDefault();
        const offset = 80;
        const top = targetElement.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  if (heroImage) {
    window.addEventListener('scroll', () => {
      const scroll = window.scrollY;
      const translate = Math.min(scroll * 0.08, 60);
      const scale = Math.max(1, 1.12 - translate / 600);
      heroImage.style.transform = `translateY(${translate}px) scale(${scale})`;
    });
  }
});
