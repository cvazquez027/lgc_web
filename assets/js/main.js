// [SEO OPTIMIZATION] Archivo optimizado para carga diferida (defer)
document.addEventListener('DOMContentLoaded', () => {
    initSlider();
    initSmoothScroll();
    initFormAutoSelect();
    initInfiniteLogos(); 
});

function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.querySelector('.slider-dots');
    if (!slides.length) return;

    let current = 0;

    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = `dot ${i === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function goTo(index) {
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');
        current = (index + slides.length) % slides.length;
        slides[current].classList.add('active');
        dots[current].classList.add('active');
    }

    const btnNext = document.querySelector('.next');
    const btnPrev = document.querySelector('.prev');
    
    if (btnNext) btnNext.addEventListener('click', () => goTo(current + 1));
    if (btnPrev) btnPrev.addEventListener('click', () => goTo(current - 1));
    setInterval(() => goTo(current + 1), 6000);
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initFormAutoSelect() {
    const serviceSelect = document.getElementById('servicio');
    document.querySelectorAll('.btn-quote-service').forEach(btn => {
        btn.addEventListener('click', () => {
            const val = btn.getAttribute('data-servicio');
            if (val && serviceSelect) {
                serviceSelect.value = val;
                serviceSelect.style.boxShadow = '0 0 0 3px rgba(144, 162, 36, 0.5)';
                setTimeout(() => serviceSelect.style.boxShadow = 'none', 1500);
            }
        });
    });
}

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

    contentArea.innerHTML = `
        <div class="info-header">
            <span class="section-tag">${data.sector}</span>
            <h2 class="hero-title" style="font-size: 2rem; color: var(--clr-primary); margin-bottom: 0;">${data.title}</h2>
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
                <ul class="info-list" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    ${data.resultados.map(res => `<li><strong>${res}</strong></li>`).join('')}
                </ul>
            </div>
        </div>
    `;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; 
}

function closeCaseModal() {
    document.getElementById('caseModal').style.display = 'none';
    document.body.style.overflow = 'auto'; 
}

window.onclick = function(event) {
    const modal = document.getElementById('caseModal');
    if (event.target == modal) {
        closeCaseModal();
    }
}