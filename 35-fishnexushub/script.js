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
