// ============================================================================
// TIMENEXUSHUB LANDING PAGE - CUSTOM JAVASCRIPT
// Mobile-First Responsive Design
// ============================================================================

// ============================================================================
// 1. APPLICATION INITIALIZATION
// ============================================================================

const TimeNexusApp = {
    // Configuration
    config: {
        headerSelector: '#timenexushub-precision-innovadora',
        mobileMenuToggleSelector: '#mobileMenuToggle',
        mobileMenuSelector: '#mobileMenu',
        themeToggleSelector: '#themeToggle',
        heroSelector: '#la-revolucion-del-tiempo-comienza-aqui',
        scrollThreshold: 50,
        mobileBreakpoint: 768,
    },

    // State
    state: {
        mobileMenuOpen: false,
        currentTheme: 'light',
        scrollPosition: 0,
        parallaxElements: [],
        scrollAnimateElements: [],
        lightboxOpen: false,
        currentImageIndex: 0,
        galleryImages: [],
        carouselScrollPosition: 0,
    },

    // DOM Elements Cache
    elements: {},

    // ========================================================================
    // 2. INITIALIZATION
    // ========================================================================

    init() {
        this.cacheElements();
        this.setupTheme();
        this.setupEventListeners();
        this.setupScrollBehavior();
        this.setupMobileMenu();
        this.setupParallax();
        this.setupScrollAnimations();
        this.setupLightbox();
        this.setupCarousel();
        console.log('TimeNexusApp initialized');
    },

    cacheElements() {
        this.elements = {
            header: document.querySelector(this.config.headerSelector),
            mobileMenuToggle: document.querySelector(this.config.mobileMenuToggleSelector),
            mobileMenu: document.querySelector(this.config.mobileMenuSelector),
            themeToggle: document.querySelector(this.config.themeToggleSelector),
            hero: document.querySelector(this.config.heroSelector),
            navLinks: document.querySelectorAll('.nav-link, .mobile-nav-link'),
            parallaxElements: document.querySelectorAll('[data-parallax="true"]'),
            scrollAnimateElements: document.querySelectorAll('[data-scroll-animate="true"]'),
            lightbox: document.getElementById('lightbox'),
            lightboxImage: document.querySelector('.lightbox-image'),
            lightboxClose: document.querySelector('.lightbox-close'),
            lightboxPrev: document.querySelector('.lightbox-prev'),
            lightboxNext: document.querySelector('.lightbox-next'),
            galleryExpandBtns: document.querySelectorAll('.gallery-expand-btn'),
            carousel: document.querySelector('.collections-carousel'),
            carouselPrev: document.getElementById('carouselPrev'),
            carouselNext: document.getElementById('carouselNext'),
        };

        // Store gallery images
        this.state.galleryImages = Array.from(document.querySelectorAll('.gallery-image')).map(img => img.src);
    },

    // ========================================================================
    // 3. THEME MANAGEMENT
    // ========================================================================

    setupTheme() {
        // Check for saved theme preference or system preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        this.state.currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        this.applyTheme(this.state.currentTheme);

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    },

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.state.currentTheme = theme;
        
        if (this.elements.themeToggle) {
            this.elements.themeToggle.setAttribute('aria-pressed', theme === 'dark');
        }
    },

    toggleTheme() {
        const newTheme = this.state.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    },

    // ========================================================================
    // 4. MOBILE MENU MANAGEMENT
    // ========================================================================

    setupMobileMenu() {
        if (!this.elements.mobileMenuToggle || !this.elements.mobileMenu) {
            return;
        }

        // Close menu when clicking on a link
        this.elements.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.state.mobileMenuOpen &&
                !this.elements.mobileMenuToggle.contains(e.target) &&
                !this.elements.mobileMenu.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.state.mobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
    },

    toggleMobileMenu() {
        if (this.state.mobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    },

    openMobileMenu() {
        this.state.mobileMenuOpen = true;
        this.elements.mobileMenuToggle.setAttribute('aria-expanded', 'true');
        this.elements.mobileMenu.removeAttribute('hidden');
        document.body.style.overflow = 'hidden';
    },

    closeMobileMenu() {
        this.state.mobileMenuOpen = false;
        this.elements.mobileMenuToggle.setAttribute('aria-expanded', 'false');
        this.elements.mobileMenu.setAttribute('hidden', '');
        document.body.style.overflow = '';
    },

    // ========================================================================
    // 5. PARALLAX EFFECT
    // ========================================================================

    setupParallax() {
        if (this.elements.parallaxElements.length === 0) {
            return;
        }

        // Store parallax elements for scroll handler
        this.state.parallaxElements = Array.from(this.elements.parallaxElements).map(el => ({
            element: el,
            image: el.querySelector('img'),
        }));
    },

    updateParallax() {
        if (this.state.parallaxElements.length === 0) {
            return;
        }

        this.state.parallaxElements.forEach(item => {
            if (!item.image) return;

            const rect = item.element.getBoundingClientRect();
            const elementTop = rect.top;
            const elementHeight = rect.height;
            const windowHeight = window.innerHeight;

            // Calculate parallax offset (only when element is in view)
            if (elementTop < windowHeight && elementTop + elementHeight > 0) {
                const scrollPercent = (windowHeight - elementTop) / (windowHeight + elementHeight);
                const scale = 1 + (scrollPercent * 0.15); // Scale from 1.0 to 1.15
                item.image.style.transform = `scale(${scale})`;
            }
        });
    },

    // ========================================================================
    // 6. SCROLL ANIMATIONS
    // ========================================================================

    setupScrollAnimations() {
        if (this.elements.scrollAnimateElements.length === 0) {
            return;
        }

        // Store scroll animate elements
        this.state.scrollAnimateElements = Array.from(this.elements.scrollAnimateElements);
        
        // Check initial state
        this.updateScrollAnimations();
    },

    updateScrollAnimations() {
        if (this.state.scrollAnimateElements.length === 0) {
            return;
        }

        this.state.scrollAnimateElements.forEach(element => {
            if (element.classList.contains('animate')) {
                return; // Already animated
            }

            const rect = element.getBoundingClientRect();
            const elementTop = rect.top;
            const windowHeight = window.innerHeight;
            const triggerPoint = windowHeight * 0.75; // Trigger at 75% of viewport

            if (elementTop < triggerPoint) {
                element.classList.add('animate');
            }
        });
    },

    // ========================================================================
    // 7. LIGHTBOX FUNCTIONALITY
    // ========================================================================

    setupLightbox() {
        if (!this.elements.lightbox) {
            return;
        }

        // Gallery expand buttons
        this.elements.galleryExpandBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const imageIndex = parseInt(btn.getAttribute('data-image-index'));
                this.openLightbox(imageIndex);
            });
        });

        // Lightbox close button
        if (this.elements.lightboxClose) {
            this.elements.lightboxClose.addEventListener('click', () => {
                this.closeLightbox();
            });
        }

        // Lightbox prev/next buttons
        if (this.elements.lightboxPrev) {
            this.elements.lightboxPrev.addEventListener('click', () => {
                this.previousImage();
            });
        }

        if (this.elements.lightboxNext) {
            this.elements.lightboxNext.addEventListener('click', () => {
                this.nextImage();
            });
        }

        // Close lightbox on background click
        this.elements.lightbox.addEventListener('click', (e) => {
            if (e.target === this.elements.lightbox) {
                this.closeLightbox();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.state.lightboxOpen) return;

            if (e.key === 'Escape') {
                this.closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                this.previousImage();
            } else if (e.key === 'ArrowRight') {
                this.nextImage();
            }
        });
    },

    openLightbox(imageIndex) {
        this.state.lightboxOpen = true;
        this.state.currentImageIndex = imageIndex;
        this.updateLightboxImage();
        this.elements.lightbox.classList.add('active');
        this.elements.lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    },

    closeLightbox() {
        this.state.lightboxOpen = false;
        this.elements.lightbox.classList.remove('active');
        this.elements.lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    },

    updateLightboxImage() {
        const image = this.state.galleryImages[this.state.currentImageIndex];
        if (this.elements.lightboxImage) {
            this.elements.lightboxImage.src = image;
        }

        // Update counter
        const currentSpan = document.querySelector('.lightbox-current');
        if (currentSpan) {
            currentSpan.textContent = this.state.currentImageIndex + 1;
        }
    },

    previousImage() {
        this.state.currentImageIndex = (this.state.currentImageIndex - 1 + this.state.galleryImages.length) % this.state.galleryImages.length;
        this.updateLightboxImage();
    },

    nextImage() {
        this.state.currentImageIndex = (this.state.currentImageIndex + 1) % this.state.galleryImages.length;
        this.updateLightboxImage();
    },

    // ========================================================================
    // 8. CAROUSEL FUNCTIONALITY
    // ========================================================================

    setupCarousel() {
        if (!this.elements.carousel) {
            return;
        }

        // Carousel navigation buttons
        if (this.elements.carouselPrev) {
            this.elements.carouselPrev.addEventListener('click', () => {
                this.scrollCarousel('prev');
            });
        }

        if (this.elements.carouselNext) {
            this.elements.carouselNext.addEventListener('click', () => {
                this.scrollCarousel('next');
            });
        }
    },

    scrollCarousel(direction) {
        if (!this.elements.carousel) return;

        const cardWidth = this.elements.carousel.querySelector('.collection-card')?.offsetWidth || 320;
        const gap = 32; // gap from CSS
        const scrollAmount = cardWidth + gap;

        if (direction === 'prev') {
            this.elements.carousel.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth',
            });
        } else {
            this.elements.carousel.scrollBy({
                left: scrollAmount,
                behavior: 'smooth',
            });
        }
    },

    // ========================================================================
    // 9. SCROLL BEHAVIOR
    // ========================================================================

    setupScrollBehavior() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    },

    handleScroll() {
        this.state.scrollPosition = window.scrollY;

        // Add scrolled class to header
        if (this.elements.header) {
            if (this.state.scrollPosition > this.config.scrollThreshold) {
                this.elements.header.classList.add('scrolled');
            } else {
                this.elements.header.classList.remove('scrolled');
            }
        }

        // Update parallax effect
        this.updateParallax();

        // Update scroll animations
        this.updateScrollAnimations();
    },

    // ========================================================================
    // 10. EVENT LISTENERS
    // ========================================================================

    setupEventListeners() {
        // Theme toggle
        if (this.elements.themeToggle) {
            this.elements.themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Mobile menu toggle
        if (this.elements.mobileMenuToggle) {
            this.elements.mobileMenuToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // Smooth scroll for anchor links
        this.setupSmoothScroll();

        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    },

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

                // Scroll to target
                const headerHeight = this.elements.header?.offsetHeight || 80;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth',
                });
            }
        });
    },

    handleResize() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth >= this.config.mobileBreakpoint && this.state.mobileMenuOpen) {
            this.closeMobileMenu();
        }
    },

    // ========================================================================
    // 11. UTILITY METHODS
    // ========================================================================

    log(message, data = null) {
        if (data) {
            console.log(`[TimeNexusApp] ${message}`, data);
        } else {
            console.log(`[TimeNexusApp] ${message}`);
        }
    },
};

// ============================================================================
// 12. DOCUMENT READY
// ============================================================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        TimeNexusApp.init();
    });
} else {
    TimeNexusApp.init();
}
