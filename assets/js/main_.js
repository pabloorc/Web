// Global variables
let riskChartInstance = null;
let recoveryChartInstance = null;

let dashboardData = [
    { id: "F-3842", cliente: "Distribuidora Norte S.L.", importe: 4850, dias: 12, prob: 92, riesgo: "Bajo", accion: "Recordatorio enviado" },
    { id: "F-3921", cliente: "Comercial Mediterráneo", importe: 12400, dias: 47, prob: 61, riesgo: "Medio", accion: "Seguimiento intensivo" },
    { id: "F-4015", cliente: "Grupo Industrial López", importe: 7850, dias: 9, prob: 88, riesgo: "Bajo", accion: "Plan de pago propuesto" },
    { id: "F-4103", cliente: "Servicios Técnicos XYZ", importe: 3200, dias: 68, prob: 34, riesgo: "Alto", accion: "Escalado a jurídico" }
];

function scrollToSection(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.pageYOffset - 72;
    window.scrollTo({ top: y, behavior: 'smooth' });
}

function initializeTailwind() {
    // Optional: any dynamic Tailwind config
}

function initializeIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function initNavbar() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('nav-scrolled', 'bg-white/95', 'backdrop-blur-lg');
        } else {
            navbar.classList.remove('nav-scrolled', 'bg-white/95', 'backdrop-blur-lg');
        }
    });
    
    // Mobile menu
    const mobileBtn = document.getElementById('mobile-menu-btn');
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            const existing = document.getElementById('mobile-menu');
            if (existing) {
                existing.remove();
                return;
            }
            
            const menu = document.createElement('div');
            menu.id = 'mobile-menu';
            menu.className = 'lg:hidden absolute top-full left-0 right-0 bg-white border-b shadow-lg py-4 px-8 flex flex-col gap-y-3 text-sm font-medium z-50';
            menu.innerHTML = `
                <a href="#problema" class="py-1.5">El problema</a>
                <a href="#solucion" class="py-1.5">La solución</a>
                <a href="#modulos" class="py-1.5">Cómo funciona</a>
                <a href="#beneficios" class="py-1.5">Resultados</a>
                <button onclick="scrollToSection('contacto'); document.getElementById('mobile-menu').remove()" 
                        class="mt-3 w-full bg-slate-900 text-white py-3 rounded-2xl font-semibold">Solicitar demo</button>
            `;
            menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.remove()));
            navbar.appendChild(menu);
        });
    }
}

function animateCounters() {
    const counters = [
        { id: 'stat-recuperacion', target: 81, suffix: '%' },
        { id: 'stat-tiempo', target: 94, suffix: '%' },
        { id: 'stat-clientes', target: 97, suffix: '%' },
        { id: 'stat-horas', target: 18, suffix: 'h' }
    ];
    
    counters.forEach(counter => {
        const el = document.getElementById(counter.id);
        if (!el) return;
        
        let current = 0;
        const increment = counter.target / 50;
        const interval = setInterval(() => {
            current += increment;
            if (current >= counter.target) {
                current = counter.target;
                clearInterval(interval);
            }
            el.textContent = Math.floor(current) + counter.suffix;
        }, 35);
    });
}

function renderDashboardTable() {
    const tbody = document.getElementById('dashboard-table');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    dashboardData.forEach((row) => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50 transition-colors';
        
        const riesgoColor = row.riesgo === 'Bajo' ? 'emerald' : row.riesgo === 'Medio' ? 'amber' : 'red';
        
        tr.innerHTML = `
            <td class="py-3.5 pl-2 font-medium">${row.id}</td>
            <td class="py-3.5">${row.cliente}</td>
            <td class="py-3.5 text-right font-medium tabular-nums">${row.importe.toLocaleString('es-ES')} €</td>
            <td class="py-3.5"><span class="text-xs px-2.5 py-1 bg-slate-100 rounded-full">${row.dias} días</span></td>
            <td class="py-3.5">
                <div class="flex items-center justify-center gap-x-2">
                    <div class="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div class="h-1.5 bg-emerald-500 rounded-full transition-all" style="width: ${row.prob}%"></div>
                    </div>
                    <span class="text-xs font-medium w-8 text-right">${row.prob}%</span>
                </div>
            </td>
            <td class="py-3.5">
                <span class="inline-block text-xs px-3 py-1 rounded-full font-medium bg-${riesgoColor}-100 text-${riesgoColor}-700">${row.accion}</span>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function simulateDashboardUpdate() {
    const tbody = document.getElementById('dashboard-table');
    if (!tbody) return;
    
    dashboardData.forEach(item => {
        item.prob = Math.max(28, Math.min(97, item.prob + (Math.random() * 11 - 4)));
        if (item.prob > 82) item.riesgo = "Bajo";
        else if (item.prob > 52) item.riesgo = "Medio";
        else item.riesgo = "Alto";
    });
    
    if (Math.random() > 0.55 && dashboardData.length > 0) {
        const recovered = dashboardData.shift();
        recovered.accion = "¡Cobrado!";
        recovered.riesgo = "Bajo";
        showToast(`¡${recovered.id} cobrada! +${recovered.importe.toLocaleString('es-ES')} € recuperados`);
    }
    
    renderDashboardTable();
    
    // Update hero number
    const heroDeuda = document.getElementById('hero-deuda');
    if (heroDeuda) {
        let current = parseInt(heroDeuda.textContent.replace(/\./g, ''));
        current = Math.max(175000, current - Math.floor(Math.random() * 9200) - 400);
        heroDeuda.textContent = current.toLocaleString('es-ES');
    }
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-24 right-4 left-4 sm:left-auto sm:right-8 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-x-3 text-sm z-[80]';
    toast.innerHTML = `
        <i data-lucide="check-circle" class="w-5 h-5"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);
    if (typeof lucide !== 'undefined') lucide.createIcons();
    
    setTimeout(() => {
        toast.style.transition = 'all 0.3s ease';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 280);
    }, 2600);
}

function animateEmailSequence() {
    const container = document.getElementById('email-sequence');
    if (!container) return;
    
    const steps = [
        { icon: 'check', text: 'Día 1: Recordatorio amable enviado', color: 'emerald' },
        { icon: 'clock', text: 'Día 10: Seguimiento enviado', color: 'amber' },
        { icon: 'message-circle', text: 'Día 25: Oferta de fraccionamiento', color: 'emerald' },
        { icon: 'alert-triangle', text: 'Día 40: Aviso de escalado jurídico', color: 'red' }
    ];
    
    container.innerHTML = '';
    
    steps.forEach((step, i) => {
        setTimeout(() => {
            const div = document.createElement('div');
            div.className = `flex items-center gap-x-3 px-4 py-2.5 rounded-2xl border bg-white text-sm transition-all`;
            div.innerHTML = `
                <i data-lucide="${step.icon}" class="w-4 h-4 text-${step.color}-600"></i>
                <span class="flex-1">${step.text}</span>
            `;
            container.appendChild(div);
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }, i * 380);
    });
    
    setTimeout(() => {
        const note = document.createElement('div');
        note.className = 'text-emerald-600 text-xs font-medium mt-2 flex items-center gap-x-1.5';
        note.innerHTML = `<i data-lucide="zap" class="w-3.5 h-3.5"></i> <span>Secuencia completada automáticamente por la IA</span>`;
        container.appendChild(note);
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }, 1650);
}

function simulateChatResponse(type) {
    const responseEl = document.getElementById('chat-response');
    if (!responseEl) return;
    
    let reply = '';
    
    if (type === 0) {
        reply = 'IA: Entendemos la situación. Podemos ofrecer dos pagos de 925 € sin intereses. ¿Te parece bien?';
    } else if (type === 1) {
        reply = 'IA: Gracias por la información. Revisaré la documentación y abriré una incidencia. ¿Puedes indicarme qué concepto está mal?';
    } else if (type === 2) {
        reply = 'IA: Perfecto. He registrado tu compromiso de pago para el viernes. Te enviaré un recordatorio 48h antes. ¿Necesitas algo más?';
    }
    
    responseEl.style.transition = 'all 0.2s ease';
    responseEl.style.opacity = '0.25';
    
    setTimeout(() => {
        responseEl.innerHTML = reply;
        responseEl.style.opacity = '1';
    }, 160);
}

function initCharts() {
    try {
        // Risk pie chart
        const riskCtx = document.getElementById('riskChart');
        if (riskCtx && typeof Chart !== 'undefined') {
            if (riskChartInstance) {
                riskChartInstance.destroy();
            }
            
            riskChartInstance = new Chart(riskCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Riesgo Bajo', 'Riesgo Medio', 'Riesgo Alto'],
                    datasets: [{
                        data: [62, 28, 10],
                        backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
                        borderWidth: 0,
                        hoverOffset: 14
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { padding: 16, font: { size: 11 } }
                        }
                    }
                }
            });
        }
        
        // Recovery line chart
        const recoveryCtx = document.getElementById('recoveryChart');
        if (recoveryCtx && typeof Chart !== 'undefined') {
            if (recoveryChartInstance) {
                recoveryChartInstance.destroy();
            }
            
            recoveryChartInstance = new Chart(recoveryCtx, {
                type: 'line',
                data: {
                    labels: ['Sem 1', 'Sem 4', 'Sem 8', 'Sem 12', 'Sem 16'],
                    datasets: [
                        {
                            label: 'Con PayFactu IA',
                            data: [12, 41, 67, 81, 89],
                            borderColor: '#10B981',
                            backgroundColor: 'rgba(16, 185, 129, 0.12)',
                            borderWidth: 3,
                            tension: 0.38,
                            fill: true
                        },
                        {
                            label: 'Proceso manual',
                            data: [5, 14, 23, 31, 38],
                            borderColor: '#94A3B8',
                            borderWidth: 2.5,
                            borderDash: [5, 3],
                            tension: 0.38
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { 
                        legend: { 
                            position: 'bottom', 
                            labels: { padding: 14, font: { size: 11 } } 
                        } 
                    },
                    scales: {
                        y: { 
                            beginAtZero: true, 
                            max: 100, 
                            ticks: { callback: v => v + '%' } 
                        },
                        x: { grid: { color: '#f1e7ff22' } }
                    }
                }
            });
        }
    } catch (e) {
        console.warn('Chart initialization skipped:', e);
    }
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const btn = form.querySelector('button[type="submit"]');
        if (!btn) return;
        
        const originalText = btn.innerHTML;
        
        btn.innerHTML = `
            <span class="flex items-center justify-center gap-x-2">
                <i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i>
                Enviando solicitud...
            </span>
        `;
        btn.disabled = true;
        if (typeof lucide !== 'undefined') lucide.createIcons();
        
        setTimeout(() => {
            btn.innerHTML = `
                <span class="flex items-center justify-center gap-x-2 text-emerald-100">
                    <i data-lucide="check" class="w-5 h-5"></i>
                    ¡Solicitud enviada correctamente!
                </span>
            `;
            
            setTimeout(() => {
                const successMsg = document.createElement('div');
                successMsg.className = 'mt-4 text-center text-sm bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-4 rounded-2xl';
                successMsg.innerHTML = `
                    <strong>¡Gracias!</strong> Hemos recibido tu solicitud.<br>
                    Te contactaremos en las próximas 24 horas a través de <strong>info@payfactu.com</strong>.<br>
                    <span class="text-xs opacity-75">Revisa tu bandeja de entrada y spam.</span>
                `;
                form.appendChild(successMsg);
                
                createConfetti();
                
                setTimeout(() => {
                    form.reset();
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    if (typeof lucide !== 'undefined') lucide.createIcons();
                    if (successMsg.parentNode) successMsg.parentNode.removeChild(successMsg);
                }, 4800);
            }, 780);
        }, 1250);
    });
}

function createConfetti() {
    const colors = ['#10B981', '#14B8A6', '#0F172A'];
    for (let i = 0; i < 42; i++) {
        const particle = document.createElement('div');
        particle.className = 'fixed w-2 h-2 rounded-full z-[90]';
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = '-12px';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.opacity = Math.random() * 0.7 + 0.5;
        document.body.appendChild(particle);
        
        const duration = Math.random() * 2600 + 2300;
        const angle = Math.random() * 65 + 60;
        
        particle.animate([
            { transform: `translateY(0) rotate(0deg)`, opacity: particle.style.opacity },
            { transform: `translateY(${window.innerHeight + 140}px) rotate(${angle * 4.5}deg)`, opacity: 0 }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
        }).onfinish = () => particle.remove();
    }
}

function initCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (!banner) return;
    
    const accepted = localStorage.getItem('payfactu_cookies_accepted');
    
    if (!accepted) {
        setTimeout(() => {
            banner.style.transition = 'all 0.4s ease';
            banner.classList.remove('hidden');
            banner.classList.add('flex');
        }, 2100);
    }
}

function acceptCookies() {
    localStorage.setItem('payfactu_cookies_accepted', 'all');
    hideCookieBanner();
}

function rejectCookies() {
    localStorage.setItem('payfactu_cookies_accepted', 'essential');
    hideCookieBanner();
}

function hideCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (!banner) return;
    banner.style.transition = 'all 0.3s ease';
    banner.style.opacity = '0';
    setTimeout(() => {
        banner.classList.add('hidden');
        banner.style.opacity = '1';
    }, 260);
}

function showLegalModal(type) {
    const modal = document.getElementById('legal-modal');
    const titleEl = document.getElementById('modal-title');
    const contentEl = document.getElementById('modal-content');
    if (!modal || !titleEl || !contentEl) return;
    
    let html = '';
    let title = '';
    
    if (type === 'aviso') {
        title = 'Aviso Legal';
        html = `
            <p><strong>1. Identificación del titular (art. 10 LSSI-CE)</strong><br>
            Titular: PayFactu S.L.<br>
            NIF: B-87654321<br>
            Domicilio social: Calle de la Innovación 42, 28001 Madrid (España)<br>
            Email de contacto: <strong>info@payfactu.com</strong><br>
            Datos registrales: inscrita en el Registro Mercantil de Madrid.</p>
            
            <p><strong>2. Objeto</strong><br>
            El presente Aviso Legal regula el acceso, la navegación y el uso del sitio web de PayFactu, así como de los servicios de software (SaaS) de gestión y recobro automatizado de facturas ofrecidos bajo la marca PayFactu. El acceso al sitio web atribuye la condición de usuario e implica la aceptación plena y sin reservas de las condiciones aquí recogidas.</p>
            
            <p><strong>3. Condiciones de uso</strong><br>
            El usuario se compromete a hacer un uso adecuado y lícito del sitio web y de sus contenidos, de conformidad con la legislación aplicable, el presente Aviso Legal, la moral y el orden público. Queda prohibido el uso del sitio con fines ilícitos o lesivos para PayFactu S.L. o para terceros.</p>
            
            <p><strong>4. Propiedad intelectual e industrial</strong><br>
            Todos los contenidos del sitio web (textos, imágenes, logotipos, marcas, diseño, código fuente y software) son titularidad de PayFactu S.L. o de terceros licenciantes y están protegidos por la normativa de propiedad intelectual e industrial. Queda prohibida su reproducción, distribución, comunicación pública o transformación, total o parcial, sin autorización expresa y por escrito.</p>
            
            <p><strong>5. Responsabilidad</strong><br>
            PayFactu S.L. no garantiza la disponibilidad ininterrumpida del sitio web y no se hace responsable de los daños y perjuicios derivados de interferencias, virus informáticos, averías o desconexiones ajenas a su control, ni del uso ilícito o inadecuado del sitio por parte de terceros.</p>
            
            <p><strong>6. Enlaces a terceros</strong><br>
            Los enlaces a sitios web de terceros tienen una finalidad meramente informativa. PayFactu S.L. no asume responsabilidad alguna sobre sus contenidos ni sobre sus políticas de privacidad.</p>
            
            <p><strong>7. Protección de datos</strong><br>
            El tratamiento de los datos personales recogidos a través de este sitio web se rige por lo dispuesto en nuestra Política de Privacidad, conforme al Reglamento (UE) 2016/679 (RGPD) y a la Ley Orgánica 3/2018 (LOPDGDD).</p>
            
            <p><strong>8. Legislación aplicable y jurisdicción</strong><br>
            El presente Aviso Legal se rige por la legislación española. Para cualquier controversia, las partes se someten a los Juzgados y Tribunales de Madrid, salvo que la normativa de consumidores y usuarios establezca otro fuero.</p>
            
            <p><strong>9. Modificaciones</strong><br>
            PayFactu S.L. se reserva el derecho a modificar en cualquier momento el presente Aviso Legal para adaptarlo a novedades legislativas o a cambios en el sitio web.</p>
            
            <p class="text-xs text-slate-400 mt-6">Última actualización: Julio 2026</p>
        `;
    } else if (type === 'privacidad') {
        title = 'Política de Privacidad';
        html = `
            <p><strong>Responsable del tratamiento</strong><br>
            PayFactu S.L. (NIF B-87654321) es el Responsable del tratamiento de los datos personales recogidos a través de este sitio web.</p>
            
            <p><strong>Finalidades</strong><br>
            • Gestionar solicitudes de información y demo<br>
            • Prestar el servicio de software de gestión de cobros<br>
            • Enviar comunicaciones comerciales (con consentimiento)<br>
            • Cumplir obligaciones legales</p>
            
            <p><strong>Legitimación</strong><br>
            Ejecución de contrato o consentimiento del interesado.</p>
            
            <p><strong>Destinatarios</strong><br>
            No se ceden datos a terceros salvo obligación legal o prestadores necesarios (hosting, email), todos con sede en la UE o garantías adecuadas.</p>
            
            <p><strong>Derechos</strong><br>
            Puede ejercer sus derechos de acceso, rectificación, supresión, etc. enviando email a <strong>info@payfactu.com</strong>.</p>
            
            <p class="text-xs text-slate-400 mt-6">Última actualización: Julio 2026</p>
        `;
    } else if (type === 'cookies') {
        title = 'Política de Cookies';
        html = `
            <p>Utilizamos cookies y tecnologías similares para:</p>
            <ul class="list-disc pl-5 space-y-1 mt-2">
                <li>Garantizar el correcto funcionamiento del sitio (cookies técnicas esenciales)</li>
                <li>Recordar preferencias y configuraciones</li>
                <li>Realizar análisis de uso y mejorar nuestros servicios</li>
            </ul>
            
            <p class="mt-3"><strong>Tipos de cookies</strong><br>
            • <strong>Esenciales:</strong> Necesarias para el funcionamiento básico.<br>
            • <strong>Analíticas:</strong> Permiten medir y mejorar el rendimiento.<br>
            • <strong>De preferencias:</strong> Guardan sus elecciones.</p>
            
            <p>Puede configurar o rechazar las cookies no esenciales desde la configuración de su navegador.</p>
            
            <p>Para más información contacte con <strong>info@payfactu.com</strong>.</p>
            
            <p class="text-xs text-slate-400 mt-6">Última actualización: Julio 2026</p>
        `;
    }
    
    titleEl.textContent = title;
    contentEl.innerHTML = html;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function hideLegalModal() {
    const modal = document.getElementById('legal-modal');
    if (modal) {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
    }
}

function animateHeroNumber() {
    const el = document.getElementById('hero-deuda');
    if (!el) return;
    
    setInterval(() => {
        let current = parseInt(el.textContent.replace(/\./g, ''));
        current = Math.max(168000, current - Math.floor(Math.random() * 8500) - 350);
        el.textContent = current.toLocaleString('es-ES');
    }, 13800);
}

function initializeWebsite() {
    initializeTailwind();
    initializeIcons();
    initNavbar();
    animateCounters();
    renderDashboardTable();
    initCharts();
    initContactForm();
    initCookieBanner();
    animateHeroNumber();
    
    // Periodic dashboard update when visible
    setInterval(() => {
        const section = document.getElementById('solucion');
        if (section) {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                simulateDashboardUpdate();
            }
        }
    }, 19500);
    
    // Keyboard support for modals
    document.addEventListener('keydown', function(e) {
        if (e.key === "Escape") {
            const modal = document.getElementById('legal-modal');
            if (modal && !modal.classList.contains('hidden')) {
                hideLegalModal();
            } else {
                const banner = document.getElementById('cookie-banner');
                if (banner && !banner.classList.contains('hidden')) {
                    banner.classList.add('hidden');
                }
            }
        }
    });
    
    // Subtle entrance animation for dashboard rows
    setTimeout(() => {
        const rows = document.querySelectorAll('#dashboard-table tr');
        rows.forEach((row, i) => {
            row.style.transition = `opacity 0.5s ease ${i * 70}ms`;
            row.style.opacity = '0.5';
            setTimeout(() => { row.style.opacity = '1'; }, 90);
        });
    }, 650);
    
    console.log('%c[PayFactu] Landing page initialized successfully.', 'color:#64748b; font-size: 10px');
}

// Boot
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWebsite);
} else {
    initializeWebsite();
}
