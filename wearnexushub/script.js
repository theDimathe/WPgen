// ============================================================================
// WEARNEXUSHUB LANDING PAGE - CUSTOM JAVASCRIPT
// Mobile-First Interactive Features
// ============================================================================

/**
 * Main Application Object
 * Manages all interactive features and state
 */
const WearNexusApp = {
    // Configuration
    config: {
        themeStorageKey: 'wearnexus-theme',
        prefersDarkScheme: window.matchMedia('(prefers-color-scheme: dark)'),
        mobileBreakpoint: 768,
    },

    // State
    state: {
        currentTheme: 'light',
        mobileMenuOpen: false,
        carouselIndex: 0,
        carouselTotal: 4,
    },

    /**
     * Initialize the application
     */
    init() {
        this.setupTheme();
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupAccessibility();
        this.setupHeroAnimations();
        this.setupBenefitsAnimations();
        this.setupDesignersCarousel();
        this.setupCollectionsAnimations();
        this.setupImpactAnimations();
        this.setupHowItWorksAnimations();
        console.log('WearNexusApp initialized');
    },

    /**
     * Setup Theme Toggle Functionality
     */
    setupTheme() {
        const themeToggle = document.getElementById('themeToggle');
        const html = document.documentElement;

        // Get saved theme or use system preference
        const savedTheme = localStorage.getItem(this.config.themeStorageKey);
        let initialTheme = savedTheme;

        if (!initialTheme) {
            initialTheme = this.config.prefersDarkScheme.matches ? 'dark' : 'light';
        }

        // Set initial theme
        this.setTheme(initialTheme);

        // Theme toggle click handler
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const newTheme = this.state.currentTheme === 'light' ? 'dark' : 'light';
                this.setTheme(newTheme);
            });
        }

        // Listen for system theme changes
        this.config.prefersDarkScheme.addEventListener('change', (e) => {
            if (!localStorage.getItem(this.config.themeStorageKey)) {
                const newTheme = e.matches ? 'dark' : 'light';
                this.setTheme(newTheme);
            }
        });
    },

    /**
     * Set theme and update DOM
     */
    setTheme(theme) {
        this.state.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(this.config.themeStorageKey, theme);

        // Update theme toggle button state
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.setAttribute('aria-pressed', theme === 'dark');
        }
    },

    /**
     * Setup Mobile Menu Functionality
     */
    setupMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');

        if (!mobileMenuToggle || !mobileMenu) return;

        // Toggle menu on button click
        mobileMenuToggle.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Close menu when a link is clicked
        mobileMenuLinks.forEach((link) => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (
                !mobileMenuToggle.contains(e.target) &&
                !mobileMenu.contains(e.target) &&
                this.state.mobileMenuOpen
            ) {
                this.closeMobileMenu();
            }
        });

        // Close menu on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.state.mobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
    },

    /**
     * Toggle mobile menu visibility
     */
    toggleMobileMenu() {
        if (this.state.mobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    },

    /**
     * Open mobile menu
     */
    openMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenu = document.getElementById('mobileMenu');

        if (!mobileMenuToggle || !mobileMenu) return;

        this.state.mobileMenuOpen = true;
        mobileMenu.removeAttribute('hidden');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    },

    /**
     * Close mobile menu
     */
    closeMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenu = document.getElementById('mobileMenu');

        if (!mobileMenuToggle || !mobileMenu) return;

        this.state.mobileMenuOpen = false;
        mobileMenu.setAttribute('hidden', '');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    },

    /**
     * Setup Smooth Scroll for Anchor Links
     */
    setupSmoothScroll() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;

            const href = link.getAttribute('href');
            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();
                
                // Close mobile menu if open
                if (this.state.mobileMenuOpen) {
                    this.closeMobileMenu();
                }

                // Scroll to target with offset for sticky header
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth',
                });
            }
        });
    },

    /**
     * Setup Accessibility Features
     */
    setupAccessibility() {
        // Skip to main content link
        this.createSkipLink();

        // Ensure proper focus management
        this.setupFocusManagement();
    },

    /**
     * Create skip to main content link
     */
    createSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Saltar al contenido principal';
        skipLink.className = 'skip-link';
        document.body.insertBefore(skipLink, document.body.firstChild);
    },

    /**
     * Setup focus management for keyboard navigation
     */
    setupFocusManagement() {
        // Add main content ID if it doesn't exist
        const mainContent = document.querySelector('main') || document.querySelector('section');
        if (mainContent && !mainContent.id) {
            mainContent.id = 'main-content';
        }
    },

    /**
     * Setup Hero Section Animations
     */
    setupHeroAnimations() {
        const heroContent = document.querySelector('.hero-content');
        const heroImage = document.querySelector('.hero-image');

        if (!heroContent || !heroImage) return;

        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        observer.observe(heroContent);
        observer.observe(heroImage);
    },

    /**
     * Setup Benefits Section Animations
     */
    setupBenefitsAnimations() {
        const benefitCards = document.querySelectorAll('.benefit-card');

        if (benefitCards.length === 0) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger animation for each card
                    setTimeout(() => {
                        entry.target.style.animation = `fadeInUp 0.6s ease forwards`;
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        benefitCards.forEach((card) => {
            observer.observe(card);
        });
    },

    /**
     * Setup Designers Carousel Functionality
     */
    setupDesignersCarousel() {
        const carousel = document.getElementById('designersCarousel');
        const prevBtn = document.getElementById('carouselPrev');
        const nextBtn = document.getElementById('carouselNext');
        const indicators = document.querySelectorAll('.indicator');

        if (!carousel || !prevBtn || !nextBtn) return;

        // Previous button
        prevBtn.addEventListener('click', () => {
            this.carouselPrevious();
        });

        // Next button
        nextBtn.addEventListener('click', () => {
            this.carouselNext();
        });

        // Indicator buttons
        indicators.forEach((indicator) => {
            indicator.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                this.carouselGoTo(index);
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.carouselPrevious();
            } else if (e.key === 'ArrowRight') {
                this.carouselNext();
            }
        });

        // Initialize carousel display
        this.updateCarouselDisplay();
    },

    /**
     * Move carousel to previous item
     */
    carouselPrevious() {
        this.state.carouselIndex = (this.state.carouselIndex - 1 + this.state.carouselTotal) % this.state.carouselTotal;
        this.updateCarouselDisplay();
    },

    /**
     * Move carousel to next item
     */
    carouselNext() {
        this.state.carouselIndex = (this.state.carouselIndex + 1) % this.state.carouselTotal;
        this.updateCarouselDisplay();
    },

    /**
     * Go to specific carousel item
     */
    carouselGoTo(index) {
        if (index >= 0 && index < this.state.carouselTotal) {
            this.state.carouselIndex = index;
            this.updateCarouselDisplay();
        }
    },

    /**
     * Update carousel display based on current index
     */
    updateCarouselDisplay() {
        const profiles = document.querySelectorAll('.designer-profile');
        const indicators = document.querySelectorAll('.indicator');
        const prevBtn = document.getElementById('carouselPrev');
        const nextBtn = document.getElementById('carouselNext');

        // Update profile visibility
        profiles.forEach((profile, index) => {
            if (index === this.state.carouselIndex) {
                profile.style.display = 'flex';
                profile.style.animation = 'fadeInUp 0.6s ease forwards';
            } else {
                profile.style.display = 'none';
            }
        });

        // Update indicators
        indicators.forEach((indicator, index) => {
            if (index === this.state.carouselIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });

        // Update button states
        if (prevBtn) {
            prevBtn.disabled = this.state.carouselIndex === 0;
        }
        if (nextBtn) {
            nextBtn.disabled = this.state.carouselIndex === this.state.carouselTotal - 1;
        }
    },

    /**
     * Setup Collections Section Animations
     */
    setupCollectionsAnimations() {
        const collectionCards = document.querySelectorAll('.collection-card');

        if (collectionCards.length === 0) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger animation for each card
                    setTimeout(() => {
                        entry.target.style.animation = `fadeInUp 0.6s ease forwards`;
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        collectionCards.forEach((card) => {
            observer.observe(card);
        });
    },

    /**
     * Setup Impact Section Animations
     */
    setupImpactAnimations() {
        const metricBlocks = document.querySelectorAll('.metric-block');
        const impactImage = document.querySelector('.impact-image');
        const impactStatement = document.querySelector('.impact-statement');

        if (metricBlocks.length === 0) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger animation for metric blocks
                    if (entry.target.classList.contains('metric-block')) {
                        setTimeout(() => {
                            entry.target.style.animation = `fadeInUp 0.6s ease forwards`;
                        }, index * 100);
                    } else {
                        entry.target.style.animation = `fadeInUp 0.6s ease forwards`;
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        metricBlocks.forEach((block) => {
            observer.observe(block);
        });

        if (impactImage) {
            observer.observe(impactImage);
        }

        if (impactStatement) {
            observer.observe(impactStatement);
        }
    },

    /**
     * Setup How It Works Section Animations
     */
    setupHowItWorksAnimations() {
        const stepItems = document.querySelectorAll('.step-item');

        if (stepItems.length === 0) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger animation for each step
                    setTimeout(() => {
                        entry.target.style.animation = `fadeInUp 0.6s ease forwards`;
                    }, index * 150);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        stepItems.forEach((step) => {
            observer.observe(step);
        });
    },
};

/**
 * Initialize app when DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        WearNexusApp.init();
    });
} else {
    WearNexusApp.init();
}
