// ============================================================================
// BOOKNEXUSHUB LANDING PAGE - CUSTOM JAVASCRIPT
// Mobile-First Interactive Functionality
// ============================================================================

// ============================================================================
// APPLICATION INITIALIZATION
// ============================================================================

const BookNexusApp = {
    // Configuration
    config: {
        themeStorageKey: 'booknexushub-theme',
        prefersDarkScheme: window.matchMedia('(prefers-color-scheme: dark)'),
        carouselScrollAmount: 320,
    },

    // Initialize the application
    init() {
        this.setupTheme();
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupAccessibility();
        this.setupHeroAnimations();
        this.setupBenefitsAnimations();
        this.setupCarousel();
        this.setupReviewsAnimations();
        this.setupCommunityAnimations();
    },

    // ========================================================================
    // THEME MANAGEMENT
    // ========================================================================

    setupTheme() {
        const themeToggle = document.getElementById('themeToggle');
        
        if (!themeToggle) return;

        // Get saved theme or use system preference
        const savedTheme = localStorage.getItem(this.config.themeStorageKey);
        const prefersDark = this.config.prefersDarkScheme.matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

        // Set initial theme
        this.setTheme(initialTheme);

        // Theme toggle click handler
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            this.setTheme(newTheme);
        });

        // Listen for system theme changes
        this.config.prefersDarkScheme.addEventListener('change', (e) => {
            if (!localStorage.getItem(this.config.themeStorageKey)) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    },

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(this.config.themeStorageKey, theme);

        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.setAttribute('aria-pressed', theme === 'dark');
        }
    },

    // ========================================================================
    // MOBILE MENU MANAGEMENT
    // ========================================================================

    setupMobileMenu() {
        const menuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

        if (!menuToggle || !mobileMenu) return;

        // Toggle menu on button click
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            this.toggleMobileMenu(!isExpanded, menuToggle, mobileMenu);
        });

        // Close menu when a link is clicked
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.toggleMobileMenu(false, menuToggle, mobileMenu);
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            const isMenuOpen = menuToggle.getAttribute('aria-expanded') === 'true';
            if (isMenuOpen && !e.target.closest('.header')) {
                this.toggleMobileMenu(false, menuToggle, mobileMenu);
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const isMenuOpen = menuToggle.getAttribute('aria-expanded') === 'true';
                if (isMenuOpen) {
                    this.toggleMobileMenu(false, menuToggle, mobileMenu);
                    menuToggle.focus();
                }
            }
        });
    },

    toggleMobileMenu(isOpen, toggle, menu) {
        toggle.setAttribute('aria-expanded', isOpen);
        
        if (isOpen) {
            menu.classList.add('active');
        } else {
            menu.classList.remove('active');
        }
    },

    // ========================================================================
    // SMOOTH SCROLL BEHAVIOR
    // ========================================================================

    setupSmoothScroll() {
        // Handle smooth scrolling for anchor links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;

            const href = link.getAttribute('href');
            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();
                
                // Close mobile menu if open
                const menuToggle = document.getElementById('mobileMenuToggle');
                if (menuToggle && menuToggle.getAttribute('aria-expanded') === 'true') {
                    this.toggleMobileMenu(false, menuToggle, document.getElementById('mobileMenu'));
                }

                // Scroll to target with offset for sticky header
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    },

    // ========================================================================
    // HERO ANIMATIONS
    // ========================================================================

    setupHeroAnimations() {
        const heroSection = document.querySelector('.hero-section');
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
    // BENEFITS SECTION ANIMATIONS
    // ========================================================================

    setupBenefitsAnimations() {
        const benefitCards = document.querySelectorAll('.benefit-card');
        if (benefitCards.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger animation with delay
                    setTimeout(() => {
                        entry.target.style.animation = `fadeInUp 0.6s ease-in-out forwards`;
                    }, index * 100);
                }
            });
        }, {
            threshold: 0.1
        });

        benefitCards.forEach(card => {
            card.style.opacity = '0';
            observer.observe(card);
        });
    },

    // ========================================================================
    // CAROUSEL FUNCTIONALITY
    // ========================================================================

    setupCarousel() {
        const carousel = document.getElementById('booksCarousel');
        const prevBtn = document.getElementById('carouselPrev');
        const nextBtn = document.getElementById('carouselNext');

        if (!carousel || !prevBtn || !nextBtn) return;

        // Scroll carousel on button click
        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({
                left: -this.config.carouselScrollAmount,
                behavior: 'smooth'
            });
        });

        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({
                left: this.config.carouselScrollAmount,
                behavior: 'smooth'
            });
        });

        // Animate book cards on scroll into view
        const bookCards = document.querySelectorAll('.book-card');
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.animation = `fadeInUp 0.6s ease-in-out forwards`;
                    }, index * 100);
                }
            });
        }, {
            threshold: 0.1
        });

        bookCards.forEach(card => {
            card.style.opacity = '0';
            cardObserver.observe(card);
        });
    },

    // ========================================================================
    // REVIEWS SECTION ANIMATIONS
    // ========================================================================

    setupReviewsAnimations() {
        const reviewCards = document.querySelectorAll('.review-card');
        if (reviewCards.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger animation with delay
                    setTimeout(() => {
                        entry.target.style.animation = `fadeInUp 0.6s ease-in-out forwards`;
                    }, index * 100);
                }
            });
        }, {
            threshold: 0.1
        });

        reviewCards.forEach(card => {
            card.style.opacity = '0';
            observer.observe(card);
        });
    },

    // ========================================================================
    // COMMUNITY SECTION ANIMATIONS
    // ========================================================================

    setupCommunityAnimations() {
        const activityItems = document.querySelectorAll('.activity-item');
        if (activityItems.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger animation with delay
                    setTimeout(() => {
                        entry.target.style.animation = `fadeInUp 0.6s ease-in-out forwards`;
                    }, index * 100);
                }
            });
        }, {
            threshold: 0.1
        });

        activityItems.forEach(item => {
            item.style.opacity = '0';
            observer.observe(item);
        });
    },

    // ========================================================================
    // ACCESSIBILITY ENHANCEMENTS
    // ========================================================================

    setupAccessibility() {
        // Ensure all interactive elements are keyboard accessible
        const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
        
        interactiveElements.forEach(element => {
            // Add focus visible styles
            element.addEventListener('focus', function() {
                if (this.matches(':focus-visible')) {
                    this.classList.add('focus-visible');
                }
            });

            element.addEventListener('blur', function() {
                this.classList.remove('focus-visible');
            });
        });

        // Skip to main content link
        this.addSkipLink();
    },

    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Saltar al contenido principal';
        skipLink.className = 'skip-link';
        document.body.insertBefore(skipLink, document.body.firstChild);
    },
};

// ============================================================================
// INITIALIZATION
// ============================================================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        BookNexusApp.init();
    });
} else {
    BookNexusApp.init();
}
