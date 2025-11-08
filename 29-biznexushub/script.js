const nav = document.getElementById('primary-nav');
const menuToggle = document.querySelector('.menu-toggle');
const heroLayers = document.querySelectorAll('[data-js-layer]');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.addEventListener('click', (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      nav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

const heroVisual = document.querySelector('[data-js-hero-visual]');

if (heroVisual && heroLayers.length) {
  const calcOffset = (value, max) => ((value / max - 0.5) * 16).toFixed(2);

  heroVisual.addEventListener('mousemove', (event) => {
    const bounds = heroVisual.getBoundingClientRect();
    const offsetX = calcOffset(event.clientX - bounds.left, bounds.width);
    const offsetY = calcOffset(event.clientY - bounds.top, bounds.height);

    heroLayers.forEach((layer, index) => {
      const depth = (index + 1) * 4;
      layer.style.transform = `translate3d(${offsetX / depth}px, ${offsetY / depth}px, 0)`;
    });
  });

  heroVisual.addEventListener('mouseleave', () => {
    heroLayers.forEach((layer) => {
      layer.style.transform = 'translate3d(0, 0, 0)';
    });
  });
}
