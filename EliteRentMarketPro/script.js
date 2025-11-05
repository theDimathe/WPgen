// ============================================
// ELITE RENT MARKET PRO - MAIN APPLICATION
// ============================================

const App = {
    // Configuration
    config: {
        themeStorageKey: 'eliterentmarketpro-theme',
        defaultTheme: 'light',
        mobileBreakpoint: 768,
    },

    // Initialize the application
    init() {
        this.setupTheme();
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupAccessibility();
        this.setupParallax();
        this.setupPropertyCards();
        this.setupAdvantageBlocks();
        this.setupMetrics();
        this.setupTestimonials();
        this.setupContactForm();
    },

    // ============================================
    // THEME MANAGEMENT
    // ============================================
    setupTheme() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        // Get saved theme or system preference
        const savedTheme = localStorage.getItem(this.config.themeStorageKey);
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const currentTheme = savedTheme || systemTheme;

        // Apply theme
        this.setTheme(currentTheme);

        // Theme toggle listener
        themeToggle.addEventListener('click', () => {
            const html = document.documentElement;
            const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            this.setTheme(newTheme);
        });

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(this.config.themeStorageKey)) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    },

    setTheme(theme) {
        const html = document.documentElement;
        const themeToggle = document.getElementById('themeToggle');

        html.setAttribute('data-theme', theme);
        localStorage.setItem(this.config.themeStorageKey, theme);

        if (themeToggle) {
            themeToggle.setAttribute('aria-pressed', theme === 'dark');
        }
    },

    // ============================================
    // MOBILE MENU MANAGEMENT
    // ============================================
    setupMobileMenu() {
        const menuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

        if (!menuToggle || !mobileMenu) return;

        // Toggle menu
        menuToggle.addEventListener('click', () => {
            const isActive = menuToggle.classList.contains('active');
            this.toggleMobileMenu(!isActive, menuToggle, mobileMenu);
        });

        // Close menu when clicking on a link
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.toggleMobileMenu(false, menuToggle, mobileMenu);
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            const header = document.querySelector('header');
            if (header && !header.contains(e.target) && menuToggle.classList.contains('active')) {
                this.toggleMobileMenu(false, menuToggle, mobileMenu);
            }
        });

        // Close menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth >= this.config.mobileBreakpoint) {
                this.toggleMobileMenu(false, menuToggle, mobileMenu);
            }
        });
    },

    toggleMobileMenu(isOpen, toggle, menu) {
        if (isOpen) {
            toggle.classList.add('active');
            menu.classList.add('active');
            toggle.setAttribute('aria-expanded', 'true');
        } else {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        }
    },

    // ============================================
    // SMOOTH SCROLL
    // ============================================
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;

                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();

                // Close mobile menu if open
                const menuToggle = document.getElementById('mobileMenuToggle');
                const mobileMenu = document.getElementById('mobileMenu');
                if (menuToggle && menuToggle.classList.contains('active')) {
                    this.toggleMobileMenu(false, menuToggle, mobileMenu);
                }

                // Scroll to target with offset for sticky header
                const headerHeight = document.querySelector('header')?.offsetHeight || 70;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth',
                });
            });
        });
    },

    // ============================================
    // PARALLAX EFFECT
    // ============================================
    setupParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax="true"]');
        
        if (parallaxElements.length === 0) return;

        window.addEventListener('scroll', () => {
            parallaxElements.forEach(element => {
                const scrollPosition = window.scrollY;
                const elementOffset = element.parentElement.offsetTop;
                const distance = scrollPosition - elementOffset;
                
                // Apply parallax effect: move background at -20% of scroll speed
                const parallaxValue = distance * -0.2;
                element.style.transform = `translateY(${parallaxValue}px)`;
            });
        }, { passive: true });
    },

    // ============================================
    // PROPERTY CARDS INTERACTION
    // ============================================
    setupPropertyCards() {
        const propertyCards = document.querySelectorAll('.property-card');
        
        propertyCards.forEach(card => {
            // Add keyboard accessibility
            card.setAttribute('tabindex', '0');
            
            // Add focus and blur events for keyboard navigation
            card.addEventListener('focus', function() {
                this.style.outline = '2px solid var(--color-primary-gold)';
                this.style.outlineOffset = '2px';
            });

            card.addEventListener('blur', function() {
                this.style.outline = 'none';
            });

            // Add click handler for card buttons
            const button = card.querySelector('.property-btn');
            if (button) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const href = button.getAttribute('href');
                    if (href) {
                        const target = document.querySelector(href);
                        if (target) {
                            const headerHeight = document.querySelector('header')?.offsetHeight || 70;
                            const targetPosition = target.offsetTop - headerHeight;
                            window.scrollTo({
                                top: targetPosition,
                                behavior: 'smooth',
                            });
                        }
                    }
                });
            }
        });
    },

    // ============================================
    // ADVANTAGE BLOCKS INTERACTION
    // ============================================
    setupAdvantageBlocks() {
        const advantageBlocks = document.querySelectorAll('.advantage-block');
        
        advantageBlocks.forEach((block, index) => {
            // Add animation on scroll into view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s both`;
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            observer.observe(block);

            // Add keyboard accessibility
            block.setAttribute('tabindex', '0');
            
            block.addEventListener('focus', function() {
                this.style.outline = '2px solid var(--color-primary-gold)';
                this.style.outlineOffset = '2px';
            });

            block.addEventListener('blur', function() {
                this.style.outline = 'none';
            });
        });
    },

    // ============================================
    // METRICS COUNTER ANIMATION
    // ============================================
    setupMetrics() {
        const metricNumbers = document.querySelectorAll('.metric-number');
        
        metricNumbers.forEach(element => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !element.classList.contains('counted')) {
                        element.classList.add('counted');
                        this.animateCounter(element);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(element);
        });
    },

    animateCounter(element) {
        const target = parseFloat(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const start = Date.now();
        const startValue = 0;

        const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - start) / duration, 1);
            const current = Math.floor(startValue + (target - startValue) * progress);
            
            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = target;
            }
        };

        animate();
    },

    // ============================================
    // TESTIMONIALS CAROUSEL
    // ============================================
    setupTestimonials() {
        const carousel = document.getElementById('testimonialsCarousel');
        const prevBtn = document.getElementById('testimonialsPrev');
        const nextBtn = document.getElementById('testimonialsNext');
        const indicatorsContainer = document.getElementById('testimonialsIndicators');

        if (!carousel) return;

        const cards = carousel.querySelectorAll('.testimonial-card');
        let currentIndex = 0;

        // Create indicators
        cards.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.className = `testimonials-indicator ${index === 0 ? 'active' : ''}`;
            indicator.setAttribute('aria-label', `Testimonial ${index + 1}`);
            indicator.addEventListener('click', () => this.goToTestimonial(index, carousel, cards, indicatorsContainer));
            indicatorsContainer.appendChild(indicator);
        });

        // Navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + cards.length) % cards.length;
                this.goToTestimonial(currentIndex, carousel, cards, indicatorsContainer);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % cards.length;
                this.goToTestimonial(currentIndex, carousel, cards, indicatorsContainer);
            });
        }

        // Touch swipe support
        let touchStartX = 0;
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        carousel.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            if (touchStartX - touchEndX > 50) {
                // Swiped left
                currentIndex = (currentIndex + 1) % cards.length;
                this.goToTestimonial(currentIndex, carousel, cards, indicatorsContainer);
            } else if (touchEndX - touchStartX > 50) {
                // Swiped right
                currentIndex = (currentIndex - 1 + cards.length) % cards.length;
                this.goToTestimonial(currentIndex, carousel, cards, indicatorsContainer);
            }
        });
    },

    goToTestimonial(index, carousel, cards, indicatorsContainer) {
        const card = cards[index];
        const cardWidth = card.offsetWidth + 16; // Include gap
        const scrollPosition = index * cardWidth;

        carousel.scrollTo({
            left: scrollPosition,
            behavior: 'smooth',
        });

        // Update indicators
        const indicators = indicatorsContainer.querySelectorAll('.testimonials-indicator');
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
    },

    // ============================================
    // CONTACT FORM HANDLING
    // ============================================
    setupContactForm() {
        const form = document.querySelector('.contact-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Basic validation
            if (!data.fullName || !data.email || !data.phone || !data.propertyType || !data.budget || !data.message) {
                alert('Por favor, completa todos los campos requeridos.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                alert('Por favor, ingresa un correo electrónico válido.');
                return;
            }

            // Submit form (in real scenario, this would send to server)
            console.log('Form submitted:', data);

            // Show success message
            const submitBtn = form.querySelector('.form-submit');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '✓ Consulta Enviada';
            submitBtn.disabled = true;

            // Reset form
            form.reset();

            // Restore button after 3 seconds
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 3000);
        });
    },

    // ============================================
    // ACCESSIBILITY
    // ============================================
    setupAccessibility() {
        // Ensure all interactive elements are keyboard accessible
        const interactiveElements = document.querySelectorAll('button, a, input, textarea, select');
        
        interactiveElements.forEach(element => {
            // Add focus visible styles
            element.addEventListener('focus', function() {
                if (!this.classList.contains('property-card') && !this.classList.contains('advantage-block')) {
                    this.style.outline = '2px solid var(--color-primary-gold)';
                    this.style.outlineOffset = '2px';
                }
            });

            element.addEventListener('blur', function() {
                if (!this.classList.contains('property-card') && !this.classList.contains('advantage-block')) {
                    this.style.outline = 'none';
                }
            });
        });

        // Skip to main content link
        this.addSkipLink();
    },

    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Saltar al contenido principal';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 0;
            background: var(--color-primary-gold);
            color: var(--color-text-dark);
            padding: 8px 16px;
            text-decoration: none;
            z-index: 100;
        `;

        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '0';
        });

        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);
    },
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}
