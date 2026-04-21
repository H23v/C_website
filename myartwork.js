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
  let viewerExpanded = false;
  let viewerExpansionEnabled = false;
  let viewerHoverBound = false;
  let viewerIframeCleanup = null;
  let viewerExpandTimer = null;
  let viewerCollapseTimer = null;
  let viewerEdgeCooldownUntil = 0;

  const MODEL_CAMERA_BY_FILTER = {
    all: "200deg 40deg 1m",
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
    const linkMatch = trimmed.match(/\+link\((.*?)\)/);
    const hasLink = !!linkMatch;
    const linkUrl = linkMatch ? linkMatch[1] : "#";

    let clean = trimmed.replace(/\+link\((.*?)\)/, "").trim();

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
        ? `<a class="cv-line cv-line--link" href="${linkUrl}" target="_blank" rel="noopener noreferrer">${content}</a>`
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

  function getSections(it) {
    if (Array.isArray(it?.section)) {
      return it.section.map((s) => safe(s).trim().toLowerCase()).filter(Boolean);
    }
    return [safe(it?.section).trim().toLowerCase()].filter(Boolean);
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

  function getViewerFrame() {
    return viewer?.querySelector(".work-frame") || null;
  }

  function clearViewerTimers() {
    if (viewerExpandTimer) {
      clearTimeout(viewerExpandTimer);
      viewerExpandTimer = null;
    }
    if (viewerCollapseTimer) {
      clearTimeout(viewerCollapseTimer);
      viewerCollapseTimer = null;
    }
  }

  function cleanupViewerFrameSync() {
    if (viewerIframeCleanup) {
      viewerIframeCleanup();
      viewerIframeCleanup = null;
    }
  }

  function setViewerExpansionEnabled(enabled) {
    viewerExpansionEnabled = !!enabled;
    body.classList.toggle("viewer-expansion-enabled", viewerExpansionEnabled);

    if (!viewerExpansionEnabled) {
      clearViewerTimers();
      viewerExpanded = false;
      body.classList.remove("viewer-pre-expand", "viewer-expanded");
    }
  }

  function setViewerExpanded(expanded) {
    if (!isMyWork() || !viewerExpansionEnabled) return;

    const next = !!expanded;
    if (next === viewerExpanded && !body.classList.contains("viewer-pre-expand")) return;

    clearViewerTimers();

    if (next) {
      if (Date.now() < viewerEdgeCooldownUntil) return;
      viewerExpanded = true;
      body.classList.add("viewer-pre-expand");
      viewerExpandTimer = setTimeout(() => {
        body.classList.add("viewer-expanded");
        viewerExpandTimer = null;
      }, 60);
      return;
    }

    viewerExpanded = false;
    viewerEdgeCooldownUntil = Date.now() + 260;
    body.classList.remove("viewer-expanded");
    viewerCollapseTimer = setTimeout(() => {
      body.classList.remove("viewer-pre-expand");
      viewerCollapseTimer = null;
    }, 120);
  }

  function collapseViewer(force = false) {
    if (force) {
      clearViewerTimers();
      viewerExpanded = false;
      body.classList.remove("viewer-pre-expand", "viewer-expanded");
      return;
    }
    setViewerExpanded(false);
  }

  function expandViewer() {
    setViewerExpanded(true);
  }

  function bindViewerHotspots() {
    if (viewerHoverBound) return;

    const ensureHotspot = (side) => {
      let el = document.querySelector(`.mywork-edge-hover--${side}`);
      if (!el) {
        el = document.createElement("div");
        el.className = `mywork-edge-hover mywork-edge-hover--${side}`;
        document.body.appendChild(el);
      }
      el.addEventListener("mouseenter", () => {
        if (!viewerExpansionEnabled || !viewerExpanded) return;
        collapseViewer();
      });
      return el;
    };

    ensureHotspot("left");
    ensureHotspot("right");
    viewerHoverBound = true;
  }

  function attachFrameScrollSync(frame) {
    cleanupViewerFrameSync();

    const bind = () => {
      try {
        const win = frame.contentWindow;
        const doc = frame.contentDocument;
        if (!win || !doc) return;

        let ticking = false;

        const getScrollTop = () => {
          return win.scrollY || doc.documentElement.scrollTop || doc.body.scrollTop || 0;
        };

        const updateFromScroll = () => {
          ticking = false;
          if (!isMyWork() || !viewerExpansionEnabled) return;
          const scrollTop = getScrollTop();
          if (scrollTop > 24) {
            expandViewer();
          } else {
            collapseViewer();
          }
        };

        const requestUpdate = () => {
          if (ticking) return;
          ticking = true;
          win.requestAnimationFrame(updateFromScroll);
        };

        const onScroll = () => {
          requestUpdate();
        };

        const onWheel = (e) => {
          if (!isMyWork() || !viewerExpansionEnabled) return;
          const scrollTop = getScrollTop();
          if (e.deltaY > 14 && scrollTop > 4) {
            expandViewer();
          } else if (e.deltaY < -14 && scrollTop <= 6) {
            collapseViewer();
          }
        };

        win.addEventListener("scroll", onScroll, { passive: true });
        win.addEventListener("wheel", onWheel, { passive: true });
        requestUpdate();

        viewerIframeCleanup = () => {
          win.removeEventListener("scroll", onScroll);
          win.removeEventListener("wheel", onWheel);
        };
      } catch (err) {
        viewerIframeCleanup = null;
      }
    };

    frame.addEventListener("load", bind, { once: true });

    try {
      if (frame.contentDocument?.readyState === "complete") bind();
    } catch (err) {
      // cross-origin or not ready yet
    }
  }

  function renderDeskModel() {
    const page = getViewerPage();
    if (!page) return;

    deskModelVisible = true;
    cleanupViewerFrameSync();
    setViewerExpansionEnabled(false);
    collapseViewer(true);

    page.innerHTML = `
    <div class="desk-model-wrap">
      <div class="model-loader" id="modelLoader">
      <img src="gif-load.gif" alt="loading">
    </div>
      <model-viewer
        id="deskModel"
        class="desk-model-viewer"
        src="mydesk2.glb"
        alt="Desk model"
        camera-controls
        disable-zoom
        interaction-prompt="none"
        field-of-view="20deg"
        touch-action="pan-y"
        shadow-intensity="0"
        exposure="1"
        environment-image="glasshouse.hdr"
        camera-target="auto"
        camera-orbit="0deg 75deg 2m"
        min-camera-orbit="auto 0deg auto"
        max-camera-orbit="auto 360deg auto"
      ></model-viewer>
    </div>
  `;
    const model = page.querySelector("#deskModel");
    const loader = page.querySelector("#modelLoader");
    if (!model) return;

    model.style.setProperty("--progress-bar-height", "0px");
    model.style.setProperty("--poster-color", "transparent");

    if (loader) {
      model.addEventListener("load", () => {
        loader.style.opacity = "0";
        setTimeout(() => {
          loader.style.display = "none";
        }, 400);
      });

      model.addEventListener("error", () => {
        loader.innerHTML = `<img src="gif-load.gif" alt="error">`;
      });
    }
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
    cleanupViewerFrameSync();
    setViewerExpansionEnabled(false);
    collapseViewer(true);

    page.innerHTML = `
    <div style="padding:2rem;font-size:1rem;color:#7D7D7D;">
      Placeholder pagina centrale per:
      <br><br>
      <strong style="color:#4E4D4D;">${card.querySelector(".art-card__title")?.textContent || ""}</strong>
    </div>
  `;
  }

  async function loadWorkPage(path) {
    const page = getViewerPage();
    if (!page) return;

    deskModelVisible = false;
    cleanupViewerFrameSync();
    setViewerExpansionEnabled(false);
    collapseViewer(true);

    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error("Page not found");

      await res.text();
      page.innerHTML = `<iframe src="${path}" class="work-frame"></iframe>`;
      const frame = getViewerFrame();
      if (frame) {
        setViewerExpansionEnabled(true);
        attachFrameScrollSync(frame);
      }
    } catch (err) {
      page.innerHTML = `
      <div style="padding:2rem;font-size:1rem;color:#7D7D7D;">
        Unable to load this project page.
      </div>
    `;
    }
  }

  function buildGrid() {
    if (gridBuilt) return;
    const inner = ensureGrid();
    if (!inner) return;

    const list = sortList(Array.isArray(window.MYARTWORK) ? window.MYARTWORK : []);

    // Raggruppa per anno
    const groupedByYear = {};
    list.forEach((it) => {
      const yearKey = safe(it.year).trim() || "unknown";
      if (!groupedByYear[yearKey]) groupedByYear[yearKey] = [];
      groupedByYear[yearKey].push(it);
    });

    // Ordina anni: "in progress" prima, poi dal più recente al più vecchio
    const orderedYears = Object.keys(groupedByYear).sort((a, b) => {
      const aa = a.toLowerCase();
      const bb = b.toLowerCase();

      if (aa === "in progress") return -1;
      if (bb === "in progress") return 1;

      return Number(b) - Number(a);
    });

    inner.innerHTML = orderedYears.map((year) => {
      const cardsHtml = groupedByYear[year].map((it) => {
        const href = safe(it.url || it.href).trim();
        const target = it.external ? "_blank" : "_self";
        const hack = safe(it.hack).trim().toLowerCase() === "si";
        const sections = getSections(it);
        const group = getGroup(it);

        return `
        <article
          class="art-card"
          data-id="${safe(it.id)}"
          data-page="${safe(it.page || "")}"
          data-tags="${sections.join(" ")}"
          data-group="${group}"
          data-year="${safe(it.year)}"
          ${href ? `data-href="${href}" data-target="${target}"` : ""}
        >
          <div class="art-card__hack">${hack ? `(<em>with</em> HACK)` : `<span class="art-card__hack--copyright">.</span>`}</div>
          <h3 class="art-card__title">${safe(it.title)}</h3>
          <div class="art-card__meta">
            <div class="art-card__descrizione">${safe(it.descrizione)}</div>
            <div class="art-card__esposizione">${safe(it.esposizione)}</div>
          </div>
        </article>
      `;
      }).join("");

      const yearHtml = year.toLowerCase() === "in progress"
        ? `ongoing`
        : year;

      return `
      <section class="art-year-row" data-year="${safe(year)}">
        <div class="art-year-label">${yearHtml}</div>
        <div class="art-year-cards">
          ${cardsHtml}
        </div>
      </section>
    `;
    }).join("");

    inner.addEventListener("click", async (e) => {
      const card = e.target.closest(".art-card");
      if (!card) return;

      const pagePath = card.dataset.page;

      if (pagePath) {
        await loadWorkPage(pagePath);
        return;
      }

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
      const tags = safe(card.dataset.tags).trim().toLowerCase().split(/\s+/).filter(Boolean);
      const show = type === "all" ? true : tags.includes(type);
      card.style.display = show ? "" : "none";

      // 🔥 FIX: nascondi gli anni vuoti
      const yearRows = document.querySelectorAll(".art-year-row");

      yearRows.forEach((row) => {
        const cards = row.querySelectorAll(".art-card");

        const hasVisible = [...cards].some((card) => {
          return card.style.display !== "none";
        });

        row.style.display = hasVisible ? "" : "none";
      });
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
      a.textContent = "All Work";
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
    bindViewerHotspots();
    setViewerExpansionEnabled(false);
    collapseViewer(true);

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
    cleanupViewerFrameSync();
    setViewerExpansionEnabled(false);
    collapseViewer(true);
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