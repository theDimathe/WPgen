document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const hero = document.querySelector('.hero');
  const heroImage = document.querySelector('.hero-image');
  const links = document.querySelectorAll('a[href^="#"]');

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mobileNav.addEventListener('click', (event) => {
      if (event.target.tagName === 'A') {
        mobileNav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#' || targetId.startsWith('mailto') || targetId.startsWith('tel')) {
        return;
      }
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        event.preventDefault();
        const offsetTop = targetElement.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });

  if (hero) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            hero.classList.add('is-zoomed');
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(hero);
  }

  if (heroImage) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const parallax = Math.min(scrollY * 0.04, 40);
      heroImage.style.transform = `scale(${1.12 - parallax / 400}) translateY(${parallax}px)`;
    });
  }
});
