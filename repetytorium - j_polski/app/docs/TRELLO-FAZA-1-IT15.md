# Trello — iteracja 15: Statystyki postępu

> Karty do tablicy. Kolejność = zależności (task N wymaga N-1, wyjątek: T5 zależy tylko od T1).
> Źródło: `PLAN-FAZA-1-IT15.md` · Spec: `SPEC-FAZA-1-IT15.md`

---

## Karta 1/8 — Core: seria wyników w czasie

**Opis:**
Funkcja `seriaWynikow(postepy, mapaEtykiet)` w nowym module `app/src/core/statystyki.js` — chronologiczna lista `{data, procent, typ, etykieta}` z historii sesji (diagnoza, quizy, pisanie, egzaminy; bez powtórek i fiszek). TDD: najpierw testy `node --test` w nowym `app/tests/statystyki.test.mjs`.

**Checklista:**
- [ ] Failing testy (chronologia, filtrowanie typów, procent, etykiety)
- [ ] Implementacja
- [ ] Testy zielone (2)
- [ ] Commit `It. 15 (1/8)`

---

## Karta 2/8 — Core: postęp per moduł A-F

**Opis:**
`postepPerModul(postepy, mapaModulow)` → dla każdego modułu `{diagnoza, teraz, delta}` w procentach. „Teraz" = średnia ważona punktami z ostatnich wyników materiałów + ostatniego egzaminu; moduł bez nowych danych → delta 0.

**Checklista:**
- [ ] Failing testy (delta ▲/▽/=, F z pisania+egzaminu, brak danych)
- [ ] Implementacja + eksport `MODULY_KOLEJNOSC`
- [ ] Testy zielone (4)
- [ ] Commit `It. 15 (2/8)`

---

## Karta 3/8 — Core: regularność (seria dni + 8 tygodni)

**Opis:**
`aktywnosc(postepy, dzis)` → `{tygodnie: [8×{od, liczba}], seriaDni}`. Seria liczona wstecz; dziś bez sesji NIE zeruje serii zaczętej wczoraj (growth mindset). Tygodnie od poniedziałku.

**Checklista:**
- [ ] Failing testy (seria wstecz, przerwa zeruje, granice tygodni)
- [ ] Implementacja
- [ ] Testy zielone (6)
- [ ] Commit `It. 15 (3/8)`

---

## Karta 4/8 — Core: pokrycie materiału

**Opis:**
`pokrycie(postepy, liczebnosci)` → 3 wiersze „Przerobione X z Y" (Lektury / Ćwiczenia / Pisanie). Zrobione = zapisany quiz lub praca pisemna.

**Checklista:**
- [ ] Failing test
- [ ] Implementacja
- [ ] Testy zielone (7)
- [ ] Commit `It. 15 (4/8)`

---

## Karta 5/8 — Komponent: wykres liniowy SVG

**Opis:**
`app/src/ui/components/WykresLiniowy.jsx` — czysty SVG (`viewBox 600×240`, skaluje się do karty → mobile bez osobnej logiki). Oś Y 0-100%, oś X czas, linia odniesienia 80% („próg umiem"), egzaminy jako większe punkty w kolorze sukcesu. Kolory tylko ze zmiennych CSS (motyw ciemny automatyczny). Zero nowych zależności.

**Checklista:**
- [ ] Implementacja komponentu
- [ ] `npx oxlint` bez błędów
- [ ] Commit `It. 15 (5/8)`

---

## Karta 6/8 — Ekran: Statystyki (4 sekcje)

**Opis:**
`app/src/ui/pages/Statystyki.jsx` — sekcje-karty: **Twoja droga** (wykres + podpis ostatni/najlepszy wynik, przy 1 punkcie zachęta), **Moduły diagnoza→dziś** (6 pasków `PasekPostepu` z deltą ▲/▽/=), **Regularność** (słupki 8 tygodni + komunikat serii 🔥/🌱), **Pokrycie materiału** (3 paski). Komunikacja po polsku, dla 14-latki, zawsze zachęcająca.

**Checklista:**
- [ ] Implementacja ekranu (4 sekcje + Wróć)
- [ ] `npx oxlint` bez błędów
- [ ] Commit `It. 15 (6/8)`

---

## Karta 7/8 — Spięcie: App + Start + build

**Opis:**
`App.jsx`: ekran `"statystyki"`, mapy etykiet/modułów/liczebności budowane raz z rejestru (core nie importuje treści). `Start.jsx`: przycisk „📊 Zobacz statystyki postępu" w karcie „Twoja diagnoza". Build produkcyjny + wszystkie testy.

**Checklista:**
- [ ] Import + mapy + ekran w `App.jsx`
- [ ] Przycisk + prop w `Start.jsx`
- [ ] `npm run build` ✓ i `node --test tests/` 7× PASS
- [ ] Commit `It. 15 (7/8)`

---

## Karta 8/8 — QA + domknięcie iteracji

**Opis:**
Pełna procedura definition of done: backup stanu Zosi → QA desktop (wejście z karty diagnozy, 4 sekcje zgodne ze stanem, oba motywy) → QA mobile 390×844 (`scrollWidth === innerWidth`) → przywrócenie stanu Zosi (usunąć `backup-tmp.json`!) → wpis w `LESSONS.md` → aktualizacja `STAN-PROJEKTU.md` (it. 15, backlog) → commit + push.

**Checklista:**
- [ ] Backup stanu Zosi
- [ ] QA desktop (jasny + ciemny motyw)
- [ ] QA mobile 390×844
- [ ] Restore stanu Zosi + usunięty plik tymczasowy
- [ ] LESSONS.md + STAN-PROJEKTU.md
- [ ] Commit `It. 15 (8/8)` + push
