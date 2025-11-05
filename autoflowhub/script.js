// ============================================================================
// AUTOFLOWHUB LANDING PAGE - CUSTOM JAVASCRIPT
// Mobile-First Responsive Design | No External Dependencies
// ============================================================================

// ============================================================================
// APPLICATION STATE & INITIALIZATION
// ============================================================================

const App = {
    // State
    state: {
        theme: localStorage.getItem('theme') || 'light',
        mobileMenuOpen: false,
        headerScrolled: false,
        statsAnimated: false,
    },

    // Initialize application
    init() {
        this.setupTheme();
        this.setupHeader();
        this.setupMobileMenu();
        this.setupScrollBehavior();
        this.setupSmoothScroll();
        this.setupParallax();
        this.setupIntersectionObserver();
        this.setupStatisticsAnimation();
    },

    // ========================================================================
    // THEME MANAGEMENT
    //========================================================================

    setupTheme() {
        // Apply saved theme
        document.documentElement.setAttribute('data-theme', this.state.theme);

        // Setup theme toggle button
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    this.state.theme = e.matches ? 'dark' : 'light';
                    document.documentElement.setAttribute('data-theme', this.state.theme);
                }
            });
        }
    },

    toggleTheme() {
        this.state.theme = this.state.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.state.theme);
        localStorage.setItem('theme', this.state.theme);
    },

    // ========================================================================
    // HEADER MANAGEMENT
    // ========================================================================

    setupHeader() {
        const header = document.getElementById('autoflowhub-el-flujo-inteligente-del-mundo-automotriz');
        if (!header) return;

        window.addEventListener('scroll', () => {
            const isScrolled = window.scrollY > 50;
            if (isScrolled !== this.state.headerScrolled) {
                this.state.headerScrolled = isScrolled;
                header.classList.toggle('scrolled', isScrolled);
            }
        });
    },

    // ========================================================================
    // MOBILE MENU MANAGEMENT
    // ========================================================================

    setupMobileMenu() {
        const toggle = document.getElementById('mobileMenuToggle');
        const menu = document.getElementById('mobileMenu');

        if (!toggle || !menu) return;

        // Toggle menu on button click
        toggle.addEventListener('click', () => {
            this.state.mobileMenuOpen = !this.state.mobileMenuOpen;
            this.updateMobileMenu(toggle, menu);
        });

        // Close menu when clicking on a link
        const links = menu.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                this.state.mobileMenuOpen = false;
                this.updateMobileMenu(toggle, menu);
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!toggle.contains(e.target) && !menu.contains(e.target)) {
                if (this.state.mobileMenuOpen) {
                    this.state.mobileMenuOpen = false;
                    this.updateMobileMenu(toggle, menu);
                }
            }
        });

        // Close menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768 && this.state.mobileMenuOpen) {
                this.state.mobileMenuOpen = false;
                this.updateMobileMenu(toggle, menu);
            }
        });
    },

    updateMobileMenu(toggle, menu) {
        toggle.setAttribute('aria-expanded', this.state.mobileMenuOpen);
        menu.setAttribute('aria-hidden', !this.state.mobileMenuOpen);
        menu.hidden = !this.state.mobileMenuOpen;
    },

    // ========================================================================
    // SCROLL BEHAVIOR
    // ========================================================================

    setupScrollBehavior() {
        // Adjust scroll position for fixed header
        window.addEventListener('hashchange', () => {
            this.scrollToHash();
        });

        // Initial scroll if hash exists
        if (window.location.hash) {
            setTimeout(() => this.scrollToHash(), 100);
        }
    },

    scrollToHash() {
        const hash = window.location.hash;
        if (!hash) return;

        const element = document.querySelector(hash);
        if (!element) return;

        const headerHeight = 80; // Approximate header height
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerHeight;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
        });
    },

    // ========================================================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
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
            if (this.state.mobileMenuOpen) {
                this.state.mobileMenuOpen = false;
                const toggle = document.getElementById('mobileMenuToggle');
                const menu = document.getElementById('mobileMenu');
                if (toggle && menu) {
                    this.updateMobileMenu(toggle, menu);
                }
            }

            // Update URL
            window.history.pushState(null, null, href);

            // Scroll to target
            this.scrollToHash();
        });
    },

    // ========================================================================
    // PARALLAX EFFECT
    // ========================================================================

    setupParallax() {
        const heroSection = document.getElementById('el-flujo-inteligente-del-mundo-automotriz');
        if (!heroSection) return;

        const heroBackground = heroSection.querySelector('.hero-background');
        if (!heroBackground) return;

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const parallaxOffset = scrollY * 0.03; // Subtle parallax effect
            heroBackground.style.transform = `translateY(${parallaxOffset}px)`;
        });
    },

    // ========================================================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ========================================================================

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe about features for fade-in animation
        const aboutFeatures = document.querySelectorAll('.about-feature');
        aboutFeatures.forEach((feature, index) => {
            feature.style.opacity = '0';
            feature.style.transform = 'translateY(20px)';
            feature.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;
            observer.observe(feature);
        });

        // Observe service cards for fade-in animation
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;
            observer.observe(card);
        });

        // Observe advantage items for fade-in animation
        const advantageItems = document.querySelectorAll('.advantage-item');
        advantageItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;
            observer.observe(item);
        });

        // Observe testimonial items for fade-in animation
        const testimonialItems = document.querySelectorAll('.testimonial-item');
        testimonialItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;
            observer.observe(item);
        });
    },

    // ========================================================================
    // STATISTICS ANIMATION
    // ========================================================================

    setupStatisticsAnimation() {
        const observerOptions = {
            threshold: 0.5,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.state.statsAnimated) {
                    this.state.statsAnimated = true;
                    this.animateStatistics();
                }
            });
        }, observerOptions);

        const statsGroup = document.querySelector('.stats-group');
        if (statsGroup) {
            observer.observe(statsGroup);
        }
    },

    animateStatistics() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(element => {
            const targetValue = parseInt(element.getAttribute('data-count'), 10);
            const duration = 2000; // 2 seconds
            const startTime = Date.now();
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const currentValue = Math.floor(progress * targetValue);
                
                element.textContent = currentValue.toLocaleString('es-MX');
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            
            animate();
        });
    },
};

// ============================================================================
// INITIALIZATION
// ============================================================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}
