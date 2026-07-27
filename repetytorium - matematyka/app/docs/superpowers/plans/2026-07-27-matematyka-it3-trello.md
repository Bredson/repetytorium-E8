# Trello — Matematyka it.3

> Wklej do tablicy Repetytorium / kolumna "Backlog it.3"
> Plan: `app/docs/superpowers/plans/2026-07-27-matematyka-it3-egzamin-statystyki.md`

---

## KARTA 1 — [MAT-It3-T1] Normalizacja przecinka dziesiętnego w sprawdzKrok

**Lista:** Backlog it.3
**Etykieta:** `matematyka` `core` `bugfix` `it.3`

### Opis
Finding z final review it.2: uczeń wpisze „2,5", a `oczekiwana` w JSON to „2.5" — porównanie stringów odrzuca poprawną odpowiedź. Przecinek i kropka mają być równoważne po obu stronach.

**Pliki:**
- Modify: `src/core/quiz.js` (tylko `sprawdzKrok`)
- Modify: `tests/quiz.test.mjs` (konwersja `console.assert` → `node:assert/strict` + 5 testów notacji)

**DoD:** `npm test` przechodzi (w tym testy „2,5" ≡ „2.5" w obie strony, z jednostką); `npm run build` ✓; commit `fix(mat): sprawdzKrok akceptuje przecinek dziesiętny + testy node:assert (it.3 T1)`.

---

## KARTA 2 — [MAT-It3-T2] core/egzamin.js — arkusz + wynik (TDD)

**Lista:** Backlog it.3
**Etykieta:** `matematyka` `core` `it.3`

### Opis
Czysta logika egzaminu próbnego (zero DOM): budowa arkusza 15 zamkniętych + 6 otwartych z puli działów (każdy dział reprezentowany w zamkniętych) i liczenie wyniku z rozbiciem per dział. Losowość wstrzykiwana (`losuj`) — testy deterministyczne z LCG.

**Pliki:**
- Create: `src/core/egzamin.js` (`CZAS_EGZAMINU_MIN=125`, `LICZBA_ZAMKNIETYCH=15`, `LICZBA_OTWARTYCH=6`, `tasuj`, `zbudujArkusz`, `punktyZadaniaOtwartego`, `policzWynikEgzaminu`)
- Create: `tests/egzamin.test.mjs`
- Modify: `package.json` (skrypt `test` chainuje egzamin.test.mjs)

**DoD:** `npm test` ✓ (rozmiary arkusza, reprezentacja 9 działów, brak duplikatów, determinizm, wynik 21/27=78%, perDzial sumuje się); commit `feat(mat): core/egzamin.js — arkusz 15+6 i wynik egzaminu, TDD (it.3 T2)`.

---

## KARTA 3 — [MAT-It3-T3] core/statystyki.js — agregacje (TDD)

**Lista:** Backlog it.3
**Etykieta:** `matematyka` `core` `it.3`

### Opis
Adaptacja `core/statystyki.js` z polskiego do struktur matematyki: `seriaWynikow` (diagnoza/dział/egzamin → punkty wykresu), `postepPerDzial` (diagnoza vs teraz + delta; priorytet: quiz działu > ostatni egzamin > diagnoza), `aktywnosc` (8 tygodni + seria dni), `pokrycie` (ukończone działy + liczba egzaminów). Zero DOM, zero importów treści.

**Pliki:**
- Create: `src/core/statystyki.js`
- Create: `tests/statystyki.test.mjs`
- Modify: `package.json` (skrypt `test` chainuje statystyki.test.mjs)

**DoD:** `npm test` ✓ (seria chronologiczna bez powtórek, delty per dział, seriaDni=2 na fixture, puste postępy bez wyjątków); commit `feat(mat): core/statystyki.js — agregacje statystyk, TDD (it.3 T3)`.

---

## KARTA 4 — [MAT-It3-T4] EgzaminProbny.jsx

**Lista:** Backlog it.3
**Etykieta:** `matematyka` `ui` `it.3`

### Opis
Ekran symulacji egzaminu: intro → 15 zadań zamkniętych sekwencyjnie (BEZ feedbacku, Wstecz/Dalej, `.opcja--wybrana`) → 6 zadań otwartych (kroki przez `KrokZadania`) → ekran wyniku z rozbiciem per dział. Zegar 125 min informacyjny (bursztyn <15 min, po czasie komunikat bez przerywania).

**Plik:** Create `src/ui/pages/EgzaminProbny.jsx`

**Props:** `{onZakoncz, onWroc}` — `onZakoncz(wynik)` raz, po ostatnim zadaniu otwartym; ekran zostaje na widoku wyniku, powrót przez `onWroc`.

**DoD:** `npm run build` + `npm run lint` bez błędów (routing dopiero w T6); commit `feat(mat): EgzaminProbny.jsx — symulacja arkusza 15+6, zegar 125 min (it.3 T4)`.

---

## KARTA 5 — [MAT-It3-T5] Statystyki.jsx

**Lista:** Backlog it.3
**Etykieta:** `matematyka` `ui` `it.3`

### Opis
Ekran statystyk: „Twoja droga" (`WykresLiniowy` — komponent już istnieje, punkt egzaminu wyróżniony), „Działy: diagnoza → dziś" (9 pasków + delta pp), „Regularność" (słupki 8 tygodni + seria dni), „Pokrycie materiału" (działy X z 9 + liczba egzaminów próbnych).

**Plik:** Create `src/ui/pages/Statystyki.jsx`

**Props:** `{postepy, onWroc}` — etykiety i kolejność działów buduje z `DZIALY` (rejestr).

**DoD:** `npm run build` + `npm run lint` bez błędów; commit `feat(mat): Statystyki.jsx — wykres, działy, regularność, pokrycie (it.3 T5)`.

---

## KARTA 6 — [MAT-It3-T6] Router App.jsx + Start.jsx + QA końcowe + docs

**Lista:** Backlog it.3
**Etykieta:** `matematyka` `ui` `qa` `it.3`

### Opis
Integracja: stany `"egzamin"`/`"statystyki"` w App.jsx, `zakonczonoEgzamin` zapisuje rekord do `postepy.egzaminy` + sesję `{typ:"egzamin"}`, przycisk „🎓 Egzamin próbny" na dashboardzie (Start.jsx). Pełne QA + aktualizacja dokumentacji.

**Pliki:**
- Modify: `src/App.jsx`, `src/ui/pages/Start.jsx`
- Modify: `repetytorium - matematyka/LESSONS.md`, `repetytorium - matematyka/STAN-PROJEKTU.md`

**QA (desktop 1280×900 + mobile 390×844):**
- Golden path egzaminu: intro → 15 zamkniętych (bez feedbacku, Wstecz pamięta zaznaczenie) → 6 otwartych → wynik per dział
- Rekord `egzaminy[0]` zweryfikowany w localStorage (`data`, `wynikPkt`, `maksPkt`, `procent`, `perDzial`)
- Statystyki: wykres z punktem egzaminu, delty działów, regularność, pokrycie
- Notacja przecinkowa w realnym UI (dział Ułamki, „2,5" zaliczone)
- Konsola czysta (0 errors, 0 warnings)

**DoD:** `npm test` ✓ → `npm run build` ✓ → QA desktop ✓ → QA mobile ✓ → LESSONS.md ✓ → STAN-PROJEKTU.md ✓ → 2 commity (feat router + docs).
