// ============================================
// URBANFLATSPACEHUB LANDING PAGE
// Custom JavaScript without external libraries
// ============================================

const App = {
    // Configuration
    config: {
        headerSelector: '#urbanflatspacehub-espacios-comerciales-premium',
        mobileMenuToggleSelector: '#mobile-menu-toggle',
        mobileNavSelector: '#mobile-nav',
        themeToggleSelector: '#theme-toggle',
        mobileNavLinksSelector: '.mobile-nav-link, .mobile-nav-cta',
        mobileBreakpoint: 768,
        scrollThreshold: 50,
        propertiesGridSelector: '#properties-grid',
        filterSelectors: {
            type: '#filter-type',
            location: '#filter-location',
            price: '#filter-price',
        },
        statisticsSelector: '.statistic-number',
        consultationFormSelector: '#consultation-form',
        newsletterFormSelector: '#footerNewsletter',
        newsletterEmailSelector: '#newsletterEmail',
        newsletterFeedbackSelector: '#footerFeedback',
    },

    // State
    state: {
        mobileMenuOpen: false,
        currentTheme: 'light',
        filters: {
            type: '',
            location: '',
            price: '',
        },
        statisticsAnimated: false,
    },

    // Initialize the application
    init() {
        this.setupTheme();
        this.setupHeader();
        this.setupMobileMenu();
        this.setupScrollBehavior();
        this.setupSmoothScroll();
        this.setupHeroAnimations();
        this.setupPropertyFilters();
        this.setupStatisticsAnimation();
        this.setupConsultationForm();
        this.setupFooterNewsletter();
        this.updateFooterYear();
        console.log('UrbanFlatSpaceHub App initialized');
    },

    // ============================================
    // THEME MANAGEMENT
    // ============================================

    setupTheme() {
        // Check for saved theme preference or system preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

        this.setTheme(initialTheme);

        // Listen for theme toggle
        const themeToggle = document.querySelector(this.config.themeToggleSelector);
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    },

    setTheme(theme) {
        this.state.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        // Update theme toggle button state
        const themeToggle = document.querySelector(this.config.themeToggleSelector);
        if (themeToggle) {
            themeToggle.setAttribute('aria-pressed', theme === 'dark');
        }
    },

    toggleTheme() {
        const newTheme = this.state.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    },

    // ============================================
    // HEADER MANAGEMENT
    // ============================================

    setupHeader() {
        const header = document.querySelector(this.config.headerSelector);
        if (!header) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > this.config.scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    },

    // ============================================
    // MOBILE MENU MANAGEMENT
    // ============================================

    setupMobileMenu() {
        const toggle = document.querySelector(this.config.mobileMenuToggleSelector);
        const mobileNav = document.querySelector(this.config.mobileNavSelector);
        const navLinks = document.querySelectorAll(this.config.mobileNavLinksSelector);

        if (!toggle || !mobileNav) return;

        // Toggle menu on button click
        toggle.addEventListener('click', () => this.toggleMobileMenu(toggle, mobileNav));

        // Close menu when a link is clicked
        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                this.closeMobileMenu(toggle, mobileNav);
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest(this.config.headerSelector)) {
                this.closeMobileMenu(toggle, mobileNav);
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu(toggle, mobileNav);
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth >= this.config.mobileBreakpoint) {
                this.closeMobileMenu(toggle, mobileNav);
            }
        });
    },

    toggleMobileMenu(toggle, mobileNav) {
        this.state.mobileMenuOpen ? this.closeMobileMenu(toggle, mobileNav) : this.openMobileMenu(toggle, mobileNav);
    },

    openMobileMenu(toggle, mobileNav) {
        this.state.mobileMenuOpen = true;
        toggle.setAttribute('aria-expanded', 'true');
        mobileNav.classList.add('mobile-nav-open');
    },

    closeMobileMenu(toggle, mobileNav) {
        this.state.mobileMenuOpen = false;
        toggle.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('mobile-nav-open');
    },

    // ============================================
    // SCROLL BEHAVIOR
    // ============================================

    setupScrollBehavior() {
        // Smooth scroll is handled by CSS scroll-behavior: smooth
        // This function can be extended for additional scroll effects
    },

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================

    setupSmoothScroll() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;

            const href = link.getAttribute('href');
            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();
                
                // Close mobile menu if open
                const toggle = document.querySelector(this.config.mobileMenuToggleSelector);
                const mobileNav = document.querySelector(this.config.mobileNavSelector);
                if (this.state.mobileMenuOpen) {
                    this.closeMobileMenu(toggle, mobileNav);
                }

                // Scroll to target with offset for sticky header
                const headerHeight = document.querySelector(this.config.headerSelector)?.offsetHeight || 0;
                const targetPosition = target.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth',
                });
            }
        });
    },

    // ============================================
    // HERO ANIMATIONS
    // ============================================

    setupHeroAnimations() {
        // Hero animations are handled by CSS keyframes
        // This function can be extended for scroll-triggered animations
    },

    // ============================================
    // PROPERTY FILTERS
    // ============================================

    setupPropertyFilters() {
        const typeFilter = document.querySelector(this.config.filterSelectors.type);
        const locationFilter = document.querySelector(this.config.filterSelectors.location);
        const priceFilter = document.querySelector(this.config.filterSelectors.price);

        if (!typeFilter || !locationFilter || !priceFilter) return;

        // Add event listeners to filters
        typeFilter.addEventListener('change', (e) => {
            this.state.filters.type = e.target.value;
            this.filterProperties();
        });

        locationFilter.addEventListener('change', (e) => {
            this.state.filters.location = e.target.value;
            this.filterProperties();
        });

        priceFilter.addEventListener('change', (e) => {
            this.state.filters.price = e.target.value;
            this.filterProperties();
        });
    },

    filterProperties() {
        const grid = document.querySelector(this.config.propertiesGridSelector);
        if (!grid) return;

        const cards = grid.querySelectorAll('.property-card');
        let visibleCount = 0;

        cards.forEach((card) => {
            const cardType = card.getAttribute('data-type');
            const cardLocation = card.getAttribute('data-location');
            const cardPrice = card.getAttribute('data-price');

            const typeMatch = !this.state.filters.type || cardType === this.state.filters.type;
            const locationMatch = !this.state.filters.location || cardLocation === this.state.filters.location;
            const priceMatch = !this.state.filters.price || cardPrice === this.state.filters.price;

            if (typeMatch && locationMatch && priceMatch) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Optional: Add a message if no properties match
        if (visibleCount === 0) {
            console.log('No properties match the selected filters');
        }
    },

    // ============================================
    // STATISTICS ANIMATION
    // ============================================

    setupStatisticsAnimation() {
        const statisticElements = document.querySelectorAll(this.config.statisticsSelector);
        if (statisticElements.length === 0) return;

        // Create intersection observer for statistics
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !this.state.statisticsAnimated) {
                    this.state.statisticsAnimated = true;
                    this.animateStatistics(statisticElements);
                    observer.disconnect();
                }
            });
        }, {
            threshold: 0.5,
        });

        //Observe the first statistic element
        if (statisticElements.length > 0) {
            observer.observe(statisticElements[0]);
        }
    },

    animateStatistics(elements) {
        elements.forEach((element) => {
            const target = parseInt(element.getAttribute('data-target'), 10);
            const prefix = element.getAttribute('data-prefix') || '';
            const suffix = element.getAttribute('data-suffix') || '';
            const duration = 1500; // milliseconds
            const startTime = Date.now();

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const current = Math.floor(target * progress);

                element.textContent = prefix + current + suffix;

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.textContent = prefix + target + suffix;
                }
            };

            animate();
        });
    },

    // ============================================
    // CONSULTATION FORM
    // ============================================

    setupConsultationForm() {
        const form = document.querySelector(this.config.consultationFormSelector);
        if (!form) return;

        form.addEventListener('submit', (e) => this.handleFormSubmit(e, form));

        // Add real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach((input) => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('change', () => this.validateField(input));
        });
    },

    validateField(field) {
        const errorElement = document.getElementById(`${field.id}-error`);
        let isValid = true;
        let errorMessage = '';

        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = 'Este campo es requerido';
        } else if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                errorMessage = 'Por favor ingresa un email válido';
            }
        } else if (field.id === 'phone' && field.value) {
            const phoneRegex = /[0-9\s\-\+\(\)]{10,}/;
            if (!phoneRegex.test(field.value)) {
                isValid = false;
                errorMessage = 'Por favor ingresa un teléfono válido';
            }
        }

        if (isValid) {
            field.classList.remove('error');
            if (errorElement) {
                errorElement.classList.remove('show');
                errorElement.textContent = '';
            }
        } else {
            field.classList.add('error');
            if (errorElement) {
                errorElement.classList.add('show');
                errorElement.textContent = errorMessage;
            }
        }

        return isValid;
    },

    handleFormSubmit(e, form) {
        e.preventDefault();

        // Validate all fields
        const inputs = form.querySelectorAll('input, select, textarea');
        let allValid = true;

        inputs.forEach((input) => {
            if (!this.validateField(input)) {
                allValid = false;
            }
        });

        if (!allValid) {
            return;
        }

        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Log form data (in production, this would be sent to a server)
        console.log('Form submitted:', data);

        // Show success message
        this.showFormSuccess(form);

        // Reset form
        form.reset();

        // Clear error states
        inputs.forEach((input) => {
            input.classList.remove('error');
        });
    },

    setupFooterNewsletter() {
        const form = document.querySelector(this.config.newsletterFormSelector);
        const emailInput = document.querySelector(this.config.newsletterEmailSelector);
        const feedback = document.querySelector(this.config.newsletterFeedbackSelector);

        if (!form || !emailInput || !feedback) return;

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const email = emailInput.value.trim();

            feedback.classList.remove('success', 'error');

            if (!emailPattern.test(email)) {
                feedback.textContent = 'Por favor ingresa un correo electrónico válido.';
                feedback.classList.add('error');
                emailInput.focus();
                return;
            }

            feedback.textContent = '¡Gracias por suscribirte! Te enviaremos oportunidades exclusivas.';
            feedback.classList.add('success');
            form.reset();
        });
    },

    updateFooterYear() {
        const yearElement = document.getElementById('footerYear');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    },

    showFormSuccess(form) {
        const formElement = form;
        const successElement = document.getElementById('form-success');

        if (successElement) {
            formElement.style.display = 'none';
            successElement.removeAttribute('hidden');

            // Auto-hide success message after 5 seconds
            setTimeout(() => {
                successElement.setAttribute('hidden', '');
                formElement.style.display = '';
            }, 5000);
        }
    },
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}
