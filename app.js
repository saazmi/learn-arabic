/* =========================================================================
   Apprendre l'arabe — coquille de l'app : navigation, accueil, leçons de
   grammaire, vocabulaire, et le lanceur de quiz dynamiques.
   État (meilleurs scores) dans localStorage. Aucun serveur.
   ========================================================================= */

(function () {
  "use strict";

  const app = document.getElementById("app");
  const STORE_KEY = "arabe.progress.v3";
  const LESSONS = window.LESSONS || [];
  const VOCAB = window.VOCAB || [];
  const STORIES = window.STORIES || [];
  const VERSES = window.VERSES || {};

  // ---- bidi : isole chaque passage arabe (RTL) pour que le français et les
  //      parenthèses autour restent bien placés ----------------------------
  const AR = "\\u0600-\\u06FF\\u0750-\\u077F\\u08A0-\\u08FF\\uFB50-\\uFDFF\\uFE70-\\uFEFF";
  const AR_RUN = new RegExp("[" + AR + "](?:[" + AR + "\\s]*[" + AR + "])?", "g");
  function bidi(s) {
    return String(s).replace(AR_RUN, function (m) { return '<bdi dir="rtl">' + m + "</bdi>"; });
  }
  function shuffle(a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // ---- translittération des TERMES de grammaire -------------------------
  //  Quand un terme arabe apparaît (اِسْم, حَرْف…), on ajoute sa prononciation
  //  la première fois qu'il est vu dans une carte. Le glossaire est indexé
  //  sur la forme « nue » (sans voyelles ni article الـ) pour tout attraper.
  const TRANSLIT = {
    "اسم": "ism", "فعل": "fiʿl", "حرف": "ḥarf", "نكرة": "nakira", "معرفة": "maʿrifa",
    "تنوين": "tanwīn", "مبتدأ": "mubtadaʾ", "خبر": "khabar", "إضافة": "iḍāfa", "مضاف": "muḍāf",
    "نعت": "naʿt", "مذكر": "mudhakkar", "مؤنث": "muʾannath", "مثنى": "muthannā", "جمع": "jamʿ",
    "إعراب": "iʿrāb", "رفع": "rafʿ", "نصب": "naṣb", "جر": "jarr", "ضمير": "ḍamīr", "ضمائر": "ḍamāʾir",
  };
  const DIAC = /[ـً-ٰٕ]/g;                 // tatweel + harakat + hamza combinantes
  function normAr(s) {
    s = s.replace(DIAC, "");
    if (s.length > 2 && s.charCodeAt(0) === 0x0627 && s.charCodeAt(1) === 0x0644) s = s.slice(2); // ال
    return s;
  }
  const ANNOT_RE = new RegExp("([" + AR + "]+)(\\s*\\(([^)]*)\\))?", "g");
  function annotate(text) {
    const full = String(text);
    const used = {};
    return full.replace(ANNOT_RE, function (m, word, parenAll, glossInner, offset) {
      const key = normAr(word);
      const tr = TRANSLIT[key];
      if (!tr || used[key]) return m;
      const before = full.slice(0, offset);
      const after = full.slice(offset + m.length);
      if (/[؀-ۿ]\s*$/.test(before)) return m;              // mot arabe précédent → dans une phrase
      const wrapped = before.slice(-1) === "(" && after.charAt(0) === ")";
      if (!parenAll && !wrapped && /^\s*[؀-ۿ]/.test(after)) return m; // mot arabe suivant
      used[key] = 1;
      if (wrapped) return word + " — " + tr;                          // (مُضَاف) → (مُضَاف — muḍāf)
      if (parenAll) return word + " (" + tr + ", " + glossInner + ")"; // اِسْم (nom) → اِسْم (ism, nom)
      return word + " (" + tr + ")";                                  // الفِعْل → الفِعْل (fiʿl)
    });
  }

  // ---- progression (stockage local) --------------------------------------
  //   Une seule machine, une seule identité. Aucune synchronisation cloud.
  //   Phase 2 : migration vers IndexedDB avec la même API `saveState`.
  function localLoad() { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (_) { return {}; } }
  function saveState(s) { try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch (_) {} }
  let state = { scores: {} };
  function best(key) { return state.scores[key] || null; }
  function recordScore(key, score, total) {
    const p = state.scores[key] || { best: 0 };
    state.scores[key] = { best: Math.max(p.best || 0, score), last: score, total: total };
    saveState(state);
  }
  // Card positions per lesson / vocab deck. Kind = "g" (grammar) or "v" (vocab).
  function getPos(kind, id) {
    const p = state.pos && state.pos[kind];
    return (p && typeof p[id] === "number") ? p[id] : 0;
  }
  function setPos(kind, id, i) {
    state.pos = state.pos || { g: {}, v: {} };
    state.pos[kind] = state.pos[kind] || {};
    state.pos[kind][id] = i;
    saveState(state);
  }

  // ---- mots de vocabulaire « acquis » ------------------------------------
  //  state.vocab.acquired = { deckId: { wordAr: true } }
  function acqMap(deckId) {
    if (!state.vocab || !state.vocab.acquired) return {};
    return state.vocab.acquired[deckId] || {};
  }
  function isAcquired(deckId, wordAr) { return !!acqMap(deckId)[wordAr]; }
  function acquiredCount(deckId) { return Object.keys(acqMap(deckId)).length; }
  function toggleAcquired(deckId, wordAr) {
    state.vocab = state.vocab || {};
    state.vocab.acquired = state.vocab.acquired || {};
    state.vocab.acquired[deckId] = state.vocab.acquired[deckId] || {};
    const m = state.vocab.acquired[deckId];
    if (m[wordAr]) delete m[wordAr]; else m[wordAr] = true;
    saveState(state);
    return !!m[wordAr];
  }
  function totalVocabAcquired() {
    let n = 0;
    if (state.vocab && state.vocab.acquired) {
      for (const k in state.vocab.acquired) n += Object.keys(state.vocab.acquired[k]).length;
    }
    return n;
  }
  function totalVocabWords() {
    let n = 0; VOCAB.forEach(function (d) { n += d.words.length; }); return n;
  }

  function h(html) { app.innerHTML = html; window.scrollTo(0, 0); }

  // =========================================================================
  //  COQUILLE + NAVIGATION
  // =========================================================================
  const NAV = [
    { id: "home", label: "Home", icon: "☾" },
    { id: "grammar", label: "Grammar", icon: "ن" },
    { id: "vocab", label: "Vocabulary", icon: "ك" },
    { id: "stories", label: "Stories", icon: "ق" },
  ];

  // ---- thème (clair / sombre) --------------------------------------------
  // Sans préférence enregistrée : on suit l'OS (media query).
  // Avec préférence : attribut data-theme sur <html> qui gagne sur la MQ.
  const THEME_KEY = "learnArabic.theme";
  const SUN_SVG  = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
  const MOON_SVG = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>';
  function loadTheme() { try { return localStorage.getItem(THEME_KEY) || ""; } catch (_) { return ""; } }
  function saveTheme(v) { try { if (v) localStorage.setItem(THEME_KEY, v); else localStorage.removeItem(THEME_KEY); } catch (_) {} }
  function currentTheme() {
    const stored = loadTheme();
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function applyTheme(v) {
    if (v === "light" || v === "dark") document.documentElement.setAttribute("data-theme", v);
    else document.documentElement.removeAttribute("data-theme");
  }
  function toggleTheme() {
    const next = currentTheme() === "dark" ? "light" : "dark";
    saveTheme(next);
    applyTheme(next);
    return next;
  }

  function shell(active, mainHTML) {
    let items = "";
    NAV.forEach(function (it) {
      items += '<button class="nav-item' + (it.id === active ? " active" : "") + '" data-nav="' + it.id + '">' +
                 '<span class="nav-ic" dir="rtl">' + it.icon + "</span>" +
                 '<span class="nav-lbl">' + it.label + "</span>" +
               "</button>";
    });
    const isDark = currentTheme() === "dark";
    const themeBtn = '<button class="theme-toggle" id="theme-toggle" ' +
                       'title="' + (isDark ? "Light theme" : "Dark theme") + '" ' +
                       'aria-label="' + (isDark ? "Switch to light theme" : "Switch to dark theme") + '">' +
                       (isDark ? SUN_SVG : MOON_SVG) +
                     "</button>";
    h(
      '<div class="shell">' +
        '<nav class="rail">' +
          '<div class="brand"><div class="bismillah" dir="rtl">بِسْمِ اللَّه</div>' +
            '<div class="brand-t">Learn<br>Arabic</div></div>' +
          '<div class="nav-items">' + items + "</div>" +
          '<div class="rail-foot">' + themeBtn + "</div>" +
        "</nav>" +
        '<main class="main"><div class="screen" data-view="' + active + '">' + mainHTML + "</div></main>" +
      "</div>"
    );
    Array.prototype.forEach.call(document.querySelectorAll(".nav-item"), function (b) {
      b.onclick = function () { go(b.getAttribute("data-nav")); };
    });
    const tt = document.getElementById("theme-toggle");
    if (tt) tt.onclick = function () { toggleTheme(); go(active); };
  }

  function focus(mainHTML, backLabel, onBack) {
    h('<div class="topbar"><button class="btn btn-ghost" id="back">‹ ' + (backLabel || "Back") + "</button></div>" +
      '<div class="focus-wrap">' + mainHTML + "</div>");
    document.getElementById("back").onclick = onBack;
  }

  function go(view) {
    if (view === "grammar") return screenGrammar();
    if (view === "vocab") return screenVocab();
    if (view === "stories") return screenStories();
    return screenHome();
  }

  // =========================================================================
  //  HOME
  // =========================================================================
  function screenHome() {
    const hr = new Date().getHours();
    const greeting = hr < 18 ? "Ready to learn?" : "A study session tonight?";
    const gDone = LESSONS.filter(l => best("g:" + l.id)).length;

    shell("home",
      '<div class="home">' +
        '<h1>Ahlan wa sahlan</h1>' +
        '<p class="greeting">' + greeting + "</p>" +
        '<div class="tiles">' +
          '<button class="tile" data-go="grammar">' +
            '<div class="tile-ic" dir="rtl">نَحْو</div>' +
            '<div class="tile-t">Grammar</div>' +
            '<div class="tile-s">' + LESSONS.length + " lessons — learn &amp; revise</div>" +
          "</button>" +
          '<button class="tile" data-go="vocab">' +
            '<div class="tile-ic" dir="rtl">كَلِمَات</div>' +
            '<div class="tile-t">Vocabulary</div>' +
            '<div class="tile-s">' + totalVocabAcquired() + " / " + totalVocabWords() + " words acquired</div>" +
          "</button>" +
          '<button class="tile" data-go="stories">' +
            '<div class="tile-ic" dir="rtl">قَصَص</div>' +
            '<div class="tile-t">Stories of the Qur\'an</div>' +
            '<div class="tile-s">' + STORIES.length + " stor" + (STORIES.length > 1 ? "ies" : "y") + " — reading &amp; verses</div>" +
          "</button>" +
        "</div>" +
        '<p class="footnote">Grammar: ' + gDone + " / " + LESSONS.length + "<br>Take your time — come back whenever you like.</p>" +
      "</div>"
    );
    Array.prototype.forEach.call(document.querySelectorAll(".tile"), function (b) {
      b.onclick = function () { go(b.getAttribute("data-go")); };
    });
  }


  // =========================================================================
  //  GRAMMAIRE — liste des leçons + révision globale
  // =========================================================================
  function screenGrammar() {
    let rows = "";
    LESSONS.forEach(function (l) {
      const b = best("g:" + l.id);
      const score = b ? '<span class="rq-score">✓ ' + b.best + "/" + b.total + "</span>" : "";
      const total = l.cards.length;
      const pos = Math.min(getPos("g", l.id), total);
      const cardsChip = pos > 0
        ? '<span class="cards-chip' + (pos >= total ? " done" : "") + '">' + Math.min(pos, total) + "/" + total + " cartes</span>"
        : "";
      rows += '<div class="list-row">' +
                '<button class="row-main" data-lesson="' + l.id + '">' +
                  '<span class="list-num">' + l.n + "</span>" +
                  '<span class="list-meta"><span class="list-title" dir="ltr">' + bidi(l.title) + "</span>" +
                    '<span class="list-sub" dir="ltr">' + bidi(l.subtitle) + " " + cardsChip + "</span></span>" +
                "</button>" +
                '<button class="row-quiz" data-quiz="' + l.id + '"><span class="rq-label">Quiz</span>' + score + "</button>" +
              "</div>";
    });
    shell("grammar",
      '<div class="section-head"><h1>Grammaire</h1>' +
        '<p class="greeting">Touche une leçon pour apprendre · le bouton <b>Quiz</b> pour réviser.</p></div>' +
      '<button class="btn btn-primary wide" id="revall">Quiz de révision · toute la grammaire</button>' +
      '<div class="list">' + rows + "</div>"
    );
    document.getElementById("revall").onclick = function () {
      runQuiz({
        label: "Grammaire", saveKey: "g:all",
        generate: function () { return window.QUIZ.buildGrammarQuiz(10); },
        onExit: screenGrammar,
      });
    };
    Array.prototype.forEach.call(document.querySelectorAll(".row-main"), function (b) {
      b.onclick = function () {
        const l = LESSONS.filter(x => x.id === b.getAttribute("data-lesson"))[0];
        if (l) teach(l);
      };
    });
    Array.prototype.forEach.call(document.querySelectorAll(".row-quiz"), function (b) {
      b.onclick = function () {
        const l = LESSONS.filter(x => x.id === b.getAttribute("data-quiz"))[0];
        if (l) startLessonQuiz(l);
      };
    });
  }

  function startLessonQuiz(lesson) {
    runQuiz({
      label: "Leçon " + lesson.n, saveKey: "g:" + lesson.id,
      generate: function () { return window.QUIZ.buildLessonQuiz(lesson.id, 10); },
      onExit: screenGrammar,
    });
  }

  // ---- apprentissage (cartes concept) ------------------------------------
  function teach(lesson, i) {
    const total = lesson.cards.length;
    if (typeof i !== "number") i = Math.min(getPos("g", lesson.id), total - 1);
    if (i < 0) i = 0;
    setPos("g", lesson.id, i);
    const card = lesson.cards[i];
    const pct = Math.round((i / total) * 100);
    const last = i === total - 1;

    focus(
      '<div class="study">' +
        '<div class="phase-label">Leçon ' + lesson.n + " · Apprentissage · " + (i + 1) + "/" + total + "</div>" +
        '<div class="progress"><span style="width:' + pct + '%"></span></div>' +
        '<div class="card concept">' +
          '<div class="concept-front" dir="ltr">' + bidi(annotate(card.front)) + "</div>" +
          '<div class="concept-back">' +
            '<div class="example-word" dir="ltr">' + bidi(annotate(card.example)).replace(/\s*·\s*/g, "<br>") + "</div>" +
            '<div class="example-explain" dir="ltr">' + bidi(annotate(card.explain)) + "</div>" +
          "</div>" +
        "</div>" +
        '<div class="nav-row">' +
          (i > 0 ? '<button class="btn btn-ghost" id="prev">‹ Précédent</button>' : '<span class="spacer"></span>') +
          '<button class="btn btn-primary" id="next">' + (last ? "Passer au quiz →" : "Suivant →") + "</button>" +
        "</div>" +
      "</div>",
      "Grammaire", screenGrammar
    );

    if (i > 0) document.getElementById("prev").onclick = function () { teach(lesson, i - 1); };
    document.getElementById("next").onclick = function () {
      if (last) { setPos("g", lesson.id, total); startLessonQuiz(lesson); }
      else teach(lesson, i + 1);
    };
  }

  // =========================================================================
  //  VOCABULAIRE
  // =========================================================================
  function screenVocab() {
    let rows = "";
    VOCAB.forEach(function (d) {
      const b = best("v:" + d.id);
      const score = b ? '<span class="rq-score">✓ ' + b.best + "/" + b.total + "</span>" : "";
      const total = d.words.length;
      const acq = acquiredCount(d.id);
      const pct = total ? Math.round((acq / total) * 100) : 0;
      const done = acq >= total && total > 0;
      rows += '<div class="list-row">' +
                '<button class="row-main" data-deck="' + d.id + '">' +
                  '<span class="list-ic" dir="rtl">كَلِمَات</span>' +
                  '<span class="list-meta">' +
                    '<span class="list-title">' + d.title + (done ? " ✓" : "") + "</span>" +
                    '<span class="list-sub">' + d.subtitle + " · " + total + " mots</span>" +
                    '<span class="acq-line">' +
                      '<span class="acq-bar"><span class="acq-fill" style="width:' + pct + '%"></span></span>' +
                      '<span class="acq-count">' + acq + "/" + total + " acquis</span>" +
                    "</span>" +
                  "</span>" +
                "</button>" +
                '<button class="row-quiz" data-quiz="' + d.id + '"><span class="rq-label">Quiz</span>' + score + "</button>" +
              "</div>";
    });
    const totalAcq = totalVocabAcquired();
    const totalAll = totalVocabWords();
    shell("vocab",
      '<div class="section-head"><h1>Vocabulaire</h1>' +
        '<p class="greeting">Touche un jeu pour parcourir · marque un mot comme <b>acquis</b> quand tu le connais. Bouton <b>Quiz</b> pour te tester.</p></div>' +
      '<div class="vocab-total">Progression totale : <b>' + totalAcq + " / " + totalAll + "</b> mots acquis</div>" +
      '<div class="list">' + rows + "</div>"
    );
    Array.prototype.forEach.call(document.querySelectorAll(".row-main"), function (b) {
      b.onclick = function () {
        const d = VOCAB.filter(x => x.id === b.getAttribute("data-deck"))[0];
        if (d) browse(d);
      };
    });
    Array.prototype.forEach.call(document.querySelectorAll(".row-quiz"), function (b) {
      b.onclick = function () {
        const d = VOCAB.filter(x => x.id === b.getAttribute("data-quiz"))[0];
        if (d) runQuiz({
          label: d.title, saveKey: "v:" + d.id,
          generate: function () { return window.QUIZ.buildVocabQuiz(d.id, 10); },
          onExit: screenVocab,
        });
      };
    });
  }

  // ---- parcourir les cartes de vocabulaire -------------------------------
  function browse(deck, i) {
    const total = deck.words.length;
    if (typeof i !== "number") i = Math.min(getPos("v", deck.id), total - 1);
    if (i < 0) i = 0;
    setPos("v", deck.id, i);
    const w = deck.words[i];
    const pct = Math.round((i / total) * 100);
    const last = i === total - 1;

    const acquired = isAcquired(deck.id, w.ar);
    const countChip = (typeof w.count === "number")
      ? '<div class="vcard-count">' + w.count + "&nbsp;× dans le Coran</div>"
      : "";

    focus(
      '<div class="study">' +
        '<div class="phase-label">' + deck.title + " · " + (i + 1) + "/" + total + "</div>" +
        '<div class="progress"><span style="width:' + pct + '%"></span></div>' +
        '<div class="card vcard">' +
          '<div class="vcard-ar" dir="rtl">' + w.ar + "</div>" +
          '<div class="vcard-back">' +
            '<div class="vcard-tr">' + w.tr + "</div>" +
            '<div class="vcard-fr">' + w.fr + "</div>" +
            countChip +
          "</div>" +
        "</div>" +
        '<div class="acq-row">' +
          '<button class="acq-toggle' + (acquired ? " on" : "") + '" id="acq" ' +
            'aria-pressed="' + (acquired ? "true" : "false") + '">' +
            '<span class="acq-check">✓</span> ' +
            '<span class="acq-label">Acquis</span>' +
          "</button>" +
        "</div>" +
        '<div class="nav-row">' +
          (i > 0 ? '<button class="btn btn-ghost" id="prev">‹ Précédent</button>' : '<span class="spacer"></span>') +
          '<button class="btn btn-primary" id="next">' + (last ? "Terminer" : "Suivant →") + "</button>" +
        "</div>" +
      "</div>",
      "Vocabulaire", screenVocab
    );

    if (i > 0) document.getElementById("prev").onclick = function () { browse(deck, i - 1); };
    document.getElementById("next").onclick = function () {
      if (last) { setPos("v", deck.id, total); screenVocab(); }
      else browse(deck, i + 1);
    };
    // toggle « acquis » — la pastille passe du gris au vert
    const acqBtn = document.getElementById("acq");
    acqBtn.onclick = function () {
      const on = toggleAcquired(deck.id, w.ar);
      acqBtn.classList.toggle("on", on);
      acqBtn.setAttribute("aria-pressed", on ? "true" : "false");
    };
  }

  // =========================================================================
  //  HISTOIRE DES PROPHÈTES — lecture + versets cliquables + récitation
  // =========================================================================
  let audioEl = null, audioBtn = null;
  function stopAudio() {
    if (audioEl) { audioEl.pause(); audioEl = null; }
    if (audioBtn) { audioBtn.classList.remove("playing"); audioBtn.innerHTML = "▶ Écouter"; audioBtn = null; }
  }
  function playAudio(url, btn) {
    if (audioEl && audioBtn === btn) { stopAudio(); return; }
    stopAudio();
    audioEl = new Audio(url); audioBtn = btn;
    btn.classList.add("playing"); btn.innerHTML = "⏸ Pause";
    audioEl.onended = stopAudio;
    audioEl.onerror = function () { btn.innerHTML = "⚠ indisponible"; };
    audioEl.play().catch(function () { btn.innerHTML = "⚠ hors-ligne"; });
  }

  function screenStories() {
    stopAudio();
    let rows = "";
    STORIES.forEach(function (s) {
      rows += '<div class="list-row"><button class="row-main" data-story="' + s.id + '">' +
                '<span class="list-ic" dir="rtl">ق</span>' +
                '<span class="list-meta">' +
                  '<span class="list-title" dir="rtl">' + s.title + "</span>" +
                  '<span class="list-sub">' + s.titleFr + " — " + s.subtitle + "</span>" +
                "</span></button></div>";
    });
    shell("stories",
      '<div class="section-head"><h1>Les récits du Coran</h1>' +
        '<p class="greeting">Lis l\'histoire en arabe. Le français est sous chaque ligne ; ' +
        "touche une référence pour lire et écouter le verset.</p></div>" +
      '<div class="list">' + rows + "</div>"
    );
    Array.prototype.forEach.call(document.querySelectorAll(".row-main"), function (b) {
      b.onclick = function () {
        const s = STORIES.filter(function (x) { return x.id === b.getAttribute("data-story"); })[0];
        if (s) readStory(s, 0);
      };
    });
  }

  function readStory(story, i) {
    stopAudio();
    const card = story.cards[i];
    const total = story.cards.length;
    const pct = Math.round((i / total) * 100);
    const last = i === total - 1;

    const LOUPE = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><line x1="15.5" y1="15.5" x2="21" y2="21"/></svg>';
    const TYPE = { nom: "اسم · nom", verbe: "فعل · verbe", particule: "حرف · particule", pronom: "ضمير · pronom" };
    function renderAn(an) {
      let w = "";
      an.words.forEach(function (wd) {
        w += '<div class="aw">' +
               '<span class="aw-word" dir="rtl">' + wd.w + "</span>" +
               '<span class="aw-body">' +
                 '<span class="aw-type t-' + wd.type + '" dir="rtl">' + (TYPE[wd.type] || wd.type) + "</span>" +
                 '<span class="aw-role" dir="ltr">' + wd.role + "</span>" +
               "</span>" +
             "</div>";
      });
      return '<div class="analyse-words">' + w + "</div>" +
             '<div class="analyse-take">' + an.takeaway + "</div>";
    }

    // chaque phrase : arabe, français grisé, et son propre bouton d'analyse
    let lines = "";
    card.ar.forEach(function (a, idx) {
      lines += '<div class="story-line">' +
        '<p class="story-ar" dir="rtl">' + a + "</p>" +
        '<p class="story-fr">' + (card.fr[idx] || "") + "</p>";
      if (card.an && card.an[idx]) {
        lines += '<button class="loupe-btn" data-target="an-' + idx + '" ' +
                   'title="Analyser la phrase" aria-label="Analyser la phrase">' + LOUPE + "</button>" +
                 '<div class="analyse-panel" id="an-' + idx + '" hidden>' +
                   '<div class="analyse-head">Analyser la phrase</div>' + renderAn(card.an[idx]) +
                 "</div>";
      }
      lines += "</div>";
    });

    let refsHtml = "";
    (card.refs || []).forEach(function (ref) {
      const v = VERSES[ref];
      if (!v) return;
      const pid = "panel-" + ref.replace(":", "-");
      refsHtml +=
        '<div class="verse-block">' +
          '<button class="verse-chip" data-ref="' + ref + '">' +
            '<span class="q-ic" dir="rtl">۩</span> ' + v.frName + " " + ref +
          "</button>" +
          '<div class="verse-panel" id="' + pid + '" hidden>' +
            '<div class="verse-ar" dir="rtl">' + v.ar + "</div>" +
            '<div class="verse-fr">' + v.fr + "</div>" +
            '<div class="verse-foot">' +
              '<span class="verse-src" dir="rtl">' + v.surah + " · " + v.ayah + "</span>" +
              '<button class="btn-listen" data-audio="' + v.audio + '">▶ Écouter</button>' +
            "</div>" +
          "</div>" +
        "</div>";
    });

    focus(
      '<div class="study story">' +
        '<div class="phase-label">' + story.titleFr + " · " + (i + 1) + "/" + total + "</div>" +
        '<div class="progress"><span style="width:' + pct + '%"></span></div>' +
        '<div class="card story-card">' + lines +
          (refsHtml ? '<div class="verse-refs">' + refsHtml + "</div>" : "") +
        "</div>" +
        '<div class="nav-row">' +
          (i > 0 ? '<button class="btn btn-ghost" id="prev">‹ Précédent</button>' : '<span class="spacer"></span>') +
          '<button class="btn btn-primary" id="next">' + (last ? "Terminer" : "Suivant →") + "</button>" +
        "</div>" +
      "</div>",
      "Récits", function () { stopAudio(); screenStories(); }
    );

    if (i > 0) document.getElementById("prev").onclick = function () { readStory(story, i - 1); };
    document.getElementById("next").onclick = function () {
      if (last) { stopAudio(); screenStories(); } else readStory(story, i + 1);
    };
    Array.prototype.forEach.call(document.querySelectorAll(".verse-chip"), function (chip) {
      chip.onclick = function () {
        const panel = document.getElementById("panel-" + chip.getAttribute("data-ref").replace(":", "-"));
        panel.hidden = !panel.hidden;
        chip.classList.toggle("open", !panel.hidden);
      };
    });
    Array.prototype.forEach.call(document.querySelectorAll(".btn-listen"), function (b) {
      b.onclick = function () { playAudio(b.getAttribute("data-audio"), b); };
    });
    Array.prototype.forEach.call(document.querySelectorAll(".loupe-btn"), function (b) {
      b.onclick = function () {
        const p = document.getElementById(b.getAttribute("data-target"));
        p.hidden = !p.hidden;
        b.classList.toggle("open", !p.hidden);
      };
    });
  }

  // =========================================================================
  //  LANCEUR DE QUIZ DYNAMIQUES (générique)
  //  cfg : { label, generate:()=>questions, saveKey, onExit }
  // =========================================================================
  function runQuiz(cfg) {
    const questions = cfg.generate();
    ask(0, 0);

    function ask(i, score) {
      if (i >= questions.length) return finish(score);
      const item = questions[i];
      const total = questions.length;
      const pct = Math.round((i / total) * 100);

      const opts = shuffle(item.options.map(function (text, idx) {
        return { text: text, correct: idx === item.answer };
      }));
      let optsHtml = "";
      opts.forEach(function (o) {
        optsHtml += '<button class="opt" data-correct="' + o.correct + '" dir="ltr">' + bidi(o.text) + "</button>";
      });

      focus(
        '<div class="study">' +
          '<div class="phase-label">' + cfg.label + " · Quiz · " + (i + 1) + "/" + total + "</div>" +
          '<div class="progress"><span style="width:' + pct + '%"></span></div>' +
          '<div class="question" dir="ltr">' + bidi(item.q) + "</div>" +
          '<div class="options">' + optsHtml + "</div>" +
          '<div class="feedback" id="feedback" hidden></div>' +
          '<div class="nav-row center"><button class="btn btn-primary" id="next" hidden>' +
            (i === total - 1 ? "Voir le résultat →" : "Question suivante →") + "</button></div>" +
        "</div>",
        cfg.label, cfg.onExit
      );

      let answered = false, wasCorrect = false;
      const buttons = document.querySelectorAll(".opt");
      Array.prototype.forEach.call(buttons, function (btn) {
        btn.onclick = function () {
          if (answered) return; answered = true;
          wasCorrect = btn.getAttribute("data-correct") === "true";
          Array.prototype.forEach.call(buttons, function (b) {
            b.disabled = true;
            if (b.getAttribute("data-correct") === "true") b.classList.add("correct");
            else if (b === btn) b.classList.add("wrong");
          });
          const fb = document.getElementById("feedback");
          fb.hidden = false;
          fb.className = "feedback " + (wasCorrect ? "ok" : "no");
          fb.innerHTML = (wasCorrect ? "✓ Bien vu ! " : "Pas tout à fait. ") + bidi(item.explain);
          document.getElementById("next").hidden = false;
        };
      });
      document.getElementById("next").onclick = function () {
        ask(i + 1, score + (wasCorrect ? 1 : 0));
      };
    }

    function finish(score) {
      const total = questions.length;
      recordScore(cfg.saveKey, score, total);
      const ratio = score / total;
      const arabic = ratio === 1 ? "ما شاء الله" : ratio >= 0.6 ? "أَحْسَنْتِ" : "وَاصِلِي";
      const msg = ratio === 1 ? "Sans faute. Tu maîtrises."
                : ratio >= 0.6 ? "Très bien. Encore un tour et ce sera parfait."
                : "C'est en révisant qu'on retient. Reprends tranquillement — tu vas y arriver.";
      focus(
        '<div class="celebrate">' +
          '<div class="mashallah" dir="rtl">' + arabic + "</div>" +
          '<div class="score-big">' + score + "<span>/" + total + "</span></div>" +
          "<p>" + msg + "</p>" +
          '<div class="result-actions">' +
            '<button class="btn btn-primary" id="again">Refaire (nouvelles questions)</button>' +
            '<button class="btn btn-ghost" id="done">Terminer</button>' +
          "</div>" +
        "</div>",
        cfg.label, cfg.onExit
      );
      document.getElementById("again").onclick = function () { runQuiz(cfg); };
      document.getElementById("done").onclick = cfg.onExit;
    }
  }


  // ---- démarrage ---------------------------------------------------------
  //  Stockage : localStorage pour l'instant (une seule machine).
  //  Le service-worker précédent laissait les appareils bloqués sur du JS
  //  périmé — celui-ci se désenregistre à l'ouverture puis disparaît.
  state = Object.assign({ scores: {} }, localLoad());
  applyTheme(loadTheme());       // restore saved light/dark override (if any)
  screenHome();
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.getRegistrations().then(function (regs) {
        regs.forEach(function (r) { try { r.unregister(); } catch (_) {} });
      }).catch(function () {});
    });
  }
})();
