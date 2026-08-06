# It.7 — UX quizu: pauza po błędzie + fixy renderowania (design)

> Data: 2026-08-06. Zatwierdzony w brainstormingu.
> Kontekst: it.6 ukończona (11 działów, 55 zamkniętych + 22 otwarte).
> Produkcja: https://repetytorium-matematyka.vercel.app (auto-deploy z `main`).

## Cel

Przy obecnej puli zadań największą wartością dla uczennicy jest jakość
feedbacku, a ten dziś zawodzi w trzech miejscach:

1. Feedback po błędnej odpowiedzi w quizie działu znika po **1 sekundzie**
   (auto-przejście do następnego pytania) — uczennica nie zdąży przeczytać
   wskazówki ani zrozumieć błędu.
2. `wskazowka` w quizie jest renderowana bez KaTeX (`Dzial.jsx:147`) —
   wskazówki zawierające LaTeX pokazują surowy kod (`$\frac{7}{20}$...`).
3. Feedback poprawnego kroku zadania otwartego buduje LaTeX **bez
   delimiterów `$...$`** (`KrokZadania.jsx:34`) — np. gpo2 pokazuje surowe
   `8 \text{ cm}` (zgłoszone w LESSONS przy QA it.6).

## Decyzje (z pytań brainstormingu)

| Temat | Decyzja |
|-------|---------|
| Kierunek it.7 | UX quizu (nie rozbudowa puli, nie tryb nauki, nie angielski) |
| Zakres | **Code-only** — wykorzystuje istniejące pola `wskazowka`/`przypomnij`; zero nowej treści JSON |
| Wyjaśnienia per błędna opcja | Poza zakresem (wymagałoby treści dla 55 zadań — kandydat na później) |
| Tryb nauki | Poza zakresem |

## Zakres — 3 zmiany, 2 pliki

### 1. Pauza po błędnej odpowiedzi (`src/ui/pages/Dzial.jsx`)

Obecnie `wybierz()` zawsze ustawia `setTimeout(1000)` i przechodzi dalej.

Nowe zachowanie:
- **Poprawna odpowiedź**: bez zmian — auto-przejście po 1 s (szybki flow).
- **Błędna odpowiedź**: bez timera. Pokazuje się:
  - wskazówka (render przez KaTeX — patrz zmiana 2),
  - sekcja „Przypomnij" rozwinięta automatycznie (atrybut `open` na
    istniejącym `<details>`, gdy pokazywany jest feedback błędu),
  - przycisk **„Dalej"**, który dopiero przenosi do następnego pytania
    (lub kończy quiz na ostatnim pytaniu).
- Opcje odpowiedzi pozostają zablokowane po wyborze (jak dziś);
  kolorowanie poprawna-zielona / wybrana-czerwona bez zmian.

### 2. Wskazówka przez KaTeX (`src/ui/pages/Dzial.jsx:147`)

`{pytanie.wskazowka}` → `<KaTeXRenderer tekst={pytanie.wskazowka} />`.

### 3. Delimitery w feedbacku kroku (`src/ui/components/KrokZadania.jsx:34`)

`` `${wartosc} \\text{ ${krok.jednostka}}` `` →
`` `$${wartosc} \\text{ ${krok.jednostka}}$` `` — naprawia gpo2 i każdy
krok z `jednostka` (klasa problemu, nie pojedyncze zadanie).

## Czego nie ruszamy

- `TestWstepny` (diagnoza) — assessment bez feedbacku, celowo
- `EgzaminProbny` — warunki egzaminacyjne, celowo bez feedbacku
- `Powtorka` — samoocena umiem/jeszcze-nie
- `core/`, treść JSON, storage

## Testy i Definition of Done

Zmiany czysto UI — projekt nie ma testów komponentów React (core testowany
przez `node:assert`). Weryfikacja przez QA w przeglądarce:

1. `npm test` ✓ (regresja core — bez zmian oczekiwanych)
2. `npm run build` ✓
3. QA desktop: błędna odpowiedź → pauza, wskazówka z poprawnym renderem
   KaTeX, „Przypomnij" rozwinięte, przycisk „Dalej" działa (środek i koniec
   quizu); poprawna odpowiedź → auto-advance po 1 s; zadanie otwarte z
   jednostką (np. gpo2) → feedback kroku renderuje KaTeX (brak surowego
   `\text{ cm}`); konsola 0 errors
4. QA mobile 390×844 ✓
5. Wpis LESSONS.md + aktualizacja STAN-PROJEKTU.md
6. Commit (jawne ścieżki)

## Poza zakresem (kandydaci na kolejne iteracje)

- Pole `wyjasnienie` per zadanie (dlaczego błędne opcje są złe)
- Tryb nauki (przeglądanie zadań bez punktacji)
- Rozbudowa puli, Hub (po angielskim)
