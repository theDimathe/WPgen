// ============================================================================
// NEXTBIZGROWTHHUB - LANDING PAGE JAVASCRIPT
// Custom vanilla JavaScript without external dependencies
// ============================================================================

// Application State
const app = {
    theme: 'light',
    mobileMenuOpen: false,
    scrolled: false,
    
    init() {
        this.detectTheme();
        this.setupEventListeners();
        this.setupScrollBehavior();
        this.setupHeroAnimations();
        this.setupAboutAnimations();
        this.setupServicesAnimations();
        this.setupHowItWorksAnimations();
        this.setupCaseStudiesAnimations();
        this.setupTestimonialsAnimations();
    },
    
    // ========================================================================
    // THEME MANAGEMENT
    // ========================================================================
    
    detectTheme() {
        // Check localStorage for saved theme
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme) {
            this.theme = savedTheme;
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.theme = 'dark';
        } else {
            this.theme = 'light';
        }
        
        this.applyTheme();
    },
    
    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
        
        // Update theme toggle button state
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.setAttribute('aria-pressed', this.theme === 'dark');
        }
    },
    
    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme();
    },
    
    // ========================================================================
    // MOBILE MENU MANAGEMENT
    // ========================================================================
    
    toggleMobileMenu() {
        this.mobileMenuOpen = !this.mobileMenuOpen;
        
        const toggle = document.getElementById('mobileMenuToggle');
        const menu = document.getElementById('mobileMenu');
        
        if (toggle) {
            toggle.classList.toggle('active', this.mobileMenuOpen);
            toggle.setAttribute('aria-expanded', this.mobileMenuOpen);
        }
        
        if (menu) {
            menu.classList.toggle('active', this.mobileMenuOpen);
        }
    },
    
    closeMobileMenu() {
        if (this.mobileMenuOpen) {
            this.mobileMenuOpen = false;
            
            const toggle = document.getElementById('mobileMenuToggle');
            const menu = document.getElementById('mobileMenu');
            
            if (toggle) {
                toggle.classList.remove('active');
                toggle.setAttribute('aria-expanded', false);
            }
            
            if (menu) {
                menu.classList.remove('active');
            }
        }
    },
    
    // ========================================================================
    // SCROLL BEHAVIOR
    // ========================================================================
    
    setupScrollBehavior() {
        window.addEventListener('scroll', () => {
            const header = document.querySelector('header');
            const isScrolled = window.scrollY > 10;
            
            if (isScrolled !== this.scrolled) {
                this.scrolled = isScrolled;
                if (header) {
                    header.classList.toggle('scrolled', isScrolled);
                }
            }
        }, { passive: true });
    },
    
    // ========================================================================
    // HERO ANIMATIONS
    // ========================================================================
    
    setupHeroAnimations() {
        // Counter animation for metrics
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateMetrics();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        const heroSection = document.getElementById('potencia-tu-negocio-con-inteligencia-y-datos-nextbizgrowthhub');
        if (heroSection) {
            observer.observe(heroSection);
        }
    },
    
    animateMetrics() {
        const metrics = document.querySelectorAll('.metric-value');
        
        metrics.forEach(metric => {
            const text = metric.textContent;
            const isNegative = text.includes('-');
            const numberMatch = text.match(/\d+/);
            
            if (numberMatch) {
                const finalValue = parseInt(numberMatch[0]);
                let currentValue = 0;
                const increment = Math.ceil(finalValue / 30);
                
                const counter = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= finalValue) {
                        currentValue = finalValue;
                        clearInterval(counter);
                    }
                    
                    const prefix = isNegative ? '-' : '+';
                    metric.textContent = prefix + currentValue + '%';
                }, 30);
            }
        });
    },
    
    // ========================================================================
    // ABOUT SECTION ANIMATIONS
    // ========================================================================
    
    setupAboutAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.target.classList.contains('value-card')) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        const valueCards = document.querySelectorAll('.value-card');
        valueCards.forEach(card => {
            observer.observe(card);
        });
    },
    
    // ========================================================================
    // SERVICES SECTION ANIMATIONS
    // ========================================================================
    
    setupServicesAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.target.classList.contains('service-card')) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            observer.observe(card);
        });
    },
    
    // ========================================================================
    // HOW IT WORKS SECTION ANIMATIONS
    // ========================================================================
    
    setupHowItWorksAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateStepCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        const howItWorksSection = document.getElementById('como-funciona-nextbizgrowthhub-4-pasos-hacia-el-crecimiento');
        if (howItWorksSection) {
            observer.observe(howItWorksSection);
        }
    },
    
    animateStepCounters() {
        const counters = document.querySelectorAll('.step-counter');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            let current = 0;
            const increment = Math.ceil(target / 20);
            
            const counterInterval = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(counterInterval);
                }
                counter.textContent = current;
            }, 50);
        });
    },
    
    // ========================================================================
    // CASE STUDIES SECTION ANIMATIONS
    // ========================================================================
    
    setupCaseStudiesAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.target.classList.contains('case-study-card')) {
                    this.animateCaseStudyMetrics(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        const caseStudyCards = document.querySelectorAll('.case-study-card');
        caseStudyCards.forEach(card => {
            observer.observe(card);
        });
    },
    
    animateCaseStudyMetrics(card) {
        const metricNumbers = card.querySelectorAll('.metric-number');
        
        metricNumbers.forEach(metric => {
            const text = metric.textContent;
            const isNegative = text.includes('-');
            const numberMatch = text.match(/\d+/);
            
            if (numberMatch) {
                const finalValue = parseInt(numberMatch[0]);
                let currentValue = 0;
                const increment = Math.ceil(finalValue / 25);
                
                const counter = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= finalValue) {
                        currentValue = finalValue;
                        clearInterval(counter);
                    }
                    
                    const prefix = isNegative ? '-' : '+';
                    metric.textContent = prefix + currentValue + '%';
                }, 40);
            }
        });
    },
    
    // ========================================================================
    // TESTIMONIALS SECTION ANIMATIONS
    // ========================================================================
    
    setupTestimonialsAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.target.classList.contains('testimonial-card')) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        testimonialCards.forEach(card => {
            observer.observe(card);
        });
    },
    
    // ========================================================================
    // EVENT LISTENERS
    // ========================================================================
    
    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        // Close mobile menu when clicking on a link
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            const header = document.querySelector('header');
            const mobileMenuToggle = document.getElementById('mobileMenuToggle');
            
            if (header && !header.contains(e.target) && this.mobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
        
        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.mobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}
