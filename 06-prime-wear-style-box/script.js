// ============================================================================
// PRIMEWEARSTYLEBOX - CUSTOM JAVASCRIPT
// Mobile-First Interactive Features
// ============================================================================

class PrimeWearApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupThemeToggle();
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupParallax();
        this.setupIntersectionObserver();
        this.setupTestimonialsCarousel();
        this.setupCookieBanner();
    }

    // ========================================================================
    // THEME TOGGLE
    // ========================================================================

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        // Get saved theme or default to light
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);

        // Listen for system preference changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }

        // Toggle theme on button click
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            this.setTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }

    // ========================================================================
    // MOBILE MENU
    // ========================================================================

    setupMobileMenu() {
        const menuToggle = document.getElementById('mobileMenuToggle');
        const mobileNav = document.getElementById('mobileNav');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

        if (!menuToggle || !mobileNav) return;

        // Toggle menu on button click
        menuToggle.addEventListener('click', () => {
            const isActive = menuToggle.classList.contains('active');
            this.toggleMobileMenu(!isActive, menuToggle, mobileNav);
        });

        // Close menu when a link is clicked
        mobileNavLinks.forEach((link) => {
            link.addEventListener('click', () => {
                this.toggleMobileMenu(false, menuToggle, mobileNav);
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            const header = document.getElementById('primewearstylebox');
            if (header && !header.contains(e.target)) {
                this.toggleMobileMenu(false, menuToggle, mobileNav);
            }
        });

        // Close menu on window resize (when switching to desktop)
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768) {
                this.toggleMobileMenu(false, menuToggle, mobileNav);
            }
        });
    }

    toggleMobileMenu(isOpen, menuToggle, mobileNav) {
        if (isOpen) {
            menuToggle.classList.add('active');
            menuToggle.setAttribute('aria-expanded', 'true');
            mobileNav.classList.add('active');
        } else {
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            mobileNav.classList.remove('active');
        }
    }

    // ========================================================================
    // SMOOTH SCROLL
    // ========================================================================

    setupSmoothScroll() {
        // Smooth scroll is handled by CSS (scroll-behavior: smooth)
        // This function can be extended for additional scroll behaviors
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;

            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // ========================================================================
    // PARALLAX EFFECT
    // ========================================================================

    setupParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        if (parallaxElements.length === 0) return;

        window.addEventListener('scroll', () => {
            parallaxElements.forEach((element) => {
                const parallaxValue = parseFloat(element.getAttribute('data-parallax')) || 0.5;
                const scrollPosition = window.scrollY;
                const yOffset = scrollPosition * parallaxValue;
                element.style.transform = `translateY(${yOffset}px)`;
            });
        });
    }

    // ========================================================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ========================================================================

    setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.animation = 'fadeInUp 600ms ease-out forwards';
                }
            });
        }, observerOptions);

        // Observe value cards
        const valueCards = document.querySelectorAll('.value-card');
        valueCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.animationDelay = `${index * 100}ms`;
            observer.observe(card);
        });

        // Observe collection cards
        const collectionCards = document.querySelectorAll('.collection-card');
        collectionCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.animationDelay = `${index * 100}ms`;
            observer.observe(card);
        });

        // Observe testimonial cards
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        testimonialCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.animationDelay = `${index * 100}ms`;
            observer.observe(card);
        });

        // Observe how-it-works steps
        const howItWorksSteps = document.querySelectorAll('.how-it-works-step');
        howItWorksSteps.forEach((step, index) => {
            step.style.opacity = '0';
            step.style.animationDelay = `${index * 100}ms`;
            observer.observe(step);
        });

        // Observe materials content
        const materialsContent = document.querySelector('.materials-content');
        if (materialsContent) {
            materialsContent.style.opacity = '0';
            observer.observe(materialsContent);
        }

        const materialsImageWrapper = document.querySelector('.materials-image-wrapper');
        if (materialsImageWrapper) {
            materialsImageWrapper.style.opacity = '0';
            observer.observe(materialsImageWrapper);
        }

        // Observe offer content
        const offerContent = document.querySelector('.offer-content');
        if (offerContent) {
            offerContent.style.opacity = '0';
            observer.observe(offerContent);
        }
    }

    // ========================================================================
    // TESTIMONIALS CAROUSEL
    // ========================================================================

    setupTestimonialsCarousel() {
        const track = document.getElementById('testimonialsTrack');
        const dots = document.querySelectorAll('.testimonials-dot');
        const cards = document.querySelectorAll('.testimonial-card');

        if (!track || dots.length === 0 || cards.length === 0) return;

        let currentSlide = 0;

        // Handle dot clicks
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index, track, dots, cards);
            });
        });

        // Auto-advance carousel every 8 seconds
        setInterval(() => {
            currentSlide = (currentSlide + 1) % cards.length;
            this.goToSlide(currentSlide, track, dots, cards);
        }, 8000);

        // Handle touch/swipe on mobile
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX, track, dots, cards);
        }, false);
    }

    setupCookieBanner() {
        const banner = document.getElementById('cookieBanner');
        if (!banner) return;

        const acceptBtn = document.getElementById('cookieAccept');
        const settingsBtn = document.getElementById('cookieSettings');
        const note = document.getElementById('cookieNote');
        const storageKey = 'primewear-cookie-consent';

        const closeBanner = () => {
            if (banner.classList.contains('is-closing')) return;
            banner.classList.add('is-closing');
            window.setTimeout(() => {
                banner.setAttribute('hidden', '');
            }, 300);
        };

        if (localStorage.getItem(storageKey) === 'accepted') {
            banner.setAttribute('hidden', '');
            return;
        }

        acceptBtn?.addEventListener('click', () => {
            localStorage.setItem(storageKey, 'accepted');
            closeBanner();
        });

        settingsBtn?.addEventListener('click', () => {
            if (!note) return;
            const isHidden = note.hasAttribute('hidden');
            if (isHidden) {
                note.removeAttribute('hidden');
                settingsBtn.setAttribute('aria-expanded', 'true');
                settingsBtn.textContent = 'Ocultar opciones';
            } else {
                note.setAttribute('hidden', '');
                settingsBtn.setAttribute('aria-expanded', 'false');
                settingsBtn.textContent = 'Configurar';
            }
        });
    }

    goToSlide(index, track, dots, cards) {
        const cardWidth = cards[0].offsetWidth;
        const gap = 16; // var(--spacing-lg) in pixels
        const offset = index * (cardWidth + gap);

        track.scrollLeft = offset;

        // Update dots
        dots.forEach((dot, i) => {
            if (i === index) {
                dot.setAttribute('aria-current', 'true');
            } else {
                dot.removeAttribute('aria-current');
            }
        });
    }

    handleSwipe(startX, endX, track, dots, cards) {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold) {
            const cardWidth = cards[0].offsetWidth;
            const gap = 16;
            const currentScroll = track.scrollLeft;
            const itemsPerView = Math.round(track.offsetWidth / (cardWidth + gap));

            if (diff > 0) {
                // Swiped left - go to next
                const nextIndex = Math.min(
                    Math.ceil((currentScroll + cardWidth + gap) / (cardWidth + gap)),
                    cards.length - 1
                );
                this.goToSlide(nextIndex, track, dots, cards);
            } else {
                // Swiped right - go to previous
                const prevIndex = Math.max(
                    Math.floor(currentScroll / (cardWidth + gap)) - 1,
                    0
                );
                this.goToSlide(prevIndex, track, dots, cards);
            }
        }
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PrimeWearApp();
    });
} else {
    new PrimeWearApp();
}
