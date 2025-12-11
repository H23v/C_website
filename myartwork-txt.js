// myartwork-txt.js
// Modella i tuoi blocchi qui. Campi:
// id, title, year (numero), aggiunta, descrizione, esposizione,
// hack: "si" | "no", posizione (numero, ordering fra opere stesso anno),
// html: true|false (se è un'opera web -> visibile anche in sezione HTML)
window.MYARTWORK = [
    
  
    {
        id: "cloudy-land",
        title: "CLOUDY LAND ➜]",
        year: 2025,
        aggiunta: "Abs.",
        descrizione: "Website",
        esposizione: "Mostra collettiva The Sign of the Sing, presso l’Underground Theatre of the Athens School of Fine Arts (GR), a seguito di un progetto Erasmus+BIP.",
        hack: "no",
        posizione: 6,
        html: true
    },
    {
        id: "free-buttons",
        title: "FREE_BUTTONS",
        year: 2025,
        aggiunta: "Abs.",
        descrizione: "Website",
        esposizione: "Mostra collettiva The Sign of the Sing, presso l’Underground Theatre of the Athens School of Fine Arts (GR), a seguito di un progetto Erasmus+BIP.",
        hack: "no",
        posizione: 5,
        html: true
    },
        {
        id: "point-dynamics",
        title: "POINTLESS DYNAMICS",
        year: 2025,
        aggiunta: "Exh.",
        descrizione: "Website",
        esposizione: "Sito web come guida espositiva digitale per la mostra Pointless Dynamics, progetto indipendente realizzato negli spazi dell’Accademia di Belle Arti di Brera.",
        hack: "no",
        posizione: 4,
        html: true
    },
    {
        id: "hydra",
        title: "CLOUDLESS OVER HYDRA",
        year: 2025,
        aggiunta: "Exh.",
        descrizione: "Animazione 3D 1920x1080 px.",
        esposizione: "Mostra collettiva The Sign of the Sing, presso l’Underground Theatre of the Athens School of Fine Arts (GR), a seguito di un progetto Erasmus+BIP.",
        hack: "si",
        posizione: 3,
        html: false
    },
    {
        id: "losai",
        title: "LOSAI",
        year: 2025,
        aggiunta: "Exh.",
        descrizione: "Sito Web e Installazione Multimediale.",
        esposizione: "Mostra collettiva Pointless Dynamics, presso Accademia di Belle Arti di Brera (MI).",
        hack: "si",
        posizione: 3,
        html: true
    },
    {
        id: "la-forma-resto",
        title: "LA FORMA DEL RESTO",
        year: 2025,
        aggiunta: "Exh.",
        descrizione: "Render 3D, dimensioni 3840x2160 px.",
        esposizione: "Mostra collettiva itinerante Future Vibes, presso Accademia di Belle Arti di Catania (CT).",
        hack: "si",
        posizione: 2,
        html: false
    },
    {
        id: "ubiquity-a+b",
        title: "UBIQUITY-A+B",
        year: 2025,
        aggiunta: "Exh.",
        descrizione: "Metaverso su Spatial.io esposto su MetaQuest e Installazione Multimediale.",
        esposizione: "Mostra collettiva Lost Art Project by Puff Store, Con/Temporary Art Spaces - ArtàPorter (TO)",
        hack: "si",
        posizione: 1,
        html: false
    },
    {
        id: "impossible-sculpture",
        title: "(IM)POSSIBLE SCULPTURE",
        year: 2024,
        aggiunta: "Exh.",
        descrizione: "Happening e Installazione Multimediale",
        esposizione: "Happening in data 22 Dicembre 2024, evento “Sorgenti” presso Habitat Ottantatre (VR).",
        hack: "si",
        posizione: 3,
        html: false
    },
    {
        id: "demote-limbo",
        title: "DEMOTE LIMBO",
        year: 2024,
        aggiunta: "Exh.",
        descrizione: "Stampe fotografiche su Dibond e Metaverso su Spatial.io esposto su Tablet.",
        esposizione: "Personale Demote_Limbo, presso Habitat Ottantatre (VR)",
        hack: "si",
        posizione: 2,
        html: false
    },
    {
        id: "se-la-morte",
        title: "SE LA MORTE AVESSE I TUOI OCCHI",
        year: 2024,
        aggiunta: "Exh.",
        descrizione: "Installazione a parete. Stampa su Dibond.",
        esposizione: "Mostra collettiva Riconoscersi. Senza l’altro io non sono, Fondazione VIDAS, in collaborazionae con l’Accademia di Belle Arti di Brera e Casa degli Artisti (MI).",
        hack: "si",
        posizione: 1,
        html: false
    }
];

// Utility di ordinamento (anno ↓, poi posizione ↓)
window.sortMyArtwork = function sortMyArtwork(list) {
    return [...list].sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year; // anno decrescente
        const pa = a.posizione || 0, pb = b.posizione || 0;
        return pb - pa; // posizione decrescente (2 prima di 1)
    });
};