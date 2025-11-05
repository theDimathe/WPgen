// ============================================================================
// ECOWOODMATERIALPLUS LANDING PAGE - MAIN APPLICATION
// ============================================================================

const App = {
    // Configuration
    config: {
        themeStorageKey: 'ecowoodmp-theme',
        mobileBreakpoint: 768,
        scrollBehavior: 'smooth',
        cookieConsentKey: 'ecowoodmp-cookie-consent',
    },

    // State
    state: {
        theme: 'light',
        mobileMenuOpen: false,
    },

    // Initialize Application
    init() {
        this.setupTheme();
        this.setupHeader();
        this.setupEventListeners();
        this.setupScrollBehavior();
        this.setupIntersectionObserver();
        this.setupFormValidation();
        this.setupCookieBanner();
    },

    // ========================================================================
    // THEME MANAGEMENT
    // ========================================================================

    setupTheme() {
        // Check for saved theme preference or system preference
        const savedTheme = localStorage.getItem(this.config.themeStorageKey);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        this.state.theme = savedTheme || (prefersDark ? 'dark' : 'light');
        this.applyTheme(this.state.theme);
    },

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(this.config.themeStorageKey, theme);
        this.state.theme = theme;
        
        // Update theme toggle button state
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.setAttribute('aria-pressed', theme === 'dark');
        }
    },

    toggleTheme() {
        const newTheme = this.state.theme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    },

    // ========================================================================
    // HEADER MANAGEMENT
    // ========================================================================

    setupHeader() {
        const header = document.getElementById('ecowoodmaterialplus-materiales-ecologicos-certificados');
        if (!header) return;

        // Setup mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenu = document.getElementById('mobileMenu');

        if (mobileMenuToggle && mobileMenu) {
            mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu(mobileMenuToggle, mobileMenu));
        }

        // Close mobile menu when clicking on a link
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu(mobileMenuToggle, mobileMenu));
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileMenu && mobileMenuToggle && !header.contains(e.target)) {
                if (!mobileMenu.hasAttribute('hidden')) {
                    this.closeMobileMenu(mobileMenuToggle, mobileMenu);
                }
            }
        });
    },

    toggleMobileMenu(toggle, menu) {
        const isOpen = !menu.hasAttribute('hidden');
        
        if (isOpen) {
            this.closeMobileMenu(toggle, menu);
        } else {
            this.openMobileMenu(toggle, menu);
        }
    },

    openMobileMenu(toggle, menu) {
        menu.removeAttribute('hidden');
        toggle.setAttribute('aria-expanded', 'true');
        this.state.mobileMenuOpen = true;
        document.body.style.overflow = 'hidden';
    },

    closeMobileMenu(toggle, menu) {
        menu.setAttribute('hidden', '');
        toggle.setAttribute('aria-expanded', 'false');
        this.state.mobileMenuOpen = false;
        document.body.style.overflow = '';
    },

    // ========================================================================
    // EVENT LISTENERS
    // ========================================================================

    setupEventListeners() {
        // Theme toggle button
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Handle window resize for responsive behavior
        window.addEventListener('resize', () => this.handleResize());

        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    },

    handleResize() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenu = document.getElementById('mobileMenu');

        // Close mobile menu if window is resized to desktop size
        if (window.innerWidth >= this.config.mobileBreakpoint) {
            if (mobileMenuToggle && mobileMenu && !mobileMenu.hasAttribute('hidden')) {
                this.closeMobileMenu(mobileMenuToggle, mobileMenu);
            }
        }
    },

    handleKeyboard(e) {
        // Close mobile menu on Escape key
        if (e.key === 'Escape') {
            const mobileMenuToggle = document.getElementById('mobileMenuToggle');
            const mobileMenu = document.getElementById('mobileMenu');
            
            if (mobileMenuToggle && mobileMenu && !mobileMenu.hasAttribute('hidden')) {
                this.closeMobileMenu(mobileMenuToggle, mobileMenu);
            }
        }
    },

    // ========================================================================
    // SCROLL BEHAVIOR
    // ========================================================================

    setupScrollBehavior() {
        // Smooth scroll for anchor links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;

            const href = link.getAttribute('href');
            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();
                
                // Close mobile menu if open
                const mobileMenuToggle = document.getElementById('mobileMenuToggle');
                const mobileMenu = document.getElementById('mobileMenu');
                if (mobileMenuToggle && mobileMenu && !mobileMenu.hasAttribute('hidden')) {
                    this.closeMobileMenu(mobileMenuToggle, mobileMenu);
                }

                // Scroll to target with offset for sticky header
                const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: this.config.scrollBehavior,
                });
            }
        });
    },

    // ========================================================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ========================================================================

    setupIntersectionObserver() {
        // Observe elements for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all elements with animation classes
        document.querySelectorAll('.hero-content, .pillar-card, .product-card, .feature-block, .gallery-item, .testimonial-card, .quote-form').forEach(el => {
            observer.observe(el);
        });
    },

    // ========================================================================
    // FORM VALIDATION
    // ========================================================================

    setupFormValidation() {
        const form = document.querySelector('.quote-form');
        if (!form) return;

        form.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Add real-time validation for email field
        const emailInput = document.getElementById('quote-email');
        if (emailInput) {
            emailInput.addEventListener('blur', () => this.validateEmail(emailInput));
        }

        // Add real-time validation for phone field
        const phoneInput = document.getElementById('quote-phone');
        if (phoneInput) {
            phoneInput.addEventListener('blur', () => this.validatePhone(phoneInput));
        }
    },

    // ========================================================================
    // COOKIE CONSENT
    // ========================================================================

    setupCookieBanner() {
        const banner = document.querySelector('.cookie-banner');
        if (!banner) return;

        const savedChoice = localStorage.getItem(this.config.cookieConsentKey);
        if (savedChoice) {
            banner.setAttribute('hidden', '');
            return;
        }

        const acceptButton = banner.querySelector('[data-cookie-accept]');
        const declineButton = banner.querySelector('[data-cookie-decline]');

        banner.removeAttribute('hidden');

        const handleChoice = (choice) => {
            localStorage.setItem(this.config.cookieConsentKey, choice);
            banner.setAttribute('hidden', '');
        };

        if (acceptButton) {
            acceptButton.addEventListener('click', () => handleChoice('accepted'));
        }

        if (declineButton) {
            declineButton.addEventListener('click', () => handleChoice('declined'));
        }
    },

    handleFormSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);

        // Validate all fields
        const nameInput = document.getElementById('quote-name');
        const emailInput = document.getElementById('quote-email');
        const phoneInput = document.getElementById('quote-phone');
        const projectTypeSelect = document.getElementById('quote-project-type');
        const messageInput = document.getElementById('quote-message');

        let isValid = true;

        // Validate name
        if (!nameInput.value.trim()) {
            this.showFieldError(nameInput, 'El nombre es requerido');
            isValid = false;
        } else {
            this.clearFieldError(nameInput);
        }

        // Validate email
        if (!this.isValidEmail(emailInput.value)) {
            this.showFieldError(emailInput, 'Por favor ingresa un email válido');
            isValid = false;
        } else {
            this.clearFieldError(emailInput);
        }

        // Validate phone
        if (!phoneInput.value.trim()) {
            this.showFieldError(phoneInput, 'El teléfono es requerido');
            isValid = false;
        } else {
            this.clearFieldError(phoneInput);
        }

        // Validate project type
        if (!projectTypeSelect.value) {
            this.showFieldError(projectTypeSelect, 'Por favor selecciona un tipo de proyecto');
            isValid = false;
        } else {
            this.clearFieldError(projectTypeSelect);
        }

        // Validate message
        if (!messageInput.value.trim()) {
            this.showFieldError(messageInput, 'Por favor describe tu proyecto');
            isValid = false;
        } else {
            this.clearFieldError(messageInput);
        }

        if (isValid) {
            // Submit form
            form.submit();
        }
    },

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    validateEmail(input) {
        if (!this.isValidEmail(input.value)) {
            this.showFieldError(input, 'Por favor ingresa un email válido');
        } else {
            this.clearFieldError(input);
        }
    },

    validatePhone(input) {
        if (!input.value.trim()) {
            this.showFieldError(input, 'El teléfono es requerido');
        } else {
            this.clearFieldError(input);
        }
    },

    showFieldError(input, message) {
        input.style.borderColor = 'var(--color-error)';
        input.setAttribute('aria-invalid', 'true');
        
        // Remove existing error message if any
        const existingError = input.parentElement.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }

        // Add error message
        const errorMsg = document.createElement('span');
        errorMsg.className = 'field-error';
        errorMsg.textContent = message;
        errorMsg.style.color = 'var(--color-error)';
        errorMsg.style.fontSize = 'var(--font-size-sm)';
        errorMsg.style.marginTop = 'var(--spacing-xs)';
        input.parentElement.appendChild(errorMsg);
    },

    clearFieldError(input) {
        input.style.borderColor = '';
        input.setAttribute('aria-invalid', 'false');
        
        const errorMsg = input.parentElement.querySelector('.field-error');
        if (errorMsg) {
            errorMsg.remove();
        }
    },
};

// ============================================================================
// INITIALIZATION
// ============================================================================

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}
