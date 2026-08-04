/* =========================================================================
   QUIZ DYNAMIQUES — gabarits (patterns) + données aléatoires.
   Un quiz n'est plus une liste figée : on remplit des gabarits de questions
   avec des mots tirés au hasard dans des « pools ». Résultat : on peut refaire
   un quiz pour réviser sans retomber sur les mêmes questions.

   window.QUIZ expose :
     buildLessonQuiz(lessonId, n)  → questions pour une leçon de grammaire
     buildGrammarQuiz(n)           → révision de TOUTE la grammaire
     buildVocabQuiz(deckId, n)     → quiz d'un jeu de vocabulaire
   Chaque question : { q, options:[texte…], answer:index, explain }
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
  // tire n éléments distincts
  function sample(a, n) { return shuffle(a).slice(0, n); }

  // ---- POOLS de mots (pour la grammaire) --------------------------------
  const NOUNS = [
    { ar: "كِتَاب", fr: "livre", g: "m" },
    { ar: "رَجُل", fr: "homme", g: "m" },
    { ar: "بَيْت", fr: "maison", g: "m" },
    { ar: "قَمَر", fr: "lune", g: "m" },
    { ar: "قَلَم", fr: "stylo", g: "m" },
    { ar: "بَاب", fr: "porte", g: "m" },
    { ar: "وَلَد", fr: "garçon", g: "m" },
    { ar: "مَدْرَسَة", fr: "école", g: "f" },
    { ar: "شَجَرَة", fr: "arbre", g: "f" },
    { ar: "سَيَّارَة", fr: "voiture", g: "f" },
    { ar: "شَمْس", fr: "soleil", g: "f" },
    { ar: "أَرْض", fr: "terre", g: "f" },
    { ar: "يَد", fr: "main", g: "f" },
  ];
  const VERBS = [
    { ar: "خَلَقَ", fr: "il a créé" },
    { ar: "قَالَ", fr: "il a dit" },
    { ar: "ذَهَبَ", fr: "il est allé" },
    { ar: "عَلِمَ", fr: "il a su" },
    { ar: "كَتَبَ", fr: "il a écrit" },
    { ar: "سَمِعَ", fr: "il a entendu" },
    { ar: "نَصَرَ", fr: "il a secouru" },
  ];
  const PARTICLES = [
    { ar: "فِي", fr: "dans" },
    { ar: "مِنْ", fr: "de, depuis" },
    { ar: "إِلَى", fr: "vers" },
    { ar: "عَلَى", fr: "sur" },
    { ar: "وَ", fr: "et" },
    { ar: "هَلْ", fr: "est-ce que" },
  ];
  const PLURAL_M = [
    { ar: "مُسْلِم", fr: "musulman" },
    { ar: "مُؤْمِن", fr: "croyant" },
    { ar: "طَالِب", fr: "étudiant" },
    { ar: "كَافِر", fr: "mécréant" },
  ];
  // pluriels de choses (non-humains) — pour la règle d'accord au féminin singulier
  const NONHUMAN = [
    { pl: "كُتُب", fr: "livres" },
    { pl: "بُيُوت", fr: "maisons" },
    { pl: "أَقْلَام", fr: "stylos" },
    { pl: "أَيَّام", fr: "jours" },
    { pl: "أَبْوَاب", fr: "portes" },
  ];

  // lettres solaires (le ل de الـ ne se prononce pas)
  const SOLAR = "تثدذرزسشصضطظلن";
  function isSolar(word) { return SOLAR.indexOf(word.ar.charAt(0)) !== -1; }
  function endsTaa(w) { return /ة$/.test(w.ar); }

  // =========================================================================
  //  GABARITS DE GRAMMAIRE — chacun tagué par leçon(s)
  //  make() renvoie une question { q, options, answer, explain }
  // =========================================================================
  const T = {
    type: {
      lessons: ["g1"],
      make: function () {
        const bag = NOUNS.map(w => ({ w: w, t: 0 }))
          .concat(VERBS.map(w => ({ w: w, t: 1 })))
          .concat(PARTICLES.map(w => ({ w: w, t: 2 })));
        const p = rand(bag);
        const why = ["Une personne / une chose → un اِسْم (nom).",
                     "Une action → un فِعْل (verbe).",
                     "Un mot-outil invariable → un حَرْف (particule)."][p.t];
        return {
          q: "Quel type de mot est " + p.w.ar + " (" + p.w.fr + ") ?",
          options: ["اِسْم — nom", "فِعْل — verbe", "حَرْف — particule"],
          answer: p.t,
          explain: why,
        };
      },
    },

    defindef: {
      lessons: ["g1"],
      make: function () {
        const w = rand(NOUNS);
        return {
          q: "Le mot " + w.ar + "ٌ (avec tanwin) est…",
          options: ["indéfini (نَكِرَة)", "défini (مَعْرِفَة)"],
          answer: 0,
          explain: "Le tanwin (ـٌ ـً ـٍ) est la marque de l'indéfini.",
        };
      },
    },

    makedef: {
      lessons: ["g1"],
      make: function () {
        const w = rand(NOUNS);
        return {
          q: "Pour rendre " + w.ar + " (" + w.fr + ") défini, on ajoute…",
          options: ["الـ au début", "un tanwin", "une chadda"],
          answer: 0,
          explain: "الـ rend le mot défini — et le tanwin disparaît alors.",
        };
      },
    },

    solar: {
      lessons: ["g1"],
      make: function () {
        const w = rand(NOUNS);
        const solar = isSolar(w);
        return {
          q: "Dans الـ + " + w.ar + " (" + w.fr + "), prononce-t-on le ل ?",
          options: ["Oui — lettre lunaire", "Non — lettre solaire"],
          answer: solar ? 1 : 0,
          explain: solar
            ? w.ar + " commence par une lettre solaire : le ل est muet (chadda)."
            : w.ar + " commence par une lettre lunaire : le ل se prononce.",
        };
      },
    },

    phrase: {
      lessons: ["g2"],
      make: function () {
        const w = rand(NOUNS);
        return {
          q: "Pour dire « ceci est " + (w.g === "f" ? "une " : "un ") + w.fr + " », en arabe on…",
          options: ["accole les deux mots (pas de verbe « être »)", "utilise le verbe « être »"],
          answer: 0,
          explain: "La phrase nominale accole مبتدأ + خبر : هٰذَا " + w.ar + "ٌ.",
        };
      },
    },

    demon: {
      lessons: ["g2"],
      make: function () {
        const w = rand(NOUNS);
        return {
          q: "Quel démonstratif pour " + w.ar + " (" + w.fr + ") ?",
          options: ["هٰذَا (masculin)", "هٰذِهِ (féminin)"],
          answer: w.g === "f" ? 1 : 0,
          explain: endsTaa(w)
            ? "Se termine par ة → féminin → هٰذِهِ."
            : (w.g === "f" ? "Féminin (à connaître) → هٰذِهِ." : "Masculin → هٰذَا."),
        };
      },
    },

    idafa: {
      lessons: ["g2"],
      make: function () {
        const a = rand(NOUNS);
        return {
          q: "Dans une إضافة (ex. « le " + a.fr + " de … »), le 1er mot (مُضَاف)…",
          options: ["ne prend ni الـ ni tanwin", "prend toujours الـ", "porte un tanwin"],
          answer: 0,
          explain: "Le مُضَاف reste nu ; c'est le 2e mot qui est au génitif (kasra).",
        };
      },
    },

    gender: {
      lessons: ["g3"],
      make: function () {
        const w = rand(NOUNS);
        return {
          q: w.ar + " (" + w.fr + ") est…",
          options: ["masculin", "féminin"],
          answer: w.g === "f" ? 1 : 0,
          explain: endsTaa(w)
            ? "La ة marque le féminin."
            : (w.g === "f" ? "Féminin sans marqueur — à mémoriser (fréquent dans le Coran)."
                           : "Pas de marqueur → masculin."),
        };
      },
    },

    case_prep: {
      lessons: ["g3"],
      make: function () {
        const p = rand(PARTICLES.filter(x => ["فِي", "مِنْ", "إِلَى", "عَلَى"].indexOf(x.ar) !== -1));
        return {
          q: "Après la préposition " + p.ar + " (" + p.fr + "), le nom est au cas…",
          options: ["جَرّ (kasra)", "رَفْع (damma)", "نَصْب (fatha)"],
          answer: 0,
          explain: "Après une préposition → génitif (جَرّ), marqué par la kasra.",
        };
      },
    },

    plural_m: {
      lessons: ["g3"],
      make: function () {
        const w = rand(PLURAL_M);
        return {
          q: "Le pluriel masculin sain de " + w.ar + " (" + w.fr + "), au cas sujet, se termine par…",
          options: ["ـُونَ", "ـِينَ", "ـَات"],
          answer: 0,
          explain: "Masculin sain, cas sujet : ـُونَ (et ـِينَ dans les autres cas).",
        };
      },
    },

    plural_f: {
      lessons: ["g3"],
      make: function () {
        const w = rand(NOUNS.filter(endsTaa));
        return {
          q: "Comment former le pluriel de " + w.ar + " (" + w.fr + ") ?",
          options: ["retirer ة puis ajouter ات", "ajouter ون", "ajouter ين"],
          answer: 0,
          explain: "Féminin sain : on retire la ة et on ajoute ات.",
        };
      },
    },

    suffix_my: {
      lessons: ["g4"],
      make: function () {
        const w = rand(NOUNS.filter(x => !endsTaa(x)));
        return {
          q: "Comment dire « mon " + w.fr + " » ?",
          options: [w.ar + "ِي", w.ar + "ُكَ", w.ar + "ُهُ"],
          answer: 0,
          explain: "Le suffixe ـِي signifie « mon » (كَ = ton, هُ = son).",
        };
      },
    },

    adj_place: {
      lessons: ["g4"],
      make: function () {
        const w = rand(NOUNS);
        return {
          q: "Où se place l'adjectif qui qualifie " + w.ar + " (" + w.fr + ") ?",
          options: ["après le nom", "avant le nom"],
          answer: 0,
          explain: "L'adjectif (النَّعْت) suit toujours le nom qu'il qualifie.",
        };
      },
    },

    adj_agree: {
      lessons: ["g4"],
      make: function () {
        const w = rand(NOUNS);
        return {
          q: "Pour accorder un adjectif à " + w.ar + " (" + w.fr + "), sur combien de points s'accorde-t-il ?",
          options: ["4 : genre, nombre, définition, cas", "1 : le genre", "2 : genre et nombre"],
          answer: 0,
          explain: "Genre, nombre, définition (نكرة/معرفة) ET cas — les quatre à la fois.",
        };
      },
    },

    nonhuman: {
      lessons: ["g4"],
      make: function () {
        const w = rand(NONHUMAN);
        return {
          q: "Pour qualifier " + w.pl + " (" + w.fr + ", un pluriel de choses), l'adjectif est…",
          options: ["féminin singulier", "masculin pluriel"],
          answer: 0,
          explain: "Règle du non-humain : l'adjectif se met au féminin singulier — " + w.pl + " جَدِيدَة.",
        };
      },
    },
  };

  // =========================================================================
  //  MOTEUR — construit un quiz exhaustif puis varié
  //  1) une question par gabarit (couverture complète du concept)
  //  2) on complète jusqu'à n avec des tirages frais (jamais deux fois la
  //     même question exacte)
  // =========================================================================
  function build(templates, n) {
    templates = templates.filter(Boolean);
    const T = templates.length;
    if (!T) return [];
    // quota : au mieux ⌊n/T⌋+1 questions d'un même gabarit (ex. 10 q, 4 gabarits → 3)
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
        if (q && !seen[q.q]) {
          seen[q.q] = 1; count.set(t, count.get(t) + 1); out.push(q); return true;
        }
      }
      return false;
    }

    // 1) couverture : un de chaque gabarit, dans un ordre aléatoire
    shuffle(templates).forEach(function (t) { if (out.length < n) tryAdd(t, 6); });

    // 2) remplissage DISPERSÉ : tirage aléatoire parmi les gabarits encore
    //    sous le quota — la distribution varie à chaque quiz
    let guard = 0;
    while (out.length < n && guard < 800) {
      guard++;
      const eligible = templates.filter(function (t) {
        return count.get(t) < quota && !exhausted.has(t);
      });
      if (!eligible.length) break;
      const t = rand(eligible);
      if (!tryAdd(t, 8)) exhausted.add(t);   // plus de question inédite pour ce gabarit
    }

    // 3) filet de sécurité : si trop peu de variété pour atteindre n sous le
    //    quota, on complète en relâchant le quota (rare — mieux vaut n questions)
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
  function vocabDeck(id) {
    return (window.VOCAB || []).filter(d => d.id === id)[0];
  }
  function buildVocabQuiz(deckId, n) {
    const deck = vocabDeck(deckId);
    if (!deck) return [];
    const words = deck.words;
    const picks = words.length <= n ? shuffle(words) : sample(words, n);
    return picks.map(function (w, i) {
      const others = words.filter(x => x.ar !== w.ar);
      if (i % 2 === 0) {
        // sens : que signifie {ar} ({tr}) ?
        const distract = sample(others, 3).map(x => x.fr);
        return {
          q: "Que signifie " + w.ar + " (" + w.tr + ") ?",
          options: [w.fr].concat(distract),
          answer: 0,
          explain: w.ar + " — " + w.tr + " = " + w.fr + ".",
        };
      } else {
        // reconnaissance : quel mot signifie « {fr} » ?
        const distract = sample(others, 3).map(x => x.ar);
        return {
          q: "Quel mot signifie « " + w.fr + " » ?",
          options: [w.ar].concat(distract),
          answer: 0,
          explain: w.fr + " = " + w.ar + " (" + w.tr + ").",
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
