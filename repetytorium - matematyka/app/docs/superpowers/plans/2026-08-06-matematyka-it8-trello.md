# Trello — it.8 rotacja zadań otwartych + hardeningi

> Karty do tablicy Trello. Jedna karta = jeden task z planu
> `2026-08-06-matematyka-it8-rotacja-hardeningi.md`.

---

## T1 — Dzial.jsx: losowe zadanie otwarte + 3 hardeningi

**Cel:** Po zdanym quizie losowe zadanie z `zadania_otwarte` (odblokowanie 11 martwych `*o2`); functional updater w `dalej()`, `clearTimeout` w `reset()`, `key={pytanie.id}` na `<details>`
**Pliki:** `src/ui/pages/Dzial.jsx`
**Done:** `npm test` + build ✓ → smoke (Przypomnij zwija się między pytaniami, pauza it.7 bez regresji) → commit

---

## T2 — KrokZadania.jsx: jednostka poza `$...$`

**Cel:** Feedback „Dobrze!" bez ostrzeżeń KaTeX dla `cm²`/`m³` (wzorzec z rozwiązania wzorcowego)
**Pliki:** `src/ui/components/KrokZadania.jsx`
**Done:** build ✓ → commit (weryfikacja wizualna w T3 na gpo2 k2)

---

## T3 — QA końcowe + docs

**Cel:** Potwierdzić DoD it.8 i domknąć iterację
**Pliki:** `STAN-PROJEKTU.md`, `LESSONS.md`
**Kroki:** testy+build → QA desktop (rotacja: oba zadania gpo1/gpo2 w ≤6 podejściach; gpo2 k2 „80 cm²" bez ostrzeżeń KaTeX; key na details; regresja pauzy it.7) → QA mobile → STAN (sekcja it.8, „Jak zacząć" → it.9 z angielskim jako rekomendacją) → LESSONS → commit
**Done:** QA ✓, konsola 0 errors/warnings KaTeX, docs, commit
