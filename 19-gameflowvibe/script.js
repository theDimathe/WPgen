// GameFlowVibe Landing Page - Custom JavaScript

class GameFlowVibe {
    constructor() {
        this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
        this.init();
    }

    init() {
        this.setupTheme();
        this.setupHeader();
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupHeroAnimations();
        this.setupIntersectionObserver();
        this.setupParallaxEffects();
        this.setupCounters();
        this.setupProgressIndicators();
        this.setupEventFilters();
        this.setupCookieBanner();
    }

    /* ========================================================================
       THEME MANAGEMENT
       ======================================================================== */

    getStoredTheme() {
        try {
            return localStorage.getItem('gfv-theme');
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
        try {
            localStorage.setItem('gfv-theme', theme);
        } catch (e) {
            console.warn('Could not save theme preference');
        }

        if (theme === 'light') {
            document.body.classList.add('light-mode');
        } else {
            document.body.classList.remove('light-mode');
        }
    }

    setupTheme() {
        this.setTheme(this.currentTheme);

        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
                this.setTheme(newTheme);
                themeToggle.setAttribute('aria-pressed', newTheme === 'light');
            });

            // Set initial aria-pressed state
            themeToggle.setAttribute('aria-pressed', this.currentTheme === 'light');
        }

        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!this.getStoredTheme()) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }

    /* ========================================================================
       HEADER MANAGEMENT
       ======================================================================== */

    setupHeader() {
        const header = document.getElementById('gameflowvibe-tu-comunidad-gaming');
        if (!header) return;

        // Add scroll effect to header
        let lastScrollTop = 0;
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                header.style.boxShadow = '0 4px 20px rgba(157, 78, 221, 0.2)';
            } else {
                header.style.boxShadow = 'none';
            }
            
            lastScrollTop = scrollTop;
        });
    }

    /* ========================================================================
       MOBILE MENU MANAGEMENT
       ======================================================================== */

    setupMobileMenu() {
        const menuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenu = document.getElementById('mobileMenu');

        if (!menuToggle || !mobileMenu) return;

        // Toggle menu
        menuToggle.addEventListener('click', () => {
            const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
            this.setMobileMenuState(!isOpen);
        });

        // Close menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.setMobileMenuState(false);
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            const isClickInsideMenu = mobileMenu.contains(e.target);
            const isClickOnToggle = menuToggle.contains(e.target);

            if (!isClickInsideMenu && !isClickOnToggle) {
                this.setMobileMenuState(false);
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.setMobileMenuState(false);
            }
        });
    }

    setMobileMenuState(isOpen) {
        const menuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenu = document.getElementById('mobileMenu');

        if (!menuToggle || !mobileMenu) return;

        menuToggle.setAttribute('aria-expanded', isOpen);

        if (isOpen) {
            mobileMenu.removeAttribute('hidden');
        } else {
            mobileMenu.setAttribute('hidden', '');
        }
    }

    /* ========================================================================
       SMOOTH SCROLL
       ======================================================================== */

    setupSmoothScroll() {
        // Smooth scroll is handled by CSS scroll-behavior: smooth
        // This function can be extended for additional scroll handling

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
                    this.setMobileMenuState(false);
                }

                // Scroll to target with offset for header
                const headerHeight = 70;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }

    /* ========================================================================
       HERO ANIMATIONS
       ======================================================================== */

    setupHeroAnimations() {
        // Parallax effect on hero background
        const hero = document.getElementById('tu-energia-gamer-se-conecta-en-gameflowvibe');
        if (!hero) return;

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const heroTop = hero.offsetTop;
            const heroHeight = hero.offsetHeight;
            const windowHeight = window.innerHeight;

            // Only apply parallax when hero is in view
            if (scrollTop + windowHeight > heroTop && scrollTop < heroTop + heroHeight) {
                const parallaxOffset = (scrollTop - heroTop) * 0.5;
                const bgAnimation = hero.querySelector('.hero-bg-animation');
                if (bgAnimation) {
                    bgAnimation.style.transform = `translateY(${parallaxOffset}px)`;
                }
            }
        });
    }

    /* ========================================================================
       PARALLAX EFFECTS FOR HIGHLIGHTS
       ======================================================================== */

    setupParallaxEffects() {
        const highlightItems = document.querySelectorAll('.highlight-item');
        
        window.addEventListener('scroll', () => {
            highlightItems.forEach(item => {
                const rect = item.getBoundingClientRect();
                const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                
                if (scrollPercent > 0 && scrollPercent < 1) {
                    const offset = (scrollPercent - 0.5) * 20;
                    item.style.transform = `translateY(${offset}px)`;
                }
            });
        });
    }

    /* ========================================================================
       INTERSECTION OBSERVER FOR ANIMATIONS
       ======================================================================== */

    setupIntersectionObserver() {
        // Animate elements when they come into view
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe pillar cards
        const pillarCards = document.querySelectorAll('.pillar-card');
        pillarCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });

        // Observe about content
        const aboutContent = document.querySelector('.about-content');
        if (aboutContent) {
            aboutContent.style.opacity = '0';
            aboutContent.style.transform = 'translateY(20px)';
            aboutContent.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(aboutContent);
        }

        // Observe tool cards
        const toolCards = document.querySelectorAll('.tool-card');
        toolCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });

        // Observe tools content
        const toolsContent = document.querySelector('.tools-content');
        if (toolsContent) {
            toolsContent.style.opacity = '0';
            toolsContent.style.transform = 'translateY(20px)';
            toolsContent.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(toolsContent);
        }

        // Observe highlight items
        const highlightItems = document.querySelectorAll('.highlight-item');
        highlightItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(item);
        });

        // Observe highlights content
        const highlightsContent = document.querySelector('.highlights-content');
        if (highlightsContent) {
            highlightsContent.style.opacity = '0';
            highlightsContent.style.transform = 'translateY(20px)';
            highlightsContent.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(highlightsContent);
        }

        const statCards = document.querySelectorAll('[data-observe="counter"]');
        statCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });

        const progressItems = document.querySelectorAll('[data-observe="progress"]');
        progressItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(item);
        });

        const additionalCards = document.querySelectorAll('[data-observe="card"], .integration-card, .lab-card, .merch-card, .merch-logo-panel, .join-form, .join-pill');
        additionalCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }

    /* ========================================================================
       COUNTERS & PROGRESS
       ======================================================================== */

    setupCounters() {
        const statCards = document.querySelectorAll('[data-observe="counter"]');
        if (!statCards.length) return;

        const formatNumber = (value) => {
            return Math.round(value).toLocaleString('es-MX');
        };

        const animateCounter = (counter) => {
            const target = Number(counter.dataset.target || 0);
            if (!target) return;

            const duration = 2200;
            const startTime = performance.now();

            const step = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = 1 - Math.pow(1 - progress, 3);
                const value = target * easedProgress;
                counter.textContent = formatNumber(value);

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    counter.textContent = formatNumber(target);
                }
            };

            requestAnimationFrame(step);
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counters = entry.target.querySelectorAll('.counter');
                    counters.forEach(counter => {
                        if (!counter.dataset.animated) {
                            animateCounter(counter);
                            counter.dataset.animated = 'true';
                        }
                    });
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statCards.forEach(card => observer.observe(card));
    }

    setupProgressIndicators() {
        const progressItems = document.querySelectorAll('[data-observe="progress"]');
        if (!progressItems.length) return;

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const valueElement = entry.target.querySelector('.progress-value');
                    const fillElement = entry.target.querySelector('.progress-fill');

                    if (valueElement && fillElement && !entry.target.dataset.animated) {
                        const target = Number(valueElement.dataset.progressTarget || 0);
                        const duration = 1800;
                        const startTime = performance.now();

                        const step = (currentTime) => {
                            const elapsed = currentTime - startTime;
                            const progress = Math.min(elapsed / duration, 1);
                            const eased = 1 - Math.pow(1 - progress, 3);
                            const value = Math.round(target * eased);
                            valueElement.textContent = `${value}%`;
                            fillElement.style.width = `${value}%`;

                            if (progress < 1) {
                                requestAnimationFrame(step);
                            } else {
                                valueElement.textContent = `${target}%`;
                                fillElement.style.width = `${target}%`;
                            }
                        };

                        requestAnimationFrame(step);
                        entry.target.dataset.animated = 'true';
                    }

                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });

        progressItems.forEach(item => observer.observe(item));
    }

    /* ========================================================================
       EVENTS FILTERS
       ======================================================================== */

    setupEventFilters() {
        const filterButtons = document.querySelectorAll('.events-filter');
        const eventCards = document.querySelectorAll('.event-card');

        if (!filterButtons.length || !eventCards.length) return;

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.dataset.filter;

                filterButtons.forEach(btn => {
                    const isActive = btn === button;
                    btn.classList.toggle('is-active', isActive);
                    btn.setAttribute('aria-selected', String(isActive));
                });

                eventCards.forEach(card => {
                    const matches = category === 'todos' || card.dataset.category === category;
                    card.classList.toggle('is-hidden', !matches);
                });
            });
        });
    }

    /* ========================================================================
       COOKIE BANNER
       ======================================================================== */

    setupCookieBanner() {
        const banner = document.getElementById('cookieBanner');
        const acceptButton = document.getElementById('cookieAccept');

        if (!banner || !acceptButton) return;

        const storageKey = 'gfv-cookie-consent';

        try {
            const consent = localStorage.getItem(storageKey);
            if (consent === 'accepted') {
                return;
            }
        } catch (e) {
            // Ignore storage errors and continue showing banner
        }

        const showBanner = () => {
            banner.classList.add('is-visible');
        };

        const hideBanner = () => {
            banner.classList.remove('is-visible');
        };

        setTimeout(showBanner, 800);

        acceptButton.addEventListener('click', () => {
            hideBanner();
            try {
                localStorage.setItem(storageKey, 'accepted');
            } catch (e) {
                // ignore
            }
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new GameFlowVibe();
    });
} else {
    new GameFlowVibe();
}
