/* =========================================================
   LAS QUINTILLIZAS — FAN SITE
   Vanilla JS: data + interactions
   Disclaimer: all names, quotes, synopses and lyrics below are
   ORIGINAL PLACEHOLDER CONTENT written for this prototype —
   not reproductions of any copyrighted material.
   ========================================================= */
(function () {
  "use strict";

  /* ---------------------------------------------------------
     DATA
  --------------------------------------------------------- */
  // Cada personaje carga sus imágenes desde img/personajes/<id>/
  // main.jpg = imagen principal, thumb1.jpg..thumb4.jpg = miniaturas.
  // Si un archivo no existe, se conserva el fondo de color como respaldo (no rompe el diseño).
  const CHAR_IMG_BASE = "img/personajes";

  const CHARACTERS = [
    {
      id: "ichika", name: "Ichika", kanji: "一", role: "La Actriz — hermana mayor",
      color: "var(--c-ichika)",
      personality: "Serena por fuera y siempre la primera en ofrecerse cuando algo sale mal. Ichika carga con una responsabilidad que nadie le pidió, y eso a veces la hace parecer más distante de lo que en realidad es.",
      backstory: "Como la mayor, creció asumiendo que cuidar de sus cuatro hermanas era su trabajo antes que su elección. Sueña con actuar, pero por ahora antepone el bienestar de la familia a sus propios planes.",
      relationships: "Es el punto de referencia para sus hermanas menores, aunque eso no siempre significa que la escuchen. Con Itsuki mantiene una complicidad silenciosa; con Nino, un choque constante de estilos.",
      quote: "Si alguien tiene que cargar con esto, prefiero que sea yo.",
      trivia: [
        "Aprendió a cocinar viendo programas de televisión a altas horas de la noche.",
        "Guarda una libreta con monólogos que nunca ha mostrado a nadie.",
        "Es la que menos duerme de las cinco, aunque lo disimula bien."
      ],
      va: { name: "Hana Serizawa", note: "voz de personaje (ficticio, contenido de demostración)" }
    },
    {
      id: "nino", name: "Nino", kanji: "二", role: "La Repostera — segunda hermana",
      color: "var(--c-nino)",
      personality: "Directa hasta el punto de sonar cortante, pero increíblemente leal en el momento en que de verdad importa. Nino esconde su cariño detrás de un sarcasmo bien afilado.",
      backstory: "Pasa más tiempo perfeccionando recetas que abriendo un libro de texto. Sueña con tener su propia pastelería algún día, aunque nunca lo diría en voz alta sin quejarse primero.",
      relationships: "Es quien más rápido se pone a la defensiva por sus hermanas, incluso cuando finge que no le importan. Su relación con Ichika suele chispear por diferencias de carácter.",
      quote: "No es que me importe... es solo que alguien tiene que vigilarte.",
      trivia: [
        "Memoriza recetas enteras antes que fórmulas de examen.",
        "Guarda en secreto los postres que le salen mal para compartirlos con sus hermanas.",
        "Tiene una lista mental de a quién no perdona todavía."
      ],
      va: { name: "Rin Kadowaki", note: "voz de personaje (ficticio, contenido de demostración)" }
    },
    {
      id: "miku", name: "Miku", kanji: "三", role: "La Otaku Histórica — hermana del medio",
      color: "var(--c-miku)",
      personality: "Callada y observadora, se le dan mejor los gestos que las palabras. Cuando algo le apasiona —sobre todo la historia— es capaz de hablar horas sin darse cuenta.",
      backstory: "Prefiere perderse en estrategias de videojuegos y libros de historia antes que enfrentarse a una conversación incómoda. Detrás de su timidez hay una determinación silenciosa.",
      relationships: "Es la mediadora invisible del grupo: rara vez discute, pero siempre nota cuándo alguna de sus hermanas necesita espacio o compañía.",
      quote: "Prefiero decir las cosas... aunque sea con las manos temblando.",
      trivia: [
        "Clasifica a personajes históricos como si fueran cartas coleccionables.",
        "Tiene un estante entero solo de guías de estrategia.",
        "Se sonroja cada vez que tiene que hablar en público."
      ],
      va: { name: "Yui Amamori", note: "voz de personaje (ficticio, contenido de demostración)" }
    },
    {
      id: "yotsuba", name: "Yotsuba", kanji: "四", role: "La Atleta — cuarta hermana",
      color: "var(--c-yotsuba)",
      personality: "Pura energía. Es un desastre con los exámenes, pero la primera en animar a cualquiera que esté teniendo un mal día. No sabe estarse quieta ni cinco minutos.",
      backstory: "Ha probado más clubes deportivos de los que puede recordar y trabaja en turnos parciales para ayudar en casa, aunque eso le reste horas de estudio.",
      relationships: "Es el motor emocional del grupo: cuando alguna hermana se hunde, Yotsuba aparece con una energía imposible de ignorar.",
      quote: "¡Si me caigo, me levanto corriendo!",
      trivia: [
        "Ha entrado y salido de once clubes deportivos distintos.",
        "No logra sentarse quieta durante un examen completo.",
        "Es la que más rápido se queda dormida... en cualquier lugar."
      ],
      va: { name: "Kaede Morimura", note: "voz de personaje (ficticio, contenido de demostración)" }
    },
    {
      id: "itsuki", name: "Itsuki", kanji: "五", role: "La Erudita Silenciosa — la menor",
      color: "var(--c-itsuki)",
      personality: "Madura más allá de su edad, aunque eso también significa que guarda sus propias preocupaciones para no sumarle peso a nadie más.",
      backstory: "Es la mejor estudiante de las cinco, pero esa etiqueta esconde una carga silenciosa sobre el futuro de la familia que casi nunca comparte en voz alta.",
      relationships: "Escucha más de lo que habla, y suele ser la primera en notar cuando algo no anda bien con sus hermanas, aunque no siempre sepa cómo decirlo.",
      quote: "Está bien no saber todas las respuestas todavía.",
      trivia: [
        "Anota los cumpleaños de todos con un año de anticipación.",
        "Es la única de las cinco que lee manuales de instrucciones por gusto.",
        "Prepara té para toda la casa sin que nadie se lo pida."
      ],
      va: { name: "Sora Igarashi", note: "voz de personaje (ficticio, contenido de demostración)" }
    }
  ];

  // Estructura sincronizada con la carpeta local:
  // videos/T1, videos/T2, videos/OVAS, videos/Pelicula
  // Cada episodio espera dos archivos: cap{N}_jp.mp4 y cap{N}_lat.mp4 (T1/T2),
  // ova{N}_jp.mp4 / ova{N}_lat.mp4 (OVAS), y pelicula_jp.mp4 / pelicula_lat.mp4 (Película).
  const SEASONS = {
    T1: {
      label: "Temporada 1", folder: "T1", filePrefix: "cap",
      episodes: [
        { ep: 1, title: "Cinco escritorios, un examen", syn: "Un tutor recién contratado descubre que motivar a una quintilliza a la vez es imposible cuando las otras cuatro interrumpen." },
        { ep: 2, title: "Reglas de la casa", syn: "Entre horarios cruzados y una casa ruidosa, el tutor intenta poner orden antes del primer simulacro de examen." },
        { ep: 3, title: "La receta equivocada", syn: "Un intento de acercarse a través de la cocina termina en un desastre que, sorprendentemente, ayuda a romper el hielo." },
        { ep: 4, title: "El club que no era", syn: "Una excursión escolar obliga a las hermanas a colaborar en equipo por primera vez en mucho tiempo." },
        { ep: 5, title: "Notas bajo la manga", syn: "Los primeros resultados de un examen de práctica sacan a la luz viejas inseguridades entre las hermanas." },
        { ep: 6, title: "Cinco maneras de decir 'gracias'", syn: "Cada hermana encuentra, a su manera, un pequeño gesto de agradecimiento hacia su tutor." },
        { ep: 7, title: "Examen de mitad de año", syn: "La presión de las calificaciones saca lo mejor y lo peor de cada una de las cinco hermanas." },
        { ep: 8, title: "El diario compartido", syn: "Un cuaderno olvidado en la sala termina revelando pensamientos que nadie pensaba compartir." },
        { ep: 9, title: "Un secreto a voces", syn: "Todas sospechan que algo ha cambiado entre el tutor y una de las hermanas, pero nadie lo dice en voz alta." },
        { ep: 10, title: "La foto que nadie mencionó", syn: "Una fotografía antigua reabre preguntas sobre el pasado de la familia que prefieren no discutir." },
        { ep: 11, title: "Cuando el tutor casi renuncia", syn: "Un malentendido pone en riesgo la continuidad de las clases, y las cinco deben decidir qué tan importante se ha vuelto." },
        { ep: 12, title: "Cinco promesas para el verano", syn: "El cierre de la primera temporada deja a cada hermana con una promesa distinta que cumplir." }
      ]
    },
    T2: {
      label: "Temporada 2", folder: "T2", filePrefix: "cap",
      episodes: [
        { ep: 1, title: "Un verano de repaso", syn: "Las vacaciones deberían servir para estudiar, pero los planes de las cinco tienen otras ideas." },
        { ep: 2, title: "El festival del distrito", syn: "Un festival local se convierte en la excusa perfecta para revelar rivalidades y complicidades nuevas." },
        { ep: 3, title: "Cartas sin enviar", syn: "Una de las hermanas escribe una carta que nunca planea entregar, hasta que las circunstancias la obligan a reconsiderarlo." },
        { ep: 4, title: "El simulacro decisivo", syn: "La presión de un examen importante pone a prueba cuánto ha cambiado realmente la dinámica familiar." },
        { ep: 5, title: "Cinco caminos", syn: "Cada hermana empieza a imaginar un futuro distinto, y no todos apuntan en la misma dirección." },
        { ep: 6, title: "El hilo que las une", syn: "Un cierre agridulce de mitad de temporada recuerda que, pase lo que pase, siguen siendo cinco partes de un mismo lazo." },
        { ep: 7, title: "Regreso a clases", syn: "El nuevo semestre trae compañeros, presiones y comparaciones que ninguna de las cinco esperaba." },
        { ep: 8, title: "La rivalidad que no esperaban", syn: "Una competencia escolar pone a dos de las hermanas en bandos opuestos por primera vez." },
        { ep: 9, title: "Un viaje inesperado", syn: "Un imprevisto familiar obliga a todos a salir de la rutina y a verse bajo una luz distinta." },
        { ep: 10, title: "La verdad a medias", syn: "Algunas respuestas que llevaban tiempo evitando finalmente salen a la superficie." },
        { ep: 11, title: "El examen final", syn: "Todo lo aprendido —y lo no aprendido— se pone a prueba en un último examen decisivo." },
        { ep: 12, title: "Cinco quintillizas, una despedida", syn: "El cierre de temporada reúne a las cinco hermanas para una despedida agridulce que promete no ser la última." }
      ]
    },
    OVAS: {
      label: "OVAs", folder: "OVAS", filePrefix: "ova",
      episodes: [
        { ep: 1, title: "Un día sin agenda", syn: "Las hermanas intentan pasar un día entero sin hablar de estudios, con resultados poco previsibles." },
        { ep: 2, title: "El álbum olvidado", syn: "Un álbum de fotos familiar despierta anécdotas que cada hermana recuerda de forma distinta." },
        { ep: 3, title: "Nieve inesperada", syn: "Una nevada fuera de temporada deja a todos atrapados en casa durante una tarde entera." },
        { ep: 4, title: "Antes del examen final", syn: "Una mirada íntima a los nervios de cada hermana la noche antes de un examen decisivo." }
      ]
    },
    PELICULA: {
      label: "Película", folder: "Pelicula", filePrefix: "pelicula", isMovie: true,
      episodes: [
        { ep: 1, title: "El hilo hacia el futuro", syn: "Años después de los eventos de la serie, un reencuentro obliga a las cinco hermanas —y a su antiguo tutor— a enfrentar preguntas que dejaron pendientes." }
      ]
    }
  };
  const SEASON_ORDER = ["T1", "T2", "OVAS", "PELICULA"];

  function videoPathFor(seasonKey, ep, lang) {
    const s = SEASONS[seasonKey];
    const base = s.isMovie ? s.filePrefix : `${s.filePrefix}${ep.ep}`;
    return `videos/${s.folder}/${base}_${lang}.mp4`;
  }


  // Carpeta de imágenes reales de la galería. Para agregar una imagen nueva,
  // solo añade un objeto más a este arreglo con su archivo dentro de img/galeria/.
  const GALLERY_IMG_BASE = "img/galeria";
  const GALLERY = [
    { cat: "screenshot", title: "Cena ruidosa", grad: ["#D6334A", "#F0A500"], file: "cena-ruidosa.jpg" },
    { cat: "screenshot", title: "Repaso nocturno", grad: ["#1F9DA6", "#57B85A"], file: "repaso-nocturno.jpg" },
    { cat: "screenshot", title: "Camino a la escuela", grad: ["#B27FE0", "#D6334A"], file: "camino-escuela.jpg" },
    { cat: "poster", title: "Póster — Temporada 1", grad: ["#F0A500", "#1F9DA6"], file: "poster-t1.jpg" },
    { cat: "poster", title: "Póster — Temporada 2", grad: ["#57B85A", "#B27FE0"], file: "poster-t2.jpg" },
    { cat: "poster", title: "Key visual — Verano", grad: ["#D6334A", "#B27FE0"], file: "key-visual-verano.jpg" },
    { cat: "concept", title: "Boceto — uniforme escolar", grad: ["#F0A500", "#57B85A"], file: "boceto-uniforme.jpg" },
    { cat: "concept", title: "Boceto — habitación compartida", grad: ["#1F9DA6", "#D6334A"], file: "boceto-habitacion.jpg" },
    { cat: "concept", title: "Detrás de cámaras — storyboard", grad: ["#B27FE0", "#F0A500"], file: "storyboard.jpg" },
    { cat: "screenshot", title: "Festival del distrito", grad: ["#57B85A", "#D6334A"], file: "festival-distrito.jpg" },
    { cat: "poster", title: "Wallpaper — cinco hilos", grad: ["#D6334A", "#1F9DA6"], file: "wallpaper-cinco-hilos.jpg" },
    { cat: "concept", title: "Paleta de color oficial", grad: ["#F0A500", "#B27FE0"], file: "paleta-color.jpg" }
  ];

  // Pistas oficiales, enlazadas a través del reproductor embebido de Spotify.
  // spotifyId corresponde al ID real de la pista en open.spotify.com/track/{id}.
  const TRACKS = [
    { id: "op1", name: "五等分の気持ち (TV Edit)", kind: "Opening — Temporada 1", color: "var(--c-ichika)", spotifyId: "6q8uHODW1mLnmfOiIbzF2k" },
    { id: "ed1", name: "Sign (TV Edit)", kind: "Ending — Temporada 1 · Aya Uchida", color: "var(--c-itsuki)", spotifyId: "4WILxtN9mkHsczS2v1KafQ" },
    { id: "op2", name: "五等分のカタチ (TV Size)", kind: "Opening — Temporada 2", color: "var(--c-nino)", spotifyId: "76tc8uKjRT8V7vcq1V9DVq" },
    { id: "ed2", name: "はつこい (TV Size)", kind: "Ending — Temporada 2", color: "var(--c-miku)", spotifyId: "7AtEplE5FekULNWSnOohr2" },
    { id: "img-ichika", name: "Hello, dear my dream〜一秒後には〜", kind: "Character song — Ichika (CV: Kana Hanazawa)", color: "var(--c-ichika)", spotifyId: "5N4AR7PVzuWqfkn9hf7dby" },
    { id: "img-nino", name: "アイツとキミ〜二度とない運命〜", kind: "Character song — Nino (CV: Ayana Taketatsu)", color: "var(--c-nino)", spotifyId: "0vAYoHRJdqWgkYopKgPrfb" },
    { id: "img-miku", name: "Lovely music〜三週間前までは白かった〜", kind: "Character song — Miku (CV: Miku Ito)", color: "var(--c-miku)", spotifyId: "4qfOkZAA93DYXVtoX3HvQq" },
    { id: "img-yotsuba", name: "ハートのカタチ〜四つ葉のClover〜", kind: "Character song — Yotsuba (CV: Ayane Sakura)", color: "var(--c-yotsuba)", spotifyId: "10J5KGwRDHG2lzc0oHaO2e" },
    { id: "img-itsuki", name: "素直にOpen heart〜五つ数えて〜", kind: "Character song — Itsuki (CV: Inori Minase)", color: "var(--c-itsuki)", spotifyId: "54Hi7PjFXgzKUdEyX2lydK" },
    { id: "bgm", name: "五等分の花嫁 (Theme)", kind: "Banda sonora original", color: "var(--c-ink-soft)", spotifyId: "19E614FaNGBXrQ1EuEmB8m" }
  ];

  /* ---------------------------------------------------------
     HELPERS
  --------------------------------------------------------- */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const fmtTime = (s) => {
    s = Math.max(0, Math.floor(s));
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  /* ---------------------------------------------------------
     HEADER: mobile menu + active link + scrollspy
  --------------------------------------------------------- */
  const menuToggle = $("#menuToggle");
  const mainNav = $("#mainNav");
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("nav-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
  $$(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("nav-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  const sections = $$("main > section[id]");
  const navLinks = $$(".nav-link");
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((l) => l.classList.toggle("active-link", l.getAttribute("href") === `#${id}`));
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => spy.observe(s));

  /* ---------------------------------------------------------
     SCROLL REVEAL
  --------------------------------------------------------- */
  $$(".section").forEach((s) => s.classList.add("reveal"));
  const revealObserver = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("is-visible")),
    { threshold: 0.12 }
  );
  $$(".reveal").forEach((el) => revealObserver.observe(el));

  /* ---------------------------------------------------------
     CHARACTERS
  --------------------------------------------------------- */
  const charTabsEl = $("#charTabs");
  const charPanelEl = $("#charPanel");
  let activeCharId = CHARACTERS[0].id;

  function renderCharTabs() {
    charTabsEl.innerHTML = CHARACTERS.map((c) => `
      <button class="char-tab" role="tab" data-id="${c.id}" style="--tab-color:${c.color}" aria-selected="${c.id === activeCharId}">
        <span class="dot" style="background:${c.color}"></span>${c.name}
      </button>
    `).join("");
    $$(".char-tab", charTabsEl).forEach((btn) => {
      btn.addEventListener("click", () => {
        activeCharId = btn.dataset.id;
        renderCharTabs();
        renderCharPanel();
      });
    });
  }

  const DETAIL_TABS = [
    { key: "personality", label: "Personalidad" },
    { key: "backstory", label: "Historia" },
    { key: "relationships", label: "Relaciones" },
    { key: "quotes", label: "Frases" },
    { key: "trivia", label: "Curiosidades" }
  ];

  function renderCharPanel() {
    const c = CHARACTERS.find((x) => x.id === activeCharId);
    charPanelEl.style.setProperty("--char-color", c.color);
    charPanelEl.innerHTML = `
      <div class="char-portrait-block">
        <div class="char-portrait" style="--char-color:${c.color}">
          <img class="char-img" src="${CHAR_IMG_BASE}/${c.id}/main.jpg" alt="${c.name}"
               onerror="this.classList.add('is-hidden')"
               onload="this.closest('.char-portrait').classList.add('has-photo')">
          <div class="glow"></div>
          <span class="kanji">${c.kanji}</span>
        </div>
        <div class="char-mini-gallery" aria-label="Mini galería de ${c.name}">
          ${[1, 2, 3, 4].map((n) => `
            <button class="mini-thumb" style="--char-color:${c.color}" data-cap="${c.name} — look ${n}" data-img="${CHAR_IMG_BASE}/${c.id}/thumb${n}.jpg">
              <img class="thumb-img" src="${CHAR_IMG_BASE}/${c.id}/thumb${n}.jpg" alt="${c.name} — miniatura ${n}"
                   onerror="this.classList.add('is-hidden')">
              <span>0${n}</span>
            </button>
          `).join("")}
        </div>
      </div>
      <div class="char-info">
        <h3>${c.name}</h3>
        <p class="char-subtitle">${c.role}</p>
        <div class="char-detail-tabs" role="tablist">
          ${DETAIL_TABS.map((t, i) => `<button class="char-detail-tab" data-key="${t.key}" aria-selected="${i === 0}">${t.label}</button>`).join("")}
        </div>
        <div class="char-detail-panel active" data-panel="personality"><p>${c.personality}</p></div>
        <div class="char-detail-panel" data-panel="backstory"><p>${c.backstory}</p></div>
        <div class="char-detail-panel" data-panel="relationships"><p>${c.relationships}</p></div>
        <div class="char-detail-panel" data-panel="quotes"><blockquote class="quote-block">&ldquo;${c.quote}&rdquo;</blockquote></div>
        <div class="char-detail-panel" data-panel="trivia">
          <ul class="trivia-list">${c.trivia.map((t) => `<li>${t}</li>`).join("")}</ul>
          <div class="va-card">
            <div class="va-avatar">${c.name[0]}</div>
            <div class="va-meta"><strong>${c.va.name}</strong>${c.va.note}</div>
          </div>
        </div>
      </div>
    `;

    $$(".char-detail-tab", charPanelEl).forEach((tab) => {
      tab.addEventListener("click", () => {
        $$(".char-detail-tab", charPanelEl).forEach((t) => t.setAttribute("aria-selected", "false"));
        $$(".char-detail-panel", charPanelEl).forEach((p) => p.classList.remove("active"));
        tab.setAttribute("aria-selected", "true");
        $(`.char-detail-panel[data-panel="${tab.dataset.key}"]`, charPanelEl).classList.add("active");
      });
    });

    $$(".mini-thumb", charPanelEl).forEach((thumb, i) => {
      const charImages = [
        { src: `${CHAR_IMG_BASE}/${c.id}/main.jpg`, caption: c.name, color: c.color },
        { src: `${CHAR_IMG_BASE}/${c.id}/thumb1.jpg`, caption: `${c.name} — look 1`, color: c.color },
        { src: `${CHAR_IMG_BASE}/${c.id}/thumb2.jpg`, caption: `${c.name} — look 2`, color: c.color },
        { src: `${CHAR_IMG_BASE}/${c.id}/thumb3.jpg`, caption: `${c.name} — look 3`, color: c.color },
        { src: `${CHAR_IMG_BASE}/${c.id}/thumb4.jpg`, caption: `${c.name} — look 4`, color: c.color }
      ];
      thumb.addEventListener("click", () => openLightbox(thumb.dataset.cap, c.color, thumb.dataset.img, charImages, i + 1));
    });
  }

  renderCharTabs();
  renderCharPanel();

  /* ---------------------------------------------------------
     EPISODE PLAYER
  --------------------------------------------------------- */
  const seasonTabsEl = $("#seasonTabs");
  const episodeListEl = $("#episodeList");
  const nowPlayingTitle = $("#nowPlayingTitle");
  const videoBadge = $("#videoBadge");
  const synopsisText = $("#synopsisText");
  const watchNextCard = $("#watchNextCard");
  const watchNextSection = $("#watchNext");
  const playBtn = $("#playBtn");
  const playIcon = $("#playIcon");
  const pauseIcon = $("#pauseIcon");
  const progressTrack = $("#progressTrack");
  const progressFill = $("#progressFill");
  const progressThumb = $("#progressThumb");
  const timeCurrent = $("#timeCurrent");
  const timeTotal = $("#timeTotal");
  const muteBtn = $("#muteBtn");
  const volumeSlider = $("#volumeSlider");
  const fullscreenBtn = $("#fullscreenBtn");
  const videoStage = $("#videoStage");
  const videoEl = $("#videoEl");
  const videoPlaceholder = $("#videoPlaceholder");
  const langToggle = $("#langToggle");
  const prevEpBtn = $("#prevEpBtn");
  const nextEpBtn = $("#nextEpBtn");

  /* ---------------------------------------------------------
     PERSISTENCIA — LocalStorage
  --------------------------------------------------------- */
  const STORAGE_KEY = "quintillizas_player_state";

  function loadSavedState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (data && SEASONS[data.season] && (data.lang === "jp" || data.lang === "lat")) {
        return data;
      }
    } catch (e) {
      // LocalStorage no disponible o dato corrupto: se ignora y se usan valores por defecto.
    }
    return null;
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        season: activeSeason,
        episodeIndex: activeEpIndex,
        lang: activeLang
      }));
    } catch (e) {
      // Si el almacenamiento falla (modo privado, cuota llena, etc.) el reproductor sigue funcionando igual.
    }
  }

  const saved = loadSavedState();
  let activeSeason = saved ? saved.season : "T1";
  let activeLang = saved ? saved.lang : "jp";
  let activeEpIndex = (saved && SEASONS[activeSeason].episodes[saved.episodeIndex]) ? saved.episodeIndex : 0;

  function renderSeasonTabs() {
    seasonTabsEl.innerHTML = SEASON_ORDER.map((key) => `
      <button class="season-tab" role="tab" data-season="${key}" aria-selected="${key === activeSeason}">${SEASONS[key].label}</button>
    `).join("");
    $$(".season-tab", seasonTabsEl).forEach((btn) => {
      btn.addEventListener("click", () => {
        activeSeason = btn.dataset.season;
        activeEpIndex = 0;
        renderSeasonTabs();
        renderEpisodeList();
        loadEpisode(0);
      });
    });
  }

  function renderLangToggle() {
    langToggle.innerHTML = `
      <button type="button" class="lang-btn" data-lang="jp" role="tab" aria-selected="${activeLang === "jp"}">Japonés</button>
      <button type="button" class="lang-btn" data-lang="lat" role="tab" aria-selected="${activeLang === "lat"}">Latino</button>
    `;
    $$(".lang-btn", langToggle).forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.dataset.lang === activeLang) return;
        activeLang = btn.dataset.lang;
        renderLangToggle();
        saveState();
        loadSource(false);
      });
    });
  }

  function renderEpisodeList() {
    const eps = SEASONS[activeSeason].episodes;
    episodeListEl.innerHTML = eps.map((e, i) => `
      <li class="episode-item ${i === activeEpIndex ? "is-active" : ""}" data-index="${i}">
        <span class="ep-num">${String(e.ep).padStart(2, "0")}</span>
        <span class="ep-titles">
          <span class="ep-title">${e.title}</span>
          <span class="ep-syn">${e.syn}</span>
        </span>
      </li>
    `).join("");
    $$(".episode-item", episodeListEl).forEach((li) => {
      li.addEventListener("click", () => loadEpisode(Number(li.dataset.index)));
    });
  }

  function labelFor(seasonKey, ep) {
    const s = SEASONS[seasonKey];
    if (s.isMovie) return "Película";
    if (seasonKey === "OVAS") return `OVA ${ep.ep}`;
    return `${s.label} · E${String(ep.ep).padStart(2, "0")}`;
  }

  function loadEpisode(index, autoplay = true) {
    activeEpIndex = index;
    const s = SEASONS[activeSeason];
    const ep = s.episodes[index];

    nowPlayingTitle.textContent = `${labelFor(activeSeason, ep)} — ${ep.title}`;
    videoBadge.textContent = s.isMovie ? "PELÍCULA" : (activeSeason === "OVAS" ? `OVA ${ep.ep}` : `EP. ${ep.ep}`);
    synopsisText.textContent = ep.syn;
    renderEpisodeList();
    renderWatchNext();
    saveState();
    loadSource(true, autoplay);
  }

  function loadSource(resetTime, autoplay = true) {
    const s = SEASONS[activeSeason];
    const ep = s.episodes[activeEpIndex];
    const wasPlaying = !videoEl.paused && !videoEl.ended;
    const time = resetTime ? 0 : videoEl.currentTime;
    const path = videoPathFor(activeSeason, ep, activeLang);

    videoPlaceholder.classList.remove("is-error");
    videoEl.classList.add("is-hidden");
    videoPlaceholder.style.display = "flex";
    videoPlaceholder.querySelector("p").textContent = `Cargando ${path} …`;

    videoEl.src = path;
    videoEl.currentTime = time;
    videoEl.load();
    if (autoplay && (wasPlaying || resetTime)) {
      videoEl.play().catch(() => {
        // Autoplay bloqueado o archivo aún no confirmado — el usuario puede darle play manualmente.
      });
    } else {
      videoEl.pause();
      setPlayIcon(false);
    }
  }

  // El video no existe o no pudo cargarse: se muestra un mensaje claro
  // sin romper el resto del reproductor (temporada, capítulo e idioma siguen funcionando).
  videoEl.addEventListener("error", () => {
    videoEl.classList.add("is-hidden");
    videoPlaceholder.style.display = "flex";
    videoPlaceholder.classList.add("is-error");
    videoPlaceholder.querySelector("p").textContent =
      `No se encontró el video (${videoEl.src.split("/").pop()}). Verifica que el archivo exista en la carpeta /videos.`;
    setPlayIcon(false);
  });
  videoEl.addEventListener("loadeddata", () => {
    videoPlaceholder.classList.remove("is-error");
    videoPlaceholder.style.display = "none";
    videoEl.classList.remove("is-hidden");
  });

  function renderWatchNext() {
    const eps = SEASONS[activeSeason].episodes;
    if (eps.length <= 1) {
      watchNextSection.style.display = "none";
      return;
    }
    watchNextSection.style.display = "";
    const nextIndex = (activeEpIndex + 1) % eps.length;
    const nextEp = eps[nextIndex];
    watchNextCard.innerHTML = `
      <div class="wn-thumb"></div>
      <div>
        <span class="ep-title">${labelFor(activeSeason, nextEp)} — ${nextEp.title}</span>
        <span class="ep-syn">${nextEp.syn}</span>
      </div>
    `;
    watchNextCard.onclick = () => loadEpisode(nextIndex);
  }

  prevEpBtn.addEventListener("click", () => {
    const eps = SEASONS[activeSeason].episodes;
    const prevIndex = (activeEpIndex - 1 + eps.length) % eps.length;
    loadEpisode(prevIndex);
  });
  nextEpBtn.addEventListener("click", () => {
    const eps = SEASONS[activeSeason].episodes;
    const nextIndex = (activeEpIndex + 1) % eps.length;
    loadEpisode(nextIndex);
  });

  function updateProgressUI() {
    const dur = videoEl.duration || 0;
    const pct = dur ? Math.min(100, (videoEl.currentTime / dur) * 100) : 0;
    progressFill.style.width = pct + "%";
    progressThumb.style.left = pct + "%";
    progressTrack.setAttribute("aria-valuenow", Math.round(pct));
    timeCurrent.textContent = fmtTime(videoEl.currentTime);
    timeTotal.textContent = dur ? fmtTime(dur) : "--:--";
  }

  function setPlayIcon(isPlaying) {
    playIcon.style.display = isPlaying ? "none" : "block";
    pauseIcon.style.display = isPlaying ? "block" : "none";
  }

  playBtn.addEventListener("click", () => {
    if (videoEl.paused) {
      videoEl.play().catch(() => {});
    } else {
      videoEl.pause();
    }
  });
  videoEl.addEventListener("play", () => setPlayIcon(true));
  videoEl.addEventListener("pause", () => setPlayIcon(false));
  videoEl.addEventListener("ended", () => setPlayIcon(false));
  videoEl.addEventListener("timeupdate", updateProgressUI);
  videoEl.addEventListener("loadedmetadata", updateProgressUI);

  progressTrack.addEventListener("click", (e) => {
    if (!videoEl.duration) return;
    const rect = progressTrack.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    videoEl.currentTime = ratio * videoEl.duration;
  });

  muteBtn.addEventListener("click", () => {
    videoEl.muted = !videoEl.muted;
    muteBtn.style.opacity = videoEl.muted ? "0.4" : "1";
  });
  volumeSlider.addEventListener("input", () => {
    videoEl.volume = Number(volumeSlider.value) / 100;
    if (videoEl.volume === 0) { videoEl.muted = true; muteBtn.style.opacity = "0.4"; }
    else if (videoEl.muted) { videoEl.muted = false; muteBtn.style.opacity = "1"; }
  });
  fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      videoStage.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.();
    }
  });

  videoEl.volume = Number(volumeSlider.value) / 100;
  renderSeasonTabs();
  renderLangToggle();
  renderEpisodeList();
  loadEpisode(activeEpIndex, false);

  /* ---------------------------------------------------------
     GALLERY
  --------------------------------------------------------- */
  const galleryGrid = $("#galleryGrid");
  const galleryFilters = $("#galleryFilters");

  function renderGallery() {
    galleryGrid.innerHTML = GALLERY.map((item, i) => `
      <button class="gallery-item" data-cat="${item.cat}" style="background:linear-gradient(140deg, ${item.grad[0]}, ${item.grad[1]})" data-title="${item.title}" data-color="${item.grad[0]}" data-img="${GALLERY_IMG_BASE}/${item.file}">
        <img class="gallery-img" src="${GALLERY_IMG_BASE}/${item.file}" alt="${item.title}" loading="lazy" onerror="this.classList.add('is-hidden')">
        <span class="g-tag">${item.cat === "screenshot" ? "Captura" : item.cat === "poster" ? "Póster" : "Concepto"}</span>
      </button>
    `).join("");
    $$(".gallery-item", galleryGrid).forEach((btn) => {
      btn.addEventListener("click", () => {
        // Solo se recorren las imágenes actualmente visibles según el filtro activo.
        const visibleItems = $$(".gallery-item", galleryGrid).filter((item) => !item.classList.contains("hide"));
        const galleryImages = visibleItems.map((item) => ({
          src: item.dataset.img,
          caption: item.dataset.title,
          color: item.dataset.color
        }));
        const startIndex = visibleItems.indexOf(btn);
        openLightbox(btn.dataset.title, btn.dataset.color, btn.dataset.img, galleryImages, startIndex);
      });
    });
  }
  renderGallery();

  $$(".filter-chip", galleryFilters).forEach((chip) => {
    chip.addEventListener("click", () => {
      $$(".filter-chip", galleryFilters).forEach((c) => c.classList.remove("active-chip"));
      chip.classList.add("active-chip");
      const filter = chip.dataset.filter;
      $$(".gallery-item", galleryGrid).forEach((item) => {
        item.classList.toggle("hide", filter !== "all" && item.dataset.cat !== filter);
      });
    });
  });

  /* ---------------------------------------------------------
     LIGHTBOX
  --------------------------------------------------------- */
  const lightbox = $("#lightbox");
  const lightboxContent = $("#lightboxContent");
  const lightboxClose = $("#lightboxClose");
  const lightboxPrev = $("#lightboxPrev");
  const lightboxNext = $("#lightboxNext");

  let lightboxImages = null;
  let lightboxIndex = 0;

  function renderLightboxImage(caption, color, imgSrc) {
    lightboxContent.style.background = `linear-gradient(150deg, ${color || "#D6334A"}, #241d30)`;
    const fallback = `<div style="display:flex;align-items:flex-end;height:100%;padding:1.4rem;color:#fff;font-weight:700;">${caption}</div>`;
    if (imgSrc) {
      lightboxContent.innerHTML = `
        <img class="lightbox-img" src="${imgSrc}" alt="${caption}"
             onerror="this.closest('.lightbox-content').innerHTML = ${JSON.stringify(fallback)}">
      `;
    } else {
      lightboxContent.innerHTML = fallback;
    }
  }

  // imagesList (opcional) permite recorrer varias imágenes sin cerrar el visor (usado en Personajes).
  // La Galería sigue llamando esta función sin ese parámetro, por lo que su comportamiento no cambia.
  function openLightbox(caption, color, imgSrc, imagesList, startIndex) {
    lightboxImages = Array.isArray(imagesList) && imagesList.length ? imagesList : null;
    lightboxIndex = typeof startIndex === "number" ? startIndex : 0;
    renderLightboxImage(caption, color, imgSrc);

    const showNav = !!(lightboxImages && lightboxImages.length > 1);
    lightboxPrev.classList.toggle("is-hidden", !showNav);
    lightboxNext.classList.toggle("is-hidden", !showNav);

    lightbox.hidden = false;
  }

  function showLightboxAt(index) {
    if (!lightboxImages) return;
    const total = lightboxImages.length;
    lightboxIndex = (index + total) % total;
    const item = lightboxImages[lightboxIndex];
    renderLightboxImage(item.caption, item.color, item.src);
  }

  lightboxPrev.addEventListener("click", () => showLightboxAt(lightboxIndex - 1));
  lightboxNext.addEventListener("click", () => showLightboxAt(lightboxIndex + 1));

  function closeLightbox() { lightbox.hidden = true; }
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") { closeLightbox(); return; }
    if (e.key === "ArrowLeft") { showLightboxAt(lightboxIndex - 1); return; }
    if (e.key === "ArrowRight") { showLightboxAt(lightboxIndex + 1); return; }
  });

  /* ---------------------------------------------------------
     MUSIC
  --------------------------------------------------------- */
  const trackListEl = $("#trackList");
  const musicTrackTitle = $("#musicTrackTitle");
  const musicTrackMeta = $("#musicTrackMeta");
  const spotifyEmbedWrap = $("#spotifyEmbedWrap");

  let activeTrackId = null;

  function renderTrackList() {
    trackListEl.innerHTML = TRACKS.map((t) => `
      <li class="track-item ${t.id === activeTrackId ? "is-active" : ""}" data-id="${t.id}">
        <span class="track-dot" style="background:${t.color}"></span>
        <span>
          <span class="track-name">${t.name}</span>
          <span class="track-kind">${t.kind}</span>
        </span>
      </li>
    `).join("");
    $$(".track-item", trackListEl).forEach((li) => {
      li.addEventListener("click", () => loadTrack(li.dataset.id));
    });
  }

  function loadTrack(id) {
    activeTrackId = id;
    const t = TRACKS.find((x) => x.id === id);
    musicTrackTitle.textContent = t.name;
    musicTrackMeta.textContent = t.kind;
    renderTrackList();
    // Real official Spotify embed player for this track.
    spotifyEmbedWrap.innerHTML = `
      <iframe
        title="Reproductor de Spotify — ${t.name}"
        style="border-radius:16px"
        src="https://open.spotify.com/embed/track/${t.spotifyId}?utm_source=generator&theme=0"
        width="100%" height="152" frameBorder="0"
        allowfullscreen=""
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"></iframe>
    `;
  }

  renderTrackList();
  loadTrack(TRACKS[0].id);

})();