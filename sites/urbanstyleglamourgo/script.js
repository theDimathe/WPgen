// ============================================================================
// URBANSTYLEGLAMOURGO - CUSTOM JAVASCRIPT
// Mobile-First Interactive Features
// ============================================================================

// Application State
const app = {
    theme: 'light',
    mobileMenuOpen: false,
    carouselIndex: 0,
    
    init() {
        this.setupTheme();
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupEventListeners();
        this.setupParallax();
        this.setupScrollAnimations();
        this.setupCarousel();
        this.setupFormValidation();
    },
    
    // ========================================================================
    // THEME MANAGEMENT
    // ========================================================================
    
    setupTheme() {
        // Check for saved theme preference or system preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        this.theme = savedTheme || (prefersDark ? 'dark' : 'light');
        this.applyTheme(this.theme);
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    },
    
    applyTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    },
    
    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    },
    
    // ========================================================================
    // MOBILE MENU MANAGEMENT
    // ========================================================================
    
    setupMobileMenu() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const drawer = document.querySelector('.mobile-nav-drawer');
        const links = document.querySelectorAll('.mobile-nav-link');
        
        if (!toggle || !drawer) return;
        
        // Toggle menu on button click
        toggle.addEventListener('click', () => {
            this.toggleMobileMenu(toggle, drawer);
        });
        
        // Close menu when a link is clicked
        links.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu(toggle, drawer);
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.header') && this.mobileMenuOpen) {
                this.closeMobileMenu(toggle, drawer);
            }
        });
    },
    
    toggleMobileMenu(toggle, drawer) {
        if (this.mobileMenuOpen) {
            this.closeMobileMenu(toggle, drawer);
        } else {
            this.openMobileMenu(toggle, drawer);
        }
    },
    
    openMobileMenu(toggle, drawer) {
        this.mobileMenuOpen = true;
        drawer.style.display = 'block';
        drawer.classList.add('active');
        toggle.setAttribute('aria-expanded', 'true');
        
        // Toggle icons
        const hamburger = toggle.querySelector('.hamburger-icon');
        const close = toggle.querySelector('.close-icon');
        if (hamburger) hamburger.style.display = 'none';
        if (close) close.style.display = 'block';
    },
    
    closeMobileMenu(toggle, drawer) {
        this.mobileMenuOpen = false;
        drawer.style.display = 'none';
        drawer.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        
        // Toggle icons
        const hamburger = toggle.querySelector('.hamburger-icon');
        const close = toggle.querySelector('.close-icon');
        if (hamburger) hamburger.style.display = 'block';
        if (close) close.style.display = 'none';
    },
    
    // ========================================================================
    // SMOOTH SCROLL
    // ========================================================================
    
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    },
    
    // ========================================================================
    // PARALLAX EFFECT
    // ========================================================================
    
    setupParallax() {
        const heroBackground = document.querySelector('.hero-background');
        if (!heroBackground) return;
        
        // Only apply parallax on desktop
        if (window.innerWidth >= 768) {
            window.addEventListener('scroll', () => {
                const scrollPosition = window.scrollY;
                const heroSection = document.querySelector('.hero');
                const heroTop = heroSection.offsetTop;
                const heroHeight = heroSection.offsetHeight;
                
                // Only apply parallax when hero is in view
                if (scrollPosition < heroTop + heroHeight) {
                    const offset = (scrollPosition - heroTop) * 0.5;
                    heroBackground.style.transform = `translateY(${offset}px)`;
                }
            });
        }
    },
    
    // ========================================================================
    // CAROUSEL FUNCTIONALITY
    // ========================================================================
    
    setupCarousel() {
        const track = document.querySelector('.carousel-track');
        const dotsContainer = document.querySelector('.carousel-dots');
        
        if (!track || !dotsContainer) return;
        
        const slides = document.querySelectorAll('.carousel-slide');
        const slideCount = slides.length;
        
        // Create dots
        for (let i = 0; i < slideCount; i++) {
            const dot = document.createElement('button');
            dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => {
                this.goToSlide(i, track, dotsContainer);
            });
            dotsContainer.appendChild(dot);
        }
        
        // Update dots on scroll
        track.addEventListener('scroll', () => {
            this.updateCarouselDots(track, dotsContainer);
        });
    },
    
    goToSlide(index, track, dotsContainer) {
        const slides = track.querySelectorAll('.carousel-slide');
        const slideWidth = slides[0].offsetWidth;
        const scrollPosition = index * (slideWidth + 16); // 16px is the gap
        
        track.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        
        this.updateCarouselDots(track, dotsContainer);
    },
    
    updateCarouselDots(track, dotsContainer) {
        const slides = track.querySelectorAll('.carousel-slide');
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        const slideWidth = slides[0].offsetWidth;
        const gap = 16;
        const scrollPosition = track.scrollLeft;
        
        const currentIndex = Math.round(scrollPosition / (slideWidth + gap));
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    },
    
    // ========================================================================
    // FORM VALIDATION
    // ========================================================================
    
    setupFormValidation() {
        const form = document.querySelector('.contact-form');
        if (!form) return;

        const nameInput = form.querySelector('input[name="name"]');
        const emailInput = form.querySelector('input[name="email"]');
        const phoneInput = form.querySelector('input[name="phone"]');
        const topicSelect = form.querySelector('select[name="topic"]');
        const messageInput = form.querySelector('textarea[name="message"]');
        const consentCheckbox = form.querySelector('input[name="consent"]');

        if (!nameInput || !emailInput || !messageInput || !consentCheckbox) return;

        // Real-time validation
        nameInput.addEventListener('blur', () => {
            this.validateName(nameInput);
        });

        emailInput.addEventListener('blur', () => {
            this.validateEmail(emailInput);
        });

        if (phoneInput) {
            phoneInput.addEventListener('blur', () => {
                this.validatePhone(phoneInput);
            });
        }

        if (topicSelect) {
            topicSelect.addEventListener('change', () => {
                this.validateTopic(topicSelect);
            });
        }

        messageInput.addEventListener('blur', () => {
            this.validateMessage(messageInput);
        });

        consentCheckbox.addEventListener('change', () => {
            this.validateConsent(consentCheckbox);
        });

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitForm({
                form,
                nameInput,
                emailInput,
                phoneInput,
                topicSelect,
                messageInput,
                consentCheckbox
            });
        });
    },
    
    validateName(input) {
        const value = input.value.trim();
        const errorEl = input.parentElement.querySelector('.form-error');
        
        if (!value) {
            if (errorEl) errorEl.style.display = 'block';
            input.style.borderColor = '#D32F2F';
            return false;
        } else {
            if (errorEl) errorEl.style.display = 'none';
            input.style.borderColor = '';
            return true;
        }
    },
    
    validateEmail(input) {
        const value = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const errorEl = input.parentElement.querySelector('.form-error');

        if (!value || !emailRegex.test(value)) {
            if (errorEl) {
                errorEl.textContent = 'Por favor ingresa un correo válido';
                errorEl.style.display = 'block';
            }
            input.style.borderColor = '#D32F2F';
            return false;
        } else {
            if (errorEl) errorEl.style.display = 'none';
            input.style.borderColor = '';
            return true;
        }
    },

    validatePhone(input) {
        const value = input.value.trim();
        const errorEl = input.parentElement.querySelector('.form-error');
        const phoneRegex = /^$|^[+]?[(0-9)\s-]{7,}$/;

        if (!phoneRegex.test(value)) {
            if (errorEl) {
                errorEl.textContent = 'Ingresa un teléfono válido';
                errorEl.style.display = 'block';
            }
            input.style.borderColor = '#D32F2F';
            return false;
        }

        if (errorEl) errorEl.style.display = 'none';
        input.style.borderColor = '';
        return true;
    },

    validateTopic(select) {
        if (!select) return true;
        const value = select.value;
        const errorEl = select.parentElement.querySelector('.form-error');

        if (!value) {
            if (errorEl) errorEl.style.display = 'block';
            select.style.borderColor = '#D32F2F';
            return false;
        }

        if (errorEl) errorEl.style.display = 'none';
        select.style.borderColor = '';
        return true;
    },

    validateMessage(input) {
        const value = input.value.trim();
        const errorEl = input.parentElement.querySelector('.form-error');

        if (value.length < 10) {
            if (errorEl) {
                errorEl.textContent = 'Cuéntanos un poco más';
                errorEl.style.display = 'block';
            }
            input.style.borderColor = '#D32F2F';
            return false;
        }

        if (errorEl) errorEl.style.display = 'none';
        input.style.borderColor = '';
        return true;
    },

    validateConsent(input) {
        const errorEl = input.parentElement.querySelector('.form-error');

        if (!input.checked) {
            if (errorEl) errorEl.style.display = 'block';
            return false;
        } else {
            if (errorEl) errorEl.style.display = 'none';
            return true;
        }
    },

    submitForm({ form, nameInput, emailInput, phoneInput, topicSelect, messageInput, consentCheckbox }) {
        // Validate all fields
        const isNameValid = this.validateName(nameInput);
        const isEmailValid = this.validateEmail(emailInput);
        const isPhoneValid = phoneInput ? this.validatePhone(phoneInput) : true;
        const isTopicValid = this.validateTopic(topicSelect);
        const isMessageValid = this.validateMessage(messageInput);
        const isConsentValid = this.validateConsent(consentCheckbox);

        const validations = [isNameValid, isEmailValid, isPhoneValid, isTopicValid, isMessageValid, isConsentValid];

        if (!validations.every(Boolean)) {
            return;
        }

        // Prepare form data
        const formData = new FormData(form);
        
        // Submit form
        fetch(form.action, {
            method: form.method,
            body: formData
        })
        .then(response => {
            if (response.ok) {
                // Show success message
                const successEl = form.querySelector('.form-success');
                if (successEl) {
                    successEl.style.display = 'block';
                }
                
                // Reset form
                form.reset();
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    if (successEl) {
                        successEl.style.display = 'none';
                    }
                }, 5000);
            }
        })
        .catch(error => {
            console.error('Form submission error:', error);
        });
    },
    
    // ========================================================================
    // SCROLL ANIMATIONS
    // ========================================================================
    
    setupScrollAnimations() {
        // Fade in gallery images on scroll
        const galleryItems = document.querySelectorAll('.gallery-item');
        const collectionCards = document.querySelectorAll('.collection-card');
        const whyUsCards = document.querySelectorAll('.why-us-card');
        const galleryFigures = document.querySelectorAll('.gallery-figure');
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        entry.target.style.animation = `fadeInUp 0.6s ease-in-out ${index * 0.1}s forwards`;
                        entry.target.style.opacity = '0';
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            
            [
                ...galleryItems,
                ...collectionCards,
                ...whyUsCards,
                ...galleryFigures,
                ...testimonialCards
            ].forEach(element => {
                imageObserver.observe(element);
            });
        }
    },
    
    // ========================================================================
    // EVENT LISTENERS
    // ========================================================================
    
    setupEventListeners() {
        // Theme toggle button
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
        
        // Search button & modal
        const searchBtn = document.querySelector('.search-btn');
        const searchModal = document.querySelector('.search-modal');
        const searchInput = searchModal ? searchModal.querySelector('#search-modal-input') : null;
        const searchForm = searchModal ? searchModal.querySelector('.search-modal__form') : null;
        const searchCloseTriggers = searchModal ? searchModal.querySelectorAll('[data-close="search"]') : [];

        const openSearchModal = () => {
            if (!searchModal) return;
            searchModal.classList.add('is-open');
            searchModal.removeAttribute('hidden');
            document.body.classList.add('no-scroll');

            window.setTimeout(() => {
                if (searchInput instanceof HTMLElement) {
                    searchInput.focus();
                }
            }, 50);
        };

        const closeSearchModal = () => {
            if (!searchModal) return;
            searchModal.classList.remove('is-open');
            searchModal.setAttribute('hidden', '');
            document.body.classList.remove('no-scroll');

            if (searchBtn instanceof HTMLElement) {
                searchBtn.focus();
            }
        };

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const isOpen = searchModal?.classList.contains('is-open');
                if (isOpen) {
                    closeSearchModal();
                } else {
                    openSearchModal();
                }
            });
        }

        searchCloseTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                closeSearchModal();
            });
        });

        if (searchModal) {
            searchModal.addEventListener('click', (event) => {
                const target = event.target;
                if (target instanceof HTMLElement && target.dataset.close === 'search') {
                    closeSearchModal();
                }
            });
        }

        if (searchForm) {
            searchForm.addEventListener('submit', (event) => {
                event.preventDefault();
                closeSearchModal();
            });
        }

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && searchModal?.classList.contains('is-open')) {
                closeSearchModal();
            }
        });
    }
};

// ============================================================================
// INITIALIZATION
// ============================================================================

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        app.init();
    });
} else {
    app.init();
}

function acceptCookies() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
        banner.style.display = 'none';
    }
}
