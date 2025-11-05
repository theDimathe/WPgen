// ============================================================================
// NEXTCARDRIVEMASTER - CUSTOM JAVASCRIPT
// Mobile-First Responsive Functionality without External Libraries
// ============================================================================

/**
 * Main Application Object
 * Manages all functionality for the landing page
 */
const App = {
    // Configuration
    config: {
        themeStorageKey: 'nextcardrivemaster-theme',
        prefersDarkScheme: window.matchMedia('(prefers-color-scheme: dark)'),
    },

    // Initialize the application
    init() {
        this.setupTheme();
        this.setupMobileMenu();
        this.setupNavigation();
        this.setupEventListeners();
        this.setupParallax();
        this.setupScrollAnimations();
    },

    /**
     * Theme Management
     */
    setupTheme() {
        const savedTheme = localStorage.getItem(this.config.themeStorageKey);
        const prefersDark = this.config.prefersDarkScheme.matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

        this.setTheme(initialTheme);

        // Listen for system theme changes
        this.config.prefersDarkScheme.addEventListener('change', (e) => {
            if (!localStorage.getItem(this.config.themeStorageKey)) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    },

    setTheme(theme) {
        const html = document.documentElement;
        html.setAttribute('data-theme', theme);
        localStorage.setItem(this.config.themeStorageKey, theme);
    },

    toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    },

    /**
     * Mobile Menu Management
     */
    setupMobileMenu() {
        const toggle = document.getElementById('mobile-menu-toggle');
        const menu = document.getElementById('mobile-menu');

        if (!toggle || !menu) return;

        // Toggle menu on button click
        toggle.addEventListener('click', () => {
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
            this.setMobileMenuState(!isExpanded, toggle, menu);
        });

        // Close menu when clicking on a link
        const links = menu.querySelectorAll('a');
        links.forEach((link) => {
            link.addEventListener('click', () => {
                this.setMobileMenuState(false, toggle, menu);
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            const isClickInside = toggle.contains(e.target) || menu.contains(e.target);
            if (!isClickInside && toggle.getAttribute('aria-expanded') === 'true') {
                this.setMobileMenuState(false, toggle, menu);
            }
        });

        // Close menu on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
                this.setMobileMenuState(false, toggle, menu);
                toggle.focus();
            }
        });
    },

    setMobileMenuState(isOpen, toggle, menu) {
        toggle.setAttribute('aria-expanded', isOpen);
        if (isOpen) {
            menu.removeAttribute('hidden');
        } else {
            menu.setAttribute('hidden', '');
        }
    },

    /**
     * Navigation Setup
     */
    setupNavigation() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const headerHeight = document.querySelector('.site-header')?.offsetHeight || 70;
                    const targetPosition = target.offsetTop - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth',
                    });
                }
            });
        });
    },

    /**
     * Parallax Effect for Hero Section
     */
    setupParallax() {
        const heroBgImage = document.querySelector('.hero-bg-image');
        if (!heroBgImage) return;

        window.addEventListener('scroll',  () => {
            const scrollPosition = window.scrollY;
            const parallaxOffset = scrollPosition * 0.5;
            heroBgImage.style.transform = `translateY(${parallaxOffset}px)`;
        }, { passive: true });
    },

    /**
     * Scroll Animations for Elements
     */
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe value items for fade-in animation
        document.querySelectorAll('.value-item').forEach((item) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(item);
        });

        // Observe category cards for fade-in animation
        document.querySelectorAll('.category-card').forEach((card) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });

        // Observe benefit items for fade-in animation
        document.querySelectorAll('.benefit-item').forEach((item) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(item);
        });

        // Observe car cards for fade-in animation
        document.querySelectorAll('.car-card').forEach((card) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    },

    /**
     * Event Listeners Setup
     */
    setupEventListeners() {
        // Theme toggle button
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Search button (placeholder for future functionality)
        const searchBtn = document.querySelector('.search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                console.log('Search functionality to be implemented');
            });
        }
    },
};

/**
 * Initialize app when DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}
