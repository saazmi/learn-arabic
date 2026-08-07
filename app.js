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

  // =========================================================================
  //  i18n — FR / EN
  //  UI strings live here. Card CONTENT (lesson.front, w.fr/w.en, etc.) is
  //  language-aware via pickLang() below; this dict only covers chrome.
  // =========================================================================
  const LANG_KEY = "learnArabic.lang";
  const STRINGS = {
    fr: {
      "brand":               "Apprendre<br>l'arabe",
      "back":                "Retour",
      "nav.home":            "Accueil",
      "nav.grammar":         "Grammaire",
      "nav.vocab":           "Vocabulaire",
      "nav.stories":         "Récits",
      "home.welcome":        "Ahlan wa sahlan",
      "home.greeting.day":   "Prête à apprendre ?",
      "home.greeting.eve":   "Une séance ce soir ?",
      "home.tile.grammar":   "Grammaire",
      "home.tile.grammar.s": "{0} leçons — apprendre &amp; réviser",
      "home.tile.vocab":     "Vocabulaire",
      "home.tile.vocab.s":   "{0} / {1} mots acquis",
      "home.tile.stories":   "Récits du Coran",
      "home.tile.stories.s": "{0} récit{p} — lecture &amp; versets",
      "home.footnote":       "Grammaire : {0} / {1}<br>Prends ton temps — reviens quand tu veux.",
      "grammar.title":       "Grammaire",
      "grammar.intro":       "Touche une leçon pour apprendre · le bouton <b>Quiz</b> pour réviser.",
      "grammar.revall":      "Quiz de révision · toute la grammaire",
      "grammar.reviewLabel": "Grammaire",
      "grammar.cardsChip":   "{0}/{1} cartes",
      "grammar.phase":       "Leçon {0} · Apprentissage · {1}/{2}",
      "grammar.lessonQuiz":  "Leçon {0}",
      "grammar.toQuiz":      "Passer au quiz →",
      "vocab.title":         "Vocabulaire",
      "vocab.intro":         "Touche un jeu pour parcourir · marque un mot comme <b>acquis</b> quand tu le connais. Bouton <b>Quiz</b> pour te tester.",
      "vocab.total":         "Progression totale : <b>{0} / {1}</b> mots acquis",
      "vocab.wordsCount":    "{0} mots",
      "vocab.wordsAcquired": "{0}/{1} acquis",
      "vocab.acquis":        "Acquis",
      "vocab.countInQuran":  "{0}&nbsp;× dans le Coran",
      "vocab.phase":         "{0} · {1}/{2}",
      "stories.title":       "Les récits du Coran",
      "stories.intro":       "Lis l'histoire en arabe. Le français est sous chaque ligne ; touche une référence pour lire et écouter le verset.",
      "stories.phase":       "{0} · {1}/{2}",
      "stories.listen":      "▶ Écouter",
      "stories.audioErr":    "⚠ indisponible",
      "stories.audioOff":    "⚠ hors-ligne",
      "stories.pause":       "⏸ Pause",
      "stories.analyseTitle":"Analyser la phrase",
      "quiz.phase":          "{0} · Quiz · {1}/{2}",
      "quiz.nextQ":          "Question suivante →",
      "quiz.seeResult":      "Voir le résultat →",
      "quiz.correct":        "✓ Bien vu ! ",
      "quiz.wrong":          "Pas tout à fait. ",
      "quiz.finishTitle":    "{0} — Quiz",
      "quiz.perfect":        "Sans faute. Tu maîtrises.",
      "quiz.good":           "Très bien. Encore un tour et ce sera parfait.",
      "quiz.retry":          "C'est en révisant qu'on retient. Reprends tranquillement — tu vas y arriver.",
      "quiz.again":          "Refaire (nouvelles questions)",
      "quiz.done":           "Terminer",
      "btn.prev":            "‹ Précédent",
      "btn.next":            "Suivant →",
      "btn.finish":          "Terminer",
      "theme.toDark":        "Thème sombre",
      "theme.toLight":       "Thème clair",
      "lang.toFR":           "Passer en français",
      "lang.toEN":           "Switch to English",
    },
    en: {
      "brand":               "Learn<br>Arabic",
      "back":                "Back",
      "nav.home":            "Home",
      "nav.grammar":         "Grammar",
      "nav.vocab":           "Vocabulary",
      "nav.stories":         "Stories",
      "home.welcome":        "Ahlan wa sahlan",
      "home.greeting.day":   "Ready to learn?",
      "home.greeting.eve":   "A study session tonight?",
      "home.tile.grammar":   "Grammar",
      "home.tile.grammar.s": "{0} lessons — learn &amp; review",
      "home.tile.vocab":     "Vocabulary",
      "home.tile.vocab.s":   "{0} / {1} words acquired",
      "home.tile.stories":   "Stories of the Qur'an",
      "home.tile.stories.s": "{0} stor{p} — reading &amp; verses",
      "home.footnote":       "Grammar: {0} / {1}<br>Take your time — come back whenever you like.",
      "grammar.title":       "Grammar",
      "grammar.intro":       "Tap a lesson to learn · the <b>Quiz</b> button to review.",
      "grammar.revall":      "Review quiz · all grammar",
      "grammar.reviewLabel": "Grammar",
      "grammar.cardsChip":   "{0}/{1} cards",
      "grammar.phase":       "Lesson {0} · Learn · {1}/{2}",
      "grammar.lessonQuiz":  "Lesson {0}",
      "grammar.toQuiz":      "Go to quiz →",
      "vocab.title":         "Vocabulary",
      "vocab.intro":         "Tap a deck to browse · mark a word as <b>acquired</b> once you know it. The <b>Quiz</b> button to test yourself.",
      "vocab.total":         "Total progress: <b>{0} / {1}</b> words acquired",
      "vocab.wordsCount":    "{0} words",
      "vocab.wordsAcquired": "{0}/{1} acquired",
      "vocab.acquis":        "Acquired",
      "vocab.countInQuran":  "{0}&nbsp;× in the Qur'an",
      "vocab.phase":         "{0} · {1}/{2}",
      "stories.title":       "Stories of the Qur'an",
      "stories.intro":       "Read the story in Arabic. The English is under each line; tap a reference to read and listen to the verse.",
      "stories.phase":       "{0} · {1}/{2}",
      "stories.listen":      "▶ Listen",
      "stories.audioErr":    "⚠ unavailable",
      "stories.audioOff":    "⚠ offline",
      "stories.pause":       "⏸ Pause",
      "stories.analyseTitle":"Analyse the sentence",
      "quiz.phase":          "{0} · Quiz · {1}/{2}",
      "quiz.nextQ":          "Next question →",
      "quiz.seeResult":      "See the result →",
      "quiz.correct":        "✓ Well spotted! ",
      "quiz.wrong":          "Not quite. ",
      "quiz.finishTitle":    "{0} — Quiz",
      "quiz.perfect":        "Flawless. You've got this.",
      "quiz.good":           "Good job. One more round and it's perfect.",
      "quiz.retry":          "Revising is how it sticks. Take another pass — you'll get there.",
      "quiz.again":          "Retry (new questions)",
      "quiz.done":           "Finish",
      "btn.prev":            "‹ Previous",
      "btn.next":            "Next →",
      "btn.finish":          "Finish",
      "theme.toDark":        "Dark theme",
      "theme.toLight":       "Light theme",
      "lang.toFR":           "Passer en français",
      "lang.toEN":           "Switch to English",
    },
  };
  function loadLang() { try { return localStorage.getItem(LANG_KEY) || ""; } catch (_) { return ""; } }
  function saveLang(v) { try { localStorage.setItem(LANG_KEY, v); } catch (_) {} }
  function currentLang() {
    const stored = loadLang();
    if (stored === "fr" || stored === "en") return stored;
    // French is the default; students explicitly opt into English via the toggle.
    return "fr";
  }
  // Substitute {0}, {1}, ... and the plural marker {p} (empty in FR, "ies" in EN).
  function t(key) {
    const args = Array.prototype.slice.call(arguments, 1);
    const lang = currentLang();
    let s = (STRINGS[lang] && STRINGS[lang][key]) || (STRINGS.en && STRINGS.en[key]) || key;
    s = s.replace(/\{(\d+)\}/g, function (_, i) { return String(args[i]); });
    // Very small plural helper — only useful for the story tile subtitle.
    // Passes the count as arg[0]; adds "s"/"ies" (fr/en) if count !== 1.
    if (s.indexOf("{p}") !== -1) {
      const n = Number(args[0]);
      const plural = n === 1 ? "" : (lang === "fr" ? "s" : "ies");
      const single = lang === "fr" ? "" : "y";
      s = s.replace(/\{p\}/g, n === 1 ? single : plural);
    }
    return s;
  }
  // For card data fields that come in {fr, en} shape, or just a string.
  function pickLang(field) {
    if (field == null) return "";
    if (typeof field === "string") return field;
    const lang = currentLang();
    return field[lang] || field.en || field.fr || "";
  }

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
  // NAV labels are resolved dynamically via t() at render time so the toggle
  // can swap them without a page reload.
  const NAV = [
    { id: "home",    key: "nav.home",    icon: "☾" },
    { id: "grammar", key: "nav.grammar", icon: "ن" },
    { id: "vocab",   key: "nav.vocab",   icon: "ك" },
    { id: "stories", key: "nav.stories", icon: "ق" },
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
  function toggleLang() {
    const next = currentLang() === "fr" ? "en" : "fr";
    saveLang(next);
    return next;
  }

  function shell(active, mainHTML) {
    let items = "";
    NAV.forEach(function (it) {
      items += '<button class="nav-item' + (it.id === active ? " active" : "") + '" data-nav="' + it.id + '">' +
                 '<span class="nav-ic" dir="rtl">' + it.icon + "</span>" +
                 '<span class="nav-lbl">' + t(it.key) + "</span>" +
               "</button>";
    });
    const isDark = currentTheme() === "dark";
    const themeBtn = '<button class="theme-toggle" id="theme-toggle" ' +
                       'title="' + (isDark ? t("theme.toLight") : t("theme.toDark")) + '" ' +
                       'aria-label="' + (isDark ? t("theme.toLight") : t("theme.toDark")) + '">' +
                       (isDark ? SUN_SVG : MOON_SVG) +
                     "</button>";
    const isFR = currentLang() === "fr";
    const langBtn = '<button class="lang-toggle" id="lang-toggle" ' +
                      'title="' + (isFR ? t("lang.toEN") : t("lang.toFR")) + '" ' +
                      'aria-label="' + (isFR ? t("lang.toEN") : t("lang.toFR")) + '">' +
                      (isFR ? "EN" : "FR") +
                    "</button>";
    h(
      '<div class="shell">' +
        '<nav class="rail">' +
          '<div class="brand"><div class="bismillah" dir="rtl">بِسْمِ اللَّه</div>' +
            '<div class="brand-t">' + t("brand") + "</div></div>" +
          '<div class="nav-items">' + items + "</div>" +
          '<div class="rail-foot">' + langBtn + themeBtn + "</div>" +
        "</nav>" +
        '<main class="main"><div class="screen" data-view="' + active + '">' + mainHTML + "</div></main>" +
      "</div>"
    );
    Array.prototype.forEach.call(document.querySelectorAll(".nav-item"), function (b) {
      b.onclick = function () { go(b.getAttribute("data-nav")); };
    });
    const tt = document.getElementById("theme-toggle");
    if (tt) tt.onclick = function () { toggleTheme(); go(active); };
    const lt = document.getElementById("lang-toggle");
    if (lt) lt.onclick = function () { toggleLang(); go(active); };
  }

  function focus(mainHTML, backLabel, onBack) {
    h('<div class="topbar"><button class="btn btn-ghost" id="back">‹ ' + (backLabel || t("back")) + "</button></div>" +
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
    const greeting = hr < 18 ? t("home.greeting.day") : t("home.greeting.eve");
    const gDone = LESSONS.filter(l => best("g:" + l.id)).length;

    shell("home",
      '<div class="home">' +
        "<h1>" + t("home.welcome") + "</h1>" +
        '<p class="greeting">' + greeting + "</p>" +
        '<div class="tiles">' +
          '<button class="tile" data-go="grammar">' +
            '<div class="tile-ic" dir="rtl">نَحْو</div>' +
            '<div class="tile-t">' + t("home.tile.grammar") + "</div>" +
            '<div class="tile-s">' + t("home.tile.grammar.s", LESSONS.length) + "</div>" +
          "</button>" +
          '<button class="tile" data-go="vocab">' +
            '<div class="tile-ic" dir="rtl">كَلِمَات</div>' +
            '<div class="tile-t">' + t("home.tile.vocab") + "</div>" +
            '<div class="tile-s">' + t("home.tile.vocab.s", totalVocabAcquired(), totalVocabWords()) + "</div>" +
          "</button>" +
          '<button class="tile" data-go="stories">' +
            '<div class="tile-ic" dir="rtl">قَصَص</div>' +
            '<div class="tile-t">' + t("home.tile.stories") + "</div>" +
            '<div class="tile-s">' + t("home.tile.stories.s", STORIES.length) + "</div>" +
          "</button>" +
        "</div>" +
        '<p class="footnote">' + t("home.footnote", gDone, LESSONS.length) + "</p>" +
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
        ? '<span class="cards-chip' + (pos >= total ? " done" : "") + '">' + t("grammar.cardsChip", Math.min(pos, total), total) + "</span>"
        : "";
      rows += '<div class="list-row">' +
                '<button class="row-main" data-lesson="' + l.id + '">' +
                  '<span class="list-num">' + l.n + "</span>" +
                  '<span class="list-meta"><span class="list-title" dir="ltr">' + bidi(pickLang(l.title)) + "</span>" +
                    '<span class="list-sub" dir="ltr">' + bidi(pickLang(l.subtitle)) + " " + cardsChip + "</span></span>" +
                "</button>" +
                '<button class="row-quiz" data-quiz="' + l.id + '"><span class="rq-label">Quiz</span>' + score + "</button>" +
              "</div>";
    });
    shell("grammar",
      '<div class="section-head"><h1>' + t("grammar.title") + "</h1>" +
        '<p class="greeting">' + t("grammar.intro") + "</p></div>" +
      '<button class="btn btn-primary wide" id="revall">' + t("grammar.revall") + "</button>" +
      '<div class="list">' + rows + "</div>"
    );
    document.getElementById("revall").onclick = function () {
      runQuiz({
        label: t("grammar.reviewLabel"), saveKey: "g:all",
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
      label: t("grammar.lessonQuiz", lesson.n), saveKey: "g:" + lesson.id,
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
        '<div class="phase-label">' + t("grammar.phase", lesson.n, i + 1, total) + "</div>" +
        '<div class="progress"><span style="width:' + pct + '%"></span></div>' +
        '<div class="card concept">' +
          '<div class="concept-front" dir="ltr">' + bidi(annotate(pickLang(card.front))) + "</div>" +
          '<div class="concept-back">' +
            '<div class="example-word" dir="ltr">' + bidi(annotate(pickLang(card.example))).replace(/\s*·\s*/g, "<br>") + "</div>" +
            '<div class="example-explain" dir="ltr">' + bidi(annotate(pickLang(card.explain))) + "</div>" +
          "</div>" +
        "</div>" +
        '<div class="nav-row">' +
          (i > 0 ? '<button class="btn btn-ghost" id="prev">' + t("btn.prev") + "</button>" : '<span class="spacer"></span>') +
          '<button class="btn btn-primary" id="next">' + (last ? t("grammar.toQuiz") : t("btn.next")) + "</button>" +
        "</div>" +
      "</div>",
      t("grammar.title"), screenGrammar
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
                    '<span class="list-title">' + pickLang(d.title) + (done ? " ✓" : "") + "</span>" +
                    '<span class="list-sub">' + pickLang(d.subtitle) + " · " + t("vocab.wordsCount", total) + "</span>" +
                    '<span class="acq-line">' +
                      '<span class="acq-bar"><span class="acq-fill" style="width:' + pct + '%"></span></span>' +
                      '<span class="acq-count">' + t("vocab.wordsAcquired", acq, total) + "</span>" +
                    "</span>" +
                  "</span>" +
                "</button>" +
                '<button class="row-quiz" data-quiz="' + d.id + '"><span class="rq-label">Quiz</span>' + score + "</button>" +
              "</div>";
    });
    const totalAcq = totalVocabAcquired();
    const totalAll = totalVocabWords();
    shell("vocab",
      '<div class="section-head"><h1>' + t("vocab.title") + "</h1>" +
        '<p class="greeting">' + t("vocab.intro") + "</p></div>" +
      '<div class="vocab-total">' + t("vocab.total", totalAcq, totalAll) + "</div>" +
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
          label: pickLang(d.title), saveKey: "v:" + d.id,
          generate: function () { return window.QUIZ.buildVocabQuiz(d.id, 10); },
          onExit: screenVocab,
        });
      };
    });
  }

  // ---- parcourir les cartes de vocabulaire (4 mots par page) -------------
  //   Une page = 4 mots. Un seul bouton « Acquis » agit sur les 4 à la fois :
  //   il s'allume quand les 4 sont tous acquis ; sinon un clic marque les 4.
  const VOCAB_PER_PAGE = 4;
  function browse(deck, startIdx) {
    const total = deck.words.length;
    const pages = Math.max(1, Math.ceil(total / VOCAB_PER_PAGE));
    if (typeof startIdx !== "number") {
      const savedIdx = Math.min(getPos("v", deck.id), total - 1);
      startIdx = Math.max(0, savedIdx - (savedIdx % VOCAB_PER_PAGE));
    }
    if (startIdx < 0) startIdx = 0;
    if (startIdx >= total) startIdx = (pages - 1) * VOCAB_PER_PAGE;
    setPos("v", deck.id, startIdx);

    const page = Math.floor(startIdx / VOCAB_PER_PAGE);
    const words = deck.words.slice(startIdx, startIdx + VOCAB_PER_PAGE);
    const pct = Math.round((page / pages) * 100);
    const last = page === pages - 1;
    const allAcq = words.every(function (w) { return isAcquired(deck.id, w.ar); });

    let cardsHtml = "";
    words.forEach(function (w) {
      const countChip = (typeof w.count === "number")
        ? '<div class="vcard-count">' + t("vocab.countInQuran", w.count) + "</div>"
        : "";
      cardsHtml +=
        '<div class="card vcard vcard-quad">' +
          '<div class="vcard-ar" dir="rtl">' + w.ar + "</div>" +
          '<div class="vcard-back">' +
            '<div class="vcard-tr">' + w.tr + "</div>" +
            '<div class="vcard-fr">' + pickLang(w.fr) + "</div>" +
            countChip +
          "</div>" +
        "</div>";
    });

    focus(
      '<div class="study">' +
        '<div class="phase-label">' + t("vocab.phase", pickLang(deck.title), page + 1, pages) + "</div>" +
        '<div class="progress"><span style="width:' + pct + '%"></span></div>' +
        '<div class="vcard-grid">' + cardsHtml + "</div>" +
        '<div class="acq-row">' +
          '<button class="acq-toggle' + (allAcq ? " on" : "") + '" id="acq" ' +
            'aria-pressed="' + (allAcq ? "true" : "false") + '">' +
            '<span class="acq-check">✓</span> ' +
            '<span class="acq-label">' + t("vocab.acquis") + "</span>" +
          "</button>" +
        "</div>" +
        '<div class="nav-row">' +
          (page > 0 ? '<button class="btn btn-ghost" id="prev">' + t("btn.prev") + "</button>" : '<span class="spacer"></span>') +
          '<button class="btn btn-primary" id="next">' + (last ? t("btn.finish") : t("btn.next")) + "</button>" +
        "</div>" +
      "</div>",
      t("vocab.title"), screenVocab
    );

    if (page > 0) document.getElementById("prev").onclick = function () {
      browse(deck, startIdx - VOCAB_PER_PAGE);
    };
    document.getElementById("next").onclick = function () {
      if (last) { setPos("v", deck.id, total); screenVocab(); }
      else browse(deck, startIdx + VOCAB_PER_PAGE);
    };
    // toggle « acquis » — marque les 4 mots de la page d'un seul coup
    const acqBtn = document.getElementById("acq");
    acqBtn.onclick = function () {
      // état cible : si TOUS déjà acquis → on décoche tout ; sinon on marque tout.
      const target = !words.every(function (w) { return isAcquired(deck.id, w.ar); });
      words.forEach(function (w) {
        if (isAcquired(deck.id, w.ar) !== target) toggleAcquired(deck.id, w.ar);
      });
      acqBtn.classList.toggle("on", target);
      acqBtn.setAttribute("aria-pressed", target ? "true" : "false");
    };
  }

  // =========================================================================
  //  HISTOIRE DES PROPHÈTES — lecture + versets cliquables + récitation
  // =========================================================================
  let audioEl = null, audioBtn = null;
  function stopAudio() {
    if (audioEl) { audioEl.pause(); audioEl = null; }
    if (audioBtn) { audioBtn.classList.remove("playing"); audioBtn.innerHTML = t("stories.listen"); audioBtn = null; }
  }
  function playAudio(url, btn) {
    if (audioEl && audioBtn === btn) { stopAudio(); return; }
    stopAudio();
    audioEl = new Audio(url); audioBtn = btn;
    btn.classList.add("playing"); btn.innerHTML = t("stories.pause");
    audioEl.onended = stopAudio;
    audioEl.onerror = function () { btn.innerHTML = t("stories.audioErr"); };
    audioEl.play().catch(function () { btn.innerHTML = t("stories.audioOff"); });
  }

  function screenStories() {
    stopAudio();
    let rows = "";
    STORIES.forEach(function (s) {
      // Backward-compat: legacy `titleFr` (string) alongside modern `title` (bilingual object).
      const title = pickLang(s.title);
      const titleLatin = pickLang(s.titleFr || s.titleLatin || s.titleEn);
      const subtitle = pickLang(s.subtitle);
      rows += '<div class="list-row"><button class="row-main" data-story="' + s.id + '">' +
                '<span class="list-ic" dir="rtl">ق</span>' +
                '<span class="list-meta">' +
                  '<span class="list-title" dir="rtl">' + title + "</span>" +
                  '<span class="list-sub">' + titleLatin + " — " + subtitle + "</span>" +
                "</span></button></div>";
    });
    shell("stories",
      '<div class="section-head"><h1>' + t("stories.title") + "</h1>" +
        '<p class="greeting">' + t("stories.intro") + "</p></div>" +
      '<div class="list">' + rows + "</div>"
    );
    Array.prototype.forEach.call(document.querySelectorAll(".row-main"), function (b) {
      b.onclick = function () {
        const s = STORIES.filter(function (x) { return x.id === b.getAttribute("data-story"); })[0];
        if (s) readStory(s, 0);
      };
    });
  }

  // Une « planche » = 2 cartes consécutives (4 phrases). On avance de 2 en 2.
  const STORY_CARDS_PER_SPREAD = 2;
  function readStory(story, i) {
    stopAudio();
    const total = story.cards.length;
    if (typeof i !== "number") i = 0;
    // On aligne toujours sur un début de planche.
    i = i - (i % STORY_CARDS_PER_SPREAD);
    if (i < 0) i = 0;
    if (i >= total) i = total - (((total - 1) % STORY_CARDS_PER_SPREAD) + 1) + 1;

    const spreads = Math.ceil(total / STORY_CARDS_PER_SPREAD);
    const spreadIdx = Math.floor(i / STORY_CARDS_PER_SPREAD);
    const pct = Math.round((spreadIdx / spreads) * 100);
    const last = spreadIdx === spreads - 1;

    const LOUPE = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><line x1="15.5" y1="15.5" x2="21" y2="21"/></svg>';
    const lang = currentLang();
    const TYPE_FR = { nom: "اسم · nom", verbe: "فعل · verbe", particule: "حرف · particule", pronom: "ضمير · pronom" };
    const TYPE_EN = { nom: "اسم · noun", verbe: "فعل · verb", particule: "حرف · particle", pronom: "ضمير · pronoun" };
    const TYPE = lang === "fr" ? TYPE_FR : TYPE_EN;
    function renderAn(an) {
      let w = "";
      an.words.forEach(function (wd) {
        w += '<div class="aw">' +
               '<span class="aw-word" dir="rtl">' + wd.w + "</span>" +
               '<span class="aw-body">' +
                 '<span class="aw-type t-' + wd.type + '" dir="rtl">' + (TYPE[wd.type] || wd.type) + "</span>" +
                 '<span class="aw-role" dir="ltr">' + pickLang(wd.role) + "</span>" +
               "</span>" +
             "</div>";
      });
      return '<div class="analyse-words">' + w + "</div>" +
             '<div class="analyse-take">' + pickLang(an.takeaway) + "</div>";
    }

    // Rendu d'UNE carte — préfixé pour ne pas collisionner d'IDs entre les
    // deux cartes de la planche (loupe & panneaux de versets).
    function renderCard(card, cardIdx) {
      let lines = "";
      card.ar.forEach(function (a, idx) {
        const glossField = (card.fr && card.fr[idx]) || (card.gloss && card.gloss[idx]) || "";
        const anId = "an-" + cardIdx + "-" + idx;
        lines += '<div class="story-line">' +
          '<p class="story-ar" dir="rtl">' + a + "</p>" +
          '<p class="story-fr">' + pickLang(glossField) + "</p>";
        if (card.an && card.an[idx]) {
          lines += '<button class="loupe-btn" data-target="' + anId + '" ' +
                     'title="' + t("stories.analyseTitle") + '" aria-label="' + t("stories.analyseTitle") + '">' + LOUPE + "</button>" +
                   '<div class="analyse-panel" id="' + anId + '" hidden>' +
                     '<div class="analyse-head">' + t("stories.analyseTitle") + "</div>" + renderAn(card.an[idx]) +
                   "</div>";
        }
        lines += "</div>";
      });

      let refsHtml = "";
      (card.refs || []).forEach(function (ref) {
        const v = VERSES[ref];
        if (!v) return;
        const pid = "panel-" + cardIdx + "-" + ref.replace(":", "-");
        const trans = lang === "en" ? (v.en || v.fr) : (v.fr || v.en);
        const nameField = pickLang(v.frName || v.name) || v.frName || "";
        refsHtml +=
          '<div class="verse-block">' +
            '<button class="verse-chip" data-panel="' + pid + '">' +
              '<span class="q-ic" dir="rtl">۩</span> ' + nameField + " " + ref +
            "</button>" +
            '<div class="verse-panel" id="' + pid + '" hidden>' +
              '<div class="verse-ar" dir="rtl">' + v.ar + "</div>" +
              '<div class="verse-fr">' + trans + "</div>" +
              '<div class="verse-foot">' +
                '<span class="verse-src" dir="rtl">' + v.surah + " · " + v.ayah + "</span>" +
                '<button class="btn-listen" data-audio="' + v.audio + '">' + t("stories.listen") + "</button>" +
              "</div>" +
            "</div>" +
          "</div>";
      });

      return '<div class="card story-card">' + lines +
             (refsHtml ? '<div class="verse-refs">' + refsHtml + "</div>" : "") +
             "</div>";
    }

    // Deux cartes par planche (la dernière planche peut n'en contenir qu'une).
    let cardsHtml = "";
    for (let k = 0; k < STORY_CARDS_PER_SPREAD; k++) {
      const c = story.cards[i + k];
      if (c) cardsHtml += renderCard(c, i + k);
    }

    const storyTitleLatin = pickLang(story.titleFr || story.titleLatin || story.titleEn);

    focus(
      '<div class="study story">' +
        '<div class="phase-label">' + t("stories.phase", storyTitleLatin, spreadIdx + 1, spreads) + "</div>" +
        '<div class="progress"><span style="width:' + pct + '%"></span></div>' +
        '<div class="story-spread">' + cardsHtml + "</div>" +
        '<div class="nav-row">' +
          (spreadIdx > 0 ? '<button class="btn btn-ghost" id="prev">' + t("btn.prev") + "</button>" : '<span class="spacer"></span>') +
          '<button class="btn btn-primary" id="next">' + (last ? t("btn.finish") : t("btn.next")) + "</button>" +
        "</div>" +
      "</div>",
      t("nav.stories"), function () { stopAudio(); screenStories(); }
    );

    if (spreadIdx > 0) document.getElementById("prev").onclick = function () {
      readStory(story, i - STORY_CARDS_PER_SPREAD);
    };
    document.getElementById("next").onclick = function () {
      if (last) { stopAudio(); screenStories(); }
      else readStory(story, i + STORY_CARDS_PER_SPREAD);
    };
    Array.prototype.forEach.call(document.querySelectorAll(".verse-chip"), function (chip) {
      chip.onclick = function () {
        const panel = document.getElementById(chip.getAttribute("data-panel"));
        if (!panel) return;
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
        optsHtml += '<button class="opt" data-correct="' + o.correct + '" dir="ltr">' + bidi(pickLang(o.text)) + "</button>";
      });

      focus(
        '<div class="study">' +
          '<div class="phase-label">' + t("quiz.phase", cfg.label, i + 1, total) + "</div>" +
          '<div class="progress"><span style="width:' + pct + '%"></span></div>' +
          '<div class="question" dir="ltr">' + bidi(pickLang(item.q)) + "</div>" +
          '<div class="options">' + optsHtml + "</div>" +
          '<div class="feedback" id="feedback" hidden></div>' +
          '<div class="nav-row center"><button class="btn btn-primary" id="next" hidden>' +
            (i === total - 1 ? t("quiz.seeResult") : t("quiz.nextQ")) + "</button></div>" +
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
          fb.innerHTML = (wasCorrect ? t("quiz.correct") : t("quiz.wrong")) + bidi(pickLang(item.explain));
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
      const msg = ratio === 1 ? t("quiz.perfect")
                : ratio >= 0.6 ? t("quiz.good")
                : t("quiz.retry");
      focus(
        '<div class="celebrate">' +
          '<div class="mashallah" dir="rtl">' + arabic + "</div>" +
          '<div class="score-big">' + score + "<span>/" + total + "</span></div>" +
          "<p>" + msg + "</p>" +
          '<div class="result-actions">' +
            '<button class="btn btn-primary" id="again">' + t("quiz.again") + "</button>" +
            '<button class="btn btn-ghost" id="done">' + t("quiz.done") + "</button>" +
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
