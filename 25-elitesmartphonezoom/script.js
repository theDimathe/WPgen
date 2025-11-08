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
            throw new Error(`Failed to load modal content: ${response.status}`);
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
            console.error('Modal content error', error);
            content = '<p>We\'re unable to load this content right now. Please try again later.</p>';
        }

        modalTitle.textContent = title || '';
        modalBody.innerHTML = content || '<p>Content coming soon.</p>';
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
