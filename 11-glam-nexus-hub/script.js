// ============================================================================
// GLAMNEXUSHUB LANDING PAGE - CUSTOM JAVASCRIPT
// Mobile-First Interactive Functionality
// ============================================================================

// Application State
const app = {
    theme: 'light',
    mobileMenuOpen: false,
    scrolled: false,
    brandsCarouselIndex: 0,
    brandsCarouselItemsPerView: 1,
    cookieConsentKey: 'glamnexushub-cookie-consent',
    
    // Initialize the application
    init() {
        this.setupTheme();
        this.setupMobileMenu();
        this.setupScrollBehavior();
        this.setupSmoothScroll();
        this.setupParallax();
        this.setupBrandsCarousel();
        this.setupProductFilters();
        this.setupGuideModals();
        this.setupCookieBanner();
    },
    
    // Theme Management
    setupTheme() {
        // Check for saved theme preference or system preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        this.theme = savedTheme || (prefersDark ? 'dark' : 'light');
        this.applyTheme(this.theme);
        
        // Setup theme toggle button
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    },
    
    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.theme);
        localStorage.setItem('theme', this.theme);
    },
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.setAttribute('aria-pressed', theme === 'dark');
        }
    },
    
    // Mobile Menu Management
    setupMobileMenu() {
        const menuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (!menuToggle || !mobileMenu) return;
        
        // Toggle menu on button click
        menuToggle.addEventListener('click', () => {
            this.mobileMenuOpen = !this.mobileMenuOpen;
            this.updateMobileMenu();
        });
        
        // Close menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.mobileMenuOpen = false;
                this.updateMobileMenu();
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('header#glamnexushub')) {
                if (this.mobileMenuOpen) {
                    this.mobileMenuOpen = false;
                    this.updateMobileMenu();
                }
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.mobileMenuOpen) {
                this.mobileMenuOpen = false;
                this.updateMobileMenu();
            }
        });
    },
    
    updateMobileMenu() {
        const menuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (!menuToggle || !mobileMenu) return;
        
        if (this.mobileMenuOpen) {
            mobileMenu.classList.add('active');
            menuToggle.setAttribute('aria-expanded', 'true');
        } else {
            mobileMenu.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    },
    
    // Scroll Behavior
    setupScrollBehavior() {
        const header = document.querySelector('header#glamnexushub');
        if (!header) return;
        
        window.addEventListener('scroll', () => {
            const isScrolled = window.scrollY > 10;
            
            if (isScrolled && !this.scrolled) {
                header.classList.add('scrolled');
                this.scrolled = true;
            } else if (!isScrolled && this.scrolled) {
                header.classList.remove('scrolled');
                this.scrolled = false;
            }
        }, { passive: true });
    },
    
    // Parallax Effect for Hero Section
    setupParallax() {
        const heroBackground = document.getElementById('heroBackground');
        if (!heroBackground) return;
        
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const parallaxOffset = scrollY * 0.5;
            heroBackground.style.transform = `translateY(${parallaxOffset}px)`;
        }, { passive: true });
    },
    
    // Brands Carousel
    setupBrandsCarousel() {
        const carousel = document.getElementById('brandsCarousel');
        const track = document.getElementById('brandsTrack');
        const prevBtn = document.getElementById('brandsPrev');
        const nextBtn = document.getElementById('brandsNext');
        const dotsContainer = document.getElementById('brandsDots');
        
        if (!carousel || !track || !prevBtn || !nextBtn || !dotsContainer) return;
        
        // Determine items per view based on screen size
        this.updateBrandsCarouselItemsPerView();
        
        // Get total items
        const items = track.querySelectorAll('.brand-logo-item');
        const totalItems = items.length;
        const totalSlides = Math.ceil(totalItems / this.brandsCarouselItemsPerView);
        
        // Create dots
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = `brand-dot ${i === 0 ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Ir a marca ${i + 1}`);
            dot.addEventListener('click', () => this.goToBrandSlide(i, track, dotsContainer, totalSlides));
            dotsContainer.appendChild(dot);
        }
        
        // Navigation buttons
        prevBtn.addEventListener('click', () => this.prevBrandSlide(track, dotsContainer, totalSlides));
        nextBtn.addEventListener('click', () => this.nextBrandSlide(track, dotsContainer, totalSlides));
        
        // Brand logo buttons - open modal
        const brandLogoBtns = track.querySelectorAll('.brand-logo-btn');
        brandLogoBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const brandItem = e.currentTarget.closest('.brand-logo-item');
                const brandId = brandItem.getAttribute('data-brand');
                this.openBrandModal(brandId);
            });
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.updateBrandsCarouselItemsPerView();
            this.updateBrandCarouselPosition(track);
        });
    },
    
    updateBrandsCarouselItemsPerView() {
        if (window.innerWidth >= 1024) {
            this.brandsCarouselItemsPerView = 4;
        } else if (window.innerWidth >= 768) {
            this.brandsCarouselItemsPerView = 2;
        } else {
            this.brandsCarouselItemsPerView = 1;
        }
    },
    
    updateBrandCarouselPosition(track) {
        const itemWidth = 100 / this.brandsCarouselItemsPerView;
        const offset = -this.brandsCarouselIndex * itemWidth;
        track.style.transform = `translateX(${offset}%)`;
    },
    
    goToBrandSlide(index, track, dotsContainer, totalSlides) {
        this.brandsCarouselIndex = index;
        this.updateBrandCarouselPosition(track);
        this.updateBrandDots(dotsContainer);
    },
    
    prevBrandSlide(track, dotsContainer, totalSlides) {
        this.brandsCarouselIndex = (this.brandsCarouselIndex - 1 + totalSlides) % totalSlides;
        this.updateBrandCarouselPosition(track);
        this.updateBrandDots(dotsContainer);
    },
    
    nextBrandSlide(track, dotsContainer, totalSlides) {
        this.brandsCarouselIndex = (this.brandsCarouselIndex + 1) % totalSlides;
        this.updateBrandCarouselPosition(track);
        this.updateBrandDots(dotsContainer);
    },
    
    updateBrandDots(dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.brand-dot');
        dots.forEach((dot, index) => {
            if (index === this.brandsCarouselIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    },
    
    // Brand Modal
    openBrandModal(brandId) {
        const modal = document.getElementById('brandModal');
        const title = document.getElementById('brandModalTitle');
        const description = document.getElementById('brandModalDescription');
        const image = document.getElementById('brandModalImage');
        
        // Brand data
        const brandData = {
            anastasia: {
                name: 'Anastasia Beverly Hills',
                description: 'Marca líder en maquillaje y cejas con productos de calidad profesional. Conocida por sus paletas de sombras y productos de cejas innovadores que se han convertido en estándares de la industria.'
            },
            charlotte: {
                name: 'Charlotte Tilbury',
                description: 'Cosmética de lujo británica que combina la belleza con la sofisticación. Sus productos son conocidos por su fórmulas de larga duración y su elegante presentación.'
            },
            dior: {
                name: 'Dior',
                description: 'Casa de moda francesa de prestigio mundial. Su línea de belleza ofrece productos premium que reflejan la elegancia y el lujo característicos de la marca.'
            },
            fenty: {
                name: 'Fenty Beauty',
                description: 'Marca revolucionaria de belleza inclusiva fundada por Rihanna. Conocida por su amplia gama de tonos y productos innovadores de alta calidad.'
            },
            guerlain: {
                name: 'Guerlain',
                description: 'Casa de fragancias y belleza francesa con más de 190 años de historia. Especializada en perfumes de lujo y productos de cuidado de la piel premium.'
            },
            hourglass: {
                name: 'Hourglass',
                description: 'Marca de belleza de lujo conocida por sus productos de maquillaje de alta calidad y sus innovadores polvos minerales que crean un acabado impecable.'
            },
            laneige: {
                name: 'Laneige',
                description: 'Marca coreana de skincare premium especializada en productos hidratantes. Famosa por su línea Water Sleeping Mask y sus innovadores tratamientos de belleza.'
            },
            mac: {
                name: 'MAC',
                description: 'Marca profesional de maquillaje utilizada por artistas y profesionales en todo el mundo. Conocida por su amplia gama de colores y productos de calidad profesional.'
            },
            nars: {
                name: 'NARS',
                description: 'Marca de cosmética de lujo conocida por sus productos de maquillaje de alta pigmentación y sus innovadores productos de cuidado de la piel.'
            },
            tatcha: {
                name: 'Tatcha',
                description: 'Marca de skincare de lujo inspirada en la belleza japonesa. Especializada en productos de cuidado de la piel premium con ingredientes naturales.'
            },
            ysl: {
                name: 'Yves Saint Laurent',
                description: 'Casa de moda francesa de renombre mundial. Su línea de belleza ofrece productos de lujo que combinan sofisticación con innovación en cosmética.'
            },
            sephora: {
                name: 'Sephora',
                description: 'Retailer de belleza líder que ofrece una curación de las mejores marcas del mundo. Conocida por su servicio al cliente excepcional y su amplia selección.'
            }
        };
        
        const brand = brandData[brandId] || { name: 'Marca', description: 'Descripción no disponible' };
        
        title.textContent = brand.name;
        description.textContent = brand.description;
        image.src = `https://vsesvit-ai.ams3.cdn.digitaloceanspaces.com/files/6/9/0/690b70bc1efef538653097.webp`;
        image.alt = brand.name;
        
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Close modal handlers
        const closeBtn = document.getElementById('brandModalClose');
        const overlay = document.getElementById('brandModalOverlay');
        
        const closeModal = () => {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            closeBtn.removeEventListener('click', closeModal);
            overlay.removeEventListener('click', closeModal);
            document.removeEventListener('keydown', handleEscape);
        };
        
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        };
        
        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
        document.addEventListener('keydown', handleEscape);
    },
    
    // Product Filters
    setupProductFilters() {
        const categoryFilter = document.getElementById('categoryFilter');
        const priceFilter = document.getElementById('priceFilter');
        const sortFilter = document.getElementById('sortFilter');
        
        if (!categoryFilter || !priceFilter || !sortFilter) return;
        
        categoryFilter.addEventListener('change', () => this.filterProducts());
        priceFilter.addEventListener('change', () => this.filterProducts());
        sortFilter.addEventListener('change', () => this.filterProducts());
    },
    
    filterProducts() {
        const categoryFilter = document.getElementById('categoryFilter').value;
        const priceFilter = document.getElementById('priceFilter').value;
        const sortFilter = document.getElementById('sortFilter').value;
        const productsGrid = document.getElementById('productsGrid');
        const products = Array.from(productsGrid.querySelectorAll('.product-card'));
        
        // Filter products
        let filtered = products.filter(product => {
            const category = product.getAttribute('data-category');
            const price = parseInt(product.getAttribute('data-price'));
            
            // Category filter
            if (categoryFilter && category !== categoryFilter) return false;
            
            // Price filter
            if (priceFilter) {
                const [min, max] = priceFilter.split('-').map(v => v === '+' ? Infinity : parseInt(v));
                if (price < min || (max && price > max)) return false;
            }
            
            return true;
        });
        
        // Sort products
        if (sortFilter === 'price-low') {
            filtered.sort((a, b) => parseInt(a.getAttribute('data-price')) - parseInt(b.getAttribute('data-price')));
        } else if (sortFilter === 'price-high') {
            filtered.sort((a, b) => parseInt(b.getAttribute('data-price')) - parseInt(a.getAttribute('data-price')));
        }
        
        // Update grid
        productsGrid.innerHTML = '';
        filtered.forEach(product => {
            productsGrid.appendChild(product.cloneNode(true));
        });
        
        // Re-attach event listeners to product buttons
        const productBtns = productsGrid.querySelectorAll('.product-btn');
        productBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const productName = e.currentTarget.closest('.product-card').querySelector('.product-name').textContent;
                alert(`${productName} añadido al carrito`);
            });
        });
    },
    
    // Guide Modals
    setupGuideModals() {
        const guideButtons = document.querySelectorAll('.guide-card-btn');
        const modal = document.getElementById('guideModal');
        const closeBtn = document.getElementById('guideModalClose');
        const overlay = document.getElementById('guideModalOverlay');
        
        if (!modal || !guideButtons.length) return;
        
        // Guide content data
        const guideContent = {
            'paleta-colores': {
                title: 'Paleta de Colores para Ejecutivas',
                content: `
                    <h4>Introducción</h4>
                    <p>La paleta de colores correcta es fundamental para proyectar profesionalismo y confianza en el entorno corporativo. Esta guía te ayudará a identificar los tonos que mejor complementan tu tono de piel y personalidad profesional.</p>
                    
                    <h4>Colores Neutros Sofisticados</h4>
                    <p>Los tonos neutros como el negro, gris carbón, beige y crema son la base de cualquier guardarropa profesional. Estos colores transmiten autoridad y elegancia, y funcionan como lienzo perfecto para accesorios y detalles.</p>
                    
                    <h4>Acentos de Color</h4>
                    <p>Incorpora acentos en tonos como azul marino, burdeos, verde bosque o blanco puro. Estos colores añaden interés visual sin comprometer la profesionalidad. Úsalos en blusas, accesorios o prendas de abrigo.</p>
                    
                    <h4>Tonos Según tu Tipo de Piel</h4>
                    <p>Si tienes tono de piel cálido, opta por tonos tierra, dorados y naranjas suaves. Para tonos fríos, elige plateados, azules y púrpuras. Los tonos neutros funcionan para todos, pero estos acentos personalizados elevarán tu look.</p>
                    
                    <h4>Combinaciones Ganadoras</h4>
                    <p>Prueba estas combinaciones clásicas: negro con blanco, gris con azul marino, beige con burdeos. Estas combinaciones nunca fallan y crean un impacto visual profesional inmediato.</p>
                `
            },
            'tendencias-2025': {
                title: 'Tendencias de Moda Profesional 2025',
                content: `
                    <h4>Cortes Innovadores</h4>
                    <p>En 2025, los cortes oversized y las siluetas relajadas dominan el mundo profesional. Los blazers con hombros caídos y los pantalones de cintura alta crean una línea elegante y moderna que proyecta confianza.</p>
                    
                    <h4>Materiales Sostenibles</h4>
                    <p>La moda profesional se inclina hacia materiales ecológicos como lino, algodón orgánico y fibras recicladas. Estas opciones no solo son responsables con el medio ambiente, sino que también ofrecen comodidad superior.</p>
                    
                    <h4>Detalles Minimalistas</h4>
                    <p>Los detalles sutiles como costuras contrastantes, botones de diseño y texturas interesantes añaden sofisticación sin ser excesivos. Busca prendas con estos detalles para elevar tu look profesional.</p>
                    
                    <h4>Paleta de Colores 2025</h4>
                    <p>Los colores de tendencia incluyen tonos tierra profundos, grises cálidos, azules profundos y acentos en terracota. Estos tonos crean una apariencia sofisticada y contemporánea.</p>
                    
                    <h4>Accesorios Estratégicos</h4>
                    <p>Los accesorios minimalistas pero de calidad son clave. Opta por bolsos estructurados, joyería geométrica y cinturones de cuero fino que complementen tu look sin distraer.</p>
                `
            },
            'rutina-15min': {
                title: 'Rutina de Belleza Ejecutiva de 15 Minutos',
                content: `
                    <h4>Paso 1: Limpieza (2 minutos)</h4>
                    <p>Comienza con un limpiador rápido que no requiera enjuague. Aplica, masajea suavemente y retira con un pañuelo. Esto prepara tu piel para los siguientes pasos.</p>
                    
                    <h4>Paso 2: Hidratación (2 minutos)</h4>
                    <p>Aplica un hidratante ligero o BB cream que actúe como base. Esto crea una base suave para el maquillaje y mantiene tu piel hidratada durante el día.</p>
                    
                    <h4>Paso 3: Maquillaje Base (3 minutos)</h4>
                    <p>Usa un corrector bajo los ojos y un polvo translúcido para fijar. Esto crea una base impecable sin necesidad de maquillaje completo.</p>
                    
                    <h4>Paso 4: Mejillas y Labios (3 minutos)</h4>
                    <p>Aplica un rubor cremoso en las mejillas y un tinte labial de larga duración. Estos productos multifuncionales ahorran tiempo y crean un look cohesivo.</p>
                    
                    <h4>Paso 5: Ojos y Cejas (3 minutos)</h4>
                    <p>Define tus cejas con un lápiz rápido y aplica un delineador de ojos en la línea de las pestañas superiores. Termina con máscara de pestañas para abrir la mirada.</p>
                    
                    <h4>Paso 6: Fijación (2 minutos)</h4>
                    <p>Aplica un spray fijador para asegurar que tu maquillaje dure todo el día. Esto es especialmente importante para profesionales con agendas apretadas.</p>
                `
            },
            'accesorios-presencia': {
                title: 'Accesorios que Elevan tu Presencia',
                content: `
                    <h4>Bolsos de Diseñador</h4>
                    <p>Un bolso de calidad es la inversión más importante. Opta por diseños estructurados en colores neutros que combinen con múltiples outfits. Un bolso de cuero fino comunica profesionalismo inmediato.</p>
                    
                    <h4>Joyería Elegante</h4>
                    <p>Menos es más en el mundo profesional. Elige piezas geométricas en oro, plata o acero inoxidable. Un reloj de calidad, aretes discretos y un anillo minimalista crean un look pulido.</p>
                    
                    <h4>Cinturones Estructurados</h4>
                    <p>Un cinturón de cuero fino define la cintura y añade estructura a tu silueta. Elige colores que combinen con tu guardarropa: negro, marrón o tonos metálicos.</p>
                    
                    <h4>Pañuelos de Seda</h4>
                    <p>Un pañuelo de seda añade sofisticación instantánea. Úsalo alrededor del cuello, como diadema o en tu bolso. Los tonos sólidos o patrones geométricos funcionan mejor en contextos profesionales.</p>
                    
                    <h4>Zapatos de Calidad</h4>
                    <p>Los zapatos comunican mucho sobre tu profesionalismo. Invierte en zapatos de cuero fino en colores neutros. Los tacones moderados (3-5 cm) son cómodos y profesionales.</p>
                    
                    <h4>Gafas de Sol Premium</h4>
                    <p>Unas gafas de sol de calidad protegen tus ojos y añaden un toque de sofisticación. Elige marcos que complementen la forma de tu rostro y que sean versátiles.</p>
                `
            }
        };
        
        // Setup guide buttons
        guideButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const guideId = e.currentTarget.getAttribute('data-guide');
                const guide = guideContent[guideId];
                
                if (guide) {
                    document.getElementById('guideModalTitle').textContent = guide.title;
                    document.getElementById('guideModalContent').innerHTML = guide.content;
                    modal.classList.add('active');
                    modal.setAttribute('aria-hidden', 'false');
                    document.body.style.overflow = 'hidden';
                }
            });
        });
        
        // Close modal handlers
        const closeModal = () => {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };
        
        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    },

    // Cookie Consent
    setupCookieBanner() {
        const banner = document.querySelector('.cookie-banner');
        if (!banner) return;

        let savedChoice = null;
        try {
            savedChoice = localStorage.getItem(this.cookieConsentKey);
        } catch (error) {
            savedChoice = null;
        }

        if (savedChoice) {
            banner.setAttribute('hidden', '');
            return;
        }

        const acceptButton = banner.querySelector('[data-cookie-accept]');
        const declineButton = banner.querySelector('[data-cookie-decline]');

        banner.removeAttribute('hidden');

        const handleChoice = (choice) => {
            try {
                localStorage.setItem(this.cookieConsentKey, choice);
            } catch (error) {
                // ignore storage errors
            }
            banner.setAttribute('hidden', '');
        };

        if (acceptButton) {
            acceptButton.addEventListener('click', () => handleChoice('accepted'));
        }

        if (declineButton) {
            declineButton.addEventListener('click', () => handleChoice('declined'));
        }
    },

    // Smooth Scroll for Anchor Links
    setupSmoothScroll() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;
            
            const href = link.getAttribute('href');
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                // Close mobile menu if open
                if (this.mobileMenuOpen) {
                    this.mobileMenuOpen = false;
                    this.updateMobileMenu();
                }
                
                // Scroll to target with offset for sticky header
                const headerHeight = document.querySelector('header#glamnexushub')?.offsetHeight || 80;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
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
