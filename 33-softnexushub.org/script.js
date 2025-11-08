const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isExpanded));
    siteNav.classList.toggle('open');
    document.body.classList.toggle('nav-open');
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      document.body.classList.remove('nav-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const parallaxLayers = document.querySelectorAll('[data-js-layer]');
const heroVisual = document.querySelector('[data-js-hero-visual]');

if (heroVisual && parallaxLayers.length) {
  heroVisual.addEventListener('mousemove', (event) => {
    const rect = heroVisual.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
    const offsetY = (event.clientY - rect.top) / rect.height - 0.5;

    parallaxLayers.forEach((layer, index) => {
      const depth = (index + 1) / parallaxLayers.length;
      layer.style.transform = `translate3d(${offsetX * depth * 20}px, ${offsetY * depth * 20}px, 0)`;
    });
  });

  heroVisual.addEventListener('mouseleave', () => {
    parallaxLayers.forEach((layer) => {
      layer.style.transform = 'translate3d(0, 0, 0)';
    });
  });
}
