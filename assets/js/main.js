// Global variables
let riskChartInstance = null;
let recoveryChartInstance = null;

let dashboardData = [
    { id: "F-3842", cliente: "Distribuidora Norte S.L.", importe: 2850, dias: 12, prob: 92, riesgo: "Bajo", accion: "Recordatorio enviado" },
    { id: "F-3921", cliente: "Comercial Mediterráneo", importe: 6490, dias: 47, prob: 61, riesgo: "Medio", accion: "Seguimiento intensivo" },
    { id: "F-4015", cliente: "Grupo Industrial López", importe: 120, dias: 9, prob: 88, riesgo: "Bajo", accion: "Plan de pago propuesto" },
    { id: "F-4103", cliente: "Servicios Técnicos XYZ", importe: 1850, dias: 68, prob: 34, riesgo: "Alto", accion: "Escalado a jurídico" }
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
                <a href="#precios" class="py-1.5">Precio</a>
                <a href="#contacto" class="py-1.5">Contacto</a>
                <button onclick="location.href='https://app.payfactu.com/login'; document.getElementById('mobile-menu').remove()" class="mt-3 w-full bg-slate-900 text-white py-3 rounded-2xl font-semibold">Acceso Clientes</button>
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

/* El banner de cookies vive ahora en assets/js/cookies.js, cargado en el
   <head> antes que este fichero. Tiene que ir ahí y no aquí: Consent Mode
   debe quedar en 'denied' antes de que se ejecute cualquier etiqueta, y
   main.js se carga al final del <body>, demasiado tarde.

   Ese módulo expone acceptCookies(), rejectCookies(), openCookiePanel(),
   closeCookiePanel() y saveCookiePrefs(). */


const LEGAL_CACHE = {};

// Títulos de respaldo. Los reales llegan de PAYFACTU_CONFIG.LEGAL_DOCS y,
// en última instancia, del propio documento publicado.
const LEGAL_TITLES = { aviso: 'Aviso Legal', privacidad: 'Política de Privacidad', cookies: 'Política de Cookies' };

// Claves antiguas ('aviso') → código real del documento ('aviso-legal'),
// para no romper los enlaces que ya existían.
const LEGAL_ALIAS = { aviso: 'aviso-legal' };

// Y a la inversa, para poder recurrir a los textos incrustados de
// legalFallback(), que sigue usando las claves de siempre.
const LEGAL_FALLBACK_KEY = { 'aviso-legal': 'aviso', privacidad: 'privacidad', cookies: 'cookies' };

const LEGAL_FECHA = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

function legalConfig() {
    return window.PAYFACTU_CONFIG || {};
}

function legalTitulo(codigo) {
    const docs = legalConfig().LEGAL_DOCS || {};
    return docs[codigo] || LEGAL_TITLES[codigo] || 'Documento legal';
}

/**
 * URL del documento publicado. Se prefiere LEGAL_BASE (una sola línea de
 * configuración vale para los nueve documentos); LEGAL_URLS se mantiene
 * por compatibilidad con la configuración anterior.
 */
function legalUrl(codigo, claveOriginal) {
    const cfg = legalConfig();
    if (cfg.LEGAL_BASE) {
        return cfg.LEGAL_BASE.replace(/\/+$/, '') + '/api/legal/' + encodeURIComponent(codigo);
    }
    const urls = cfg.LEGAL_URLS || {};
    return urls[codigo] || urls[claveOriginal] || '';
}

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

// Carga el documento legal publicado en el panel de admin: la misma fila de
// la base de datos que ve el acreedor al registrarse y que consta en su
// registro de consentimiento.
async function fetchLegalDoc(codigo, url) {
    const res = await fetch(url, { cache: 'no-store', headers: { 'accept': 'application/json' } });
    if (!res.ok) throw new Error('HTTP ' + res.status);

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('json')) {
        const data = await res.json();
        const doc = data.document || data.data || data;
        const html = doc.content_html || doc.html || doc.contenido || doc.content || doc.body || doc.texto || '';
        if (!html) throw new Error('Respuesta JSON sin contenido');
        const looksLikeHtml = /<[a-z][\s\S]*>/i.test(html);
        return {
            title: doc.title || doc.titulo || legalTitulo(codigo),
            html: looksLikeHtml ? html : '<p>' + escapeHtml(html).replace(/\n{2,}/g, '</p><p>').replace(/\n/g, '<br>') + '</p>',
            version: doc.version || '',
            updated_at: doc.updated_at || '',
            canonical: doc.canonical || ''
        };
    }

    const body = extractLegalBody(await res.text());
    if (!body) throw new Error('Sin contenido');
    return { title: legalTitulo(codigo), html: body, version: '', updated_at: '', canonical: '' };
}

function legalPie(doc) {
    if (!doc.version && !doc.updated_at && !doc.canonical) return '';

    let pie = '<p class="text-xs text-slate-400 mt-8 pt-4 border-t border-slate-200">';
    if (doc.version) pie += 'Versión ' + escapeHtml(doc.version);
    if (doc.updated_at) {
        const d = new Date(doc.updated_at);
        if (!isNaN(d)) pie += (doc.version ? ' · ' : '') + 'en vigor desde el ' + LEGAL_FECHA.format(d);
    }
    if (doc.canonical) {
        pie += ' · <a href="' + escapeHtml(doc.canonical) + '" target="_blank" rel="noreferrer" class="underline hover:text-slate-600">abrir en una pestaña</a>';
    }
    return pie + '</p>';
}

async function showLegalModal(type) {
    const modal = document.getElementById('legal-modal');
    const titleEl = document.getElementById('modal-title');
    const contentEl = document.getElementById('modal-content');
    if (!modal || !titleEl || !contentEl) return;

    const codigo = LEGAL_ALIAS[type] || type;

    modal.classList.remove('hidden');
    modal.classList.add('flex');

    if (LEGAL_CACHE[codigo]) {
        titleEl.textContent = LEGAL_CACHE[codigo].title;
        contentEl.innerHTML = LEGAL_CACHE[codigo].html;
        return;
    }

    const url = legalUrl(codigo, type);
    if (!url) {
        mostrarRespaldoLegal(codigo, titleEl, contentEl);
        return;
    }

    titleEl.textContent = legalTitulo(codigo);
    contentEl.innerHTML = '<p class="text-slate-400">Cargando el texto vigente…</p>';

    try {
        const doc = await fetchLegalDoc(codigo, url);
        doc.html += legalPie(doc);
        LEGAL_CACHE[codigo] = doc;
        titleEl.textContent = doc.title;
        contentEl.innerHTML = doc.html;
    } catch (err) {
        console.warn('[PayFactu] No se pudo cargar el documento legal publicado:', err);
        // Ya NO se recurre a un <iframe> apuntando a la URL: esa URL
        // devuelve JSON, y el navegador lo pintaba en crudo y con las
        // tildes rotas. Mejor un texto incrustado, o un mensaje honesto.
        mostrarRespaldoLegal(codigo, titleEl, contentEl);
    }
}

function mostrarRespaldoLegal(codigo, titleEl, contentEl) {
    const clave = LEGAL_FALLBACK_KEY[codigo];

    if (clave && typeof legalFallback === 'function') {
        const fallback = legalFallback(clave);
        if (fallback && fallback.html) {
            titleEl.textContent = fallback.title;
            contentEl.innerHTML = fallback.html;
            return;
        }
    }

    titleEl.textContent = legalTitulo(codigo);
    contentEl.innerHTML =
        '<p>Este documento no está disponible ahora mismo. Puedes solicitarlo en ' +
        '<a href="mailto:info@payfactu.com" class="text-emerald-700 underline">info@payfactu.com</a>.</p>';
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
                return;
            }
            const panel = document.getElementById('cookie-panel');
            if (panel && !panel.classList.contains('hidden')) {
                closeCookiePanel();
            }
            // El banner de cookies NO se cierra con Escape: hacerlo
            // desaparecer sin aceptar ni rechazar dejaría al visitante
            // sin decisión registrada, y el silencio no es consentimiento.
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