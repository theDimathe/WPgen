// ============================================================================
// TIMEFLOWVIBE LANDING PAGE - CUSTOM JAVASCRIPT
// Mobile-First Interactive Features
// ============================================================================

// Application State
const app = {
    isDarkTheme: false,
    isMobileMenuOpen: false,
    
    // Initialize the application
    init() {
        this.setupTheme();
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupAccessibility();
        this.setupHeroAnimations();
        this.setupCollectionAnimations();
        this.setupReasonsAnimations();
        this.setupLegacyAnimations();
        this.setupGalleryAnimations();
        this.setupTestimonialsAnimations();
        this.setupParallax();
        this.setupCookieBanner();
    },

    // ========================================================================
    // THEME MANAGEMENT
    // ========================================================================

    setupTheme() {
        const themeToggle = document.getElementById('themeToggle');
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        // Set initial theme
        if (savedTheme) {
            this.isDarkTheme = savedTheme === 'dark';
        } else if (prefersDark) {
            this.isDarkTheme = true;
        }

        this.applyTheme();

        // Theme toggle listener
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.isDarkTheme = e.matches;
                this.applyTheme();
            }
        });
    },

    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        this.applyTheme();
        localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
    },

    applyTheme() {
        const body = document.body;
        if (this.isDarkTheme) {
            body.classList.add('dark-theme');
        } else {
            body.classList.remove('dark-theme');
        }
    },

    // ========================================================================
    // MOBILE MENU MANAGEMENT
    // ========================================================================

    setupMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileNav = document.getElementById('mobileNav');
        const navLinks = mobileNav ? mobileNav.querySelectorAll('.nav-link') : [];

        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileNav && mobileMenuToggle && 
                !mobileNav.contains(e.target) && 
                !mobileMenuToggle.contains(e.target) &&
                this.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
    },

    toggleMobileMenu() {
        if (this.isMobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    },

    openMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileNav = document.getElementById('mobileNav');

        if (mobileMenuToggle && mobileNav) {
            mobileMenuToggle.classList.add('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'true');
            mobileNav.classList.add('active');
            this.isMobileMenuOpen = true;
            document.body.style.overflow = 'hidden';
        }
    },

    closeMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileNav = document.getElementById('mobileNav');

        if (mobileMenuToggle && mobileNav) {
            mobileMenuToggle.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mobileNav.classList.remove('active');
            this.isMobileMenuOpen = false;
            document.body.style.overflow = '';
        }
    },

    // ========================================================================
    // SMOOTH SCROLL BEHAVIOR
    // ========================================================================

    setupSmoothScroll() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;

            const href = link.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            // Close mobile menu if open
            if (this.isMobileMenuOpen) {
                this.closeMobileMenu();
            }

            // Scroll to target with offset for sticky header
            const headerHeight = 70;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    },

    // ========================================================================
    // HERO SECTION ANIMATIONS
    // ========================================================================

    setupHeroAnimations() {
        const heroSection = document.getElementById('bienvenida-a-timeflowvibe-donde-la-elegancia-encuentra-la-precision');
        if (!heroSection) return;

        // Observe hero section for intersection
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1
        });

        observer.observe(heroSection);
    },

    // ========================================================================
    // COLLECTION SECTION ANIMATIONS
    // ========================================================================

    setupCollectionAnimations() {
        const collectionSection = document.getElementById('la-coleccion-timeflowvibe-artesania-sin-compromiso');
        if (!collectionSection) return;

        const productCards = collectionSection.querySelectorAll('.product-card');
        
        // Observe collection section for intersection
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Stagger animation for product cards
                    productCards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.animation = `fadeUpContent 0.8s ease-out forwards`;
                            card.style.animationDelay = `${0.1 * index}s`;
                        }, 0);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        observer.observe(collectionSection);
    },

    // ========================================================================
    // REASONS SECTION ANIMATIONS
    // ========================================================================

    setupReasonsAnimations() {
        const reasonsSection = document.getElementById('por-que-elegir-timeflowvibe-razones-de-confianza');
        if (!reasonsSection) return;

        const reasonCards = reasonsSection.querySelectorAll('.reason-card');
        
        // Observe reasons section for intersection
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Stagger animation for reason cards
                    reasonCards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.animation = `slideInReason 0.6s ease-out forwards`;
                            card.style.animationDelay = `${0.1 * index}s`;
                        }, 0);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        observer.observe(reasonsSection);
    },

    // ========================================================================
    // LEGACY SECTION ANIMATIONS
    // ========================================================================

    setupLegacyAnimations() {
        const legacySection = document.getElementById('el-legado-de-timeflowvibe-historia-de-excelencia');
        if (!legacySection) return;

        const legacyContent = legacySection.querySelector('.legacy-content');
        const legacyImage = legacySection.querySelector('.legacy-image-wrapper');
        
        // Observe legacy section for intersection
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (legacyContent) {
                        legacyContent.style.animation = `fadeUpContent 0.8s ease-out 0.2s forwards`;
                    }
                    if (legacyImage) {
                        legacyImage.style.animation = `fadeUpContent 0.8s ease-out 0.4s forwards`;
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        observer.observe(legacySection);
    },

    // ========================================================================
    // GALLERY SECTION ANIMATIONS
    // ========================================================================

    setupGalleryAnimations() {
        const gallerySection = document.getElementById('galeria-exclusiva-detalles-que-definen-la-perfeccion');
        if (!gallerySection) return;

        const galleryItems = gallerySection.querySelectorAll('.gallery-item');
        
        // Observe gallery section for intersection
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Stagger animation for gallery items
                    galleryItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.animation = `fadeUpContent 0.8s ease-out forwards`;
                            item.style.animationDelay = `${0.1 * index}s`;
                        }, 0);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        observer.observe(gallerySection);
    },

    // ========================================================================
    // TESTIMONIALS SECTION ANIMATIONS
    // ========================================================================

    setupTestimonialsAnimations() {
        const testimonialsSection = document.getElementById('testimonios-de-clientes-satisfaccion-premium');
        if (!testimonialsSection) return;

        const testimonialCards = testimonialsSection.querySelectorAll('.testimonial-card');
        
        // Observe testimonials section for intersection
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Stagger animation for testimonial cards
                    testimonialCards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.animation = `slideInReason 0.6s ease-out forwards`;
                            card.style.animationDelay = `${0.1 * index}s`;
                        }, 0);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        observer.observe(testimonialsSection);
    },

    // ========================================================================
    // PARALLAX EFFECT
    // ========================================================================

    setupParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax="true"]');
        
        if (parallaxElements.length === 0) return;

        window.addEventListener('scroll', () => {
            parallaxElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const scrollPosition = window.scrollY;
                const elementPosition = rect.top + scrollPosition;
                const distance = scrollPosition - elementPosition;

                // Apply subtle parallax effect (20-30px range)
                const parallaxOffset = distance * 0.15;
                element.style.transform = `translateY(${parallaxOffset}px)`;
            });
        }, { passive: true });
    },

    // ========================================================================
    // COOKIE CONSENT
    // ========================================================================
    setupCookieBanner() {
        const banner = document.getElementById('cookieBanner');
        if (!banner) return;

        const acceptButton = banner.querySelector('[data-action="accept"]');
        const rejectButton = banner.querySelector('[data-action="reject"]');
        const storageKey = 'timeflowvibe-cookie-consent';
        const savedConsent = localStorage.getItem(storageKey);

        if (savedConsent) {
            banner.setAttribute('aria-hidden', 'true');
            return;
        }

        requestAnimationFrame(() => {
            banner.classList.add('is-visible');
            banner.setAttribute('aria-hidden', 'false');
        });

        const closeBanner = (value) => {
            banner.classList.remove('is-visible');
            banner.setAttribute('aria-hidden', 'true');
            localStorage.setItem(storageKey, value);
        };

        acceptButton?.addEventListener('click', () => closeBanner('accepted'));
        rejectButton?.addEventListener('click', () => closeBanner('rejected'));
    },

    // ========================================================================
    // ACCESSIBILITY ENHANCEMENTS
    // ========================================================================

    setupAccessibility() {
        // Skip to main content link
        this.createSkipLink();

        // Keyboard navigation for header
        this.setupKeyboardNavigation();
    },

    createSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#bienvenida-a-timeflowvibe-donde-la-elegancia-encuentra-la-precision';
        skipLink.textContent = 'Saltar al contenido principal';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 0;
            background: var(--color-accent);
            color: var(--color-bg);
            padding: 8px 16px;
            text-decoration: none;
            z-index: 100;
            border-radius: 0 0 4px 0;
        `;
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '0';
        });
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        document.body.insertBefore(skipLink, document.body.firstChild);
    },

    setupKeyboardNavigation() {
        const header = document.getElementById('timeflowvibe');
        if (!header) return;

        // Tab through header elements
        const focusableElements = header.querySelectorAll(
            'a, button, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        header.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        });
    }
};

// ============================================================================
// KEYFRAME ANIMATIONS
// ============================================================================

// Add slideInReason animation to stylesheet
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInReason {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);

// ============================================================================
// INITIALIZATION
// ============================================================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}
