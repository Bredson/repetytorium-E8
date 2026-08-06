# Trello — it.6 Nowe działy: Statystyka i Prawdopodobieństwo

> Karty do tablicy Trello. Jedna karta = jeden task z planu
> `2026-08-06-matematyka-it6-nowe-dzialy.md`.

---

## T1 — nowy dział statystyka.json + rejestr

**Cel:** Nowy dział "Statystyka" (moduł J) — 2 pytania diagnozy + 5 zamkniętych + 2 otwarte
**Pliki:** `src/content/matematyka/dzialy/statystyka.json` (nowy), `src/content/matematyka/rejestr.js`
**Zadania:** st1 (średnia), st2 (mediana parzystej liczby danych), st3 (dominanta), st4 (odczyt z tabelki tekstowej), st5 (suma ze średniej); sto1 (średnia + mediana ocen — 3-krokowe), sto2 (znajdź x ze średniej — 2-krokowe)
**Done:** `python3 json.load` ✓ → 2 tw + 5 zamkniętych + 2 otwarte → wpis w rejestr.js → `npm run build` ✓ → commit

---

## T2 — nowy dział prawdopodobienstwo.json + rejestr

**Cel:** Nowy dział "Prawdopodobieństwo" (moduł K) — 2 pytania diagnozy + 5 zamkniętych + 2 otwarte
**Pliki:** `src/content/matematyka/dzialy/prawdopodobienstwo.json` (nowy), `src/content/matematyka/rejestr.js`
**Zadania:** pw1 (P parzystej na kostce), pw2 (dwa orły), pw3 (zdarzenie pewne), pw4 (reguła mnożenia), pw5 (bez zwracania); pwo1 (P kuli zielonej — 3-krokowe), pwo2 (zestawy + P ulubionego — 2-krokowe)
**Done:** `python3 json.load` ✓ → 2 tw + 5 zamkniętych + 2 otwarte → wpis w rejestr.js → `npm run build` ✓ → commit

---

## T3 — weryfikacja końcowa + QA + docs

**Cel:** Potwierdzić pulę 55 zamkniętych + 22 otwarte (11 działów) i domknąć iterację
**Pliki:** `STAN-PROJEKTU.md`, `LESSONS.md`
**Kroki:** raport puli (55+22) → `npm test` + build ✓ → QA przeglądarka: dashboard 11 kart, oba nowe działy (quiz + otwarte), Egzamin Próbny z reprezentacją nowych działów, diagnoza 22 pytania na świeżym profilu → aktualizacja STAN-PROJEKTU (sekcja it.6, „Jak zacząć" → it.7) → wpis LESSONS → commit
**Done:** wszystkie QA ✓, konsola 0 errors, docs zaktualizowane, commit
