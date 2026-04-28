/* =========================================================================
   MAIN.JS - LGC (Versión Definitiva Optimizada)
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {

    // 1. LÓGICA DE MENÚ MÓVIL Y ACORDEÓN
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const parentLi = document.querySelector('.dropdown');
    const btnCerrar = document.getElementById('btn-cerrar-menu');
    const allLinks = document.querySelectorAll('.nav-links a:not(.dropdown-toggle)');

    if (menuToggle && navLinks) {
        // Abrir menú
        menuToggle.addEventListener('click', () => {
            navLinks.classList.add('menu-abierto');
            document.body.style.overflow = 'hidden';
        });

        // Cerrar menú con botón "VOLVER"
        if (btnCerrar) {
            btnCerrar.addEventListener('click', () => {
                navLinks.classList.remove('menu-abierto');
                document.body.style.overflow = 'auto';
            });
        }

        // Cerrar menú al tocar cualquier link (excepto 'Servicios')
        allLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('menu-abierto');
                document.body.style.overflow = 'auto';
            });
        });

        // Manejo del Acordeón "Servicios"
        if (dropdownToggle) {
            dropdownToggle.addEventListener('click', (e) => {
                if (window.innerWidth <= 992) {
                    e.preventDefault(); 
                    parentLi.classList.toggle('active'); 
                }
            });
        }
    }

    // 2. HEADER STICKY (PC)
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

    // 3. PRE-FILTRADO DE FORMULARIO
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

    // 4. SCROLL SUAVE
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault(); 
                const headerOffset = header ? header.offsetHeight : 0;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });

    // 5. HERO SLIDER & SWIPE MÓVIL
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
        dots.forEach((dot, index) => dot.addEventListener('click', () => { currentSlide = index; showSlide(currentSlide); resetAutoSlide(); }));
    }

    const sliderContainer = document.getElementById('mainSlider');
    let touchStartX = 0;
    let touchEndX = 0;

    if (sliderContainer) {
        sliderContainer.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, {passive: true});
        sliderContainer.addEventListener('touchend', e => { touchEndX = e.changedTouches[0].screenX; handleSwipe(); }, {passive: true});
    }

    function handleSwipe() {
        const threshold = 50; 
        if (touchEndX < touchStartX - threshold) changeSlide(1); 
        if (touchEndX > touchStartX + threshold) changeSlide(-1); 
    }

    // 6. ANIMACIONES ON SCROLL
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    const revealOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); 
            }
        });
    }, revealOptions);
    revealElements.forEach(el => revealOnScroll.observe(el));

    // 7. CARRUSEL INFINITO LOGOS
    const track = document.querySelector('.logos-track');
    if (track) {
        const logos = Array.from(track.children);
        logos.forEach(logo => {
            const clone = logo.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            track.appendChild(clone);
        });
    }

    // 8. LÓGICA DE FORMULARIO Y MODAL DE ÉXITO
    const form = document.getElementById('contactForm'); 
    const successModal = document.getElementById('successModal');
    const closeBtn = document.getElementById('closeModalBtn');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Enviando...';
            submitBtn.disabled = true;

            fetch('./backend/process-form.php', {
                method: 'POST',
                body: new FormData(form)
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    successModal.style.display = 'flex';
                    void successModal.offsetWidth; 
                    successModal.classList.add('active');
                    form.reset();
                } else {
                    alert('Hubo un problema: ' + data.message);
                }
            })
            .catch(error => { alert('Error de conexión. Intente nuevamente.'); })
            .finally(() => { submitBtn.innerText = originalBtnText; submitBtn.disabled = false; });
        });
    }

    if (closeBtn && successModal) {
        closeBtn.addEventListener('click', () => {
            successModal.classList.remove('active');
            setTimeout(() => { successModal.style.display = 'none'; }, 300);
        });
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.classList.remove('active');
                setTimeout(() => { successModal.style.display = 'none'; }, 300);
            }
        });
    }
}); 

// =========================================================================
// DATOS Y FUNCIONES GLOBALES (MODALES DE CASOS DE ÉXITO)
// =========================================================================
const caseData = {
    cirion: { type: 'image', imageUrl: 'assets/img/infografias/infografia_cirion.png', altText: "Infografía | Caso de Éxito: CIRION" },
    belgrano: { type: 'image', imageUrl: 'assets/img/infografias/infografia_belgrano.png', altText: "Infografía | Caso de Éxito: BELGRANO CARGAS" },
    aleman: { type: 'image', imageUrl: 'assets/img/infografias/infografia_haleman.png', altText: "Infografía | Caso de Éxito: HOSPITAL ALEMAN" }
};

window.openCaseModal = function(caseId) {
    const data = caseData[caseId];
    const modal = document.getElementById('caseModal');
    const contentArea = document.getElementById('modal-content-area');
    const modalContainer = document.querySelector('#caseModal .modal-container'); 

    if (!data) return;
    modal.style.display = 'flex';

    if (data.type === 'image') {
        modalContainer.classList.add('image-mode');
        contentArea.innerHTML = `<div class="modal-image-wrapper"><img src="${data.imageUrl}" alt="${data.altText}" class="modal-infographic"></div>`;
    }
    void modal.offsetWidth;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; 
}

window.closeCaseModal = function() {
    const modal = document.getElementById('caseModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; 
    setTimeout(() => { modal.style.display = 'none'; }, 300);
}

window.onclick = function(event) {
    const caseModal = document.getElementById('caseModal');
    if (event.target == caseModal) closeCaseModal();
}

// =========================================================================
// TRADUCTOR AUTOMÁTICO (GOOGLE TRANSLATE HACK)
// =========================================================================

// 1. Inicializamos Google Translate oculto
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'es', 
        includedLanguages: 'en,es', 
        autoDisplay: false
    }, 'google_translate_element');
}

// 2. Inyectamos el script de Google en la web
const gtScript = document.createElement('script');
gtScript.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
document.body.appendChild(gtScript);

// 3. Lógica de los botones (Banderas)
document.addEventListener('DOMContentLoaded', () => {
    const btnEn = document.getElementById('lang-en');
    const btnEs = document.getElementById('lang-es');

    if(btnEn && btnEs) {
        btnEn.addEventListener('click', (e) => {
            e.preventDefault();
            cambiarIdioma('en');
            btnEn.classList.add('active');
            btnEs.classList.remove('active');
        });

        btnEs.addEventListener('click', (e) => {
            e.preventDefault();
            cambiarIdioma('es');
            btnEs.classList.add('active');
            btnEn.classList.remove('active');
        });
    }
});

// Función ninja para tocar el selector oculto de Google
function cambiarIdioma(idioma) {
    const select = document.querySelector('.goog-te-combo');
    if (select) {
        select.value = idioma;
        select.dispatchEvent(new Event('change')); // Simula que un humano eligió el idioma
    } else {
        // Si Google todavía no cargó, reintenta en medio segundo
        setTimeout(() => cambiarIdioma(idioma), 500);
    }
}