# It.8 — rotacja zadań otwartych + hardeningi — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Losowy wybór zadania otwartego po zdanym quizie działu (odblokowanie 11 martwych zadań `*o2`) + 4 hardeningi odłożone z finalnego review it.7.

**Architecture:** Zmiany wyłącznie w `src/ui/pages/Dzial.jsx` (rotacja + 3 hardeningi) i `src/ui/components/KrokZadania.jsx` (jednostka poza `$...$`). Zero zmian w `core/`, treści JSON, storage i innych ekranach. Spec: `docs/superpowers/specs/2026-08-06-matematyka-it8-rotacja-hardeningi-design.md`.

**Tech Stack:** React 19 (bez TS), KaTeX przez `KaTeXRenderer` (renderuje tylko fragmenty `$...$`), QA przez Playwright.

## Global Constraints

- Tylko dwa pliki mogą się zmienić: `Dzial.jsx` i `KrokZadania.jsx`
- Losowanie zadania otwartego wyłącznie wewnątrz efektu zakończenia (chronionego `efektZakonczeniaWykonanyRef`) — nigdy w ciele renderu
- Zachowania z it.7 bez regresji: pauza + „Dalej" po błędzie, auto-przejście po poprawnej, `open={(...) || undefined}` na `<details>`
- `npm test` (core) musi pozostać zielony
- Git root: `/Users/pibe/dev/Repetytorium-doc` — jawne, cytowane ścieżki przy `git add` (spacje w ścieżkach)
- Dev server: `cd "repetytorium - matematyka/app" && npm run dev` → port 5174 (lub 5173)

---

## Task 1: Dzial.jsx — rotacja + 3 hardeningi

**Files:**
- Modify: `repetytorium - matematyka/app/src/ui/pages/Dzial.jsx`

**Interfaces:**
- Consumes: `dzial.zadania_otwarte` (tablica), `efektZakonczeniaWykonanyRef`, `timerRef`, `pytanie.id` (istniejące)
- Produces: losowe zadanie w wywołaniu `onZadanieOtwarte`; odporny na podwójny klik `dalej()`; czysty `reset()`; `<details>` z `key`

- [ ] **Step 1: Rotacja — losowy wybór zadania otwartego**

W efekcie zakończenia zastąp linię (obecnie ~38):

```jsx
        onZadanieOtwarte({ zadanie: dzial.zadania_otwarte[0], wynikZamknietych: wynik });
```

przez:

```jsx
        const zadanie =
          dzial.zadania_otwarte[Math.floor(Math.random() * dzial.zadania_otwarte.length)];
        onZadanieOtwarte({ zadanie, wynikZamknietych: wynik });
```

(Efekt jest chroniony refem i wykonuje się raz — losowanie tutaj jest bezpieczne.)

- [ ] **Step 2: Hardening — functional updater w `dalej()`**

W funkcji `dalej()` zastąp:

```jsx
      setAktualny(aktualny + 1);
```

przez:

```jsx
      setAktualny((a) => a + 1);
```

- [ ] **Step 3: Hardening — `clearTimeout` w `reset()`**

Na początku funkcji `reset()` dodaj:

```jsx
    if (timerRef.current) clearTimeout(timerRef.current);
```

- [ ] **Step 4: Hardening — `key` na `<details>`**

Do otwierającego tagu `<details>` (sekcja „Przypomnij") dodaj `key={pytanie.id}`:

```jsx
          <details
            key={pytanie.id}
            open={(pokazFeedback && !czyWybranaPop) || undefined}
            style={{ marginBottom: "var(--sp-3)" }}
          >
```

- [ ] **Step 5: Testy + build**

```bash
cd "repetytorium - matematyka/app" && npm test && npm run build
```

Oczekiwane: 4 suity OK, `✓ built in ...`

- [ ] **Step 6: Smoke w przeglądarce**

Dev server → dowolny dział:
1. Ręcznie rozwiń „Przypomnij" na pytaniu 1, odpowiedz poprawnie → na pytaniu 2 „Przypomnij" jest **zwinięte** (fix key)
2. Błędna odpowiedź → pauza + „Dalej" działa (regresja it.7)
3. Zdaj quiz (≥80%) → przechodzi do zadania otwartego (dowolnego)
4. Konsola: 0 errors

Zabij dev server.

- [ ] **Step 7: Commit**

```bash
git add "repetytorium - matematyka/app/src/ui/pages/Dzial.jsx"
git commit -m "feat(mat): Dzial — losowe zadanie otwarte + hardeningi z review it.7 (it.8 T1)"
```

---

## Task 2: KrokZadania.jsx — jednostka poza `$...$`

**Files:**
- Modify: `repetytorium - matematyka/app/src/ui/components/KrokZadania.jsx`

**Interfaces:**
- Consumes: `wartosc`, `krok.jednostka` (istniejące)
- Produces: feedback „Dobrze!" bez ostrzeżeń KaTeX dla jednostek z `²`/`³`

- [ ] **Step 1: Zmień linię ~34**

Zastąp:

```jsx
        <p className="badge badge--sukces">Dobrze! {krok.jednostka && <KaTeXRenderer tekst={`$${wartosc} \\text{ ${krok.jednostka}}$`} />}</p>
```

przez (wzorzec z linii ~62 — jednostka jako zwykły tekst poza math):

```jsx
        <p className="badge badge--sukces">Dobrze! {krok.jednostka && <KaTeXRenderer tekst={`$${wartosc}$ ${krok.jednostka}`} />}</p>
```

- [ ] **Step 2: Build**

```bash
cd "repetytorium - matematyka/app" && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add "repetytorium - matematyka/app/src/ui/components/KrokZadania.jsx"
git commit -m "fix(mat): KrokZadania — jednostka poza trybem math (ostrzeżenia KaTeX cm²/m³) (it.8 T2)"
```

(Weryfikacja w przeglądarce na kroku z `cm²` — w Task 3, gdzie i tak przechodzimy gpo2.)

---

## Task 3: QA końcowe + docs

**Files:**
- Modify: `repetytorium - matematyka/STAN-PROJEKTU.md`, `repetytorium - matematyka/LESSONS.md`
- Run: `npm test`, `npm run build`, dev server, przeglądarka (Playwright)

**Interfaces:**
- Consumes: rotacja i hardeningi z Task 1, feedback jednostki z Task 2
- Produces: potwierdzone DoD it.8, zaktualizowane docs

- [ ] **Step 1: Testy + build**

```bash
cd "repetytorium - matematyka/app" && npm test && npm run build
```

- [ ] **Step 2: QA desktop — rotacja**

Dev server → dział **Geometria płaska** (poprawne odpowiedzi zamkniętych
odczytaj z `src/content/matematyka/dzialy/geometria-plaska.json`):
1. Ukończ quiz kilkukrotnie (wróć do działu po każdym zadaniu otwartym /
   przez „Wróć") — w ≤6 podejściach powinny pojawić się **oba** zadania
   otwarte (gpo1 „drabina/prostokąt" i gpo2). Zapisz, które wypadły.
2. Przy trafieniu gpo2: krok 1 odpowiedź `8`, krok 2 odpowiedź `80` —
   feedback „Dobrze! 80 cm²" wyrenderowany, **konsola bez ostrzeżeń KaTeX**
   (`Unrecognized Unicode character` nie występuje)
3. „Przypomnij" rozwinięte ręcznie na pytaniu N zwija się na N+1 (fix key)
4. Regresja it.7: błędna odpowiedź → pauza + wskazówka + „Dalej"
5. Konsola: 0 errors

- [ ] **Step 3: QA mobile (390×844)**

Jeden skrócony przepływ: błędna odpowiedź → wskazówka + „Dalej" czytelne,
brak poziomego scrolla.

- [ ] **Step 4: Aktualizacja STAN-PROJEKTU.md**

1. Nagłówek „Ostatnia aktualizacja": `2026-08-06, po sesji it.8 (rotacja zadań otwartych + hardeningi z review it.7; build ✓; QA ✓)`
2. „Kolejne kroki": dopisz `**Rotacja + hardeningi (it.8)** ✅ — losowe zadanie otwarte po quizie (odblokowane *o2), functional updater/clearTimeout/key, jednostka poza $...$`
3. Dodaj sekcję „Iteracja 8 — plan i stan" (UKOŃCZONA, tabela 3 tasków, DoD) wg wzorca 8c
4. „Jak zacząć nową sesję": it.8 ukończona → kierunki it.9: pole `wyjasnienie` per zadanie, tryb nauki, rozbudowa puli, **angielski + Hub** (rekomendowany następny duży kierunek); usuń z listy hardeningi (zrobione)

- [ ] **Step 5: Wpis LESSONS.md**

`## 2026-08-06 (it.8 — rotacja zadań otwartych + hardeningi)` — obserwacje
z QA (min.: ile podejść zajęło zobaczenie obu zadań; potwierdzenie braku
ostrzeżeń KaTeX na cm²; zachowanie key na details). Zakończ `Zmiana w skilu: ...`.

- [ ] **Step 6: Commit końcowy**

```bash
git add \
  "repetytorium - matematyka/STAN-PROJEKTU.md" \
  "repetytorium - matematyka/LESSONS.md"
git commit -m "docs(mat): STAN-PROJEKTU + LESSONS — it.8 ukończona (rotacja + hardeningi)"
```
