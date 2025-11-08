const NEXTAPP_APP = {
    theme: 'dark',
    metricsAnimated: false,

    init() {
        this.applySavedTheme();
        this.bindEvents();
        this.observeMetrics();
        this.observeReveal();
    },

    applySavedTheme() {
        const stored = localStorage.getItem('nextapp-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.theme = stored || (prefersDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', this.theme);
        const toggle = document.getElementById('themeToggle');
        if (toggle) {
            toggle.setAttribute('aria-pressed', this.theme === 'light');
            toggle.querySelector('.toggle-icon').textContent = this.theme === 'light' ? '🌞' : '🌙';
        }
    },

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('nextapp-theme', this.theme);
        const toggle = document.getElementById('themeToggle');
        if (toggle) {
            toggle.setAttribute('aria-pressed', this.theme === 'light');
            toggle.querySelector('.toggle-icon').textContent = this.theme === 'light' ? '🌞' : '🌙';
        }
    },

    bindEvents() {
        const toggle = document.getElementById('themeToggle');
        if (toggle) {
            toggle.addEventListener('click', () => this.toggleTheme());
        }

        const mobileToggle = document.getElementById('mobileMenuToggle');
        const mobileMenu = document.getElementById('menuMovil');
        if (mobileToggle && mobileMenu) {
            mobileToggle.addEventListener('click', () => {
                const expanded = mobileToggle.getAttribute('aria-expanded') === 'true';
                mobileToggle.setAttribute('aria-expanded', String(!expanded));
                mobileMenu.classList.toggle('active');
            });
            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.remove('active');
                    mobileToggle.setAttribute('aria-expanded', 'false');
                });
            });
        }
    },

    observeMetrics() {
        const section = document.getElementById('rendimiento');
        if (!section) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.metricsAnimated) {
                    this.animateMetrics();
                    this.metricsAnimated = true;
                }
            });
        }, { threshold: 0.35 });

        observer.observe(section);
    },

    animateMetrics() {
        const metrics = document.querySelectorAll('.metric-value');
        metrics.forEach(metric => {
            const target = Number(metric.dataset.target || 0);
            const isPercent = metric.textContent.includes('%');
            let current = 0;
            const increment = Math.ceil(target / 60);
            const update = () => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                metric.textContent = isPercent ? `${current}%` : current.toLocaleString('es-MX');
            };
            const timer = setInterval(update, 30);
        });
    },

    observeReveal() {
        const revealables = document.querySelectorAll('.overview-card, .tool-card, .documentation-grid article, .pricing-card, .testimonial-card, .blueprint-grid article, .roadmap-list li');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        revealables.forEach(el => {
            el.classList.add('is-hidden');
            observer.observe(el);
        });
    }
};

document.addEventListener('DOMContentLoaded', () => NEXTAPP_APP.init());
