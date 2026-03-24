// main.js - Lógica e interacciones para LGC Landing Page

document.addEventListener('DOMContentLoaded', () => {
    console.log("Sistema LGC inicializado correctamente. 🚀");

    initHeaderScroll();
    initSmoothScroll();
    initInfiniteLogos();
    initFormValidation();
});

/* =======================================================
   1. HEADER DINÁMICO (Cambia de estilo al scrollear)
   ======================================================= */
function initHeaderScroll() {
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            // Le agregamos una sombra sutil cuando el usuario baja
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
            header.style.padding = '0'; // Se hace un poquito más compacto
        } else {
            header.style.boxShadow = 'none';
        }
    });
}

/* =======================================================
   2. SCROLL SUAVE PARA ANCLAS (Navegación One-Page)
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
                // Calculamos el offset del header fijo (80px) para que el título no quede tapado
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* =======================================================
   3. CARRUSEL INFINITO DE LOGOS (Loop perfecto)
   ======================================================= */
function initInfiniteLogos() {
    const track = document.querySelector('.logos-track');
    if (!track) return;

    // Tomamos los logos originales y los clonamos
    const logos = Array.from(track.children);
    
    logos.forEach(logo => {
        const clone = logo.cloneNode(true);
        // Ocultamos los clones a los lectores de pantalla para no confundir (Accesibilidad)
        clone.setAttribute('aria-hidden', 'true'); 
        track.appendChild(clone);
    });
}

/* =======================================================
   4. VALIDACIÓN DE FORMULARIO Y ENVÍO SEGURO (Fetch API)
   ======================================================= */
function initFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault(); // Evitamos que la página se recargue

        // 1. Validaciones básicas de seguridad Frontend
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const consulta = document.getElementById('consulta').value.trim();

        // Expresión regular simple para validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (nombre === '' || !emailRegex.test(email) || consulta === '') {
            alert("Por favor, completá los campos obligatorios correctamente.");
            return;
        }

        // 2. Comprobación del reCAPTCHA (Si lo activan)
        /* const recaptchaResponse = grecaptcha.getResponse();
        if(recaptchaResponse.length === 0) {
            alert("Por favor, verificá que no sos un robot.");
            return;
        }
        */

        // 3. Preparar datos para envío
        const submitBtn = form.querySelector('.btn-submit');
        const originalBtnText = submitBtn.innerText;
        
        submitBtn.innerText = 'Enviando...';
        submitBtn.disabled = true;

        const formData = new FormData(form);

        try {
            // Enviamos los datos al backend de forma asíncrona
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Aquí podrías disparar el evento de conversión de Google Ads
                // gtag('event', 'conversion', {'send_to': 'AW-XXXX/YYYY'});
                
                alert("¡Gracias por contactarte con LGC! Un especialista se comunicará a la brevedad.");
                form.reset(); // Limpiamos el formulario
            } else {
                alert("Hubo un problema al enviar tu consulta. Por favor, intentá de nuevo o escribinos a info@lamas-gc.com");
            }
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            alert("Error de conexión. Por favor, intentá más tarde.");
        } finally {
            // Restauramos el botón
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}