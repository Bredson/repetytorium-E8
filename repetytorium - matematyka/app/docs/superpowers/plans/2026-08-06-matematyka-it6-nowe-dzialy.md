# It.6 — Nowe działy: Statystyka i Prawdopodobieństwo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dodać dwa nowe działy (statystyka, prawdopodobieństwo) — po 2 pytania diagnozy + 5 zamkniętych + 2 otwarte każdy — domykając pokrycie arkusza CKE (11 działów).

**Architecture:** Dwa nowe pliki JSON w `src/content/matematyka/dzialy/` + dwa wpisy w `rejestr.js`. Zero zmian w komponentach — dashboard, diagnoza, statystyki i egzamin wywodzą działy dynamicznie z `DZIALY`. Spec: `docs/superpowers/specs/2026-08-06-matematyka-it6-nowe-dzialy-design.md`.

**Tech Stack:** JSON (format ustalony w it.1), KaTeX (LaTeX w `$...$`), Python3 do walidacji, Vite/React (tylko build + QA).

## Global Constraints

- Każdy wzór LaTeX w `tresc`/`opcje`/`poprawna` opakowany w `$...$` (bez tego KaTeXRenderer wyświetla surowy tekst — bug z it.2)
- Backslash w JSON: `\\` nie `\` (np. `\\frac{1}{2}`)
- Tylko ASCII `"` w JSON — polskie cudzysłowy niedopuszczalne
- Prefiksy ID (zweryfikowane — brak kolizji): statystyka `st`/`sto`/`tw-st`, prawdopodobieństwo `pw`/`pwo`/`tw-pw` (`p` zajęte przez potęgi, `pr` przez procenty)
- Kroki zadań otwartych: `oczekiwana` to string prostej liczby dziesiętnej z kropką (np. `"0.5"`) — `sprawdzKrok` normalizuje przecinek/kropkę; unikać ułamków typu 5/12 bez skończonego rozwinięcia
- Każde zadanie zamknięte ma: `wskazowka`, `przypomnij`; każde otwarte: `kroki` (≥1), `rozwiazanie_wzorcowe`, `punkty`
- Schemat działu top-level: `{ id, tytul, modul, waga, test_wstepny[2], cwiczenia[5], zadania_otwarte[2] }`; moduły A–I zajęte → nowe: `J` (statystyka), `K` (prawdopodobieństwo); `waga`: `"srednia"` (pole nieużywane przez kod, tylko opisowe)
- Dane w zadaniach statystycznych wyłącznie tekstowo — bez diagramów SVG (decyzja ze specu)
- Walidacja po każdym pliku: `python3 -c "import json,sys; json.load(open(sys.argv[1]))" <plik>`
- Git root: `/Users/pibe/dev/Repetytorium-doc` — jawne ścieżki przy `git add`

---

## Task 1: statystyka.json + wpis w rejestr.js

**Files:**
- Create: `repetytorium - matematyka/app/src/content/matematyka/dzialy/statystyka.json`
- Modify: `repetytorium - matematyka/app/src/content/matematyka/rejestr.js`

**Interfaces:**
- Consumes: schemat działu jak w `liczby.json`; `DZIALY` w `rejestr.js`
- Produces: dział `statystyka` (klucz `statystyka` w `DZIALY`), ID: `tw-st1`–`tw-st2`, `st1`–`st5`, `sto1`–`sto2`

- [ ] **Step 1: Utwórz plik statystyka.json z pełną treścią**

```json
{
  "id": "statystyka",
  "tytul": "Statystyka",
  "modul": "J",
  "waga": "srednia",
  "test_wstepny": [
    {
      "id": "tw-st1",
      "tresc": "Oceny Ani z matematyki to: 4, 5, 3, 4, 4. Średnia arytmetyczna tych ocen wynosi:",
      "typ": "zamkniete",
      "opcje": ["4", "4,2", "3,8", "5"],
      "poprawna": "4"
    },
    {
      "id": "tw-st2",
      "tresc": "Mediana zestawu liczb 2, 7, 3, 5, 9 wynosi:",
      "typ": "zamkniete",
      "opcje": ["3", "5", "7", "9"],
      "poprawna": "5"
    }
  ],
  "cwiczenia": [
    {
      "id": "st1",
      "tresc": "Średnia arytmetyczna liczb 6, 8, 10, 16 wynosi:",
      "typ": "zamkniete",
      "opcje": ["9", "10", "11", "12"],
      "poprawna": "10",
      "wskazowka": "Dodaj wszystkie liczby i podziel przez ich liczbę.",
      "przypomnij": "$\\text{średnia} = \\frac{6+8+10+16}{4} = \\frac{40}{4} = 10$"
    },
    {
      "id": "st2",
      "tresc": "Mediana zestawu liczb 3, 5, 7, 9 wynosi:",
      "typ": "zamkniete",
      "opcje": ["5", "6", "7", "8"],
      "poprawna": "6",
      "wskazowka": "Przy parzystej liczbie danych mediana to średnia dwóch środkowych wartości.",
      "przypomnij": "Dane uporządkowane: 3, 5, 7, 9 — środkowe to 5 i 7; $\\frac{5+7}{2} = 6$"
    },
    {
      "id": "st3",
      "tresc": "Dominanta (moda) zestawu 2, 3, 3, 5, 3, 7, 5 to:",
      "typ": "zamkniete",
      "opcje": ["2", "3", "5", "7"],
      "poprawna": "3",
      "wskazowka": "Dominanta to wartość, która występuje najczęściej.",
      "przypomnij": "3 występuje trzy razy, 5 dwa razy, pozostałe po jednym — dominanta to 3."
    },
    {
      "id": "st4",
      "tresc": "W tabeli przedstawiono wyniki sprawdzianu: ocena 3 — 5 uczniów, ocena 4 — 8 uczniów, ocena 5 — 4 uczniów, ocena 6 — 3 uczniów. Ilu uczniów łącznie pisało sprawdzian?",
      "typ": "zamkniete",
      "opcje": ["18", "19", "20", "21"],
      "poprawna": "20",
      "wskazowka": "Dodaj liczby uczniów dla wszystkich ocen.",
      "przypomnij": "$5 + 8 + 4 + 3 = 20$"
    },
    {
      "id": "st5",
      "tresc": "Średnia arytmetyczna pięciu liczb wynosi 8. Suma tych liczb to:",
      "typ": "zamkniete",
      "opcje": ["13", "40", "45", "8"],
      "poprawna": "40",
      "wskazowka": "Średnia = suma / liczba danych, więc suma = średnia · liczba danych.",
      "przypomnij": "$\\text{suma} = 8 \\cdot 5 = 40$"
    }
  ],
  "zadania_otwarte": [
    {
      "id": "sto1",
      "tresc": "Oceny Zosi ze sprawdzianów to: 3, 4, 4, 5, 6. Oblicz średnią arytmetyczną i medianę tych ocen.",
      "punkty": 2,
      "kroki": [
        {
          "id": "k1",
          "instrukcja": "Oblicz sumę wszystkich ocen",
          "oczekiwana": "22",
          "jednostka": null,
          "podpowiedz": "$3 + 4 + 4 + 5 + 6 = 22$"
        },
        {
          "id": "k2",
          "instrukcja": "Podziel sumę przez liczbę ocen i podaj średnią",
          "oczekiwana": "4.4",
          "jednostka": null,
          "podpowiedz": "$\\frac{22}{5} = 4{,}4$"
        },
        {
          "id": "k3",
          "instrukcja": "Uporządkuj oceny rosnąco i podaj medianę (wartość środkową)",
          "oczekiwana": "4",
          "jednostka": null,
          "podpowiedz": "Uporządkowane: 3, 4, 4, 5, 6 — środkowa (trzecia) wartość to 4."
        }
      ],
      "rozwiazanie_wzorcowe": "Średnia: $\\frac{3+4+4+5+6}{5} = \\frac{22}{5} = 4{,}4$. Mediana: dane uporządkowane 3, 4, 4, 5, 6 — środkowa wartość to $4$."
    },
    {
      "id": "sto2",
      "tresc": "Średnia arytmetyczna czterech liczb: 5, 8, 9 oraz $x$ wynosi 8. Znajdź $x$.",
      "punkty": 2,
      "kroki": [
        {
          "id": "k1",
          "instrukcja": "Ile musi wynosić suma wszystkich czterech liczb, skoro średnia to 8?",
          "oczekiwana": "32",
          "jednostka": null,
          "podpowiedz": "$\\text{suma} = 8 \\cdot 4 = 32$"
        },
        {
          "id": "k2",
          "instrukcja": "Odejmij od tej sumy znane liczby i podaj $x$",
          "oczekiwana": "10",
          "jednostka": null,
          "podpowiedz": "$x = 32 - (5 + 8 + 9) = 32 - 22 = 10$"
        }
      ],
      "rozwiazanie_wzorcowe": "Suma czterech liczb: $8 \\cdot 4 = 32$. Zatem $x = 32 - (5+8+9) = 32 - 22 = 10$."
    }
  ]
}
```

- [ ] **Step 2: Walidacja JSON**

```bash
python3 -c "import json,sys; json.load(open(sys.argv[1]))" \
  "repetytorium - matematyka/app/src/content/matematyka/dzialy/statystyka.json" && echo "OK"
```

Oczekiwane: `OK`

- [ ] **Step 3: Weryfikacja liczb i pól**

```bash
python3 -c "
import json
d=json.load(open('repetytorium - matematyka/app/src/content/matematyka/dzialy/statystyka.json'))
print('test_wstepny:', len(d['test_wstepny']))
print('zamkniete:', len([z for z in d['cwiczenia'] if z['typ']=='zamkniete']))
print('otwarte:', len(d['zadania_otwarte']))
assert all('wskazowka' in z and 'przypomnij' in z for z in d['cwiczenia'])
assert all(z['kroki'] and 'rozwiazanie_wzorcowe' in z and 'punkty' in z for z in d['zadania_otwarte'])
print('pola OK')
"
```

Oczekiwane: `test_wstepny: 2`, `zamkniete: 5`, `otwarte: 2`, `pola OK`

- [ ] **Step 4: Dodaj wpis w rejestr.js**

W `repetytorium - matematyka/app/src/content/matematyka/rejestr.js` dodaj import po `geometriaPrzestrzenna`:

```js
import statystyka from "./dzialy/statystyka.json";
```

oraz wpis w `DZIALY` po `"geometria-przestrzenna": geometriaPrzestrzenna,`:

```js
  statystyka,
```

- [ ] **Step 5: Build**

```bash
cd "repetytorium - matematyka/app" && npm run build
```

Oczekiwane: `✓ built in ...` bez błędów (import działa)

- [ ] **Step 6: Commit**

```bash
git add \
  "repetytorium - matematyka/app/src/content/matematyka/dzialy/statystyka.json" \
  "repetytorium - matematyka/app/src/content/matematyka/rejestr.js"
git commit -m "content(mat): nowy dział statystyka — 5 zamkniętych + 2 otwarte (it.6 T1)"
```

---

## Task 2: prawdopodobienstwo.json + wpis w rejestr.js

**Files:**
- Create: `repetytorium - matematyka/app/src/content/matematyka/dzialy/prawdopodobienstwo.json`
- Modify: `repetytorium - matematyka/app/src/content/matematyka/rejestr.js`

**Interfaces:**
- Consumes: `rejestr.js` po Task 1 (zawiera już wpis `statystyka`)
- Produces: dział `prawdopodobienstwo` (klucz `prawdopodobienstwo` w `DZIALY`), ID: `tw-pw1`–`tw-pw2`, `pw1`–`pw5`, `pwo1`–`pwo2`

- [ ] **Step 1: Utwórz plik prawdopodobienstwo.json z pełną treścią**

```json
{
  "id": "prawdopodobienstwo",
  "tytul": "Prawdopodobieństwo",
  "modul": "K",
  "waga": "srednia",
  "test_wstepny": [
    {
      "id": "tw-pw1",
      "tresc": "Rzucamy sześcienną kostką do gry. Prawdopodobieństwo wyrzucenia szóstki wynosi:",
      "typ": "zamkniete",
      "opcje": ["$\\frac{1}{6}$", "$\\frac{1}{2}$", "$\\frac{1}{3}$", "$\\frac{6}{6}$"],
      "poprawna": "$\\frac{1}{6}$"
    },
    {
      "id": "tw-pw2",
      "tresc": "W pudełku są 3 kule białe i 2 czarne. Prawdopodobieństwo wylosowania kuli białej wynosi:",
      "typ": "zamkniete",
      "opcje": ["$\\frac{3}{5}$", "$\\frac{2}{5}$", "$\\frac{3}{2}$", "$\\frac{1}{3}$"],
      "poprawna": "$\\frac{3}{5}$"
    }
  ],
  "cwiczenia": [
    {
      "id": "pw1",
      "tresc": "Rzucamy sześcienną kostką. Prawdopodobieństwo wyrzucenia liczby parzystej wynosi:",
      "typ": "zamkniete",
      "opcje": ["$\\frac{1}{2}$", "$\\frac{1}{3}$", "$\\frac{1}{6}$", "$\\frac{2}{3}$"],
      "poprawna": "$\\frac{1}{2}$",
      "wskazowka": "Liczby parzyste na kostce to 2, 4, 6 — trzy z sześciu możliwych wyników.",
      "przypomnij": "$P = \\frac{\\text{sprzyjające}}{\\text{wszystkie}} = \\frac{3}{6} = \\frac{1}{2}$"
    },
    {
      "id": "pw2",
      "tresc": "Rzucamy monetą dwa razy. Prawdopodobieństwo wyrzucenia dwóch orłów wynosi:",
      "typ": "zamkniete",
      "opcje": ["$\\frac{1}{4}$", "$\\frac{1}{2}$", "$\\frac{1}{3}$", "$\\frac{3}{4}$"],
      "poprawna": "$\\frac{1}{4}$",
      "wskazowka": "Wypisz wszystkie wyniki: OO, OR, RO, RR.",
      "przypomnij": "Cztery równie prawdopodobne wyniki, jeden sprzyjający: $P = \\frac{1}{4}$"
    },
    {
      "id": "pw3",
      "tresc": "Rzucamy sześcienną kostką. Prawdopodobieństwo wyrzucenia liczby mniejszej niż 7 wynosi:",
      "typ": "zamkniete",
      "opcje": ["0", "$\\frac{1}{6}$", "$\\frac{5}{6}$", "1"],
      "poprawna": "1",
      "wskazowka": "Każdy wynik rzutu kostką (1–6) jest mniejszy niż 7.",
      "przypomnij": "Zdarzenie pewne ma prawdopodobieństwo $1$; zdarzenie niemożliwe — $0$."
    },
    {
      "id": "pw4",
      "tresc": "W sklepiku są 4 rodzaje kanapek i 3 rodzaje napojów. Ile różnych zestawów (kanapka + napój) można utworzyć?",
      "typ": "zamkniete",
      "opcje": ["7", "12", "4", "3"],
      "poprawna": "12",
      "wskazowka": "Do każdej z 4 kanapek możesz dobrać każdy z 3 napojów.",
      "przypomnij": "Reguła mnożenia: $4 \\cdot 3 = 12$ zestawów"
    },
    {
      "id": "pw5",
      "tresc": "W pudełku jest 5 kul: 2 białe i 3 czarne. Wylosowano jedną kulę białą i odłożono ją na bok. Prawdopodobieństwo, że następna wylosowana kula będzie biała, wynosi:",
      "typ": "zamkniete",
      "opcje": ["$\\frac{1}{4}$", "$\\frac{2}{5}$", "$\\frac{1}{5}$", "$\\frac{1}{2}$"],
      "poprawna": "$\\frac{1}{4}$",
      "wskazowka": "Po odłożeniu jednej białej w pudełku zostały 4 kule, w tym 1 biała.",
      "przypomnij": "Losowanie bez zwracania zmienia pulę: $P = \\frac{1}{4}$"
    }
  ],
  "zadania_otwarte": [
    {
      "id": "pwo1",
      "tresc": "W urnie jest 10 kul: 4 czerwone, 5 zielonych i 1 niebieska. Losujemy jedną kulę. Oblicz prawdopodobieństwo wylosowania kuli zielonej. Wynik podaj jako ułamek dziesiętny.",
      "punkty": 2,
      "kroki": [
        {
          "id": "k1",
          "instrukcja": "Ile jest wszystkich możliwych wyników losowania (wszystkich kul)?",
          "oczekiwana": "10",
          "jednostka": null,
          "podpowiedz": "$4 + 5 + 1 = 10$ kul"
        },
        {
          "id": "k2",
          "instrukcja": "Ile jest wyników sprzyjających (kul zielonych)?",
          "oczekiwana": "5",
          "jednostka": null,
          "podpowiedz": "W urnie jest 5 kul zielonych."
        },
        {
          "id": "k3",
          "instrukcja": "Podziel sprzyjające przez wszystkie i podaj wynik jako ułamek dziesiętny",
          "oczekiwana": "0.5",
          "jednostka": null,
          "podpowiedz": "$P = \\frac{5}{10} = 0{,}5$"
        }
      ],
      "rozwiazanie_wzorcowe": "$P = \\frac{\\text{sprzyjające}}{\\text{wszystkie}} = \\frac{5}{10} = \\frac{1}{2} = 0{,}5$"
    },
    {
      "id": "pwo2",
      "tresc": "Ala ma 2 bluzki i 5 spódnic. Ubiera się, losowo wybierając jedną bluzkę i jedną spódnicę. Oblicz, ile różnych zestawów może utworzyć, oraz prawdopodobieństwo, że założy swoją ulubioną bluzkę razem z ulubioną spódnicą. Wynik podaj jako ułamek dziesiętny.",
      "punkty": 2,
      "kroki": [
        {
          "id": "k1",
          "instrukcja": "Ile różnych zestawów (bluzka + spódnica) może utworzyć Ala? Zastosuj regułę mnożenia",
          "oczekiwana": "10",
          "jednostka": null,
          "podpowiedz": "$2 \\cdot 5 = 10$ zestawów"
        },
        {
          "id": "k2",
          "instrukcja": "Tylko jeden zestaw jest ulubiony. Podaj prawdopodobieństwo jako ułamek dziesiętny",
          "oczekiwana": "0.1",
          "jednostka": null,
          "podpowiedz": "$P = \\frac{1}{10} = 0{,}1$"
        }
      ],
      "rozwiazanie_wzorcowe": "Liczba zestawów: $2 \\cdot 5 = 10$. Ulubiony zestaw jest jeden, więc $P = \\frac{1}{10} = 0{,}1$."
    }
  ]
}
```

- [ ] **Step 2: Walidacja JSON**

```bash
python3 -c "import json,sys; json.load(open(sys.argv[1]))" \
  "repetytorium - matematyka/app/src/content/matematyka/dzialy/prawdopodobienstwo.json" && echo "OK"
```

Oczekiwane: `OK`

- [ ] **Step 3: Weryfikacja liczb i pól**

```bash
python3 -c "
import json
d=json.load(open('repetytorium - matematyka/app/src/content/matematyka/dzialy/prawdopodobienstwo.json'))
print('test_wstepny:', len(d['test_wstepny']))
print('zamkniete:', len([z for z in d['cwiczenia'] if z['typ']=='zamkniete']))
print('otwarte:', len(d['zadania_otwarte']))
assert all('wskazowka' in z and 'przypomnij' in z for z in d['cwiczenia'])
assert all(z['kroki'] and 'rozwiazanie_wzorcowe' in z and 'punkty' in z for z in d['zadania_otwarte'])
print('pola OK')
"
```

Oczekiwane: `test_wstepny: 2`, `zamkniete: 5`, `otwarte: 2`, `pola OK`

- [ ] **Step 4: Dodaj wpis w rejestr.js**

W `repetytorium - matematyka/app/src/content/matematyka/rejestr.js` dodaj import po `statystyka`:

```js
import prawdopodobienstwo from "./dzialy/prawdopodobienstwo.json";
```

oraz wpis w `DZIALY` po `statystyka,`:

```js
  prawdopodobienstwo,
```

- [ ] **Step 5: Build**

```bash
cd "repetytorium - matematyka/app" && npm run build
```

Oczekiwane: `✓ built in ...` bez błędów

- [ ] **Step 6: Commit**

```bash
git add \
  "repetytorium - matematyka/app/src/content/matematyka/dzialy/prawdopodobienstwo.json" \
  "repetytorium - matematyka/app/src/content/matematyka/rejestr.js"
git commit -m "content(mat): nowy dział prawdopodobieństwo — 5 zamkniętych + 2 otwarte (it.6 T2)"
```

---

## Task 3: Weryfikacja końcowa + QA + docs

**Files:**
- Read: wszystkie 11 plików JSON, `rejestr.js`
- Modify: `repetytorium - matematyka/STAN-PROJEKTU.md`, `repetytorium - matematyka/LESSONS.md`
- Run: `npm test`, `npm run build`, dev server, przeglądarka (Playwright)

**Interfaces:**
- Consumes: działy `statystyka` i `prawdopodobienstwo` z Task 1–2 (klucze w `DZIALY`, ID `sto1`/`sto2`/`pwo1`/`pwo2` z krokami i odpowiedziami jak wyżej)
- Produces: potwierdzona pula 55 zamkniętych + 22 otwarte; zaktualizowane docs

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
    ok = 'OK' if z >= 5 and o >= 2 else 'FAIL'
    print(f'{ok} {f}: {z} zamknietych, {o} otwartych')
print(f'RAZEM: {total_z} zamknietych, {total_o} otwartych')
"
```

Oczekiwane: 11 plików, każdy `OK`, `RAZEM: 55 zamknietych, 22 otwartych`

- [ ] **Step 2: Testy i build**

```bash
cd "repetytorium - matematyka/app" && npm test && npm run build
```

Oczekiwane: testy zielone, `✓ built in ...`

- [ ] **Step 3: Uruchom dev server**

```bash
cd "repetytorium - matematyka/app" && npm run dev
```

Oczekiwane: `VITE ready` na http://localhost:5174 (lub 5173)

- [ ] **Step 4: QA w przeglądarce (Playwright) — dashboard i dział Statystyka**

1. Otwórz aplikację, wejdź na profil (lub utwórz testowy) — dashboard ma pokazywać **11 kart działów**, w tym „Statystyka" i „Prawdopodobieństwo"
2. Wejdź w dział Statystyka → przejdź 5 zamkniętych (poprawne odpowiedzi: st1=10, st2=6, st3=3, st4=20, st5=40) → wynik 100% → przejście do zadania otwartego
3. Zadanie otwarte sto1 lub sto2 — wpisuj odpowiedzi kroków (sto1: 22, 4.4, 4; sto2: 32, 10) — każdy krok zaliczony
4. Konsola przeglądarki: 0 errors

- [ ] **Step 5: QA w przeglądarce — dział Prawdopodobieństwo**

1. Wejdź w dział Prawdopodobieństwo → 5 zamkniętych (poprawne: pw1=$\frac{1}{2}$, pw2=$\frac{1}{4}$, pw3=1, pw4=12, pw5=$\frac{1}{4}$) — wzory LaTeX w opcjach renderują się (nie widać surowego `\frac`)
2. Zadanie otwarte pwo1 (kroki: 10, 5, 0.5 — sprawdź też akceptację „0,5" z przecinkiem) lub pwo2 (kroki: 10, 0.1)
3. Konsola przeglądarki: 0 errors

- [ ] **Step 6: QA — Egzamin Próbny z nowymi działami**

1. Rozpocznij Egzamin Próbny — część zamknięta ma 15 pytań i zawiera ≥1 pytanie z działu Statystyka oraz ≥1 z działu Prawdopodobieństwo (etykieta działu widoczna przy pytaniu; `zbudujArkusz` gwarantuje reprezentację wszystkich 11 działów)
2. Przejdź cały egzamin (zamknięte można klikać dowolnie przez JS eval — patrz LESSONS it.5; otwarte przez ref-based wpisywanie)
3. Ekran wyniku pokazuje rozbicie per dział z nowymi działami

- [ ] **Step 7: QA — diagnoza na świeżym profilu**

1. Utwórz nowy profil testowy → Test wstępny ma **22 pytania** (po 2 z 11 działów)
2. Nie trzeba przechodzić całości — wystarczy potwierdzić licznik pytań; przerwij i usuń profil testowy (lub zostaw — localStorage lokalny)

- [ ] **Step 8: Aktualizacja STAN-PROJEKTU.md**

1. Nagłówek „Ostatnia aktualizacja": `2026-08-06, po sesji it.6 (2 nowe działy: statystyka + prawdopodobieństwo; pula 55 zamkniętych + 22 otwarte; 11 działów; build ✓; QA ✓)`
2. Sekcja „Kolejne kroki": dopisz `**Nowe działy (it.6)** ✅ — statystyka + prawdopodobieństwo; pula 55 zamkniętych + 22 otwarte`
3. Dodaj sekcję „Iteracja 6 — plan i stan" (status UKOŃCZONA, tabela 3 tasków, DoD) wg wzorca sekcji it.5
4. Sekcja „Jak zacząć nową sesję": it.6 ukończona → kierunki it.7 (UX: wyjaśnienia błędnych odpowiedzi, podpowiedzi; dalsza rozbudowa puli; Hub po angielskim)

- [ ] **Step 9: Wpis LESSONS.md**

Dodaj wpis `## 2026-08-06 (it.6 — nowe działy: statystyka + prawdopodobieństwo)` z obserwacjami z QA (min.: czy dodanie działu faktycznie nie wymagało zmian w komponentach; zachowanie diagnozy 22 pytań; reprezentacja 11 działów w arkuszu 15 zamkniętych) i wnioskami. Zakończ linią `Zmiana w skilu: ...`.

- [ ] **Step 10: Commit końcowy**

```bash
git add \
  "repetytorium - matematyka/STAN-PROJEKTU.md" \
  "repetytorium - matematyka/LESSONS.md"
git commit -m "docs(mat): STAN-PROJEKTU + LESSONS — it.6 ukończona (11 działów, 55+22)"
```
