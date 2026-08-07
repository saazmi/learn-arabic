/* =========================================================================
   QUIZ DYNAMIQUES — gabarits (patterns) + données aléatoires.
   Un quiz n'est plus une liste figée : on remplit des gabarits de questions
   avec des mots tirés au hasard dans des « pools ». Résultat : on peut refaire
   un quiz pour réviser sans retomber sur les mêmes questions.

   window.QUIZ expose :
     buildLessonQuiz(lessonId, n)  → questions pour une leçon de grammaire
     buildGrammarQuiz(n)           → révision de TOUTE la grammaire
     buildVocabQuiz(deckId, n)     → quiz d'un jeu de vocabulaire
   Chaque question : { q:{fr,en}, options:[{fr,en}…], answer:index, explain:{fr,en} }
   Champs texte bilingues — l'UI (pickLang) choisit la langue.
   ========================================================================= */

(function () {
  "use strict";

  // ---- utilitaires aléatoires -------------------------------------------
  function rand(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function sample(a, n) { return shuffle(a).slice(0, n); }

  // Emballe deux chaînes fr/en. Si en est absent, on retombe sur fr.
  function L(fr, en) { return { fr: fr, en: en == null ? fr : en }; }

  // ---- POOLS de mots (bilingues) ----------------------------------------
  //   fr/en   : gloses des deux langues
  //   pl      : forme plurielle réelle et vérifiée
  //   plType  : "broken" (jamʿ taksīr) | "sound-f" (retire ة + ات)
  const NOUNS = [
    { ar: "كِتَاب",    fr: "livre",   en: "book",   g: "m", pl: "كُتُب",       plType: "broken" },
    { ar: "رَجُل",     fr: "homme",   en: "man",    g: "m", pl: "رِجَال",      plType: "broken" },
    { ar: "بَيْت",     fr: "maison",  en: "house",  g: "m", pl: "بُيُوت",      plType: "broken" },
    { ar: "قَمَر",     fr: "lune",    en: "moon",   g: "m", pl: "أَقْمَار",    plType: "broken" },
    { ar: "قَلَم",     fr: "stylo",   en: "pen",    g: "m", pl: "أَقْلَام",    plType: "broken" },
    { ar: "بَاب",      fr: "porte",   en: "door",   g: "m", pl: "أَبْوَاب",    plType: "broken" },
    { ar: "وَلَد",     fr: "garçon",  en: "boy",    g: "m", pl: "أَوْلَاد",    plType: "broken" },
    { ar: "مَدْرَسَة", fr: "école",   en: "school", g: "f", pl: "مَدَارِس",    plType: "broken" },
    { ar: "شَجَرَة",   fr: "arbre",   en: "tree",   g: "f", pl: "أَشْجَار",    plType: "broken" },
    { ar: "سَيَّارَة", fr: "voiture", en: "car",    g: "f", pl: "سَيَّارَات",  plType: "sound-f" },
    { ar: "شَمْس",     fr: "soleil",  en: "sun",    g: "f", pl: "شُمُوس",      plType: "broken" },
    { ar: "أَرْض",     fr: "terre",   en: "earth",  g: "f", pl: "أَرَاضٍ",     plType: "broken" },
    { ar: "يَد",       fr: "main",    en: "hand",   g: "f", pl: "أَيْدٍ",      plType: "broken" },
  ];
  const VERBS = [
    { ar: "خَلَقَ", fr: "il a créé",     en: "he created" },
    { ar: "قَالَ", fr: "il a dit",       en: "he said" },
    { ar: "ذَهَبَ", fr: "il est allé",   en: "he went" },
    { ar: "عَلِمَ", fr: "il a su",       en: "he knew" },
    { ar: "كَتَبَ", fr: "il a écrit",    en: "he wrote" },
    { ar: "سَمِعَ", fr: "il a entendu",  en: "he heard" },
    { ar: "نَصَرَ", fr: "il a secouru",  en: "he helped" },
  ];
  const PARTICLES = [
    { ar: "فِي",   fr: "dans",         en: "in" },
    { ar: "مِنْ",  fr: "de, depuis",   en: "from" },
    { ar: "إِلَى", fr: "vers",         en: "toward" },
    { ar: "عَلَى", fr: "sur",          en: "on, upon" },
    { ar: "وَ",    fr: "et",           en: "and" },
    { ar: "هَلْ",  fr: "est-ce que",   en: "(question particle)" },
  ];
  const PLURAL_M = [
    { ar: "مُسْلِم", fr: "musulman",   en: "Muslim" },
    { ar: "مُؤْمِن", fr: "croyant",    en: "believer" },
    { ar: "طَالِب",  fr: "étudiant",   en: "student" },
    { ar: "كَافِر",  fr: "mécréant",   en: "disbeliever" },
  ];
  // pluriels de choses (non-humains) — pour la règle d'accord au féminin singulier
  const NONHUMAN = [
    { pl: "كُتُب",    fr: "livres",  en: "books" },
    { pl: "بُيُوت",   fr: "maisons", en: "houses" },
    { pl: "أَقْلَام", fr: "stylos",  en: "pens" },
    { pl: "أَيَّام",  fr: "jours",   en: "days" },
    { pl: "أَبْوَاب", fr: "portes",  en: "doors" },
  ];

  // lettres solaires (le ل de الـ ne se prononce pas)
  const SOLAR = "تثدذرزسشصضطظلن";
  function isSolar(word) { return SOLAR.indexOf(word.ar.charAt(0)) !== -1; }
  function endsTaa(w) { return /ة$/.test(w.ar); }
  // NB : les mots du pool finissant par ة portent déjà une fatha ; on n'en
  // rajoute pas, sinon on aurait deux fathas empilées.
  function soundFPlural(w) { return w.ar.replace(/ة$/, "") + "ات"; }
  function soundMPlural(w) { return w.ar.replace(/ة$/, "") + "ون"; }

  // =========================================================================
  //  GABARITS DE GRAMMAIRE — chacun tagué par leçon(s)
  //  make() renvoie une question { q, options, answer, explain } bilingue.
  // =========================================================================
  const T = {
    type: {
      lessons: ["g1"],
      make: function () {
        const bag = NOUNS.map(w => ({ w: w, t: 0 }))
          .concat(VERBS.map(w => ({ w: w, t: 1 })))
          .concat(PARTICLES.map(w => ({ w: w, t: 2 })));
        const p = rand(bag);
        const whyFr = ["Une personne / une chose → un اِسْم (nom).",
                       "Une action → un فِعْل (verbe).",
                       "Un mot-outil invariable → un حَرْف (particule)."][p.t];
        const whyEn = ["A person / a thing → a اِسْم (noun).",
                       "An action → a فِعْل (verb).",
                       "An invariable function-word → a حَرْف (particle)."][p.t];
        return {
          q: L("Quel type de mot est " + p.w.ar + " (" + p.w.fr + ") ?",
               "What kind of word is " + p.w.ar + " (" + p.w.en + ")?"),
          options: [L("اِسْم — nom", "اِسْم — noun"),
                    L("فِعْل — verbe", "فِعْل — verb"),
                    L("حَرْف — particule", "حَرْف — particle")],
          answer: p.t,
          explain: L(whyFr, whyEn),
        };
      },
    },

    defindef: {
      lessons: ["g1"],
      make: function () {
        const w = rand(NOUNS);
        return {
          q: L("Le mot " + w.ar + "ٌ (avec tanwin) est…",
               "The word " + w.ar + "ٌ (with tanwīn) is…"),
          options: [L("indéfini (نَكِرَة)", "indefinite (نَكِرَة)"),
                    L("défini (مَعْرِفَة)", "definite (مَعْرِفَة)")],
          answer: 0,
          explain: L("Le tanwin (ـٌ ـً ـٍ) est la marque de l'indéfini.",
                     "The tanwīn (ـٌ ـً ـٍ) is the mark of the indefinite."),
        };
      },
    },

    makedef: {
      lessons: ["g1"],
      make: function () {
        const w = rand(NOUNS);
        return {
          q: L("Pour rendre " + w.ar + " (" + w.fr + ") défini, on ajoute…",
               "To make " + w.ar + " (" + w.en + ") definite, you add…"),
          options: [L("الـ au début", "الـ at the start"),
                    L("un tanwin", "a tanwīn"),
                    L("une chadda", "a shadda")],
          answer: 0,
          explain: L("الـ rend le mot défini — et le tanwin disparaît alors.",
                     "الـ makes the word definite — and the tanwīn then drops."),
        };
      },
    },

    solar: {
      lessons: ["g1"],
      make: function () {
        const w = rand(NOUNS);
        const solar = isSolar(w);
        return {
          q: L("Dans الـ + " + w.ar + " (" + w.fr + "), prononce-t-on le ل ?",
               "In الـ + " + w.ar + " (" + w.en + "), is the ل pronounced?"),
          options: [L("Oui — lettre lunaire", "Yes — moon letter"),
                    L("Non — lettre solaire", "No — sun letter")],
          answer: solar ? 1 : 0,
          explain: L(
            solar ? w.ar + " commence par une lettre solaire : le ل est muet (chadda)."
                  : w.ar + " commence par une lettre lunaire : le ل se prononce.",
            solar ? w.ar + " starts with a sun letter: the ل is silent (shadda)."
                  : w.ar + " starts with a moon letter: the ل is pronounced."),
        };
      },
    },

    phrase: {
      lessons: ["g2"],
      make: function () {
        const w = rand(NOUNS);
        const article = w.g === "f" ? "une " : "un ";
        return {
          q: L("Pour dire « ceci est " + article + w.fr + " », en arabe on…",
               "To say 'this is a " + w.en + "', in Arabic you…"),
          options: [L("accole les deux mots (pas de verbe « être »)",
                      "just put the two words side by side (no verb 'to be')"),
                    L("utilise le verbe « être »",
                      "use the verb 'to be'")],
          answer: 0,
          explain: L("La phrase nominale accole مبتدأ + خبر : هٰذَا " + w.ar + "ٌ.",
                     "The nominal sentence joins mubtadaʾ + khabar: هٰذَا " + w.ar + "ٌ."),
        };
      },
    },

    demon: {
      lessons: ["g2"],
      make: function () {
        const w = rand(NOUNS);
        const explFr = endsTaa(w)
          ? "Se termine par ة → féminin → هٰذِهِ."
          : (w.g === "f" ? "Féminin (à connaître) → هٰذِهِ." : "Masculin → هٰذَا.");
        const explEn = endsTaa(w)
          ? "Ends in ة → feminine → هٰذِهِ."
          : (w.g === "f" ? "Feminine (to memorise) → هٰذِهِ." : "Masculine → هٰذَا.");
        return {
          q: L("Quel démonstratif pour " + w.ar + " (" + w.fr + ") ?",
               "Which demonstrative for " + w.ar + " (" + w.en + ")?"),
          options: [L("هٰذَا (masculin)", "هٰذَا (masculine)"),
                    L("هٰذِهِ (féminin)", "هٰذِهِ (feminine)")],
          answer: w.g === "f" ? 1 : 0,
          explain: L(explFr, explEn),
        };
      },
    },

    idafa: {
      lessons: ["g2"],
      make: function () {
        const a = rand(NOUNS);
        return {
          q: L("Dans une إضافة (ex. « le " + a.fr + " de … »), le 1er mot (مُضَاف)…",
               "In an iḍāfa (e.g. 'the " + a.en + " of …'), the 1st word (muḍāf)…"),
          options: [L("ne prend ni الـ ni tanwin", "takes neither الـ nor tanwīn"),
                    L("prend toujours الـ",       "always takes الـ"),
                    L("porte un tanwin",           "carries a tanwīn")],
          answer: 0,
          explain: L("Le مُضَاف reste nu ; c'est le 2e mot qui est au génitif (kasra).",
                     "The muḍāf stays bare; it's the 2nd word that carries the genitive (kasra)."),
        };
      },
    },

    gender: {
      lessons: ["g3"],
      make: function () {
        const w = rand(NOUNS);
        const explFr = endsTaa(w)
          ? "La ة marque le féminin."
          : (w.g === "f" ? "Féminin sans marqueur — à mémoriser (fréquent dans le Coran)."
                         : "Pas de marqueur → masculin.");
        const explEn = endsTaa(w)
          ? "The ة marks the feminine."
          : (w.g === "f" ? "Feminine with no marker — memorise it (frequent in the Qur'ān)."
                         : "No marker → masculine.");
        return {
          q: L(w.ar + " (" + w.fr + ") est…",
               w.ar + " (" + w.en + ") is…"),
          options: [L("masculin", "masculine"),
                    L("féminin",  "feminine")],
          answer: w.g === "f" ? 1 : 0,
          explain: L(explFr, explEn),
        };
      },
    },

    case_prep: {
      lessons: ["g3"],
      make: function () {
        const p = rand(PARTICLES.filter(x => ["فِي", "مِنْ", "إِلَى", "عَلَى"].indexOf(x.ar) !== -1));
        return {
          q: L("Après la préposition " + p.ar + " (" + p.fr + "), le nom est au cas…",
               "After the preposition " + p.ar + " (" + p.en + "), the noun is in the case…"),
          options: [L("جَرّ (kasra)",  "jarr (kasra)"),
                    L("رَفْع (damma)", "rafʿ (ḍamma)"),
                    L("نَصْب (fatha)", "naṣb (fatḥa)")],
          answer: 0,
          explain: L("Après une préposition → génitif (جَرّ), marqué par la kasra.",
                     "After a preposition → genitive (jarr), marked by the kasra."),
        };
      },
    },

    plural_m: {
      lessons: ["g3"],
      make: function () {
        const w = rand(PLURAL_M);
        return {
          q: L("Le pluriel masculin sain de " + w.ar + " (" + w.fr + "), au cas sujet, se termine par…",
               "The sound masculine plural of " + w.ar + " (" + w.en + "), in the subject case, ends with…"),
          options: [L("ـُونَ", "ـُونَ"), L("ـِينَ", "ـِينَ"), L("ـَات", "ـَات")],
          answer: 0,
          explain: L("Masculin sain, cas sujet : ـُونَ (et ـِينَ dans les autres cas).",
                     "Sound masculine, subject case: ـُونَ (and ـِينَ in the other cases)."),
        };
      },
    },

    plural_of: {
      lessons: ["g3"],
      make: function () {
        const w = rand(NOUNS.filter(function (x) { return x.pl; }));
        const sf = soundFPlural(w);
        const sm = soundMPlural(w);
        const opts = [L(w.pl, w.pl)];
        if (sf !== w.pl) opts.push(L(sf, sf));
        if (sm !== w.pl && sm !== sf) opts.push(L(sm, sm));
        const isBroken = w.plType === "broken";
        return {
          q: L("Quel est le pluriel de " + w.ar + " (" + w.fr + ") ?",
               "What is the plural of " + w.ar + " (" + w.en + ")?"),
          options: opts,
          answer: 0,
          explain: L(
            isBroken
              ? w.ar + " a un pluriel BRISÉ (جمع تكسير) : " + w.pl +
                " — à mémoriser. La règle sain-féminin donnerait " + sf +
                ", mais elle ne s'applique pas ici."
              : w.ar + " suit la règle sain-féminin : retire ة, ajoute ات → " + w.pl + ".",
            isBroken
              ? w.ar + " has a BROKEN plural (جمع تكسير): " + w.pl +
                " — memorise it. The sound-feminine rule would give " + sf +
                ", but it doesn't apply here."
              : w.ar + " follows the sound-feminine rule: drop ة, add ات → " + w.pl + "."
          ),
        };
      },
    },

    suffix_my: {
      lessons: ["g4"],
      make: function () {
        const w = rand(NOUNS.filter(x => !endsTaa(x)));
        return {
          q: L("Comment dire « mon " + w.fr + " » ?",
               "How do you say 'my " + w.en + "'?"),
          options: [L(w.ar + "ِي", w.ar + "ِي"),
                    L(w.ar + "ُكَ", w.ar + "ُكَ"),
                    L(w.ar + "ُهُ", w.ar + "ُهُ")],
          answer: 0,
          explain: L("Le suffixe ـِي signifie « mon » (كَ = ton, هُ = son).",
                     "The suffix ـِي means 'my' (كَ = your, هُ = his)."),
        };
      },
    },

    adj_place: {
      lessons: ["g4"],
      make: function () {
        const w = rand(NOUNS);
        return {
          q: L("Où se place l'adjectif qui qualifie " + w.ar + " (" + w.fr + ") ?",
               "Where does the adjective describing " + w.ar + " (" + w.en + ") go?"),
          options: [L("après le nom", "after the noun"),
                    L("avant le nom", "before the noun")],
          answer: 0,
          explain: L("L'adjectif (النَّعْت) suit toujours le nom qu'il qualifie.",
                     "The adjective (an-naʿt) always follows the noun it describes."),
        };
      },
    },

    adj_agree: {
      lessons: ["g4"],
      make: function () {
        const w = rand(NOUNS);
        return {
          q: L("Pour accorder un adjectif à " + w.ar + " (" + w.fr + "), sur combien de points s'accorde-t-il ?",
               "To agree an adjective with " + w.ar + " (" + w.en + "), how many points must it match?"),
          options: [L("4 : genre, nombre, définition, cas", "4: gender, number, definiteness, case"),
                    L("1 : le genre",                       "1: gender"),
                    L("2 : genre et nombre",                "2: gender and number")],
          answer: 0,
          explain: L("Genre, nombre, définition (نكرة/معرفة) ET cas — les quatre à la fois.",
                     "Gender, number, definiteness (نكرة/معرفة) AND case — all four at once."),
        };
      },
    },

    nonhuman: {
      lessons: ["g4"],
      make: function () {
        const w = rand(NONHUMAN);
        return {
          q: L("Pour qualifier " + w.pl + " (" + w.fr + ", un pluriel de choses), l'adjectif est…",
               "To describe " + w.pl + " (" + w.en + ", a plural of things), the adjective is…"),
          options: [L("féminin singulier", "feminine singular"),
                    L("masculin pluriel",  "masculine plural")],
          answer: 0,
          explain: L("Règle du non-humain : l'adjectif se met au féminin singulier — " + w.pl + " جَدِيدَة.",
                     "Non-human rule: the adjective takes feminine singular — " + w.pl + " جَدِيدَة."),
        };
      },
    },
  };

  // =========================================================================
  //  MOTEUR — construit un quiz exhaustif puis varié
  // =========================================================================
  function build(templates, n) {
    templates = templates.filter(Boolean);
    const T = templates.length;
    if (!T) return [];
    const quota = Math.floor(n / T) + 1;

    const out = [];
    const seen = {};
    const count = new Map();
    const exhausted = new Set();
    templates.forEach(function (t) { count.set(t, 0); });

    // essaie d'ajouter une question INÉDITE issue du gabarit t
    function tryAdd(t, tries) {
      for (let k = 0; k < tries; k++) {
        const q = t.make();
        // on déduplique sur la version FR pour rester stable inter-langues
        const key = q && (typeof q.q === "string" ? q.q : q.q.fr);
        if (q && !seen[key]) {
          seen[key] = 1; count.set(t, count.get(t) + 1); out.push(q); return true;
        }
      }
      return false;
    }

    // 1) couverture : un de chaque gabarit
    shuffle(templates).forEach(function (t) { if (out.length < n) tryAdd(t, 6); });

    // 2) remplissage dispersé sous le quota
    let guard = 0;
    while (out.length < n && guard < 800) {
      guard++;
      const eligible = templates.filter(function (t) {
        return count.get(t) < quota && !exhausted.has(t);
      });
      if (!eligible.length) break;
      const t = rand(eligible);
      if (!tryAdd(t, 8)) exhausted.add(t);
    }

    // 3) filet : relâcher le quota si nécessaire
    guard = 0;
    while (out.length < n && guard < 800) {
      guard++;
      const usable = templates.filter(function (t) { return !exhausted.has(t); });
      if (!usable.length) break;
      const t = rand(usable);
      if (!tryAdd(t, 8)) exhausted.add(t);
    }

    return shuffle(out);
  }

  function templatesForLesson(id) {
    return Object.keys(T).map(k => T[k]).filter(t => t.lessons.indexOf(id) !== -1);
  }
  function allGrammarTemplates() {
    return Object.keys(T).map(k => T[k]);
  }

  // ---- quiz de vocabulaire ----------------------------------------------
  //   w.fr est maintenant {fr, en} (voir vocab.js). On lit les deux langues
  //   pour construire des questions bilingues.
  function vocabDeck(id) {
    return (window.VOCAB || []).filter(d => d.id === id)[0];
  }
  function gloss(w, lang) {
    if (!w || w.fr == null) return "";
    if (typeof w.fr === "string") return w.fr;      // rétrocompat
    return w.fr[lang] || w.fr.fr || w.fr.en || "";
  }
  function buildVocabQuiz(deckId, n) {
    const deck = vocabDeck(deckId);
    if (!deck) return [];
    const words = deck.words;
    const picks = words.length <= n ? shuffle(words) : sample(words, n);
    return picks.map(function (w, i) {
      const others = words.filter(x => x.ar !== w.ar);
      const gFr = gloss(w, "fr"), gEn = gloss(w, "en");
      if (i % 2 === 0) {
        // sens : que signifie {ar} ({tr}) ?
        const distract = sample(others, 3);
        return {
          q: L("Que signifie " + w.ar + " (" + w.tr + ") ?",
               "What does " + w.ar + " (" + w.tr + ") mean?"),
          options: [L(gFr, gEn)].concat(
            distract.map(x => L(gloss(x, "fr"), gloss(x, "en")))
          ),
          answer: 0,
          explain: L(w.ar + " — " + w.tr + " = " + gFr + ".",
                     w.ar + " — " + w.tr + " = " + gEn + "."),
        };
      } else {
        // reconnaissance : quel mot signifie « {fr} » ?
        const distract = sample(others, 3);
        return {
          q: L("Quel mot signifie « " + gFr + " » ?",
               "Which word means '" + gEn + "'?"),
          options: [L(w.ar, w.ar)].concat(distract.map(x => L(x.ar, x.ar))),
          answer: 0,
          explain: L(gFr + " = " + w.ar + " (" + w.tr + ").",
                     gEn + " = " + w.ar + " (" + w.tr + ")."),
        };
      }
    });
  }

  window.QUIZ = {
    buildLessonQuiz: function (id, n) { return build(templatesForLesson(id), n || 10); },
    buildGrammarQuiz: function (n) { return build(allGrammarTemplates(), n || 10); },
    buildVocabQuiz: function (id, n) { return buildVocabQuiz(id, n || 10); },
  };
})();
