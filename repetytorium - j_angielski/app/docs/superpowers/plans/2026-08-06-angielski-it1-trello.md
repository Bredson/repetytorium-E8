# Trello — angielski it.1 scaffold SPA + 3 działy tekstowe

> Karty do tablicy Trello. Jedna karta = jeden task z planu
> `2026-08-06-angielski-it1-scaffold.md`.

---

## T1 — Scaffold Vite + React + storage + profil

**Cel:** Działający `npm run dev` (port 5175) i build; adapter localStorage (klucz `angielski`) + core/profil
**Pliki:** `app/` (nowy projekt), `src/storage/adapter.js`, `src/core/profil.js` — kopiowane z matematyki, bez KaTeX
**Done:** build ✓, dev serwuje na 5175 → commit

---

## T2 — core: quiz (TDD), plan, powtorki

**Cel:** `sprawdzKrok` z nową semantyką `akceptowane` (TDD: warianty, case-insensitive, literówka odrzucona); plan parametryczny (wzorzec po mat it.6); powtórki
**Pliki:** `src/core/{quiz,plan,powtorki}.js`, `tests/*.test.mjs`
**Done:** `npm test` 3 suity ✓ → commit

---

## T3 — Treść: 3 działy JSON + rejestr

**Cel:** funkcje.json (zwroty grzecznościowe — priorytet CKE), czytanie.json (pole `tekst`), srodki.json (Past Simple — priorytet CKE; parafraza+tłumaczenie otwarte); po 2 tw + 5 MC + 2 otwarte
**Pliki:** `src/content/angielski/dzialy/*.json`, `rejestr.js`
**Done:** walidacja python (liczby + pola + `akceptowane`) ✓, build ✓ → commit

---

## T4 — UI: profil, diagnoza, dashboard

**Cel:** Przepływ profil → PIN → diagnoza (6 pytań, teksty czytania w ramce) → dashboard 3 karty
**Pliki:** `src/ui/pages/{WyborProfilu,EkranPin,NowyProfil,TestWstepny,Start}.jsx`, `App.jsx` (router cz. 1)
**Done:** build ✓, smoke w przeglądarce ✓ → commit

---

## T5 — UI: Dzial, ZadanieOtwarte, Powtorka + pełny router

**Cel:** Pełny cykl nauki; Dzial z wzorcami mat it.7/it.8 (pauza+Dalej, losowe otwarte); KrokZadania z walidacją `akceptowane`
**Pliki:** `src/ui/pages/{Dzial,ZadanieOtwarte,Powtorka}.jsx`, `src/ui/components/KrokZadania.jsx`, `App.jsx`
**Done:** `npm test` + build ✓, golden path w przeglądarce ✓ → commit

---

## T6 — QA końcowe + docs

**Cel:** DoD it.1 + przepisanie STAN-PROJEKTU (nowy model: SPA zamiast HTML-per-uczeń)
**Pliki:** `repetytorium - j_angielski/STAN-PROJEKTU.md`, `LESSONS.md`
**Kroki:** testy+build → QA desktop (golden path, warianty `akceptowane`, case-insensitive, literówka odrzucona) → QA mobile → STAN (model, stack, kolejne kroki: it.2 TTS, it.3 pisanie) → LESSONS → commit
**Done:** QA ✓, konsola 0 errors, docs, commit
