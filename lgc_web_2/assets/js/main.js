/* =========================================================================
   MAIN.JS - LGC (Versión Definitiva: Slider, Sticky, Formulario, Scroll, Modales)
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {

    // 1. HEADER STICKY (Lógica fluida)
    const header = document.getElementById('header');
    const heroCompo = document.querySelector('.lamas-hero-compo');
    const mainContent = document.querySelector('main');

    if (header && heroCompo) {
        window.addEventListener('scroll', () => {
            const triggerPoint = heroCompo.offsetHeight;
            if (window.scrollY >= triggerPoint) {
                header.classList.add('scrolled');
                if (mainContent) mainContent.style.marginTop = `${header.offsetHeight}px`;
            } else {
                header.classList.remove('scrolled');
                if (mainContent) mainContent.style.marginTop = '0';
            }
        });
    }

    // 2. PRE-FILTRADO DE FORMULARIO (El botón selecciona el servicio)
    const quoteButtons = document.querySelectorAll('.btn-quote-service');
    const serviceSelect = document.getElementById('servicio');

    if (quoteButtons.length > 0 && serviceSelect) {
        quoteButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const serviceValue = this.getAttribute('data-servicio');
                if (serviceValue) {
                    serviceSelect.value = serviceValue;
                }
            });
        });
    }

    // 3. SCROLL SUAVE Y PRECISO (Para que al tocar enlaces no tape el título)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault(); // Evitamos el salto brusco
                
                // Calculamos cuánto mide el menú para no tapar el título al llegar
                const headerOffset = header ? header.offsetHeight : 0;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth' // Deslizamiento elegante
                });
            }
        });
    });

    // 4. HERO SLIDER AUTOMÁTICO
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    
    let currentSlide = 0;
    const slideInterval = 6000; 
    let autoSlide;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        if (slides[index]) slides[index].classList.add('active');
        if (dots[index]) dots[index].classList.add('active');
    }

    function changeSlide(direction) {
        currentSlide = (currentSlide + direction + slides.length) % slides.length;
        showSlide(currentSlide);
        resetAutoSlide();
    }

    function goToSlide(index) {
        currentSlide = index;
        showSlide(currentSlide);
        resetAutoSlide();
    }

    function startAutoSlide() {
        autoSlide = setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }, slideInterval);
    }

    function resetAutoSlide() {
        clearInterval(autoSlide);
        startAutoSlide();
    }

    if (slides.length > 0) {
        showSlide(currentSlide);
        startAutoSlide();
        if (prevBtn) prevBtn.addEventListener('click', () => changeSlide(-1));
        if (nextBtn) nextBtn.addEventListener('click', () => changeSlide(1));
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => goToSlide(index));
        });
    }

    // 5. DROPDOWN MENU
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    if (dropdownToggle && dropdownMenu) {
        dropdownToggle.addEventListener('click', function(e) {
            e.preventDefault(); 
            this.parentElement.classList.toggle('open');
        });

        // Cerrar el submenú si hacés clic en cualquier otra parte
        document.addEventListener('click', function(e) {
            if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownToggle.parentElement.classList.remove('open');
            }
        });
    }

    // 6. ANIMACIONES ON SCROLL (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    
    const revealOptions = {
        threshold: 0.15, 
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); 
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

// 7. MENÚ HAMBURGUESA (MÓVIL)
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        // Abrir/Cerrar menú al tocar las rayitas
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            mobileBtn.classList.toggle('active'); // Convierte rayas en X
        });

        // Cerrar el menú automáticamente si tocamos un link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                mobileBtn.classList.remove('active');
            });
        });
    }

}); // <--- ACA CERRAMOS EL DOMContentLoaded PARA QUE LO DE ABAJO SEA GLOBAL


// =========================================================================
// DATOS Y FUNCIONES GLOBALES (MODALES DE CASOS DE ÉXITO)
// =========================================================================

const caseData = {
    cirion: {
        title: "CIRION Technologies",
        sector: "Telecomunicaciones e Infraestructura",
        desafio: "Cumplimiento normativo en infraestructura crítica: antenas, combustibles y gestión ISO 14001.",
        intervencion: [
            "Auditorías de certificación ISO 14001",
            "Matrices legales Ambientales y SySO",
            "Plan de monitoreo de radiación (RNI)",
            "Gestión de tanques de combustible"
        ],
        resultados: [
            "Reducción de riesgos regulatorios críticos",
            "Trazabilidad documental total",
            "Certificación exitosa del sistema de gestión",
            "Ordenamiento de obligaciones ambientales"
        ]
    },
    belgrano: {
        title: "Belgrano Cargas y Logística",
        sector: "Transporte Ferroviario Nacional",
        desafio: "Diagnóstico y regularización de 33 establecimientos ferroviarios a escala nacional.",
        intervencion: [
            "Relevamiento y Línea de Base en 33 sedes",
            "Matrices Legales por jurisdicción",
            "Protocolos de control de derrames y efluentes",
            "Seguridad en transporte de sustancias peligrosas"
        ],
        resultados: [
            "Sistema de cumplimiento continuo nacional",
            "Estandarización de procedimientos operativos",
            "Minimización de riesgos en inspecciones",
            "Manuales operativos ambientales específicos"
        ]
    },
    bbva: {
        title: "BBVA Argentina",
        sector: "Sector Financiero",
        desafio: "Certificación ISO 14001 en 20 sucursales y plan de ecoeficiencia global.",
        intervencion: [
            "Determinación de Huella de Carbono",
            "Certificación ISO 45001 en Edificios Centrales",
            "Estudio de dinámica de humos y evacuación",
            "Capacitación y concientización ambiental"
        ],
        resultados: [
            "Alineación con estándares de ecoeficiencia global",
            "Certificación de seguridad en edificios clave",
            "Mejora en la gestión de GEI (Gases Efecto Invernadero)",
            "Acompañamiento en actualización normativa permanente"
        ]
    }
};

function openCaseModal(caseId) {
    const data = caseData[caseId];
    const modal = document.getElementById('caseModal');
    const contentArea = document.getElementById('modal-content-area');

    if (!data) return;

    // Generamos el HTML de la infografía
    contentArea.innerHTML = `
        <div class="info-header">
            <span class="section-tag">${data.sector}</span>
            <h2 class="hero-title" style="font-size: 1.8rem; color: var(--clr-primary);">${data.title}</h2>
        </div>
        <div class="info-grid">
            <div class="info-box">
                <h4>El Desafío</h4>
                <p>${data.desafio}</p>
            </div>
            <div class="info-box">
                <h4>Intervención LGC</h4>
                <ul class="info-list">
                    ${data.intervencion.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            <div class="info-results">
                <h4>Impacto y Resultados</h4>
                <ul class="info-list" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    ${data.resultados.map(res => `<li><strong>${res}</strong></li>`).join('')}
                </ul>
            </div>
        </div>
    `;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Bloquea el scroll de fondo
}

function closeCaseModal() {
    document.getElementById('caseModal').style.display = 'none';
    document.body.style.overflow = 'auto'; // Restaura el scroll
}

// Cerrar al hacer clic en el fondo gris del modal
window.onclick = function(event) {
    const modal = document.getElementById('caseModal');
    if (event.target == modal) {
        closeCaseModal();
    }
}