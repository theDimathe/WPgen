// ============================================================================
// INKSTORYBOOKVAULT - CUSTOM JAVASCRIPT
// Mobile-First Interactive Functionality
// ============================================================================

/**
 * Main Application Object
 * Manages all interactive functionality for the landing page
 */
const InkStorybookApp = {
    // Configuration
    config: {
        mobileBreakpoint: 768,
        darkModeKey: 'inkstorybookvault-dark-mode',
        mobileMenuKey: 'inkstorybookvault-mobile-menu-open',
        cookieConsentKey: 'inkstorybookvault-cookie-consent',
    },

    // State
    state: {
        isDarkMode: false,
        isMobileMenuOpen: false,
        isMobile: window.innerWidth < 768,
        currentTestimonialIndex: 0,
    },

    // Initialize the application
    init() {
        this.cacheElements();
        this.setupEventListeners();
        this.initTheme();
        this.handleResize();
        this.setupCookieConsent();
        console.log('InkStorybookApp initialized');
    },

    // Cache DOM elements
    cacheElements() {
        this.elements = {
            html: document.documentElement,
            body: document.body,
            themeToggle: document.getElementById('themeToggle'),
            mobileMenuToggle: document.getElementById('mobileMenuToggle'),
            mobileNav: document.getElementById('mobileNav'),
            header: document.getElementById('inkstorybookvault'),
            navLinks: document.querySelectorAll('.nav-link, .mobile-nav-link'),
            heroSection: document.getElementById('bienvenido-al-santuario-de-los-libros-exclusivos'),
            benefitsSection: document.getElementById('por-que-elegir-inkstorybookvault'),
            collectionsSection: document.getElementById('colecciones-curadas-por-expertos'),
            testimonialsSection: document.getElementById('testimonios-de-coleccionistas-distinguidos'),
            processSection: document.getElementById('proceso-de-acceso-exclusivo'),
            testimonialsCarousel: document.getElementById('testimonialsCarousel'),
            carouselPrev: document.getElementById('carouselPrev'),
            carouselNext: document.getElementById('carouselNext'),
            cookieBanner: document.getElementById('cookieBanner'),
            cookieAccept: document.getElementById('cookieAccept'),
        };
    },

    // Setup event listeners
    setupEventListeners() {
        // Theme toggle
        if (this.elements.themeToggle)  {
            this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Mobile menu toggle
        if (this.elements.mobileMenuToggle) {
            this.elements.mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Close mobile menu when clicking on a link
        this.elements.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });

        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => this.handleOutsideClick(e));

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Lazy load hero background image
        this.lazyLoadHeroImage();

        // Observe benefit cards for animation
        this.observeBenefitCards();

        // Observe collection cards for animation
        this.observeCollectionCards();

        // Observe testimonial cards for animation
        this.observeTestimonialCards();

        // Observe process steps for animation
        this.observeProcessSteps();

        // Setup carousel controls
        this.setupCarouselControls();
    },

    // Initialize theme based on user preference
    initTheme() {
        const savedTheme = localStorage.getItem(this.config.darkModeKey);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme !== null) {
            this.state.isDarkMode = savedTheme === 'true';
        } else {
            this.state.isDarkMode = prefersDark;
        }

        this.applyTheme();
    },

    // Toggle theme
    toggleTheme() {
        this.state.isDarkMode = !this.state.isDarkMode;
        localStorage.setItem(this.config.darkModeKey, this.state.isDarkMode);
        this.applyTheme();
    },

    // Apply theme to DOM
    applyTheme() {
        if (this.state.isDarkMode) {
            this.elements.body.classList.add('dark-mode');
            this.elements.html.style.colorScheme = 'dark';
        } else {
            this.elements.body.classList.remove('dark-mode');
            this.elements.html.style.colorScheme = 'light';
        }
    },

    // Toggle mobile menu
    toggleMobileMenu() {
        this.state.isMobileMenuOpen = !this.state.isMobileMenuOpen;
        this.updateMobileMenu();
    },

    // Open mobile menu
    openMobileMenu() {
        this.state.isMobileMenuOpen = true;
        this.updateMobileMenu();
    },

    // Close mobile menu
    closeMobileMenu() {
        this.state.isMobileMenuOpen = false;
        this.updateMobileMenu();
    },

    // Update mobile menu UI
    updateMobileMenu() {
        if (this.elements.mobileMenuToggle && this.elements.mobileNav) {
            if (this.state.isMobileMenuOpen) {
                this.elements.mobileNav.classList.add('active');
                this.elements.mobileMenuToggle.setAttribute('aria-expanded', 'true');
                this.elements.mobileNav.setAttribute('aria-hidden', 'false');
            } else {
                this.elements.mobileNav.classList.remove('active');
                this.elements.mobileMenuToggle.setAttribute('aria-expanded', 'false');
                this.elements.mobileNav.setAttribute('aria-hidden', 'true');
            }
        }
    },

    // Handle window resize
    handleResize() {
        const wasMobile = this.state.isMobile;
        this.state.isMobile = window.innerWidth < this.config.mobileBreakpoint;

        // Close mobile menu when resizing to desktop
        if (wasMobile && !this.state.isMobile) {
            this.closeMobileMenu();
        }
    },

    // Handle clicks outside mobile menu
    handleOutsideClick(e) {
        if (this.state.isMobileMenuOpen && 
            this.elements.mobileNav && 
            this.elements.mobileMenuToggle &&
            !this.elements.mobileNav.contains(e.target) &&
            !this.elements.mobileMenuToggle.contains(e.target)) {
            this.closeMobileMenu();
        }
    },

    // Handle keyboard navigation
    handleKeyboard(e) {
        // Close mobile menu on Escape key
        if (e.key === 'Escape' && this.state.isMobileMenuOpen) {
            this.closeMobileMenu();
            this.elements.mobileMenuToggle?.focus();
        }

        // Carousel navigation with arrow keys
        if (e.key === 'ArrowLeft') {
            this.scrollCarouselPrev();
        }
        if (e.key === 'ArrowRight') {
            this.scrollCarouselNext();
        }
    },

    // Lazy load hero background image
    lazyLoadHeroImage() {
        if (!this.elements.heroSection) return;

        const heroBackground = this.elements.heroSection.querySelector('.hero-background');
        if (!heroBackground) return;

        // Use Intersection Observer for lazy loading
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const bgImage = entry.target.style.backgroundImage;
                        if (bgImage && bgImage.includes('url')) {
                            // Image is already set, just mark as loaded
                            entry.target.classList.add('loaded');
                        }
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            observer.observe(heroBackground);
        }
    },

    // Observe benefit cards for animation on scroll
    observeBenefitCards() {
        if (!this.elements.benefitsSection) return;

        const benefitCards = this.elements.benefitsSection.querySelectorAll('.benefit-card');
        if (benefitCards.length === 0) return;

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        // Stagger animation
                        setTimeout(() => {
                            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                        }, index * 100);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            benefitCards.forEach(card => {
                card.style.opacity = '0';
                observer.observe(card);
            });
        }
    },

    // Observe collection cards for animation on scroll
    observeCollectionCards() {
        if (!this.elements.collectionsSection) return;

        const collectionCards = this.elements.collectionsSection.querySelectorAll('.collection-card');
        if (collectionCards.length === 0) return;

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        // Stagger animation
                        setTimeout(() => {
                            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                        }, index * 100);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            collectionCards.forEach(card => {
                card.style.opacity = '0';
                observer.observe(card);
            });
        }
    },

    // Observe testimonial cards for animation on scroll
    observeTestimonialCards() {
        if (!this.elements.testimonialsSection) return;

        const testimonialCards = this.elements.testimonialsSection.querySelectorAll('.testimonial-card');
        if (testimonialCards.length === 0) return;

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        // Stagger animation
                        setTimeout(() => {
                            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                        }, index * 100);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            testimonialCards.forEach(card => {
                card.style.opacity = '0';
                observer.observe(card);
            });
        }
    },

    // Observe process steps for animation on scroll
    observeProcessSteps() {
        if (!this.elements.processSection) return;

        const processSteps = this.elements.processSection.querySelectorAll('.process-step');
        if (processSteps.length === 0) return;

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        // Stagger animation
                        setTimeout(() => {
                            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                        }, index * 100);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            processSteps.forEach(step => {
                step.style.opacity = '0';
                observer.observe(step);
            });
        }
    },

    // Setup carousel controls
    setupCarouselControls() {
        if (!this.elements.carouselPrev || !this.elements.carouselNext) return;

        this.elements.carouselPrev.addEventListener('click', () => this.scrollCarouselPrev());
        this.elements.carouselNext.addEventListener('click', () => this.scrollCarouselNext());
    },

    // Scroll carousel to previous
    scrollCarouselPrev() {
        if (!this.elements.testimonialsCarousel) return;

        const cardWidth = this.elements.testimonialsCarousel.querySelector('.testimonial-card')?.offsetWidth || 0;
        const gap = 30;
        const scrollAmount = cardWidth + gap;

        this.elements.testimonialsCarousel.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth',
        });
    },

    // Scroll carousel to next
    scrollCarouselNext() {
        if (!this.elements.testimonialsCarousel) return;

        const cardWidth = this.elements.testimonialsCarousel.querySelector('.testimonial-card')?.offsetWidth || 0;
        const gap = 30;
        const scrollAmount = cardWidth + gap;

        this.elements.testimonialsCarousel.scrollBy({
            left: scrollAmount,
            behavior: 'smooth',
        });
    },

    setupCookieConsent() {
        const { cookieBanner, cookieAccept } = this.elements;

        if (!cookieBanner || !cookieAccept) return;

        const consent = localStorage.getItem(this.config.cookieConsentKey);
        if (consent === 'accepted') {
            cookieBanner.remove();
            return;
        }

        cookieBanner.removeAttribute('hidden');
        requestAnimationFrame(() => {
            cookieBanner.classList.add('is-visible');
        });

        cookieAccept.addEventListener('click', () => {
            localStorage.setItem(this.config.cookieConsentKey, 'accepted');
            cookieBanner.classList.remove('is-visible');
            setTimeout(() => cookieBanner.remove(), 400);
        });
    },
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => InkStorybookApp.init());
} else {
    InkStorybookApp.init();
}
