# It.5 — Rozbudowa puli zadań Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rozbudować każdy z 9 działów JSON do minimum 5 zamkniętych + 2 otwarte, tak by arkusz egzaminacyjny losował z wystarczająco dużej puli.

**Architecture:** Wyłącznie edycja plików JSON w `src/content/matematyka/dzialy/`. Zero zmian w kodzie React/core. Każdy task = jeden plik JSON. Po każdym tasku: walidacja `python3 json.load` + weryfikacja liczby zadań.

**Tech Stack:** JSON (format ustalony w it.1), KaTeX (LaTeX w `$...$`), Python3 do walidacji.

## Global Constraints

- Każdy wzór LaTeX w `opcje`/`poprawna`/`tresc` musi być opakowany w `$...$` (bez tego KaTeXRenderer wyświetla surowy tekst — bug z it.2)
- Backslash w JSON: `\\` nie `\` (np. `\\frac`, `\\cdot`, `\\sqrt`)
- Polskie cudzysłowy są niedopuszczalne w JSON — używaj tylko `"` (ASCII)
- IDs zamkniętych: kontynuuj numerację istniejących (np. `l4`, `l5` dla liczby.json)
- IDs otwartych: format `{prefix}o{n}` (np. `lo2` dla liczby)
- Kroki zadania otwartego: `oczekiwana` to string liczby dziesiętnej z kropką (np. `"2.5"`, nie `"2,5"`) — `sprawdzKrok` normalizuje obustronnie
- Każde zadanie zamknięte musi mieć: `wskazowka`, `przypomnij`
- Każde zadanie otwarte musi mieć: `kroki` (≥1), `rozwiazanie_wzorcowe`
- Walidacja po każdym pliku: `python3 -c "import json,sys; json.load(open(sys.argv[1]))" <plik>`
- Git root: `/Users/pibe/dev/Repetytorium-doc` — jawne ścieżki przy `git add`

---

## Obecny stan puli

| Dział | Zamknięte | Otwarte | Cel: zamknięte | Cel: otwarte | Do dodania |
|-------|-----------|---------|----------------|--------------|------------|
| liczby.json | 3 | 1 | 5 | 2 | +2 zam, +1 otw |
| ulamki.json | 3 | 1 | 5 | 2 | +2 zam, +1 otw |
| potegi.json | 3 | 1 | 5 | 2 | +2 zam, +1 otw |
| procenty.json | 3 | 1 | 5 | 2 | +2 zam, +1 otw |
| algebra.json | 3 | 1 | 5 | 2 | +2 zam, +1 otw |
| rownania.json | 3 | 1 | 5 | 2 | +2 zam, +1 otw |
| geometria-plaska.json | 3 | 1 | 5 | 2 | +2 zam, +1 otw |
| pitagoras.json | 3 | 1 | 5 | 2 | +2 zam, +1 otw |
| geometria-przestrzenna.json | 3 | 1 | 5 | 2 | +2 zam, +1 otw |

Po it.5: 45 zamkniętych (było 27), 18 otwartych (było 9).

---

## Task 1: liczby.json — +2 zamknięte, +1 otwarte

**Files:**
- Modify: `src/content/matematyka/dzialy/liczby.json`

**Interfaces:**
- Consumes: istniejące `l1`–`l3` (zamknięte), `lo1` (otwarte)
- Produces: `l4`, `l5` (zamknięte), `lo2` (otwarte)

- [ ] **Step 1: Dodaj l4 i l5 do tablicy `cwiczenia` w liczby.json**

Wstaw po `l3`:

```json
{
  "id": "l4",
  "tresc": "Ile wynosi $\\text{NWW}(4, 6)$?",
  "typ": "zamkniete",
  "opcje": ["6", "12", "24", "2"],
  "poprawna": "12",
  "wskazowka": "NWW — najmniejsza wspólna wielokrotność. Szukaj najmniejszej liczby podzielnej przez obie.",
  "przypomnij": "$4 = 2^2$; $6 = 2 \\cdot 3$; NWW = $2^2 \\cdot 3 = 12$"
},
{
  "id": "l5",
  "tresc": "Wynik działania $(-2)^3$ to:",
  "typ": "zamkniete",
  "opcje": ["-8", "8", "-6", "6"],
  "poprawna": "-8",
  "wskazowka": "Potęga ujemnej liczby: dla wykładnika nieparzystego wynik jest ujemny.",
  "przypomnij": "$(-2)^3 = (-2) \\cdot (-2) \\cdot (-2) = -8$"
}
```

- [ ] **Step 2: Dodaj lo2 do tablicy `zadania_otwarte` w liczby.json**

Wstaw po `lo1`:

```json
{
  "id": "lo2",
  "tresc": "Zapisz wszystkie liczby pierwsze między 10 a 30. Ile ich jest?",
  "punkty": 2,
  "kroki": [
    {
      "id": "k1",
      "instrukcja": "Wypisz kolejno kandydatów: 11, 12, 13, … Które z nich nie mają dzielników innych niż 1 i same siebie?",
      "oczekiwana": "11, 13, 17, 19, 23, 29",
      "jednostka": null,
      "podpowiedz": "Liczba pierwsza jest podzielna tylko przez 1 i przez siebie. Sprawdź każdą liczbę od 11 do 29."
    },
    {
      "id": "k2",
      "instrukcja": "Ile takich liczb znalazłeś?",
      "oczekiwana": "6",
      "jednostka": null,
      "podpowiedz": "Policz: 11, 13, 17, 19, 23, 29 — to razem 6 liczb."
    }
  ],
  "rozwiazanie_wzorcowe": "Liczby pierwsze między 10 a 30: $11, 13, 17, 19, 23, 29$ — jest ich $6$."
}
```

- [ ] **Step 3: Walidacja JSON**

```bash
python3 -c "import json,sys; json.load(open(sys.argv[1]))" \
  "repetytorium - matematyka/app/src/content/matematyka/dzialy/liczby.json" \
  && echo "OK"
```

Oczekiwane: `OK` (brak błędu parsowania)

- [ ] **Step 4: Weryfikacja liczb**

```bash
python3 -c "
import json
d=json.load(open('repetytorium - matematyka/app/src/content/matematyka/dzialy/liczby.json'))
print('zamkniete:', len([z for z in d['cwiczenia'] if z['typ']=='zamkniete']))
print('otwarte:', len(d['zadania_otwarte']))
"
```

Oczekiwane: `zamkniete: 5`, `otwarte: 2`

- [ ] **Step 5: Commit**

```bash
git add "repetytorium - matematyka/app/src/content/matematyka/dzialy/liczby.json"
git commit -m "content(mat): liczby.json — 5 zamkniętych + 2 otwarte (it.5 T1)"
```

---

## Task 2: ulamki.json — +2 zamknięte, +1 otwarte

**Files:**
- Modify: `src/content/matematyka/dzialy/ulamki.json`

**Interfaces:**
- Consumes: istniejące `u1`–`u3`, `uo1`
- Produces: `u4`, `u5` (zamknięte), `uo2` (otwarte)

- [ ] **Step 1: Dodaj u4 i u5 do tablicy `cwiczenia` w ulamki.json**

Wstaw po `u3`:

```json
{
  "id": "u4",
  "tresc": "Oblicz: $\\frac{3}{4} : \\frac{9}{8}$",
  "typ": "zamkniete",
  "opcje": ["$\\frac{2}{3}$", "$\\frac{27}{32}$", "$\\frac{3}{2}$", "$\\frac{1}{3}$"],
  "poprawna": "$\\frac{2}{3}$",
  "wskazowka": "Dzielenie ułamków: odwróć dzielnik i pomnóż.",
  "przypomnij": "$\\frac{a}{b} : \\frac{c}{d} = \\frac{a}{b} \\cdot \\frac{d}{c}$"
},
{
  "id": "u5",
  "tresc": "Zamień na ułamek dziesiętny: $\\frac{7}{20}$",
  "typ": "zamkniete",
  "opcje": ["0,35", "0,7", "0,07", "3,5"],
  "poprawna": "0,35",
  "wskazowka": "Rozszerz mianownik do 100: $\\frac{7}{20} = \\frac{35}{100}$.",
  "przypomnij": "$\\frac{a}{100} = 0{,}a$ w zapisie dziesiętnym"
}
```

- [ ] **Step 2: Dodaj uo2 do tablicy `zadania_otwarte` w ulamki.json**

```json
{
  "id": "uo2",
  "tresc": "Kasia zjadła $\\frac{2}{5}$ pizzy, Tomek zjadł $\\frac{1}{3}$ tej samej pizzy. Ile razem zjedli?",
  "punkty": 2,
  "kroki": [
    {
      "id": "k1",
      "instrukcja": "Sprowadź ułamki do wspólnego mianownika (NWW(5,3) = 15)",
      "oczekiwana": "15",
      "jednostka": null,
      "podpowiedz": "NWW(5, 3) = 15; $\\frac{2}{5} = \\frac{6}{15}$; $\\frac{1}{3} = \\frac{5}{15}$"
    },
    {
      "id": "k2",
      "instrukcja": "Dodaj ułamki i podaj wynik (jako ułamek dziesiętny)",
      "oczekiwana": "0.7333333333333333",
      "jednostka": null,
      "podpowiedz": "$\\frac{6}{15} + \\frac{5}{15} = \\frac{11}{15} \\approx 0{,}73$"
    }
  ],
  "rozwiazanie_wzorcowe": "$\\frac{2}{5} + \\frac{1}{3} = \\frac{6}{15} + \\frac{5}{15} = \\frac{11}{15}$"
}
```

> **Uwaga:** `oczekiwana` w k2 to `"11/15"` nie pasuje do walidacji numerycznej — zamiast tego użyj zadania, gdzie wynik jest prostą liczbą dziesiętną. Zamień treść na inną:

Alternatywne uo2 (łatwiejsza walidacja numeryczna):

```json
{
  "id": "uo2",
  "tresc": "Oblicz: $1\\frac{3}{4} + 2\\frac{1}{2}$",
  "punkty": 2,
  "kroki": [
    {
      "id": "k1",
      "instrukcja": "Zamień liczby mieszane na ułamki niewłaściwe",
      "oczekiwana": "4.25",
      "jednostka": null,
      "podpowiedz": "$1\\frac{3}{4} = \\frac{7}{4} = 1{,}75$; $2\\frac{1}{2} = \\frac{5}{2} = 2{,}5$"
    },
    {
      "id": "k2",
      "instrukcja": "Dodaj wyniki i podaj sumę",
      "oczekiwana": "4.25",
      "jednostka": null,
      "podpowiedz": "$1{,}75 + 2{,}5 = 4{,}25$"
    }
  ],
  "rozwiazanie_wzorcowe": "$1\\frac{3}{4} + 2\\frac{1}{2} = \\frac{7}{4} + \\frac{5}{2} = \\frac{7}{4} + \\frac{10}{4} = \\frac{17}{4} = 4{,}25$"
}
```

- [ ] **Step 3: Walidacja JSON**

```bash
python3 -c "import json,sys; json.load(open(sys.argv[1]))" \
  "repetytorium - matematyka/app/src/content/matematyka/dzialy/ulamki.json" \
  && echo "OK"
```

- [ ] **Step 4: Weryfikacja liczb**

```bash
python3 -c "
import json
d=json.load(open('repetytorium - matematyka/app/src/content/matematyka/dzialy/ulamki.json'))
print('zamkniete:', len([z for z in d['cwiczenia'] if z['typ']=='zamkniete']))
print('otwarte:', len(d['zadania_otwarte']))
"
```

Oczekiwane: `zamkniete: 5`, `otwarte: 2`

- [ ] **Step 5: Commit**

```bash
git add "repetytorium - matematyka/app/src/content/matematyka/dzialy/ulamki.json"
git commit -m "content(mat): ulamki.json — 5 zamkniętych + 2 otwarte (it.5 T2)"
```

---

## Task 3: potegi.json — +2 zamknięte, +1 otwarte

**Files:**
- Modify: `src/content/matematyka/dzialy/potegi.json`

**Interfaces:**
- Consumes: istniejące `p1`–`p3`, `po1`
- Produces: `p4`, `p5` (zamknięte), `po2` (otwarte)

- [ ] **Step 1: Sprawdź istniejące IDs**

```bash
python3 -c "
import json
d=json.load(open('repetytorium - matematyka/app/src/content/matematyka/dzialy/potegi.json'))
for z in d['cwiczenia']: print(z['id'], z['tresc'][:40])
for z in d['zadania_otwarte']: print(z['id'], z['tresc'][:40])
"
```

- [ ] **Step 2: Dodaj p4 i p5 do tablicy `cwiczenia`**

```json
{
  "id": "p4",
  "tresc": "Uproszczona postać $\\frac{3^6}{3^2}$ to:",
  "typ": "zamkniete",
  "opcje": ["$3^3$", "$3^4$", "$3^8$", "$3^2$"],
  "poprawna": "$3^4$",
  "wskazowka": "Przy dzieleniu potęg o tej samej podstawie odejmujesz wykładniki.",
  "przypomnij": "$\\frac{a^m}{a^n} = a^{m-n}$"
},
{
  "id": "p5",
  "tresc": "Ile wynosi $4^0 + 2^{-1}$?",
  "typ": "zamkniete",
  "opcje": ["$\\frac{3}{2}$", "$1$", "$\\frac{1}{2}$", "$2$"],
  "poprawna": "$\\frac{3}{2}$",
  "wskazowka": "$a^0 = 1$ dla $a \\neq 0$; $2^{-1} = \\frac{1}{2}$.",
  "przypomnij": "$a^0 = 1$; $a^{-n} = \\frac{1}{a^n}$"
}
```

- [ ] **Step 3: Dodaj po2 do tablicy `zadania_otwarte`**

```json
{
  "id": "po2",
  "tresc": "Oblicz: $(2^3)^2 \\cdot 2^{-4}$",
  "punkty": 2,
  "kroki": [
    {
      "id": "k1",
      "instrukcja": "Zastosuj wzór na potęgę potęgi: $(2^3)^2 = ?$",
      "oczekiwana": "64",
      "jednostka": null,
      "podpowiedz": "$(a^m)^n = a^{m \\cdot n}$; $(2^3)^2 = 2^6 = 64$"
    },
    {
      "id": "k2",
      "instrukcja": "Teraz pomnóż przez $2^{-4}$ i podaj wynik",
      "oczekiwana": "4",
      "jednostka": null,
      "podpowiedz": "$2^6 \\cdot 2^{-4} = 2^{6-4} = 2^2 = 4$"
    }
  ],
  "rozwiazanie_wzorcowe": "$(2^3)^2 \\cdot 2^{-4} = 2^6 \\cdot 2^{-4} = 2^2 = 4$"
}
```

- [ ] **Step 4: Walidacja JSON**

```bash
python3 -c "import json,sys; json.load(open(sys.argv[1]))" \
  "repetytorium - matematyka/app/src/content/matematyka/dzialy/potegi.json" && echo "OK"
```

- [ ] **Step 5: Weryfikacja liczb**

```bash
python3 -c "
import json
d=json.load(open('repetytorium - matematyka/app/src/content/matematyka/dzialy/potegi.json'))
print('zamkniete:', len([z for z in d['cwiczenia'] if z['typ']=='zamkniete']))
print('otwarte:', len(d['zadania_otwarte']))
"
```

Oczekiwane: `zamkniete: 5`, `otwarte: 2`

- [ ] **Step 6: Commit**

```bash
git add "repetytorium - matematyka/app/src/content/matematyka/dzialy/potegi.json"
git commit -m "content(mat): potegi.json — 5 zamkniętych + 2 otwarte (it.5 T3)"
```

---

## Task 4: procenty.json — +2 zamknięte, +1 otwarte

**Files:**
- Modify: `src/content/matematyka/dzialy/procenty.json`

**Interfaces:**
- Consumes: istniejące zadania (sprawdź IDs krokiem Step 1)
- Produces: +2 zamknięte, +1 otwarte z poprawną numeracją

- [ ] **Step 1: Sprawdź istniejące IDs**

```bash
python3 -c "
import json
d=json.load(open('repetytorium - matematyka/app/src/content/matematyka/dzialy/procenty.json'))
for z in d['cwiczenia']: print(z['id'])
for z in d['zadania_otwarte']: print(z['id'])
"
```

- [ ] **Step 2: Dodaj 2 zamknięte (dopasuj IDs do istniejącej numeracji)**

Wstaw po ostatnim zamkniętym (np. `pr3` → dodaj `pr4`, `pr5`):

```json
{
  "id": "pr4",
  "tresc": "Cena towaru wzrosła o 20%, a potem spadła o 20%. Jaki jest wynik względem ceny pierwotnej?",
  "typ": "zamkniete",
  "opcje": ["bez zmian", "wzrósł o 4%", "zmalał o 4%", "zmalał o 20%"],
  "poprawna": "zmalał o 4%",
  "wskazowka": "Oblicz na przykładzie: cena = 100 → 120 → 96.",
  "przypomnij": "$100 \\cdot 1{,}2 \\cdot 0{,}8 = 96$, czyli o 4% mniej niż pierwotna"
},
{
  "id": "pr5",
  "tresc": "Ile wynosi 15% z 80?",
  "typ": "zamkniete",
  "opcje": ["8", "12", "15", "20"],
  "poprawna": "12",
  "wskazowka": "15% z 80 = $\\frac{15}{100} \\cdot 80$.",
  "przypomnij": "$p\\% \\cdot W = \\frac{p}{100} \\cdot W$"
}
```

- [ ] **Step 3: Dodaj 1 otwarte**

```json
{
  "id": "pro2",
  "tresc": "W klasie jest 25 uczniów. Na wycieczkę pojechało 80% klasy. Ilu uczniów pojechało?",
  "punkty": 2,
  "kroki": [
    {
      "id": "k1",
      "instrukcja": "Oblicz 80% z 25",
      "oczekiwana": "20",
      "jednostka": "uczniów",
      "podpowiedz": "$80\\% \\cdot 25 = 0{,}8 \\cdot 25 = 20$"
    }
  ],
  "rozwiazanie_wzorcowe": "$80\\% \\cdot 25 = \\frac{80}{100} \\cdot 25 = 20$ uczniów"
}
```

- [ ] **Step 4: Walidacja JSON**

```bash
python3 -c "import json,sys; json.load(open(sys.argv[1]))" \
  "repetytorium - matematyka/app/src/content/matematyka/dzialy/procenty.json" && echo "OK"
```

- [ ] **Step 5: Weryfikacja**

```bash
python3 -c "
import json
d=json.load(open('repetytorium - matematyka/app/src/content/matematyka/dzialy/procenty.json'))
print('zamkniete:', len([z for z in d['cwiczenia'] if z['typ']=='zamkniete']))
print('otwarte:', len(d['zadania_otwarte']))
"
```

Oczekiwane: `zamkniete: 5`, `otwarte: 2`

- [ ] **Step 6: Commit**

```bash
git add "repetytorium - matematyka/app/src/content/matematyka/dzialy/procenty.json"
git commit -m "content(mat): procenty.json — 5 zamkniętych + 2 otwarte (it.5 T4)"
```

---

## Task 5: algebra.json — +2 zamknięte, +1 otwarte

**Files:**
- Modify: `src/content/matematyka/dzialy/algebra.json`

**Interfaces:**
- Consumes: istniejące `a1`–`a3`, `ao1`
- Produces: `a4`, `a5` (zamknięte), `ao2` (otwarte)

- [ ] **Step 1: Dodaj a4 i a5 do tablicy `cwiczenia`**

```json
{
  "id": "a4",
  "tresc": "Wynik mnożenia $(x+2)(x-2)$ to:",
  "typ": "zamkniete",
  "opcje": ["$x^2 - 4$", "$x^2 + 4$", "$x^2 - 4x$", "$x^2 + 4x$"],
  "poprawna": "$x^2 - 4$",
  "wskazowka": "Wzór skróconego mnożenia: suma razy różnica.",
  "przypomnij": "$(a+b)(a-b) = a^2 - b^2$"
},
{
  "id": "a5",
  "tresc": "Ile wynosi $5a - 3b$ dla $a = 2$, $b = -1$?",
  "typ": "zamkniete",
  "opcje": ["7", "13", "3", "17"],
  "poprawna": "13",
  "wskazowka": "Podstaw wartości: $5 \\cdot 2 - 3 \\cdot (-1)$.",
  "przypomnij": "$-3 \\cdot (-1) = +3$"
}
```

- [ ] **Step 2: Dodaj ao2 do tablicy `zadania_otwarte`**

```json
{
  "id": "ao2",
  "tresc": "Wyłącz wspólny czynnik: $6x^2 + 9x$",
  "punkty": 2,
  "kroki": [
    {
      "id": "k1",
      "instrukcja": "Jaki jest NWD współczynników 6 i 9?",
      "oczekiwana": "3",
      "jednostka": null,
      "podpowiedz": "NWD(6, 9) = 3; obie liczby są podzielne przez 3."
    },
    {
      "id": "k2",
      "instrukcja": "Wyłącz $3x$ przed nawias i zapisz wynik. Ile wynosi współczynnik $x$ wewnątrz nawiasu?",
      "oczekiwana": "3",
      "jednostka": null,
      "podpowiedz": "$6x^2 + 9x = 3x(2x + 3)$ — wewnątrz nawiasu mamy $2x + 3$; współczynnik $x$ = 2... nie, pytamy o wyraz wolny 3."
    }
  ],
  "rozwiazanie_wzorcowe": "$6x^2 + 9x = 3x(2x + 3)$"
}
```

> **Uwaga na k2:** `oczekiwana` musi być sprawdzalną liczbą. Uproszczone — zapytaj o wartość wyrażenia przy podstawieniu. Zamień na:

```json
{
  "id": "ao2",
  "tresc": "Wyłącz wspólny czynnik z $6x^2 + 9x$, a następnie oblicz wartość wyniku dla $x = 1$.",
  "punkty": 2,
  "kroki": [
    {
      "id": "k1",
      "instrukcja": "Wyłącz wspólny czynnik $3x$. Ile wynosi wyrażenie w nawiasie dla $x = 1$?",
      "oczekiwana": "5",
      "jednostka": null,
      "podpowiedz": "$6x^2 + 9x = 3x(2x + 3)$; dla $x=1$: nawiasie $2(1)+3 = 5$."
    },
    {
      "id": "k2",
      "instrukcja": "Oblicz wartość całego wyrażenia $3x(2x+3)$ dla $x = 1$",
      "oczekiwana": "15",
      "jednostka": null,
      "podpowiedz": "$3 \\cdot 1 \\cdot 5 = 15$"
    }
  ],
  "rozwiazanie_wzorcowe": "$6x^2 + 9x = 3x(2x + 3)$; dla $x=1$: $3 \\cdot 1 \\cdot 5 = 15$"
}
```

- [ ] **Step 3: Walidacja JSON**

```bash
python3 -c "import json,sys; json.load(open(sys.argv[1]))" \
  "repetytorium - matematyka/app/src/content/matematyka/dzialy/algebra.json" && echo "OK"
```

- [ ] **Step 4: Weryfikacja**

```bash
python3 -c "
import json
d=json.load(open('repetytorium - matematyka/app/src/content/matematyka/dzialy/algebra.json'))
print('zamkniete:', len([z for z in d['cwiczenia'] if z['typ']=='zamkniete']))
print('otwarte:', len(d['zadania_otwarte']))
"
```

Oczekiwane: `zamkniete: 5`, `otwarte: 2`

- [ ] **Step 5: Commit**

```bash
git add "repetytorium - matematyka/app/src/content/matematyka/dzialy/algebra.json"
git commit -m "content(mat): algebra.json — 5 zamkniętych + 2 otwarte (it.5 T5)"
```

---

## Task 6: rownania.json — +2 zamknięte, +1 otwarte

**Files:**
- Modify: `src/content/matematyka/dzialy/rownania.json`

**Interfaces:**
- Consumes: istniejące zadania rownania.json
- Produces: +2 zamknięte, +1 otwarte (sprawdź IDs w Step 1)

- [ ] **Step 1: Sprawdź istniejące IDs**

```bash
python3 -c "
import json
d=json.load(open('repetytorium - matematyka/app/src/content/matematyka/dzialy/rownania.json'))
for z in d['cwiczenia']: print(z['id'], z['tresc'][:50])
for z in d['zadania_otwarte']: print(z['id'], z['tresc'][:50])
"
```

- [ ] **Step 2: Dodaj 2 zamknięte (prefix `r`, numeracja po ostatnim)**

```json
{
  "id": "r4",
  "tresc": "Rozwiąż: $2x + 5 = 13$",
  "typ": "zamkniete",
  "opcje": ["3", "4", "9", "6"],
  "poprawna": "4",
  "wskazowka": "Przenieś 5 na prawą stronę: $2x = 13 - 5 = 8$.",
  "przypomnij": "Wykonuj te same operacje po obu stronach równania."
},
{
  "id": "r5",
  "tresc": "Ile wynosi $x$ w równaniu $\\frac{x}{3} - 1 = 4$?",
  "typ": "zamkniete",
  "opcje": ["9", "12", "15", "3"],
  "poprawna": "15",
  "wskazowka": "$\\frac{x}{3} = 5$, więc $x = 15$.",
  "przypomnij": "Pomnóż obie strony przez 3, aby pozbyć się mianownika."
}
```

- [ ] **Step 3: Dodaj 1 otwarte (prefix `ro`, numeracja po ostatnim)**

```json
{
  "id": "ro2",
  "tresc": "Rozwiąż układ równań: $x + y = 7$ oraz $x - y = 1$.",
  "punkty": 2,
  "kroki": [
    {
      "id": "k1",
      "instrukcja": "Dodaj oba równania stronami: co wychodzi po lewej i po prawej stronie? Ile wynosi $x$?",
      "oczekiwana": "4",
      "jednostka": null,
      "podpowiedz": "$(x+y) + (x-y) = 7+1$; $2x = 8$; $x = 4$."
    },
    {
      "id": "k2",
      "instrukcja": "Podstaw $x = 4$ do pierwszego równania i oblicz $y$",
      "oczekiwana": "3",
      "jednostka": null,
      "podpowiedz": "$4 + y = 7$; $y = 3$."
    }
  ],
  "rozwiazanie_wzorcowe": "Dodajemy równania: $2x = 8$, $x = 4$; podstawiamy: $y = 7 - 4 = 3$."
}
```

- [ ] **Step 4: Walidacja JSON**

```bash
python3 -c "import json,sys; json.load(open(sys.argv[1]))" \
  "repetytorium - matematyka/app/src/content/matematyka/dzialy/rownania.json" && echo "OK"
```

- [ ] **Step 5: Weryfikacja**

```bash
python3 -c "
import json
d=json.load(open('repetytorium - matematyka/app/src/content/matematyka/dzialy/rownania.json'))
print('zamkniete:', len([z for z in d['cwiczenia'] if z['typ']=='zamkniete']))
print('otwarte:', len(d['zadania_otwarte']))
"
```

Oczekiwane: `zamkniete: 5`, `otwarte: 2`

- [ ] **Step 6: Commit**

```bash
git add "repetytorium - matematyka/app/src/content/matematyka/dzialy/rownania.json"
git commit -m "content(mat): rownania.json — 5 zamkniętych + 2 otwarte (it.5 T6)"
```

---

## Task 7: geometria-plaska.json — +2 zamknięte, +1 otwarte

**Files:**
- Modify: `src/content/matematyka/dzialy/geometria-plaska.json`

**Interfaces:**
- Consumes: istniejące zadania geometria-plaska.json
- Produces: +2 zamknięte, +1 otwarte

- [ ] **Step 1: Sprawdź istniejące IDs**

```bash
python3 -c "
import json
d=json.load(open('repetytorium - matematyka/app/src/content/matematyka/dzialy/geometria-plaska.json'))
for z in d['cwiczenia']: print(z['id'])
for z in d['zadania_otwarte']: print(z['id'])
"
```

- [ ] **Step 2: Dodaj 2 zamknięte (prefix `gp`, numeracja po ostatnim)**

```json
{
  "id": "gp4",
  "tresc": "Obwód kwadratu o boku 7 cm to:",
  "typ": "zamkniete",
  "opcje": ["14 cm", "21 cm", "28 cm", "49 cm"],
  "poprawna": "28 cm",
  "wskazowka": "Kwadrat ma 4 równe boki.",
  "przypomnij": "$O_{kwadratu} = 4a$"
},
{
  "id": "gp5",
  "tresc": "Pole trójkąta o podstawie 10 cm i wysokości 6 cm wynosi:",
  "typ": "zamkniete",
  "opcje": ["30 cm²", "60 cm²", "16 cm²", "24 cm²"],
  "poprawna": "30 cm²",
  "wskazowka": "Pole trójkąta = połowa iloczynu podstawy i wysokości.",
  "przypomnij": "$P = \\frac{a \\cdot h}{2}$"
}
```

- [ ] **Step 3: Dodaj 1 otwarte**

```json
{
  "id": "gpo2",
  "tresc": "Prostokąt ma obwód 36 cm, a jego jeden bok mierzy 10 cm. Oblicz pole prostokąta.",
  "punkty": 2,
  "kroki": [
    {
      "id": "k1",
      "instrukcja": "Oblicz drugi bok prostokąta (obwód = 2·(a+b))",
      "oczekiwana": "8",
      "jednostka": "cm",
      "podpowiedz": "$36 = 2(10 + b)$; $b = 18 - 10 = 8$ cm."
    },
    {
      "id": "k2",
      "instrukcja": "Oblicz pole prostokąta",
      "oczekiwana": "80",
      "jednostka": "cm²",
      "podpowiedz": "$P = 10 \\cdot 8 = 80$ cm²"
    }
  ],
  "rozwiazanie_wzorcowe": "$b = 18 - 10 = 8$ cm; $P = 10 \\cdot 8 = 80$ cm²"
}
```

- [ ] **Step 4: Walidacja JSON**

```bash
python3 -c "import json,sys; json.load(open(sys.argv[1]))" \
  "repetytorium - matematyka/app/src/content/matematyka/dzialy/geometria-plaska.json" && echo "OK"
```

- [ ] **Step 5: Weryfikacja**

```bash
python3 -c "
import json
d=json.load(open('repetytorium - matematyka/app/src/content/matematyka/dzialy/geometria-plaska.json'))
print('zamkniete:', len([z for z in d['cwiczenia'] if z['typ']=='zamkniete']))
print('otwarte:', len(d['zadania_otwarte']))
"
```

- [ ] **Step 6: Commit**

```bash
git add "repetytorium - matematyka/app/src/content/matematyka/dzialy/geometria-plaska.json"
git commit -m "content(mat): geometria-plaska.json — 5 zamkniętych + 2 otwarte (it.5 T7)"
```

---

## Task 8: pitagoras.json — +2 zamknięte, +1 otwarte

**Files:**
- Modify: `src/content/matematyka/dzialy/pitagoras.json`

**Interfaces:**
- Consumes: istniejące zadania pitagoras.json
- Produces: +2 zamknięte, +1 otwarte

- [ ] **Step 1: Sprawdź istniejące IDs**

```bash
python3 -c "
import json
d=json.load(open('repetytorium - matematyka/app/src/content/matematyka/dzialy/pitagoras.json'))
for z in d['cwiczenia']: print(z['id'], z['tresc'][:50])
for z in d['zadania_otwarte']: print(z['id'], z['tresc'][:50])
"
```

- [ ] **Step 2: Dodaj 2 zamknięte (prefix `pi`, numeracja po ostatnim)**

```json
{
  "id": "pi4",
  "tresc": "Trójkąt ma boki 5 cm, 12 cm i 13 cm. Czy jest prostokątny?",
  "typ": "zamkniete",
  "opcje": ["Tak, bo $5^2 + 12^2 = 13^2$", "Nie, bo sumy boków nie są równe", "Tak, bo 5+12=17>13", "Nie, bo musi mieć kąt 90°"],
  "poprawna": "Tak, bo $5^2 + 12^2 = 13^2$",
  "wskazowka": "Sprawdź: $25 + 144 = 169 = 13^2$.",
  "przypomnij": "Odwrotność twierdzenia Pitagorasa: jeśli $a^2+b^2=c^2$, to trójkąt jest prostokątny."
},
{
  "id": "pi5",
  "tresc": "Przekątna kwadratu o boku $a$ wynosi:",
  "typ": "zamkniete",
  "opcje": ["$a\\sqrt{2}$", "$2a$", "$a^2$", "$a\\sqrt{3}$"],
  "poprawna": "$a\\sqrt{2}$",
  "wskazowka": "Przekątna kwadratu to przeciwprostokątna trójkąta prostokątnego o ramionach $a, a$.",
  "przypomnij": "$d^2 = a^2 + a^2 = 2a^2$; $d = a\\sqrt{2}$"
}
```

- [ ] **Step 3: Dodaj 1 otwarte**

```json
{
  "id": "pio2",
  "tresc": "Drabina o długości 5 m opiera się o ścianę. Jej podstawa jest 3 m od ściany. Na jakiej wysokości dotyka ściany?",
  "punkty": 2,
  "kroki": [
    {
      "id": "k1",
      "instrukcja": "Zapisz równanie Pitagorasa i oblicz kwadrat szukanej wysokości",
      "oczekiwana": "16",
      "jednostka": null,
      "podpowiedz": "$h^2 + 3^2 = 5^2$; $h^2 = 25 - 9 = 16$"
    },
    {
      "id": "k2",
      "instrukcja": "Oblicz wysokość $h$",
      "oczekiwana": "4",
      "jednostka": "m",
      "podpowiedz": "$h = \\sqrt{16} = 4$ m"
    }
  ],
  "rozwiazanie_wzorcowe": "$h^2 = 5^2 - 3^2 = 25 - 9 = 16$; $h = 4$ m"
}
```

- [ ] **Step 4: Walidacja JSON**

```bash
python3 -c "import json,sys; json.load(open(sys.argv[1]))" \
  "repetytorium - matematyka/app/src/content/matematyka/dzialy/pitagoras.json" && echo "OK"
```

- [ ] **Step 5: Weryfikacja**

```bash
python3 -c "
import json
d=json.load(open('repetytorium - matematyka/app/src/content/matematyka/dzialy/pitagoras.json'))
print('zamkniete:', len([z for z in d['cwiczenia'] if z['typ']=='zamkniete']))
print('otwarte:', len(d['zadania_otwarte']))
"
```

- [ ] **Step 6: Commit**

```bash
git add "repetytorium - matematyka/app/src/content/matematyka/dzialy/pitagoras.json"
git commit -m "content(mat): pitagoras.json — 5 zamkniętych + 2 otwarte (it.5 T8)"
```

---

## Task 9: geometria-przestrzenna.json — +2 zamknięte, +1 otwarte

**Files:**
- Modify: `src/content/matematyka/dzialy/geometria-przestrzenna.json`

**Interfaces:**
- Consumes: istniejące zadania geometria-przestrzenna.json
- Produces: +2 zamknięte, +1 otwarte

- [ ] **Step 1: Sprawdź istniejące IDs**

```bash
python3 -c "
import json
d=json.load(open('repetytorium - matematyka/app/src/content/matematyka/dzialy/geometria-przestrzenna.json'))
for z in d['cwiczenia']: print(z['id'], z['tresc'][:50])
for z in d['zadania_otwarte']: print(z['id'], z['tresc'][:50])
"
```

- [ ] **Step 2: Dodaj 2 zamknięte (prefix `gp3d` lub istniejący, numeracja po ostatnim)**

```json
{
  "id": "gs4",
  "tresc": "Objętość sześcianu o krawędzi 3 cm to:",
  "typ": "zamkniete",
  "opcje": ["9 cm³", "18 cm³", "27 cm³", "54 cm³"],
  "poprawna": "27 cm³",
  "wskazowka": "Sześcian: $V = a^3$.",
  "przypomnij": "$V_{szescianu} = a^3 = 3^3 = 27$ cm³"
},
{
  "id": "gs5",
  "tresc": "Pole powierzchni całkowitej prostopadłościanu 2×3×4 cm to:",
  "typ": "zamkniete",
  "opcje": ["24 cm²", "52 cm²", "26 cm²", "48 cm²"],
  "poprawna": "52 cm²",
  "wskazowka": "Prostopadłościan ma 3 pary ścian: $2(ab + bc + ca)$.",
  "przypomnij": "$P_{pp} = 2(2 \\cdot 3 + 3 \\cdot 4 + 4 \\cdot 2) = 2(6+12+8) = 52$"
}
```

> **Uwaga:** Dopasuj prefix IDs do istniejącego wzorca (z Step 1 wiesz, czy to `gs`, `gpr3d` itp.).

- [ ] **Step 3: Dodaj 1 otwarte**

```json
{
  "id": "gso2",
  "tresc": "Walec ma promień podstawy 3 cm i wysokość 5 cm. Oblicz jego objętość (podaj wynik zaokrąglony do 1 miejsca po przecinku, $\\pi \\approx 3{,}14$).",
  "punkty": 2,
  "kroki": [
    {
      "id": "k1",
      "instrukcja": "Oblicz pole podstawy walca: $\\pi r^2$",
      "oczekiwana": "28.26",
      "jednostka": "cm²",
      "podpowiedz": "$\\pi \\cdot 3^2 = 3{,}14 \\cdot 9 = 28{,}26$ cm²"
    },
    {
      "id": "k2",
      "instrukcja": "Pomnóż pole podstawy przez wysokość",
      "oczekiwana": "141.3",
      "jednostka": "cm³",
      "podpowiedz": "$28{,}26 \\cdot 5 = 141{,}3$ cm³"
    }
  ],
  "rozwiazanie_wzorcowe": "$V = \\pi r^2 h = 3{,}14 \\cdot 9 \\cdot 5 = 141{,}3$ cm³"
}
```

- [ ] **Step 4: Walidacja JSON**

```bash
python3 -c "import json,sys; json.load(open(sys.argv[1]))" \
  "repetytorium - matematyka/app/src/content/matematyka/dzialy/geometria-przestrzenna.json" && echo "OK"
```

- [ ] **Step 5: Weryfikacja**

```bash
python3 -c "
import json
d=json.load(open('repetytorium - matematyka/app/src/content/matematyka/dzialy/geometria-przestrzenna.json'))
print('zamkniete:', len([z for z in d['cwiczenia'] if z['typ']=='zamkniete']))
print('otwarte:', len(d['zadania_otwarte']))
"
```

- [ ] **Step 6: Commit**

```bash
git add "repetytorium - matematyka/app/src/content/matematyka/dzialy/geometria-przestrzenna.json"
git commit -m "content(mat): geometria-przestrzenna.json — 5 zamkniętych + 2 otwarte (it.5 T9)"
```

---

## Task 10: Weryfikacja końcowa + QA

**Files:**
- Read: wszystkie 9 plików JSON
- Run: dev server, przeglądarka

- [ ] **Step 1: Globalny raport puli**

```bash
python3 -c "
import json, os
base = 'repetytorium - matematyka/app/src/content/matematyka/dzialy'
total_z, total_o = 0, 0
for f in sorted(os.listdir(base)):
    if not f.endswith('.json'): continue
    d = json.load(open(os.path.join(base, f)))
    z = len([x for x in d.get('cwiczenia', []) if x.get('typ') == 'zamkniete'])
    o = len(d.get('zadania_otwarte', []))
    total_z += z; total_o += o
    ok = '✓' if z >= 5 and o >= 2 else '✗'
    print(f'{ok} {f}: {z} zamkniętych, {o} otwartych')
print(f'RAZEM: {total_z} zamkniętych, {total_o} otwartych')
"
```

Oczekiwane: każdy dział ✓, `RAZEM: 45 zamkniętych, 18 otwartych`

- [ ] **Step 2: Uruchom dev server**

```bash
cd "repetytorium - matematyka/app" && npm run dev
```

Oczekiwane: `VITE ready on http://localhost:5173` (lub 5174)

- [ ] **Step 3: QA w przeglądarce (Playwright)**

Przejdź przez każdy z nowych działów:
1. Wejdź do działu → przejdź przez wszystkie 5 zamkniętych — czy wszystkie wzory LaTeX renderują się poprawnie (nie widać surowego `\frac`, `\cdot` itp.)?
2. Przejdź do zadania otwartego → wpisz odpowiedź kroku 1 → zweryfikuj czy akceptuje poprawnie
3. Sprawdź konsolę przeglądarki — 0 errors, 0 warnings

- [ ] **Step 4: Sprawdź wariantywność arkusza egzaminacyjnego**

Wejdź do Egzaminu Próbnego. Zrób 2 egzaminy pod rząd. Sprawdź czy zestawy pytań się różnią (przy 45 zamkniętych losowanie 15 daje znacznie więcej wariantów niż przy 27).

- [ ] **Step 5: build**

```bash
cd "repetytorium - matematyka/app" && npm run build
```

Oczekiwane: `✓ built in ...` bez błędów

- [ ] **Step 6: Aktualizacja STAN-PROJEKTU.md**

W sekcji "Ostatnia aktualizacja" zmień na: `2026-07-28, po sesji it.5`
W sekcji 7 "Kolejne kroki" zaktualizuj: `Rozbudowa puli zadań ✅ — 45 zamkniętych, 18 otwartych`
W sekcji 9 "Jak zacząć nową sesję" zaktualizuj na it.5 ukończona → zacznij it.6.

- [ ] **Step 7: Wpis LESSONS.md**

Dodaj wpis `## 2026-07-28 (it.5 — rozbudowa puli zadań)` z obserwacjami i wnioskami.

- [ ] **Step 8: Commit końcowy**

```bash
git add \
  "repetytorium - matematyka/STAN-PROJEKTU.md" \
  "repetytorium - matematyka/LESSONS.md"
git commit -m "docs(mat): STAN-PROJEKTU + LESSONS — it.5 domknięta"
```
