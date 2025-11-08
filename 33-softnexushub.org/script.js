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
      throw new Error(`No se pudo cargar el contenido del modal: ${response.status}`);
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
      console.error('Error de contenido del modal', error);
      content = '<p>No podemos cargar este contenido ahora mismo. Intenta nuevamente más tarde.</p>';
    }

    modalTitle.textContent = title || '';
    modalBody.innerHTML = content || '<p>Contenido disponible próximamente.</p>';
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
