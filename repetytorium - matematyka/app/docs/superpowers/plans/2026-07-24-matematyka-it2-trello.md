# Trello — Matematyka it.2

> Wklej do tablicy Repetytorium / kolumna "W toku" lub "Backlog it.2"

---

## KARTA 1 — [MAT-It2-T1] 8 działów JSON + rejestr.js

**Lista:** Backlog it.2  
**Etykieta:** `matematyka` `treść` `it.2`

### Opis
Tworzy 8 brakujących plików JSON z treścią matematyczną oraz aktualizuje `rejestr.js` do pełnego importu 9 działów.

**Pliki:**
- Create ×8: `src/content/matematyka/dzialy/{ulamki,potegi,procenty,algebra,rownania,geometria-plaska,pitagoras,geometria-przestrzenna}.json`
- Modify: `src/content/matematyka/rejestr.js`

**Schemat każdego działu:** 2 pytania `test_wstepny` + 3 `cwiczenia` (zamknięte) + 1 `zadanie_otwarte` z ≥1 krokiem.

**DoD:** `python3 -c "import json,sys; json.load(open(sys.argv[1]))" *.json` przechodzi bez błędu; `npm run dev` nie rzuca błędów importu; commit `feat(mat): 8 działów JSON + pełny rejestr.js (it.2 T1)`.

---

## KARTA 2 — [MAT-It2-T2] Dzial.jsx

**Lista:** Backlog it.2  
**Etykieta:** `matematyka` `ui` `it.2`

### Opis
Nowy ekran quizu zamkniętego dla jednego działu. Wyświetla 3 pytania zamknięte sekwencyjnie, z wizualnym feedbackiem (zielone/czerwone po odpowiedzi). Próg ukończenia: 80%.

**Plik:** Create `src/ui/pages/Dzial.jsx`

**Props:** `{dzialId, postepy, onZakoncz, onZadanieOtwarte, onWroc}`

**Logika:**
- Po odpowiedzi: podświetl poprawną/błędną opcję przez 1 s, potem następne pytanie
- Przy wyniku ≥ 80%: jeśli są `zadania_otwarte` → `onZadanieOtwarte({zadanie, wynikZamknietych})`; jeśli nie → `onZakoncz(wynik)`
- Przy wyniku < 80%: podsumowanie z przyciskami "Spróbuj jeszcze raz" i "Wróć"

**DoD:** `npm run build` bez błędów; commit `feat(mat): Dzial.jsx — quiz zamknięty z feedbackiem (it.2 T2)`.

---

## KARTA 3 — [MAT-It2-T3] ZadanieOtwarte.jsx

**Lista:** Backlog it.2  
**Etykieta:** `matematyka` `ui` `it.2`

### Opis
Ekran prowadzonego toku rozumowania — kroki z walidacją numeryczną, używa istniejącego komponentu `KrokZadania.jsx`.

**Plik:** Create `src/ui/pages/ZadanieOtwarte.jsx`

**Props:** `{zadanie, wynikZamknietych, dzialId, onZakoncz, onWroc}`

**Logika:**
- Kroki sekwencyjne (nowy krok po zamknięciu poprzedniego)
- Po wszystkich krokach: podsumowanie punktów + rozwiązanie wzorcowe przez KaTeX
- Przycisk "Zakończ dział" → `onZakoncz({dzialId, ...wynikZamknietych, punktyOtwarte, maxPunktyOtwarte})`

**DoD:** `npm run build` bez błędów; commit `feat(mat): ZadanieOtwarte.jsx — prowadzony tok rozumowania krok po kroku (it.2 T3)`.

---

## KARTA 4 — [MAT-It2-T4] Powtorka.jsx

**Lista:** Backlog it.2  
**Etykieta:** `matematyka` `ui` `spaced-repetition` `it.2`

### Opis
Sesja powtórkowa spaced repetition — quizuje użytkownika z działów zaplanowanych na dziś, użytkownik sam ocenia "Umiem" / "Jeszcze nie".

**Plik:** Create `src/ui/pages/Powtorka.jsx`

**Props:** `{powtorkiDzis, postepy, onZakoncz, onWroc}`

**Logika:**
- Dla każdej powtórki: losowe pytanie zamknięte z `material(rekord.temat).cwiczenia`
- Po wyborze opcji: opcja 4 — przycisk "Umiem ✓" / "Jeszcze nie"
- `oznaczPowtorke(rekord, ocena)` + `zaktualizujPowtorki` per rekord
- Podsumowanie: X umiem / Y jeszcze nie → "Gotowe" → `onZakoncz(nowePowtorki)`

**DoD:** `npm run build` bez błędów; commit `feat(mat): Powtorka.jsx — sesja spaced-repetition (it.2 T4)`.

---

## KARTA 5 — [MAT-It2-T5] App.jsx + Start.jsx + LESSONS + DoD

**Lista:** Backlog it.2  
**Etykieta:** `matematyka` `router` `it.2` `DoD`

### Opis
Podpięcie nowych ekranów do routera stanowego; aktualizacja Start.jsx z przyciskiem powtórek; zapis postepów i planu; LESSONS.md i STAN-PROJEKTU.md.

**Pliki:** Modify `src/App.jsx`, `src/ui/pages/Start.jsx`, `LESSONS.md`, `STAN-PROJEKTU.md`

**Nowe stany routera:** `"dzial"`, `"zadanie-otwarte"`, `"powtorka"`

**Logika App.jsx:**
- `zakonczonoDzial(wynik)`: zapisuje `postepy.dzialy[dzialId]`, aktualizuje `plan[].status`, dodaje powtórkę przez `nowaPowtorka`
- `zakonczonoPowtorke(nowePowtorki)`: zapisuje zaktualizowane powtórki, push sesja
- Start.jsx: prop `onPowtorka` + przycisk "Rozpocznij powtórki" w bannerze "Na dziś"

**QA golden path:**
1. Utwórz profil → wybierz dział → quiz → wynik ≥ 80% → ZadanieOtwarte → zakończ → dashboard z wypełnionym paskiem
2. Sprawdź, że powtórka jest zaplanowana (+1 dzień)
3. QA mobile 390px

**DoD:** build ✓ → QA desktop ✓ → QA mobile ✓ → LESSONS.md ✓ → commit końcowy it.2 ✓
