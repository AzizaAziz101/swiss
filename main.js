/* ══════════════════════════════════════
   METALLBAU FRANZMANN — main.js
══════════════════════════════════════ */

/* ── CUSTOM CURSOR ── */
(function initCursor() {
    // NEU: früh raus wenn kein hover-fähiges Gerät (Touch/Mobile)
    if (!window.matchMedia('(hover: hover)').matches) return;

    const cursor     = document.getElementById('cursor');
    const cursorRing = document.getElementById('cursor-ring');
    if (!cursor || !cursorRing) return;

    let mx = -100, my = -100, rx = -100, ry = -100;

    document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
    }); 

    (function animCursor() {
        rx += (mx - rx) * 0.18;
        ry += (my - ry) * 0.18;
        cursor.style.left = mx + 'px';
        cursor.style.top  = my + 'px';
        cursorRing.style.left = rx + 'px';
        cursorRing.style.top  = ry + 'px';
        requestAnimationFrame(animCursor);
    })();

    document.querySelectorAll('a, button, .gal-item, .svc-cell, .segment').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
})();

/* ── MEGA DROPDOWN (Desktop) ── */
const MENU_DATA = {
    Leistungen: [
        { heading: 'Konstruktion', links: ['Treppenbau', 'Geländersysteme', 'Vordächer & Überdachungen'] },
        { heading: 'Industriebau', links: ['Stahlbühnen', 'Hallenbau', 'Rammschutz'] },
        { heading: 'Fertigung',    links: ['Laserschneiden', 'CNC-Biegen', 'Schweißarbeiten'] },
    ],
    Lösungen: [
        { heading: 'Segmente',    links: ['Privatbau', 'Gewerbebau', 'Öffentlicher Raum'] },
        { heading: 'Materialien', links: ['Edelstahl', 'Aluminium', 'Baustahl'] },
        { heading: 'Spezial',     links: ['Brandschutz', 'Smart-Access-Systeme'] },
    ],
    Unternehmen: [
        { heading: 'Profil',   links: ['Unsere Geschichte', 'Team', 'Zertifikate'] },
        { heading: 'Karriere', links: ['Offene Stellen', 'Ausbildung'] },
        { heading: 'Media',    links: ['Downloads', 'Aktuelles'] },
    ],
};

(function initMegaDrop() {
    const megaDrop = document.getElementById('mega-drop');
    if (!megaDrop) return;

    let dropTimeout;

    document.querySelectorAll('.has-drop').forEach(li => {
        li.addEventListener('mouseenter', () => {
            clearTimeout(dropTimeout);
            const cols = MENU_DATA[li.dataset.key];
            if (!cols) return;

            megaDrop.innerHTML = cols.map(col => `
                <div>
                    <p style="font-family:var(--mono);font-size:9px;letter-spacing:0.35em;text-transform:uppercase;
                              color:var(--grey-3);margin-bottom:20px;border-bottom:1px solid var(--grey-2);padding-bottom:12px;">
                        ${col.heading}
                    </p>
                    <ul style="list-style:none;display:flex;flex-direction:column;gap:12px;">
                        ${col.links.map(l =>
                            `<li><a href="#"
                                style="font-family:var(--sans);font-size:13px;font-weight:600;color:var(--grey-4);text-decoration:none;transition:color 0.2s;"
                                onmouseenter="this.style.color='var(--accent)'"
                                onmouseleave="this.style.color='var(--grey-4)'">${l}</a></li>`
                        ).join('')}
                    </ul>
                </div>
            `).join('');

            megaDrop.style.display = 'grid';
        });

        li.addEventListener('mouseleave', () => {
            dropTimeout = setTimeout(() => { megaDrop.style.display = 'none'; }, 200);
        });
    });

    megaDrop.addEventListener('mouseenter', () => clearTimeout(dropTimeout));
    megaDrop.addEventListener('mouseleave', () => { megaDrop.style.display = 'none'; });
})();

/* ── MOBILE MENU ── */
(function initMobileMenu() {
    const ham           = document.getElementById('ham');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const mobileNavList = document.getElementById('mobile-nav-items');
    if (!ham || !mobileOverlay || !mobileNavList) return;

    const MOB_KEYS  = ['Leistungen', 'Lösungen', 'Unternehmen', 'Kontakt'];
    const MOB_EXTRA = {
        Kontakt: [
            { heading: 'Zentrale', links: ['Anfahrt', 'Bürozeiten'] },
            { heading: 'Direkt',   links: ['Anfrageformular', 'E-Mail'] },
        ],
    };

    MOB_KEYS.forEach(key => {
        const data     = MENU_DATA[key] || MOB_EXTRA[key] || [];
        const allLinks = data.flatMap(d => d.links);

        const li = document.createElement('li');
        li.className = 'mob-nav-item';
        li.innerHTML = `
            <button class="mob-nav-btn">
                ${key}
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 3.75v10.5M3.75 9h10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
            </button>
            <div class="mob-acc-body">
                <div class="mob-sub-links">
                    ${allLinks.map(l => `<a href="#">${l}</a>`).join('')}
                </div>
            </div>`;
        mobileNavList.appendChild(li);
    });

    mobileNavList.querySelectorAll('.mob-nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const body   = btn.nextElementSibling;
            const isOpen = body.classList.contains('open');
            mobileNavList.querySelectorAll('.mob-acc-body').forEach(b => b.classList.remove('open'));
            mobileNavList.querySelectorAll('.mob-nav-btn').forEach(b => b.classList.remove('open'));
            if (!isOpen) {
                body.classList.add('open');
                btn.classList.add('open');
            }
        });
    });

    ham.addEventListener('click', () => {
        ham.classList.toggle('open');
        mobileOverlay.classList.toggle('open');
        document.body.style.overflow = mobileOverlay.classList.contains('open') ? 'hidden' : '';
    });
})();

/* ── MARQUEE ── */
(function initMarquee() {
    const track = document.getElementById('marquee-track');
    if (!track) return;
    let x = 0;

    function tick() {
        x -= 0.5;
        const stripeWidth = track.querySelector('.mq-stripe').offsetWidth;
        if (Math.abs(x) >= stripeWidth) x = 0;
        track.style.transform = `translateX(${x}px)`;
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
})();

/* ── ANIMATED COUNTERS ── */
(function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    const ease = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    function animate(el) {
        const target   = +el.dataset.target;
        const duration = 1800;
        const start    = performance.now();

        function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            el.textContent = Math.round(ease(progress) * target).toLocaleString('de-DE');
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                animate(e.target);
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
})();

/* ── SCROLL REVEAL ── */
(function initReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
})();

/* ── LIGHTBOX ── */
(function initLightbox() {
    const lb      = document.getElementById('lightbox');
    const lbImg   = document.getElementById('lb-img');
    const lbCap   = document.getElementById('lb-caption');
    const lbClose = document.getElementById('lb-close');
    if (!lb || !lbImg || !lbCap || !lbClose) return;

    document.querySelectorAll('.gal-item[data-img]').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (!img || img.naturalWidth === 0) return;
            lbImg.src        = img.src;
            lbImg.alt        = img.alt;
            lbCap.textContent = item.dataset.caption || '';
            lb.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeLightbox() {
        lb.classList.remove('active');
        document.body.style.overflow = '';
        lbImg.src = '';
    }

    lbClose.addEventListener('click', closeLightbox);
    lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
})();
