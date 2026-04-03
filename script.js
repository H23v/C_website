
/* ===========================
   Notepad (Policy) + Lingua + Animazioni
   =========================== */
const overlay = document.getElementById('policyOverlay');
const policyText = document.getElementById('policyText');
const btnPolicy = document.querySelector('.policy-btn');
const closeBtn = document.querySelector('.close-notepad');
const langPolicyBtn = document.getElementById('langPolicyBtn');

// Carica i testi dal file esterno (compat ENG/ITA e fallback stringa)
const TXT = window.TEXTS || { me: { eng: "", ita: "" }, policy: "" };
const POLICY = (typeof TXT.policy === 'string')
  ? { eng: TXT.policy, ita: TXT.policy }
  : { eng: TXT.policy?.eng || "", ita: TXT.policy?.ita || TXT.policy?.eng || "" };

let policyLang = 'eng'; // default ENG

function setPolicyTextByLang(lang) {
  const html = (POLICY[lang] || "").replace(/\n/g, "<br>");
  policyText.innerHTML = html;
}

// Apri con animazione (overlay fade + card scale)
function openPolicy() {
  policyLang = 'eng';              // default lingua
  setPolicyTextByLang(policyLang); // testo ENG
  if (langPolicyBtn) langPolicyBtn.textContent = '🇮🇹'; // bottone mostra lingua alternativa

  overlay.hidden = false;
  // reflow + attiva animazione
  requestAnimationFrame(() => overlay.classList.add('active'));
  document.body.style.overflow = 'hidden';
}

// Chiudi con animazione inversa (poi nascondi)
function closePolicy() {
  overlay.classList.remove('active');
  const onEnd = (e) => {
    if (e.target !== overlay) return;
    overlay.hidden = true;
    overlay.removeEventListener('transitionend', onEnd);
  };
  overlay.addEventListener('transitionend', onEnd);
  document.body.style.overflow = '';
}

btnPolicy?.addEventListener('click', openPolicy);
closeBtn?.addEventListener('click', closePolicy);

// Evita chiusure accidentali: click nello sfondo non chiude
overlay?.addEventListener('click', (e) => e.stopPropagation());

// Toggle lingua 🇮🇹 ↔ 🇬🇧
langPolicyBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  policyLang = (policyLang === 'eng') ? 'ita' : 'eng';
  setPolicyTextByLang(policyLang);
  // il bottone mostra la lingua "alternativa" disponibile
  langPolicyBtn.textContent = (policyLang === 'eng') ? '🇮🇹' : '🇬🇧';
});



/* ===========================
   Pannello "Me ?" (right)
   - Fade dolce
   - Scrittura super-veloce
   - Lock lingua durante typing
   - Me? evidenziato finché aperto
   =========================== */
const meBtn = document.querySelector('.menu-me');
const mePanel = document.getElementById('mePanel');
const langBtns = mePanel?.querySelectorAll('.lang-btn');
const contentENG = mePanel?.querySelector('.panel-content[data-lang="eng"]');
const contentITA = mePanel?.querySelector('.panel-content[data-lang="ita"]');

// Inietta i testi dalle sorgenti esterne (contenuto pieno: usato come sorgente)
if (contentENG) contentENG.textContent = TXT.me.eng || "";
if (contentITA) contentITA.textContent = TXT.me.ita || "";

// State
let isTyping = false;          // se true: blocco switch lingua
let currentLang = 'eng';       // ENG default
let typeTimer = null;

// Funzione di scrittura super-veloce
function typeText(el, rawText, charsPerTick = 12, delayMs = 2) {
  // Blocca switch
  isTyping = true;
  langBtns?.forEach(b => b.disabled = true);

  // Preparo
  const full = (rawText || "");
  el.innerHTML = "";
  let i = 0;

  // Writer
  const step = () => {
    i += charsPerTick;
    el.innerHTML = full.slice(0, i).replace(/\n/g, "<br>");
    if (i < full.length) {
      typeTimer = setTimeout(step, delayMs);
    } else {
      // Fine typing: sblocco
      isTyping = false;
      langBtns?.forEach(b => b.disabled = false);
    }
  };
  step();
}

// Apri/chiudi pannello Me?
meBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  const willOpen = mePanel.hasAttribute('hidden');

  if (willOpen) {
    // Evidenziazione bottone Me? (CSS: .menu-link.active -> solo colore)
    meBtn.classList.add('active');

    // Mostra pannello e avvia transizione
    mePanel.removeAttribute('hidden');
    // forza reflow per far partire il fade
    // eslint-disable-next-line no-unused-expressions
    mePanel.offsetHeight;
    mePanel.classList.add('show');

    // Imposto ENG default e typing super-veloce
    currentLang = 'eng';
    contentITA.hidden = true;
    contentENG.hidden = false;

    // Scrivi (sorgente da TEXTS)
    typeText(contentENG, TXT.me.eng, 12, 2);

    // Allinea stato UI del toggle lingua
    langBtns?.forEach(b => {
      const active = b.dataset.lang === 'eng';
      b.classList.toggle('active', active);
      b.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  } else {
    // Chiudi pannello e rimuovi highlight Me?
    mePanel.classList.remove('show');
    setTimeout(() => mePanel.setAttribute('hidden', ''), 250);
    meBtn.classList.remove('active');

    // Se stava scrivendo, interrompi
    if (typeTimer) clearTimeout(typeTimer);
    isTyping = false;
    langBtns?.forEach(b => b.disabled = false);
  }
});

// Switch lingua: bloccato mentre scrive
langBtns?.forEach(btn => {
  btn.addEventListener('click', () => {
    if (isTyping) return;                 // BLOCCO richiesto
    const lang = btn.dataset.lang;        // "ita" | "eng"
    if (lang === currentLang) return;

    currentLang = lang;

    // UI toggle
    langBtns.forEach(b => {
      const active = b === btn;
      b.classList.toggle('active', active);
      b.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    // Mostra e scrivi
    if (lang === 'eng') {
      contentITA.hidden = true;
      contentENG.hidden = false;
      typeText(contentENG, TXT.me.eng, 12, 2);
    } else {
      contentENG.hidden = true;
      contentITA.hidden = false;
      typeText(contentITA, TXT.me.ita, 12, 2);
    }
  });
});

// Chiudi il pannello Me? cliccando un’altra sezione (e rimuovi highlight)
document.querySelectorAll('.menu-link:not(.menu-me)').forEach(link => {
  link.addEventListener('click', () => {
    if (!mePanel?.hasAttribute('hidden')) {
      mePanel.classList.remove('show');
      setTimeout(() => mePanel.setAttribute('hidden', ''), 250);
      meBtn?.classList.remove('active');
      // interrompi eventuale typing
      if (typeTimer) clearTimeout(typeTimer);
      isTyping = false;
      langBtns?.forEach(b => b.disabled = false);
    }
  });
});


/* ===========================
   MENU: attivo = solo cambio colore
   =========================== */
const menuEl = document.querySelector('.menu');
const menuLinks = document.querySelectorAll('.menu-link');
let activeLink = null;

// Mostra stato attivo (solo colore) sul link
function activateLink(link) {
  // rimuovi dagli altri
  menuLinks.forEach(l => l.classList.remove('active'));
  // attiva questo
  link.classList.add('active');
  activeLink = link;
}

// Disattiva tutto
function deactivateAll() {
  menuLinks.forEach(l => l.classList.remove('active'));
  activeLink = null;
}

// Gestione click su OGNI voce di menu (incluso “Me ?”)
menuLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    // Se clicchi lo stesso link attivo → disattiva
    if (activeLink === link) {
      deactivateAll();
      return;
    }
    // Attiva questo link (solo colore diverso)
    activateLink(link);
  });
});

/* ===========================
   Link & azioni extra richieste
   =========================== */

/* Helper per aprire link in nuova scheda */
function openExternal(url) {
  try {
    window.open(url, '_blank', 'noopener');
  } catch (e) {
    location.href = url; // fallback
  }
}

/* --- 1) CV (voce menu) --- */
const cvLink = document.querySelector('.menu-cv');
cvLink?.addEventListener('click', (e) => {
  e.preventDefault();
  // Apri la nostra pagina dedicata al PDF
  try {
    location.href = 'cv.html'; // fallback stessa scheda
  } catch (err) {
    location.href = 'cv.html'; // fallback stessa scheda
  }
});

/* --- 2) GitHub (bio r5, secondo span) --- */
const githubSpan = document.querySelector('.bio-block .r5 span:nth-child(2)');
githubSpan?.addEventListener('click', (e) => {
  e.preventDefault();
  openExternal('https://github.com/H23v');
});
if (githubSpan) githubSpan.style.cursor = 'pointer';

/* --- 3) [in] (bio r6) --- */
const inRow = document.querySelector('.bio-block .r6');
inRow?.addEventListener('click', (e) => {
  e.preventDefault();
  openExternal('https://www.linkedin.com/in/chiara-bertasini/');
});
if (inRow) inRow.style.cursor = 'pointer';

/* --- 4) @chiara_bertasini (bio r2, secondo span) --- */
const instaSpan = document.querySelector('.bio-block .r2 span:nth-child(2)');
instaSpan?.addEventListener('click', (e) => {
  e.preventDefault();
  openExternal('https://www.instagram.com/chiara_bertasini?igsh=MmZpZmNlZWhtNTR2');
});
if (instaSpan) instaSpan.style.cursor = 'pointer';

/* --- 5) H_WebSite (hack-block h3) --- */
const hWebsite = document.querySelector('.hack-block .h3');
hWebsite?.addEventListener('click', (e) => {
  e.preventDefault();
  openExternal('https://sites.google.com/view/spacehackweb/spacehack');
});
if (hWebsite) hWebsite.style.cursor = 'pointer';

/* --- 6) ©HIARA BERTASINI → mostra una GIF in alto a destra (toggle) --- */
const r1Row = document.querySelector('.bio-block .r1');
let bioNameEl = null;

// Avvolgo solo "©HIARA BERTASINI" in uno span cliccabile (senza toccare il resto)
if (r1Row) {
  const target = '©HIARA BERTASINI';
  if (r1Row.textContent.includes(target)) {
    // rimpiazzo SOLO la prima occorrenza testuale con uno span
    r1Row.innerHTML = r1Row.innerHTML.replace(target, `<span class="bio-name" role="button" tabindex="0">${target}</span>`);
    bioNameEl = r1Row.querySelector('.bio-name');
    if (bioNameEl) {
      bioNameEl.style.cursor = 'pointer';
      bioNameEl.addEventListener('click', toggleWebcamGif);
      bioNameEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') toggleWebcamGif();
      });
    }
  }
}

// Crea/togglia la GIF in alto a destra
let webcamNode = null;
function toggleWebcamGif() {
  if (!webcamNode) {
    webcamNode = document.createElement('img');
    webcamNode.src = 'webcam.gif';
    webcamNode.alt = 'webcam';
    Object.assign(webcamNode.style, {
      position: 'fixed',
      top: '1.5rem',
      right: '1.5rem',
      width: '300px',
      height: 'auto',
      zIndex: '950',               // sotto l’overlay del notepad (1000)
      boxShadow: '0 12px 28px rgba(0,0,0,0.22)',
      borderRadius: '8px'
    });
    document.body.appendChild(webcamNode);
  } else {
    // toggle: se c’è, la rimuovo
    webcamNode.remove();
    webcamNode = null;
  }
}

/* ===== Nuvoletta ASCII + stato selezionato (volto unico) ===== */
const personaggio = document.querySelector('.personaggio');
const asciiBubble = document.getElementById('asciiBubble');
const asciiCharEl = document.querySelector('.ascii-character');

const SELECTED_FACE = 'ദ്ദ☕︎（≖⩊≖マ';
let isSelected = false;
let originalAscii = asciiCharEl ? asciiCharEl.textContent : '';

function resetPersonaggioState() {
  if (!personaggio || !asciiBubble || !asciiCharEl) return;

  asciiBubble.classList.remove('show');
  asciiBubble.setAttribute('hidden', '');

  personaggio.classList.remove('selected');
  asciiCharEl.textContent = originalAscii;

  isSelected = false;
}

window.resetPersonaggioState = resetPersonaggioState;

if (personaggio && asciiBubble && asciiCharEl) {
  personaggio.addEventListener('click', (e) => {

    // 👇 BLOCCA TUTTO se sei in mywork
    if (document.body.classList.contains('mode-mywork')) return;

    // non togglare se clicco sulle icone
    if (e.target.closest('.icon-ribbon, .icon-idea')) return;

    if (!isSelected) {
      if (!originalAscii) originalAscii = asciiCharEl.textContent || '';

      asciiBubble.removeAttribute('hidden');
      void asciiBubble.offsetWidth;
      asciiBubble.classList.add('show');

      personaggio.classList.add('selected');
      asciiCharEl.textContent = SELECTED_FACE;

      isSelected = true;
    } else {
      asciiBubble.classList.remove('show');
      setTimeout(() => asciiBubble.setAttribute('hidden', ''), 120);

      personaggio.classList.remove('selected');
      asciiCharEl.textContent = originalAscii;

      isSelected = false;
    }
  });

// hook pronti per le icone (li agganceremo dopo)
const ribbonBtn = asciiBubble.querySelector('.icon-ribbon');
const ideaBtn = asciiBubble.querySelector('.icon-idea');
ribbonBtn?.addEventListener('click', (ev) => { ev.stopPropagation(); /* TODO: azione 🎀 */ });
ideaBtn?.addEventListener('click', (ev) => { ev.stopPropagation(); /* TODO: azione 💡 */ });
}

/* ===== Galleria di sfondo controllata dal tasto 🎀 (con zona centrale “safe”) ===== */
(function () {
  const ribbonBtn = document.querySelector('.icon-ribbon');
  const personaggio = document.querySelector('.personaggio');
  if (!ribbonBtn) return;

  // Dati immagini
  const images = (window.SELECTED_IMAGES || []).slice();
  if (!images.length) return;

  // shuffle
  for (let i = images.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [images[i], images[j]] = [images[j], images[i]];
  }

  const fadeMs = (window.SELECTED_IMAGES_OPTIONS && window.SELECTED_IMAGES_OPTIONS.fadeMs) || 450;

  // Assicura markup
  function ensureEl(sel, creator) {
    let el = document.querySelector(sel);
    if (!el) { el = creator(); document.body.appendChild(el); }
    return el;
  }
  const gallery = ensureEl('#bgGallery', () => {
    const d = document.createElement('div');
    d.id = 'bgGallery';
    d.className = 'bg-gallery';
    d.setAttribute('aria-hidden', 'true');
    d.innerHTML = `
      <img class="layer layer-a" alt="">
      <img class="layer layer-b" alt="">
    `;
    return d;
  });
  const layerA = gallery.querySelector('.layer-a');
  const layerB = gallery.querySelector('.layer-b');

  const captionEl = ensureEl('#imgCaption', () => {
    const d = document.createElement('div');
    d.id = 'imgCaption';
    d.className = 'img-caption';
    d.setAttribute('aria-live', 'polite');
    return d;
  });

  const zoneLeft = ensureEl('.gallery-zone.zone-left', () => {
    const d = document.createElement('div');
    d.className = 'gallery-zone zone-left';
    d.setAttribute('aria-label', 'Previous');
    return d;
  });
  const zoneRight = ensureEl('.gallery-zone.zone-right', () => {
    const d = document.createElement('div');
    d.className = 'gallery-zone zone-right';
    d.setAttribute('aria-label', 'Next');
    return d;
  });

  gallery.style.setProperty('--fade', `${fadeMs}ms`);

  let open = false, index = 0, showingA = true, lock = false;

  // calcola la larghezza della zona centrale “safe”
  function updateSafeWidth() {
    // margine extra attorno al personaggio (px)
    const extra = 280;
    let w = 520; // fallback
    try {
      const r = personaggio?.getBoundingClientRect();
      if (r && r.width) w = Math.max(420, Math.min(window.innerWidth * 0.8, r.width + extra));
    } catch { }
    document.documentElement.style.setProperty('--safeW', w + 'px');
  }

  function setSrcAndShow(imgEl, src, onShown) {
    function done() {
      requestAnimationFrame(() => { imgEl.classList.add('show'); onShown && onShown(); });
    }
    imgEl.classList.remove('show');
    imgEl.onload = done;
    imgEl.onerror = done;
    imgEl.src = src;
    if (imgEl.complete && imgEl.naturalWidth > 0) done(); // cache
  }

  function show(idx) {
    index = (idx + images.length) % images.length;
    const { src, caption } = images[index];

    const inLayer = showingA ? layerA : layerB;
    const outLayer = showingA ? layerB : layerA;

    outLayer.classList.remove('show');
    setSrcAndShow(inLayer, src, () => { showingA = !showingA; });

    captionEl.textContent = caption || '';
  }

  function openGallery() {
    if (open) return;
    open = true;
    updateSafeWidth();
    document.body.classList.add('gallery-active'); // abilita zone
    gallery.classList.add('active');

    layerA.classList.remove('show');
    layerB.classList.remove('show');
    showingA = true;
    show(0);
  }

  function closeGallery() {
    if (!open) return;
    open = false;
    gallery.classList.remove('active');
    document.body.classList.remove('gallery-active');

    layerA.classList.remove('show');
    layerB.classList.remove('show');

    zoneLeft.removeAttribute('data-cursor');
    zoneRight.removeAttribute('data-cursor');
  }

  function next() { if (lock) return; lock = true; show(index + 1); setTimeout(() => (lock = false), fadeMs); }
  function prev() { if (lock) return; lock = true; show(index - 1); setTimeout(() => (lock = false), fadeMs); }

  // Toggle con 🎀
  ribbonBtn.addEventListener('click', (e) => { e.stopPropagation(); open ? closeGallery() : openGallery(); });

  // Clic sul personaggio chiude la gallery (il centro è “safe”, ma nel dubbio…)
  personaggio?.addEventListener('click', () => { if (open) closeGallery(); });

  // Cursori testuali nelle zone
  function updateCursor(e, zone, label) {
    zone.style.setProperty('--cursor-x', e.clientX + 'px');
    zone.style.setProperty('--cursor-y', e.clientY + 'px');
    zone.setAttribute('data-cursor', label);
  }
  zoneLeft.addEventListener('mousemove', (e) => updateCursor(e, zoneLeft, '↰UNDO'));
  zoneRight.addEventListener('mousemove', (e) => updateCursor(e, zoneRight, 'REDO↳'));
  zoneLeft.addEventListener('mouseleave', () => zoneLeft.removeAttribute('data-cursor'));
  zoneRight.addEventListener('mouseleave', () => zoneRight.removeAttribute('data-cursor'));

  zoneLeft.addEventListener('click', () => { if (open) prev(); });
  zoneRight.addEventListener('click', () => { if (open) next(); });

  // Tastiera
  document.addEventListener('keydown', (e) => {
    if (!open) return;
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'Escape') closeGallery();
  });

  // aggiorna la zona centrale quando ridimensioni
  window.addEventListener('resize', () => { if (open) updateSafeWidth(); });
})();
