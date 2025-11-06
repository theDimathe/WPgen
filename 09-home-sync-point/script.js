// ============================================================================
// HOMESYNCPOINT LANDING PAGE - CUSTOM JAVASCRIPT
// Mobile-First Interactive Functionality
// ============================================================================

class HomeSyncPointApp {
    constructor() {
        this.cookieConsentKey = 'homesyncpoint-cookie-consent';
        this.init();
    }

    init() {
        this.setupThemeToggle();
        this.setupMobileMenu();
        this.setupHeaderScroll();
        this.setupSmoothScroll();
        this.setupParallax();
        this.setupIntersectionObserver();
        this.setupPropertyFilters();
        this.setupCookieBanner();
    }

    // ========================================================================
    // THEME TOGGLE FUNCTIONALITY
    // ========================================================================

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        // Get saved theme or use system preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

        this.setTheme(initialTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            this.setTheme(newTheme);
        });

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.setAttribute('aria-pressed', theme === 'dark');
        }
    }

    // ========================================================================
    // MOBILE MENU FUNCTIONALITY
    // ========================================================================

    setupMobileMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const navMobile = document.getElementById('nav-mobile');
        const navLinks = document.querySelectorAll('.nav-link-mobile');

        if (!menuToggle || !navMobile) return;

        // Toggle menu
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            this.toggleMenu(!isExpanded, menuToggle, navMobile);
        });

        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.toggleMenu(false, menuToggle, navMobile);
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            const isMenuOpen = menuToggle.getAttribute('aria-expanded') === 'true';
            if (isMenuOpen && !e.target.closest('.header')) {
                this.toggleMenu(false, menuToggle, navMobile);
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const isMenuOpen = menuToggle.getAttribute('aria-expanded') === 'true';
                if (isMenuOpen) {
                    this.toggleMenu(false, menuToggle, navMobile);
                    menuToggle.focus();
                }
            }
        });
    }

    toggleMenu(isOpen, menuToggle, navMobile) {
        menuToggle.setAttribute('aria-expanded', isOpen);
        navMobile.setAttribute('aria-hidden', !isOpen);

        if (isOpen) {
            navMobile.removeAttribute('hidden');
        } else {
            navMobile.setAttribute('hidden', '');
        }
    }

    // ========================================================================
    // HEADER SCROLL EFFECT
    // ========================================================================

    setupHeaderScroll() {
        const header = document.getElementById('homesyncpoint');
        if (!header) return;

        let lastScrollTop = 0;

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > 10) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScrollTop = scrollTop;
        }, { passive: true });
    }

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
            const menuToggle = document.getElementById('menuToggle');
            if (menuToggle && menuToggle.getAttribute('aria-expanded') === 'true') {
                const navMobile = document.getElementById('nav-mobile');
                this.toggleMenu(false, menuToggle, navMobile);
            }

            // Scroll to target
            const headerHeight = document.getElementById('homesyncpoint')?.offsetHeight || 80;
            const targetPosition = target.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    }

    // ========================================================================
    // PARALLAX EFFECT FOR HERO SECTION
    // ========================================================================

    setupParallax() {
        const heroBackground = document.querySelector('.hero-background');
        if (!heroBackground) return;

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const parallaxOffset = scrollTop * 0.3;
            heroBackground.style.transform = `translateY(${parallaxOffset}px)`;
        }, { passive: true });
    }

    // ========================================================================
    // INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
    // ========================================================================

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe feature blocks
        document.querySelectorAll('.feature-block').forEach(block => {
            observer.observe(block);
        });

        // Observe why-choose feature blocks
        document.querySelectorAll('.why-feature-block').forEach(block => {
            observer.observe(block);
        });

        // Observe how-it-works steps
        document.querySelectorAll('.how-it-works-step').forEach(step => {
            observer.observe(step);
        });

        // Observe testimonial cards
        document.querySelectorAll('.testimonial-card').forEach(card => {
            observer.observe(card);
        });
    }

    // ========================================================================
    // PROPERTY FILTERS FUNCTIONALITY
    // ========================================================================

    setupPropertyFilters() {
        const filterType = document.getElementById('filter-type');
        const filterCity = document.getElementById('filter-city');
        const filterPrice = document.getElementById('filter-price');
        const propertyCards = document.querySelectorAll('.property-card');

        if (!filterType || !filterCity || !filterPrice) return;

        const applyFilters = () => {
            const selectedType = filterType.value;
            const selectedCity = filterCity.value;
            const selectedPrice = filterPrice.value;

            propertyCards.forEach(card => {
                const cardType = card.getAttribute('data-type');
                const cardCity = card.getAttribute('data-city');
                const cardPrice = parseInt(card.getAttribute('data-price'));

                let typeMatch = !selectedType || cardType === selectedType;
                let cityMatch = !selectedCity || cardCity === selectedCity;
                let priceMatch = true;

                if (selectedPrice) {
                    if (selectedPrice === '0-500000') {
                        priceMatch = cardPrice <= 500000;
                    } else if (selectedPrice === '500000-1000000') {
                        priceMatch = cardPrice > 500000 && cardPrice <= 1000000;
                    } else if (selectedPrice === '1000000-5000000') {
                        priceMatch = cardPrice > 1000000 && cardPrice <= 5000000;
                    } else if (selectedPrice === '5000000+') {
                        priceMatch = cardPrice > 5000000;
                    }
                }

                if (typeMatch && cityMatch && priceMatch) {
                    card.style.display = '';
                    setTimeout(() => {
                        card.style.opacity = '1';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        };

        filterType.addEventListener('change', applyFilters);
        filterCity.addEventListener('change', applyFilters);
        filterPrice.addEventListener('change', applyFilters);

        // Add transition to property cards
        propertyCards.forEach(card => {
            card.style.transition = 'opacity 0.3s ease-in-out';
            card.style.opacity = '1';
        });
    }

    setupCookieBanner() {
        const banner = document.getElementById('cookie-banner');
        const acceptButton = document.getElementById('cookie-accept');
        const rejectButton = document.getElementById('cookie-reject');

        if (!banner || !acceptButton) return;

        const consent = localStorage.getItem(this.cookieConsentKey);
        if (consent === 'accepted' || consent === 'rejected') {
            banner.remove();
            return;
        }

        banner.removeAttribute('hidden');
        requestAnimationFrame(() => {
            banner.classList.add('is-visible');
        });

        const closeBanner = (status) => {
            localStorage.setItem(this.cookieConsentKey, status);
            banner.classList.remove('is-visible');
            setTimeout(() => banner.remove(), 400);
        };

        acceptButton.addEventListener('click', () => closeBanner('accepted'));
        rejectButton?.addEventListener('click', () => closeBanner('rejected'));
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new HomeSyncPointApp();
    });
} else {
    new HomeSyncPointApp();
}
