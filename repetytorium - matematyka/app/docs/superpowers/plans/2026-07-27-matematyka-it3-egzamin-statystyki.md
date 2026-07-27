# Matematyka It.3 — Notacja dziesiętna + Egzamin próbny + Statystyki

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Naprawić walidację kroków (przecinek dziesiętny = kropka), dodać pełną symulację egzaminu ósmoklasisty (`EgzaminProbny.jsx`: 15 zadań zamkniętych + 6 otwartych, zegar 125 min) oraz ekran statystyk (`Statystyki.jsx`: wykres wyników, postęp per dział, regularność, pokrycie).

**Architecture:** Nowa czysta logika w `core/egzamin.js` (budowa arkusza + liczenie wyniku) i `core/statystyki.js` (agregacje) — TDD, zero DOM. UI w `src/ui/pages/` konsumuje core i istniejące komponenty (`KrokZadania`, `KaTeXRenderer`, `PasekPostepu`, `WykresLiniowy` — ten ostatni już istnieje). Router stanowy w `App.jsx` rozszerzony o stany `"egzamin"` i `"statystyki"`. Wynik egzaminu zapisywany do `postepy.egzaminy[]` (pole istnieje od v4 schematu) + wpis w `postepy.sesje`.

**Tech Stack:** React 19, Vite 8, KaTeX (npm), localStorage, testy `node` + `node:assert/strict`, bez TypeScript, bez routera.

## Global Constraints

- Git root: `/Users/pibe/dev/Repetytorium-doc` — wszystkie commity stamtąd, jawne ścieżki (`git add "repetytorium - matematyka/app/..."`)
- Polski projekt (`repetytorium - j_polski/`) — **nie dotykać** (można czytać jako wzorzec)
- Klucz localStorage: `rep:postepy:{uuid}:matematyka`
- KaTeX: import z npm — **nigdy CDN**; wszystkie treści matematyczne renderować przez `KaTeXRenderer` (wzory w treści muszą mieć delimitery `$...$`)
- Format egzaminu (CKE od 2025, `reference/egzamin.md`): **15 zadań zamkniętych × 1 pkt + 6 otwartych** (punkty z pola `punkty` zadania), czas **125 minut** — zegar informacyjny, bez wymuszania końca
- `maksPkt` egzaminu liczony **dynamicznie** z arkusza (przy obecnej treści: 15 + 6×2 = 27 pkt) — nie hardcodować "30 pkt" w UI
- Testy: pliki `tests/*.test.mjs`, asercje przez `node:assert/strict` (import `assert`), uruchamiane `npm test`; **nie** używać `console.assert` (nie failuje procesu)
- CSS: wyłącznie istniejące klasy i zmienne z `theme.css` — m.in. `.opcja`, `.opcja--wybrana`, `.opcja-litera`, `.karta`, `.btn*`, `.badge--*`, `--kolor-uwaga-tlo`, `--sp-*`, `--radius-m`, `--rozmiar-l`
- Dev server: `cd "repetytorium - matematyka/app" && npm run dev` → localhost:5174 (5173 może zajmować polski)
- Wszystkie komendy `npm` uruchamiać z katalogu `repetytorium - matematyka/app`
- Definition of done it.3: `npm test` ✓ → `npm run build` ✓ → QA desktop ✓ → QA mobile (390×844) ✓ → rekord egzaminu w localStorage ✓ → konsola czysta ✓ → wpis LESSONS.md ✓ → commit ✓

---

## Mapa plików

### T1 — normalizacja przecinka dziesiętnego
- Modify: `src/core/quiz.js` (tylko `sprawdzKrok`)
- Modify: `tests/quiz.test.mjs` (konwersja na `node:assert/strict` + testy notacji)

### T2 — core/egzamin.js (TDD)
- Create: `src/core/egzamin.js`
- Create: `tests/egzamin.test.mjs`
- Modify: `package.json` (skrypt `test`)

### T3 — core/statystyki.js (TDD)
- Create: `src/core/statystyki.js`
- Create: `tests/statystyki.test.mjs`
- Modify: `package.json` (skrypt `test`)

### T4 — EgzaminProbny.jsx
- Create: `src/ui/pages/EgzaminProbny.jsx`

### T5 — Statystyki.jsx
- Create: `src/ui/pages/Statystyki.jsx`

### T6 — App.jsx router + Start.jsx + QA + docs
- Modify: `src/App.jsx`
- Modify: `src/ui/pages/Start.jsx`
- Modify: `repetytorium - matematyka/LESSONS.md`
- Modify: `repetytorium - matematyka/STAN-PROJEKTU.md`

---

## Task 1: Normalizacja przecinka dziesiętnego w `sprawdzKrok`

Finding z final review it.2: uczeń wpisze „2,5", a `oczekiwana` w JSON to „2.5" — obecne porównanie stringów odrzuca poprawną odpowiedź. Przecinek i kropka mają być równoważne po obu stronach porównania.

**Files:**
- Modify: `repetytorium - matematyka/app/src/core/quiz.js`
- Test: `repetytorium - matematyka/app/tests/quiz.test.mjs`

**Interfaces:**
- Consumes: nic nowego
- Produces: `sprawdzKrok(krok, wartosc) → boolean` — sygnatura bez zmian, zmienia się tylko semantyka (przecinek ≡ kropka). Konsumenci (`KrokZadania.jsx`) nie wymagają zmian.

- [ ] **Step 1: Przepisz `tests/quiz.test.mjs` na `node:assert/strict` i dodaj failujące testy notacji dziesiętnej**

Zastąp CAŁĄ zawartość pliku `tests/quiz.test.mjs` poniższym (dotychczasowe `console.assert` nie failowały procesu — to poprawka przy okazji; asercje 1:1 te same + nowe):

```js
import assert from "node:assert/strict";
import { sprawdzOdpowiedz, sprawdzKrok, obliczWynikDzialu } from "../src/core/quiz.js";

const pytanieZamkniete = {
  id: "tw-l1",
  typ: "zamkniete",
  opcje: ["5", "13", "1", "-5"],
  poprawna: "13",
};

const krok = {
  id: "k1",
  oczekiwana: "192",
  jednostka: "m³",
};

// sprawdzOdpowiedz
assert.equal(sprawdzOdpowiedz(pytanieZamkniete, "13"), true, "poprawna odpowiedź");
assert.equal(sprawdzOdpowiedz(pytanieZamkniete, "5"), false, "błędna odpowiedź");

// sprawdzKrok — tolerancja whitespace i jednostki
assert.equal(sprawdzKrok(krok, "192"), true, "krok poprawny");
assert.equal(sprawdzKrok(krok, " 192 "), true, "krok z whitespace");
assert.equal(sprawdzKrok(krok, "192 m³"), true, "krok z jednostką");
assert.equal(sprawdzKrok(krok, "193"), false, "krok błędny");

// sprawdzKrok — notacja dziesiętna: przecinek i kropka równoważne (it.3 T1)
const krokDziesietny = { id: "k2", oczekiwana: "2.5" };
assert.equal(sprawdzKrok(krokDziesietny, "2,5"), true, "przecinek ucznia vs kropka oczekiwana");
assert.equal(sprawdzKrok(krokDziesietny, "2.5"), true, "kropka ucznia vs kropka oczekiwana");
assert.equal(sprawdzKrok({ id: "k3", oczekiwana: "2,5" }, "2.5"), true, "kropka ucznia vs przecinek oczekiwany");
assert.equal(sprawdzKrok(krokDziesietny, "2,6"), false, "błędna wartość z przecinkiem");
assert.equal(sprawdzKrok({ id: "k4", oczekiwana: "0.75", jednostka: "kg" }, "0,75 kg"), true, "przecinek + jednostka");

// obliczWynikDzialu
const pytania = [pytanieZamkniete, { ...pytanieZamkniete, id: "tw-l2", poprawna: "5" }];
const odpowiedzi = { "tw-l1": "13", "tw-l2": "1" };
const wynik = obliczWynikDzialu(pytania, odpowiedzi);
assert.equal(wynik.poprawne, 1);
assert.equal(wynik.wszystkich, 2);
assert.equal(wynik.procent, 50);

console.log("quiz.test.mjs — OK");
```

- [ ] **Step 2: Uruchom test — ma failować**

Run: `cd "repetytorium - matematyka/app" && npm test`
Expected: FAIL — `AssertionError` na asercji "przecinek ucznia vs kropka oczekiwana" (exit code ≠ 0)

- [ ] **Step 3: Zaimplementuj normalizację w `sprawdzKrok`**

W `src/core/quiz.js` zastąp funkcję `sprawdzKrok`:

```js
export function sprawdzKrok(krok, wartosc) {
  // Przecinek dziesiętny ≡ kropka („2,5" = „2.5") — normalizujemy obie strony.
  const norm = (s) => String(s).trim().replace(",", ".");
  const oczyszczona = norm(String(wartosc).replace(krok.jednostka ?? "", ""));
  return oczyszczona === norm(krok.oczekiwana);
}
```

Pozostałe funkcje (`sprawdzOdpowiedz`, `obliczWynikDzialu`) bez zmian.

- [ ] **Step 4: Uruchom testy — mają przejść**

Run: `cd "repetytorium - matematyka/app" && npm test`
Expected: `quiz.test.mjs — OK`, exit code 0

- [ ] **Step 5: Build sanity check**

Run: `cd "repetytorium - matematyka/app" && npm run build`
Expected: build bez błędów

- [ ] **Step 6: Commit**

```bash
cd /Users/pibe/dev/Repetytorium-doc
git add "repetytorium - matematyka/app/src/core/quiz.js" "repetytorium - matematyka/app/tests/quiz.test.mjs"
git commit -m "fix(mat): sprawdzKrok akceptuje przecinek dziesiętny + testy node:assert (it.3 T1)"
```

---

## Task 2: `core/egzamin.js` — budowa arkusza i liczenie wyniku (TDD)

Czysta logika egzaminu próbnego: losowanie arkusza z puli działów (każdy dział reprezentowany w części zamkniętej) i liczenie wyniku z rozbiciem per dział. Losowość wstrzykiwana parametrem `losuj` dla testów deterministycznych.

**Files:**
- Create: `repetytorium - matematyka/app/src/core/egzamin.js`
- Create: `repetytorium - matematyka/app/tests/egzamin.test.mjs`
- Modify: `repetytorium - matematyka/app/package.json`

**Interfaces:**
- Consumes: `sprawdzOdpowiedz(pytanie, odpowiedz)` z `./quiz.js`; strukturę działu z JSON: `{ id, cwiczenia: [{id, tresc, opcje, poprawna, ...}], zadania_otwarte: [{id, tresc, punkty, kroki: [{id, oczekiwana, ...}], ...}] }`
- Produces (używane w T4 przez `EgzaminProbny.jsx`):
  - `CZAS_EGZAMINU_MIN = 125`, `LICZBA_ZAMKNIETYCH = 15`, `LICZBA_OTWARTYCH = 6`
  - `zbudujArkusz(dzialy, losuj?) → { zamkniete: Pytanie[], otwarte: Zadanie[] }` — `dzialy` to mapa `DZIALY` z rejestr.js; każdy element arkusza ma dopisane pole `dzialId`
  - `punktyZadaniaOtwartego(zadanie, poprawneKroki) → number`
  - `policzWynikEgzaminu(arkusz, odpowiedziZamkniete, poprawneKrokiPerZadanie) → { pktZamkniete, maksZamkniete, pktOtwarte, maksOtwarte, wynikPkt, maksPkt, procent, perDzial }` gdzie `odpowiedziZamkniete = {pytanieId: wybranaOpcja}`, `poprawneKrokiPerZadanie = {zadanieId: liczbaPoprawnychKrokow}`, `perDzial = {dzialId: {pkt, maks}}`

- [ ] **Step 1: Napisz failujący test `tests/egzamin.test.mjs`**

```js
import assert from "node:assert/strict";
import {
  CZAS_EGZAMINU_MIN,
  LICZBA_ZAMKNIETYCH,
  LICZBA_OTWARTYCH,
  tasuj,
  zbudujArkusz,
  punktyZadaniaOtwartego,
  policzWynikEgzaminu,
} from "../src/core/egzamin.js";

// Deterministyczny generator pseudolosowy (LCG) zamiast Math.random
function lcg(seed = 42) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

// Pula testowa jak realny rejestr: 9 działów × (3 zamknięte + 1 otwarte à 2 pkt, 2 kroki)
const dzialy = {};
for (let i = 1; i <= 9; i++) {
  const id = `d${i}`;
  dzialy[id] = {
    id,
    cwiczenia: [1, 2, 3].map((n) => ({
      id: `${id}-c${n}`,
      typ: "zamkniete",
      opcje: ["a", "b"],
      poprawna: "a",
    })),
    zadania_otwarte: [
      { id: `${id}-o1`, punkty: 2, kroki: [{ id: "k1", oczekiwana: "1" }, { id: "k2", oczekiwana: "2" }] },
    ],
  };
}

assert.equal(CZAS_EGZAMINU_MIN, 125);
assert.equal(LICZBA_ZAMKNIETYCH, 15);
assert.equal(LICZBA_OTWARTYCH, 6);

// tasuj — permutacja bez utraty elementów, oryginał nietknięty
const wejscie = [1, 2, 3, 4, 5];
const po = tasuj(wejscie, lcg());
assert.equal(po.length, 5);
assert.deepEqual([...po].sort(), [1, 2, 3, 4, 5]);
assert.deepEqual(wejscie, [1, 2, 3, 4, 5], "tasuj nie mutuje wejścia");

// zbudujArkusz — rozmiary, reprezentacja działów, brak duplikatów, dzialId dopisany
const arkusz = zbudujArkusz(dzialy, lcg());
assert.equal(arkusz.zamkniete.length, LICZBA_ZAMKNIETYCH);
assert.equal(arkusz.otwarte.length, LICZBA_OTWARTYCH);
assert.equal(new Set(arkusz.zamkniete.map((p) => p.dzialId)).size, 9, "każdy dział ≥1 raz w zamkniętych");
const idZamknietych = arkusz.zamkniete.map((p) => p.id);
assert.equal(new Set(idZamknietych).size, idZamknietych.length, "zamknięte bez duplikatów");
assert.equal(new Set(arkusz.otwarte.map((z) => z.id)).size, LICZBA_OTWARTYCH, "otwarte bez duplikatów");
assert.ok(arkusz.zamkniete.every((p) => p.dzialId && p.opcje), "zamknięte mają dzialId i opcje");
assert.ok(arkusz.otwarte.every((z) => z.dzialId && z.kroki), "otwarte mają dzialId i kroki");

// ten sam seed → ten sam arkusz (determinizm dla wstrzykniętego losuj)
assert.deepEqual(
  zbudujArkusz(dzialy, lcg(7)).zamkniete.map((p) => p.id),
  zbudujArkusz(dzialy, lcg(7)).zamkniete.map((p) => p.id)
);

// punktyZadaniaOtwartego — proporcja poprawnych kroków × punkty
const zadanie = { punkty: 2, kroki: [{}, {}] };
assert.equal(punktyZadaniaOtwartego(zadanie, 2), 2);
assert.equal(punktyZadaniaOtwartego(zadanie, 1), 1);
assert.equal(punktyZadaniaOtwartego(zadanie, 0), 0);

// policzWynikEgzaminu — wszystkie zamknięte dobrze, otwarte w połowie kroków
const odpowiedzi = Object.fromEntries(arkusz.zamkniete.map((p) => [p.id, "a"]));
const kroki = Object.fromEntries(arkusz.otwarte.map((z) => [z.id, 1])); // 1 z 2 kroków
const wynik = policzWynikEgzaminu(arkusz, odpowiedzi, kroki);
assert.equal(wynik.pktZamkniete, 15);
assert.equal(wynik.maksZamkniete, 15);
assert.equal(wynik.pktOtwarte, 6, "6 zadań × 1 pkt (połowa z 2)");
assert.equal(wynik.maksOtwarte, 12, "6 zadań × 2 pkt");
assert.equal(wynik.wynikPkt, 21);
assert.equal(wynik.maksPkt, 27);
assert.equal(wynik.procent, 78);

// perDzial sumuje się do całości
assert.equal(Object.values(wynik.perDzial).reduce((a, d) => a + d.pkt, 0), wynik.wynikPkt);
assert.equal(Object.values(wynik.perDzial).reduce((a, d) => a + d.maks, 0), wynik.maksPkt);

// brak odpowiedzi = 0 pkt, bez wyjątków
const zero = policzWynikEgzaminu(arkusz, {}, {});
assert.equal(zero.wynikPkt, 0);
assert.equal(zero.procent, 0);

console.log("egzamin.test.mjs — OK");
```

- [ ] **Step 2: Zaktualizuj skrypt `test` w `package.json`**

W `package.json` zmień:

```json
"test": "node tests/quiz.test.mjs && node tests/egzamin.test.mjs"
```

- [ ] **Step 3: Uruchom test — ma failować**

Run: `cd "repetytorium - matematyka/app" && npm test`
Expected: FAIL — `Cannot find module .../src/core/egzamin.js` (exit code ≠ 0)

- [ ] **Step 4: Zaimplementuj `src/core/egzamin.js`**

```js
/**
 * Egzamin próbny — czysta logika budowy arkusza i liczenia wyniku, zero DOM.
 * Format CKE od 2025: 15 zadań zamkniętych ×1 pkt + 6 otwartych (pkt z zadania), 125 min.
 * Losowość wstrzykiwana parametrem `losuj` — testy podają generator deterministyczny.
 */
import { sprawdzOdpowiedz } from "./quiz.js";

export const CZAS_EGZAMINU_MIN = 125;
export const LICZBA_ZAMKNIETYCH = 15;
export const LICZBA_OTWARTYCH = 6;

/** Fisher-Yates na kopii — nie mutuje wejścia. */
export function tasuj(tablica, losuj = Math.random) {
  const kopia = [...tablica];
  for (let i = kopia.length - 1; i > 0; i--) {
    const j = Math.floor(losuj() * (i + 1));
    [kopia[i], kopia[j]] = [kopia[j], kopia[i]];
  }
  return kopia;
}

/**
 * Buduje arkusz z mapy działów (DZIALY z rejestr.js).
 * Zamknięte: najpierw po 1 z każdego działu (reprezentacja), potem losowe dopełnienie do 15.
 * Otwarte: losowe 6 z całej puli. Każdy element dostaje pole `dzialId`.
 */
export function zbudujArkusz(dzialy, losuj = Math.random) {
  const lista = tasuj(Object.values(dzialy), losuj);

  const poJednym = [];
  const reszta = [];
  for (const d of lista) {
    const cwiczenia = tasuj(d.cwiczenia, losuj).map((p) => ({ ...p, dzialId: d.id }));
    if (cwiczenia.length > 0) poJednym.push(cwiczenia[0]);
    reszta.push(...cwiczenia.slice(1));
  }
  const dopelnienie = tasuj(reszta, losuj).slice(0, Math.max(0, LICZBA_ZAMKNIETYCH - poJednym.length));
  const zamkniete = tasuj([...poJednym.slice(0, LICZBA_ZAMKNIETYCH), ...dopelnienie], losuj);

  const pulaOtwartych = lista.flatMap((d) => d.zadania_otwarte.map((z) => ({ ...z, dzialId: d.id })));
  const otwarte = tasuj(pulaOtwartych, losuj).slice(0, LICZBA_OTWARTYCH);

  return { zamkniete, otwarte };
}

/** Punkty za zadanie otwarte: proporcja poprawnych kroków × punkty zadania (zaokrąglenie). */
export function punktyZadaniaOtwartego(zadanie, poprawneKroki) {
  if (zadanie.kroki.length === 0) return 0;
  const maks = zadanie.punkty ?? zadanie.kroki.length;
  return Math.round((poprawneKroki / zadanie.kroki.length) * maks);
}

/**
 * Liczy wynik egzaminu z rozbiciem per dział.
 * @param {{zamkniete: Array, otwarte: Array}} arkusz — z zbudujArkusz
 * @param {object} odpowiedziZamkniete — {pytanieId: wybranaOpcja}
 * @param {object} poprawneKrokiPerZadanie — {zadanieId: liczbaPoprawnychKrokow}
 */
export function policzWynikEgzaminu(arkusz, odpowiedziZamkniete, poprawneKrokiPerZadanie) {
  const perDzial = {};
  const dodaj = (dzialId, pkt, maks) => {
    perDzial[dzialId] ??= { pkt: 0, maks: 0 };
    perDzial[dzialId].pkt += pkt;
    perDzial[dzialId].maks += maks;
  };

  let pktZamkniete = 0;
  for (const p of arkusz.zamkniete) {
    const pkt = sprawdzOdpowiedz(p, odpowiedziZamkniete[p.id]) ? 1 : 0;
    pktZamkniete += pkt;
    dodaj(p.dzialId, pkt, 1);
  }

  let pktOtwarte = 0;
  let maksOtwarte = 0;
  for (const z of arkusz.otwarte) {
    const maks = z.punkty ?? z.kroki.length;
    const pkt = punktyZadaniaOtwartego(z, poprawneKrokiPerZadanie[z.id] ?? 0);
    pktOtwarte += pkt;
    maksOtwarte += maks;
    dodaj(z.dzialId, pkt, maks);
  }

  const wynikPkt = pktZamkniete + pktOtwarte;
  const maksPkt = arkusz.zamkniete.length + maksOtwarte;
  return {
    pktZamkniete,
    maksZamkniete: arkusz.zamkniete.length,
    pktOtwarte,
    maksOtwarte,
    wynikPkt,
    maksPkt,
    procent: maksPkt === 0 ? 0 : Math.round((100 * wynikPkt) / maksPkt),
    perDzial,
  };
}
```

- [ ] **Step 5: Uruchom testy — mają przejść**

Run: `cd "repetytorium - matematyka/app" && npm test`
Expected: `quiz.test.mjs — OK` i `egzamin.test.mjs — OK`, exit code 0

- [ ] **Step 6: Commit**

```bash
cd /Users/pibe/dev/Repetytorium-doc
git add "repetytorium - matematyka/app/src/core/egzamin.js" "repetytorium - matematyka/app/tests/egzamin.test.mjs" "repetytorium - matematyka/app/package.json"
git commit -m "feat(mat): core/egzamin.js — arkusz 15+6 i wynik egzaminu, TDD (it.3 T2)"
```

---

## Task 3: `core/statystyki.js` — agregacje statystyk (TDD)

Czysta logika agregacji dla ekranu Statystyki — adaptacja `core/statystyki.js` z polskiego projektu do struktur matematyki (sesje typu `dzial`/`egzamin`/`diagnoza`, postępy w `postepy.dzialy`, egzaminy w `postepy.egzaminy`). Zero DOM, zero importów treści — etykiety i kolejność działów podaje UI argumentami.

**Files:**
- Create: `repetytorium - matematyka/app/src/core/statystyki.js`
- Create: `repetytorium - matematyka/app/tests/statystyki.test.mjs`
- Modify: `repetytorium - matematyka/app/package.json`

**Interfaces:**
- Consumes: strukturę `postepy` z `core/profil.js`: `{ diagnoza: {dzialId: ratio 0-1} | null, dzialy: {dzialId: {ukonczone, wynik, data}}, sesje: [{typ, data, ...}], egzaminy: [{data, wynikPkt, maksPkt, procent, perDzial}] }`
- Produces (używane w T5 przez `Statystyki.jsx`):
  - `seriaWynikow(postepy, mapaEtykiet?) → [{data, procent, typ, etykieta}]` — chronologicznie; `typ` ∈ `"diagnoza"|"dzial"|"egzamin"` (kompatybilne z `WykresLiniowy`, który wyróżnia `typ === "egzamin"`)
  - `postepPerDzial(postepy, kolejnosc) → {dzialId: {diagnoza, teraz, delta}}` — wartości w % (0-100); `kolejnosc` to tablica dzialId
  - `aktywnosc(postepy, dzis?) → { tygodnie: [{od, liczba}] (8 szt.), seriaDni: number }`
  - `pokrycie(postepy, liczbaDzialow) → { dzialy: {zrobione, wszystkie}, egzaminy: number }`

- [ ] **Step 1: Napisz failujący test `tests/statystyki.test.mjs`**

```js
import assert from "node:assert/strict";
import { seriaWynikow, postepPerDzial, aktywnosc, pokrycie } from "../src/core/statystyki.js";

const postepy = {
  diagnoza: { liczby: 0.5, ulamki: 0.7 },
  dzialy: { liczby: { ukonczone: true, wynik: 0.9, data: "2026-07-25" } },
  egzaminy: [
    {
      data: "2026-07-26T10:00:00.000Z",
      wynikPkt: 21,
      maksPkt: 27,
      procent: 78,
      perDzial: { ulamki: { pkt: 1, maks: 2 }, potegi: { pkt: 2, maks: 3 } },
    },
  ],
  sesje: [
    { typ: "diagnoza", data: "2026-07-20T10:00:00.000Z" },
    { typ: "dzial", data: "2026-07-25T10:00:00.000Z", dzialId: "liczby", wynik: 0.9 },
    { typ: "powtorka", data: "2026-07-25T18:00:00.000Z" },
    { typ: "egzamin", data: "2026-07-26T10:00:00.000Z", wynikPkt: 21, maksPkt: 27 },
  ],
};

// seriaWynikow — 3 punkty (powtórka pominięta — inna skala), chronologicznie
const seria = seriaWynikow(postepy, { liczby: "Liczby i działania" });
assert.equal(seria.length, 3);
assert.deepEqual(seria.map((p) => p.typ), ["diagnoza", "dzial", "egzamin"]);
assert.equal(seria[0].procent, 60, "diagnoza = średnia ratio (0.5, 0.7)");
assert.equal(seria[0].etykieta, "Test wstępny");
assert.equal(seria[1].procent, 90);
assert.equal(seria[1].etykieta, "Dział: Liczby i działania");
assert.equal(seria[2].procent, 78);
assert.equal(seria[2].etykieta, "Egzamin próbny");

// seriaWynikow — brak etykiety w mapie → fallback na dzialId
assert.equal(seriaWynikow(postepy)[1].etykieta, "Dział: liczby");

// postepPerDzial — priorytet źródeł: dział (quiz) > ostatni egzamin > diagnoza
const dzialy = postepPerDzial(postepy, ["liczby", "ulamki", "potegi", "procenty"]);
assert.deepEqual(dzialy.liczby, { diagnoza: 50, teraz: 90, delta: 40 });
assert.deepEqual(dzialy.ulamki, { diagnoza: 70, teraz: 50, delta: -20 });
assert.deepEqual(dzialy.potegi, { diagnoza: 0, teraz: 67, delta: 67 });
assert.deepEqual(dzialy.procenty, { diagnoza: 0, teraz: 0, delta: 0 });

// aktywnosc — deterministyczne "dzis" (2026-07-26 to niedziela)
const { tygodnie, seriaDni } = aktywnosc(postepy, new Date("2026-07-26T12:00:00.000Z"));
assert.equal(tygodnie.length, 8);
assert.equal(seriaDni, 2, "sesje 25.07 i 26.07 → seria 2 dni");
assert.equal(tygodnie.reduce((a, t) => a + t.liczba, 0), 4, "wszystkie 4 sesje w oknie 8 tygodni");
assert.equal(tygodnie[7].liczba, 4, "bieżący tydzień (pn 20.07 – nd 26.07) ma 4 sesje");

// pokrycie
const pok = pokrycie(postepy, 9);
assert.deepEqual(pok.dzialy, { zrobione: 1, wszystkie: 9 });
assert.equal(pok.egzaminy, 1);

// puste postepy — bez wyjątków
const puste = { diagnoza: null, dzialy: {}, sesje: [], egzaminy: [] };
assert.deepEqual(seriaWynikow(puste), []);
assert.deepEqual(pokrycie(puste, 9).dzialy, { zrobione: 0, wszystkie: 9 });
assert.equal(aktywnosc(puste, new Date("2026-07-26T12:00:00.000Z")).seriaDni, 0);

console.log("statystyki.test.mjs — OK");
```

- [ ] **Step 2: Zaktualizuj skrypt `test` w `package.json`**

```json
"test": "node tests/quiz.test.mjs && node tests/egzamin.test.mjs && node tests/statystyki.test.mjs"
```

- [ ] **Step 3: Uruchom test — ma failować**

Run: `cd "repetytorium - matematyka/app" && npm test`
Expected: FAIL — `Cannot find module .../src/core/statystyki.js`

- [ ] **Step 4: Zaimplementuj `src/core/statystyki.js`**

```js
/**
 * Statystyki postępu — czysta logika agregacji, zero DOM/importów treści.
 * Etykiety i kolejność działów buduje UI z rejestru i podaje argumentami.
 * (Adaptacja core/statystyki.js z repetytorium-polski do struktur matematyki.)
 */

/** Chronologiczna seria procentowych wyników sesji (diagnoza, działy, egzaminy; bez powtórek — inna skala). */
export function seriaWynikow(postepy, mapaEtykiet = {}) {
  const punkty = [];
  for (const s of postepy.sesje ?? []) {
    if (s.typ === "diagnoza" && postepy.diagnoza) {
      const ratio = Object.values(postepy.diagnoza);
      if (ratio.length > 0) {
        punkty.push({
          data: s.data,
          procent: Math.round((100 * ratio.reduce((a, b) => a + b, 0)) / ratio.length),
          typ: "diagnoza",
          etykieta: "Test wstępny",
        });
      }
    }
    if (s.typ === "dzial" && typeof s.wynik === "number") {
      punkty.push({
        data: s.data,
        procent: Math.round(s.wynik * 100),
        typ: "dzial",
        etykieta: `Dział: ${mapaEtykiet[s.dzialId] ?? s.dzialId}`,
      });
    }
    if (s.typ === "egzamin" && s.maksPkt > 0) {
      punkty.push({
        data: s.data,
        procent: Math.round((100 * s.wynikPkt) / s.maksPkt),
        typ: "egzamin",
        etykieta: "Egzamin próbny",
      });
    }
  }
  return punkty.sort((a, b) => a.data.localeCompare(b.data));
}

/**
 * Postęp per dział: % z diagnozy vs "teraz".
 * "Teraz" = wynik quizu działu, a gdy brak — wynik działu z ostatniego egzaminu,
 * a gdy brak — diagnoza (bez nowych danych delta = 0).
 * @param {string[]} kolejnosc — lista dzialId (z rejestru, buduje UI)
 */
export function postepPerDzial(postepy, kolejnosc) {
  const egzaminy = postepy.egzaminy ?? [];
  const ostatniEgzamin = egzaminy[egzaminy.length - 1];
  return Object.fromEntries(
    kolejnosc.map((id) => {
      const diagnoza = Math.round((postepy.diagnoza?.[id] ?? 0) * 100);
      const zDzialu = postepy.dzialy?.[id]?.wynik;
      const zEgzaminu = ostatniEgzamin?.perDzial?.[id];
      const teraz =
        typeof zDzialu === "number" ? Math.round(zDzialu * 100)
        : zEgzaminu?.maks ? Math.round((100 * zEgzaminu.pkt) / zEgzaminu.maks)
        : diagnoza;
      return [id, { diagnoza, teraz, delta: teraz - diagnoza }];
    })
  );
}

const dzienISO = (d) => d.toISOString().slice(0, 10);

/** Regularność: sesje per tydzień (8 ostatnich, pn-nd) + seria dni z rzędu. */
export function aktywnosc(postepy, dzis = new Date()) {
  const sesje = postepy.sesje ?? [];
  const dniZSesja = new Set(sesje.map((x) => x.data.slice(0, 10)));

  const kursor = new Date(dzis);
  if (!dniZSesja.has(dzienISO(kursor))) kursor.setUTCDate(kursor.getUTCDate() - 1);
  let seriaDni = 0;
  while (dniZSesja.has(dzienISO(kursor))) {
    seriaDni++;
    kursor.setUTCDate(kursor.getUTCDate() - 1);
  }

  const poniedzialek = new Date(dzis);
  poniedzialek.setUTCDate(poniedzialek.getUTCDate() - ((poniedzialek.getUTCDay() + 6) % 7));
  const tygodnie = [];
  for (let i = 7; i >= 0; i--) {
    const od = new Date(poniedzialek);
    od.setUTCDate(od.getUTCDate() - 7 * i);
    const koniec = new Date(od);
    koniec.setUTCDate(koniec.getUTCDate() + 6);
    const [odISO, koniecISO] = [dzienISO(od), dzienISO(koniec)];
    tygodnie.push({
      od: odISO,
      liczba: sesje.filter((x) => {
        const d = x.data.slice(0, 10);
        return d >= odISO && d <= koniecISO;
      }).length,
    });
  }
  return { tygodnie, seriaDni };
}

/** Pokrycie materiału: ukończone działy X z Y + liczba egzaminów próbnych. */
export function pokrycie(postepy, liczbaDzialow) {
  const ukonczone = Object.values(postepy.dzialy ?? {}).filter((s) => s.ukonczone).length;
  return {
    dzialy: { zrobione: ukonczone, wszystkie: liczbaDzialow },
    egzaminy: (postepy.egzaminy ?? []).length,
  };
}
```

- [ ] **Step 5: Uruchom testy — mają przejść**

Run: `cd "repetytorium - matematyka/app" && npm test`
Expected: trzy linie `... — OK`, exit code 0

- [ ] **Step 6: Commit**

```bash
cd /Users/pibe/dev/Repetytorium-doc
git add "repetytorium - matematyka/app/src/core/statystyki.js" "repetytorium - matematyka/app/tests/statystyki.test.mjs" "repetytorium - matematyka/app/package.json"
git commit -m "feat(mat): core/statystyki.js — agregacje statystyk, TDD (it.3 T3)"
```

---

## Task 4: `EgzaminProbny.jsx` — symulacja arkusza

Ekran egzaminu: intro → 15 zadań zamkniętych sekwencyjnie (BEZ feedbacku — tylko zaznaczanie, jak na egzaminie; Wstecz/Dalej) → 6 zadań otwartych (kroki przez `KrokZadania`, jak w działach) → ekran wyniku z rozbiciem per dział. Zegar 125 min informacyjny.

**Files:**
- Create: `repetytorium - matematyka/app/src/ui/pages/EgzaminProbny.jsx`

**Interfaces:**
- Consumes: `CZAS_EGZAMINU_MIN`, `zbudujArkusz(dzialy)`, `policzWynikEgzaminu(arkusz, odpowiedzi, poprawneKroki)` z `core/egzamin.js` (T2); `DZIALY` z `content/matematyka/rejestr.js`; komponenty `KaTeXRenderer` (prop `tekst`), `KrokZadania` (props `{krok, numerKroku, onPoprawnie, onBlad}`), `PasekPostepu` (props `{procent, etykietaLewa, etykietaPrawa, wariant}`)
- Produces: `EgzaminProbny({ onZakoncz, onWroc })` — `onZakoncz(wynik)` wywoływany RAZ po ostatnim zadaniu otwartym z pełnym obiektem wyniku z `policzWynikEgzaminu` (App zapisuje postępy; ekran zostaje na widoku wyniku, powrót przez `onWroc`)

- [ ] **Step 1: Utwórz `src/ui/pages/EgzaminProbny.jsx`**

```jsx
import { useEffect, useMemo, useState } from "react";
import { DZIALY } from "../../content/matematyka/rejestr.js";
import { CZAS_EGZAMINU_MIN, zbudujArkusz, policzWynikEgzaminu } from "../../core/egzamin.js";
import KaTeXRenderer from "../components/KaTeXRenderer.jsx";
import KrokZadania from "../components/KrokZadania.jsx";
import PasekPostepu from "../components/PasekPostepu.jsx";

const LITERY = ["A", "B", "C", "D"];

/** Zegar egzaminu: informacyjny, bez wymuszania końca (bursztyn <15 min). */
function Zegar({ start }) {
  const [teraz, setTeraz] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setTeraz(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const zostalo = CZAS_EGZAMINU_MIN * 60000 - (teraz - start);
  if (zostalo <= 0) {
    return (
      <p className="tekst-maly" role="status" style={{
        margin: "0 0 var(--sp-3)", padding: "var(--sp-2) var(--sp-3)",
        background: "var(--kolor-uwaga-tlo)", borderRadius: "var(--radius-m)",
      }}>
        ⏱ Czas minął — na prawdziwym egzaminie tu byłby koniec. Dokończ spokojnie, ale zapamiętaj to tempo.
      </p>
    );
  }
  const sek = Math.floor(zostalo / 1000);
  const malo = zostalo < 15 * 60000;
  const format = `${Math.floor(sek / 3600)}:${String(Math.floor((sek % 3600) / 60)).padStart(2, "0")}:${String(sek % 60).padStart(2, "0")}`;
  return (
    <p className="tekst-2 tekst-maly" role="timer" style={{
      margin: "0 0 var(--sp-3)",
      ...(malo ? { color: "var(--kolor-uwaga)", fontWeight: 600 } : {}),
    }}>
      ⏱ Pozostało: {format}{malo ? " — końcówka, sprawdź czy nic nie pominęłaś" : ""}
    </p>
  );
}

/** Jedno zadanie otwarte w egzaminie: kroki sekwencyjnie, na końcu onGotowe(liczbaPoprawnychKrokow). */
function ZadanieEgzaminu({ zadanie, onGotowe }) {
  const [aktualnyKrok, setAktualnyKrok] = useState(0);
  const [poprawne, setPoprawne] = useState(0);
  const kroki = zadanie.kroki;

  function dalej(nowePoprawne) {
    if (aktualnyKrok < kroki.length - 1) setAktualnyKrok(aktualnyKrok + 1);
    else onGotowe(nowePoprawne);
  }

  return (
    <>
      <div className="karta" style={{ marginBottom: "var(--sp-4)" }}>
        <p style={{ fontWeight: 500, margin: 0 }}>
          <KaTeXRenderer tekst={zadanie.tresc} />
        </p>
      </div>
      {kroki.slice(0, aktualnyKrok + 1).map((krok, i) => (
        <KrokZadania
          key={krok.id}
          krok={krok}
          numerKroku={i + 1}
          onPoprawnie={i === aktualnyKrok ? () => { const n = poprawne + 1; setPoprawne(n); dalej(n); } : () => {}}
          onBlad={i === aktualnyKrok ? () => dalej(poprawne) : () => {}}
        />
      ))}
    </>
  );
}

/**
 * Egzamin próbny — symulacja arkusza CKE (format od 2025):
 * 15 zadań zamkniętych (bez feedbacku) + 6 otwartych (kroki), zegar 125 min informacyjny.
 */
export default function EgzaminProbny({ onZakoncz, onWroc }) {
  const arkusz = useMemo(() => zbudujArkusz(DZIALY), []);
  // etap: "intro" | "zamkniete" | "otwarte" | "wynik"; indeks — pozycja w bieżącym etapie
  const [etap, setEtap] = useState("intro");
  const [indeks, setIndeks] = useState(0);
  const [start, setStart] = useState(null);
  const [odpowiedzi, setOdpowiedzi] = useState({});
  const [poprawneKroki, setPoprawneKroki] = useState({});
  const [wynik, setWynik] = useState(null);

  const razem = arkusz.zamkniete.length + arkusz.otwarte.length;

  function zakonczZadanieOtwarte(zadanieId, liczba) {
    const nowe = { ...poprawneKroki, [zadanieId]: liczba };
    setPoprawneKroki(nowe);
    if (indeks < arkusz.otwarte.length - 1) {
      setIndeks(indeks + 1);
    } else {
      const w = policzWynikEgzaminu(arkusz, odpowiedzi, nowe);
      setWynik(w);
      onZakoncz(w);
      setEtap("wynik");
    }
  }

  if (etap === "intro") {
    return (
      <div className="tresc ekran-wjazd" style={{ maxWidth: 560 }}>
        <h1>Egzamin próbny</h1>
        <div className="karta" style={{ display: "grid", gap: "var(--sp-4)" }}>
          <p style={{ margin: 0 }}>
            Pełna symulacja egzaminu ósmoklasisty z matematyki:{" "}
            <strong>{arkusz.zamkniete.length} zadań zamkniętych</strong> +{" "}
            <strong>{arkusz.otwarte.length} otwartych</strong> ze wszystkich działów.
          </p>
          <ul className="tekst-2" style={{ margin: 0, paddingLeft: "1.2em", display: "grid", gap: "var(--sp-1)" }}>
            <li>Masz <strong>{CZAS_EGZAMINU_MIN} minut</strong> — zegar jest informacyjny, nikt Cię nie wyrzuci po czasie.</li>
            <li>W części zamkniętej nie zobaczysz odpowiedzi w trakcie — wynik na końcu, jak na egzaminie.</li>
            <li>Zadania otwarte rozwiązujesz krok po kroku, jak w działach.</li>
            <li>Bez kalkulatora — na egzaminie wolno mieć tylko linijkę.</li>
          </ul>
          <button className="btn btn-primary btn--pelny" onClick={() => { setStart(Date.now()); setEtap("zamkniete"); }}>
            Zaczynam egzamin
          </button>
          <button className="btn btn-ghost btn--pelny" onClick={onWroc}>Jednak później</button>
        </div>
      </div>
    );
  }

  if (etap === "zamkniete") {
    const pytanie = arkusz.zamkniete[indeks];
    const odp = odpowiedzi[pytanie.id] ?? null;
    return (
      <div className="tresc ekran-wjazd" key={pytanie.id}>
        <Zegar start={start} />
        <PasekPostepu
          procent={((indeks + 1) / razem) * 100}
          etykietaLewa={`Zadanie ${indeks + 1} z ${arkusz.zamkniete.length}`}
          etykietaPrawa={`+ ${arkusz.otwarte.length} otwartych`}
        />
        <div className="karta" style={{ marginTop: "var(--sp-4)" }}>
          <p className="tekst-2 tekst-maly" style={{ margin: "0 0 var(--sp-2)" }}>
            {DZIALY[pytanie.dzialId]?.tytul ?? pytanie.dzialId}
          </p>
          <p style={{ fontWeight: 500, fontSize: "var(--rozmiar-l)", marginBottom: "var(--sp-3)" }}>
            <KaTeXRenderer tekst={pytanie.tresc} />
          </p>
          <div style={{ display: "grid", gap: "var(--sp-2)" }}>
            {pytanie.opcje.map((opcja, i) => (
              <button
                key={opcja}
                className={`opcja${odp === opcja ? " opcja--wybrana" : ""}`}
                onClick={() => setOdpowiedzi({ ...odpowiedzi, [pytanie.id]: opcja })}
                aria-pressed={odp === opcja}
              >
                <span className="opcja-litera" aria-hidden="true">{LITERY[i]}</span>
                <span><KaTeXRenderer tekst={opcja} /></span>
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: "var(--sp-2)", marginTop: "var(--sp-4)" }}>
            {indeks > 0 && (
              <button className="btn" onClick={() => setIndeks(indeks - 1)}>Wstecz</button>
            )}
            <button
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={odp === null}
              onClick={() => {
                if (indeks + 1 < arkusz.zamkniete.length) setIndeks(indeks + 1);
                else { setIndeks(0); setEtap("otwarte"); }
              }}
            >
              {indeks + 1 < arkusz.zamkniete.length ? "Dalej" : "Część 2: zadania otwarte"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (etap === "otwarte") {
    const zadanie = arkusz.otwarte[indeks];
    return (
      <div className="tresc ekran-wjazd" key={zadanie.id}>
        <Zegar start={start} />
        <PasekPostepu
          procent={((arkusz.zamkniete.length + indeks + 1) / razem) * 100}
          etykietaLewa={`Zadanie otwarte ${indeks + 1} z ${arkusz.otwarte.length}`}
          etykietaPrawa={`${zadanie.punkty ?? zadanie.kroki.length} pkt`}
        />
        <p className="tekst-2 tekst-maly" style={{ margin: "var(--sp-3) 0 var(--sp-2)" }}>
          {DZIALY[zadanie.dzialId]?.tytul ?? zadanie.dzialId}
        </p>
        <ZadanieEgzaminu zadanie={zadanie} onGotowe={(n) => zakonczZadanieOtwarte(zadanie.id, n)} />
      </div>
    );
  }

  if (etap === "wynik") {
    const dobrze = wynik.procent >= 80;
    return (
      <div className="tresc ekran-wjazd">
        <div className="tekst-srodek celebracja" style={{ fontSize: 48, marginBottom: "var(--sp-2)" }} aria-hidden="true">
          {dobrze ? "🎉" : "🌱"}
        </div>
        <h1 className="tekst-srodek">Egzamin próbny za Tobą!</h1>

        <section className="karta" style={{ display: "grid", gap: "var(--sp-4)" }}>
          <PasekPostepu
            procent={wynik.procent}
            etykietaLewa={`${wynik.wynikPkt}/${wynik.maksPkt} pkt`}
            etykietaPrawa={`${wynik.procent}%`}
            wariant={dobrze ? "sukces" : ""}
          />
          <p className="tekst-2" style={{ margin: 0 }}>
            Zamknięte: <strong>{wynik.pktZamkniete}/{wynik.maksZamkniete} pkt</strong> ·
            Otwarte: <strong>{wynik.pktOtwarte}/{wynik.maksOtwarte} pkt</strong>
          </p>
          <p className="tekst-2" style={{ margin: 0 }}>
            {dobrze
              ? "Taki wynik w maju to bardzo mocna pozycja. Tak trzymaj!"
              : "Egzamin próbny to mapa — wiesz już, które działy powtórzyć przed następnym podejściem."}
          </p>
        </section>

        <section className="karta" style={{ marginTop: "var(--sp-4)", display: "grid", gap: "var(--sp-3)" }}>
          <h2 style={{ margin: 0, fontSize: "var(--rozmiar-l)" }}>Wynik według działów</h2>
          {Object.entries(wynik.perDzial).map(([id, { pkt, maks }]) => (
            <PasekPostepu
              key={id}
              procent={maks ? Math.round((100 * pkt) / maks) : 0}
              etykietaLewa={DZIALY[id]?.tytul ?? id}
              etykietaPrawa={`${pkt}/${maks} pkt`}
            />
          ))}
        </section>

        <button className="btn btn-primary btn--pelny" style={{ marginTop: "var(--sp-5)" }} onClick={onWroc}>
          Wróć do startu
        </button>
      </div>
    );
  }

  return null;
}
```

- [ ] **Step 2: Build sanity check**

Run: `cd "repetytorium - matematyka/app" && npm run build`
Expected: build bez błędów (komponent jeszcze nie podpięty do routera — to T6)

- [ ] **Step 3: Lint**

Run: `cd "repetytorium - matematyka/app" && npm run lint`
Expected: bez nowych błędów w `EgzaminProbny.jsx`

- [ ] **Step 4: Commit**

```bash
cd /Users/pibe/dev/Repetytorium-doc
git add "repetytorium - matematyka/app/src/ui/pages/EgzaminProbny.jsx"
git commit -m "feat(mat): EgzaminProbny.jsx — symulacja arkusza 15+6, zegar 125 min (it.3 T4)"
```

---

## Task 5: `Statystyki.jsx` — ekran statystyk

Ekran statystyk na wzór polskiego projektu: wykres wyników w czasie (`WykresLiniowy` — już istnieje w `src/ui/components/`), postęp per dział (diagnoza → dziś z deltą), regularność (słupki tygodni + seria dni), pokrycie materiału.

**Files:**
- Create: `repetytorium - matematyka/app/src/ui/pages/Statystyki.jsx`

**Interfaces:**
- Consumes: `seriaWynikow(postepy, mapaEtykiet)`, `postepPerDzial(postepy, kolejnosc)`, `aktywnosc(postepy)`, `pokrycie(postepy, liczbaDzialow)` z `core/statystyki.js` (T3); `DZIALY` z rejestru; `WykresLiniowy` (props `{punkty, liniaOdniesienia}` — zwraca `null` przy pustej serii); `PasekPostepu`
- Produces: `Statystyki({ postepy, onWroc })`

- [ ] **Step 1: Utwórz `src/ui/pages/Statystyki.jsx`**

```jsx
import { DZIALY } from "../../content/matematyka/rejestr.js";
import { seriaWynikow, postepPerDzial, aktywnosc, pokrycie } from "../../core/statystyki.js";
import PasekPostepu from "../components/PasekPostepu.jsx";
import WykresLiniowy from "../components/WykresLiniowy.jsx";

function Delta({ delta }) {
  if (delta > 0) return <span style={{ color: "var(--kolor-sukces)", whiteSpace: "nowrap" }}>▲ +{delta} pp</span>;
  if (delta < 0) return <span style={{ color: "var(--kolor-uwaga)", whiteSpace: "nowrap" }}>▽ {delta} pp</span>;
  return <span className="tekst-2" style={{ whiteSpace: "nowrap" }}>=</span>;
}

export default function Statystyki({ postepy, onWroc }) {
  const kolejnosc = Object.keys(DZIALY);
  const mapaEtykiet = Object.fromEntries(kolejnosc.map((id) => [id, DZIALY[id].tytul]));
  const seria = seriaWynikow(postepy, mapaEtykiet);
  const dzialy = postepPerDzial(postepy, kolejnosc);
  const { tygodnie, seriaDni } = aktywnosc(postepy);
  const { dzialy: pokrycieDzialow, egzaminy } = pokrycie(postepy, kolejnosc.length);

  const ostatni = seria[seria.length - 1];
  const najlepszy = seria.length > 0 ? seria.reduce((a, b) => (b.procent > a.procent ? b : a), seria[0]) : null;
  const maksTydzien = Math.max(1, ...tygodnie.map((t) => t.liczba));

  return (
    <div className="tresc ekran-wjazd">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--sp-5)" }}>
        <h1 style={{ margin: 0 }}>📊 Twoje statystyki</h1>
        <button className="btn btn-ghost" onClick={onWroc}>Wróć</button>
      </header>

      <section className="karta" style={{ display: "grid", gap: "var(--sp-4)" }}>
        <h2 style={{ margin: 0 }}>Twoja droga</h2>
        <WykresLiniowy punkty={seria} liniaOdniesienia={80} />
        {seria.length <= 1 ? (
          <p className="tekst-2" style={{ margin: 0 }}>
            Każda sesja doda punkt na tej mapie — diagnoza, działy, egzaminy próbne. Zobaczysz tu swoją drogę do celu.
          </p>
        ) : (
          <p className="tekst-2 tekst-maly" style={{ margin: 0 }}>
            Ostatnio: <strong>{ostatni.etykieta} — {ostatni.procent}%</strong> · Najlepszy wynik:{" "}
            <strong>{najlepszy.etykieta} — {najlepszy.procent}%</strong>
          </p>
        )}
      </section>

      <section className="karta" style={{ marginTop: "var(--sp-4)", display: "grid", gap: "var(--sp-3)" }}>
        <h2 style={{ margin: 0 }}>Działy: diagnoza → dziś</h2>
        {kolejnosc.map((id) => (
          <div key={id} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "var(--sp-3)", alignItems: "end" }}>
            <PasekPostepu
              procent={dzialy[id].teraz}
              etykietaLewa={DZIALY[id].tytul}
              etykietaPrawa={`${dzialy[id].diagnoza}% → ${dzialy[id].teraz}%`}
            />
            <Delta delta={dzialy[id].delta} />
          </div>
        ))}
        <p className="tekst-2 tekst-maly" style={{ margin: 0 }}>pp = punkty procentowe względem testu wstępnego</p>
      </section>

      <section className="karta" style={{ marginTop: "var(--sp-4)", display: "grid", gap: "var(--sp-3)" }}>
        <h2 style={{ margin: 0 }}>Regularność</h2>
        <p style={{ margin: 0 }}>
          {seriaDni > 0
            ? <>🔥 <strong>{seriaDni} {seriaDni === 1 ? "dzień" : "dni"} z rzędu</strong> — tak trzymaj!</>
            : <>Zacznij dziś nową serię 🌱</>}
        </p>
        <svg viewBox="0 0 600 120" style={{ width: "100%", height: "auto", display: "block" }} role="img" aria-label="Sesje w ostatnich 8 tygodniach">
          {tygodnie.map((t, i) => {
            const wys = t.liczba === 0 ? 3 : 12 + (t.liczba / maksTydzien) * 80;
            return (
              <g key={t.od}>
                <rect
                  x={20 + i * 72} y={100 - wys} width="48" height={wys} rx="6"
                  fill={t.liczba === 0 ? "var(--kolor-powierzchnia-2)" : "var(--kolor-akcent)"}
                />
                {t.liczba > 0 && (
                  <text x={44 + i * 72} y={100 - wys - 6} textAnchor="middle" fontSize="12" fill="var(--kolor-tekst-2)">{t.liczba}</text>
                )}
                <text x={44 + i * 72} y={116} textAnchor="middle" fontSize="10" fill="var(--kolor-tekst-2)">
                  {t.od.slice(5, 10).split("-").reverse().join(".")}
                </text>
              </g>
            );
          })}
        </svg>
        <p className="tekst-2 tekst-maly" style={{ margin: 0 }}>Sesje w kolejnych tygodniach (data = poniedziałek)</p>
      </section>

      <section className="karta" style={{ marginTop: "var(--sp-4)", display: "grid", gap: "var(--sp-3)" }}>
        <h2 style={{ margin: 0 }}>Pokrycie materiału</h2>
        <PasekPostepu
          procent={pokrycieDzialow.wszystkie ? (100 * pokrycieDzialow.zrobione) / pokrycieDzialow.wszystkie : 0}
          etykietaLewa="Ukończone działy"
          etykietaPrawa={`${pokrycieDzialow.zrobione} z ${pokrycieDzialow.wszystkie}`}
          wariant={pokrycieDzialow.zrobione === pokrycieDzialow.wszystkie && pokrycieDzialow.wszystkie > 0 ? "sukces" : ""}
        />
        <p className="tekst-2" style={{ margin: 0 }}>
          Egzaminy próbne: <strong>{egzaminy}</strong>
        </p>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Build sanity check**

Run: `cd "repetytorium - matematyka/app" && npm run build`
Expected: build bez błędów

- [ ] **Step 3: Lint**

Run: `cd "repetytorium - matematyka/app" && npm run lint`
Expected: bez nowych błędów w `Statystyki.jsx`

- [ ] **Step 4: Commit**

```bash
cd /Users/pibe/dev/Repetytorium-doc
git add "repetytorium - matematyka/app/src/ui/pages/Statystyki.jsx"
git commit -m "feat(mat): Statystyki.jsx — wykres, działy, regularność, pokrycie (it.3 T5)"
```

---

## Task 6: Router App.jsx + Start.jsx + QA końcowe + LESSONS + STAN

Podpięcie obu ekranów do routera stanowego, przycisk „Egzamin próbny" na dashboardzie, zapis wyniku egzaminu do `postepy.egzaminy` + `postepy.sesje`, pełne QA desktop+mobile, aktualizacja dokumentacji projektu.

**Files:**
- Modify: `repetytorium - matematyka/app/src/App.jsx`
- Modify: `repetytorium - matematyka/app/src/ui/pages/Start.jsx`
- Modify: `repetytorium - matematyka/LESSONS.md`
- Modify: `repetytorium - matematyka/STAN-PROJEKTU.md`

**Interfaces:**
- Consumes: `EgzaminProbny({ onZakoncz, onWroc })` (T4), `Statystyki({ postepy, onWroc })` (T5)
- Produces: stany routera `"egzamin"` i `"statystyki"`; rekord w `postepy.egzaminy`: `{ data: ISO, wynikPkt, maksPkt, procent, perDzial }`; wpis w `postepy.sesje`: `{ typ: "egzamin", data: ISO, wynikPkt, maksPkt }` (kształt zgodny z `seriaWynikow` z T3)

- [ ] **Step 1: Zmodyfikuj `src/App.jsx`**

(a) Dodaj importy po istniejącym imporcie `Powtorka`:

```js
import EgzaminProbny from "./ui/pages/EgzaminProbny.jsx";
import Statystyki from "./ui/pages/Statystyki.jsx";
```

(b) Dodaj funkcję po `zakonczonoPowtorke` (przed `if (ekran === "ladowanie")`):

```js
async function zakonczonoEgzamin(wynik) {
  const teraz = new Date().toISOString();
  const nowe = {
    ...postepy,
    egzaminy: [
      ...(postepy.egzaminy ?? []),
      { data: teraz, wynikPkt: wynik.wynikPkt, maksPkt: wynik.maksPkt, procent: wynik.procent, perDzial: wynik.perDzial },
    ],
    sesje: [...postepy.sesje, { typ: "egzamin", data: teraz, wynikPkt: wynik.wynikPkt, maksPkt: wynik.maksPkt }],
  };
  await zapiszPostepy(nowe);
  // bez setEkran — EgzaminProbny sam pokazuje ekran wyniku; powrót przez onWroc
}
```

(c) Dodaj dwa bloki ekranów przed `if (ekran === "start")`:

```jsx
if (ekran === "egzamin") return (
  <EgzaminProbny
    onZakoncz={zakonczonoEgzamin}
    onWroc={() => setEkran("start")}
  />
);

if (ekran === "statystyki") return (
  <Statystyki
    postepy={postepy}
    onWroc={() => setEkran("start")}
  />
);
```

(d) W bloku `if (ekran === "start")` zmień propsy `Start`:

```jsx
if (ekran === "start") return (
  <Start
    profil={profil}
    postepy={postepy}
    onTestWstepny={() => setEkran("test-wstepny")}
    onDzial={otworzDzial}
    onPowtorka={otworzPowtorke}
    onEgzamin={() => setEkran("egzamin")}
    onStatystyki={() => setEkran("statystyki")}
    onWyloguj={wyloguj}
  />
);
```

(Usuwa to placeholder `onStatystyki={() => { /* it.3 */ }}`.)

- [ ] **Step 2: Zmodyfikuj `src/ui/pages/Start.jsx`**

(a) Sygnatura komponentu — dodaj `onEgzamin`:

```js
export default function Start({ profil, postepy, onTestWstepny, onDzial, onPowtorka, onEgzamin, onStatystyki, onWyloguj }) {
```

(b) Dolny blok przycisków — zastąp:

```jsx
<div style={{ display: "grid", gap: "var(--sp-3)", marginTop: "var(--sp-5)" }}>
  <button className="btn btn-ghost btn--pelny" onClick={onStatystyki}>Twoje statystyki</button>
</div>
```

nowym:

```jsx
<div style={{ display: "grid", gap: "var(--sp-3)", marginTop: "var(--sp-5)" }}>
  <button className="btn btn-primary btn--pelny" onClick={onEgzamin}>🎓 Egzamin próbny</button>
  <button className="btn btn-ghost btn--pelny" onClick={onStatystyki}>Twoje statystyki</button>
</div>
```

- [ ] **Step 3: Testy + build**

Run: `cd "repetytorium - matematyka/app" && npm test && npm run build`
Expected: trzy `... — OK` + build bez błędów

- [ ] **Step 4: QA desktop (Playwright, 1280×900) — golden path egzaminu**

Uruchom dev server (`npm run dev`, localhost:5174) i przejdź scenariusz:

1. Zaloguj się na profil (lub utwórz nowy) → dashboard
2. Kliknij „🎓 Egzamin próbny" → intro pokazuje „15 zadań zamkniętych + 6 otwartych" i „125 minut"
3. „Zaczynam egzamin" → widoczny zegar (`⏱ Pozostało: 2:04:xx`) i pasek „Zadanie 1 z 15"
4. Odpowiedz na wszystkie 15 zadań zamkniętych (dowolne opcje; sprawdź, że „Dalej" jest disabled przed zaznaczeniem, „Wstecz" działa i pamięta zaznaczenie, brak feedbacku zielony/czerwony po kliknięciu opcji)
5. Ostatnie zamknięte → przycisk „Część 2: zadania otwarte"
6. Rozwiąż 6 zadań otwartych (wpisuj wartości `oczekiwana` z JSON dla poprawnych albo dwukrotnie błędną — wtedy krok pokaże wskazówkę i przejdzie dalej)
7. Ekran wyniku: X/Y pkt, %, rozbicie zamknięte/otwarte, sekcja „Wynik według działów"
8. Zweryfikuj localStorage: klucz `rep:postepy:{uuid}:matematyka` zawiera `egzaminy[0]` z polami `data`, `wynikPkt`, `maksPkt`, `procent`, `perDzial` oraz sesję `{typ:"egzamin"}`
9. „Wróć do startu" → dashboard

- [ ] **Step 5: QA desktop — statystyki + notacja przecinkowa**

1. Kliknij „Twoje statystyki" → sekcje: Twoja droga (wykres z punktem egzaminu — większa zielona kropka), Działy diagnoza → dziś (9 pasków z deltami), Regularność (słupki + seria dni), Pokrycie (działy X z 9, „Egzaminy próbne: 1")
2. „Wróć" → dashboard
3. Wejdź w dział **Ułamki**, przejdź quiz 3/3, w zadaniu otwartym wpisz oczekiwaną wartość **z przecinkiem zamiast kropki** (np. „2,5" gdy oczekiwana „2.5") → krok zaliczony (weryfikacja T1 w realnym UI)
4. Konsola przeglądarki: 0 errors, 0 warnings przez całą sesję QA

- [ ] **Step 6: QA mobile (390×844)**

1. Powtórz skrócony scenariusz egzaminu (intro → 2-3 zamknięte → cofnij się „Wstecz") — opcje nie przelewają się, KaTeX renderuje się poprawnie, zegar widoczny
2. Otwórz Statystyki — wykres i słupki skalują się (SVG przez viewBox), paski działów czytelne
3. Konsola czysta

- [ ] **Step 7: Wpis w LESSONS.md**

Dodaj na końcu `repetytorium - matematyka/LESSONS.md` wpis `## 2026-07-27 (it.3 — egzamin próbny + statystyki)` z obserwacjami z implementacji i QA (co najmniej: wynik weryfikacji notacji przecinkowej w realnym UI, ewentualne nowe pułapki; format jak poprzednie wpisy: Obserwacja/Wniosek/Zmiana w skilu).

- [ ] **Step 8: Aktualizacja STAN-PROJEKTU.md**

W `repetytorium - matematyka/STAN-PROJEKTU.md`:
- Nagłówek: data ostatniej aktualizacji → po sesji it.3 (6 tasków T1-T6)
- Nowa sekcja „Iteracja 3 — plan i stan" (status UKOŃCZONA, tabela 6 tasków, ścieżki do planu i kart Trello, lista zrealizowanych rzeczy)
- Sekcja „Kolejne kroki": usuń pozycje it.3, zostaw/uzupełnij: **Deploy Vercel** (kolejny krok), Hub po angielskim, ewentualnie rozszerzenie puli zadań (obecnie arkusz wyczerpuje prawie całą pulę — 15 z 27 zamkniętych, 6 z 9 otwartych; mało wariantywności między egzaminami)
- Sekcja „Jak zacząć nową sesję": zaktualizuj pod start it.4/deploy

- [ ] **Step 9: Commit**

```bash
cd /Users/pibe/dev/Repetytorium-doc
git add "repetytorium - matematyka/app/src/App.jsx" "repetytorium - matematyka/app/src/ui/pages/Start.jsx"
git commit -m "feat(mat): router it.3 — EgzaminProbny+Statystyki w App.jsx, przycisk egzaminu (it.3 T6)"
git add "repetytorium - matematyka/LESSONS.md" "repetytorium - matematyka/STAN-PROJEKTU.md"
git commit -m "docs(mat): STAN-PROJEKTU + LESSONS — it.3 domknięta"
```

---

## Self-review (wykonany przy pisaniu planu)

- **Spec coverage:** (a) normalizacja przecinka → T1; (b) EgzaminProbny 21 zadań / 125 min → T2+T4; (c) Statystyki → T3+T5; integracja+QA → T6. `WykresLiniowy.jsx` już istnieje — nie tworzymy. Pula treści (27 zamkniętych, 9 otwartych) wystarcza na arkusz 15+6 bez nowej treści.
- **Placeholders:** brak — każdy krok ma pełny kod/komendę.
- **Type consistency:** `zbudujArkusz`/`policzWynikEgzaminu`/`punktyZadaniaOtwartego` — te same sygnatury w T2 (definicja+testy) i T4 (użycie); `seriaWynikow`/`postepPerDzial`/`aktywnosc`/`pokrycie` — te same w T3 i T5; kształt sesji `{typ:"egzamin", data, wynikPkt, maksPkt}` zapisywany w T6 zgodny z filtrem w `seriaWynikow` (T3); rekord `egzaminy[]` z `perDzial:{pkt,maks}` zgodny z `postepPerDzial` (T3); props `Start` w T6 (d) zgodne z sygnaturą w T6 Step 2.
