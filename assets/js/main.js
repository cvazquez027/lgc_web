// main.js - Lógica e interacciones para LGC Landing Page

document.addEventListener('DOMContentLoaded', () => {
    console.log("Sistema LGC inicializado. 🚀");

    initHeaderScroll();
    initSmoothScroll();
    initInfiniteLogos();
    initSlider();          
    initFormAutoSelect();  
    initFormValidation();  
});

/* =======================================================
   1. HEADER DINÁMICO
   ======================================================= */
function initHeaderScroll() {
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
        } else {
            header.style.boxShadow = 'none';
        }
    });
}

/* =======================================================
   2. SCROLL SUAVE PARA ANCLAS
   ======================================================= */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 100; 
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
  
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });
}

/* =======================================================
   3. HERO SLIDER 
   ======================================================= */
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const btnNext = document.querySelector('.slider-btn.next');
    const btnPrev = document.querySelector('.slider-btn.prev');
    const dotsContainer = document.querySelector('.slider-dots');
    
    if (slides.length === 0) return;

    let currentSlide = 0;

    slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function goToSlide(n) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    if(btnNext) btnNext.addEventListener('click', () => goToSlide(currentSlide + 1));
    if(btnPrev) btnPrev.addEventListener('click', () => goToSlide(currentSlide - 1));

    setInterval(() => goToSlide(currentSlide + 1), 6000);
}

/* =======================================================
   4. AUTO-SELECCIÓN DE FORMULARIO 
   ======================================================= */
function initFormAutoSelect() {
    const quoteButtons = document.querySelectorAll('.btn-quote-service');
    const serviceSelect = document.getElementById('servicio');

    quoteButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const serviceValue = btn.getAttribute('data-servicio');
            if (serviceSelect && serviceValue) {
                serviceSelect.value = serviceValue;
                serviceSelect.style.boxShadow = '0 0 0 3px rgba(203, 195, 183, 0.5)';
                setTimeout(() => serviceSelect.style.boxShadow = 'none', 1500);
            }
        });
    });
}

/* =======================================================
   5. CARRUSEL INFINITO DE LOGOS
   ======================================================= */
function initInfiniteLogos() {
    const track = document.querySelector('.logos-track');
    if (!track) return;
    const logos = Array.from(track.children);
    logos.forEach(logo => {
        const clone = logo.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true'); 
        track.appendChild(clone);
    });
}

/* =======================================================
   6. VALIDACIÓN Y ENVÍO DEL FORMULARIO
   ======================================================= */
function initFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Descomentar para producción con Captcha Real
        /*
        const recaptchaResponse = grecaptcha.getResponse();
        if(recaptchaResponse.length === 0) {
            alert("Por favor, verificá que no sos un robot marcando la casilla.");
            return; 
        }
        */

        const submitBtn = form.querySelector('.btn-submit');
        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = 'Enviando...';
        submitBtn.disabled = true;

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                alert("¡Gracias por contactarte con LGC! Un especialista se comunicará a la brevedad.");
                form.reset();
            } else {
                alert("Hubo un problema. Por favor, intentá de nuevo.");
            }
        } catch (error) {
            alert("Error de conexión. Por favor, intentá más tarde.");
        } finally {
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}