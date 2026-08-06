# Angielski it.1 — scaffold SPA + 3 działy tekstowe (design)

> Data: 2026-08-06. Zatwierdzony w brainstormingu.
> Kontekst: infrastruktura skilla gotowa (SKILL.md + reference), zero uczniów
> i materiałów. Decyzja architektoniczna z STAN-PROJEKTU §7.3 rozstrzygnięta.

## Cel

Aplikacja SPA do samodzielnej nauki angielskiego pod egzamin ósmoklasisty
(Zosia, maj 2027, cel 95–100%), na sprawdzonym wzorcu matematyki. It.1 dowozi
działający cykl nauki dla 3 z 5 sprawności arkusza.

## Decyzje (z pytań brainstormingu)

| Temat | Decyzja |
|-------|---------|
| Architektura | **SPA React jak matematyka** (nie model skillowy HTML-per-uczeń, nie hybryda) — samodzielna nauka bez pośrednictwa Claude, spójność z Hubem |
| Działy | **5 sprawności arkusza E8** (nie tematy leksykalne): Słuchanie, Funkcje językowe, Czytanie, Środki językowe, Wypowiedź pisemna |
| Zakres it.1 | Scaffold + diagnoza + dashboard + **3 działy tekstowe** (funkcje, czytanie, środki); Słuchanie (TTS) → it.2; Wypowiedź pisemna → it.3 |

## Stack i architektura

- **Vite + React 19**, bez TypeScript, bez routera (ekrany przez `useState` w `App.jsx`) — wzorzec matematyki
- Warstwy: `content/` (JSON) → `core/` (czysta logika, zero DOM, TDD `node:assert/strict`) → `storage/` → `ui/`
- **Bez KaTeX** — czysty tekst (prosty render, bez parsera `$...$`)
- localStorage przez adapter parametryczny; klucz: `rep:postepy:{uuid}:angielski`
- Lokalizacja: `repetytorium - j_angielski/app/`
- Dev server: port **5175** (5173 polski, 5174 matematyka)
- Deploy Vercel: **poza zakresem it.1** (osobna iteracja jak mat it.4; wymaga ręcznej konfiguracji Root Directory w dashboardzie)
- Git root: `/Users/pibe/dev/Repetytorium-doc` — jawne ścieżki przy `git add`

## Treść — schemat JSON działu

Wzorzec matematyki z adaptacjami dla języka:

```
{ id, tytul, modul, waga,
  test_wstepny: [×2],           // zamknięte MC
  cwiczenia: [×5],              // zamknięte MC; opcjonalne pole "tekst"
  zadania_otwarte: [×2] }       // luki/parafrazy/tłumaczenia
```

- **`tekst`** (opcjonalne, w zamkniętych) — krótki tekst źródłowy wyświetlany nad
  pytaniem (czytanie). Wiązki z długimi tekstami (jak w arkuszu) — przy egzaminie
  próbnym w późniejszej iteracji.
- **Zadania otwarte**: kroki jak w matematyce, ale zamiast `oczekiwana` (liczba) —
  **`akceptowane: ["went", "walked"]`** (tablica poprawnych wariantów).
  Walidacja: trim + case-insensitive porównanie z każdym wariantem.
  **Bez fuzzy matchingu** — pisownia się liczy na E8 (zadania otwarte, CKE).
- Każde zamknięte ma `wskazowka` + `przypomnij` (mini-teoria inline);
  każde otwarte ma `kroki` (≥1), `rozwiazanie_wzorcowe`, `punkty`.

### Działy it.1 (3 pliki JSON + rejestr.js)

| Dział | id | Zawartość (z reference/egzamin.md) |
|-------|-----|-------------------------------------|
| Funkcje językowe | `funkcje` | dobieranie reakcji (zwroty grzecznościowe — priorytet CKE 2025!), sytuacje typowe: prośba, propozycja, rada, przepraszanie |
| Czytanie | `czytanie` | MC z krótkim tekstem (`tekst`), dobieranie nagłówka, intencja autora, szczegół vs główna myśl |
| Środki językowe | `srodki` | katalog II.1: Past Simple (26% poprawnych w 2025 — priorytet!), czasy podstawowe, przyimki, parafraza + tłumaczenie fragmentów (otwarte) |

Treść zgodna z wariantem II.1 — **nie używać treści usuniętych** (mowa zależna,
pytania pośrednie, strona bierna w Present Perfect) — lekcja z LESSONS.

## Core (TDD)

- `core/quiz.js` — `obliczWynikDzialu`, `sprawdzKrok` (adaptacja: porównanie
  z tablicą `akceptowane`, trim + lowercase)
- `core/profil.js` — profil, PIN, `pustePostepy()` ze strukturą `dzialy:{}`
- `core/plan.js` — `generujPlan(diagnoza, kolejnosc)` + `migrujPlan` — **od razu
  parametryczne względem rejestru** (lekcja z review it.6 matematyki!)
- `core/powtorki.js` — spaced repetition (`nowaPowtorka`, `coNaDzis`, `oznaczPowtorke`)

## Ekrany it.1 (kopiowane/adaptowane z matematyki)

- `WyborProfilu`, `EkranPin`, `NowyProfil` — bez zmian koncepcyjnych
- `TestWstepny` — diagnoza 6 pytań (po 2 z 3 działów), wynik ratio per dział
- `Start` — dashboard 3 karty działów + banner diagnozy + „Na dziś" (powtórki)
- `Dzial` — quiz zamknięty z pauzą po błędzie + „Dalej" (wzorzec z mat it.7 —
  od razu, nie iterować do tego), próg 80%, **losowe** zadanie otwarte (wzorzec
  it.8), opcjonalny `tekst` nad pytaniem
- `ZadanieOtwarte` — kroki sekwencyjne, walidacja `akceptowane`
- `Powtorka` — sesja spaced-repetition
- `App.jsx` — router stanowy

Bez: egzaminu próbnego (wymaga 5 sprawności — po it.3), statystyk (późniejsza iteracja).

## Definition of Done it.1

1. `npm test` ✓ (core TDD)
2. `npm run build` ✓
3. QA desktop: pełny golden path (profil → diagnoza → dział → quiz z pauzą po
   błędzie → zadanie otwarte → powtórka na dashboardzie); walidacja `akceptowane`
   (wariant 1 i 2 zaliczane, literówka odrzucana); konsola 0 errors
4. QA mobile 390×844
5. Aktualizacja `repetytorium - j_angielski/STAN-PROJEKTU.md` (nowy model —
   sekcja architektury do przepisania!) + wpis LESSONS.md
6. Commity (jawne ścieżki)

## Poza zakresem it.1

- Słuchanie / TTS Web Speech API (it.2)
- Wypowiedź pisemna — tryb prowadzony + samoocena wg kryteriów CKE (it.3)
- Egzamin próbny, statystyki, deploy Vercel, Hub
- Wiązki czytania z długimi tekstami (≤850 słów) — przy egzaminie próbnym
