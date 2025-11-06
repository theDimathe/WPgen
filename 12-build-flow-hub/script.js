// ============================================================================
// BUILDFLOWHU B - LANDING PAGE JAVASCRIPT
// Custom vanilla JavaScript without external dependencies
// ============================================================================

// ============================================================================
// APPLICATION INITIALIZATION
// ============================================================================

const App = {
    // Configuration
    config: {
        themeStorageKey: 'buildflowhu b-theme',
        prefersDarkScheme: window.matchMedia('(prefers-color-scheme: dark)'),
        cookieConsentKey: 'buildflowhub-cookie-consent',
    },

    // Initialize the application
    init()  {
        this.setupTheme();
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupAccessibility();
        this.setupHeroCounters();
        this.setupAboutCounters();
        this.setupAdvantagesAnimation();
        this.setupGalleryAnimation();
        this.setupTestimonialsCarousel();
        this.setupCookieBanner();
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
        const html = document.documentElement;
        const themeToggle = document.getElementById('themeToggle');

        if (theme === 'dark') {
            html.setAttribute('data-theme', 'dark');
            if (themeToggle) themeToggle.setAttribute('aria-pressed', 'true');
        } else {
            html.removeAttribute('data-theme');
            if (themeToggle) themeToggle.setAttribute('aria-pressed', 'false');
        }

        localStorage.setItem(this.config.themeStorageKey, theme);
    },

    // ========================================================================
    // MOBILE MENU MANAGEMENT
    // ========================================================================

    setupMobileMenu() {
        const menuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileLinks = document.querySelectorAll('.mobile-nav-link');

        if (!menuToggle || !mobileMenu) return;

        // Toggle menu on button click
        menuToggle.addEventListener('click', () => {
            const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
            this.toggleMobileMenu(!isOpen);
        });

        // Close menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.toggleMobileMenu(false);
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            const isClickInside = mobileMenu.contains(e.target) || menuToggle.contains(e.target);
            if (!isClickInside && menuToggle.getAttribute('aria-expanded') === 'true') {
                this.toggleMobileMenu(false);
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
                this.toggleMobileMenu(false);
            }
        });
    },

    toggleMobileMenu(isOpen) {
        const menuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenu = document.getElementById('mobileMenu');

        if (!menuToggle || !mobileMenu) return;

        menuToggle.setAttribute('aria-expanded', isOpen);
        
        if (isOpen) {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    },

    // ========================================================================
    // SMOOTH SCROLL BEHAVIOR
    // ========================================================================

    setupSmoothScroll() {
        // Close mobile menu when scrolling
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const menuToggle = document.getElementById('mobileMenuToggle');
                if (menuToggle && menuToggle.getAttribute('aria-expanded') === 'true') {
                    this.toggleMobileMenu(false);
                }
            }, 100);
        });
    },

    // ========================================================================
    // HERO COUNTERS
    // ========================================================================

    setupHeroCounters() {
        const counters = document.querySelectorAll('.hero-section .stat-number');
        
        if (counters.length === 0) return;

        // Create intersection observer for counter animation
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    this.animateCounter(entry.target);
                    entry.target.classList.add('counted');
                }
            });
        }, observerOptions);

        counters.forEach(counter => {
            observer.observe(counter);
        });
    },

    // ========================================================================
    // ABOUT COUNTERS
    // ========================================================================

    setupAboutCounters() {
        const counters = document.querySelectorAll('.about-section .about-stat-number');
        
        if (counters.length === 0) return;

        // Create intersection observer for counter animation
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    this.animateAboutCounter(entry.target);
                    entry.target.classList.add('counted');
                }
            });
        }, observerOptions);

        counters.forEach(counter => {
            observer.observe(counter);
        });
    },

    // ========================================================================
    // ADVANTAGES ANIMATION
    // ========================================================================

    setupAdvantagesAnimation() {
        const advantageColumns = document.querySelectorAll('.advantage-column');
        
        if (advantageColumns.length === 0) return;

        // Create intersection observer for advantages animation
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    entry.target.classList.add('animated');
                }
            });
        }, observerOptions);

        advantageColumns.forEach(column => {
            observer.observe(column);
        });
    },

    // ========================================================================
    // GALLERY ANIMATION
    // ========================================================================

    setupGalleryAnimation() {
        const galleryCards = document.querySelectorAll('.gallery-card');
        
        if (galleryCards.length === 0) return;

        // Create intersection observer for gallery animation
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    entry.target.classList.add('animated');
                }
            });
        }, observerOptions);

        galleryCards.forEach(card => {
            observer.observe(card);
        });
    },

    // ========================================================================
    // TESTIMONIALS CAROUSEL
    // ========================================================================

    setupTestimonialsCarousel() {
        const track = document.getElementById('testimonialsTrack');
        const prevBtn = document.getElementById('carouselPrev');
        const nextBtn = document.getElementById('carouselNext');
        const dotsContainer = document.getElementById('carouselDots');

        if (!track) return;

        const cards = track.querySelectorAll('.testimonial-card');
        const cardCount = cards.length;
        let currentIndex = 0;

        // Create dots
        if (dotsContainer) {
            for (let i = 0; i < cardCount; i++) {
                const dot = document.createElement('button');
                dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
                dot.setAttribute('aria-label', `Ir al testimonial ${i + 1}`);
                dot.addEventListener('click', () => this.goToSlide(currentIndex, i, track, cards, dotsContainer));
                dotsContainer.appendChild(dot);
            }
        }

        // Navigation handlers
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + cardCount) % cardCount;
                this.goToSlide(currentIndex, currentIndex, track, cards, dotsContainer);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % cardCount;
                this.goToSlide(currentIndex, currentIndex, track, cards, dotsContainer);
            });
        }

        // Auto-scroll on mobile
        if (window.innerWidth < 768) {
            track.addEventListener('scroll', () => {
                const scrollLeft = track.scrollLeft;
                const cardWidth = cards[0].offsetWidth + 24; // gap
                currentIndex = Math.round(scrollLeft / cardWidth);
                this.updateDots(currentIndex, dotsContainer);
            });
        }
    },

    goToSlide(oldIndex, newIndex, track, cards, dotsContainer) {
        if (window.innerWidth >= 768) return; // Desktop doesn't need scroll

        const cardWidth = cards[0].offsetWidth + 24; // gap
        track.scrollLeft = newIndex * cardWidth;
        this.updateDots(newIndex, dotsContainer);
    },

    updateDots(index, dotsContainer) {
        if (!dotsContainer) return;

        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    },

    // ========================================================================
    // COOKIE CONSENT BANNER
    // ========================================================================

    setupCookieBanner() {
        const banner = document.querySelector('.cookie-banner');
        if (!banner) return;

        let storedChoice = null;
        try {
            storedChoice = localStorage.getItem(this.config.cookieConsentKey);
        } catch (error) {
            storedChoice = null;
        }

        if (storedChoice) {
            banner.setAttribute('hidden', '');
            return;
        }

        const acceptButton = banner.querySelector('[data-cookie-accept]');
        const declineButton = banner.querySelector('[data-cookie-decline]');

        banner.removeAttribute('hidden');

        const persistChoice = (choice) => {
            try {
                localStorage.setItem(this.config.cookieConsentKey, choice);
            } catch (error) {
                // Ignore storage errors
            }
            banner.setAttribute('hidden', '');
        };

        if (acceptButton) {
            acceptButton.addEventListener('click', () => persistChoice('accepted'));
        }

        if (declineButton) {
            declineButton.addEventListener('click', () => persistChoice('declined'));
        }
    },

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'), 10);
        const duration = 1500; // 1.5 seconds
        const start = Date.now();

        const updateCounter = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(progress * target);
            
            element.textContent = current + '+';

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };

        updateCounter();
    },

    animateAboutCounter(element) {
        const target = parseInt(element.getAttribute('data-target'), 10);
        const duration = 1500; // 1.5 seconds
        const start = Date.now();

        const updateCounter = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(progress * target);
            
            // Format based on target value
            if (target === 24) {
                element.textContent = current + '/7';
            } else if (target === 0) {
                element.textContent = '✓';
            } else {
                element.textContent = current + (target === 100 ? '%' : '');
            }

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };

        updateCounter();
    },

    // ========================================================================
    // ACCESSIBILITY ENHANCEMENTS
    // ========================================================================

    setupAccessibility() {
        // Add focus visible styles for keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-nav');
        });

        // Ensure all interactive elements are keyboard accessible
        const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
        interactiveElements.forEach(element => {
            if (!element.hasAttribute('tabindex')) {
                element.setAttribute('tabindex', '0');
            }
        });
    },
};

// ============================================================================
// INITIALIZATION
// ============================================================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        App.init();
    });
} else {
    App.init();
}
