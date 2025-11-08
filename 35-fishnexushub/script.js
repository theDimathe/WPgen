const nav = document.querySelector('#primary-nav');
const toggle = document.querySelector('.menu-toggle');
const heroVisual = document.querySelector('[data-js-hero-visual]');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}

if (heroVisual) {
  const layers = heroVisual.querySelectorAll('[data-js-layer]');
  const parallax = heroVisual.querySelector('[data-js-parallax]');

  heroVisual.addEventListener('pointermove', (event) => {
    const rect = heroVisual.getBoundingClientRect();
    const relX = (event.clientX - rect.left) / rect.width - 0.5;
    const relY = (event.clientY - rect.top) / rect.height - 0.5;

    layers.forEach((layer, index) => {
      const depth = (index + 1) * 5;
      layer.style.transform = `translate(${relX * depth}px, ${relY * depth}px)`;
    });

    if (parallax) {
      parallax.style.transform = `translate(${relX * 10}px, ${relY * 10}px)`;
    }
  });

  heroVisual.addEventListener('pointerleave', () => {
    layers.forEach((layer) => {
      layer.style.transform = 'translate(0, 0)';
    });

    if (parallax) {
      parallax.style.transform = 'translate(0, 0)';
    }
  });
}

const anchors = document.querySelectorAll('a[href^="#"]');
anchors.forEach((anchor) => {
  anchor.addEventListener('click', () => {
    if (nav && nav.classList.contains('is-open')) {
      nav.classList.remove('is-open');
      toggle?.setAttribute('aria-expanded', 'false');
    }
  });
});
