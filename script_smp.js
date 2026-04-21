document.addEventListener('DOMContentLoaded', () => {
  const TXT = window.TEXTS || { me: { eng: '', ita: '' } };
  const CV_INFO_TEXT = `
⋆˚ E X H I B I T I O N 𝜗𝜚˚⋆

(Personal)
2024 | *Demote_Limbo*, Habitat Ottantatre (VR).

(Collective)
2025 | *The Sign of the Sing*, Underground Theatre of the Athens School of Fine Arts (GR), [Erasmus+BIP].+link(https://www.youtube.com/watch?v=cr0l2EwK2jI)
2025 | *Pointless Dynamics*, Accademia di Brera (MI), [independent show].+link(https://h23v.github.io/LoSai/)
2025 | *Future Vibes*, Accademia di Belle Arti di Catania (CT).+link(https://futurevibes.abacatania.it/2025-the-exhibition/)
2025 | *Lost Art Project* by Puff Store in collaboration with Con/Temporary Art Spaces - ArtàPorter (TO).+link(https://www.instagram.com/p/DFYCqxQoQxl/?hl=zh-cn&img_index=2)
2024 | Heppening, *(Im)possible Sculpture*, Habitat Ottantatre (VR), December 22, 2024.
2024 | *Riconoscersi. Senza l’altro io non sono*, Casa degli Artisti, Fondazione VIDAS & Accademia di Brera (MI).
2022 | *Do Androids Dream of Electric Sheep?* | TECNOCOPIA, University of Bologna, Adiacenze (BO), [Spatial.io].

⋆˚ P R I Z E

2025 | Special mention - *Umanesimo Tecnologico. Rappresentare mondi possibili*, Accademia di Brescia, SantaGiulia (BS).+link(https://www.io01umanesimotecnologico.it/approfondimenti/mondi-possibili-come-reale-e-virtuale-ridefiniscono-spazio-percezione-e-creativita/)
2021 | Training award - Careof Milano, workshop *How to tell a story and why we should tell it in a certain way?* with Elisa Caldana and Diego Tonus, BLAST / LEARNING.

⋆˚ P U B L I C A T I O N

2024 | *Dysmorphic alogy. Cultural phenomenology of the NPC streamer* - 𝘔𝘌𝘋𝘐𝘈𝘓 𝘋𝘐𝘚𝘖𝘙𝘋𝘌𝘙𝘚. Interpretive and non-statistical compendium of technological disorders (vol I), INACTUAL.+link(https://inactual.it/medial-disorder-is-loading/)
-
2025 | Mention in *Micelio256. Reti viventi tra arte, tecnologia*, Sara Fray, [independent publishing].+link(https://www.instagram.com/micelio256_/)
2025 | *Voci dal Nuovo Mondo*, on the online magazine Tales from the Latent Space, Michele Rocchi, [interview].+link(https://michelerocchi.substack.com/p/voci-dal-nuovo-mondo?utm_source=ig&utm_medium=social&utm_content=link_in_bio&utm_id=97760_v0_s00_e0_tv_a1denni77lufcb&fbclid=PAb21jcARC5udleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA81NjcwNjczNDMzNTI0MjcAAafJyeN85BU3D9KvuqH-7fz_65onr6HO-ENjyvE1vaImAK5k00dugwMIihZdEg_aem_syyNSoF7cJ25MLlVsu7Gug)

⋆˚ W R I T I N G

2024 | *AI eerie* +link(https://drive.google.com/file/d/1gSrORrNnu6mUAhjcpbv8mdlcOHRd4uCd/view)
`.trim();

  const body = document.body;
  const homePersonaggio = document.querySelector('.home-personaggio');
  const asciiBubble = document.getElementById('asciiBubble');
  const asciiCharEl = homePersonaggio?.querySelector('.ascii-character');
  const btnArtwork = document.querySelector('.menu-artwork');
  const btnMe = document.querySelector('.menu-me');
  const meView = document.getElementById('meViewMobile');
  const mePanel = document.getElementById('mePanelMobile');
  const workPanel = document.getElementById('workPanelMobile');
  const workList = document.getElementById('workListMobile');
  const mobileCvContent = document.getElementById('mobileCvContent');
  const mobileCvSection = document.getElementById('mobileCvSection');
  const meTopNav = document.querySelector('.me-top-nav');
  const meTopLinks = document.querySelectorAll('.me-top-link');
  const langBtns = mePanel?.querySelectorAll('.lang-btn');
  const contentENG = mePanel?.querySelector('.panel-content[data-lang="eng"]');
  const contentITA = mePanel?.querySelector('.panel-content[data-lang="ita"]');

  const SELECTED_FACE = 'ദ്ദ☕︎（≖⩊≖マ';
  let isSelected = false;
  let originalAscii = asciiCharEl ? asciiCharEl.textContent : '';
  let isTyping = false;
  let currentLang = 'eng';
  let typeTimer = null;
  let currentView = 'home';

  if (contentENG) contentENG.textContent = TXT.me.eng || '';
  if (contentITA) contentITA.textContent = TXT.me.ita || '';
  if (mobileCvContent) mobileCvContent.innerHTML = renderCvText(CV_INFO_TEXT);

  document.querySelectorAll('.me-personaggio .ascii-character').forEach((el) => {
    el.textContent = originalAscii || SELECTED_FACE;
  });

  function escapeHtml(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function formatCvLine(line) {
    const trimmed = line.trim();
    if (!trimmed) return `<div class="cv-line cv-line--space"></div>`;
    if (trimmed === '-') return `<div class="cv-separator">-</div>`;
    if (!trimmed.includes('|') && !trimmed.startsWith('(')) {
      return `<div class="cv-section-title">${escapeHtml(trimmed)}</div>`;
    }
    if (trimmed.startsWith('(') && trimmed.endsWith(')')) {
      return `<div class="cv-subtitle">${escapeHtml(trimmed)}</div>`;
    }

    const linkMatch = trimmed.match(/\+link\((.*?)\)/);
    const hasLink = !!linkMatch;
    const linkUrl = linkMatch ? linkMatch[1] : '#';
    let clean = trimmed.replace(/\+link\((.*?)\)/, '').trim();
    clean = clean.replace(/\[([^\]]+)\]/g, `<span class="cv-addition">$1</span>`);
    clean = clean.replace(/\*([^*]+)\*/g, `<span class="cv-emph">$1</span>`);

    const match = clean.match(/^(\d{4}\s*\|)(.*)$/);
    if (match) {
      const datePart = `<span class="cv-date">${escapeHtml(match[1])}</span>`;
      const bodyPart = `<span class="cv-body">${match[2].trim()}</span>`;
      const content = `${datePart} ${bodyPart}`;
      return hasLink
        ? `<a class="cv-line cv-line--link" href="${linkUrl}" target="_blank" rel="noopener noreferrer">${content}</a>`
        : `<div class="cv-line">${content}</div>`;
    }

    return `<div class="cv-line">${clean}</div>`;
  }

  function renderCvText(raw) {
    return raw.split('\n').map(formatCvLine).join('');
  }

  function setActive(btn) {
    document.querySelectorAll('.menu-link').forEach((b) => b.classList.remove('active'));
    btn?.classList.add('active');
  }

  function resetAsciiState() {
    if (!isSelected) return;
    asciiBubble?.classList.remove('show');
    asciiBubble?.setAttribute('hidden', '');
    homePersonaggio?.classList.remove('selected');
    if (asciiCharEl) asciiCharEl.textContent = originalAscii || '';
    isSelected = false;
  }

  function typeText(el, rawText, charsPerTick = 12, delayMs = 2) {
    if (!el) return;
    isTyping = true;
    langBtns?.forEach((b) => (b.disabled = true));
    const full = rawText || '';
    el.innerHTML = '';
    let i = 0;

    const step = () => {
      i += charsPerTick;
      el.innerHTML = full.slice(0, i).replace(/\n/g, '<br>');
      if (i < full.length) {
        typeTimer = setTimeout(step, delayMs);
      } else {
        isTyping = false;
        langBtns?.forEach((b) => (b.disabled = false));
      }
    };

    if (typeTimer) clearTimeout(typeTimer);
    typeTimer = setTimeout(step, delayMs);
  }

  function closePanels() {
    body.classList.remove('me-view', 'work-view');
    meView?.setAttribute('hidden', '');
    workPanel?.setAttribute('hidden', '');
    if (typeTimer) clearTimeout(typeTimer);
    isTyping = false;
    langBtns?.forEach((b) => (b.disabled = false));
    document.querySelectorAll('.menu-link').forEach((b) => b.classList.remove('active'));
    currentView = 'home';
  }

  function openMeView() {
    resetAsciiState();
    currentView = 'me';
    setActive(btnMe);
    body.classList.add('me-view');
    body.classList.remove('work-view');
    workPanel?.setAttribute('hidden', '');
    meView?.removeAttribute('hidden');

    currentLang = 'eng';
    if (contentITA) contentITA.hidden = true;
    if (contentENG) contentENG.hidden = false;
    typeText(contentENG, TXT.me.eng, 12, 2);

    langBtns?.forEach((b) => {
      const active = b.dataset.lang === 'eng';
      b.classList.toggle('active', active);
      b.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    meView?.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }

  function buildWorkList() {
    if (!workList) return;
    const items = Array.isArray(window.MYARTWORK) ? [...window.MYARTWORK] : [];
    const sorter = typeof window.sortMyArtwork === 'function' ? window.sortMyArtwork : (arr) => arr;
    const sorted = sorter(items);

    workList.innerHTML = sorted.map((item) => {
      const href = item.page || item.url || '#';
      const target = item.external ? '_blank' : '_self';
      const year = item.year ?? '';
      const desc = item.descrizione || '';
      const expo = item.esposizione || '';
      return `
        <a class="work-card-mobile ${href === '#' ? 'is-disabled' : ''}" href="${href}" target="${target}" ${href === '#' ? 'aria-disabled="true" tabindex="-1"' : ''}>
          <div class="work-card-mobile-title">${item.title || ''}</div>
          <div class="work-card-mobile-meta">${year}${desc ? ' · ' + desc : ''}${expo ? '<br>' + expo : ''}</div>
        </a>
      `;
    }).join('');
  }

  function openWorkView() {
    resetAsciiState();
    currentView = 'work';
    setActive(btnArtwork);
    body.classList.add('work-view');
    body.classList.remove('me-view');
    meView?.setAttribute('hidden', '');
    workPanel?.removeAttribute('hidden');
    buildWorkList();
  }

  function goToWorkFromMe() {
    openWorkView();
  }

  function goToCvInsideMe() {
    if (currentView !== 'me') openMeView();
    mobileCvSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (homePersonaggio && asciiBubble && asciiCharEl) {
    homePersonaggio.addEventListener('click', (e) => {
      if (body.classList.contains('me-view') || body.classList.contains('work-view')) return;
      if (e.target.closest('.icon-ribbon, .icon-idea')) return;

      if (!isSelected) {
        if (!originalAscii) originalAscii = asciiCharEl.textContent || '';
        asciiBubble.removeAttribute('hidden');
        void asciiBubble.offsetWidth;
        asciiBubble.classList.add('show');
        homePersonaggio.classList.add('selected');
        asciiCharEl.textContent = SELECTED_FACE;
        isSelected = true;
      } else {
        resetAsciiState();
      }
    });
  }

  btnMe?.addEventListener('click', () => {
    if (currentView === 'me') {
      closePanels();
    } else {
      openMeView();
    }
  });

  btnArtwork?.addEventListener('click', () => {
    if (currentView === 'work') {
      closePanels();
    } else {
      openWorkView();
    }
  });

  meTopLinks.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.dataset.target === 'work') goToWorkFromMe();
      if (btn.dataset.target === 'cv') goToCvInsideMe();
    });
  });

  langBtns?.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (isTyping) return;
      const lang = btn.dataset.lang;
      if (lang === currentLang) return;
      currentLang = lang;

      langBtns.forEach((b) => {
        const active = b === btn;
        b.classList.toggle('active', active);
        b.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      if (lang === 'eng') {
        if (contentITA) contentITA.hidden = true;
        if (contentENG) contentENG.hidden = false;
        typeText(contentENG, TXT.me.eng, 12, 2);
      } else {
        if (contentENG) contentENG.hidden = true;
        if (contentITA) contentITA.hidden = false;
        typeText(contentITA, TXT.me.ita, 12, 2);
      }
    });
  });
});
