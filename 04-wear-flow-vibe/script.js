// WearFlowVibe Landing Page - Custom JavaScript

class WearFlowVibe {
    constructor() {
        this.currentSlide = 0;
        this.init();
    }

    init() {
        this.setupThemeToggle();
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupScrollAnimations();
        this.setupCarousel();
        this.setupFormValidation();
        this.setupCookieConsent();
    }

    /* ============================================
       THEME TOGGLE
       ============================================ */

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const htmlElement = document.documentElement;
        
        // Check for saved theme preference or default to light
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);

        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                this.setTheme(newTheme);
            });
        }
    }

    setTheme(theme) {
        const htmlElement = document.documentElement;
        const themeToggle = document.getElementById('themeToggle');

        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        if (themeToggle) {
            themeToggle.setAttribute('aria-pressed', theme === 'dark');
        }
    }

    /* ============================================
       MOBILE MENU
       ============================================ */

    setupMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileNav = document.getElementById('mobileNav');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

        if (mobileMenuToggle && mobileNav) {
            // Toggle menu on button click
            mobileMenuToggle.addEventListener('click', () => {
                const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
                this.toggleMobileMenu(!isExpanded);
            });

            // Close menu when a link is clicked
            mobileNavLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.toggleMobileMenu(false);
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileNav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                    this.toggleMobileMenu(false);
                }
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.toggleMobileMenu(false);
                }
            });
        }
    }

    toggleMobileMenu(isOpen) {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileNav = document.getElementById('mobileNav');

        if (mobileMenuToggle && mobileNav) {
            mobileMenuToggle.setAttribute('aria-expanded', isOpen);
            
            if (isOpen) {
                mobileNav.classList.add('active');
            } else {
                mobileNav.classList.remove('active');
            }
        }
    }

    /* ============================================
       SMOOTH SCROLL
       ============================================ */

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                
                // Only prevent default for valid section links
                if (href !== '#' && document.querySelector(href)) {
                    e.preventDefault();
                    
                    const target = document.querySelector(href);
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 70;
                    const targetPosition = target.offsetTop - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    this.toggleMobileMenu(false);
                }
            });
        });
    }

    /* ============================================
       SCROLL ANIMATIONS
       ============================================ */

    setupScrollAnimations() {
        // Use Intersection Observer for scroll reveal animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements with scroll-reveal class
        document.querySelectorAll('.scroll-reveal').forEach(element => {
            observer.observe(element);
        });
    }

    /* ============================================
       CAROUSEL
       ============================================ */

    setupCarousel() {
        const carousel = document.getElementById('testimonialsCarousel');
        const dots = document.querySelectorAll('.carousel-dot');

        if (!carousel || dots.length === 0) return;

        // Handle dot clicks
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index, carousel, dots);
            });
        });

        // Handle touch/swipe on mobile
        let touchStartX = 0;
        let touchEndX = 0;

        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX, carousel, dots);
        }, false);
    }

    goToSlide(index, carousel, dots) {
        this.currentSlide = index;
        const cards = carousel.querySelectorAll('.testimonial-card');
        const cardWidth = cards[0].offsetWidth + 32; // Include gap

        carousel.scrollLeft = index * cardWidth;

        // Update active dot
        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    handleSwipe(startX, endX, carousel, dots) {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold) {
            const cards = carousel.querySelectorAll('.testimonial-card');
            const totalSlides = cards.length;

            if (diff > 0) {
                // Swiped left - go to next slide
                this.currentSlide = (this.currentSlide + 1) % totalSlides;
            } else {
                // Swiped right - go to previous slide
                this.currentSlide = (this.currentSlide - 1 + totalSlides) % totalSlides;
            }

            this.goToSlide(this.currentSlide, carousel, dots);
        }
    }

    /* ============================================
       FORM VALIDATION
       ============================================ */

    setupFormValidation() {
        const form = document.getElementById('newsletterForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.validateAndSubmitForm(form);
        });

        // Real-time validation
        const emailInput = document.getElementById('subscriberEmail');
        if (emailInput) {
            emailInput.addEventListener('blur', () => {
                this.validateEmail(emailInput);
            });
        }
    }

    validateEmail(emailInput) {
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email && !emailRegex.test(email)) {
            emailInput.classList.add('form-input-error');
            return false;
        } else {
            emailInput.classList.remove('form-input-error');
            return true;
        }
    }

    validateAndSubmitForm(form) {
        const nameInput = document.getElementById('subscriberName');
        const emailInput = document.getElementById('subscriberEmail');
        const gdprCheckbox = document.getElementById('gdprConsent');

        let isValid = true;

        // Validate name
        if (!nameInput.value.trim()) {
            nameInput.classList.add('form-input-error');
            isValid = false;
        } else {
            nameInput.classList.remove('form-input-error');
        }

        // Validate email
        if (!this.validateEmail(emailInput)) {
            isValid = false;
        }

        // Validate GDPR consent
        if (!gdprCheckbox.checked) {
            gdprCheckbox.classList.add('form-checkbox-error');
            isValid = false;
        } else {
            gdprCheckbox.classList.remove('form-checkbox-error');
        }

        if (isValid) {
            // Submit form
            form.submit();
        }
    }

    /* ============================================
       COOKIE CONSENT
       ============================================ */

    setupCookieConsent() {
        const banner = document.getElementById('cookieConsentBanner');
        const acceptBtn = document.getElementById('cookieAccept');
        const manageLink = document.getElementById('cookieManage');
        const storageKey = 'wearflowvibe-cookie-consent';

        if (!banner || !acceptBtn) {
            return;
        }

        const showBanner = () => {
            banner.removeAttribute('hidden');
            requestAnimationFrame(() => {
                banner.classList.add('visible');
            });
        };

        if (!localStorage.getItem(storageKey)) {
            showBanner();
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem(storageKey, 'accepted');
            banner.classList.remove('visible');
            banner.setAttribute('hidden', '');
        });

        if (manageLink) {
            manageLink.addEventListener('click', () => {
                localStorage.setItem(storageKey, 'manage');
                banner.classList.remove('visible');
                banner.setAttribute('hidden', '');
            });
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new WearFlowVibe();
    });
} else {
    new WearFlowVibe();
}
