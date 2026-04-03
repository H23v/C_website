// script_smp.js

document.addEventListener('DOMContentLoaded', () => {
  /* ===========================
     Setup testi (ME) da texts.js
     =========================== */
  const TXT = window.TEXTS || { me: { eng: "", ita: "" } };

  /* ===========================
     Personaggio + nuvoletta ASCII
     =========================== */
  const personaggio = document.querySelector('.personaggio');
  const asciiBubble = document.getElementById('asciiBubble');
  const asciiCharEl = document.querySelector('.ascii-character');

  const SELECTED_FACE = 'ദ്ദ☕︎（≖⩊≖マ';
  let isSelected = false;
  let originalAscii = asciiCharEl ? asciiCharEl.textContent : '';

  if (personaggio && asciiBubble && asciiCharEl) {
    personaggio.addEventListener('click', (e) => {
      if (document.body.classList.contains('mode-mywork')) return;
      
      if (e.target.closest('.icon-ribbon, .icon-idea')) return;

      if (!isSelected) {
        if (!originalAscii) originalAscii = asciiCharEl.textContent || '';
        asciiBubble.removeAttribute('hidden');
        // forza reflow per l’animazione
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

    const ribbonBtn = asciiBubble.querySelector('.icon-ribbon');
    const ideaBtn = asciiBubble.querySelector('.icon-idea');

    ribbonBtn?.addEventListener('click', (ev) => {
      ev.stopPropagation();
      // TODO mobile: aprire gallery o my artwork
    });

    ideaBtn?.addEventListener('click', (ev) => {
      ev.stopPropagation();
      // TODO mobile: info / note
    });
  }

  /* ===========================
     Menu base
     =========================== */
  const body = document.body;
  const btnArtwork = document.querySelector('.menu-artwork');
  const btnCV = document.querySelector('.menu-cv');
  const btnMe = document.querySelector('.menu-me');
  const btnHTML = document.querySelector('.menu-img');

  function setActive(btn) {
    document.querySelectorAll('.menu-link').forEach(b => b.classList.remove('active'));
    btn?.classList.add('active');
  }

  /* ===========================
     Modalità Me? mobile
     =========================== */
  const mePanel = document.getElementById('mePanelMobile');
  const bioMobile = document.getElementById('bioMobile');
  const langBtns = mePanel?.querySelectorAll('.lang-btn');
  const contentENG = mePanel?.querySelector('.panel-content[data-lang="eng"]');
  const contentITA = mePanel?.querySelector('.panel-content[data-lang="ita"]');

  // Inietta i testi completi
  if (contentENG) contentENG.textContent = TXT.me.eng || "";
  if (contentITA) contentITA.textContent = TXT.me.ita || "";

  let isTyping = false;
  let currentLang = 'eng';
  let typeTimer = null;
  let isMeOpen = false;

  // funzione per scrittura super-veloce
  function typeText(el, rawText, charsPerTick = 12, delayMs = 2) {
    isTyping = true;
    langBtns?.forEach(b => b.disabled = true);

    const full = (rawText || "");
    el.innerHTML = "";
    let i = 0;

    const step = () => {
      i += charsPerTick;
      el.innerHTML = full.slice(0, i).replace(/\n/g, "<br>");
      if (i < full.length) {
        typeTimer = setTimeout(step, delayMs);
      } else {
        isTyping = false;
        langBtns?.forEach(b => b.disabled = false);
      }
    };

    if (typeTimer) clearTimeout(typeTimer);
    typeTimer = setTimeout(step, delayMs);
  }

  function openMeView() {
    if (!mePanel || !bioMobile) return;

    isMeOpen = true;
    setActive(btnMe);
    body.classList.add('me-view');

    // chiudi eventuale bubble/personaggio selezionato
    if (isSelected) {
      asciiBubble?.classList.remove('show');
      asciiBubble?.setAttribute('hidden', '');
      personaggio?.classList.remove('selected');
      asciiCharEl.textContent = originalAscii || "";
      isSelected = false;
    }

    // mostra bio + pannello
    bioMobile.removeAttribute('hidden');
    mePanel.removeAttribute('hidden');

    // forza reflow per far partire la transizione di opacity
    void bioMobile.offsetWidth;
    void mePanel.offsetWidth;

    // lingua di default ENG
    currentLang = 'eng';
    contentITA.hidden = true;
    contentENG.hidden = false;

    // testi sorgente da TEXTS
    typeText(contentENG, TXT.me.eng, 12, 2);

    // stato UI toggle lingua
    langBtns?.forEach(b => {
      const active = b.dataset.lang === 'eng';
      b.classList.toggle('active', active);
      b.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  function closeMeView() {
    if (!isMeOpen) return;
    if (!mePanel || !bioMobile) return;

    isMeOpen = false;
    body.classList.remove('me-view');
    btnMe?.classList.remove('active');

    // ferma typing
    if (typeTimer) clearTimeout(typeTimer);
    isTyping = false;
    langBtns?.forEach(b => b.disabled = false);

    // attendi fine fade, poi nascondi davvero
    setTimeout(() => {
      bioMobile.setAttribute('hidden', '');
      mePanel.setAttribute('hidden', '');
    }, 300);
  }

  // click su Me ?
  btnMe?.addEventListener('click', () => {
    if (!isMeOpen) {
      openMeView();
    } else {
      closeMeView();
    }
  });

  // switch lingua (bloccato mentre scrive)
  langBtns?.forEach(btn => {
    btn.addEventListener('click', () => {
      if (isTyping) return;
      const lang = btn.dataset.lang;
      if (lang === currentLang) return;
      currentLang = lang;

      langBtns.forEach(b => {
        const active = b === btn;
        b.classList.toggle('active', active);
        b.setAttribute('aria-selected', active ? 'true' : 'false');
      });

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

  /* ===========================
     Altri bottoni (chiudono Me se aperto)
     =========================== */

  // My ArtWork: per ora solo stato attivo
  btnArtwork?.addEventListener('click', () => {
    closeMeView();
    setActive(btnArtwork);
    // TODO: qui in futuro inserire la sezione portfolio mobile
  });

  // CV: apre la pagina CV esistente
  btnCV?.addEventListener('click', () => {
    closeMeView();
    setActive(btnCV);
    window.location.href = 'cv.html';
  });

  // HTML: placeholder per futura sezione
  btnHTML?.addEventListener('click', () => {
    closeMeView();
    setActive(btnHTML);
    // TODO: sezione HTML mobile
  });
});
