/* =========================================================================
   LEÇONS DE GRAMMAIRE — contenu d'apprentissage (les cartes « concept »).
   Les QUIZ ne sont plus écrits ici : ils sont générés dynamiquement à partir
   de gabarits + données aléatoires (voir quiz.js). Chaque leçon est reliée à
   ses gabarits par son id (g1…g4).

   Une carte concept : { front:{fr,en}, example:{fr,en}, explain:{fr,en} }.
   ========================================================================= */

window.LESSONS = [
  {
    id: "g1",
    n: 1,
    title: { fr: "Les 3 types de mots", en: "The 3 kinds of words" },
    subtitle: { fr: "Nom · verbe · particule — puis défini & indéfini",
                en: "Noun · verb · particle — then definite & indefinite" },
    cards: [
      {
        front: {
          fr: "Tout mot arabe appartient à l'un de <b>3 types</b> : اِسْم (nom), فِعْل (verbe), حَرْف (particule).",
          en: "Every Arabic word belongs to one of <b>3 kinds</b>: اِسْم (noun), فِعْل (verb), حَرْف (particle).",
        },
        example: { fr: "اِسْم · فِعْل · حَرْف", en: "اِسْم · فِعْل · حَرْف" },
        explain: {
          fr: "La première question devant un mot : lequel des trois ? Chaque type suit ses propres règles.",
          en: "The first question in front of any word: which of the three? Each kind follows its own rules.",
        },
      },
      {
        front: {
          fr: "<b>الاِسْم</b> — le nom. Une personne, un objet, un lieu, une qualité.",
          en: "<b>الاِسْم</b> — the noun. A person, an object, a place, a quality.",
        },
        example: {
          fr: "كِتَاب (livre) · رَجُل (homme) · اللَّه (Dieu)",
          en: "كِتَاب (book) · رَجُل (man) · اللَّه (God)",
        },
        explain: {
          fr: "Le nom se décline : sa terminaison change selon sa fonction dans la phrase.",
          en: "The noun declines: its ending changes with its role in the sentence.",
        },
      },
      {
        front: {
          fr: "<b>الفِعْل</b> — le verbe. Il exprime une action.",
          en: "<b>الفِعْل</b> — the verb. It expresses an action.",
        },
        example: {
          fr: "خَلَقَ (il a créé) · قَالَ (il a dit)",
          en: "خَلَقَ (he created) · قَالَ (he said)",
        },
        explain: {
          fr: "Il se conjugue selon le temps, la personne et le nombre — comme en français.",
          en: "It conjugates by tense, person and number — like in English.",
        },
      },
      {
        front: {
          fr: "<b>الحَرْف</b> — la particule. Un petit mot-outil invariable (préposition, conjonction…).",
          en: "<b>الحَرْف</b> — the particle. A small invariable function-word (preposition, conjunction…).",
        },
        example: {
          fr: "فِي (dans) · مِنْ (de) · وَ (et)",
          en: "فِي (in) · مِنْ (from) · وَ (and)",
        },
        explain: {
          fr: "Il ne change jamais de forme, mais influence souvent le mot qui le suit.",
          en: "Its form never changes, but it often affects the word after it.",
        },
      },
      {
        front: {
          fr: "Un nom est soit <b>indéfini</b> (نَكِرَة), soit <b>défini</b> (مَعْرِفَة).",
          en: "A noun is either <b>indefinite</b> (نَكِرَة) or <b>definite</b> (مَعْرِفَة).",
        },
        example: {
          fr: "كِتَابٌ (un livre) · الْكِتَابُ (le livre)",
          en: "كِتَابٌ (a book) · الْكِتَابُ (the book)",
        },
        explain: {
          fr: "Exactement comme « un / une » face à « le / la » en français.",
          en: "Exactly like 'a / an' versus 'the' in English.",
        },
      },
      {
        front: {
          fr: "Le <b>tanwin</b> — la marque de l'indéfini. Un « n » final, écrit par un signe doublé : ـٌ ـً ـٍ.",
          en: "The <b>tanwīn</b> — the mark of the indefinite. A final 'n' sound, written as a doubled vowel: ـٌ ـً ـٍ.",
        },
        example: {
          fr: "كِتَابٌ (kitābun) · كِتَابًا (kitāban) · كِتَابٍ (kitābin)",
          en: "كِتَابٌ (kitābun) · كِتَابًا (kitāban) · كِتَابٍ (kitābin)",
        },
        explain: {
          fr: "On l'entend partout dans le Coran : أَحَدٌ « Un seul » (sourate Al-Ikhlâs).",
          en: "You hear it everywhere in the Qur'ān: أَحَدٌ 'One' (sūrat Al-Ikhlāṣ).",
        },
      },
      {
        front: {
          fr: "<b>الـ</b> (al-) — la marque du défini. Dès qu'on l'ajoute, le tanwin disparaît.",
          en: "<b>الـ</b> (al-) — the mark of the definite. As soon as you add it, the tanwīn drops.",
        },
        example: {
          fr: "كِتَابٌ ← الْكِتَابُ (un livre → le livre)",
          en: "كِتَابٌ ← الْكِتَابُ (a book → the book)",
        },
        explain: {
          fr: "Un mot ne peut pas être indéfini ET défini en même temps.",
          en: "A word cannot be indefinite AND definite at the same time.",
        },
      },
      {
        front: {
          fr: "Le ل de الـ se prononce… ou pas. C'est la règle <b>solaire / lunaire</b>.",
          en: "The ل of الـ is pronounced… or not. That's the <b>sun / moon</b> rule.",
        },
        example: {
          fr: "الْقَمَر ← al-qamar (lunaire) · الشَّمْس ← ash-shams (solaire)",
          en: "الْقَمَر ← al-qamar (moon-letter) · الشَّمْس ← ash-shams (sun-letter)",
        },
        explain: {
          fr: "Astuce : قمر (lune) = lunaire, ل prononcé ; شمس (soleil) = solaire, ل muet.",
          en: "Mnemonic: قمر (moon) = moon-letter, ل is pronounced; شمس (sun) = sun-letter, ل is silent.",
        },
      },
      {
        front: {
          fr: "La <b>chadda</b> (le signe ـّ) <b>double</b> une consonne.",
          en: "The <b>shadda</b> (the sign ـّ) <b>doubles</b> a consonant.",
        },
        example: {
          fr: "بّ = « bb » · الشَّمْس (ash-shams)",
          en: "بّ = 'bb' · الشَّمْس (ash-shams)",
        },
        explain: {
          fr: "Avec الـ + lettre solaire, le ل est absorbé : sa trace est la chadda sur la lettre suivante.",
          en: "With الـ + sun-letter, the ل is absorbed: its trace is the shadda on the next letter.",
        },
      },
      {
        front: {
          fr: "La chadda peut aussi <b>changer le sens</b> d'un mot, en doublant une lettre de la racine.",
          en: "The shadda can also <b>change a word's meaning</b> by doubling a root letter.",
        },
        example: {
          fr: "بَاب (porte) ← بَوَّاب (portier) · عَلِمَ (il a su) ← عَلَّمَ (il a enseigné)",
          en: "بَاب (door) ← بَوَّاب (doorkeeper) · عَلِمَ (he knew) ← عَلَّمَ (he taught)",
        },
        explain: {
          fr: "Doubler une lettre crée souvent un sens lié : « celui de la porte », « faire savoir = enseigner ».",
          en: "Doubling a letter often creates a related meaning: 'the one of the door', 'to make know = to teach'.",
        },
      },
    ],
  },

  {
    id: "g2",
    n: 2,
    title: { fr: "La phrase & l'annexion", en: "The sentence & the iḍāfa" },
    subtitle: { fr: "مبتدأ + خبر — puis l'iḍāfa (« de »)",
                en: "مبتدأ + خبر — then the iḍāfa ('of')" },
    cards: [
      {
        front: {
          fr: "La <b>phrase nominale</b> : au présent, l'arabe n'a pas de verbe « être ». On accole deux mots.",
          en: "The <b>nominal sentence</b>: in the present, Arabic has no verb 'to be'. You just put two words side by side.",
        },
        example: {
          fr: "هٰذَا كِتَابٌ — « ceci (est) un livre »",
          en: "هٰذَا كِتَابٌ — 'this (is) a book'",
        },
        explain: {
          fr: "Le sens « est » est sous-entendu — rien à ajouter.",
          en: "The meaning 'is' is implied — nothing to add.",
        },
      },
      {
        front: {
          fr: "Elle a deux parties : <b>المُبْتَدَأ</b> (le sujet) + <b>الخَبَر</b> (ce qu'on en dit).",
          en: "It has two parts: <b>المُبْتَدَأ</b> (the subject) + <b>الخَبَر</b> (what is said about it).",
        },
        example: {
          fr: "هٰذَا كِتَابٌ ← مبتدأ: هٰذَا · خبر: كِتَابٌ",
          en: "هٰذَا كِتَابٌ ← mubtadaʾ: هٰذَا · khabar: كِتَابٌ",
        },
        explain: {
          fr: "Le sujet est souvent défini ; le خبر souvent indéfini (tanwin).",
          en: "The subject is usually definite; the khabar usually indefinite (tanwīn).",
        },
      },
      {
        front: {
          fr: "« Ceci » : <b>هٰذَا</b> (masculin) · <b>هٰذِهِ</b> (féminin).",
          en: "'This': <b>هٰذَا</b> (masculine) · <b>هٰذِهِ</b> (feminine).",
        },
        example: {
          fr: "هٰذَا بَيْتٌ (une maison) · هٰذِهِ شَجَرَةٌ (un arbre)",
          en: "هٰذَا بَيْتٌ (a house) · هٰذِهِ شَجَرَةٌ (a tree)",
        },
        explain: {
          fr: "Presque tout nom finissant par ة est féminin → هٰذِهِ.",
          en: "Almost every noun ending in ة is feminine → هٰذِهِ.",
        },
      },
      {
        front: {
          fr: "La phrase nominale est <b>partout dans le Coran</b>.",
          en: "The nominal sentence is <b>everywhere in the Qur'ān</b>.",
        },
        example: {
          fr: "اللَّهُ أَحَدٌ — « Allah est Un » (Al-Ikhlâs)",
          en: "اللَّهُ أَحَدٌ — 'Allah is One' (Al-Ikhlāṣ)",
        },
        explain: {
          fr: "مبتدأ: اللَّهُ (déjà défini) · خبر: أَحَدٌ (indéfini, tanwin).",
          en: "mubtadaʾ: اللَّهُ (already definite) · khabar: أَحَدٌ (indefinite, tanwīn).",
        },
      },
      {
        front: {
          fr: "Questionner : <b>مَا</b> (« qu'est-ce que », les choses) · <b>مَنْ</b> (« qui », les personnes).",
          en: "Asking: <b>مَا</b> ('what', for things) · <b>مَنْ</b> ('who', for persons).",
        },
        example: {
          fr: "مَا هٰذَا؟ (qu'est-ce que c'est ?) · مَنْ هٰذَا؟ (qui est-ce ?)",
          en: "مَا هٰذَا؟ (what is this?) · مَنْ هٰذَا؟ (who is this?)",
        },
        explain: {
          fr: "Elles se placent en tête de la phrase nominale.",
          en: "They go at the head of the nominal sentence.",
        },
      },
      {
        front: {
          fr: "<b>الإِضَافَة</b> — dire « de » sans le mot « de ». On accole deux noms.",
          en: "<b>الإِضَافَة</b> — saying 'of' without a word for 'of'. You just put two nouns side by side.",
        },
        example: {
          fr: "كِتَابُ الطَّالِبِ — « le livre de l'étudiant »",
          en: "كِتَابُ الطَّالِبِ — 'the student's book'",
        },
        explain: {
          fr: "1er mot = le possédé (مُضَاف) · 2e = le possesseur (مُضَاف إِلَيْه).",
          en: "1st word = the possessed (muḍāf) · 2nd = the possessor (muḍāf ilayh).",
        },
      },
      {
        front: {
          fr: "Règle d'or : le 1er mot d'une إضافة (le مُضَاف) ne prend <b>JAMAIS الـ ni tanwin</b>.",
          en: "Golden rule: the 1st word of an iḍāfa (the muḍāf) <b>NEVER takes الـ or tanwīn</b>.",
        },
        example: {
          fr: "كِتَابُ الطَّالِبِ ✓ · الْكِتَابُ الطَّالِبِ ✗",
          en: "كِتَابُ الطَّالِبِ ✓ · الْكِتَابُ الطَّالِبِ ✗",
        },
        explain: {
          fr: "Le 2e mot, lui, est toujours au génitif (kasra).",
          en: "The 2nd word, however, is always in the genitive (kasra).",
        },
      },
      {
        front: {
          fr: "Tu récites déjà des إضافات <b>sans le savoir</b>.",
          en: "You already recite iḍāfas <b>without realising it</b>.",
        },
        example: {
          fr: "بِسْمِ اللَّهِ (au nom d'Allah) · رَبِّ العَالَمِينَ (Seigneur des mondes)",
          en: "بِسْمِ اللَّهِ (in the name of Allah) · رَبِّ العَالَمِينَ (Lord of the worlds)",
        },
        explain: {
          fr: "Et même une chaîne : مَالِكِ يَوْمِ الدِّينِ (Maître du Jour de la rétribution).",
          en: "And even a chain: مَالِكِ يَوْمِ الدِّينِ (Master of the Day of Recompense).",
        },
      },
    ],
  },

  {
    id: "g3",
    n: 3,
    title: { fr: "Genre, nombre & cas", en: "Gender, number & case" },
    subtitle: { fr: "مذكّر/مؤنّث · duel & pluriel · l'i'rāb",
                en: "muḏakkar/muʾannath · dual & plural · iʿrāb" },
    cards: [
      {
        front: {
          fr: "Tout nom est <b>masculin</b> (مُذَكَّر) ou <b>féminin</b> (مُؤَنَّث).",
          en: "Every noun is <b>masculine</b> (مُذَكَّر) or <b>feminine</b> (مُؤَنَّث).",
        },
        example: {
          fr: "كِتَاب (m.) · مَدْرَسَة (f.)",
          en: "كِتَاب (m.) · مَدْرَسَة (f.)",
        },
        explain: {
          fr: "Le féminin a des marqueurs visuels — le plus courant : la تاء مربوطة (ة).",
          en: "The feminine has visible markers — the most common: tāʾ marbūṭa (ة).",
        },
      },
      {
        front: {
          fr: "Les <b>3 marqueurs du féminin</b> : ة (le plus courant), ى, et اء.",
          en: "The <b>3 feminine markers</b>: ة (most common), ى, and اء.",
        },
        example: {
          fr: "مَدْرَسَة (école) · كُبْرَى (grande) · حَمْرَاء (rouge, f.)",
          en: "مَدْرَسَة (school) · كُبْرَى (biggest, f.) · حَمْرَاء (red, f.)",
        },
        explain: {
          fr: "Sans aucun marqueur, un nom est en général masculin.",
          en: "With no marker, a noun is usually masculine.",
        },
      },
      {
        front: {
          fr: "Attention : certains mots sont <b>féminins sans marqueur</b>.",
          en: "Watch out: some words are <b>feminine with no marker</b>.",
        },
        example: {
          fr: "شَمْس (soleil) · أَرْض (terre) · يَد (main)",
          en: "شَمْس (sun) · أَرْض (earth) · يَد (hand)",
        },
        explain: {
          fr: "Les organes qui vont par paire (عَيْن, أُذُن) aussi. À mémoriser — très fréquents dans le Coran.",
          en: "Paired body parts (عَيْن eye, أُذُن ear) too. Memorise them — very frequent in the Qur'ān.",
        },
      },
      {
        front: {
          fr: "Le <b>duel</b> (المُثَنَّى) — « deux X ». On ajoute une terminaison au singulier.",
          en: "The <b>dual</b> (المُثَنَّى) — 'two X'. You add an ending to the singular.",
        },
        example: {
          fr: "كِتَاب ← كِتَابَان (sujet) / كِتَابَيْن (autres cas)",
          en: "كِتَاب ← كِتَابَان (subject) / كِتَابَيْن (other cases)",
        },
        explain: {
          fr: "Le ة du féminin devient ت : مَدْرَسَة ← مَدْرَسَتَان.",
          en: "The feminine ة becomes ت: مَدْرَسَة ← مَدْرَسَتَان.",
        },
      },
      {
        front: {
          fr: "Pluriels <b>réguliers (sains)</b> : masculin + ون/ين · féminin (–ة) + ات.",
          en: "<b>Regular (sound) plurals</b>: masculine + ون/ين · feminine (–ة) + ات.",
        },
        example: {
          fr: "مُسْلِم ← مُسْلِمُون · مُسْلِمَة ← مُسْلِمَات",
          en: "مُسْلِم ← مُسْلِمُون · مُسْلِمَة ← مُسْلِمَات",
        },
        explain: {
          fr: "Le masculin varie selon le cas (ـُون sujet / ـِين sinon) ; le féminin ajoute ات.",
          en: "The masculine varies by case (ـُون subject / ـِين otherwise); the feminine simply adds ات.",
        },
      },
      {
        front: {
          fr: "Le <b>pluriel brisé</b> (جمع التكسير) : le mot change de l'intérieur.",
          en: "The <b>broken plural</b> (جمع التكسير): the word changes from the inside.",
        },
        example: {
          fr: "كِتَاب ← كُتُب · رَجُل ← رِجَال",
          en: "كِتَاب ← كُتُب · رَجُل ← رِجَال",
        },
        explain: {
          fr: "Pas de règle — à mémoriser. Il se décline comme un singulier (damma/fatha/kasra).",
          en: "No rule — memorise it. It declines like a singular (ḍamma / fatḥa / kasra).",
        },
      },
      {
        front: {
          fr: "L'<b>إِعْرَاب</b> : le signe final n'est pas une prononciation, c'est une <b>fonction</b>.",
          en: "<b>Iʿrāb</b>: the final mark isn't just pronunciation, it's a <b>grammatical role</b>.",
        },
        example: {
          fr: "رَفْع (u) = sujet · نَصْب (a) = objet · جَرّ (i) = après prép. / إضافة",
          en: "rafʿ (u) = subject · naṣb (a) = object · jarr (i) = after prep. / iḍāfa",
        },
        explain: {
          fr: "La fonction du mot dans la phrase commande sa voyelle finale.",
          en: "The word's role in the sentence dictates its final vowel.",
        },
      },
      {
        front: {
          fr: "Un même mot change de terminaison selon sa fonction — <b>اللَّه</b> dans le Coran :",
          en: "A single word changes its ending with its role — <b>اللَّه</b> in the Qur'ān:",
        },
        example: {
          fr: "اللَّهُ أَحَدٌ (sujet) · إِنَّ اللَّهَ (après إنّ) · بِسْمِ اللَّهِ (إضافة)",
          en: "اللَّهُ أَحَدٌ (subject) · إِنَّ اللَّهَ (after إنّ) · بِسْمِ اللَّهِ (iḍāfa)",
        },
        explain: {
          fr: "ـُ rafʿ · ـَ naṣb · ـِ jarr. Trois fonctions, trois voyelles.",
          en: "ـُ rafʿ · ـَ naṣb · ـِ jarr. Three roles, three vowels.",
        },
      },
    ],
  },

  {
    id: "g4",
    n: 4,
    title: { fr: "Pronoms & l'adjectif", en: "Pronouns & the adjective" },
    subtitle: { fr: "الضمائر · le نَعْت (accord sur 4 points)",
                en: "aḍ-ḍamāʾir · the naʿt (agreement on 4 points)" },
    cards: [
      {
        front: {
          fr: "Les <b>pronoms isolés</b> (المُنْفَصِلَة) — invariables, ils servent de sujet.",
          en: "The <b>independent pronouns</b> (المُنْفَصِلَة) — invariable; they act as subject.",
        },
        example: {
          fr: "أَنَا (je) · أَنْتَ (tu, m.) · هُوَ (il) · هِيَ (elle) · نَحْنُ (nous)",
          en: "أَنَا (I) · أَنْتَ (you, m.) · هُوَ (he) · هِيَ (she) · نَحْنُ (we)",
        },
        explain: {
          fr: "Ex. : هُوَ اللَّهُ أَحَدٌ — « Lui, Allah, est Un ».",
          en: "E.g. هُوَ اللَّهُ أَحَدٌ — 'He, Allah, is One.'",
        },
      },
      {
        front: {
          fr: "Les <b>pronoms suffixes</b> (المُتَّصِلَة) — « mon, ton, son » — s'attachent au nom.",
          en: "The <b>attached pronouns</b> (المُتَّصِلَة) — 'my, your, his' — stick to the noun.",
        },
        example: {
          fr: "كِتَاب + ي ← كِتَابِي (mon livre)",
          en: "كِتَاب + ي ← كِتَابِي (my book)",
        },
        explain: {
          fr: "كَ = ton (m.) · كِ = ton (f.) · هُ = son · هَا = sa · نَا = notre. Le nom perd son tanwin.",
          en: "كَ = your (m.) · كِ = your (f.) · هُ = his · هَا = her · نَا = our. The noun drops its tanwīn.",
        },
      },
      {
        front: {
          fr: "Tu connais déjà ces suffixes par cœur — <b>via la Fatiha</b>.",
          en: "You already know these suffixes by heart — <b>from Al-Fātiḥa</b>.",
        },
        example: {
          fr: "رَبُّكُمْ (votre Seigneur) · عَلَيْهِمْ (sur eux) · إِيَّاكَ (Toi seul)",
          en: "رَبُّكُمْ (your Lord) · عَلَيْهِمْ (upon them) · إِيَّاكَ (You alone)",
        },
        explain: {
          fr: "رَبّ + كُمْ, عَلَى + هِمْ… le suffixe précise la personne.",
          en: "رَبّ + كُمْ, عَلَى + هِمْ… the suffix pins down the person.",
        },
      },
      {
        front: {
          fr: "L'adjectif (<b>النَّعْت</b>) suit <b>toujours</b> le nom, et s'accorde sur <b>4 points</b> à la fois.",
          en: "The adjective (<b>النَّعْت</b>) <b>always</b> follows the noun, and agrees on <b>4 points</b> at once.",
        },
        example: {
          fr: "الكِتَابُ الجَدِيدُ — « le livre neuf »",
          en: "الكِتَابُ الجَدِيدُ — 'the new book'",
        },
        explain: {
          fr: "Genre · nombre · définition · cas — les quatre en même temps.",
          en: "Gender · number · definiteness · case — all four at once.",
        },
      },
      {
        front: {
          fr: "Les 4 accords : <b>genre, nombre, définition</b> (نكرة/معرفة), <b>cas</b>.",
          en: "The 4 agreements: <b>gender, number, definiteness</b> (نكرة/معرفة), <b>case</b>.",
        },
        example: {
          fr: "كِتَابٌ جَدِيدٌ (un livre neuf) · الكِتَابُ الجَدِيدُ (le livre neuf)",
          en: "كِتَابٌ جَدِيدٌ (a new book) · الكِتَابُ الجَدِيدُ (the new book)",
        },
        explain: {
          fr: "Nom avec الـ → adjectif avec الـ. Nom avec tanwin → adjectif avec tanwin.",
          en: "Noun with الـ → adjective with الـ. Noun with tanwīn → adjective with tanwīn.",
        },
      },
      {
        front: {
          fr: "Piège : un pluriel de <b>choses</b> (non-humain) s'accorde comme un <b>féminin singulier</b>.",
          en: "Trap: a plural of <b>things</b> (non-human) agrees like a <b>feminine singular</b>.",
        },
        example: {
          fr: "كُتُبٌ جَدِيدَةٌ ✓ (et non كُتُبٌ جَدِيدُونَ ✗)",
          en: "كُتُبٌ جَدِيدَةٌ ✓ (not كُتُبٌ جَدِيدُونَ ✗)",
        },
        explain: {
          fr: "Ex. coranique : آيَاتٌ بَيِّنَاتٌ (des versets clairs).",
          en: "Qur'ānic example: آيَاتٌ بَيِّنَاتٌ (clear verses).",
        },
      },
      {
        front: {
          fr: "Le نعت parfaitement accordé, <b>tu le récites déjà</b>.",
          en: "The perfectly-agreed naʿt — <b>you already recite it</b>.",
        },
        example: {
          fr: "الصِّرَاطَ المُسْتَقِيمَ (le droit chemin) · الرَّحْمَٰنِ الرَّحِيمِ",
          en: "الصِّرَاطَ المُسْتَقِيمَ (the straight path) · الرَّحْمَٰنِ الرَّحِيمِ",
        },
        explain: {
          fr: "Nom et adjectif : même genre, nombre, définition ET cas — accord 4/4.",
          en: "Noun and adjective: same gender, number, definiteness AND case — 4/4 agreement.",
        },
      },
    ],
  },
];
