/* =========================================================================
   LEÇONS DE GRAMMAIRE — contenu d'apprentissage (les cartes « concept »).
   Les QUIZ ne sont plus écrits ici : ils sont générés dynamiquement à partir
   de gabarits + données aléatoires (voir quiz.js). Chaque leçon est reliée à
   ses gabarits par son id (g1…g4).

   Une carte concept :
     { front, example, explain }
   ========================================================================= */

window.LESSONS = [
  {
    id: "g1",
    n: 1,
    title: "Les 3 types de mots",
    subtitle: "Nom · verbe · particule — puis défini & indéfini",
    cards: [
      {
        front: "Tout mot arabe appartient à l'un de <b>3 types</b> : اِسْم (nom), فِعْل (verbe), حَرْف (particule).",
        example: "اِسْم · فِعْل · حَرْف",
        explain: "La première question devant un mot : lequel des trois ? Chaque type suit ses propres règles.",
      },
      {
        front: "<b>الاِسْم</b> — le nom. Une personne, un objet, un lieu, une qualité.",
        example: "كِتَاب (livre) · رَجُل (homme) · اللَّه (Dieu)",
        explain: "Le nom se décline : sa terminaison change selon sa fonction dans la phrase.",
      },
      {
        front: "<b>الفِعْل</b> — le verbe. Il exprime une action.",
        example: "خَلَقَ (il a créé) · قَالَ (il a dit)",
        explain: "Il se conjugue selon le temps, la personne et le nombre — comme en français.",
      },
      {
        front: "<b>الحَرْف</b> — la particule. Un petit mot-outil invariable (préposition, conjonction…).",
        example: "فِي (dans) · مِنْ (de) · وَ (et)",
        explain: "Il ne change jamais de forme, mais influence souvent le mot qui le suit.",
      },
      {
        front: "Un nom est soit <b>indéfini</b> (نَكِرَة), soit <b>défini</b> (مَعْرِفَة).",
        example: "كِتَابٌ (un livre) · الْكِتَابُ (le livre)",
        explain: "Exactement comme « un / une » face à « le / la » en français.",
      },
      {
        front: "Le <b>tanwin</b> — la marque de l'indéfini. Un « n » final, écrit par un signe doublé : ـٌ ـً ـٍ.",
        example: "كِتَابٌ (kitābun) · كِتَابًا (kitāban) · كِتَابٍ (kitābin)",
        explain: "On l'entend partout dans le Coran : أَحَدٌ « Un seul » (sourate Al-Ikhlâs).",
      },
      {
        front: "<b>الـ</b> (al-) — la marque du défini. Dès qu'on l'ajoute, le tanwin disparaît.",
        example: "كِتَابٌ ← الْكِتَابُ (un livre → le livre)",
        explain: "Un mot ne peut pas être indéfini ET défini en même temps.",
      },
      {
        front: "Le ل de الـ se prononce… ou pas. C'est la règle <b>solaire / lunaire</b>.",
        example: "الْقَمَر ← al-qamar (lunaire) · الشَّمْس ← ash-shams (solaire)",
        explain: "Astuce : قمر (lune) = lunaire, ل prononcé ; شمس (soleil) = solaire, ل muet.",
      },
      {
        front: "La <b>chadda</b> (le signe ـّ) <b>double</b> une consonne.",
        example: "بّ = « bb » · الشَّمْس (ash-shams)",
        explain: "Avec الـ + lettre solaire, le ل est absorbé : sa trace est la chadda sur la lettre suivante.",
      },
      {
        front: "La chadda peut aussi <b>changer le sens</b> d'un mot, en doublant une lettre de la racine.",
        example: "بَاب (porte) ← بَوَّاب (portier) · عَلِمَ (il a su) ← عَلَّمَ (il a enseigné)",
        explain: "Doubler une lettre crée souvent un sens lié : « celui de la porte », « faire savoir = enseigner ».",
      },
    ],
  },

  {
    id: "g2",
    n: 2,
    title: "La phrase & l'annexion",
    subtitle: "مبتدأ + خبر — puis l'iḍāfa (« de »)",
    cards: [
      {
        front: "La <b>phrase nominale</b> : au présent, l'arabe n'a pas de verbe « être ». On accole deux mots.",
        example: "هٰذَا كِتَابٌ — « ceci (est) un livre »",
        explain: "Le sens « est » est sous-entendu — rien à ajouter.",
      },
      {
        front: "Elle a deux parties : <b>المُبْتَدَأ</b> (le sujet) + <b>الخَبَر</b> (ce qu'on en dit).",
        example: "هٰذَا كِتَابٌ ← مبتدأ: هٰذَا · خبر: كِتَابٌ",
        explain: "Le sujet est souvent défini ; le خبر souvent indéfini (tanwin).",
      },
      {
        front: "« Ceci » : <b>هٰذَا</b> (masculin) · <b>هٰذِهِ</b> (féminin).",
        example: "هٰذَا بَيْتٌ (une maison) · هٰذِهِ شَجَرَةٌ (un arbre)",
        explain: "Presque tout nom finissant par ة est féminin → هٰذِهِ.",
      },
      {
        front: "La phrase nominale est <b>partout dans le Coran</b>.",
        example: "اللَّهُ أَحَدٌ — « Allah est Un » (Al-Ikhlâs)",
        explain: "مبتدأ: اللَّهُ (déjà défini) · خبر: أَحَدٌ (indéfini, tanwin).",
      },
      {
        front: "Questionner : <b>مَا</b> (« qu'est-ce que », les choses) · <b>مَنْ</b> (« qui », les personnes).",
        example: "مَا هٰذَا؟ (qu'est-ce que c'est ?) · مَنْ هٰذَا؟ (qui est-ce ?)",
        explain: "Elles se placent en tête de la phrase nominale.",
      },
      {
        front: "<b>الإِضَافَة</b> — dire « de » sans le mot « de ». On accole deux noms.",
        example: "كِتَابُ الطَّالِبِ — « le livre de l'étudiant »",
        explain: "1er mot = le possédé (مُضَاف) · 2e = le possesseur (مُضَاف إِلَيْه).",
      },
      {
        front: "Règle d'or : le 1er mot d'une إضافة (le مُضَاف) ne prend <b>JAMAIS الـ ni tanwin</b>.",
        example: "كِتَابُ الطَّالِبِ ✓ · الْكِتَابُ الطَّالِبِ ✗",
        explain: "Le 2e mot, lui, est toujours au génitif (kasra).",
      },
      {
        front: "Tu récites déjà des إضافات <b>sans le savoir</b>.",
        example: "بِسْمِ اللَّهِ (au nom d'Allah) · رَبِّ العَالَمِينَ (Seigneur des mondes)",
        explain: "Et même une chaîne : مَالِكِ يَوْمِ الدِّينِ (Maître du Jour de la rétribution).",
      },
    ],
  },

  {
    id: "g3",
    n: 3,
    title: "Genre, nombre & cas",
    subtitle: "مذكّر/مؤنّث · duel & pluriel · l'i'rāb",
    cards: [
      {
        front: "Tout nom est <b>masculin</b> (مُذَكَّر) ou <b>féminin</b> (مُؤَنَّث).",
        example: "كِتَاب (m.) · مَدْرَسَة (f.)",
        explain: "Le féminin a des marqueurs visuels — le plus courant : la تاء مربوطة (ة).",
      },
      {
        front: "Les <b>3 marqueurs du féminin</b> : ة (le plus courant), ى, et اء.",
        example: "مَدْرَسَة (école) · كُبْرَى (grande) · حَمْرَاء (rouge, f.)",
        explain: "Sans aucun marqueur, un nom est en général masculin.",
      },
      {
        front: "Attention : certains mots sont <b>féminins sans marqueur</b>.",
        example: "شَمْس (soleil) · أَرْض (terre) · يَد (main)",
        explain: "Les organes qui vont par paire (عَيْن, أُذُن) aussi. À mémoriser — très fréquents dans le Coran.",
      },
      {
        front: "Le <b>duel</b> (المُثَنَّى) — « deux X ». On ajoute une terminaison au singulier.",
        example: "كِتَاب ← كِتَابَان (sujet) / كِتَابَيْن (autres cas)",
        explain: "Le ة du féminin devient ت : مَدْرَسَة ← مَدْرَسَتَان.",
      },
      {
        front: "Pluriels <b>réguliers (sains)</b> : masculin + ون/ين · féminin (–ة) + ات.",
        example: "مُسْلِم ← مُسْلِمُون · مُسْلِمَة ← مُسْلِمَات",
        explain: "Le masculin varie selon le cas (ـُون sujet / ـِين sinon) ; le féminin ajoute ات.",
      },
      {
        front: "Le <b>pluriel brisé</b> (جمع التكسير) : le mot change de l'intérieur.",
        example: "كِتَاب ← كُتُب · رَجُل ← رِجَال",
        explain: "Pas de règle — à mémoriser. Il se décline comme un singulier (damma/fatha/kasra).",
      },
      {
        front: "L'<b>إِعْرَاب</b> : le signe final n'est pas une prononciation, c'est une <b>fonction</b>.",
        example: "رَفْع (u) = sujet · نَصْب (a) = objet · جَرّ (i) = après prép. / إضافة",
        explain: "La fonction du mot dans la phrase commande sa voyelle finale.",
      },
      {
        front: "Un même mot change de terminaison selon sa fonction — <b>اللَّه</b> dans le Coran :",
        example: "اللَّهُ أَحَدٌ (sujet) · إِنَّ اللَّهَ (après إنّ) · بِسْمِ اللَّهِ (إضافة)",
        explain: "ـُ rafʿ · ـَ naṣb · ـِ jarr. Trois fonctions, trois voyelles.",
      },
    ],
  },

  {
    id: "g4",
    n: 4,
    title: "Pronoms & l'adjectif",
    subtitle: "الضمائر · le نَعْت (accord sur 4 points)",
    cards: [
      {
        front: "Les <b>pronoms isolés</b> (المُنْفَصِلَة) — invariables, ils servent de sujet.",
        example: "أَنَا (je) · أَنْتَ (tu, m.) · هُوَ (il) · هِيَ (elle) · نَحْنُ (nous)",
        explain: "Ex. : هُوَ اللَّهُ أَحَدٌ — « Lui, Allah, est Un ».",
      },
      {
        front: "Les <b>pronoms suffixes</b> (المُتَّصِلَة) — « mon, ton, son » — s'attachent au nom.",
        example: "كِتَاب + ي ← كِتَابِي (mon livre)",
        explain: "كَ = ton (m.) · كِ = ton (f.) · هُ = son · هَا = sa · نَا = notre. Le nom perd son tanwin.",
      },
      {
        front: "Tu connais déjà ces suffixes par cœur — <b>via la Fatiha</b>.",
        example: "رَبُّكُمْ (votre Seigneur) · عَلَيْهِمْ (sur eux) · إِيَّاكَ (Toi seul)",
        explain: "رَبّ + كُمْ, عَلَى + هِمْ… le suffixe précise la personne.",
      },
      {
        front: "L'adjectif (<b>النَّعْت</b>) suit <b>toujours</b> le nom, et s'accorde sur <b>4 points</b> à la fois.",
        example: "الكِتَابُ الجَدِيدُ — « le livre neuf »",
        explain: "Genre · nombre · définition · cas — les quatre en même temps.",
      },
      {
        front: "Les 4 accords : <b>genre, nombre, définition</b> (نكرة/معرفة), <b>cas</b>.",
        example: "كِتَابٌ جَدِيدٌ (un livre neuf) · الكِتَابُ الجَدِيدُ (le livre neuf)",
        explain: "Nom avec الـ → adjectif avec الـ. Nom avec tanwin → adjectif avec tanwin.",
      },
      {
        front: "Piège : un pluriel de <b>choses</b> (non-humain) s'accorde comme un <b>féminin singulier</b>.",
        example: "كُتُبٌ جَدِيدَةٌ ✓ (et non كُتُبٌ جَدِيدُونَ ✗)",
        explain: "Ex. coranique : آيَاتٌ بَيِّنَاتٌ (des versets clairs).",
      },
      {
        front: "Le نعت parfaitement accordé, <b>tu le récites déjà</b>.",
        example: "الصِّرَاطَ المُسْتَقِيمَ (le droit chemin) · الرَّحْمَٰنِ الرَّحِيمِ",
        explain: "Nom et adjectif : même genre, nombre, définition ET cas — accord 4/4.",
      },
    ],
  },
];
