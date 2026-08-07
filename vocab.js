/* =========================================================================
   VOCABULAIRE — jeux de cartes de mots (ancrés dans le Coran).
   Chaque mot : { ar, tr, fr: {fr, en} }.

   Convention des sens : minuscule pour les noms communs, majuscule seulement
   pour les noms propres et les noms divins (Allah, Seigneur…), pas d'article
   devant. Cohérent d'un bout à l'autre de l'app.
   ========================================================================= */

window.VOCAB = [
  {
    id: "fatiha",
    title: { fr: "Les mots de la Fatiha", en: "Words of Al-Fātiḥa" },
    subtitle: { fr: "Le vocabulaire de la sourate d'ouverture", en: "Vocabulary from the opening sūra" },
    words: [
      { ar: "حَمْد",       tr: "ḥamd",       fr: { fr: "louange",             en: "praise" } },
      { ar: "رَبّ",        tr: "rabb",       fr: { fr: "Seigneur",            en: "Lord" } },
      { ar: "عَالَمِين",   tr: "ʿālamīn",    fr: { fr: "mondes",              en: "worlds" } },
      { ar: "رَحْمَٰن",    tr: "raḥmān",     fr: { fr: "Tout-Miséricordieux", en: "the Most Merciful" } },
      { ar: "رَحِيم",      tr: "raḥīm",      fr: { fr: "Très-Miséricordieux", en: "the Bestower of mercy" } },
      { ar: "مَالِك",      tr: "mālik",      fr: { fr: "Maître",              en: "Master" } },
      { ar: "يَوْم",       tr: "yawm",       fr: { fr: "jour",                en: "day" } },
      { ar: "دِين",        tr: "dīn",        fr: { fr: "rétribution",         en: "recompense" } },
      { ar: "صِرَاط",      tr: "ṣirāṭ",      fr: { fr: "chemin",              en: "path" } },
      { ar: "مُسْتَقِيم",  tr: "mustaqīm",   fr: { fr: "droit",               en: "straight" } },
      { ar: "نِعْمَة",     tr: "niʿma",      fr: { fr: "bienfait",            en: "blessing" } },
      { ar: "ضَالِّين",    tr: "ḍāllīn",     fr: { fr: "égarés",              en: "the astray" } },
    ],
  },
  {
    id: "coran",
    title: { fr: "Mots fréquents du Coran", en: "Frequent Qur'ān words" },
    subtitle: { fr: "Les mots qu'on rencontre le plus souvent", en: "The words you'll meet most often" },
    words: [
      { ar: "اللَّه",   tr: "allāh",  fr: { fr: "Allah",         en: "Allah" } },
      { ar: "كِتَاب",   tr: "kitāb",  fr: { fr: "livre",         en: "book" } },
      { ar: "نُور",     tr: "nūr",    fr: { fr: "lumière",       en: "light" } },
      { ar: "حَقّ",     tr: "ḥaqq",   fr: { fr: "vérité",        en: "truth" } },
      { ar: "عِلْم",    tr: "ʿilm",   fr: { fr: "savoir",        en: "knowledge" } },
      { ar: "قَلْب",    tr: "qalb",   fr: { fr: "cœur",          en: "heart" } },
      { ar: "نَفْس",    tr: "nafs",   fr: { fr: "âme",           en: "soul" } },
      { ar: "نَاس",     tr: "nās",    fr: { fr: "gens",          en: "people" } },
      { ar: "أَرْض",    tr: "arḍ",    fr: { fr: "terre",         en: "earth" } },
      { ar: "سَمَاء",   tr: "samāʾ",  fr: { fr: "ciel",          en: "sky, heaven" } },
      { ar: "جَنَّة",   tr: "janna",  fr: { fr: "paradis",       en: "paradise, garden" } },
      { ar: "آيَة",     tr: "āya",    fr: { fr: "signe, verset", en: "sign, verse" } },
    ],
  },
  {
    id: "quotidien",
    title: { fr: "Premiers mots", en: "First words" },
    subtitle: { fr: "Le vocabulaire du quotidien", en: "Everyday vocabulary" },
    words: [
      { ar: "بَيْت",   tr: "bayt",   fr: { fr: "maison",  en: "house" } },
      { ar: "مَاء",    tr: "māʾ",    fr: { fr: "eau",     en: "water" } },
      { ar: "خُبْز",   tr: "khubz",  fr: { fr: "pain",    en: "bread" } },
      { ar: "أُمّ",    tr: "umm",    fr: { fr: "mère",    en: "mother" } },
      { ar: "أَب",     tr: "ab",     fr: { fr: "père",    en: "father" } },
      { ar: "يَد",     tr: "yad",    fr: { fr: "main",    en: "hand" } },
      { ar: "عَيْن",   tr: "ʿayn",   fr: { fr: "œil",     en: "eye" } },
      { ar: "شَمْس",   tr: "shams",  fr: { fr: "soleil",  en: "sun" } },
      { ar: "قَمَر",   tr: "qamar",  fr: { fr: "lune",    en: "moon" } },
      { ar: "بَاب",    tr: "bāb",    fr: { fr: "porte",   en: "door" } },
      { ar: "كَلْب",   tr: "kalb",   fr: { fr: "chien",   en: "dog" } },
      { ar: "قِطّ",    tr: "qiṭṭ",   fr: { fr: "chat",    en: "cat" } },
    ],
  },

  /* ----------------------------------------------------------------------
     D'après « 80% des mots du Qour'ân » (Al-Lawh · CC BY-NC-SA).
     count = nb d'occurrences dans le Coran (± 3 marge, Al-Lawh / Leeds).
     ---------------------------------------------------------------------- */
  {
    id: "noms-divins-a",
    title: { fr: "Quelques noms d'Allah", en: "Some names of Allah" },
    subtitle: { fr: "Noms divins & qualificatifs — Tableau A", en: "Divine names & attributes — Table A" },
    source: { fr: "D'après Al-Lawh — « Noms divins et autres qualificatifs · A »",
              en: "After Al-Lawh — 'Divine names and other attributes · A'" },
    words: [
      { ar: "الخَبِير",    tr: "Al-Khabīr",  fr: { fr: "le Parfaitement Informé",             en: "the All-Aware" },                         count: 45  },
      { ar: "رَبّ",        tr: "Rabb",       fr: { fr: "Seigneur, maître, éducateur",         en: "Lord, master, sustainer" },               count: 971 },
      { ar: "الرَّحْمَٰن", tr: "Ar-Raḥmān",  fr: { fr: "le Miséricordieux, le Clément",       en: "the Most Merciful, the Compassionate" }, count: 57  },
      { ar: "السَّلَام",   tr: "As-Salām",   fr: { fr: "le Pacifique, la Paix",               en: "the Peace, the Source of peace" },        count: 42  },
      { ar: "السَّمِيع",   tr: "As-Samīʿ",   fr: { fr: "Celui qui entend chaque chose",       en: "the All-Hearing" },                       count: 47  },
      { ar: "شَكُور",      tr: "Shakūr",     fr: { fr: "reconnaissant, plein de gratitude",   en: "grateful, deeply thankful" },             count: 10  },
      { ar: "العَزِيز",    tr: "Al-ʿAzīz",   fr: { fr: "le Tout-Puissant",                    en: "the Almighty" },                          count: 101 },
      { ar: "الغَفُور",    tr: "Al-Ghafūr",  fr: { fr: "le Pardonneur, l'Expiateur de fautes",en: "the Forgiver, the Expiator" },            count: 91  },
      { ar: "القَدِير",    tr: "Al-Qadīr",   fr: { fr: "l'Omnipotent, Celui qui peut tout",   en: "the Omnipotent, able to do all things" },count: 45  },
      { ar: "نَذِير",      tr: "Nadhīr",     fr: { fr: "avertisseur, avertissement",          en: "warner, warning" },                       count: 58  },
      { ar: "النَّصِير",   tr: "An-Naṣīr",   fr: { fr: "le Secoureur, le Protecteur",         en: "the Helper, the Protector" },             count: 24  },
      { ar: "الوَكِيل",    tr: "Al-Wakīl",   fr: { fr: "le Garant suprême",                   en: "the Ultimate Trustee" },                  count: 24  },
    ],
  },
];
