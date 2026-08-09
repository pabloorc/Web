/* =====================================================================
 * PayFactu · Consentimiento de cookies
 *
 * Va en el <head>, ANTES de main.js y antes de cualquier etiqueta.
 *
 * Dos capas de protección, no una:
 *
 *   1. Consent Mode v2 con todo en 'denied' desde el primer milisegundo.
 *      Cualquier etiqueta que se añada en el futuro lo respeta sin que
 *      haya que tocar este fichero.
 *
 *   2. gtag.js NO se inyecta hasta que el visitante acepta. Consent Mode
 *      por sí solo evita la cookie, pero gtag.js seguiría enviando pings
 *      sin cookies a Google con la IP del visitante. Eso no es
 *      almacenamiento en el terminal (LSSI art. 22.2), pero sí es una
 *      comunicación de datos personales a un tercero, y para eso también
 *      hace falta base jurídica. No cargarlo cierra los dos frentes.
 *
 * El estado se guarda en la cookie propia payfactu_consent, 6 meses, con
 * la versión de la Política de Cookies aceptada. Si publicas una versión
 * nueva del documento, deja de coincidir y se vuelve a preguntar — el
 * mismo patrón de versionado que core.documentos_legales.
 * ===================================================================== */

(function () {
    'use strict';

    var CFG = window.PAYFACTU_CONFIG || {};
    var GA_ID = CFG.GA_ID || '';
    var NOMBRE = 'payfactu_consent';
    var MESES = 6;

    // Versión de respaldo. La real se revalida contra el documento
    // publicado (véase revalidarVersion más abajo).
    var VERSION = CFG.COOKIES_VERSION || '1.0';

    /* ---------------------------------------------------------------
     * 1 · Consent Mode: denegado por defecto
     * ------------------------------------------------------------- */

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = window.gtag || gtag;

    gtag('consent', 'default', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
        // Las necesarias no se consienten: son imprescindibles para que
        // el sitio funcione y no se usan para perfilar a nadie.
        functionality_storage: 'granted',
        security_storage: 'granted',
        wait_for_update: 500
    });

    /* ---------------------------------------------------------------
     * 2 · Cookie propia con el estado
     * ------------------------------------------------------------- */

    function leerEstado() {
        var trozo = document.cookie
            .split(';')
            .map(function (c) { return c.trim(); })
            .find(function (c) { return c.indexOf(NOMBRE + '=') === 0; });

        if (!trozo) return null;

        try {
            var datos = JSON.parse(decodeURIComponent(trozo.slice(NOMBRE.length + 1)));
            if (typeof datos.analiticas !== 'boolean') return null;
            return datos;
        } catch (err) {
            return null;
        }
    }

    function guardarEstado(analiticas) {
        var estado = {
            v: VERSION,
            ts: new Date().toISOString(),
            necesarias: true,
            analiticas: !!analiticas
        };

        var caduca = new Date();
        caduca.setMonth(caduca.getMonth() + MESES);

        document.cookie =
            NOMBRE + '=' + encodeURIComponent(JSON.stringify(estado)) +
            '; expires=' + caduca.toUTCString() +
            '; path=/; SameSite=Lax' +
            (location.protocol === 'https:' ? '; Secure' : '');

        return estado;
    }

    /**
     * Borra las cookies de Google ya instaladas. Retirar el
     * consentimiento (RGPD art. 7.3) no es solo dejar de cargar el
     * script: lo ya escrito tiene que desaparecer.
     *
     * Se prueban todas las variantes de dominio porque GA las escribe
     * en el dominio raíz con punto inicial y el navegador no permite
     * saber en cuál está cada una.
     */
    function borrarCookiesGoogle() {
        var host = location.hostname;
        var dominios = ['', host, '.' + host];
        var partes = host.split('.');

        if (partes.length > 2) {
            var raiz = partes.slice(-2).join('.');
            dominios.push(raiz, '.' + raiz);
        }

        document.cookie.split(';').forEach(function (crudo) {
            var nombre = crudo.split('=')[0].trim();
            if (!/^(_ga|_gid|_gat|_gcl_au)/.test(nombre)) return;

            dominios.forEach(function (d) {
                document.cookie =
                    nombre + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' +
                    (d ? '; domain=' + d : '');
            });
        });
    }

    /* ---------------------------------------------------------------
     * 3 · Carga de Google Analytics (solo tras aceptar)
     * ------------------------------------------------------------- */

    function cargarAnalytics() {
        if (!GA_ID) {
            console.warn('[PayFactu] Consentimiento dado, pero falta GA_ID en PAYFACTU_CONFIG.');
            return;
        }
        if (document.getElementById('payfactu-ga')) return;

        var s = document.createElement('script');
        s.id = 'payfactu-ga';
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
        document.head.appendChild(s);

        // GA4 no almacena la IP completa: no hace falta anonymize_ip.
        gtag('js', new Date());
        gtag('config', GA_ID);
    }

    function aplicar(analiticas) {
        gtag('consent', 'update', {
            analytics_storage: analiticas ? 'granted' : 'denied'
        });

        if (analiticas) {
            cargarAnalytics();
        } else {
            borrarCookiesGoogle();
        }
    }

    /* ---------------------------------------------------------------
     * 4 · Interfaz
     * ------------------------------------------------------------- */

    function el(id) { return document.getElementById(id); }

    function mostrarBanner() {
        var banner = el('cookie-banner');
        if (!banner) return;
        banner.classList.remove('hidden');
        banner.classList.add('flex');
    }

    function ocultarBanner() {
        var banner = el('cookie-banner');
        if (!banner) return;
        banner.classList.add('hidden');
        banner.classList.remove('flex');
    }

    function abrirPanel() {
        var panel = el('cookie-panel');
        if (!panel) return;

        var estado = leerEstado();
        var interruptor = el('cookie-analiticas');
        // Por defecto DESACTIVADO: nunca premarcado.
        if (interruptor) interruptor.checked = !!(estado && estado.analiticas);

        panel.classList.remove('hidden');
        panel.classList.add('flex');
    }

    function cerrarPanel() {
        var panel = el('cookie-panel');
        if (!panel) return;
        panel.classList.add('hidden');
        panel.classList.remove('flex');
    }

    function decidir(analiticas) {
        guardarEstado(analiticas);
        aplicar(analiticas);
        ocultarBanner();
        cerrarPanel();
    }

    /* ---------------------------------------------------------------
     * 5 · Revalidación contra el documento publicado
     * ------------------------------------------------------------- */

    /**
     * Si la Política de Cookies publicada tiene una versión distinta de
     * la que consta en la cookie, se vuelve a preguntar: el visitante
     * consintió sobre un texto que ya no es el vigente.
     *
     * Falla en silencio a propósito. Si la API no responde, se conserva
     * el consentimiento existente: molestar a alguien que ya decidió,
     * por un fallo de red nuestro, sería peor que esperar a la próxima
     * visita.
     */
    function revalidarVersion(estado) {
        var base = CFG.LEGAL_BASE;
        if (!base || !estado) return;

        fetch(base.replace(/\/+$/, '') + '/api/legal/cookies', {
            headers: { accept: 'application/json' }
        })
            .then(function (r) { return r.ok ? r.json() : null; })
            .then(function (d) {
                if (!d || !d.version) return;
                VERSION = d.version;
                if (estado.v !== d.version) {
                    // El texto cambió: se retira el consentimiento previo
                    // y se vuelve a preguntar sobre el texto nuevo.
                    aplicar(false);
                    mostrarBanner();
                }
            })
            .catch(function () { /* sin red: se respeta lo ya decidido */ });
    }

    /* ---------------------------------------------------------------
     * 6 · Arranque
     * ------------------------------------------------------------- */

    function iniciar() {
        // Restos del banner anterior, que guardaba en localStorage.
        try { localStorage.removeItem('payfactu_cookies_accepted'); } catch (e) {}

        var cerrar = el('cookie-panel-cerrar');
        if (cerrar) cerrar.addEventListener('click', cerrarPanel);

        var panel = el('cookie-panel');
        if (panel) {
            panel.addEventListener('click', function (e) {
                // Cerrar al pulsar fuera NO decide nada: si aún no hay
                // consentimiento, el banner sigue ahí.
                if (e.target === panel) cerrarPanel();
            });
        }

        var estado = leerEstado();

        if (!estado) {
            // Sin decisión previa: nada cargado, y se pregunta.
            aplicar(false);
            mostrarBanner();
            return;
        }

        aplicar(estado.analiticas);
        revalidarVersion(estado);
    }

    /* ---------------------------------------------------------------
     * 7 · API pública (la usan los onclick de index.html)
     * ------------------------------------------------------------- */

    window.acceptCookies = function () { decidir(true); };
    window.rejectCookies = function () { decidir(false); };
    window.openCookiePanel = function () { abrirPanel(); };
    window.closeCookiePanel = function () { cerrarPanel(); };

    window.saveCookiePrefs = function () {
        var interruptor = el('cookie-analiticas');
        decidir(!!(interruptor && interruptor.checked));
    };

    /** Estado actual, por si otro script lo necesita. */
    window.payfactuConsent = leerEstado;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciar);
    } else {
        iniciar();
    }
})();
