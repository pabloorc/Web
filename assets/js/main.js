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
        item.prob = Math.round(Math.max(28, Math.min(97, item.prob + (Math.random() * 11 - 4))));
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

function escapeHtml(value) {
    return String(value == null ? '' : value)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function contactEmailHtml(data) {
    return `
        <h2 style="font-family:Arial,sans-serif">Nuevo contacto desde la web</h2>
        <table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">
            <tr><td style="padding:4px 12px 4px 0"><strong>Nombre</strong></td><td>${escapeHtml(data.nombre)}</td></tr>
            <tr><td style="padding:4px 12px 4px 0"><strong>Email</strong></td><td>${escapeHtml(data.email)}</td></tr>
            <tr><td style="padding:4px 12px 4px 0"><strong>Empresa</strong></td><td>${escapeHtml(data.empresa)}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;vertical-align:top"><strong>Mensaje</strong></td><td>${escapeHtml(data.mensaje).replace(/\n/g, '<br>')}</td></tr>
        </table>
        <p style="font-family:Arial,sans-serif;font-size:12px;color:#64748b">Enviado desde ${escapeHtml(location.href)}</p>
    `;
}

// Envía el formulario a MAIL_TO (info@payfactu.com) vía endpoint propio o Brevo.
async function sendContactEmail(data) {
    const cfg = window.PAYFACTU_CONFIG || {};
    const to = cfg.MAIL_TO || 'info@payfactu.com';

    const extra = cfg.FORM_EXTRA_FIELDS || {};
    const isWeb3Forms = /web3forms/i.test(cfg.FORM_ENDPOINT || '');
    // Web3Forms sin access key todavía -> tratamos el endpoint como no configurado.
    const endpointReady = cfg.FORM_ENDPOINT && !(isWeb3Forms && !extra.access_key);

    if (endpointReady && isWeb3Forms) {
        // FormData en lugar de JSON: es una "simple request", sin preflight CORS.
        // Nota: no se envía el campo "to" (Web3Forms decide el destino por access_key
        // y rechaza la petición si se intenta sobreescribir en el plan gratuito).
        const fd = new FormData();
        Object.keys(extra).forEach(k => fd.append(k, extra[k]));
        fd.append('nombre', data.nombre);
        fd.append('email', data.email);
        fd.append('empresa', data.empresa);
        fd.append('mensaje', data.mensaje);
        fd.append('replyto', data.email);
        fd.append('Enviado desde', location.href);

        let res;
        try {
            res = await fetch(cfg.FORM_ENDPOINT, { method: 'POST', body: fd });
        } catch (netErr) {
            throw new Error('Sin conexión con Web3Forms (' + netErr.message + '). Si has abierto la página como archivo local, pruébala servida por http/https.');
        }

        let json = null;
        try { json = await res.json(); } catch (err) {}
        if (!res.ok || (json && json.success === false)) {
            throw new Error('Web3Forms ' + res.status + ((json && json.message) ? ': ' + json.message : ''));
        }
        return 'sent';
    }

    if (endpointReady) {
        const payload = Object.assign({ to: to }, extra, data);
        const res = await fetch(cfg.FORM_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'accept': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Endpoint respondió ' + res.status);
        return 'sent';
    }

    if (cfg.BREVO_API_KEY) {
        const res = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'api-key': cfg.BREVO_API_KEY,
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({
                sender: { name: cfg.MAIL_FROM_NAME || 'Web PayFactu', email: cfg.MAIL_FROM || to },
                to: [{ email: to }],
                replyTo: { email: data.email, name: data.nombre },
                subject: `Nuevo contacto web — ${data.nombre}${data.empresa ? ' (' + data.empresa + ')' : ''}`,
                htmlContent: contactEmailHtml(data)
            })
        });
        if (!res.ok) {
            let detail = '';
            try { detail = (await res.json()).message || ''; } catch (err) {}
            throw new Error('Brevo ' + res.status + (detail ? ': ' + detail : ''));
        }
        return 'sent';
    }

    // Sin configuración de envío: abrimos el cliente de correo como respaldo.
    const body = `Nombre: ${data.nombre}\nEmail: ${data.email}\nEmpresa: ${data.empresa}\n\nMensaje:\n${data.mensaje}`;
    window.location.href = `mailto:${to}?subject=${encodeURIComponent('Nuevo contacto web — ' + data.nombre)}&body=${encodeURIComponent(body)}`;
    return 'mailto';
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const btn = form.querySelector('button[type="submit"]');
        if (!btn) return;
        
        const originalText = btn.innerHTML;
        const data = {
            nombre: (document.getElementById('nombre') || {}).value || '',
            email: (document.getElementById('email') || {}).value || '',
            empresa: (document.getElementById('empresa') || {}).value || '',
            mensaje: (document.getElementById('mensaje') || {}).value || ''
        };
        
        const previousError = form.querySelector('[data-form-error]');
        if (previousError) previousError.remove();
        
        btn.innerHTML = `
            <span class="flex items-center justify-center gap-x-2">
                <i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i>
                Enviando solicitud...
            </span>
        `;
        btn.disabled = true;
        if (typeof lucide !== 'undefined') lucide.createIcons();
        
        try {
            await sendContactEmail(data);
        } catch (err) {
            console.error('[PayFactu] Error al enviar el formulario:', err);
            btn.innerHTML = originalText;
            btn.disabled = false;
            if (typeof lucide !== 'undefined') lucide.createIcons();
            
            const errorMsg = document.createElement('div');
            errorMsg.setAttribute('data-form-error', '');
            errorMsg.className = 'mt-4 text-center text-sm bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl';
            errorMsg.innerHTML = `No hemos podido enviar tu solicitud. Escríbenos a <strong>info@payfactu.com</strong> o inténtalo de nuevo en unos minutos.<br><span class="text-xs opacity-60">Detalle: ${escapeHtml(err.message || err)}</span>`;
            form.appendChild(errorMsg);
            return;
        }
        
        btn.innerHTML = `
            <span class="flex items-center justify-center gap-x-2 text-emerald-100">
                <i data-lucide="check" class="w-5 h-5"></i>
                ¡Solicitud enviada correctamente!
            </span>
        `;
        if (typeof lucide !== 'undefined') lucide.createIcons();
        
        setTimeout(() => {
            const successMsg = document.createElement('div');
            successMsg.className = 'mt-4 text-center text-sm bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-4 rounded-2xl';
            successMsg.innerHTML = `
                <strong>¡Gracias!</strong> Hemos recibido tu solicitud.<br>
                Te contactaremos con la mayor brevedad posible a través de <strong>info@payfactu.com</strong>.<br>
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

// Textos de respaldo: se usan solo si no hay URL publicada configurada o si falla la carga.
function legalFallback(type) {
    let html = '';
    let title = '';
    
    if (type === 'aviso') {
        title = 'Aviso Legal';
        html = `
            <p><strong>payfactu.com · Versión 1.0 · 07/08/2026</strong></p>
<hr />
<h2>1. Identificación del titular (art. 10 LSSI-CE)</h2>
<p>En cumplimiento del deber de información establecido en el artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de que el titular del sitio web <strong>payfactu.com</strong> (en adelante, «el Sitio» o «la Plataforma») es:</p>
<ul>
<li><strong>Titular:</strong> Pablo Rodríguez Carrasco (en adelante, «Payfactu»)</li>
<li><strong>Domicilio a efectos de notificaciones:</strong> Calle Doctor Castilla del Pino 3, 1º B, 29400 Ronda (Málaga)</li>
<li><strong>Correo electrónico de contacto:</strong> info@payfactu.com</li>
</ul>
<p>Payfactu no ejerce una actividad sujeta a régimen de autorización administrativa previa: presta servicios de software y de gestión administrativa de cobro extrajudicial por cuenta de sus clientes, y no presta servicios jurídicos reservados ni de intermediación financiera.</p>
<h2>2. Objeto</h2>
<p>El presente Aviso Legal regula el acceso, navegación y uso del Sitio. La contratación de los servicios de la Plataforma se rige por los <strong>Términos y Condiciones de Servicio</strong>, que prevalecen sobre este Aviso Legal en lo relativo a la relación contractual.</p>
<p>El acceso al Sitio atribuye la condición de usuario e implica la aceptación de este Aviso Legal en la versión publicada en cada momento.</p>
<h2>3. Condiciones de uso del Sitio</h2>
<p>El usuario se compromete a hacer un uso diligente del Sitio, conforme a la ley, la buena fe y el presente Aviso Legal (arts. 7 y 1258 del Código Civil), absteniéndose de:</p>
<ul>
<li>Utilizar el Sitio con fines o efectos ilícitos o lesivos de derechos e intereses de terceros.</li>
<li>Introducir o difundir programas dañinos o realizar acciones susceptibles de dañar, inutilizar o sobrecargar la Plataforma o impedir su normal utilización.</li>
<li>Intentar acceder a áreas restringidas, cuentas de otros usuarios o datos de otros clientes.</li>
<li>Extraer, reutilizar o reproducir de forma sistemática contenidos o bases de datos del Sitio sin autorización (arts. 133 y ss. del Texto Refundido de la Ley de Propiedad Intelectual).</li>
</ul>
<p>El uso de la Plataforma por clientes registrados queda además sujeto a la <strong>Política de Uso Aceptable</strong>.</p>
<h2>4. Propiedad intelectual e industrial</h2>
<p>Todos los contenidos del Sitio y de la Plataforma (código fuente, textos, diseños, interfaces, logotipos, marcas, estructura de las bases de datos y demás elementos) son titularidad de Payfactu o de terceros que han autorizado su uso, y están protegidos por el Texto Refundido de la Ley de Propiedad Intelectual (Real Decreto Legislativo 1/1996) y demás normativa aplicable.</p>
<p>El acceso al Sitio no supone cesión, transmisión ni renuncia de ninguno de estos derechos. Queda prohibida la reproducción, distribución, comunicación pública, transformación o cualquier otra forma de explotación no autorizada expresamente por escrito.</p>
<p>Los datos, facturas y documentos que los clientes suben a la Plataforma son y siguen siendo de sus titulares; Payfactu solo los trata para prestar el servicio, conforme a la <strong>Política de Privacidad</strong> y el <strong>Contrato de Encargado de Tratamiento (DPA)</strong>.</p>
<h2>5. Carácter ilustrativo de las cifras y ejemplos mostrados</h2>
<p>Las cifras, métricas, importes, porcentajes, capturas de pantalla, paneles y demás datos que se muestran en el Sitio con finalidad demostrativa o promocional —incluyendo, a título enunciativo, importes recuperados, número de clientes, plazos de cobro, tasas de recuperación o cualquier indicador de resultados— tienen <strong>carácter meramente ilustrativo</strong>. Se ofrecen para explicar el funcionamiento y las posibilidades de la Plataforma y <strong>no constituyen datos reales, verificados ni auditados</strong>, salvo que en el propio contenido se indique expresamente su origen, fecha y fuente.</p>
<p>En consecuencia, dichas cifras <strong>no constituyen oferta, promesa, garantía ni previsión de resultados</strong>, no vinculan a Payfactu y no deben tomarse como base para decisión alguna. Los resultados que cada cliente obtenga dependen de factores ajenos al control de Payfactu (naturaleza y antigüedad de la deuda, solvencia y comportamiento del deudor, calidad de la documentación aportada y configuración del servicio). Conforme a los Términos y Condiciones, las obligaciones de Payfactu son <strong>de medios y no de resultado</strong>.</p>
<p>Esta advertencia se dicta en cumplimiento del deber de que las comunicaciones comerciales sean claramente identificables y no induzcan a error (art. 20 LSSI-CE), y sin perjuicio del principio de buena fe del artículo 7 del Código Civil.</p>
<h2>6. Escenarios de uso</h2>
<p>El Sitio no publica actualmente testimonios de clientes. Los casos, perfiles de empresa y situaciones descritos con finalidad explicativa son <strong>escenarios construidos para ilustrar el funcionamiento de la Plataforma</strong>: no corresponden a clientes reales, no se atribuyen a persona o empresa identificada o identificable alguna, y no constituyen garantía ni previsión de resultados.</p>
<p>Cuando Payfactu publique testimonios de clientes reales, se hará constar expresamente su condición de tales, se publicarán con el consentimiento previo, expreso y documentado de quien los emite, y se indicará cualquier contraprestación o relación distinta de la de cliente. Los datos personales contenidos en dichos testimonios se tratarán con base en el consentimiento del interesado (art. 6.1.a RGPD), revocable en cualquier momento escribiendo a info@payfactu.com.</p>
<h2>7. Responsabilidad</h2>
<p>Payfactu no garantiza la disponibilidad ininterrumpida del Sitio, aunque adoptará las medidas razonables para asegurar su continuidad. Payfactu no responde de los daños derivados de causas ajenas a su control razonable, ni del uso del Sitio contrario a este Aviso Legal.</p>
<p>Los eventuales enlaces a sitios de terceros tienen finalidad meramente informativa; Payfactu no responde de sus contenidos, sin perjuicio del régimen de responsabilidad de los prestadores previsto en los artículos 13 a 17 de la LSSI-CE.</p>
<h2>8. Protección de datos</h2>
<p>El tratamiento de datos personales realizado a través del Sitio se rige por la <strong>Política de Privacidad</strong> y, en su caso, por la <strong>Política de Cookies</strong>, redactadas conforme al Reglamento (UE) 2016/679 (RGPD) y a la Ley Orgánica 3/2018 (LOPDGDD).</p>
<h2>9. Legislación aplicable y jurisdicción</h2>
<p>Este Aviso Legal se rige por la legislación española. Para cualquier controversia derivada del acceso o uso del Sitio, las partes se someten a los Juzgados y Tribunales de Ronda (Málaga), salvo que resulte imperativo otro fuero conforme a la normativa procesal aplicable.</p>
<hr />
<p><em>Documento gestionado mediante el sistema de versionado de documentos legales de la Plataforma (<code>core.documentos_legales</code>). Cualquier versión anterior queda sustituida por la presente.</em></p>
        `;
    } else if (type === 'privacidad') {
        title = 'Política de Privacidad';
        html = `
            <p><strong>payfactu.com · Versión 1.0 · 07/08/2927</strong></p>
<p>Redactada conforme al Reglamento (UE) 2016/679 (RGPD) y a la Ley Orgánica 3/2018, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD).</p>
<hr />
<h2>1. Responsable del tratamiento</h2>
<ul>
<li><strong>Responsable:</strong> Pablo Rodríguez Carrasco («Payfactu»)</li>
<li><strong>Domicilio:</strong> Calle Doctor Castilla del Pino 3, 1º B, 29400 Ronda (Málaga)</li>
<li><strong>Contacto en materia de protección de datos:</strong> info@payfactu.com</li>
</ul>
<p>Payfactu no ha designado Delegado de Protección de Datos por no concurrir los supuestos del artículo 37 del RGPD ni del artículo 34 de la LOPDGDD. Las consultas sobre el tratamiento de datos pueden dirigirse a la dirección indicada.</p>
<h2>2. Los dos roles de Payfactu</h2>
<p>Es esencial entender que Payfactu trata datos personales en dos posiciones distintas:</p>
<p><strong>A) Payfactu como RESPONSABLE del tratamiento</strong> — respecto de:</p>
<ul>
<li>Los datos de los <strong>usuarios y personas de contacto de sus Clientes</strong> (acreedores): identificación, datos profesionales, credenciales, facturación del servicio y comunicaciones con Payfactu.</li>
<li>Los datos de <strong>visitantes del sitio web</strong> y <strong>potenciales clientes</strong> que contactan con Payfactu o son incorporados a su actividad de prospección comercial.</li>
</ul>
<p>Esta Política regula estos tratamientos.</p>
<p><strong>B) Payfactu como ENCARGADO del tratamiento</strong> — respecto de:</p>
<ul>
<li>Los datos de los <strong>deudores y sus personas de contacto</strong> que cada Cliente carga en la Plataforma para gestionar el cobro de sus facturas.</li>
</ul>
<p>En este caso, el <strong>responsable es el Cliente (acreedor)</strong> y Payfactu trata los datos exclusivamente siguiendo sus instrucciones, conforme al <strong>Contrato de Encargado de Tratamiento (DPA)</strong> celebrado al amparo del artículo 28 RGPD y del artículo 33 LOPDGDD. Los deudores que deseen ejercer sus derechos respecto de estos datos deben dirigirse al acreedor correspondiente; si se dirigen a Payfactu, esta trasladará la solicitud al responsable sin dilación (véase el apartado 8).</p>
<h2>3. Datos que tratamos como responsable</h2>
<table>
<thead>
<tr>
<th>Categoría de interesados</th>
<th>Datos</th>
<th>Procedencia</th>
</tr>
</thead>
<tbody>
<tr>
<td>Usuarios de Clientes</td>
<td>Identificación, email, cargo, credenciales, registros de actividad y consentimientos (usuario, fecha, IP, versión aceptada)</td>
<td>Aportados por el propio usuario o su empresa</td>
</tr>
<tr>
<td>Contactos de facturación</td>
<td>Identificación, email, datos fiscales de la empresa</td>
<td>Aportados en el alta</td>
</tr>
<tr>
<td>Visitantes web</td>
<td>Datos técnicos de conexión estrictamente necesarios</td>
<td>Navegación (véase la Política de Cookies)</td>
</tr>
<tr>
<td>Potenciales clientes</td>
<td>Datos de contacto profesional de empresas</td>
<td>Aportados por el interesado o procedentes de fuentes de acceso público</td>
</tr>
</tbody>
</table>
<p>No se tratan categorías especiales de datos (art. 9 RGPD) ni se realizan tratamientos dirigidos a menores.</p>
<p>Conforme al <strong>artículo 19 LOPDGDD</strong>, el tratamiento de los datos de contacto de personas físicas que presten servicios en una persona jurídica se ampara en el interés legítimo cuando se refiera únicamente a su condición profesional y tenga por finalidad mantener relaciones con la entidad en la que prestan servicios.</p>
<p>Cuando los datos de potenciales clientes no se obtengan del propio interesado, Payfactu le informará de este tratamiento y del origen de los datos en el plazo del <strong>artículo 14 RGPD</strong> y, en todo caso, en la primera comunicación que le dirija.</p>
<h2>4. Finalidades y bases jurídicas (art. 6 RGPD)</h2>
<table>
<thead>
<tr>
<th>Finalidad</th>
<th>Base jurídica</th>
</tr>
</thead>
<tbody>
<tr>
<td>Alta, autenticación y prestación del servicio contratado</td>
<td>Ejecución de contrato — art. 6.1.b) RGPD</td>
</tr>
<tr>
<td>Facturación del servicio y gestión de cobros al Cliente</td>
<td>Ejecución de contrato (art. 6.1.b) y cumplimiento de obligaciones legales (art. 6.1.c)</td>
</tr>
<tr>
<td>Registro probatorio de aceptación de documentos legales (quién, cuándo, desde dónde, qué versión)</td>
<td>Ejecución de contrato (art. 6.1.b) e interés legítimo en la prueba del consentimiento (art. 6.1.f), en conexión con los arts. 25 y 46 del Reglamento eIDAS</td>
</tr>
<tr>
<td>Seguridad de la Plataforma, control de accesos y auditoría</td>
<td>Interés legítimo (art. 6.1.f) y obligaciones del art. 32 RGPD</td>
</tr>
<tr>
<td>Atención de consultas y soporte</td>
<td>Ejecución de contrato o medidas precontractuales (art. 6.1.b)</td>
</tr>
<tr>
<td>Prospección comercial de empresas y priorización de contactos profesionales</td>
<td>Interés legítimo (art. 6.1.f RGPD, en relación con el art. 19 LOPDGDD)</td>
</tr>
<tr>
<td>Envío de comunicaciones comerciales</td>
<td>Consentimiento (art. 6.1.a RGPD y art. 21.1 LSSI-CE); o, respecto de clientes, art. 21.2 LSSI-CE para servicios propios similares a los contratados</td>
</tr>
<tr>
<td>Atención de derechos y reclamaciones</td>
<td>Obligación legal (art. 6.1.c)</td>
</tr>
</tbody>
</table>
<p>Cuando la base sea el interés legítimo, el interesado puede oponerse conforme al artículo 21 RGPD. Toda comunicación comercial incluirá un medio sencillo y gratuito de oposición; las oposiciones se registran de forma permanente para impedir contactos posteriores.</p>
<h2>5. Destinatarios</h2>
<p>Los datos no se ceden a terceros salvo obligación legal. Para prestar el servicio, Payfactu se apoya en <strong>encargados del tratamiento</strong> (proveedores de infraestructura, pagos, correo e inteligencia artificial) recogidos en la <strong>Lista de Subencargados</strong> publicada en la Plataforma, con los que se han celebrado los contratos del artículo 28 RGPD.</p>
<h2>6. Transferencias internacionales</h2>
<p>Los datos de la Plataforma se alojan en la <strong>Unión Europea</strong> (Irlanda y España). Algunos proveedores tienen matriz fuera del Espacio Económico Europeo; en tales casos las transferencias se amparan en los instrumentos del Capítulo V del RGPD (Cláusulas Contractuales Tipo o decisiones de adecuación, con medidas suplementarias cuando proceda). El detalle por proveedor consta en la <strong>Lista de Subencargados</strong>.</p>
<h2>7. Plazos de conservación</h2>
<p>Los datos se conservan durante la vigencia de la relación y, después, <strong>bloqueados</strong> conforme al artículo 32 LOPDGDD durante los plazos de prescripción de las acciones legales aplicables (Código Civil). Los plazos concretos por categoría constan en la <strong>Política de Conservación</strong>. Con carácter general, los datos de potenciales clientes se conservan un máximo de dos años desde el último contacto.</p>
<h2>8. Derechos de los interesados (arts. 15 a 22 RGPD; arts. 13 a 18 LOPDGDD)</h2>
<p>Cualquier interesado puede ejercer los derechos de <strong>acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad</strong>, así como retirar el consentimiento prestado, escribiendo a info@payfactu.com con indicación del derecho ejercido y acreditación razonable de identidad.</p>
<ul>
<li>Plazo de respuesta: un mes, prorrogable en los términos del artículo 12.3 RGPD.</li>
<li>Si el ejercicio se refiere a datos de <strong>deudores</strong> tratados por Payfactu como encargado, Payfactu trasladará la solicitud al Cliente responsable y le asistirá en su atención, conforme al DPA.</li>
<li>El interesado tiene derecho a reclamar ante la <strong>Agencia Española de Protección de Datos</strong> (www.aepd.es), sin perjuicio de la tutela judicial.</li>
</ul>
<h2>9. Decisiones automatizadas</h2>
<p>Payfactu no adopta decisiones basadas únicamente en tratamientos automatizados que produzcan efectos jurídicos sobre los interesados o les afecten significativamente de modo similar (art. 22 RGPD). Los sistemas de IA de la Plataforma operan bajo límites parametrizados por el Cliente y con supervisión humana, conforme a la <strong>Política de IA</strong>.</p>
<h2>10. Seguridad</h2>
<p>Payfactu aplica las medidas técnicas y organizativas del artículo 32 RGPD descritas en la <strong>Política de Seguridad</strong>, incluyendo cifrado en tránsito y en reposo, aislamiento por cliente mediante políticas de seguridad a nivel de fila, mínimo privilegio, registro de auditoría y alojamiento en la UE.</p>
<h2>11. Información a los deudores</h2>
<p>El responsable de informar a los deudores del tratamiento de sus datos (art. 14 RGPD) es el <strong>Cliente acreedor</strong>. Como medida de apoyo, las comunicaciones de reclamación enviadas a través de la Plataforma incorporan una cláusula informativa básica con la identidad del acreedor responsable y el canal para ejercer derechos (Vía email)</p>
<h2>12. Actualizaciones</h2>
<p>Esta Política puede actualizarse. Cada versión se identifica y registra en el sistema de versionado de la Plataforma; los cambios sustanciales se comunicarán a los usuarios registrados.</p>
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
    
    return { title: title, html: html };
}

const LEGAL_CACHE = {};
const LEGAL_TITLES = { aviso: 'Aviso Legal', privacidad: 'Política de Privacidad', cookies: 'Política de Cookies' };

function extractLegalBody(rawHtml) {
    try {
        const doc = new DOMParser().parseFromString(rawHtml, 'text/html');
        doc.querySelectorAll('script, style, noscript, nav, header, footer').forEach(el => el.remove());
        const root = doc.querySelector('[data-legal-content]') || doc.querySelector('main') || doc.querySelector('article') || doc.body;
        return root ? root.innerHTML.trim() : '';
    } catch (err) {
        return '';
    }
}

// Carga el documento legal publicado en el panel de admin (misma fuente que app.payfactu.com).
async function fetchLegalDoc(type, url) {
    const res = await fetch(url, { cache: 'no-store', headers: { 'accept': 'application/json, text/html' } });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('json')) {
        const data = await res.json();
        const doc = data.document || data.data || data;
        const html = doc.content_html || doc.html || doc.contenido || doc.content || doc.body || doc.texto || '';
        if (!html) throw new Error('Respuesta JSON sin contenido');
        const looksLikeHtml = /<[a-z][\s\S]*>/i.test(html);
        return {
            title: doc.title || doc.titulo || LEGAL_TITLES[type],
            html: looksLikeHtml ? html : '<p>' + escapeHtml(html).replace(/\n{2,}/g, '</p><p>').replace(/\n/g, '<br>') + '</p>',
            version: doc.version || doc.updated_at || ''
        };
    }
    
    const body = extractLegalBody(await res.text());
    if (!body) throw new Error('Sin contenido');
    return { title: LEGAL_TITLES[type], html: body, version: '' };
}

async function showLegalModal(type) {
    const modal = document.getElementById('legal-modal');
    const titleEl = document.getElementById('modal-title');
    const contentEl = document.getElementById('modal-content');
    if (!modal || !titleEl || !contentEl) return;
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    const url = ((window.PAYFACTU_CONFIG || {}).LEGAL_URLS || {})[type];
    
    if (LEGAL_CACHE[type]) {
        titleEl.textContent = LEGAL_CACHE[type].title;
        contentEl.innerHTML = LEGAL_CACHE[type].html;
        return;
    }
    
    if (!url) {
        const fallback = legalFallback(type);
        titleEl.textContent = fallback.title;
        contentEl.innerHTML = fallback.html;
        return;
    }
    
    titleEl.textContent = LEGAL_TITLES[type] || '';
    contentEl.innerHTML = '<p class="text-slate-400">Cargando documento...</p>';
    
    try {
        const doc = await fetchLegalDoc(type, url);
        if (doc.version) {
            doc.html += `<p class="text-xs text-slate-400 mt-6">Versión publicada: ${escapeHtml(doc.version)}</p>`;
        }
        LEGAL_CACHE[type] = doc;
        titleEl.textContent = doc.title;
        contentEl.innerHTML = doc.html;
    } catch (err) {
        console.warn('[PayFactu] No se pudo cargar el documento legal publicado:', err);
        // Respaldo sin CORS: mostramos el documento publicado embebido.
        contentEl.innerHTML = `<iframe src="${escapeHtml(url)}" title="${escapeHtml(LEGAL_TITLES[type] || '')}" class="w-full h-[60vh] rounded-2xl border border-slate-200"></iframe>`;
        const frame = contentEl.querySelector('iframe');
        frame.addEventListener('error', () => {
            const fallback = legalFallback(type);
            titleEl.textContent = fallback.title;
            contentEl.innerHTML = fallback.html;
        });
    }
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
