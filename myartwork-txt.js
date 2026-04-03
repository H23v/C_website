// myartwork-txt.js
// Campi:
// id, title, year, aggiunta, descrizione, esposizione,
// hack: "si" | "no"
// posizione: numero (ordine interno nello stesso anno)
// section: "html" | "animation" | "graphics" | "vr"
// group: "artistic work" | "engagements"

window.MYARTWORK = [
    {
    id: "digipathoxina",
    title: "DIGIPATHOXINA",
    year: 2026,
    aggiunta: "-",
    descrizione: "Website",
    esposizione: "Coming soon.",
    hack: "si",
    posizione: 6,
    section: "html",
    group: "artistic work",
    url: "https://digipathoxina.it/",
    external: false
  },
  {
    id: "cloudy-land",
    title: "CLOUDY LAND",
    year: 2025,
    aggiunta: "-",
    descrizione: "Website",
    esposizione: "Coming soon.",
    hack: "no",
    posizione: 6,
    section: "html",
    group: "artistic work",
    url: "pointless-dynamics.html",
    external: false
  },
  {
    id: "free-buttons",
    title: "FREE_BUTTONS",
    year: 2025,
    aggiunta: "Abs.",
    descrizione: "Website",
    esposizione: "Sito web interattivo, progetto personale, sperimentazione di UI e micro-interazioni.",
    hack: "no",
    posizione: 5,
    section: "html",
    group: "artistic work",
    url: "free_buttons.html",
    external: false
  },
  {
    id: "pointless-dynamics",
    title: "POINTLESS DYNAMICS",
    year: 2025,
    aggiunta: "Exh.",
    descrizione: "Website",
    esposizione: "Sito web guida per la mostra Pointless Dynamics presso Accademia di Belle Arti di Brera (MI).",
    hack: "no",
    posizione: 4,
    section: "html",
    group: "engagements",
    url: "pointless-dynamics.html",
    external: false
  },
  {
    id: "cloudless-over-hydra",
    title: "CLOUDLESS OVER HYDRA",
    year: 2025,
    aggiunta: "Exh.",
    descrizione: "3D Animation, 1920x1080 HD.",
    esposizione: "Progetto prodotto durante il BIP Erasmus+ (Athens & Hydra).",
    hack: "si",
    posizione: 3,
    section: "animation",
    group: "artistic work"
  },
  {
    id: "losai",
    title: "LOSAI",
    year: 2024,
    aggiunta: "Exh.",
    descrizione: "Web Site and Multimedia Installation",
    esposizione: "Esposizione collettiva in collaborazione con l’Accademia di Belle Arti di Brera e Casa degli Artisti (MI).",
    hack: "si",
    posizione: 2,
    section: "html",
    group: "artistic work",
    url: "https://h23v.github.io/LoSai/",
    external: true
  },
  {
    id: "la-forma-del-resto",
    title: "LA FORMA DEL RESTO",
    year: 2024,
    aggiunta: "Exh.",
    descrizione: "Render 3D, dimensioni 3840x2160 px.",
    esposizione: "Mostra collettiva, installazione e ricerca sul rapporto tra oggetti e memoria digitale.",
    hack: "si",
    posizione: 1,
    section: "graphics",
    group: "artistic work"
  },
  {
    id: "ubiquity-a-b",
    title: "UBIQUITY-A+B",
    year: 2023,
    aggiunta: "Exh.",
    descrizione: "Metaverso su Spatial.io esposto su MetaQuest e Installazione Multimediale.",
    esposizione: "Installazione collettiva che unisce ambienti virtuali e presenza fisica in spazio espositivo.",
    hack: "si",
    posizione: 4,
    section: "vr",
    group: "artistic work"
  },
  {
    id: "im-possible-sculpture",
    title: "(IM)POSSIBLE SCULPTURE",
    year: 2023,
    aggiunta: "Exh.",
    descrizione: "Happening e Installazione Multimediale",
    esposizione: "Esperienza performativa e installativa in contesto collettivo.",
    hack: "si",
    posizione: 3,
    section: "graphics",
    group: "artistic work"
  },
  {
    id: "demote-limbo",
    title: "DEMOTE LIMBO",
    year: 2022,
    aggiunta: "Exh.",
    descrizione: "Stampe fotografiche su Dibond e Metaverso su Spatial.io esposto su Tablet.",
    esposizione: "Mostra collettiva in contesto accademico con sperimentazione su ibridazione fisico/digitale.",
    hack: "si",
    posizione: 2,
    section: "vr",
    group: "artistic work"
  },
  {
    id: "se-la-morte-avesse-i-tuoi-occhi",
    title: "SE LA MORTE AVESSE I TUOI OCCHI",
    year: 2022,
    aggiunta: "Exh.",
    descrizione: "Installazione a parete. Stampa su Dibond.",
    esposizione: "Esposizione collettiva con focus su linguaggi visivi e installazione.",
    hack: "si",
    posizione: 1,
    section: "graphics",
    group: "artistic work"
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