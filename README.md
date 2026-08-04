# Learn Arabic

A flashcard-style app for beginners learning Modern Standard Arabic — grammar
lessons, thematic vocabulary decks, and Qur'anic story reading with the verses
inline.

Sibling of [apprendre-arabe](https://github.com/saazmi/apprendre-arabe): same
learning content, no Hifdh tracker, no cloud sync, English support coming.

## Files

| File | Role |
|---|---|
| `index.html` | app shell |
| `styles.css` | warm-grey parchment theme with burnt-gold accent |
| `lessons.js` | grammar teaching cards |
| `vocab.js` | vocabulary decks |
| `stories.js` | story cards + bundled verses |
| `quiz.js` | dynamic-quiz engine (question templates + random pools) |
| `app.js` | nav shell, routing, quiz runner |
| `manifest.webmanifest` | PWA manifest |

## Roadmap

- [x] Phase 1 — fork, strip cloud/Hifdh, parchment palette
- [ ] Phase 2 — swap localStorage → IndexedDB
- [ ] Phase 3 — FR ↔ EN language toggle
- [ ] Phase 4 — verbose textbook-style cards (4 sentences per story view,
      4 words per vocab view with shared "Acquired" toggle)
