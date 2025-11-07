// ============================================
// NEXTAPPDEVTOOLKIT LANDING PAGE
// Main Application Controller
// ============================================

const App = {
    // Configuration
    config: {
        themeStorageKey: 'nextappdevtoolkit-theme',
        prefersDarkScheme: window.matchMedia('(prefers-color-scheme: dark)'),
    },

    // Initialize the application
    init() {
        this.setupTheme();
        this.setupMobileMenu();
        this.setupNavigation();
        this.setupEventListeners();
        this.setupHeroParallax();
        this.setupFrameworksDiagram();
    },

    // ============================================
    // THEME MANAGEMENT
    // ============================================

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

        // Update theme toggle button state
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.setAttribute('aria-pressed', theme === 'dark');
        }
    },

    toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    },

    // ============================================
    // MOBILE MENU MANAGEMENT
    // ============================================

    setupMobileMenu() {
        const menuToggle = document.getElementById('mobileMenuToggle');
        const mobileNav = document.getElementById('mobileNav');

        if (!menuToggle || !mobileNav) return;

        // Toggle menu on button click
        menuToggle.addEventListener('click', () => {
            const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
            this.setMobileMenuState(!isOpen);
        });

        // Close menu when clicking on a link
        const navLinks = mobileNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.setMobileMenuState(false);
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            const isClickInside = mobileNav.contains(e.target) || menuToggle.contains(e.target);
            if (!isClickInside && menuToggle.getAttribute('aria-expanded') === 'true') {
                this.setMobileMenuState(false);
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
                this.setMobileMenuState(false);
            }
        });
    },

    setMobileMenuState(isOpen) {
        const menuToggle = document.getElementById('mobileMenuToggle');
        const mobileNav = document.getElementById('mobileNav');

        if (!menuToggle || !mobileNav) return;

        menuToggle.setAttribute('aria-expanded', isOpen);
        if (isOpen) {
            mobileNav.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        }
    },

    // ============================================
    // NAVIGATION MANAGEMENT
    // ============================================

    setupNavigation() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth',
                    });
                }
            });
        });
    },

    // ============================================
    // HERO PARALLAX EFFECT
    // ============================================

    setupHeroParallax() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const heroTop = hero.offsetTop;
            const heroHeight = hero.offsetHeight;
            const windowHeight = window.innerHeight;

            // Only apply parallax when hero is in view
            if (scrollY + windowHeight > heroTop && scrollY < heroTop + heroHeight) {
                const parallaxOffset = (scrollY - heroTop) * 0.5;
                const background = hero.querySelector('.hero-background');
                if (background) {
                    background.style.transform = `translateY(${parallaxOffset}px)`;
                }
            }
        });
    },

    // ============================================
    // FRAMEWORKS DIAGRAM ANIMATION
    // ============================================

    setupFrameworksDiagram() {
        const diagramSvg = document.querySelector('.diagram-svg');
        if (!diagramSvg) return;

        // Trigger animation when diagram comes into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'none';
                    // Trigger reflow to restart animation
                    void entry.target.offsetWidth;
                    entry.target.style.animation = '';
                }
            });
        }, { threshold: 0.5 });

        observer.observe(diagramSvg);
    },

    // ============================================
    // EVENT LISTENERS
    // ============================================

    setupEventListeners() {
        // Theme toggle button
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Update header on scroll
        window.addEventListener('scroll', () => this.updateHeaderOnScroll());
    },

    updateHeaderOnScroll() {
        const header = document.querySelector('header');
        if (!header) return;

        if (window.scrollY > 10) {
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
    },
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}
