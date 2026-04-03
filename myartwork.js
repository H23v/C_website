(() => {
  const body = document.body;

  const menu = document.querySelector(".menu");
  const aArtwork = document.querySelector(".menu-artwork");
  const aHtml = document.querySelector(".menu-img");
  const aExh = document.querySelector(".menu-exhibition");
  const personaggio = document.querySelector(".personaggio");
  const homebrand = document.querySelector(".homebrand");
  const txtIndex = document.querySelector(".txt-index");
  const originalIndexText = txtIndex ? txtIndex.textContent : "/Index";

  const gridRoot = document.getElementById("artworkGrid");
  const viewer = document.getElementById("workViewer");
  const cvInfo = document.getElementById("cvInfo");
  const cvContent = cvInfo?.querySelector(".cv-panel-content");

  const originalArtworkLabel = aArtwork ? aArtwork.textContent : "Every Work";

  let activeFilter = "all";
  let gridBuilt = false;
  let myWorkMenuBound = false;

  let deskModelVisible = true;

  const MODEL_CAMERA_BY_FILTER = {
    all: "320deg 0deg 1m",
    html: "50deg 77deg 0.2m",
    animation: "220deg 85deg 0.2m",
    graphics: "290deg 80deg 0.2m",
    vr: "192deg 88deg 0.2m"
  };

  const MODEL_TARGET_BY_FILTER = {
    all: "0m 0.5m 0m",
    html: "0m 0.2m 0m",
    animation: "0.5m 0.2m 0.5m",
    graphics: "0m 0.2m m",
    vr: "0.5m 0.2m 0.8m"
  };

  const CV_INFO_TEXT = `
  ⋆˚ E X H I B I T I O N  𝜗𝜚˚⋆

(Personal)
2024 | *Demote_Limbo*, Habitat Ottantatre (VR).+link

(Collective)
2025 | *The Sign of the Sing*, Underground Theatre of the Athens School of Fine Arts (GR), [Erasmus+BIP].+link
2025 | *Pointless Dynamics*, Accademia di Brera (MI), [independent show].+link
2025 | *Future Vibes*, Accademia di Belle Arti di Catania (CT).+link
2025 | *Lost Art Project* by Puff Store in collaboration with Con/Temporary Art Spaces - ArtàPorter (TO).
2024 | Heppening, *(Im)possible Sculpture*, Habitat Ottantatre (VR), December 22, 2024.
2024 | *Riconoscersi. Senza l’altro io non sono*, Casa degli Artisti, Fondazione VIDAS & Accademia di Brera (MI).+link
2022 | *Do Androids Dream of Electric Sheep?* | TECNOCOPIA, University of Bologna, Adiacenze (BO), [Spatial.io].+link

⋆˚ P R I Z E

2025 | Special mention - *Umanesimo Tecnologico. Rappresentare mondi possibili*, Accademia di Brescia, SantaGiulia (BS).+link
2021 | Training award - Careof Milano, workshop *How to tell a story and why we should tell it in a certain way?* with Elisa Caldana and Diego Tonus, BLAST / LEARNING.

⋆˚ P U B L I C A T I O N

2024 | *Dysmorphic alogy. Cultural phenomenology of the NPC streamer* - 𝘔𝘌𝘋𝘐𝘈𝘓 𝘋𝘐𝘚𝘖𝘙𝘋𝘌𝘙𝘚. Interpretive and non-statistical compendium of technological disorders (vol I), INACTUAL.
-
2025 | Mention in *Micelio256. Reti viventi tra arte, tecnologia*, Sara Fray, [independent publishing].+link
2025 | *Voci dal Nuovo Mondo*, on the online magazine Tales from the Latent Space, Michele Rocchi, [interview].+link

⋆˚ W R I T I N G

2024 | *AI eerie* +link
`.trim();

  function safe(v) {
    return v == null ? "" : String(v);
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function formatCvLine(line) {
    const trimmed = line.trim();

    if (!trimmed) return `<div class="cv-line cv-line--space"></div>`;
    if (trimmed === "-") return `<div class="cv-separator">-</div>`;

    // titoli sezione
    if (!trimmed.includes("|") && !trimmed.startsWith("(")) {
      return `<div class="cv-section-title">${escapeHtml(trimmed)}</div>`;
    }

    // sottocategorie tipo (Personal), (Collective)
    if (trimmed.startsWith("(") && trimmed.endsWith(")")) {
      return `<div class="cv-subtitle">${escapeHtml(trimmed)}</div>`;
    }

    // link marker
    const hasLink = trimmed.includes("+link");
    let clean = trimmed.replace(/\+link\s*$/, "").trim();

    // aggiunte tra [] -> corsivo grigio
    clean = clean.replace(/\[([^\]]+)\]/g, `<span class="cv-addition">$1</span>`);

    // titoli tra *...* -> corsivo
    clean = clean.replace(/\*([^*]+)\*/g, `<span class="cv-emph">$1</span>`);

    // data
    const match = clean.match(/^(\d{4}\s*\|)(.*)$/);
    if (match) {
      const datePart = `<span class="cv-date">${escapeHtml(match[1])}</span>`;
      const bodyPart = `<span class="cv-body">${match[2].trim()}</span>`;
      const content = `${datePart} ${bodyPart}`;

      return hasLink
        ? `<a class="cv-line cv-line--link" href="#" target="_blank" rel="noopener noreferrer">${content}</a>`
        : `<div class="cv-line">${content}</div>`;
    }

    return `<div class="cv-line">${clean}</div>`;
  }

  function renderCvText(raw) {
    return raw
      .split("\n")
      .map(formatCvLine)
      .join("");
  }

  function isMyWork() {
    return body.classList.contains("mode-mywork");
  }

  function getSection(it) {
    return safe(it?.section).trim().toLowerCase();
  }

  function getGroup(it) {
    return safe(it?.group).trim().toLowerCase();
  }

  function getGroupLabel(group) {
    if (group === "artistic work") return "artistic work";
    if (group === "engagements") return "engagements";
    return "";
  }

  function sortList(list) {
    const sorter = window.sortMyArtwork || ((arr) => arr);
    return sorter(list);
  }

  function ensureGrid() {
    if (!gridRoot) return null;
    let inner = document.getElementById("artworkGridInner");
    if (!inner) {
      gridRoot.innerHTML = `<div class="artwork-grid__inner" id="artworkGridInner"></div>`;
      inner = document.getElementById("artworkGridInner");
    }
    return inner;
  }

  function getViewerPage() {
    return viewer?.querySelector(".work-viewer__page") || null;
  }

  function renderDeskModel() {
    const page = getViewerPage();
    if (!page) return;

    deskModelVisible = true;

    page.innerHTML = `
    <div class="desk-model-wrap">
      <model-viewer
        id="deskModel"
        class="desk-model-viewer"
        src="mydesk.glb"
        alt="Desk model"
        camera-controls
        disable-zoom
        interaction-prompt="none"
        field-of-view="20deg"
        touch-action="pan-y"
        shadow-intensity="1"
        exposure="1"
        environment-image="neutral"
        camera-target="auto"
        camera-orbit="0deg 75deg 2m"
        min-camera-orbit="auto 0deg auto"
        max-camera-orbit="auto 360deg auto"
      ></model-viewer>
    </div>
  `;

    const model = page.querySelector("#deskModel");
    if (!model) return;

    model.style.setProperty("--progress-bar-height", "0px");
    model.style.setProperty("--poster-color", "transparent");
  }

  function rotateDeskModelTo(type) {
    const model = document.getElementById("deskModel");
    if (!model || !deskModelVisible) return;

    const nextOrbit = MODEL_CAMERA_BY_FILTER[type] || MODEL_CAMERA_BY_FILTER.all;
    const nextTarget = MODEL_TARGET_BY_FILTER[type] || MODEL_TARGET_BY_FILTER.all;

    model.cameraTarget = nextTarget;
    model.cameraOrbit = nextOrbit;
  }

  function showPlaceholderForCard(card) {
    const page = getViewerPage();
    if (!page) return;

    deskModelVisible = false;

    page.innerHTML = `
    <div style="padding:2rem;font-size:1rem;color:#7D7D7D;">
      Placeholder pagina centrale per:
      <br><br>
      <strong style="color:#4E4D4D;">${card.querySelector(".art-card__title")?.textContent || ""}</strong>
    </div>
  `;
  }

  function buildGrid() {
    if (gridBuilt) return;
    const inner = ensureGrid();
    if (!inner) return;

    const list = sortList(Array.isArray(window.MYARTWORK) ? window.MYARTWORK : []);

    let lastGroup = "";

    inner.innerHTML = list.map((it) => {
      const href = safe(it.url || it.href).trim();
      const target = it.external ? "_blank" : "_self";
      const hack = safe(it.hack).trim().toLowerCase() === "si";
      const section = getSection(it);
      const group = getGroup(it);

      const groupHeading = group && group !== lastGroup
        ? `<div class="art-group-label" data-group="${group}">${getGroupLabel(group)}</div>`
        : "";

      lastGroup = group;

      return `
      ${groupHeading}
      <article
        class="art-card"
        data-tags="${section}"
        data-group="${group}"
        ${href ? `data-href="${href}" data-target="${target}"` : ""}
      >
        <div class="art-card__hack">${hack ? `(<em>with</em> HACK)` : `<span class="art-card__hack--copyright">.</span>`}</div>
        <h3 class="art-card__title">${safe(it.title)}</h3>
        <div class="art-card__year">${safe(it.year)}</div>
        <div class="art-card__descrizione">${safe(it.descrizione)}</div>
        <div class="art-card__aggiunta">${safe(it.aggiunta)}</div>
        <div class="art-card__esposizione">${safe(it.esposizione)}</div>
      </article>
    `;
    }).join("");

    inner.addEventListener("click", (e) => {
      const card = e.target.closest(".art-card");
      if (!card) return;

      showPlaceholderForCard(card);
    });

    gridBuilt = true;
  }

  function applyFilter(type) {
    activeFilter = type;

    document.querySelectorAll(".menu-link").forEach((link) => {
      link.classList.remove("active");
    });

    const activeMap = {
      all: document.querySelector(".menu-allwork"),
      html: document.querySelector(".menu-html-work"),
      animation: document.querySelector(".menu-animation"),
      graphics: document.querySelector(".menu-graphics"),
      vr: document.querySelector(".menu-vr")
    };

    activeMap[type]?.classList.add("active");

    const cards = [...document.querySelectorAll(".art-card")];

    cards.forEach((card) => {
      const tag = safe(card.dataset.tags).trim().toLowerCase();
      const show = type === "all" ? true : tag === type;
      card.style.display = show ? "" : "none";
    });

    const labels = [...document.querySelectorAll(".art-group-label")];

    labels.forEach((label) => {
      const group = safe(label.dataset.group).trim().toLowerCase();

      const hasVisibleCards = cards.some((card) => {
        const sameGroup = safe(card.dataset.group).trim().toLowerCase() === group;
        const visible = card.style.display !== "none";
        return sameGroup && visible;
      });

      label.style.display = type === "all" && hasVisibleCards ? "" : "none";
    });

    if (deskModelVisible) {
      rotateDeskModelTo(type);
    }
  }

  function ensureExtraMenuItems() {
    if (!menu) return;

    if (!document.querySelector(".menu-allwork")) {
      const a = document.createElement("a");
      a.href = "#";
      a.className = "menu-link menu-allwork";
      a.textContent = "Anything";
      aArtwork.insertAdjacentElement("afterend", a);
    }

    if (!document.querySelector(".menu-html-work")) {
      const a = document.createElement("a");
      a.href = "#";
      a.className = "menu-link menu-html-work";
      a.textContent = "Web";
      document.querySelector(".menu-allwork")?.insertAdjacentElement("afterend", a);
    }

    if (!document.querySelector(".menu-animation")) {
      const a = document.createElement("a");
      a.href = "#";
      a.className = "menu-link menu-animation";
      a.textContent = "Animation";
      document.querySelector(".menu-html-work")?.insertAdjacentElement("afterend", a);
    }

    if (!document.querySelector(".menu-graphics")) {
      const a = document.createElement("a");
      a.href = "#";
      a.className = "menu-link menu-graphics";
      a.textContent = "Graphics";
      document.querySelector(".menu-animation")?.insertAdjacentElement("afterend", a);
    }

    if (!document.querySelector(".menu-vr")) {
      const a = document.createElement("a");
      a.href = "#";
      a.className = "menu-link menu-vr";
      a.textContent = "VR";
      document.querySelector(".menu-graphics")?.insertAdjacentElement("afterend", a);
    }
  }

  function bindMyWorkMenu() {
    if (myWorkMenuBound) return;

    document.querySelector(".menu-allwork")?.addEventListener("click", (e) => {
      e.preventDefault();
      applyFilter("all");
    });

    document.querySelector(".menu-html-work")?.addEventListener("click", (e) => {
      e.preventDefault();
      applyFilter("html");
    });

    document.querySelector(".menu-animation")?.addEventListener("click", (e) => {
      e.preventDefault();
      applyFilter("animation");
    });

    document.querySelector(".menu-graphics")?.addEventListener("click", (e) => {
      e.preventDefault();
      applyFilter("graphics");
    });

    document.querySelector(".menu-vr")?.addEventListener("click", (e) => {
      e.preventDefault();
      applyFilter("vr");
    });

    myWorkMenuBound = true;
  }

  function openMyWork() {
    if (typeof window.resetPersonaggioState === "function") {
      window.resetPersonaggioState();
    }

    buildGrid();
    ensureExtraMenuItems();
    bindMyWorkMenu();

    body.classList.add("mode-mywork");

    if (txtIndex) txtIndex.textContent = "/Work";
    if (gridRoot) gridRoot.hidden = false;
    if (viewer) viewer.hidden = false;

    renderDeskModel();

    if (cvInfo) {
      cvInfo.hidden = false;
      if (cvContent) {
        cvContent.innerHTML = renderCvText(CV_INFO_TEXT);
      }
    }

    requestAnimationFrame(() => {
      if (aArtwork) aArtwork.textContent = "←";
      applyFilter("all");
    });
  }

  function closeMyWork() {
    body.classList.remove("mode-mywork");

    if (txtIndex) txtIndex.textContent = originalIndexText;
    if (gridRoot) gridRoot.hidden = true;

    if (viewer) {
      viewer.hidden = true;
      const page = getViewerPage();
      if (page) page.innerHTML = "";
    }

    if (cvInfo) cvInfo.hidden = true;

    deskModelVisible = true;

    if (aArtwork) aArtwork.textContent = originalArtworkLabel;
  }

  aArtwork?.addEventListener("click", (e) => {
    e.preventDefault();

    if (isMyWork()) {
      closeMyWork();
    } else {
      openMyWork();
    }
  });

  homebrand?.addEventListener("click", (e) => {
    if (!isMyWork()) return;
    e.preventDefault();
    closeMyWork();
  });

  personaggio?.addEventListener("click", (e) => {
    if (!isMyWork()) return;
    e.preventDefault();
    closeMyWork();
  });

  if (gridRoot) gridRoot.hidden = true;
  if (viewer) viewer.hidden = true;
  if (cvInfo) cvInfo.hidden = true;
})();