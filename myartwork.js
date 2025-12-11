// myartwork.js — Portfolio con: MyArtWork / HTML / Exhibition, fade grid, toggle to home
(function () {
  const body        = document.body;
  const linkArtwork = document.querySelector('.menu-artwork');
  const linkHTML    = document.querySelector('.menu-html');
  const linkCV      = document.querySelector('.menu-cv');
  const linkMe      = document.querySelector('.menu-me');
  const linkExh     = document.querySelector('.menu-exhibition'); // aggiunto in HTML

  const bioBlock    = document.querySelector('.bio-block');
  const hackBlock   = document.querySelector('.hack-block');
  const personaggio = document.querySelector('.personaggio');
  const homebrand   = document.querySelector('.homebrand');
  const bioR1       = document.querySelector('.bio-block .r1');
  const gridRoot    = document.getElementById('artworkGrid');

  if (!linkArtwork || !linkHTML || !bioBlock || !hackBlock || !personaggio || !gridRoot) return;

  const MOVERS = [bioBlock, hackBlock, personaggio];

  // Tempi animazioni
  const MOVE_MS = 460;
  const FADE_MS = 500;
  const STAGGER = 150;
  const GRID_FADE = 220;

  let animating = false;
  let gridBuilt = false;
  let gridFilter = 'all';

  // Helpers
  const rectsOf = (els) => els.map(el => el.getBoundingClientRect());
  const reflow  = () => void document.body.offsetHeight;
  const safe    = (v) => (v == null ? '' : String(v));

  function primeForAnim(el) {
    el.style.willChange = 'transform, opacity';
    el.style.transition = `transform ${MOVE_MS}ms ease, opacity ${FADE_MS}ms ease`;
  }
  function killTransitions(el) { el.style.transition = 'none'; }
  function clearAnimStyle(el) {
    el.style.willChange = '';
    el.style.transition = '';
    el.style.transform  = '';
    el.style.opacity    = '';
  }

  // === Gestione stati dei pulsanti ===
  function setActiveSection(section /* 'artwork'|'html' */, sub = 'all') {
    [linkArtwork, linkHTML, linkCV, linkMe, linkExh].forEach(a => a && a.classList.remove('active'));

    if (section === 'artwork') {
      linkArtwork?.classList.add('active');
      body.classList.add('show-exhibition');
      if (sub === 'exh') linkExh?.classList.add('active');
      else linkExh?.classList.remove('active');
    } else {
      linkHTML?.classList.add('active');
      body.classList.remove('show-exhibition');
      linkExh?.classList.remove('active');
    }

    body.dataset.section = section;
  }

  // ===== GRID =====
  function ensureGridMarkup() {
    if (gridBuilt) return;
    gridRoot.innerHTML = `<div class="artwork-grid__inner" id="artworkGridInner"></div>`;
    gridRoot.style.opacity = '0';
    gridBuilt = true;
  }

  function sortItems(list) {
    return [...list].sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      const pa = a.posizione || 0, pb = b.posizione || 0;
      return pb - pa;
    });
  }

  function filterItems(list, filter) {
    if (filter === 'html') return list.filter(it => !!it.html);
    if (filter === 'exh')  return list.filter(it => String(it.aggiunta || '').trim().toLowerCase() === 'exh.');
    return list;
  }

  function renderGrid(filter) {
    ensureGridMarkup();
    const inner = document.getElementById('artworkGridInner');
    if (!inner) return;

    const list = Array.isArray(window.MYARTWORK) ? window.MYARTWORK : [];
    const sorted = (typeof window.sortMyArtwork === 'function')
      ? window.sortMyArtwork(list)
      : sortItems(list);
    const filtered = filterItems(sorted, filter);

    inner.innerHTML = filtered.map(it => {
      let hackLine = '';
      const hackFlag = String(it.hack || '').toLowerCase();
      if (hackFlag === 'si') {
        hackLine = `<div class="art-card__hack"><em>with</em> <span class="hack-name">HACK</span></div>`;
      } else if (hackFlag === 'no') {
        hackLine = `<div class="art-card__hack art-card__hack--copyright">©</div>`;
      }

      return `
        <article class="art-card">
          ${hackLine}
          <h3 class="art-card__title">${safe(it.title)}</h3>
          <div class="art-card__year">${safe(it.year)}</div>
          <div class="art-card__descrizione">${safe(it.descrizione)}</div>
          <div class="art-card__aggiunta">${safe(it.aggiunta)}</div>
          <div class="art-card__esposizione">${safe(it.esposizione)}</div>
        </article>
      `;
    }).join('');
  }

  // Fade helpers
  function fadeInGrid() {
    gridRoot.hidden = false;
    gridRoot.style.transition = `opacity ${GRID_FADE}ms ease`;
    gridRoot.style.opacity = '0';
    requestAnimationFrame(() => { gridRoot.style.opacity = '1'; });
  }

  function fadeOutGrid(cb) {
    gridRoot.style.transition = `opacity ${GRID_FADE}ms ease`;
    gridRoot.style.opacity = '0';
    setTimeout(() => { cb && cb(); }, GRID_FADE + 20);
  }

  function showGrid(filter) {
    gridFilter = filter;
    renderGrid(filter);
    fadeInGrid();
  }

  function switchGrid(filter) {
    if (gridRoot.hidden) { showGrid(filter); return; }
    if (gridFilter === filter) return;
    fadeOutGrid(() => {
      gridFilter = filter;
      renderGrid(filter);
      requestAnimationFrame(() => { gridRoot.style.opacity = '1'; });
    });
  }

  function hideGrid() {
    fadeOutGrid(() => { gridRoot.hidden = true; });
  }

  // ===== Entrata (home → portfolio)
  function enterMode(section) {
    if (animating) return;
    animating = true;

    const mePanel = document.getElementById('mePanel');
    if (mePanel && !mePanel.hasAttribute('hidden')) {
      mePanel.classList.remove('show');
      setTimeout(() => mePanel.setAttribute('hidden', ''), 200);
    }

    const before = rectsOf(MOVERS);
    body.classList.add('mode-portfolio');
    body.classList.toggle('show-exhibition', section === 'artwork');

    setActiveSection(section, 'all');

    const startFilter = (section === 'html') ? 'html' : 'all';
    showGrid(startFilter);

    const after = rectsOf(MOVERS);
    MOVERS.forEach((el, i) => {
      const b = before[i], a = after[i];
      const dx = b.left - a.left;
      const dy = b.top  - a.top;
      killTransitions(el);
      el.style.transform = `translate(${dx}px, ${dy}px)`;
      el.style.opacity   = '0';
    });

    reflow();

    MOVERS.forEach((el, idx) => {
      setTimeout(() => {
        primeForAnim(el);
        el.style.transform = 'translate(0, 0)';
        el.style.opacity   = '1';
      }, idx * STAGGER);
    });

    const total = (MOVERS.length - 1) * STAGGER + MOVE_MS + 40;
    setTimeout(() => { MOVERS.forEach(clearAnimStyle); animating = false; }, total);
  }

  // ===== Uscita (portfolio → home)
  function goHome() {
    if (animating) return;
    animating = true;

    MOVERS.forEach(el => {
      el.style.transition = `opacity ${FADE_MS}ms ease`;
      el.style.opacity = '0';
    });
    fadeOutGrid(() => { gridRoot.hidden = true; });

    setTimeout(() => {
      MOVERS.forEach(killTransitions);
      body.classList.remove('mode-portfolio', 'show-exhibition');
      [linkArtwork, linkHTML, linkCV, linkMe, linkExh].forEach(a => a && a.classList.remove('active'));
      MOVERS.forEach(el => { el.style.opacity = ''; el.style.transform = ''; el.style.transition = ''; });
      reflow();
      animating = false;
    }, FADE_MS + 100);
  }

  // ===== Click handlers =====
  linkArtwork.addEventListener('click', (e) => {
    e.preventDefault();
    const isPortfolio = body.classList.contains('mode-portfolio');

    if (isPortfolio && linkArtwork.classList.contains('active')) { goHome(); return; }
    if (isPortfolio && body.dataset.section === 'html') {
      setActiveSection('artwork', 'all');
      switchGrid('all');
      return;
    }
    enterMode('artwork');
  });

  linkHTML.addEventListener('click', (e) => {
    e.preventDefault();
    const isPortfolio = body.classList.contains('mode-portfolio');

    if (isPortfolio && linkHTML.classList.contains('active')) { goHome(); return; }
    if (isPortfolio && body.dataset.section === 'artwork') {
      setActiveSection('html');
      switchGrid('html');
      return;
    }
    enterMode('html');
  });

  linkExh?.addEventListener('click', (e) => {
    e.preventDefault();
    const isPortfolio = body.classList.contains('mode-portfolio');

    if (isPortfolio && linkExh.classList.contains('active')) { goHome(); return; }
    if (!isPortfolio) {
      enterMode('artwork');
      setTimeout(() => { setActiveSection('artwork', 'exh'); switchGrid('exh'); }, 0);
      return;
    }
    setActiveSection('artwork', 'exh');
    switchGrid('exh');
  });

  // Uscite rapide
  personaggio?.addEventListener('click', () => { if (body.classList.contains('mode-portfolio')) goHome(); });
  homebrand?.addEventListener('click', (e) => { if (body.classList.contains('mode-portfolio')) { e.preventDefault(); goHome(); } });
  bioR1?.addEventListener('click', (e) => { if (body.classList.contains('mode-portfolio')) { e.preventDefault(); e.stopPropagation(); goHome(); } }, true);
})();
