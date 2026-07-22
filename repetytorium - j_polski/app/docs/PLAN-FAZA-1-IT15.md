# Statystyki postępu (it. 15) — plan implementacji

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ekran statystyk postępu: wykres wyników w czasie, postęp per moduł A-F vs diagnoza, regularność (8 tygodni + seria dni), pokrycie materiału.

**Architecture:** Czysty moduł `core/statystyki.js` (agregacje, zero DOM/importów treści — dane i mapy jako argumenty), komponent SVG `WykresLiniowy.jsx`, ekran `Statystyki.jsx`, spięcie w `App.jsx` + przycisk w `Start.jsx`. Schemat postępów bez zmian (v4).

**Tech Stack:** React 19 + Vite, zero nowych zależności, testy `node --test` (wbudowany runner Node).

## Global Constraints

- Spec: `app/docs/SPEC-FAZA-1-IT15.md`; katalog roboczy: `repetytorium - j_polski/app/`
- Warstwy: core = czysta logika (zero DOM, zero importów z `content/`); UI importuje treść wyłącznie z `rejestr.js` (tu: przez propsy z App)
- Język UI: polski, dla 14-latki, growth mindset (zachęta, nigdy kara — komunikat serii: „🔥 N dni z rzędu" / „Zacznij dziś nową serię 🌱")
- Kolory wyłącznie ze zmiennych CSS `theme.css` (`--kolor-akcent`, `--kolor-sukces`, `--kolor-obrys`, `--kolor-tekst-2`, `--modul-a`…`--modul-f`) — motyw ciemny automatyczny
- Mobile-first: SVG przez `viewBox` (bez stałych szerokości), test 390×844: `scrollWidth === innerWidth`
- Commity: `git add` jawnymi ścieżkami (w repo są nietrackowane katalogi-siostry); git root: `/Users/pibe/dev/Repetytorium-doc`
- Daty w `postepy.sesje`: ISO string (pełny datetime lub `YYYY-MM-DD`) — porównania przez `slice(0,10)` / `localeCompare`

---

### Task 1: `core/statystyki.js` — `seriaWynikow`

**Files:**
- Create: `app/src/core/statystyki.js`
- Test: `app/tests/statystyki.test.mjs`

**Interfaces:**
- Consumes: kształt `postepy.sesje` (patrz `App.jsx:76-181`): `{ typ, data, wynikPkt?, maksPkt?, ref? }`; typy: `diagnoza | quiz-lektury | fiszki-lektury | quiz-cwiczenia | pisanie | egzamin | powtorka`
- Produces: `seriaWynikow(postepy, mapaEtykiet = {}) → [{ data: string, procent: number, typ: string, etykieta: string }]` — chronologicznie, tylko typy punktowe

- [ ] **Step 1: Napisz failing test**

Utwórz `app/tests/statystyki.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { seriaWynikow } from "../src/core/statystyki.js";

const sesje = [
  { typ: "quiz-lektury", ref: "balladyna", data: "2026-07-20", wynikPkt: 9, maksPkt: 12 },
  { typ: "diagnoza", data: "2026-07-15T10:00:00.000Z", wynikPkt: 6, maksPkt: 25 },
  { typ: "powtorka", id: "x:quiz", data: "2026-07-18", ocena: "umiem" },
  { typ: "fiszki-lektury", ref: "dziady-2", data: "2026-07-17", umiem: 5, razem: 8 },
  { typ: "egzamin", data: "2026-07-21T12:00:00.000Z", wynikPkt: 20, maksPkt: 45 },
];

test("seriaWynikow: chronologicznie, tylko typy punktowe, poprawny procent", () => {
  const s = seriaWynikow({ sesje }, { balladyna: "Balladyna" });
  assert.deepEqual(s.map((p) => p.typ), ["diagnoza", "quiz-lektury", "egzamin"]);
  assert.deepEqual(s.map((p) => p.procent), [24, 75, 44]);
  assert.equal(s[1].etykieta, "Quiz: Balladyna");
  assert.equal(s[0].etykieta, "Test wstępny");
});

test("seriaWynikow: brak sesji i brak mapy etykiet nie wywala", () => {
  assert.deepEqual(seriaWynikow({ sesje: [] }), []);
  const s = seriaWynikow({ sesje: [{ typ: "quiz-cwiczenia", ref: "nieznane", data: "2026-07-19", wynikPkt: 1, maksPkt: 2 }] });
  assert.equal(s[0].etykieta, "Ćwiczenie: nieznane");
});
```

- [ ] **Step 2: Uruchom test — ma failować**

Run: `cd "/Users/pibe/dev/Repetytorium-doc/repetytorium - j_polski/app" && node --test tests/`
Expected: FAIL — `Cannot find module .../src/core/statystyki.js`

- [ ] **Step 3: Minimalna implementacja**

Utwórz `app/src/core/statystyki.js`:

```js
/**
 * Statystyki postępu — czysta logika agregacji, zero DOM/importów treści.
 * Mapy etykiet/modułów/liczebności buduje UI z rejestru i podaje argumentami.
 */

const TYPY_PUNKTOWE = {
  diagnoza: "Test wstępny",
  "quiz-lektury": "Quiz",
  "quiz-cwiczenia": "Ćwiczenie",
  pisanie: "Pisanie",
  egzamin: "Egzamin próbny",
};

/** Chronologiczna seria procentowych wyników sesji (bez powtórek/fiszek — inna skala). */
export function seriaWynikow(postepy, mapaEtykiet = {}) {
  return (postepy.sesje ?? [])
    .filter((s) => s.typ in TYPY_PUNKTOWE && s.maksPkt > 0)
    .map((s) => ({
      data: s.data,
      procent: Math.round((100 * s.wynikPkt) / s.maksPkt),
      typ: s.typ,
      etykieta: s.ref ? `${TYPY_PUNKTOWE[s.typ]}: ${mapaEtykiet[s.ref] ?? s.ref}` : TYPY_PUNKTOWE[s.typ],
    }))
    .sort((a, b) => a.data.localeCompare(b.data));
}
```

- [ ] **Step 4: Testy zielone**

Run: `node --test tests/`
Expected: PASS (2 testy)

- [ ] **Step 5: Commit**

```bash
cd /Users/pibe/dev/Repetytorium-doc
git add "repetytorium - j_polski/app/src/core/statystyki.js" "repetytorium - j_polski/app/tests/statystyki.test.mjs"
git commit -m "It. 15 (1/8): core/statystyki.js — seriaWynikow + testy node"
```

---

### Task 2: `postepPerModul`

**Files:**
- Modify: `app/src/core/statystyki.js`
- Test: `app/tests/statystyki.test.mjs`

**Interfaces:**
- Consumes: `postepy.diagnoza.perModul` = `{ A: { pkt, maks }, ... }`; `postepy.lektury[ref].quiz` = `{ wynikPkt, maksPkt }`; `postepy.cwiczenia[ref].quiz` jw.; `postepy.pisanie[ref]` = `{ pkt, maks }`; `postepy.egzaminy[n].perModul` = `{ A: { pkt, maks }, ..., F: {...} }`
- Produces: `postepPerModul(postepy, mapaModulow = {}) → { A: { diagnoza, teraz, delta }, ..., F: {...} }` (procenty całkowite; `delta = teraz - diagnoza`; moduł bez nowych danych → `teraz === diagnoza`, `delta === 0`)

- [ ] **Step 1: Dopisz failing testy**

Dopisz do `app/tests/statystyki.test.mjs` (import rozszerz o `postepPerModul`):

```js
import { seriaWynikow, postepPerModul } from "../src/core/statystyki.js";

const diagnoza = {
  perModul: {
    A: { pkt: 0, maks: 6 }, B: { pkt: 3, maks: 5 }, C: { pkt: 0, maks: 3 },
    D: { pkt: 1, maks: 4 }, E: { pkt: 0, maks: 3 }, F: { pkt: 2, maks: 4 },
  },
};

test("postepPerModul: delta ▲ z quizów, = bez danych, F z pisania+egzaminu", () => {
  const postepy = {
    diagnoza,
    lektury: { "dziady-2": { quiz: { wynikPkt: 10, maksPkt: 12 } }, balladyna: { sekcjePrzeczytane: [] } },
    cwiczenia: { "ortografia-1": { quiz: { wynikPkt: 9, maksPkt: 12 } } },
    pisanie: { "zaproszenie-1": { pkt: 3, maks: 3 } },
    egzaminy: [{ perModul: { A: { pkt: 3, maks: 6 }, F: { pkt: 14, maks: 20 } } }],
  };
  const p = postepPerModul(postepy, { "ortografia-1": "C" });
  // A: quiz 10/12 + egzamin 3/6 = 13/18 → 72%; diagnoza 0%
  assert.deepEqual(p.A, { diagnoza: 0, teraz: 72, delta: 72 });
  // C: 9/12 → 75%; diagnoza 0%
  assert.deepEqual(p.C, { diagnoza: 0, teraz: 75, delta: 75 });
  // B: bez nowych danych → teraz = diagnoza (60%)
  assert.deepEqual(p.B, { diagnoza: 60, teraz: 60, delta: 0 });
  // F: pisanie 3/3 + egzamin 14/20 = 17/23 → 74%; diagnoza 50%
  assert.deepEqual(p.F, { diagnoza: 50, teraz: 74, delta: 24 });
});

test("postepPerModul: delta ujemna i brak diagnozy w module", () => {
  const postepy = {
    diagnoza: { perModul: { B: { pkt: 5, maks: 5 } } },
    lektury: {}, cwiczenia: { "gramatyka-1": { quiz: { wynikPkt: 1, maksPkt: 10 } } },
    pisanie: {}, egzaminy: [],
  };
  const p = postepPerModul(postepy, { "gramatyka-1": "B" });
  assert.deepEqual(p.B, { diagnoza: 100, teraz: 10, delta: -90 });
  assert.deepEqual(p.A, { diagnoza: 0, teraz: 0, delta: 0 });
});
```

- [ ] **Step 2: Uruchom — nowe testy FAIL** (`postepPerModul is not a function`)

- [ ] **Step 3: Implementacja**

Dopisz do `app/src/core/statystyki.js`:

```js
export const MODULY_KOLEJNOSC = ["A", "B", "C", "D", "E", "F"];

/**
 * Postęp per moduł: procent z diagnozy vs "teraz" (ostatnie wyniki materiałów
 * + ostatni egzamin, średnia ważona punktami). Bez nowych danych → teraz = diagnoza.
 * @param {object} mapaModulow — ref ćwiczenia → moduł (z rejestru, buduje UI)
 */
export function postepPerModul(postepy, mapaModulow = {}) {
  const suma = {};
  const dodaj = (modul, pkt, maks) => {
    if (!modul || !maks) return;
    suma[modul] ??= { pkt: 0, maks: 0 };
    suma[modul].pkt += pkt;
    suma[modul].maks += maks;
  };

  for (const stan of Object.values(postepy.lektury ?? {}))
    if (stan.quiz) dodaj("A", stan.quiz.wynikPkt, stan.quiz.maksPkt);
  for (const [ref, stan] of Object.entries(postepy.cwiczenia ?? {}))
    if (stan.quiz) dodaj(mapaModulow[ref], stan.quiz.wynikPkt, stan.quiz.maksPkt);
  for (const praca of Object.values(postepy.pisanie ?? {}))
    dodaj("F", praca.pkt, praca.maks);
  const egzaminy = postepy.egzaminy ?? [];
  const ostatni = egzaminy[egzaminy.length - 1];
  if (ostatni)
    for (const [m, { pkt, maks }] of Object.entries(ostatni.perModul ?? {})) dodaj(m, pkt, maks);

  const procent = (x) => (x && x.maks ? Math.round((100 * x.pkt) / x.maks) : 0);
  return Object.fromEntries(
    MODULY_KOLEJNOSC.map((m) => {
      const diagnoza = procent(postepy.diagnoza?.perModul?.[m]);
      const teraz = suma[m] ? procent(suma[m]) : diagnoza;
      return [m, { diagnoza, teraz, delta: teraz - diagnoza }];
    })
  );
}
```

- [ ] **Step 4: Testy zielone** — `node --test tests/` → PASS (4 testy)

- [ ] **Step 5: Commit**

```bash
git add "repetytorium - j_polski/app/src/core/statystyki.js" "repetytorium - j_polski/app/tests/statystyki.test.mjs"
git commit -m "It. 15 (2/8): postepPerModul — delta vs diagnoza, średnia ważona punktami"
```

---

### Task 3: `aktywnosc`

**Files:**
- Modify: `app/src/core/statystyki.js`
- Test: `app/tests/statystyki.test.mjs`

**Interfaces:**
- Consumes: `postepy.sesje[].data` (ISO, UTC — zapisy przez `toISOString()`)
- Produces: `aktywnosc(postepy, dzis = new Date()) → { tygodnie: [{ od: "YYYY-MM-DD", liczba }] (8, chronologicznie, tygodnie od poniedziałku), seriaDni: number }`. Dziś bez sesji NIE zeruje serii zaczętej wczoraj; przerwa ≥1 pełnego dnia zeruje.

- [ ] **Step 1: Dopisz failing testy**

```js
import { seriaWynikow, postepPerModul, aktywnosc } from "../src/core/statystyki.js";

const s = (data) => ({ typ: "powtorka", data });

test("aktywnosc: seria liczona wstecz, dziś bez sesji nie zeruje wczorajszej", () => {
  const dzis = new Date("2026-07-21T14:00:00Z"); // wtorek
  // sesje: 18, 19, 20 (pn) — dziś (21) brak → seria 3
  const a = aktywnosc({ sesje: [s("2026-07-18"), s("2026-07-19T08:00:00Z"), s("2026-07-20")] }, dzis);
  assert.equal(a.seriaDni, 3);
  // z sesją dziś → 4
  assert.equal(aktywnosc({ sesje: [s("2026-07-18"), s("2026-07-19"), s("2026-07-20"), s("2026-07-21")] }, dzis).seriaDni, 4);
  // przerwa (brak 20) → seria 0 (dziś też brak)
  assert.equal(aktywnosc({ sesje: [s("2026-07-18"), s("2026-07-19")] }, dzis).seriaDni, 0);
});

test("aktywnosc: 8 tygodni od poniedziałku, zliczanie per tydzień", () => {
  const dzis = new Date("2026-07-21T14:00:00Z"); // wtorek, tydzień od pn 2026-07-20
  const a = aktywnosc({ sesje: [s("2026-07-20"), s("2026-07-21"), s("2026-07-15"), s("2026-05-01")] }, dzis);
  assert.equal(a.tygodnie.length, 8);
  assert.equal(a.tygodnie[7].od, "2026-07-20"); // bieżący tydzień ostatni
  assert.equal(a.tygodnie[7].liczba, 2);
  assert.equal(a.tygodnie[6].od, "2026-07-13");
  assert.equal(a.tygodnie[6].liczba, 1);
  assert.equal(a.tygodnie[0].liczba, 0); // 2026-05-01 poza oknem 8 tygodni
});
```

- [ ] **Step 2: Uruchom — FAIL** (`aktywnosc is not a function`)

- [ ] **Step 3: Implementacja**

```js
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
      liczba: sesje.filter((x) => { const d = x.data.slice(0, 10); return d >= odISO && d <= koniecISO; }).length,
    });
  }
  return { tygodnie, seriaDni };
}
```

- [ ] **Step 4: Testy zielone** — PASS (6 testów)

- [ ] **Step 5: Commit**

```bash
git add "repetytorium - j_polski/app/src/core/statystyki.js" "repetytorium - j_polski/app/tests/statystyki.test.mjs"
git commit -m "It. 15 (3/8): aktywnosc — seria dni (bez kary za dziś) + 8 tygodni"
```

---

### Task 4: `pokrycie`

**Files:**
- Modify: `app/src/core/statystyki.js`
- Test: `app/tests/statystyki.test.mjs`

**Interfaces:**
- Consumes: stany `lektury/cwiczenia/pisanie` jak w Task 2; „zrobione" = lektura/ćwiczenie ma `quiz`, praca pisemna ma wpis
- Produces: `pokrycie(postepy, liczebnosci) → [{ nazwa, zrobione, wszystkie }]` — 3 wiersze: Lektury / Ćwiczenia / Pisanie; `liczebnosci = { lektury, cwiczenia, pisanie }` (liczby z rejestru)

- [ ] **Step 1: Dopisz failing test**

```js
import { seriaWynikow, postepPerModul, aktywnosc, pokrycie } from "../src/core/statystyki.js";

test("pokrycie: zrobione = quiz/praca zapisana, X z Y", () => {
  const postepy = {
    lektury: { "dziady-2": { quiz: { wynikPkt: 10, maksPkt: 12 } }, balladyna: { sekcjePrzeczytane: ["a"] } },
    cwiczenia: { "ortografia-1": { quiz: { wynikPkt: 9, maksPkt: 12 } } },
    pisanie: { "zaproszenie-1": { pkt: 3, maks: 3 } },
  };
  assert.deepEqual(pokrycie(postepy, { lektury: 6, cwiczenia: 16, pisanie: 6 }), [
    { nazwa: "Lektury", zrobione: 1, wszystkie: 6 },
    { nazwa: "Ćwiczenia", zrobione: 1, wszystkie: 16 },
    { nazwa: "Pisanie", zrobione: 1, wszystkie: 6 },
  ]);
});
```

- [ ] **Step 2: Uruchom — FAIL**

- [ ] **Step 3: Implementacja**

```js
/** Pokrycie materiału: przerobione X z Y per typ (liczebności z rejestru podaje UI). */
export function pokrycie(postepy, liczebnosci) {
  const zQuizem = (mapa) => Object.values(mapa ?? {}).filter((s) => s.quiz).length;
  return [
    { nazwa: "Lektury", zrobione: zQuizem(postepy.lektury), wszystkie: liczebnosci.lektury },
    { nazwa: "Ćwiczenia", zrobione: zQuizem(postepy.cwiczenia), wszystkie: liczebnosci.cwiczenia },
    { nazwa: "Pisanie", zrobione: Object.keys(postepy.pisanie ?? {}).length, wszystkie: liczebnosci.pisanie },
  ];
}
```

- [ ] **Step 4: Testy zielone** — PASS (7 testów)

- [ ] **Step 5: Commit**

```bash
git add "repetytorium - j_polski/app/src/core/statystyki.js" "repetytorium - j_polski/app/tests/statystyki.test.mjs"
git commit -m "It. 15 (4/8): pokrycie — przerobione X z Y per typ materiału"
```

---

### Task 5: komponent `WykresLiniowy.jsx`

**Files:**
- Create: `app/src/ui/components/WykresLiniowy.jsx`

**Interfaces:**
- Consumes: `punkty` z `seriaWynikow` (`[{ data, procent, typ, etykieta }]`), `liniaOdniesienia` (number, domyślnie 80)
- Produces: `<WykresLiniowy punkty={...} liniaOdniesienia={80} />` — SVG `viewBox="0 0 600 240"`, `width: 100%`; egzaminy = większe punkty w `--kolor-sukces`; oś X = czas

- [ ] **Step 1: Implementacja** (komponent czysto prezentacyjny — weryfikacja wizualna w QA, bez testu jednostkowego)

Utwórz `app/src/ui/components/WykresLiniowy.jsx`:

```jsx
/**
 * Wykres liniowy wyników w czasie — czysty SVG, skalowanie przez viewBox.
 * Oś X: czas (pierwsza → ostatnia sesja), oś Y: 0-100%.
 * Egzaminy próbne wyróżnione większym punktem w kolorze sukcesu.
 */
const W = 600, H = 240;
const M = { l: 40, r: 16, t: 14, b: 30 };

export default function WykresLiniowy({ punkty, liniaOdniesienia = 80 }) {
  if (!punkty || punkty.length === 0) return null;

  const czasy = punkty.map((p) => Date.parse(p.data));
  const [t0, t1] = [Math.min(...czasy), Math.max(...czasy)];
  const x = (t) => (t1 === t0 ? W / 2 : M.l + ((t - t0) / (t1 - t0)) * (W - M.l - M.r));
  const y = (proc) => H - M.b - (proc / 100) * (H - M.t - M.b);

  const wsp = punkty.map((p, i) => ({ ...p, x: x(czasy[i]), y: y(p.procent) }));
  const sciezka = wsp.map((p) => `${p.x},${p.y}`).join(" ");
  const dataKrotka = (iso) => iso.slice(5, 10).split("-").reverse().join(".");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }} role="img" aria-label="Wykres wyników w czasie">
      {[0, 50, 100].map((v) => (
        <g key={v}>
          <line x1={M.l} y1={y(v)} x2={W - M.r} y2={y(v)} stroke="var(--kolor-obrys)" strokeWidth="1" />
          <text x={M.l - 6} y={y(v) + 4} textAnchor="end" fontSize="11" fill="var(--kolor-tekst-2)">{v}%</text>
        </g>
      ))}
      <line
        x1={M.l} y1={y(liniaOdniesienia)} x2={W - M.r} y2={y(liniaOdniesienia)}
        stroke="var(--kolor-sukces)" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.7"
      />
      <text x={W - M.r} y={y(liniaOdniesienia) - 5} textAnchor="end" fontSize="11" fill="var(--kolor-sukces)">
        {liniaOdniesienia}% — próg „umiem"
      </text>
      {wsp.length > 1 && (
        <polyline points={sciezka} fill="none" stroke="var(--kolor-akcent)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      )}
      {wsp.map((p, i) => (
        <circle
          key={i} cx={p.x} cy={p.y}
          r={p.typ === "egzamin" ? 7 : 4}
          fill={p.typ === "egzamin" ? "var(--kolor-sukces)" : "var(--kolor-akcent)"}
          stroke="var(--kolor-powierzchnia)" strokeWidth="2"
        >
          <title>{`${p.etykieta} — ${p.procent}%`}</title>
        </circle>
      ))}
      <text x={M.l} y={H - 8} fontSize="11" fill="var(--kolor-tekst-2)">{dataKrotka(punkty[0].data)}</text>
      <text x={W - M.r} y={H - 8} textAnchor="end" fontSize="11" fill="var(--kolor-tekst-2)">
        {dataKrotka(punkty[punkty.length - 1].data)}
      </text>
    </svg>
  );
}
```

- [ ] **Step 2: Weryfikacja składni**

Run: `cd app && npx oxlint src/ui/components/WykresLiniowy.jsx`
Expected: 0 błędów

- [ ] **Step 3: Commit**

```bash
git add "repetytorium - j_polski/app/src/ui/components/WykresLiniowy.jsx"
git commit -m "It. 15 (5/8): WykresLiniowy — SVG viewBox, egzaminy wyróżnione, linia 80%"
```

---

### Task 6: ekran `Statystyki.jsx`

**Files:**
- Create: `app/src/ui/pages/Statystyki.jsx`

**Interfaces:**
- Consumes: `seriaWynikow/postepPerModul/aktywnosc/pokrycie/MODULY_KOLEJNOSC` (Task 1-4), `MODULY` z `core/quiz.js`, `PasekPostepu`, `WykresLiniowy` (Task 5)
- Produces: `<Statystyki postepy mapaEtykiet mapaModulow liczebnosci onWroc />` — App poda mapy zbudowane z rejestru (Task 7)

- [ ] **Step 1: Implementacja**

Utwórz `app/src/ui/pages/Statystyki.jsx`:

```jsx
import { seriaWynikow, postepPerModul, aktywnosc, pokrycie, MODULY_KOLEJNOSC } from "../../core/statystyki.js";
import { MODULY } from "../../core/quiz.js";
import PasekPostepu from "../components/PasekPostepu.jsx";
import WykresLiniowy from "../components/WykresLiniowy.jsx";

function Delta({ delta }) {
  if (delta > 0) return <span style={{ color: "var(--kolor-sukces)", whiteSpace: "nowrap" }}>▲ +{delta} pp</span>;
  if (delta < 0) return <span style={{ color: "var(--kolor-uwaga)", whiteSpace: "nowrap" }}>▽ {delta} pp</span>;
  return <span className="tekst-2" style={{ whiteSpace: "nowrap" }}>=</span>;
}

export default function Statystyki({ postepy, mapaEtykiet, mapaModulow, liczebnosci, onWroc }) {
  const seria = seriaWynikow(postepy, mapaEtykiet);
  const moduly = postepPerModul(postepy, mapaModulow);
  const { tygodnie, seriaDni } = aktywnosc(postepy);
  const materialy = pokrycie(postepy, liczebnosci);

  const ostatni = seria[seria.length - 1];
  const najlepszy = seria.reduce((a, b) => (b.procent > a.procent ? b : a), seria[0]);
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
            Każda sesja doda punkt na tej mapie — quizy, pisanie, egzaminy próbne. Zobaczysz tu swoją drogę do celu.
          </p>
        ) : (
          <p className="tekst-2 tekst-maly" style={{ margin: 0 }}>
            Ostatnio: <strong>{ostatni.etykieta} — {ostatni.procent}%</strong> · Najlepszy wynik:{" "}
            <strong>{najlepszy.etykieta} — {najlepszy.procent}%</strong>
          </p>
        )}
      </section>

      <section className="karta" style={{ marginTop: "var(--sp-4)", display: "grid", gap: "var(--sp-3)" }}>
        <h2 style={{ margin: 0 }}>Moduły: diagnoza → dziś</h2>
        {MODULY_KOLEJNOSC.map((m) => (
          <div key={m} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "var(--sp-3)", alignItems: "end" }}>
            <PasekPostepu
              procent={moduly[m].teraz}
              etykietaLewa={`${m} · ${MODULY[m]}`}
              etykietaPrawa={`${moduly[m].diagnoza}% → ${moduly[m].teraz}%`}
              wariant={`modul-${m.toLowerCase()}`}
            />
            <Delta delta={moduly[m].delta} />
          </div>
        ))}
        <p className="tekst-2 tekst-maly" style={{ margin: 0 }}>pp = punkty procentowe względem testu wstępnego</p>
      </section>

      <section className="karta" style={{ marginTop: "var(--sp-4)", display: "grid", gap: "var(--sp-3)" }}>
        <h2 style={{ margin: 0 }}>Regularność</h2>
        <p style={{ margin: 0 }}>
          {seriaDni > 0 ? <>🔥 <strong>{seriaDni} {seriaDni === 1 ? "dzień" : "dni"} z rzędu</strong> — tak trzymaj!</> : <>Zacznij dziś nową serię 🌱</>}
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
        {materialy.map((m) => (
          <PasekPostepu
            key={m.nazwa}
            procent={m.wszystkie ? (100 * m.zrobione) / m.wszystkie : 0}
            etykietaLewa={m.nazwa}
            etykietaPrawa={`Przerobione ${m.zrobione} z ${m.wszystkie}`}
            wariant={m.zrobione === m.wszystkie && m.wszystkie > 0 ? "sukces" : ""}
          />
        ))}
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Weryfikacja składni** — `npx oxlint src/ui/pages/Statystyki.jsx` → 0 błędów

- [ ] **Step 3: Commit**

```bash
git add "repetytorium - j_polski/app/src/ui/pages/Statystyki.jsx"
git commit -m "It. 15 (6/8): ekran Statystyki — droga, moduły, regularność, pokrycie"
```

---

### Task 7: spięcie w `App.jsx` + przycisk w `Start.jsx` + build

**Files:**
- Modify: `app/src/App.jsx` (importy ~1-17, ekran po bloku `"egzamin"` ~269-278)
- Modify: `app/src/ui/pages/Start.jsx` (props ~12, karta diagnozy ~100-103)

**Interfaces:**
- Consumes: `Statystyki` (Task 6); `LEKTURY/CWICZENIA/PISANIE` z rejestru (już importowane w App)
- Produces: ekran `"statystyki"`; `Start` dostaje prop `onOtworzStatystyki`

- [ ] **Step 1: `App.jsx` — import i mapy** (po istniejących importach, przed `zastosujPreferencje`):

```jsx
import Statystyki from "./ui/pages/Statystyki.jsx";

/** Mapy dla ekranu statystyk — budowane raz z rejestru (core nie importuje treści). */
const MAPA_ETYKIET = Object.fromEntries(
  [...Object.values(LEKTURY), ...Object.values(CWICZENIA), ...Object.values(PISANIE)].map((m) => [m.id, m.tytul])
);
const MAPA_MODULOW = Object.fromEntries(Object.values(CWICZENIA).map((c) => [c.id, c.modul]));
const LICZEBNOSCI = {
  lektury: Object.keys(LEKTURY).length,
  cwiczenia: Object.keys(CWICZENIA).length,
  pisanie: Object.keys(PISANIE).length,
};
```

- [ ] **Step 2: `App.jsx` — ekran** (po bloku `if (ekran === "egzamin")`):

```jsx
  if (ekran === "statystyki")
    return (
      <Statystyki
        postepy={postepy}
        mapaEtykiet={MAPA_ETYKIET}
        mapaModulow={MAPA_MODULOW}
        liczebnosci={LICZEBNOSCI}
        onWroc={() => setEkran("start")}
      />
    );
```

oraz w renderze `Start` dodaj prop: `onOtworzStatystyki={() => setEkran("statystyki")}`.

- [ ] **Step 3: `Start.jsx` — przycisk w karcie diagnozy**

Do listy props w sygnaturze `Start({ ... })` dodaj `onOtworzStatystyki`. Po przycisku „Zobacz szczegóły i omówienie odpowiedzi" (linia ~100-103) dodaj:

```jsx
            <button className="btn btn--pelny" onClick={onOtworzStatystyki}>
              📊 Zobacz statystyki postępu
            </button>
```

- [ ] **Step 4: Build + testy**

Run: `cd app && npm run build && node --test tests/`
Expected: build ✓ (66 modułów + nowe, warning chunka >500 kB znany), 7 testów PASS

- [ ] **Step 5: Commit**

```bash
git add "repetytorium - j_polski/app/src/App.jsx" "repetytorium - j_polski/app/src/ui/pages/Start.jsx"
git commit -m "It. 15 (7/8): ekran statystyki w App + wejście z karty diagnozy"
```

---

### Task 8: QA przeglądarkowe + domknięcie iteracji

**Files:**
- Modify: `LESSONS.md` (nowy wpis), `STAN-PROJEKTU.md` (it. 15, backlog)
- Temp: `app/public/backup-tmp.json` (usunąć po restore!)

**Interfaces:**
- Consumes: procedury z `STAN-PROJEKTU.md` §6 (login-skrypt, backup/restore, mobile viewport)
- Produces: iteracja domknięta wg definition of done

- [ ] **Step 1: Dev server + backup stanu Zosi**

`cd app && npm run dev` (jeśli nie działa). Backup localStorage Zosi przez `evaluate_script` z `filePath`, weryfikacja pythonem (odpakowanie `while typeof v === "string"`).

- [ ] **Step 2: QA desktop**

Login jednym skryptem (Zosia → PIN 1234 → Wejdź; natywny setter + dispatchEvent). Następnie:
- karta „Twoja diagnoza" ma przycisk „📊 Zobacz statystyki postępu" → klik
- sekcja „Twoja droga": wykres z punktami zgodnymi ze stanem (diagnoza 24% jako pierwszy punkt), linia 80%
- „Moduły": 6 pasków, delty zgodne z danymi (A ▲ po quizie Dziadów, B = bez nowych danych)
- „Regularność": słupki 8 tygodni, komunikat serii (dziś bez sesji → seria wg wczoraj lub 🌱)
- „Pokrycie": Lektury 1/6, Ćwiczenia 1/16, Pisanie 0/6 (stan bazowy Zosi)
- „Wróć" → dashboard
- przełącz motyw ciemny → wykres i słupki czytelne (kolory ze zmiennych)

- [ ] **Step 3: QA mobile**

Viewport `390x844x2,mobile,touch` (emulate wylogowuje → re-login). Ekran statystyk: `scrollWidth === innerWidth === 390`, SVG mieści się w karcie.

- [ ] **Step 4: Przywrócenie stanu Zosi**

Restore przez `app/public/backup-tmp.json` + `fetch` (odpakowanie pętlą), **usuń plik**, zweryfikuj „Na dziś" bazowe (2 powtórki + Lektura: Balladyna).

- [ ] **Step 5: LESSONS.md + STAN-PROJEKTU.md**

Nowy wpis w `LESSONS.md` (data, obserwacje: wzorzec, metodyka, QA). W `STAN-PROJEKTU.md`: wiersz it. 15 w tabeli, usuń punkt 1 z backlogu, zaktualizuj „Ostatnia aktualizacja" i sekcję plików (nowe: `core/statystyki.js`, `pages/Statystyki.jsx`, `components/WykresLiniowy.jsx`, `tests/`).

- [ ] **Step 6: Commit + push**

```bash
git add "repetytorium - j_polski/LESSONS.md" "repetytorium - j_polski/STAN-PROJEKTU.md"
git commit -m "It. 15 (8/8): QA + LESSONS + STAN-PROJEKTU — statystyki postępu domknięte"
git push
```

---

## Self-review (wykonany)

- **Pokrycie specu:** seriaWynikow→T1, postepPerModul→T2, aktywnosc→T3, pokrycie→T4, WykresLiniowy→T5, ekran 4 sekcje→T6, App/Start→T7, QA+DoD→T8. Poza zakresem zgodnie ze specem. ✓
- **Placeholdery:** brak — każdy krok kodowy ma pełny kod. ✓
- **Spójność typów:** sygnatury `seriaWynikow(postepy, mapaEtykiet)`, `postepPerModul(postepy, mapaModulow)`, `aktywnosc(postepy, dzis)`, `pokrycie(postepy, liczebnosci)` zgodne między taskami; propsy `Statystyki` = to, co App buduje w T7; `MODULY_KOLEJNOSC` eksportowane w T2, użyte w T6. ✓
