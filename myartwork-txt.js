// myartwork-txt.js
// Campi:
// id, title, year, aggiunta, descrizione, esposizione,
// hack: "si" | "no"
// posizione: numero (ordine interno nello stesso anno)
// section: "html" | "animation" | "graphics" | "vr"
// group: "artistic work" | "engagements"

window.MYARTWORK = [
  {
    id: "3d-image",
    title: "(dirty) Images",
    year: "in progress",
    aggiunta: "Prj.",
    descrizione: "Series",
    esposizione: "Rainy Day / Tiger Fish / Fish and Chips",
    hack: "no",
    posizione: 6,
    section: ["graphics", "animation"],
    group: "artistic work",
    page: "work/animation.html",
    external: false
  },
  {
    id: "vr-drawing",
    title: "VR DRAWING",
    year: "in progress",
    aggiunta: "Prj.",
    descrizione: "Series",
    esposizione: "Computer’s Bug / Gigante",
    hack: "no",
    posizione: 5,
    section: ["graphics", "vr"],
    group: "artistic work",
    page: "work/vrdrawing.html",
    external: false
  },
  {
    id: "exon",
    title: "EXON | Delusion of Equilibrium",
    year: 2025,
    aggiunta: "Abs.",
    descrizione: "Game Narrative Design & Promotional Visual",
    esposizione: "",
    hack: "no",
    posizione: 6,
    section: ["graphics"],
    group: "engagements",
    page: "work/exon.html",
    url: "exon.html",
    external: false
  },
  {
    id: "cloudy-land",
    title: "Cloudy Land",
    year: "in progress",
    aggiunta: "-",
    descrizione: "Concept website — evolving",
    esposizione: "",
    hack: "no",
    posizione: 5,
    section: ["html"],
    group: "artistic work",
    page: "work/cloudyland.html",
    external: true
  },
  {
    id: "metacorpalismo",
    title: "Metacorpalismo",
    year: 2025,
    aggiunta: "Abs.",
    descrizione: "Short film, animation 3D | <em>with</em> &lt;H&gt",
    esposizione: "",
    hack: "no",
    posizione: 4,
    section: ["animation"],
    group: "artistic work",
    page: "work/metacorpalismo.html",
    external: false
  },
  {
    id: "losai",
    title: "LoSai",
    year: 2025,
    aggiunta: "Abs.",
    descrizione: "Artistic Website | <em>with</em> &lt;H&gt",
    esposizione: "",
    hack: "no",
    posizione: 4,
    section: ["html"],
    group: "artistic work",
    page: "work/lo-sai.html",
    external: false
  },
  {
    id: "free-buttons",
    title: "Free_Buttons",
    year: 2024,
    aggiunta: "Abs.",
    descrizione: "Website, personal prj",
    esposizione: "",
    hack: "no",
    posizione: 4,
    section: ["html"],
    group: "artistic work",
    page: "work/freebuttons.html",
    external: false
  },
  {
    id: "pointless-dynamics",
    title: "Pointless Dynamics",
    year: 2025,
    aggiunta: "Exh.",
    descrizione: "Website, gallery sheet",
    esposizione: "",
    hack: "no",
    posizione: 3,
    section: ["html"],
    group: "engagements",
    page: "work/pointlessd.html",
    external: false
  },
  {
    id: "ubiquity-a-b",
    title: "Ubi(quit)y:A+B",
    year: 2025,
    aggiunta: "Exh.",
    descrizione: "Virtual Reality on Spatial.io | <em>with</em> &lt;H&gt ",
    esposizione: "",
    hack: "no",
    posizione: 2,
    section: ["vr"],
    group: "artistic work",
    page: "work/ubiquity.html",
    external: false
  },
  {
    id: "demote-limbo",
    title: "Demote_Limbo",
    year: 2024,
    aggiunta: "Exh.",
    descrizione: "Virtual Reality on Spatial.io | <em>with</em> &lt;H&gt",
    esposizione: "",
    hack: "no",
    posizione: 1,
    section: ["vr"],
    group: "artistic work",
    page: "work/demotelimbo.html",
    external: false
  },
  {
    id: "perturbante",
    title: "BackSpace",
    year: 2024,
    aggiunta: "Exh.",
    descrizione: "Virtual Reality on Spatial.io | <em>with</em> &lt;H&gt",
    esposizione: "",
    hack: "no",
    posizione: 0,
    section: ["vr"],
    group: "artistic work",
    page: "work/backspace.html",
    external: false
  }
];

// Ordine Anything:
// 1) artistic work
// 2) engagements
// poi anno desc
// poi posizione desc
window.sortMyArtwork = function sortMyArtwork(list) {
  const groupOrder = {
    "artistic work": 1,
    "engagements": 2
  };

  return [...list].sort((a, b) => {
    const ga = groupOrder[(a.group || "").toLowerCase()] ?? 999;
    const gb = groupOrder[(b.group || "").toLowerCase()] ?? 999;
    if (ga !== gb) return ga - gb;

    if (a.year !== b.year) return b.year - a.year;

    const pa = a.posizione || 0;
    const pb = b.posizione || 0;
    return pb - pa;
  });
};