# Trello — Matematyka iteracja 1: Scaffold + Diagnoza + Dashboard

> Karty do tablicy. Kolejność = zależności (T1→T2→T3→T4→T5→T6→T7→T8).
> Źródło: `2026-07-23-matematyka-it1-scaffold.md` · Spec: `2026-07-23-matematyka-design.md`

---

## Karta 1/8 — Scaffold: Vite + React + KaTeX

**Opis:**
Struktura katalogów, `package.json` (z `katex ^0.16`), `vite.config.js`, `index.html` (tytuł „matematyka"), `src/main.jsx`, tymczasowy `App.jsx` z placeholderem. `npm install && npm run dev` → localhost:5174 działa.

**Checklista:**
- [ ] Struktura katalogów (`src/content/matematyka/dzialy/`, `src/core/`, `src/storage/`, `src/ui/`)
- [ ] `package.json` + `vite.config.js` + `index.html`
- [ ] `src/main.jsx` + `src/ui/theme.css` (kopia z polskiego)
- [ ] `npm install` ✓ — katex zainstalowany
- [ ] `npm run dev` → strona placeholder widoczna
- [ ] Commit `feat(mat): scaffold Vite+React+KaTeX — it.1 start`

---

## Karta 2/8 — Core: storage/adapter + profil

**Opis:**
`storage/adapter.js` skopiowany 1:1 z polskiego (logika przedmiotu przez argument). `core/profil.js` — zaadaptowany: `pustePostepy()` zwraca `{wersjaSchematu:4, diagnoza:null, plan:null, dzialy:{}, sesje:[], powtorki:[], egzaminy:[]}`. Klucz localStorage: `rep:postepy:{uuid}:matematyka`.

**Checklista:**
- [ ] `storage/adapter.js` skopiowany
- [ ] `core/profil.js` z nową `pustePostepy()` (struktura `dzialy`)
- [ ] `nowyProfil()` ustawia `przedmioty: ["matematyka"]`
- [ ] Commit `feat(mat): storage adapter + core/profil`

---

## Karta 3/8 — Core: quiz + plan + powtorki (TDD)

**Opis:**
`core/powtorki.js` skopiowany z polskiego (interwały [1,3,7,14]). `core/quiz.js` — TDD: najpierw `tests/quiz.test.mjs` (6 asercji), potem implementacja `sprawdzOdpowiedz`, `sprawdzKrok`, `obliczWynikDzialu`. `core/plan.js` — `generujPlan(diagnoza)` → lista 9 działów z priorytetem wg wyniku.

**Checklista:**
- [ ] `core/powtorki.js` skopiowany
- [ ] `tests/quiz.test.mjs` — failing (brak modułu)
- [ ] `core/quiz.js` — implementacja
- [ ] `node tests/quiz.test.mjs` → 6 asercji OK
- [ ] `core/plan.js` — `generujPlan`
- [ ] Commit `feat(mat): core/quiz + core/plan + core/powtorki (TDD)`

---

## Karta 4/8 — Content: dział `liczby` + rejestr.js

**Opis:**
`src/content/matematyka/dzialy/liczby.json` — 2 pytania test wstępny + 3 ćwiczenia zamknięte + 1 zadanie otwarte z krokami (wzorzec dla pozostałych 8 działów). Weryfikacja JSON: `python3 -c "json.load(...)"`. `rejestr.js` eksportuje `DZIALY`, `PULA_EGZAMINU`, `material(id)`.

**Checklista:**
- [ ] `dzialy/liczby.json` — 2+3+1 pytania z KaTeX
- [ ] `python3` weryfikacja JSON ✓
- [ ] `rejestr.js` z eksportami `DZIALY`, `PULA_EGZAMINU`, `material`
- [ ] Commit `feat(mat): content — dział liczby (wzorzec) + rejestr.js`

---

## Karta 5/8 — UI: komponenty skopiowane + KaTeXRenderer + KrokZadania

**Opis:**
Kopiowanie bez zmian: `PasekPostepu.jsx`, `WykresLiniowy.jsx`, `WyborProfilu.jsx`, `EkranPin.jsx`, `NowyProfil.jsx`. Nowe: `KaTeXRenderer.jsx` (parser `$...$` i `$$...$$`, render przez `katex.renderToString`), `KrokZadania.jsx` (input numeryczny z weryfikacją kroku, podpowiedź po 2 błędach). `npm run build` bez błędów.

**Checklista:**
- [ ] 5 plików skopiowanych z polskiego
- [ ] `KaTeXRenderer.jsx` — render inline i display math
- [ ] `KrokZadania.jsx` — input + sprawdzanie + podpowiedź
- [ ] `npm run build` ✓
- [ ] Commit `feat(mat): UI components — KaTeXRenderer, KrokZadania, profil pages`

---

## Karta 6/8 — Ekran: TestWstepny (diagnoza)

**Opis:**
`src/ui/pages/TestWstepny.jsx` — zbiera `test_wstepny` ze wszystkich działów (1–2 pytania per dział), wyświetla jedno pytanie na raz z KaTeX, po zakończeniu oblicza wynik per dział (0–1.0) i wywołuje `onZakoncz(wynikPerDzial)`.

**Checklista:**
- [ ] `TestWstepny.jsx` — pytania zamknięte z paskiem postępu
- [ ] Wyróżnianie poprawnej/błędnej odpowiedzi po kliknięciu „Sprawdź"
- [ ] Wynik per dział przekazany do `onZakoncz`
- [ ] Commit `feat(mat): ekran TestWstepny — diagnoza per dział z KaTeX`

---

## Karta 7/8 — Ekran Start (dashboard) + App.jsx router

**Opis:**
`Start.jsx` — 9 kart działów z `PasekPostepu`, baner „Zacznij od diagnozy" (gdy brak diagnozy), powtórki na dziś, wyróżnienie działu „Na dziś" (pierwszy `do-zrobienia` z planu). `App.jsx` — pełny router: wybor→pin→nowy→test-wstepny→start. `npm run build` + QA pełnej ścieżki.

**Checklista:**
- [ ] `Start.jsx` z kartami działów i banerem diagnozy
- [ ] `App.jsx` — router z obsługą wszystkich ekranów
- [ ] `npm run build` ✓
- [ ] QA desktop: rejestracja → diagnoza → Start z wynikami → wyloguj → login → postępy zachowane
- [ ] QA mobile 390×844: brak poziomego scrolla, przyciski ≥44px
- [ ] Commit `feat(mat): App.jsx router + ekran Start (dashboard) — it.1 komplet`

---

## Karta 8/8 — LESSONS.md + Definition of Done

**Opis:**
Wpis w `repetytorium - matematyka/LESSONS.md` (obserwacje: KaTeX, izolacja localStorage, wzorzec profilu). Weryfikacja: `npm run build` ✓ → QA desktop ✓ → QA mobile ✓. Commit końcowy.

**Checklista:**
- [ ] `npm run build` ✓ (ostateczny)
- [ ] QA desktop ✓
- [ ] QA mobile 390×844 ✓
- [ ] Wpis w `LESSONS.md`
- [ ] Commit `docs(mat): LESSONS.md — wpis it.1`
