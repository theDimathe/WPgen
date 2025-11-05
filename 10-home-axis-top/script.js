// ============================================================================
// HOMEAXISTOP LANDING PAGE - CUSTOM JAVASCRIPT
// Mobile-First Responsive Design without External Libraries
// ============================================================================

class HomeAxisTopApp {
    constructor() {
        this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
        this.init();
    }

    init() {
        this.setupTheme();
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupAccessibility();
        this.setupHeroAnimations();
        this.setupScrollAnimations();
        this.setupPropertyFilters();
    }

    // ========================================================================
    // THEME MANAGEMENT
    // ========================================================================

    getStoredTheme() {
        try {
            return localStorage.getItem('theme');
        } catch (e) {
            return null;
        }
    }

    getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        try {
            localStorage.setItem('theme', theme);
        } catch (e) {
            console.warn('Could not save theme preference');
        }
    }

    setupTheme() {
        // Set initial theme
        this.setTheme(this.currentTheme);

        // Setup theme toggle button
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
            this.updateThemeToggleState();
        }

        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!this.getStoredTheme()) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                    this.updateThemeToggleState();
                }
            });
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        this.updateThemeToggleState();
    }

    updateThemeToggleState() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.setAttribute('aria-pressed', this.currentTheme === 'dark');
        }
    }

    // ========================================================================
    // MOBILE MENU MANAGEMENT
    // ========================================================================

    setupMobileMenu() {
        const menuToggle = document.getElementById('mobileMenuToggle');
        const mobileNav = document.getElementById('mobileNav');

        if (!menuToggle || !mobileNav) return;

        // Toggle menu on button click
        menuToggle.addEventListener('click', () => {
            this.toggleMobileMenu(menuToggle, mobileNav);
        });

        // Close menu when clicking on a link
        const navLinks = mobileNav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu(menuToggle, mobileNav);
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !mobileNav.contains(e.target)) {
                this.closeMobileMenu(menuToggle, mobileNav);
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu(menuToggle, mobileNav);
            }
        });
    }

    toggleMobileMenu(menuToggle, mobileNav) {
        const isActive = menuToggle.classList.contains('active');
        if (isActive) {
            this.closeMobileMenu(menuToggle, mobileNav);
        } else {
            this.openMobileMenu(menuToggle, mobileNav);
        }
    }

    openMobileMenu(menuToggle, mobileNav) {
        menuToggle.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        mobileNav.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeMobileMenu(menuToggle, mobileNav) {
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ========================================================================
    // SMOOTH SCROLL
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
            const menuToggle = document.getElementById('mobileMenuTog gle');
            const mobileNav = document.getElementById('mobileNav');
            if (menuToggle && mobileNav && menuToggle.classList.contains('active')) {
                this.closeMobileMenu(menuToggle, mobileNav);
            }

            // Scroll to target
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    }

    // ========================================================================
    // HERO ANIMATIONS
    // ========================================================================

    setupHeroAnimations() {
        const heroSection = document.getElementById('conecta-con-el-hogar-de-tus-suenos');
        if (!heroSection) return;

        // Observe hero section for intersection
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, { threshold: 0.1 });

            observer.observe(heroSection);
        }
    }

    // ========================================================================
    // SCROLL ANIMATIONS
    // ========================================================================

    setupScrollAnimations() {
        if (!('IntersectionObserver' in window)) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all sections
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            observer.observe(section);
        });
    }

    // ========================================================================
    // PROPERTY FILTERS
    // ========================================================================

    setupPropertyFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const propertyCards = document.querySelectorAll('.property-card');

        if (filterBtns.length === 0 || propertyCards.length === 0) return;

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');

                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter cards
                propertyCards.forEach(card => {
                    if (filter === 'all') {
                        card.style.display = '';
                    } else {
                        const cardFilter = card.getAttribute(`data-${filter}`);
                        card.style.display = cardFilter ? '' : 'none';
                    }
                });
            });
        });
    }

    // ========================================================================
    // ACCESSIBILITY
    // ========================================================================

    setupAccessibility() {
        // Ensure all interactive elements are keyboard accessible
        this.makeElementsKeyboardAccessible();

        // Setup focus management
        this.setupFocusManagement();
    }

    makeElementsKeyboardAccessible() {
        const buttons = document.querySelectorAll('button:not([tabindex])');
        buttons.forEach(button => {
            if (!button.hasAttribute('tabindex')) {
                button.setAttribute('tabindex', '0');
            }
        });
    }

    setupFocusManagement() {
        // Add visible focus styles for keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-nav');
        });
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    new HomeAxisTopApp();
});
