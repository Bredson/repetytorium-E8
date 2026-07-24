# Matematyka It.2 — Działy JSON + Ekrany Dzial, ZadanieOtwarte, Powtorka

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dodać 8 brakujących działów JSON, zaktualizować `rejestr.js` oraz zbudować trzy ekrany: `Dzial.jsx` (quiz zamknięty + przejście do zadania otwartego), `ZadanieOtwarte.jsx` (prowadzony tok rozumowania) i `Powtorka.jsx` (sesja powtórkowa spaced repetition) — zamknąć pętlę nauki: diagnoza → plan → dział → powtórka.

**Architecture:** Warstwa UI w `src/ui/pages/`; logika wyłącznie w istniejących `core/quiz.js`, `core/powtorki.js` (zero nowej logiki core). Treść z `content/matematyka/dzialy/*.json` przez `rejestr.js`. Router stanowy w `App.jsx` rozszerzony o stany `"dzial"`, `"zadanie-otwarte"`, `"powtorka"`. Postępy działu zapisane w `postepy.dzialy[id]`; nowe rekordy powtórek przez `nowaPowtorka` + `zaktualizujPowtorki`.

**Tech Stack:** React 19, Vite 8, KaTeX (npm), localStorage, bez TypeScript, bez routera (ekrany przez `useState` w App.jsx).

## Global Constraints

- Git root: `/Users/pibe/dev/Repetytorium-doc` — wszystkie commity stamtąd, jawne ścieżki (`git add "repetytorium - matematyka/app/..."`)
- Polski projekt (`repetytorium - j_polski/`) — **nie dotykać**
- Klucz localStorage: `rep:postepy:{uuid}:matematyka`
- KaTeX: import z npm `import katex from "katex"` + `import "katex/dist/katex.min.css"` — **nigdy CDN**
- JSON: polskie cudzysłowy `„..."` — po zapisie weryfikować: `python3 -c "import json,sys; json.load(open(sys.argv[1]))" plik.json`
- Dev server: `cd "repetytorium - matematyka/app" && npm run dev` → localhost:5174
- Próg ukończenia działu: **80%** pytań zamkniętych poprawnie (≥ 0.80)
- `core/` pliki (quiz.js, powtorki.js, plan.js, profil.js) — **nie modyfikować** (wyłącznie UI i content)
- CSS: używaj wyłącznie istniejących zmiennych z `theme.css` — m.in. `--kolor-sukces`, `--kolor-sukces-tlo`, `--kolor-uwaga`, `--kolor-akcent`, `--kolor-akcent-tlo`, `--radius-s`, `--sp-*` itd.
- Definition of done: build ✓ → QA desktop ✓ → QA mobile (390×844) ✓ → commit

---

## Mapa plików

### T1 — 8 działów JSON + rejestr.js
- Create: `src/content/matematyka/dzialy/ulamki.json`
- Create: `src/content/matematyka/dzialy/potegi.json`
- Create: `src/content/matematyka/dzialy/procenty.json`
- Create: `src/content/matematyka/dzialy/algebra.json`
- Create: `src/content/matematyka/dzialy/rownania.json`
- Create: `src/content/matematyka/dzialy/geometria-plaska.json`
- Create: `src/content/matematyka/dzialy/pitagoras.json`
- Create: `src/content/matematyka/dzialy/geometria-przestrzenna.json`
- Modify: `src/content/matematyka/rejestr.js`

### T2 — Dzial.jsx
- Create: `src/ui/pages/Dzial.jsx`

### T3 — ZadanieOtwarte.jsx
- Create: `src/ui/pages/ZadanieOtwarte.jsx`

### T4 — Powtorka.jsx
- Create: `src/ui/pages/Powtorka.jsx`

### T5 — App.jsx router + Start.jsx poprawka + LESSONS.md + DoD
- Modify: `src/App.jsx`
- Modify: `src/ui/pages/Start.jsx` (podpięcie `onPowtorka`)
- Modify: `repetytorium - matematyka/LESSONS.md`
- Modify: `repetytorium - matematyka/STAN-PROJEKTU.md`

---

## Task 1: 8 działów JSON + rejestr.js

**Files:**
- Create: `repetytorium - matematyka/app/src/content/matematyka/dzialy/ulamki.json`
- Create: `repetytorium - matematyka/app/src/content/matematyka/dzialy/potegi.json`
- Create: `repetytorium - matematyka/app/src/content/matematyka/dzialy/procenty.json`
- Create: `repetytorium - matematyka/app/src/content/matematyka/dzialy/algebra.json`
- Create: `repetytorium - matematyka/app/src/content/matematyka/dzialy/rownania.json`
- Create: `repetytorium - matematyka/app/src/content/matematyka/dzialy/geometria-plaska.json`
- Create: `repetytorium - matematyka/app/src/content/matematyka/dzialy/pitagoras.json`
- Create: `repetytorium - matematyka/app/src/content/matematyka/dzialy/geometria-przestrzenna.json`
- Modify: `repetytorium - matematyka/app/src/content/matematyka/rejestr.js`

**Interfaces:**
- Produces: `DZIALY` z 9 kluczami (`liczby`, `ulamki`, `potegi`, `procenty`, `algebra`, `rownania`, `geometria-plaska`, `pitagoras`, `geometria-przestrzenna`) — każdy zawiera pola `id`, `tytul`, `modul`, `waga`, `test_wstepny`, `cwiczenia`, `zadania_otwarte`
- T2 i T3 konsumują: `material(id).cwiczenia`, `material(id).zadania_otwarte`

**Wzorzec JSON** (dokładnie taka sama struktura jak `liczby.json`, który już istnieje):

```json
{
  "id": "<id-dzialu>",
  "tytul": "<Tytuł działu>",
  "modul": "<A–I>",
  "waga": "wysoka",
  "test_wstepny": [
    {
      "id": "tw-<prefix>1",
      "tresc": "<Treść z LaTeX $...$>",
      "typ": "zamkniete",
      "opcje": ["<A>", "<B>", "<C>", "<D>"],
      "poprawna": "<jedna z opcji>"
    },
    {
      "id": "tw-<prefix>2",
      "tresc": "<Treść z LaTeX>",
      "typ": "zamkniete",
      "opcje": ["<A>", "<B>", "<C>", "<D>"],
      "poprawna": "<jedna z opcji>"
    }
  ],
  "cwiczenia": [
    {
      "id": "<prefix>1",
      "tresc": "<Treść z LaTeX>",
      "typ": "zamkniete",
      "opcje": ["<A>", "<B>", "<C>", "<D>"],
      "poprawna": "<jedna z opcji>",
      "wskazowka": "<Wskazówka>",
      "przypomnij": "<Wzór/reguła w LaTeX>"
    },
    { "id": "<prefix>2", "...": "..." },
    { "id": "<prefix>3", "...": "..." }
  ],
  "zadania_otwarte": [
    {
      "id": "<prefix>o1",
      "tresc": "<Treść zadania>",
      "punkty": 2,
      "kroki": [
        {
          "id": "k1",
          "instrukcja": "<Co uczeń ma policzyć>",
          "oczekiwana": "<liczba jako string, np. '15'>",
          "jednostka": "<opcjonalnie, np. 'cm²' lub null>",
          "podpowiedz": "<Wskazówka na błąd>"
        }
      ],
      "rozwiazanie_wzorcowe": "<Pełne rozwiązanie w LaTeX>"
    }
  ]
}
```

**Mapowanie działów** (ID → tytul → modul — ustalone w design spec):

| id | tytul | modul | prefiks id |
|---|---|---|---|
| `ulamki` | Ułamki zwykłe i dziesiętne | B | `u` |
| `potegi` | Potęgi i pierwiastki | C | `p` |
| `procenty` | Procenty | D | `pr` |
| `algebra` | Wyrażenia algebraiczne | E | `a` |
| `rownania` | Równania | F | `r` |
| `geometria-plaska` | Geometria płaska | G | `gp` |
| `pitagoras` | Twierdzenie Pitagorasa | H | `pi` |
| `geometria-przestrzenna` | Geometria przestrzenna | I | `gpr` |

**Minimalna zawartość per dział:** 2 pytania `test_wstepny`, 3 `cwiczenia` (zamknięte), 1 `zadania_otwarte` z ≥1 krokiem. Pytania powinny być poprawne merytorycznie i typowe dla egzaminu ósmoklasisty.

**Przykładowe treści (użyj tych konkretnych — nie wymyślaj innych)**:

`ulamki.json`:
- tw-u1: `"Oblicz: $\\frac{3}{4} + \\frac{1}{6}$"` opcje `["\\frac{5}{12}", "\\frac{11}{12}", "\\frac{2}{3}", "\\frac{4}{10}"]` poprawna `"\\frac{11}{12}"`
- tw-u2: `"Ile wynosi $2{,}5 \\cdot 0{,}4$?"` opcje `["0,1", "1,0", "10", "0,01"]` poprawna `"1,0"`
- ć u1: `"Oblicz: $\\frac{2}{3} \\cdot \\frac{9}{4}$"` opcje `["\\frac{3}{2}", "\\frac{6}{7}", "\\frac{11}{12}", "\\frac{18}{12}"]` poprawna `"\\frac{3}{2}"` wskazowka: `"Mnożymy liczniki i mianowniki, potem skracamy."` przypomnij: `"$\\frac{a}{b} \\cdot \\frac{c}{d} = \\frac{a \\cdot c}{b \\cdot d}$"`
- ć u2: `"Ile wynosi $1\\frac{1}{2} - \\frac{3}{4}$?"` opcje `["\\frac{1}{4}", "\\frac{3}{4}", "1", "\\frac{5}{4}"]` poprawna `"\\frac{3}{4}"`
- ć u3: `"Które ułamki są równoważne? $\\frac{2}{3}$ i:"` opcje `["\\frac{4}{6}", "\\frac{3}{4}", "\\frac{6}{8}", "\\frac{2}{4}"]` poprawna `"\\frac{4}{6}"`
- zadanie otwarte uo1: tresc `"Oblicz: $\\frac{5}{8} \\div \\frac{1}{4}$"` krok k1 oczekiwana `"2.5"` podpowiedz `"Dzielenie ułamków: odwróć dzielnik i pomnóż."` rozwiązanie `"$\\frac{5}{8} \\div \\frac{1}{4} = \\frac{5}{8} \\cdot \\frac{4}{1} = \\frac{20}{8} = 2{,}5$"`

`potegi.json`:
- tw-p1: `"Ile wynosi $2^5$?"` opcje `["10", "25", "32", "16"]` poprawna `"32"`
- tw-p2: `"Co to jest $\\sqrt{49}$?"` opcje `["6", "7", "8", "9"]` poprawna `"7"`
- ć p1: `"Uprość: $a^3 \\cdot a^4$"` opcje `["$a^7$", "$a^{12}$", "$a^1$", "$2a^7$"]` poprawna `"$a^7$"` przypomnij: `"$a^m \\cdot a^n = a^{m+n}$"`
- ć p2: `"Ile wynosi $3^{-2}$?"` opcje `["$-9$", "$-6$", "$\\frac{1}{9}$", "$9$"]` poprawna `"$\\frac{1}{9}$"`
- ć p3: `"Oblicz: $\\sqrt{4 \\cdot 25}$"` opcje `["10", "20", "15", "5"]` poprawna `"10"`
- zadanie po1: tresc `"Oblicz: $(2^3)^2$"` krok k1 oczekiwana `"64"` podpowiedz `"Potęga potęgi: mnożysz wykładniki."` rozwiązanie `"$(2^3)^2 = 2^{3 \\cdot 2} = 2^6 = 64$"`

`procenty.json`:
- tw-pr1: `"25% z 80 to:"` opcje `["20", "25", "15", "30"]` poprawna `"20"`
- tw-pr2: `"Cena 200 zł wzrosła o 10%. Nowa cena to:"` opcje `["210 zł", "220 zł", "180 zł", "190 zł"]` poprawna `"220 zł"`
- ć pr1: `"Ile to 15% z 60?"` opcje `["9", "12", "15", "6"]` poprawna `"9"` przypomnij: `"$p\\% \\cdot W = \\frac{p}{100} \\cdot W$"`
- ć pr2: `"Wyrażona procentowo wartość $\\frac{3}{5}$ to:"` opcje `["35%", "53%", "60%", "55%"]` poprawna `"60%"`
- ć pr3: `"Po zniżce 20% cena wynosi 160 zł. Cena przed zniżką to:"` opcje `["128 zł", "192 zł", "180 zł", "200 zł"]` poprawna `"200 zł"`
- zadanie pro1: tresc `"Sklep obniżył cenę butów o 30%. Buty kosztowały 250 zł. Ile kosztują teraz?"` krok k1 oczekiwana `"175"` jednostka `"zł"` podpowiedz `"Oblicz 30% z 250, potem odejmij od ceny pierwotnej."` rozwiązanie `"$30\\% \\cdot 250 = 75$ zł; $250 - 75 = 175$ zł"`

`algebra.json`:
- tw-a1: `"Wartość wyrażenia $3x - 2$ dla $x = 4$ wynosi:"` opcje `["10", "14", "6", "12"]` poprawna `"10"`
- tw-a2: `"Uproszczona postać $2a + 3b - a + b$ to:"` opcje `["$a + 4b$", "$3a + 4b$", "$a + 2b$", "$3a + 2b$"]` poprawna `"$a + 4b$"`
- ć a1: `"Rozwiń: $3(x + 2)$"` opcje `["$3x + 2$", "$3x + 6$", "$3x + 5$", "$x + 6$"]` poprawna `"$3x + 6$"` przypomnij: `"$a(b+c) = ab + ac$"`
- ć a2: `"Uprość: $4x^2 - x^2 + 2x$"` opcje `["$3x^2 + 2x$", "$5x^2 + 2x$", "$3x^2$", "$4x^2 + 2x$"]` poprawna `"$3x^2 + 2x$"`
- ć a3: `"Oblicz wartość $x^2 - 2x$ dla $x = -3$"` opcje `["15", "3", "21", "-3"]` poprawna `"15"`
- zadanie ao1: tresc `"Oblicz wartość wyrażenia $2a^2 + 3b$ dla $a = 2$ i $b = 1$."` krok k1 oczekiwana `"11"` podpowiedz `"Podstaw najpierw $a=2$: $2 \\cdot 2^2 = 8$; potem dodaj $3 \\cdot 1$."` rozwiązanie `"$2 \\cdot 4 + 3 \\cdot 1 = 8 + 3 = 11$"`

`rownania.json`:
- tw-r1: `"Rozwiąż: $2x + 3 = 11$"` opcje `["$x = 4$", "$x = 7$", "$x = 3$", "$x = 5$"]` poprawna `"$x = 4$"`
- tw-r2: `"Dla jakiego $x$: $3x - 6 = 0$?"` opcje `["$x = 2$", "$x = -2$", "$x = 3$", "$x = -3$"]` poprawna `"$x = 2$"`
- ć r1: `"Rozwiąż: $5x = 35$"` opcje `["$x = 5$", "$x = 7$", "$x = 30$", "$x = 40$"]` poprawna `"$x = 7$"` przypomnij: `"Dzielimy obie strony przez współczynnik przy $x$."`
- ć r2: `"Rozwiąż: $x + 12 = 5$"` opcje `["$x = 7$", "$x = -7$", "$x = 17$", "$x = -17$"]` poprawna `"$x = -7$"`
- ć r3: `"Rozwiąż: $\\frac{x}{4} = 3$"` opcje `["$x = \\frac{3}{4}$", "$x = 7$", "$x = 12$", "$x = \\frac{4}{3}$"]` poprawna `"$x = 12$"`
- zadanie ro1: tresc `"Janek ma o 8 zł więcej niż Zosia. Razem mają 50 zł. Ile ma Zosia?"` kroki: k1 oczekiwana `"21"` jednostka `"zł"` podpowiedz `"Niech $z$ = Zosia. Janek = $z + 8$. Równanie: $z + (z+8) = 50$."` rozwiązanie `"$2z + 8 = 50 \\Rightarrow z = 21$ zł"`

`geometria-plaska.json`:
- tw-gp1: `"Pole prostokąta o bokach 6 cm i 4 cm wynosi:"` opcje `["10 cm²", "24 cm²", "20 cm²", "48 cm²"]` poprawna `"24 cm²"`
- tw-gp2: `"Obwód kwadratu o boku 5 cm wynosi:"` opcje `["10 cm", "20 cm", "25 cm", "15 cm"]` poprawna `"20 cm"`
- ć gp1: `"Oblicz obwód trójkąta o bokach 3 cm, 4 cm, 5 cm."` opcje `["10 cm", "12 cm", "15 cm", "60 cm"]` poprawna `"12 cm"` przypomnij: `"Obwód = suma wszystkich boków."`
- ć gp2: `"Pole trójkąta o podstawie 10 cm i wysokości 6 cm:"` opcje `["30 cm²", "60 cm²", "16 cm²", "15 cm²"]` poprawna `"30 cm²"` przypomnij: `"$P = \\frac{a \\cdot h}{2}$"`
- ć gp3: `"Pole koła o promieniu 5 cm (użyj $\\pi \\approx 3{,}14$):"` opcje `["15,7 cm²", "31,4 cm²", "78,5 cm²", "157 cm²"]` poprawna `"78,5 cm²"`
- zadanie gpo1: tresc `"Ogród w kształcie prostokąta ma wymiary 12 m × 8 m. Oblicz jego obwód."` krok k1 oczekiwana `"40"` jednostka `"m"` podpowiedz `"Obwód prostokąta = 2 × (długość + szerokość)."` rozwiązanie `"$O = 2 \\cdot (12 + 8) = 2 \\cdot 20 = 40$ m"`

`pitagoras.json`:
- tw-pi1: `"W trójkącie prostokątnym o przyprostokątnych 3 i 4 cm, przeciwprostokątna wynosi:"` opcje `["5 cm", "7 cm", "6 cm", "25 cm"]` poprawna `"5 cm"`
- tw-pi2: `"Twierdzenie Pitagorasa: $a^2 + b^2 = ?$"` opcje `["$c^2$", "$c$", "$ab$", "$a+b$"]` poprawna `"$c^2$"`
- ć pi1: `"Oblicz brakującą przyprostokątną: $a = 5$, $c = 13$"` opcje `["$b = 12$", "$b = 8$", "$b = 18$", "$b = 10$"]` poprawna `"$b = 12$"` przypomnij: `"$b^2 = c^2 - a^2$"`
- ć pi2: `"Czy trójkąt o bokach 5, 12, 13 jest prostokątny?"` opcje `["Tak", "Nie", "Tylko jeśli kąt jest 90°", "Nie da się stwierdzić"]` poprawna `"Tak"`
- ć pi3: `"Przekątna kwadratu o boku 1 wynosi:"` opcje `["$\\sqrt{2}$", "$2$", "$\\frac{1}{\\sqrt{2}}$", "$\\sqrt{3}$"]` poprawna `"$\\sqrt{2}$"`
- zadanie pio1: tresc `"Drabina długości 5 m opiera się o ścianę. Jej stopa jest 3 m od ściany. Na jakiej wysokości dotyka ściany?"` krok k1 oczekiwana `"4"` jednostka `"m"` podpowiedz `"Zastosuj twierdzenie Pitagorasa: $h^2 + 3^2 = 5^2$."` rozwiązanie `"$h^2 = 25 - 9 = 16 \\Rightarrow h = 4$ m"`

`geometria-przestrzenna.json`:
- tw-gpr1: `"Objętość sześcianu o boku 3 cm wynosi:"` opcje `["9 cm³", "27 cm³", "18 cm³", "36 cm³"]` poprawna `"27 cm³"`
- tw-gpr2: `"Ile wierzchołków ma graniastosłup trójkątny?"` opcje `["3", "4", "6", "9"]` poprawna `"6"`
- ć gpr1: `"Pole powierzchni sześcianu o boku 4 cm:"` opcje `["24 cm²", "64 cm²", "48 cm²", "96 cm²"]` poprawna `"96 cm²"` przypomnij: `"$P_c = 6 \\cdot a^2$"`
- ć gpr2: `"Objętość prostopadłościanu o wymiarach 3×4×5 cm:"` opcje `["12 cm³", "60 cm³", "47 cm³", "120 cm³"]` poprawna `"60 cm³"`
- ć gpr3: `"Pole podstawy walca o promieniu 3 cm (użyj $\\pi \\approx 3{,}14$):"` opcje `["9,42 cm²", "18,84 cm²", "28,26 cm²", "56,52 cm²"]` poprawna `"28,26 cm²"`
- zadanie gpro1: tresc `"Akwarium ma wymiary 50 cm × 30 cm × 40 cm. Ile litrów wody mieści? (1 l = 1 dm³)"` krok k1 oczekiwana `"60"` jednostka `"l"` podpowiedz `"Objętość = 50×30×40 = 60 000 cm³ = 60 dm³ = 60 l."` rozwiązanie `"$V = 50 \\cdot 30 \\cdot 40 = 60000 \\text{ cm}^3 = 60 \\text{ l}$"`

- [ ] **Krok 1: Utwórz 8 plików JSON** zgodnie z wzorcem i treściami powyżej

Dla każdego pliku: zapisz, a potem **waliduj** JSON:
```bash
python3 -c "import json,sys; json.load(open(sys.argv[1]))" \
  "repetytorium - matematyka/app/src/content/matematyka/dzialy/ulamki.json"
# (powtórz dla każdego z 8 plików)
```

- [ ] **Krok 2: Zaktualizuj `rejestr.js`**

```js
import liczby from "./dzialy/liczby.json";
import ulamki from "./dzialy/ulamki.json";
import potegi from "./dzialy/potegi.json";
import procenty from "./dzialy/procenty.json";
import algebra from "./dzialy/algebra.json";
import rownania from "./dzialy/rownania.json";
import geometriaPlaska from "./dzialy/geometria-plaska.json";
import pitagoras from "./dzialy/pitagoras.json";
import geometriaPrzestrzenna from "./dzialy/geometria-przestrzenna.json";

export const DZIALY = {
  liczby,
  ulamki,
  potegi,
  procenty,
  algebra,
  rownania,
  "geometria-plaska": geometriaPlaska,
  pitagoras,
  "geometria-przestrzenna": geometriaPrzestrzenna,
};

export function material(id) {
  return DZIALY[id];
}

export const PULA_EGZAMINU = Object.values(DZIALY).flatMap((d) => [
  ...d.cwiczenia,
  ...d.zadania_otwarte,
]);
```

- [ ] **Krok 3: Weryfikacja — uruchom dev server, sprawdź w konsoli przeglądarki**

```bash
cd "repetytorium - matematyka/app" && npm run dev
```

Otwórz localhost:5174, zaloguj się i sprawdź w DevTools Console, że nie ma błędów importu.

- [ ] **Krok 4: Commit**

```bash
cd /Users/pibe/dev/Repetytorium-doc
git add "repetytorium - matematyka/app/src/content/matematyka/"
git commit -m "feat(mat): 8 działów JSON + pełny rejestr.js (it.2 T1)"
```

Oczekiwany wynik: `9 files changed` (8 nowych JSON + zmodyfikowany rejestr.js).

---

## Task 2: Dzial.jsx

**Files:**
- Create: `repetytorium - matematyka/app/src/ui/pages/Dzial.jsx`

**Interfaces:**
- Konsumuje z `rejestr.js`: `material(id)` → `{cwiczenia: [...], zadania_otwarte: [...], tytul, modul}`
- Konsumuje z `core/quiz.js`: `sprawdzOdpowiedz(pytanie, odpowiedz)`, `obliczWynikDzialu(pytania, odpowiedzi)`
- Konsumuje z `core/powtorki.js`: `nowaPowtorka({id, typ, ref, temat})`, `maPowtorke(powtorki, id)`, `zaktualizujPowtorki(powtorki, rekord)`
- Props z App.jsx:
  ```js
  <Dzial
    dzialId={aktywnyDzial}        // string, np. "ulamki"
    postepy={postepy}              // {powtorki: [], dzialy: {}, ...}
    onZakoncz={(wynik) => {}}      // wynik = {dzialId, poprawne, wszystkich, procent: 0–100}
    onZadanieOtwarte={(zadanie) => {}} // przekazuje jedno zadanie_otwarte do ZadanieOtwarte.jsx
    onWroc={() => {}}              // powrót do Start
  />
  ```
- Produkuje przez `onZakoncz`: `{dzialId: string, poprawne: number, wszystkich: number, procent: number}`

**Logika ekranu:**

1. Pobiera `material(dzialId).cwiczenia` — lista pytań zamkniętych
2. Wyświetla jedno pytanie na raz (indeks `aktualneId`)
3. Cztery opcje do wyboru — po kliknięciu: podświetla zaznaczoną i po 800 ms przechodzi dalej
4. Po zaznaczeniu opcji: natychmiast wizualny feedback (zielone jeśli poprawne, czerwone jeśli błędne + wskazówka)
5. Po zakończeniu serii zamkniętych: sprawdza próg 80%
   - `procent >= 80`: wywołuje `onZakoncz`, a przed tym zapisuje powtórkę (patrz niżej)
   - `procent < 80`: wyświetla podsumowanie z wynikiem + przycisk "Spróbuj jeszcze raz" (reset) + przycisk "Wróć" (onWroc)
6. Jeśli dział ukończony (≥ 80%): po serii zamkniętych, jeśli są `zadania_otwarte`, wywołuje `onZadanieOtwarte(zadania_otwarte[0])` zamiast `onZakoncz`; App.jsx przełącza na ZadanieOtwarte, a wynik działu zapisuje po powrocie z ZadanieOtwarte

**Uwaga:** Powtórkę dodaje App.jsx (nie Dzial.jsx), bo App.jsx ma zapiszPostepy. Dzial.jsx wywołuje tylko `onZakoncz(wynik)`.

- [ ] **Krok 1: Napisz Dzial.jsx**

```jsx
import { useState, useMemo } from "react";
import { material } from "../../content/matematyka/rejestr.js";
import { sprawdzOdpowiedz, obliczWynikDzialu } from "../../core/quiz.js";
import KaTeXRenderer from "../components/KaTeXRenderer.jsx";

export default function Dzial({ dzialId, postepy, onZakoncz, onZadanieOtwarte, onWroc }) {
  const dzial = useMemo(() => material(dzialId), [dzialId]);
  const pytania = dzial.cwiczenia;

  const [aktualny, setAktualny] = useState(0);
  const [odpowiedzi, setOdpowiedzi] = useState({});     // {id: odpowiedz}
  const [wybrana, setWybrana] = useState(null);          // aktualnie zaznaczona opcja
  const [pokazFeedback, setPokazFeedback] = useState(false);
  const [zakonczone, setZakonczone] = useState(false);

  const pytanie = pytania[aktualny];

  function wybierz(opcja) {
    if (wybrana !== null) return; // blokada podwójnego kliknięcia
    const nowe = { ...odpowiedzi, [pytanie.id]: opcja };
    setWybrana(opcja);
    setPokazFeedback(true);
    setOdpowiedzi(nowe);

    setTimeout(() => {
      if (aktualny < pytania.length - 1) {
        setAktualny(aktualny + 1);
        setWybrana(null);
        setPokazFeedback(false);
      } else {
        setZakonczone(true);
      }
    }, 1000);
  }

  function reset() {
    setAktualny(0);
    setOdpowiedzi({});
    setWybrana(null);
    setPokazFeedback(false);
    setZakonczone(false);
  }

  if (zakonczone) {
    const wynik = obliczWynikDzialu(pytania, odpowiedzi);
    const procent = wynik.procent;
    const zdany = procent >= 80;

    if (zdany) {
      // Jeśli są zadania otwarte — idź do ZadanieOtwarte
      if (dzial.zadania_otwarte?.length > 0) {
        onZadanieOtwarte({ zadanie: dzial.zadania_otwarte[0], wynikZamknietych: wynik });
        return null;
      }
      // Brak zadań otwartych — zakończ dział
      onZakoncz({ dzialId, ...wynik });
      return null;
    }

    return (
      <div className="tresc ekran-wjazd">
        <h2>{dzial.tytul}</h2>
        <div className="karta" style={{ textAlign: "center", marginBottom: "var(--sp-4)" }}>
          <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{procent}%</p>
          <p>{wynik.poprawne}/{wynik.wszystkich} poprawnie</p>
          <p style={{ color: "var(--kolor-uwaga)" }}>
            Potrzebujesz 80%, żeby ukończyć dział. Spróbuj jeszcze raz!
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--sp-3)", flexWrap: "wrap" }}>
          <button className="btn btn-primary" onClick={reset} style={{ flex: 1 }}>Spróbuj jeszcze raz</button>
          <button className="btn btn-ghost" onClick={onWroc} style={{ flex: 1 }}>Wróć do menu</button>
        </div>
      </div>
    );
  }

  const poprawna = pytanie.poprawna;
  const czyWybranaPop = wybrana === poprawna;

  return (
    <div className="tresc ekran-wjazd">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--sp-3)" }}>
        <button className="btn btn-ghost" onClick={onWroc}>← Wróć</button>
        <span className="tekst-2 tekst-maly">{aktualny + 1}/{pytania.length}</span>
      </div>

      <h2 style={{ marginBottom: "var(--sp-2)" }}>{dzial.tytul}</h2>

      <div className="karta" style={{ marginBottom: "var(--sp-4)" }}>
        <p style={{ marginBottom: "var(--sp-3)", fontWeight: 500 }}>
          <KaTeXRenderer tekst={pytanie.tresc} />
        </p>

        {pytanie.przypomnij && (
          <details style={{ marginBottom: "var(--sp-3)" }}>
            <summary className="tekst-2 tekst-maly" style={{ cursor: "pointer" }}>Przypomnij</summary>
            <p style={{ marginTop: "var(--sp-2)" }}>
              <KaTeXRenderer tekst={pytanie.przypomnij} />
            </p>
          </details>
        )}

        <div style={{ display: "grid", gap: "var(--sp-2)" }}>
          {pytanie.opcje.map((opcja) => {
            let klass = "btn btn-ghost btn--pelny";
            if (wybrana !== null) {
              if (opcja === poprawna) klass += " btn--sukces";
              else if (opcja === wybrana) klass += " btn--blad";
            }
            return (
              <button
                key={opcja}
                className={klass}
                style={{ textAlign: "left" }}
                onClick={() => wybierz(opcja)}
                disabled={wybrana !== null}
              >
                <KaTeXRenderer tekst={opcja} />
              </button>
            );
          })}
        </div>

        {pokazFeedback && !czyWybranaPop && pytanie.wskazowka && (
          <p className="tekst-2" style={{ marginTop: "var(--sp-3)", color: "var(--kolor-uwaga)" }}>
            {pytanie.wskazowka}
          </p>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Krok 2: Sprawdź, że plik się parsuje**

```bash
cd "repetytorium - matematyka/app" && npm run build 2>&1 | head -20
```

Oczekiwany wynik: brak błędów Vite dotyczących `Dzial.jsx` (może być błąd o nieużywanym ekranie w App.jsx — to OK na tym etapie).

- [ ] **Krok 3: Commit**

```bash
cd /Users/pibe/dev/Repetytorium-doc
git add "repetytorium - matematyka/app/src/ui/pages/Dzial.jsx"
git commit -m "feat(mat): Dzial.jsx — quiz zamknięty z feedbackiem (it.2 T2)"
```

---

## Task 3: ZadanieOtwarte.jsx

**Files:**
- Create: `repetytorium - matematyka/app/src/ui/pages/ZadanieOtwarte.jsx`

**Interfaces:**
- Props z App.jsx:
  ```js
  <ZadanieOtwarte
    zadanie={aktywneZadanie}       // jeden obiekt z dzial.zadania_otwarte[N]
    wynikZamknietych={wynikZamknietych} // {poprawne, wszystkich, procent} z Dzial.jsx — do podsumowania
    dzialId={aktywnyDzial}         // string
    onZakoncz={(wynik) => {}}      // wynik = {dzialId, poprawne, wszystkich, procent, punktyOtwarte, maxPunktyOtwarte}
    onWroc={() => {}}
  />
  ```
- Konsumuje z `ui/components/KaTeXRenderer.jsx`: `<KaTeXRenderer tekst="..." />`
- Konsumuje z `ui/components/KrokZadania.jsx`: `<KrokZadania krok={...} numerKroku={N} onPoprawnie={fn} onBlad={fn} />`

**Logika ekranu:**

1. Wyświetla `zadanie.tresc` przez KaTeXRenderer
2. Renderuje `zadanie.kroki` sekwencyjnie — nowy krok pokazuje się dopiero gdy poprzedni jest zakończony (poprawnie LUB podpowiedź pokazana)
3. Krok zakończony = `KrokZadania` wywołało `onPoprawnie` LUB `onBlad` (po 2 próbach)
4. Kiedy wszystkie kroki zakończone: pokazuje podsumowanie:
   - Liczba punktów zdobytych (każdy poprawny krok = 1 pkt z `zadanie.punkty / kroki.length`)
   - Rozwiązanie wzorcowe: `zadanie.rozwiazanie_wzorcowe` przez KaTeXRenderer
   - Przycisk "Zakończ dział" → `onZakoncz({dzialId, ...wynikZamknietych, punktyOtwarte, maxPunktyOtwarte})`

- [ ] **Krok 1: Napisz ZadanieOtwarte.jsx**

```jsx
import { useState } from "react";
import KaTeXRenderer from "../components/KaTeXRenderer.jsx";
import KrokZadania from "../components/KrokZadania.jsx";

export default function ZadanieOtwarte({ zadanie, wynikZamknietych, dzialId, onZakoncz, onWroc }) {
  const [aktualnyKrok, setAktualnyKrok] = useState(0);
  const [poprawneKroki, setPoprawneKroki] = useState(0);
  const [zakonczone, setZakonczone] = useState(false);

  const kroki = zadanie.kroki;
  const maxPunkty = zadanie.punkty ?? kroki.length;

  function krokPoprawnie() {
    const nowe = poprawneKroki + 1;
    setPoprawneKroki(nowe);
    przejdzDalej();
  }

  function krokBlad() {
    przejdzDalej();
  }

  function przejdzDalej() {
    if (aktualnyKrok < kroki.length - 1) {
      setAktualnyKrok(aktualnyKrok + 1);
    } else {
      setZakonczone(true);
    }
  }

  if (zakonczone) {
    const punktyOtwarte = Math.round((poprawneKroki / kroki.length) * maxPunkty);

    return (
      <div className="tresc ekran-wjazd">
        <h2>Zadanie ukończone!</h2>

        <div className="karta" style={{ marginBottom: "var(--sp-4)", textAlign: "center" }}>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            {punktyOtwarte}/{maxPunkty} {maxPunkty === 1 ? "punkt" : "punkty"}
          </p>
          {wynikZamknietych && (
            <p className="tekst-2">Pytania zamknięte: {wynikZamknietych.poprawne}/{wynikZamknietych.wszystkich}</p>
          )}
        </div>

        <div className="karta" style={{ marginBottom: "var(--sp-4)" }}>
          <p className="tekst-2 tekst-maly" style={{ marginBottom: "var(--sp-2)" }}>Rozwiązanie wzorcowe:</p>
          <KaTeXRenderer tekst={zadanie.rozwiazanie_wzorcowe} />
        </div>

        <button
          className="btn btn-primary btn--pelny"
          onClick={() => onZakoncz({
            dzialId,
            ...wynikZamknietych,
            punktyOtwarte,
            maxPunktyOtwarte: maxPunkty,
          })}
        >
          Zakończ dział
        </button>
      </div>
    );
  }

  return (
    <div className="tresc ekran-wjazd">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--sp-3)" }}>
        <button className="btn btn-ghost" onClick={onWroc}>← Wróć</button>
        <span className="tekst-2 tekst-maly">Zadanie otwarte</span>
      </div>

      <div className="karta" style={{ marginBottom: "var(--sp-4)" }}>
        <p style={{ fontWeight: 500 }}>
          <KaTeXRenderer tekst={zadanie.tresc} />
        </p>
      </div>

      {kroki.slice(0, aktualnyKrok + 1).map((krok, i) => (
        <KrokZadania
          key={krok.id}
          krok={krok}
          numerKroku={i + 1}
          onPoprawnie={i === aktualnyKrok ? krokPoprawnie : () => {}}
          onBlad={i === aktualnyKrok ? krokBlad : () => {}}
        />
      ))}
    </div>
  );
}
```

- [ ] **Krok 2: Build check**

```bash
cd "repetytorium - matematyka/app" && npm run build 2>&1 | head -20
```

Oczekiwany wynik: brak błędów dotyczących `ZadanieOtwarte.jsx`.

- [ ] **Krok 3: Commit**

```bash
cd /Users/pibe/dev/Repetytorium-doc
git add "repetytorium - matematyka/app/src/ui/pages/ZadanieOtwarte.jsx"
git commit -m "feat(mat): ZadanieOtwarte.jsx — prowadzony tok rozumowania krok po kroku (it.2 T3)"
```

---

## Task 4: Powtorka.jsx

**Files:**
- Create: `repetytorium - matematyka/app/src/ui/pages/Powtorka.jsx`

**Interfaces:**
- Props z App.jsx:
  ```js
  <Powtorka
    powtorkiDzis={powtorkiDzis}    // wynik coNaDzis(postepy.powtorki, dataDnia())
    postepy={postepy}               // pełne postępy
    onZakoncz={(nowePowtorki) => {}} // zaktualizowana lista powtórek do zapisu
    onWroc={() => {}}
  />
  ```
- Konsumuje z `core/powtorki.js`: `oznaczPowtorke(rekord, ocena)`, `zaktualizujPowtorki(powtorki, rekord)`
- Konsumuje z `content/matematyka/rejestr.js`: `material(id)` — do pobrania treści pytania per powtórka
- Konsumuje z `ui/components/KaTeXRenderer.jsx`

**Logika sesji powtórkowej:**

- `powtorkiDzis` to lista rekordów z `powtorki.js` (format: `{id, typ, ref, temat, nastepna, interwal, historia}`)
- `ref` to ID pytania (z `cwiczenia[]`) a `id` działu to prefix przed `-` w `ref` LUB oddzielne pole — **używaj `rekord.ref`** do wyciągnięcia pytania z rejestru
- Pytanie pobierasz przez: szukaj w `material(dzialId).cwiczenia.find(c => c.id === rekord.ref)` — dzialId to `rekord.temat` (taki format zapisuje App.jsx w T5)
- Wyświetlaj pytanie jak w `Dzial.jsx` (opcje do wyboru, KaTeXRenderer)
- Po odpowiedzi: dwa przyciski "Umiem" / "Jeszcze nie" — niezależnie od poprawności odpowiedzi, uczeń sam ocenia
- Po każdej ocenie: wywołaj `oznaczPowtorke(rekord, ocena)` i `zaktualizujPowtorki`
- Po zakończeniu wszystkich powtórek: pokaż podsumowanie (X umiem / Y jeszcze nie) + przycisk "Gotowe"
- `onZakoncz(nowePowtorki)` — App.jsx zapisze zaktualizowaną listę

**Ważna uwaga dotycząca formatu rekordu powtórki:**  
W T5 (App.jsx) nowa powtórka jest tworzona przez `nowaPowtorka({id: dzialId + "-" + dataDnia(), typ: "quiz", ref: dzialId, temat: dzialId})`. W Powtorka.jsx pytanie pobierasz przez `material(rekord.temat)` — żeby nie szukać per-pytanie, wyświetlaj losowe pytanie zamknięte z całego działu za każdym razem (nie śledź konkretnych pytań w powtórce — wystarczy quiz z działu).

- [ ] **Krok 1: Napisz Powtorka.jsx**

```jsx
import { useState, useMemo } from "react";
import { material } from "../../content/matematyka/rejestr.js";
import { oznaczPowtorke, zaktualizujPowtorki } from "../../core/powtorki.js";
import KaTeXRenderer from "../components/KaTeXRenderer.jsx";

export default function Powtorka({ powtorkiDzis, postepy, onZakoncz, onWroc }) {
  const [aktualny, setAktualny] = useState(0);
  const [wybrana, setWybrana] = useState(null);
  const [pokazOcene, setPokazOcene] = useState(false);
  const [wyniki, setWyniki] = useState({ umiem: 0, jeszczeNie: 0 });
  const [aktualnePowtorki, setAktualnePowtorki] = useState(postepy.powtorki);
  const [zakonczone, setZakonczone] = useState(false);

  // Dla każdej powtórki wybierz losowe pytanie z danego działu
  const pytaniaPerPowtorka = useMemo(() => {
    return powtorkiDzis.map((rek) => {
      const dzialMaterial = material(rek.temat);
      if (!dzialMaterial) return null;
      const cwiczenia = dzialMaterial.cwiczenia;
      return cwiczenia[Math.floor(Math.random() * cwiczenia.length)] ?? null;
    });
  }, [powtorkiDzis]);

  if (powtorkiDzis.length === 0 || zakonczone) {
    return (
      <div className="tresc ekran-wjazd">
        <h2>Powtórki</h2>
        {zakonczone ? (
          <div className="karta" style={{ textAlign: "center", marginBottom: "var(--sp-4)" }}>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Sesja zakończona!</p>
            <p>Umiem: {wyniki.umiem} · Jeszcze nie: {wyniki.jeszczeNie}</p>
          </div>
        ) : (
          <p>Brak powtórek na dziś.</p>
        )}
        <button className="btn btn-primary btn--pelny" onClick={() => onZakoncz(aktualnePowtorki)}>
          Gotowe
        </button>
      </div>
    );
  }

  const rekord = powtorkiDzis[aktualny];
  const pytanie = pytaniaPerPowtorka[aktualny];

  function wybierz(opcja) {
    if (wybrana !== null) return;
    setWybrana(opcja);
    setPokazOcene(true);
  }

  function ocen(ocena) {
    const nowyRekord = oznaczPowtorke(rekord, ocena);
    const nowe = zaktualizujPowtorki(aktualnePowtorki, nowyRekord);
    setAktualnePowtorki(nowe);

    const noweWyniki = {
      umiem: wyniki.umiem + (ocena === "umiem" ? 1 : 0),
      jeszczeNie: wyniki.jeszczeNie + (ocena === "jeszcze-nie" ? 1 : 0),
    };
    setWyniki(noweWyniki);

    if (aktualny < powtorkiDzis.length - 1) {
      setAktualny(aktualny + 1);
      setWybrana(null);
      setPokazOcene(false);
    } else {
      setZakonczone(true);
    }
  }

  if (!pytanie) {
    // Dział usunięty lub błąd — pomiń
    ocen("jeszcze-nie");
    return null;
  }

  return (
    <div className="tresc ekran-wjazd">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--sp-3)" }}>
        <button className="btn btn-ghost" onClick={onWroc}>← Wróć</button>
        <span className="tekst-2 tekst-maly">{aktualny + 1}/{powtorkiDzis.length}</span>
      </div>

      <h2 style={{ marginBottom: "var(--sp-2)" }}>Powtórka: {rekord.temat}</h2>

      <div className="karta" style={{ marginBottom: "var(--sp-4)" }}>
        <p style={{ fontWeight: 500, marginBottom: "var(--sp-3)" }}>
          <KaTeXRenderer tekst={pytanie.tresc} />
        </p>

        <div style={{ display: "grid", gap: "var(--sp-2)" }}>
          {pytanie.opcje.map((opcja) => {
            let klass = "btn btn-ghost btn--pelny";
            if (wybrana !== null) {
              if (opcja === pytanie.poprawna) klass += " btn--sukces";
              else if (opcja === wybrana) klass += " btn--blad";
            }
            return (
              <button
                key={opcja}
                className={klass}
                style={{ textAlign: "left" }}
                onClick={() => wybierz(opcja)}
                disabled={wybrana !== null}
              >
                <KaTeXRenderer tekst={opcja} />
              </button>
            );
          })}
        </div>
      </div>

      {pokazOcene && (
        <div className="karta" style={{ marginBottom: "var(--sp-3)" }}>
          <p style={{ marginBottom: "var(--sp-3)" }}>Jak ci poszło?</p>
          <div style={{ display: "flex", gap: "var(--sp-3)" }}>
            <button
              className="btn btn-primary"
              style={{ flex: 1, background: "var(--kolor-sukces)", borderColor: "var(--kolor-sukces)" }}
              onClick={() => ocen("umiem")}
            >
              Umiem ✓
            </button>
            <button
              className="btn btn-ghost"
              style={{ flex: 1 }}
              onClick={() => ocen("jeszcze-nie")}
            >
              Jeszcze nie
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Krok 2: Build check**

```bash
cd "repetytorium - matematyka/app" && npm run build 2>&1 | head -20
```

- [ ] **Krok 3: Commit**

```bash
cd /Users/pibe/dev/Repetytorium-doc
git add "repetytorium - matematyka/app/src/ui/pages/Powtorka.jsx"
git commit -m "feat(mat): Powtorka.jsx — sesja spaced-repetition (it.2 T4)"
```

---

## Task 5: App.jsx router + Start.jsx + LESSONS.md + DoD

**Files:**
- Modify: `repetytorium - matematyka/app/src/App.jsx`
- Modify: `repetytorium - matematyka/app/src/ui/pages/Start.jsx`
- Modify: `repetytorium - matematyka/LESSONS.md`
- Modify: `repetytorium - matematyka/STAN-PROJEKTU.md`

**Interfaces:**
- Konsumuje nowe ekrany: `Dzial`, `ZadanieOtwarte`, `Powtorka` (importuje z `./ui/pages/`)
- Konsumuje z `core/powtorki.js`: `nowaPowtorka`, `maPowtorke`, `zaktualizujPowtorki`, `coNaDzis`, `dataDnia`
- `postepy.dzialy[dzialId]` ustawia po `onZakoncz`: `{ukonczone: true, wynik: procent/100, data: new Date().toISOString().split("T")[0]}`
- `postepy.sesje` — push `{typ: "dzial", data: new Date().toISOString(), dzialId, wynik: procent/100}`

**Nowe stany App.jsx** (uzupełnienie istniejącego routera):
- `"dzial"` — pokazuje `<Dzial>`
- `"zadanie-otwarte"` — pokazuje `<ZadanieOtwarte>`
- `"powtorka"` — pokazuje `<Powtorka>`

**Stan pomocniczy** (nowe zmienne stanu w App):
```js
const [aktywneZadanie, setAktywneZadanie] = useState(null);
// {zadanie: obiekt_zadanie, wynikZamknietych: {poprawne, wszystkich, procent}}
const [wynikZamknietych, setWynikZamknietych] = useState(null);
```

**Handlery w App.jsx:**

```js
// Handler dla onDzial w Start.jsx
function otworzDzial(id) {
  setAktywnyDzial(id);
  setEkran("dzial");
}

// Handler dla onZakoncz w Dzial.jsx
async function zakonczonoDzial(wynik) {
  // wynik = {dzialId, poprawne, wszystkich, procent, punktyOtwarte?, maxPunktyOtwarte?}
  const { dzialId, procent } = wynik;
  const nowe = {
    ...postepy,
    dzialy: {
      ...postepy.dzialy,
      [dzialId]: {
        ukonczone: true,
        wynik: procent / 100,
        data: new Date().toISOString().split("T")[0],
      },
    },
    sesje: [
      ...postepy.sesje,
      { typ: "dzial", data: new Date().toISOString(), dzialId, wynik: procent / 100 },
    ],
    // Aktualizuj plan — oznacz dział jako zrobiony
    plan: postepy.plan
      ? postepy.plan.map((p) =>
          p.dzialId === dzialId ? { ...p, status: "zrobiony" } : p
        )
      : postepy.plan,
  };
  // Dodaj powtórkę jeśli jeszcze nie ma
  if (!maPowtorke(nowe.powtorki, dzialId)) {
    const rekord = nowaPowtorka({ id: dzialId, typ: "quiz", ref: dzialId, temat: dzialId });
    nowe.powtorki = zaktualizujPowtorki(nowe.powtorki, rekord);
  }
  await zapiszPostepy(nowe);
  setEkran("start");
}

// Handler dla onZadanieOtwarte w Dzial.jsx
function przejdzDoZadaniaOtwartego({ zadanie, wynikZamknietych }) {
  setAktywneZadanie(zadanie);
  setWynikZamknietych(wynikZamknietych);
  setEkran("zadanie-otwarte");
}

// Handler dla onZakoncz w ZadanieOtwarte.jsx  
async function zakonczonoZadanieOtwarte(wynik) {
  await zakonczonoDzial(wynik);
  // zakonczonoDzial ustawia ekran na "start"
}

// Handler dla onPowtorka w Start.jsx
function otworzPowtorke() {
  setEkran("powtorka");
}

// Handler dla onZakoncz w Powtorka.jsx
async function zakonczonoPowtorke(nowePowtorki) {
  const nowe = {
    ...postepy,
    powtorki: nowePowtorki,
    sesje: [...postepy.sesje, { typ: "powtorka", data: new Date().toISOString() }],
  };
  await zapiszPostepy(nowe);
  setEkran("start");
}
```

**Pełna zaktualizowana App.jsx** — zastąp oryginalny plik w całości:

```jsx
import { useEffect, useState } from "react";
import { storage } from "./storage/adapter.js";
import { pustePostepy, migrujPostepy } from "./core/profil.js";
import { generujPlan } from "./core/plan.js";
import { nowaPowtorka, maPowtorke, zaktualizujPowtorki, coNaDzis, dataDnia } from "./core/powtorki.js";
import WyborProfilu from "./ui/pages/WyborProfilu.jsx";
import NowyProfil from "./ui/pages/NowyProfil.jsx";
import EkranPin from "./ui/pages/EkranPin.jsx";
import Start from "./ui/pages/Start.jsx";
import TestWstepny from "./ui/pages/TestWstepny.jsx";
import Dzial from "./ui/pages/Dzial.jsx";
import ZadanieOtwarte from "./ui/pages/ZadanieOtwarte.jsx";
import Powtorka from "./ui/pages/Powtorka.jsx";

function zastosujPreferencje(profil) {
  const el = document.documentElement;
  el.dataset.theme = profil?.preferencje?.trybCiemny ? "dark" : "light";
  el.dataset.dysleksja = profil?.preferencje?.dysleksja ? "true" : "false";
}

export default function App() {
  const [ekran, setEkran] = useState("ladowanie");
  const [profile, setProfile] = useState([]);
  const [profil, setProfil] = useState(null);
  const [postepy, setPostepy] = useState(null);
  const [wybranyProfil, setWybranyProfil] = useState(null);
  const [aktywnyDzial, setAktywnyDzial] = useState(null);
  const [aktywneZadanie, setAktywneZadanie] = useState(null);
  const [wynikZamknietych, setWynikZamknietych] = useState(null);

  useEffect(() => {
    (async () => {
      const lista = await storage.listProfiles();
      setProfile(lista);
      setEkran(lista.length === 0 ? "nowy" : "wybor");
    })();
  }, []);

  async function zaloguj(p) {
    zastosujPreferencje(p);
    let dane = migrujPostepy((await storage.getPostepy(p.id, "matematyka")) ?? pustePostepy());
    if (dane.diagnoza && !dane.plan) {
      dane = { ...dane, plan: generujPlan(dane.diagnoza) };
    }
    await storage.savePostepy(p.id, "matematyka", dane);
    setProfil(p);
    setPostepy(dane);
    setEkran("start");
  }

  async function zapiszPostepy(nowe) {
    await storage.savePostepy(profil.id, "matematyka", nowe);
    setPostepy(nowe);
  }

  async function utworzono(p) {
    await storage.saveProfile(p);
    setProfile(await storage.listProfiles());
    await zaloguj(p);
  }

  function wyloguj() {
    setProfil(null);
    setPostepy(null);
    zastosujPreferencje(null);
    setEkran(profile.length === 0 ? "nowy" : "wybor");
  }

  async function zakonczonoDiagnoze(wynikPerDzial) {
    const plan = generujPlan(wynikPerDzial);
    const nowe = {
      ...postepy,
      diagnoza: wynikPerDzial,
      plan,
      sesje: [...postepy.sesje, { typ: "diagnoza", data: new Date().toISOString() }],
    };
    await zapiszPostepy(nowe);
    setEkran("start");
  }

  function otworzDzial(id) {
    setAktywnyDzial(id);
    setEkran("dzial");
  }

  function przejdzDoZadaniaOtwartego({ zadanie, wynikZamknietych: wz }) {
    setAktywneZadanie(zadanie);
    setWynikZamknietych(wz);
    setEkran("zadanie-otwarte");
  }

  async function zakonczonoDzial(wynik) {
    const { dzialId, procent } = wynik;
    const nowe = {
      ...postepy,
      dzialy: {
        ...postepy.dzialy,
        [dzialId]: {
          ukonczone: true,
          wynik: procent / 100,
          data: new Date().toISOString().split("T")[0],
        },
      },
      sesje: [
        ...postepy.sesje,
        { typ: "dzial", data: new Date().toISOString(), dzialId, wynik: procent / 100 },
      ],
      plan: postepy.plan
        ? postepy.plan.map((p) => p.dzialId === dzialId ? { ...p, status: "zrobiony" } : p)
        : postepy.plan,
    };
    if (!maPowtorke(nowe.powtorki, dzialId)) {
      const rekord = nowaPowtorka({ id: dzialId, typ: "quiz", ref: dzialId, temat: dzialId });
      nowe.powtorki = zaktualizujPowtorki(nowe.powtorki, rekord);
    }
    await zapiszPostepy(nowe);
    setEkran("start");
  }

  function otworzPowtorke() {
    setEkran("powtorka");
  }

  async function zakonczonoPowtorke(nowePowtorki) {
    const nowe = {
      ...postepy,
      powtorki: nowePowtorki,
      sesje: [...postepy.sesje, { typ: "powtorka", data: new Date().toISOString() }],
    };
    await zapiszPostepy(nowe);
    setEkran("start");
  }

  if (ekran === "ladowanie") return null;

  if (ekran === "wybor") return (
    <WyborProfilu
      profile={profile}
      onWybierz={(p) => { setWybranyProfil(p); setEkran("pin"); }}
      onNowy={() => setEkran("nowy")}
      onImport={async (p) => { setProfile(await storage.listProfiles()); await zaloguj(p); }}
    />
  );

  if (ekran === "nowy") return (
    <NowyProfil
      onUtworzono={utworzono}
      onAnuluj={() => setEkran(profile.length > 0 ? "wybor" : "nowy")}
      saProfile={profile.length > 0}
    />
  );

  if (ekran === "pin") return (
    <EkranPin
      profil={wybranyProfil}
      onOk={() => zaloguj(wybranyProfil)}
      onWroc={() => { setWybranyProfil(null); setEkran("wybor"); }}
    />
  );

  if (ekran === "test-wstepny") return (
    <TestWstepny onZakoncz={zakonczonoDiagnoze} />
  );

  if (ekran === "dzial") return (
    <Dzial
      dzialId={aktywnyDzial}
      postepy={postepy}
      onZakoncz={zakonczonoDzial}
      onZadanieOtwarte={przejdzDoZadaniaOtwartego}
      onWroc={() => setEkran("start")}
    />
  );

  if (ekran === "zadanie-otwarte") return (
    <ZadanieOtwarte
      zadanie={aktywneZadanie}
      wynikZamknietych={wynikZamknietych}
      dzialId={aktywnyDzial}
      onZakoncz={zakonczonoDzial}
      onWroc={() => setEkran("dzial")}
    />
  );

  if (ekran === "powtorka") return (
    <Powtorka
      powtorkiDzis={coNaDzis(postepy.powtorki ?? [], dataDnia())}
      postepy={postepy}
      onZakoncz={zakonczonoPowtorke}
      onWroc={() => setEkran("start")}
    />
  );

  if (ekran === "start") return (
    <Start
      profil={profil}
      postepy={postepy}
      onTestWstepny={() => setEkran("test-wstepny")}
      onDzial={otworzDzial}
      onPowtorka={otworzPowtorke}
      onStatystyki={() => { /* it.3 */ }}
      onWyloguj={wyloguj}
    />
  );

  return null;
}
```

**Start.jsx — dodaj prop `onPowtorka`** i podepnij do banera powtórek:

```jsx
export default function Start({ profil, postepy, onTestWstepny, onDzial, onPowtorka, onStatystyki, onWyloguj }) {
  // ...
  // w JSX, w bannerze "Na dziś":
  {powtorkiDzis.length > 0 && (
    <div className="karta" style={{ marginBottom: "var(--sp-4)", borderLeft: "4px solid var(--kolor-uwaga)" }}>
      <strong>Na dziś: {powtorkiDzis.length} powtórki</strong>
      <p className="tekst-2">Masz zaplanowane powtórki.</p>
      <button className="btn btn-primary" style={{ marginTop: "var(--sp-3)" }} onClick={onPowtorka}>
        Rozpocznij powtórki
      </button>
    </div>
  )}
  // ...
```

- [ ] **Krok 1: Zaktualizuj App.jsx** — zastąp plik całością z sekcji Interfaces powyżej

- [ ] **Krok 2: Zaktualizuj Start.jsx** — dodaj prop `onPowtorka` i przycisk w sekcji "Na dziś"

- [ ] **Krok 3: Build + uruchom dev server**

```bash
cd "repetytorium - matematyka/app" && npm run build 2>&1 | head -30
```

Oczekiwany wynik: `built in X.XXs` — brak błędów.

- [ ] **Krok 4: QA manualny — golden path**

Uruchom dev server: `cd "repetytorium - matematyka/app" && npm run dev`

Przetestuj:
1. Utwórz nowy profil → dashboard
2. Kliknij kartę "Ułamki" → ekran Dzial z 3 pytaniami zamkniętymi
3. Odpowiedz na wszystkie pytania → jeśli wynik ≥ 80%: przejście do ZadanieOtwarte → ukończ krok → "Zakończ dział"
4. Wróć na dashboard → pasek postępu działu ułamki powinien być wypełniony
5. Karta "Na dziś" powinna pojawić się następnego dnia (lub przekłam datę w localStorage testowo)
6. QA mobile: zwęź okno do 390px → sprawdź, czy opcje nie wylewają się

- [ ] **Krok 5: Wpis w LESSONS.md**

Dopisz wpis:

```markdown
## 2026-07-24 (it.2 — działy JSON + ekrany Dzial, ZadanieOtwarte, Powtorka)
- Obserwacja: 8 działów JSON napisanych wg wzorca liczby.json; walidacja przez python3 json.load wyłapuje polskie cudzysłowy.
- Obserwacja: KaTeX w opcjach odpowiedzi działa — KaTeXRenderer renderuje frakcje w przyciskach.
- Obserwacja: Ekrany Dzial.jsx i ZadanieOtwarte.jsx połączone przez App.jsx — przejście przez onZadanieOtwarte zachowuje wynik zamkniętych do podsumowania.
- Wniosek: próg 80% sprawdza `procent >= 80` (liczba całkowita z obliczWynikDzialu) — wystarczający; brak konieczności bardziej złożonej logiki.
- Wniosek: nowaPowtorka({id: dzialId}) jako identyfikator rekordu — jeden rekord per dział, nie per pytanie; sesja powtórkowa ciągnie losowe pytanie z cwiczenia[].
- Zmiana w skilu: nie.
```

- [ ] **Krok 6: Zaktualizuj STAN-PROJEKTU.md** — oznacz it.2 jako ukończoną, dodaj it.3 do kolejnych kroków

- [ ] **Krok 7: Commit końcowy**

```bash
cd /Users/pibe/dev/Repetytorium-doc
git add "repetytorium - matematyka/app/src/App.jsx"
git add "repetytorium - matematyka/app/src/ui/pages/Start.jsx"
git add "repetytorium - matematyka/LESSONS.md"
git add "repetytorium - matematyka/STAN-PROJEKTU.md"
git commit -m "feat(mat): router it.2 — Dzial+ZadanieOtwarte+Powtorka w App.jsx + LESSONS (it.2 T5)"
```

---

## Self-Review

**Pokrycie spec:**
- ✅ 8 działów JSON z pełnym schematem (T1)
- ✅ `rejestr.js` z 9 kluczami (T1)
- ✅ `Dzial.jsx` — pytania zamknięte, feedback, próg 80%, przejście do ZadanieOtwarte (T2)
- ✅ `ZadanieOtwarte.jsx` — kroki sekwencyjne, KrokZadania, podsumowanie, rozwiązanie wzorcowe (T3)
- ✅ `Powtorka.jsx` — coNaDzis, oznaczPowtorke, ocena umiem/jeszcze-nie (T4)
- ✅ App.jsx — stany dzial/zadanie-otwarte/powtorka, zapis postepy.dzialy, nowaPowtorka (T5)
- ✅ Start.jsx — prop onPowtorka, przycisk "Rozpocznij powtórki" (T5)
- ✅ postepy.plan aktualizacja (status "zrobiony") po ukończeniu działu (T5)
- ✅ LESSONS.md + STAN-PROJEKTU.md (T5)

**Poza zakresem (it.3):** EgzaminProbny.jsx, Statystyki.jsx, deploy Vercel.

**Placeholder scan:** brak TBD/TODO w krokach — każdy krok zawiera pełny kod.

**Spójność sygnatur:**
- `onZakoncz(wynik)` w Dzial.jsx → `zakonczonoDzial(wynik)` w App.jsx — parametr `{dzialId, poprawne, wszystkich, procent}` ✅
- `onZadanieOtwarte({zadanie, wynikZamknietych})` → `przejdzDoZadaniaOtwartego` ✅
- `onZakoncz(wynik)` w ZadanieOtwarte.jsx → ten sam `zakonczonoDzial(wynik)` — parametr rozszerzony o `punktyOtwarte` ✅
- `onZakoncz(nowePowtorki)` w Powtorka.jsx → `zakonczonoPowtorke(nowePowtorki)` — lista rekordów ✅
- `nowaPowtorka({id, typ, ref, temat})` — format zgodny z powtorki.js ✅
- `material(id)` zwraca dział z `cwiczenia[]` i `zadania_otwarte[]` ✅
