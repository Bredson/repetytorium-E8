# It.6 — nowe działy: Statystyka i Prawdopodobieństwo (design)

> Data: 2026-08-06. Zatwierdzony w brainstormingu.
> Kontekst: it.5 ukończona (45 zamkniętych + 18 otwartych, 9 działów).
> Produkcja: https://repetytorium-matematyka.vercel.app (auto-deploy z `main`).

## Cel

Domknąć pokrycie arkusza CKE: statystyka opisowa i rachunek prawdopodobieństwa
to realne tematy egzaminu ósmoklasisty, których w apce w ogóle nie ma.
Przy celu Zosi 95–100% luka w pokryciu jest ważniejsza niż pogłębianie
istniejących działów.

## Decyzje (z pytań brainstormingu)

| Temat | Decyzja |
|-------|---------|
| Kierunek it.6 | Nowe działy (nie UX, nie rozbudowa istniejącej puli) |
| Podział | Dwa osobne działy: „Statystyka" i „Prawdopodobieństwo" (razem 11 działów) |
| Prezentacja danych | Wyłącznie tekstowo/tabelki tekstowe — bez diagramów SVG, zero zmian w renderowaniu |

## Zakres

Dwa nowe pliki JSON wg istniejącego schematu + dwa wpisy w `rejestr.js`.
**Zero zmian w komponentach** — dashboard (`Start.jsx`), diagnoza
(`TestWstepny.jsx`), statystyki (`Statystyki.jsx`) i egzamin
(`EgzaminProbny.jsx` / `core/egzamin.js`) wywodzą działy dynamicznie
z `DZIALY` w `rejestr.js` (zweryfikowane w kodzie).

### Schemat działu (jak w istniejących 9)

```
{ id, tytul, modul, waga,
  test_wstepny: [×2],
  cwiczenia: [×5 zamkniętych],
  zadania_otwarte: [×2] }
```

Prefiksy zweryfikowane skryptem — brak kolizji z istniejącymi ID.
Pytania `test_wstepny` wg wzorca `tw-<prefiks>N` (np. `tw-st1`, `tw-pw1`).

### `statystyka.json` — prefiksy ID `st` (zamknięte) / `sto` (otwarte)

- Zamknięte (5): średnia arytmetyczna, mediana, moda/dominanta,
  odczyt z tabelki tekstowej, interpretacja danych
- Otwarte (2): policz średnią i medianę zestawu (kroki z walidacją);
  zadanie typu „ile brakuje do średniej X"
- Dane w treści zadania („Oceny: 3, 4, 4, 5, 6") lub prosta tabelka tekstowa

### `prawdopodobienstwo.json` — prefiksy ID `pw` / `pwo`

(`p` zajęte przez potęgi, `pr` przez procenty — zgodnie z lekcją z it.5:
sprawdzić istniejące prefiksy przed dodaniem nowych)

- Zamknięte (5): klasyczna definicja P (kostka, monety, kule),
  zdarzenie pewne/niemożliwe, reguła mnożenia (zliczanie),
  proste losowanie „bez zwracania"
- Otwarte (2): prowadzony tok — zlicz sprzyjające → wszystkie → ułamek;
  drugie z regułą mnożenia

## Skutki uboczne (automatyczne, do weryfikacji w QA)

- Diagnoza: 18 → 22 pytania (po 2 z każdego z 11 działów)
- Pula egzaminu: 45 → 55 zamkniętych, 18 → 22 otwarte; arkusz nadal 15+6;
  `zbudujArkusz` gwarantuje reprezentację wszystkich działów w części
  zamkniętej (11 ≤ 15 — OK)
- Istniejące profile (Zosia) mają zrobioną diagnozę — nowe działy będą bez
  wyniku diagnostycznego; karty działów działają bez niego.
  **Akceptowane** — nie wymuszamy powtórki diagnozy.

## Ryzyka / pułapki (z LESSONS.md)

- Po zapisie każdego JSON: `python3 -c "import json,sys; json.load(open(sys.argv[1]))" plik.json`
- Każdy wzór LaTeX w `tresc`/`opcje`/`poprawna` opakowany w `$...$`
- `oczekiwana` w krokach zadań otwartych jako precyzyjny string;
  normalizacja przecinek/kropka w `sprawdzKrok` działa („0.5" ≡ „0,5")
- `zadania_otwarte` to osobna tablica top-level (nie podzbiór `cwiczenia`)
- Git: jawne ścieżki przy `git add`

## Definition of done

1. `npm test` ✓
2. `npm run build` ✓
3. QA obu działów w przeglądarce: golden path quizu + oba zadania otwarte,
   konsola czysta
4. 1× Egzamin Próbny — nowe działy pojawiają się w arkuszu
5. Wpis w `LESSONS.md` + aktualizacja `STAN-PROJEKTU.md`
6. Commit (jawne ścieżki)

## Poza zakresem

- Diagramy/wykresy SVG w zadaniach
- Zmiany UX (podpowiedzi, wyjaśnienia błędnych odpowiedzi) — kandydat na it.7
- Hub (czeka na ukończenie angielskiego)
