# It.7 — UX quizu: pauza po błędzie + fixy KaTeX — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Po błędnej odpowiedzi w quizie działu zatrzymać przepływ (wskazówka + „Przypomnij" + przycisk „Dalej" zamiast auto-przejścia po 1 s) oraz naprawić dwa błędy renderowania KaTeX (wskazówka w quizie, feedback kroku z jednostką — gpo2).

**Architecture:** Zmiany wyłącznie w dwóch komponentach UI: `src/ui/pages/Dzial.jsx` i `src/ui/components/KrokZadania.jsx`. Zero zmian w `core/`, treści JSON, storage i pozostałych ekranach (diagnoza/egzamin/powtórki celowo bez feedbacku). Spec: `docs/superpowers/specs/2026-08-06-matematyka-it7-ux-quizu-design.md`.

**Tech Stack:** React 19 (bez TS), KaTeX przez `KaTeXRenderer` (parser delimiterów `$...$`), QA przez Playwright w przeglądarce.

## Global Constraints

- Zero zmian w `core/`, `content/`, `storage/` i ekranach `TestWstepny`/`EgzaminProbny`/`Powtorka`
- `KaTeXRenderer` renderuje tylko fragmenty w delimiterach `$...$` — LaTeX bez delimiterów wyświetla się jako surowy tekst
- Zachowanie po **poprawnej** odpowiedzi bez zmian: auto-przejście po 1 s
- Kolorowanie opcji po wyborze bez zmian (poprawna zielona `btn--sukces`, wybrana błędna czerwona `btn--blad`), opcje zablokowane po wyborze
- Projekt nie ma testów komponentów React — weryfikacja UI przez QA w przeglądarce; `npm test` (core) musi pozostać zielony
- Git root: `/Users/pibe/dev/Repetytorium-doc` — jawne, cytowane ścieżki przy `git add` (ścieżki zawierają spacje)
- Dev server: `cd "repetytorium - matematyka/app" && npm run dev` → port 5174 (lub 5173)

---

## Task 1: Dzial.jsx — pauza po błędnej odpowiedzi + wskazówka przez KaTeX

**Files:**
- Modify: `repetytorium - matematyka/app/src/ui/pages/Dzial.jsx`

**Interfaces:**
- Consumes: `pytanie.wskazowka`, `pytanie.przypomnij`, `pytanie.poprawna` (istniejące pola JSON); `KaTeXRenderer` (już importowany)
- Produces: funkcja `dalej()` (przejście do następnego pytania / zakończenie), przycisk „Dalej" widoczny tylko po błędnej odpowiedzi

- [ ] **Step 1: Zastąp logikę `wybierz()` — timer tylko przy poprawnej odpowiedzi**

W `Dzial.jsx` zastąp istniejącą funkcję `wybierz` (linie ~46–62) dwiema funkcjami:

```jsx
  function dalej() {
    if (aktualny < pytania.length - 1) {
      setAktualny(aktualny + 1);
      setWybrana(null);
      setPokazFeedback(false);
    } else {
      setZakonczone(true);
    }
  }

  function wybierz(opcja) {
    if (wybrana !== null) return; // blokada podwójnego kliknięcia
    setWybrana(opcja);
    setPokazFeedback(true);
    setOdpowiedzi({ ...odpowiedzi, [pytanie.id]: opcja });

    if (opcja === pytanie.poprawna) {
      timerRef.current = setTimeout(dalej, 1000);
    }
    // błędna odpowiedź: bez timera — przejście przyciskiem „Dalej"
  }
```

Uwaga: istniejący cleanup timera w `useEffect` (linie ~21–25) i `timerRef` zostają bez zmian.

- [ ] **Step 2: Rozwiń „Przypomnij" automatycznie po błędnej odpowiedzi**

W JSX zastąp otwierający tag istniejącego `<details>` (linia ~116):

```jsx
          <details
            open={(pokazFeedback && !czyWybranaPop) || undefined}
            style={{ marginBottom: "var(--sp-3)" }}
          >
```

(`undefined` zamiast `false`, żeby przed odpowiedzią atrybut nie był kontrolowany i ręczne rozwijanie przez uczennicę działało jak dotąd.)

- [ ] **Step 3: Wskazówka przez KaTeX + przycisk „Dalej" po błędzie**

Zastąp istniejący blok feedbacku (linie ~145–149):

```jsx
        {pokazFeedback && !czyWybranaPop && pytanie.wskazowka && (
          <p className="tekst-2" style={{ marginTop: "var(--sp-3)", color: "var(--kolor-uwaga)" }}>
            {pytanie.wskazowka}
          </p>
        )}
```

nowym blokiem:

```jsx
        {pokazFeedback && !czyWybranaPop && (
          <div style={{ marginTop: "var(--sp-3)" }}>
            {pytanie.wskazowka && (
              <p className="tekst-2" style={{ color: "var(--kolor-uwaga)" }}>
                <KaTeXRenderer tekst={pytanie.wskazowka} />
              </p>
            )}
            <button
              className="btn btn-primary btn--pelny"
              style={{ marginTop: "var(--sp-2)" }}
              onClick={dalej}
            >
              Dalej
            </button>
          </div>
        )}
```

- [ ] **Step 4: Testy core (regresja) + build**

```bash
cd "repetytorium - matematyka/app" && npm test && npm run build
```

Oczekiwane: 4 suity OK (quiz, egzamin, statystyki, plan), `✓ built in ...`

- [ ] **Step 5: Szybka weryfikacja w przeglądarce (smoke)**

Uruchom dev server (`npm run dev`), wejdź w dowolny dział (np. Liczby):
1. Kliknij **błędną** opcję → wskazówka widoczna, „Przypomnij" rozwinięte, przycisk „Dalej" obecny, quiz NIE przechodzi dalej sam (odczekaj >2 s)
2. Kliknij „Dalej" → następne pytanie
3. Kliknij **poprawną** opcję → auto-przejście po ~1 s, bez przycisku
4. Konsola: 0 errors

Zabij dev server po weryfikacji.

- [ ] **Step 6: Commit**

```bash
git add "repetytorium - matematyka/app/src/ui/pages/Dzial.jsx"
git commit -m "feat(mat): quiz działu — pauza po błędzie z przyciskiem Dalej, wskazówka przez KaTeX (it.7 T1)"
```

---

## Task 2: KrokZadania.jsx — delimitery `$...$` w feedbacku kroku (fix gpo2)

**Files:**
- Modify: `repetytorium - matematyka/app/src/ui/components/KrokZadania.jsx`

**Interfaces:**
- Consumes: `krok.jednostka`, `wartosc` (stan lokalny komponentu)
- Produces: poprawnie wyrenderowany feedback `Dobrze! $8 \text{ cm}$` zamiast surowego `8 \text{ cm}`

- [ ] **Step 1: Dodaj delimitery w linii ~34**

Zastąp:

```jsx
        <p className="badge badge--sukces">Dobrze! {krok.jednostka && <KaTeXRenderer tekst={`${wartosc} \\text{ ${krok.jednostka}}`} />}</p>
```

przez:

```jsx
        <p className="badge badge--sukces">Dobrze! {krok.jednostka && <KaTeXRenderer tekst={`$${wartosc} \\text{ ${krok.jednostka}}$`} />}</p>
```

- [ ] **Step 2: Build**

```bash
cd "repetytorium - matematyka/app" && npm run build
```

Oczekiwane: `✓ built in ...`

- [ ] **Step 3: Weryfikacja w przeglądarce (gpo2)**

Dev server → dział Geometria płaska → przejdź 5 zamkniętych poprawnie
(gp1–gp5; poprawne odpowiedzi odczytasz z
`src/content/matematyka/dzialy/geometria-plaska.json`) → zadanie otwarte
gpo2 → w krok 1 wpisz `8` → feedback „Dobrze!" pokazuje wyrenderowane
„8 cm" (bez surowego `\text{ cm}`). Konsola: 0 errors. Zabij dev server.

Jeśli quiz otwiera gpo1 zamiast gpo2 (komponent bierze `zadania_otwarte[0]`),
zweryfikuj render na kroku z `jednostka` w gpo1 lub przejdź do gpo2 przez
Powtórki/bezpośrednio — wystarczy dowolny krok z niepustą `jednostka`.

- [ ] **Step 4: Commit**

```bash
git add "repetytorium - matematyka/app/src/ui/components/KrokZadania.jsx"
git commit -m "fix(mat): KrokZadania — delimitery \$...\$ w feedbacku kroku z jednostką (it.7 T2)"
```

---

## Task 3: QA końcowe + docs

**Files:**
- Modify: `repetytorium - matematyka/STAN-PROJEKTU.md`, `repetytorium - matematyka/LESSONS.md`
- Run: `npm test`, `npm run build`, dev server, przeglądarka (Playwright)

**Interfaces:**
- Consumes: zachowania z Task 1 (przycisk „Dalej", auto-advance przy poprawnej) i Task 2 (render kroku z jednostką)
- Produces: potwierdzone DoD it.7, zaktualizowane docs

- [ ] **Step 1: Testy + build**

```bash
cd "repetytorium - matematyka/app" && npm test && npm run build
```

Oczekiwane: 4 suity OK, build ✓

- [ ] **Step 2: QA desktop — pełny przepływ działu**

Dev server → dowolny dział:
1. Błędna odpowiedź w środku quizu → pauza (brak auto-przejścia), wskazówka wyrenderowana przez KaTeX (wybierz pytanie, którego wskazówka zawiera `$...$`, np. w dziale Ułamki u5 — wskazówka z `$\frac{7}{20}$`), „Przypomnij" rozwinięte, „Dalej" przechodzi dalej
2. Błędna odpowiedź na **ostatnim** pytaniu → „Dalej" kończy quiz (ekran wyniku)
3. Poprawna odpowiedź → auto-przejście po ~1 s
4. Zadanie otwarte z krokiem z jednostką → feedback „Dobrze!" renderuje jednostkę
5. Konsola: 0 errors

- [ ] **Step 3: QA mobile (390×844)**

Zmień viewport na 390×844, powtórz skrócony przepływ: błędna odpowiedź →
wskazówka + „Dalej" czytelne i klikalne, brak poziomego scrolla.

- [ ] **Step 4: Sanity egzaminu (brak regresji)**

Rozpocznij Egzamin Próbny → część zamknięta nadal auto-przechodzi bez
feedbacku i bez przycisku „Dalej" (egzamin ma własny komponent — zmiana go
nie dotyczy; to tylko potwierdzenie braku regresji). Przerwij egzamin.

- [ ] **Step 5: Aktualizacja STAN-PROJEKTU.md**

1. Nagłówek „Ostatnia aktualizacja": `2026-08-06, po sesji it.7 (UX quizu: pauza po błędzie + przycisk Dalej; fixy KaTeX wskazówki i feedbacku kroku; build ✓; QA ✓)`
2. „Kolejne kroki": dopisz `**UX quizu (it.7)** ✅ — pauza po błędnej odpowiedzi + wskazówka/Przypomnij + Dalej; fix renderu wskazówki i kroku z jednostką (gpo2)`
3. Dodaj sekcję „Iteracja 7 — plan i stan" (status UKOŃCZONA, tabela 3 tasków, DoD) wg wzorca sekcji it.6
4. „Jak zacząć nową sesję": it.7 ukończona → kierunki it.8 (pole `wyjasnienie` per zadanie, tryb nauki, rozbudowa puli, Hub po angielskim)

- [ ] **Step 6: Wpis LESSONS.md**

Dodaj wpis `## 2026-08-06 (it.7 — UX quizu: pauza po błędzie + fixy KaTeX)` z obserwacjami z QA (min.: przyczyna gpo2 — brak delimiterów `$...$` w templacie, nie w treści JSON; wzorzec „open || undefined" na `<details>` żeby nie kontrolować atrybutu przed feedbackiem) i wnioskami. Zakończ linią `Zmiana w skilu: ...`.

- [ ] **Step 7: Commit końcowy**

```bash
git add \
  "repetytorium - matematyka/STAN-PROJEKTU.md" \
  "repetytorium - matematyka/LESSONS.md"
git commit -m "docs(mat): STAN-PROJEKTU + LESSONS — it.7 ukończona (UX quizu)"
```
