# It.8 — rotacja zadań otwartych + hardeningi (design)

> Data: 2026-08-06. Zatwierdzony w brainstormingu.
> Kontekst: it.7 ukończona (UX quizu). Stan: 11 działów, 55 zamkniętych + 22 otwarte.
> Produkcja: https://repetytorium-matematyka.vercel.app (auto-deploy z `main`).

## Cel

1. Dziś dział po zdanym quizie zawsze otwiera `zadania_otwarte[0]` — **11 zadań
   `*o2` to martwy content** poza Egzaminem Próbnym (obserwacja z LESSONS
   2026-08-06 it.7). Rotacja odblokowuje je w normalnej nauce.
2. Domknąć 4 hardeningi odłożone z finalnego review it.7 (STAN-PROJEKTU §9).

## Decyzje (z pytań brainstormingu)

| Temat | Decyzja |
|-------|---------|
| Strategia rotacji | **Losowo** przy każdym ukończeniu quizu — zero zmian w storage, przy 2 zadaniach 50/50; wielokrotne ćwiczenie działu naturalnie pokaże oba |
| Naprzemienność z zapisem w profilu | Odrzucona (wymaga migracji postępów — YAGNI) |
| Zakres | Code-only, 2 pliki |

## Zakres — 2 pliki

### 1. `src/ui/pages/Dzial.jsx`

- **Rotacja:** w efekcie zakończenia (chronionym `efektZakonczeniaWykonanyRef`,
  wykonuje się raz) zamiast `dzial.zadania_otwarte[0]` — losowy element:
  `dzial.zadania_otwarte[Math.floor(Math.random() * dzial.zadania_otwarte.length)]`.
  Losowanie wewnątrz efektu = brak problemu z czystością renderu.
- **Hardening a:** `dalej()` — `setAktualny(a => a + 1)` (functional updater;
  odporność na podwójny klik przycisku „Dalej").
- **Hardening b:** `reset()` — dodać `clearTimeout(timerRef.current)` na początku.
- **Hardening c:** `<details>` „Przypomnij" — dodać `key={pytanie.id}`, żeby
  ręcznie rozwinięty stan nie przeciekał na następne pytanie po auto-przejściu
  (DOM element jest reużywany bez key; zaobserwowane w review it.7).

### 2. `src/ui/components/KrokZadania.jsx` (linia ~34)

Feedback „Dobrze!": jednostka **poza** trybem math — wzorzec z linii ~62
(`rozwiązanie wzorcowe`):

```jsx
<KaTeXRenderer tekst={`$${wartosc}$ ${krok.jednostka}`} />
```

zamiast `` `$${wartosc} \\text{ ${krok.jednostka}}$` ``. Usuwa ostrzeżenia
konsoli KaTeX (`Unrecognized Unicode character "²"`) dla jednostek `cm²`/`m³`
(gpo2 k2, gpro2 k1/k2, lo1 k1) i edge case surowego inputu ucznia („8cm")
renderowanego kursywą w trybie math.

## Czego nie ruszamy

- `core/`, treść JSON, `storage/` (rotacja losowa = zero zapisu)
- `EgzaminProbny` (używa pełnej puli otwartych przez `zbudujArkusz` — bez zmian)
- `ZadanieOtwarte.jsx` (dostaje zadanie propem — obojętne które)

## Definition of Done

1. `npm test` ✓ (regresja core)
2. `npm run build` ✓
3. QA desktop: kilkukrotne ukończenie quizu tego samego działu (np. Geometria
   płaska) pokazuje różne zadania otwarte (gpo1 i gpo2 w ≤6 próbach);
   krok z jednostką `cm²` (gpo2 k2, odpowiedź 80) — feedback „Dobrze!" bez
   ostrzeżeń KaTeX w konsoli; ręcznie rozwinięte „Przypomnij" zamyka się na
   następnym pytaniu; „Dalej" po błędzie działa jak w it.7; konsola 0 errors
4. QA mobile 390×844 skrócone (jeden przepływ błąd → Dalej)
5. Wpis LESSONS.md + aktualizacja STAN-PROJEKTU.md (sekcja it.8, „Jak zacząć" → it.9)
6. Commit (jawne ścieżki)

## Poza zakresem

- Pole `wyjasnienie` per zadanie, tryb nauki (kandydaci it.9)
- Angielski + Hub (następny duży kierunek po it.8)
