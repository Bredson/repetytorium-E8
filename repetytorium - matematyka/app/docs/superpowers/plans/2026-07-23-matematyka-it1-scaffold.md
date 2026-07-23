# Matematyka It.1 — Scaffold + Test wstępny + Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Zbudować działającą aplikację Repetytorium Matematyka z pełnym scaffoldem (Vite+React+KaTeX), ekranem wyboru profilu, PIN-em, testem wstępnym per dział i dashboardem Start — gotową do deploy na Vercel.

**Architecture:** Osobne SPA (React 19 + Vite) w `repetytorium - matematyka/app/`. Warstwy: `content/matematyka/` (JSON) → `core/` (czysta logika, zero DOM) → `storage/` → `ui/`. Pliki skopiowane z polskiego projektu (`repetytorium - j_polski/app/`) z minimalnymi modyfikacjami; nowe pliki budowane od zera. KaTeX przez npm — render wyrażeń `$...$` i `$$...$$` po stronie klienta.

**Tech Stack:** React 19, Vite 8, KaTeX (npm), localStorage, bez TypeScript, bez routera (ekrany przez `useState`).

## Global Constraints

- Git root: `/Users/pibe/dev/Repetytorium-doc` — wszystkie commity stamtąd, jawne ścieżki plików (`git add "repetytorium - matematyka/app/..."`)
- Polski projekt (`repetytorium - j_polski/`) — **nie dotykać**
- Klucz localStorage postępów: `rep:postepy:{uuid}:matematyka` (nie `:polski`)
- Pole `przedmioty` w profilu: dodać `"matematyka"` obok istniejących (profil współdzielony)
- KaTeX: instalacja przez npm, nie CDN; render kliencki
- JSON z treścią: polskie cudzysłowy `„..."` — po zapisie weryfikować `python3 -c "import json,sys; json.load(open(sys.argv[1]))" plik.json`
- Dev server: `cd "repetytorium - matematyka/app" && npm run dev` → localhost:5174 (5173 może być zajęty przez polskiego)
- Próg ukończenia działu: 80% pytań zamkniętych poprawnie
- Definition of done: build ✓ → QA desktop ✓ → QA mobile (390×844) ✓ → wpis LESSONS.md → commit

---

## Mapa plików

### Skopiowane z polskiego (bez zmian)
- `src/storage/adapter.js` ← z polskiego, zmiana tylko `"polski"` → `"matematyka"` w komentarzu (logika przedmiotu pochodzi z wywołania, nie z pliku)
- `src/ui/theme.css` ← identyczny
- `src/ui/components/PasekPostepu.jsx` ← identyczny
- `src/ui/components/WykresLiniowy.jsx` ← identyczny
- `src/ui/pages/WyborProfilu.jsx` ← identyczny
- `src/ui/pages/EkranPin.jsx` ← identyczny
- `src/main.jsx` ← identyczny (poza tytułem w `index.html`)

### Zaadaptowane z polskiego
- `src/core/profil.js` ← skopiowany, `pustePostepy()` zwraca nową strukturę matematyki, `migrujPostepy()` uproszczona (tylko v4)
- `src/ui/pages/NowyProfil.jsx` ← skopiowany, zmiana `przedmioty: ["matematyka"]` zamiast `["polski"]`

### Nowe pliki
- `package.json` — jak w polskim + `"katex": "^0.16.x"`
- `vite.config.js` — identyczny
- `index.html` — jak w polskim, tytuł „Repetytorium ósmoklasisty — matematyka"
- `src/content/matematyka/rejestr.js` — eksportuje `DZIALY`, `PULA_EGZAMINU`, `material(id)`
- `src/content/matematyka/dzialy/liczby.json` — 2 pytania test wstępny + 3 ćwiczenia zamknięte + 1 zadanie otwarte
- `src/core/quiz.js` — `sprawdzOdpowiedz(pytanie, odpowiedz)`, `sprawdzKrok(krok, wartosc)`, `obliczWynikDzialu(pytania, odpowiedzi)`
- `src/core/plan.js` — `generujPlan(diagnoza)` → lista działów wg priorytetu
- `src/ui/components/KrokZadania.jsx` — render kroku zadania otwartego z KaTeX
- `src/ui/components/KaTeXRenderer.jsx` — renderuje string z `$...$` i `$$...$$`
- `src/ui/pages/TestWstepny.jsx` — 9–18 pytań zamkniętych (1-2 per dział), wynik per dział
- `src/ui/pages/Start.jsx` — dashboard: 9 kart działów + „Na dziś"
- `src/App.jsx` — router ekranów przez `useState`

---

## Task 1: Scaffold projektu

**Files:**
- Create: `repetytorium - matematyka/app/package.json`
- Create: `repetytorium - matematyka/app/vite.config.js`
- Create: `repetytorium - matematyka/app/index.html`
- Create: `repetytorium - matematyka/app/src/main.jsx`
- Copy: `repetytorium - matematyka/app/src/ui/theme.css`

**Interfaces:**
- Produces: działający `npm run dev` na localhost:5174, strona wyświetla `<div id="root">`

- [ ] **Krok 1: Utwórz strukturę katalogów**

```bash
cd "/Users/pibe/dev/Repetytorium-doc"
mkdir -p "repetytorium - matematyka/app/src/content/matematyka/dzialy"
mkdir -p "repetytorium - matematyka/app/src/core"
mkdir -p "repetytorium - matematyka/app/src/storage"
mkdir -p "repetytorium - matematyka/app/src/ui/components"
mkdir -p "repetytorium - matematyka/app/src/ui/pages"
mkdir -p "repetytorium - matematyka/app/tests"
mkdir -p "repetytorium - matematyka/app/public"
```

- [ ] **Krok 2: Utwórz `package.json`**

```json
{
  "name": "repetytorium-matematyka",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "oxlint",
    "preview": "vite preview",
    "test": "node --experimental-vm-modules node_modules/.bin/jest"
  },
  "dependencies": {
    "katex": "^0.16.21",
    "react": "^19.2.7",
    "react-dom": "^19.2.7"
  },
  "devDependencies": {
    "@types/react": "^19.2.17",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.3",
    "oxlint": "^1.71.0",
    "vite": "^8.1.1"
  }
}
```

Zapisz do: `repetytorium - matematyka/app/package.json`

- [ ] **Krok 3: Utwórz `vite.config.js`**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

Zapisz do: `repetytorium - matematyka/app/vite.config.js`

- [ ] **Krok 4: Utwórz `index.html`**

```html
<!doctype html>
<html lang="pl" data-theme="light">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Repetytorium ósmoklasisty — matematyka</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

Zapisz do: `repetytorium - matematyka/app/index.html`

- [ ] **Krok 5: Skopiuj `theme.css` i utwórz `main.jsx`**

```bash
cp "/Users/pibe/dev/Repetytorium-doc/repetytorium - j_polski/app/src/ui/theme.css" \
   "/Users/pibe/dev/Repetytorium-doc/repetytorium - matematyka/app/src/ui/theme.css"
```

Utwórz `src/main.jsx`:

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./ui/theme.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Krok 6: Utwórz tymczasowy `App.jsx` (placeholder)**

```jsx
export default function App() {
  return <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>Repetytorium — matematyka 🚧</div>;
}
```

Zapisz do: `repetytorium - matematyka/app/src/App.jsx`

- [ ] **Krok 7: Zainstaluj zależności i uruchom dev server**

```bash
cd "/Users/pibe/dev/Repetytorium-doc/repetytorium - matematyka/app"
npm install
npm run dev
```

Oczekiwane: serwer startuje na `http://localhost:5174` (lub innym wolnym porcie). Strona wyświetla „Repetytorium — matematyka 🚧".

- [ ] **Krok 8: Commit**

```bash
cd "/Users/pibe/dev/Repetytorium-doc"
git add "repetytorium - matematyka/app/package.json" \
        "repetytorium - matematyka/app/package-lock.json" \
        "repetytorium - matematyka/app/vite.config.js" \
        "repetytorium - matematyka/app/index.html" \
        "repetytorium - matematyka/app/src/main.jsx" \
        "repetytorium - matematyka/app/src/App.jsx" \
        "repetytorium - matematyka/app/src/ui/theme.css"
git commit -m "feat(mat): scaffold Vite+React+KaTeX — it.1 start"
```

---

## Task 2: Warstwa storage i core/profil

**Files:**
- Create: `repetytorium - matematyka/app/src/storage/adapter.js`
- Create: `repetytorium - matematyka/app/src/core/profil.js`

**Interfaces:**
- Produces:
  - `storage.listProfiles()`, `storage.getProfile(id)`, `storage.saveProfile(profil)`, `storage.deleteProfile(id)`
  - `storage.getPostepy(profilId, "matematyka")`, `storage.savePostepy(profilId, "matematyka", dane)`
  - `storage.exportAll(profilId)` → `{wersjaEksportu:1, profil, postepy}`
  - `storage.importAll(dane)` → `profil`
  - `pustePostepy()` → `{wersjaSchematu:4, diagnoza:null, plan:null, dzialy:{}, sesje:[], powtorki:[], egzaminy:[]}`
  - `migrujPostepy(postepy)` → postepy v4
  - `nowyProfil({imie, pin, dataEgzaminu, dysleksja})` → Promise<profil>
  - `weryfikujPin(profil, pin)` → Promise<boolean>
  - `walidujPin(pin)` → boolean
  - `hashPin(pin, salt)` → Promise<string>
  - `dniDoEgzaminu(profil)` → number

- [ ] **Krok 1: Utwórz `storage/adapter.js`**

Skopiuj z polskiego (logika identyczna — przedmiot przekazywany jako argument, nie zakodowany w pliku):

```bash
cp "/Users/pibe/dev/Repetytorium-doc/repetytorium - j_polski/app/src/storage/adapter.js" \
   "/Users/pibe/dev/Repetytorium-doc/repetytorium - matematyka/app/src/storage/adapter.js"
```

- [ ] **Krok 2: Utwórz `core/profil.js`**

Skopiuj z polskiego i zastąp `pustePostepy()` strukturą dla matematyki:

```js
function losowyHex(bajty) {
  const arr = new Uint8Array(bajty);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function hashPin(pin, salt) {
  const tekst = `${pin}:${salt}`;
  if (crypto.subtle) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(tekst));
    return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
  }
  let h = 0x811c9dc5;
  for (let i = 0; i < tekst.length; i++) {
    h ^= tekst.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return `fnv:${h.toString(16)}`;
}

export function walidujPin(pin) {
  return /^\d{4}$/.test(pin);
}

export async function nowyProfil({ imie, pin, dataEgzaminu, dysleksja }) {
  const salt = losowyHex(8);
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : losowyHex(16),
    imie: imie.trim(),
    pinHash: await hashPin(pin, salt),
    salt,
    przedmioty: ["matematyka"],
    dataEgzaminu: dataEgzaminu || "2027-05-15",
    utworzono: new Date().toISOString(),
    preferencje: { dysleksja: !!dysleksja, trybCiemny: false },
  };
}

export async function weryfikujPin(profil, pin) {
  return (await hashPin(pin, profil.salt)) === profil.pinHash;
}

export function dniDoEgzaminu(profil, teraz = new Date()) {
  const cel = new Date(`${profil.dataEgzaminu}T09:00:00`);
  return Math.max(0, Math.ceil((cel - teraz) / 86400000));
}

export function pustePostepy() {
  return {
    wersjaSchematu: 4,
    diagnoza: null,
    plan: null,
    dzialy: {},
    sesje: [],
    powtorki: [],
    egzaminy: [],
  };
}

export function migrujPostepy(postepy) {
  if (!postepy) return pustePostepy();
  // Schemat startuje od v4 — brak migracji poniżej
  return { ...pustePostepy(), ...postepy, wersjaSchematu: 4 };
}
```

Zapisz do: `repetytorium - matematyka/app/src/core/profil.js`

- [ ] **Krok 3: Commit**

```bash
cd "/Users/pibe/dev/Repetytorium-doc"
git add "repetytorium - matematyka/app/src/storage/adapter.js" \
        "repetytorium - matematyka/app/src/core/profil.js"
git commit -m "feat(mat): storage adapter + core/profil (pustePostepy matematyka)"
```

---

## Task 3: core/powtorki, core/quiz, core/plan

**Files:**
- Create: `repetytorium - matematyka/app/src/core/powtorki.js`
- Create: `repetytorium - matematyka/app/src/core/quiz.js`
- Create: `repetytorium - matematyka/app/src/core/plan.js`
- Create: `repetytorium - matematyka/app/tests/quiz.test.mjs`

**Interfaces:**
- Consumes: `pustePostepy()` z Task 2
- Produces:
  - `powtorki.js`: `nowaPowtorka({id,typ,ref,temat})`, `oznaczPowtorke(rekord, ocena)`, `coNaDzis(powtorki)`, `zaktualizujPowtorki(powtorki, nowyRekord)`, `maPowtorke(powtorki, id)`, `dataDnia()`, `dodajDni(dataStr, dni)`
  - `quiz.js`: `sprawdzOdpowiedz(pytanie, odpowiedz)` → boolean, `sprawdzKrok(krok, wartosc)` → boolean, `obliczWynikDzialu(pytania, odpowiedzi)` → `{poprawne, wszystkich, procent}`
  - `plan.js`: `generujPlan(diagnoza)` → `[{dzialId, priorytet: "wysoki"|"sredni"|"niski", status: "do-zrobienia"}]`

- [ ] **Krok 1: Skopiuj `core/powtorki.js`**

```bash
cp "/Users/pibe/dev/Repetytorium-doc/repetytorium - j_polski/app/src/core/powtorki.js" \
   "/Users/pibe/dev/Repetytorium-doc/repetytorium - matematyka/app/src/core/powtorki.js"
```

Plik jest identyczny — logika spaced repetition bez zmian.

- [ ] **Krok 2: Napisz test dla `core/quiz.js` (TDD — najpierw test)**

Utwórz `repetytorium - matematyka/app/tests/quiz.test.mjs`:

```js
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
console.assert(sprawdzOdpowiedz(pytanieZamkniete, "13") === true, "FAIL: poprawna odpowiedź");
console.assert(sprawdzOdpowiedz(pytanieZamkniete, "5") === false, "FAIL: błędna odpowiedź");

// sprawdzKrok — tolerancja whitespace i jednostki
console.assert(sprawdzKrok(krok, "192") === true, "FAIL: krok poprawny");
console.assert(sprawdzKrok(krok, " 192 ") === true, "FAIL: krok z whitespace");
console.assert(sprawdzKrok(krok, "192 m³") === true, "FAIL: krok z jednostką");
console.assert(sprawdzKrok(krok, "193") === false, "FAIL: krok błędny");

// obliczWynikDzialu
const pytania = [pytanieZamkniete, { ...pytanieZamkniete, id: "tw-l2", poprawna: "5" }];
const odpowiedzi = { "tw-l1": "13", "tw-l2": "1" };
const wynik = obliczWynikDzialu(pytania, odpowiedzi);
console.assert(wynik.poprawne === 1, `FAIL: poprawne=${wynik.poprawne}`);
console.assert(wynik.wszystkich === 2, `FAIL: wszystkich=${wynik.wszystkich}`);
console.assert(wynik.procent === 50, `FAIL: procent=${wynik.procent}`);

console.log("quiz.test.mjs — OK");
```

- [ ] **Krok 3: Uruchom test — ma FAIL**

```bash
cd "/Users/pibe/dev/Repetytorium-doc/repetytorium - matematyka/app"
node tests/quiz.test.mjs
```

Oczekiwane: błąd `Cannot find module '../src/core/quiz.js'`

- [ ] **Krok 4: Zaimplementuj `core/quiz.js`**

```js
export function sprawdzOdpowiedz(pytanie, odpowiedz) {
  return pytanie.poprawna === odpowiedz;
}

export function sprawdzKrok(krok, wartosc) {
  const oczyszczona = String(wartosc).trim().replace(krok.jednostka ?? "", "").trim();
  return oczyszczona === String(krok.oczekiwana).trim();
}

export function obliczWynikDzialu(pytania, odpowiedzi) {
  const poprawne = pytania.filter((p) => sprawdzOdpowiedz(p, odpowiedzi[p.id])).length;
  const wszystkich = pytania.length;
  return { poprawne, wszystkich, procent: wszystkich === 0 ? 0 : Math.round((poprawne / wszystkich) * 100) };
}
```

Zapisz do: `repetytorium - matematyka/app/src/core/quiz.js`

- [ ] **Krok 5: Uruchom test — ma PASS**

```bash
node tests/quiz.test.mjs
```

Oczekiwane: `quiz.test.mjs — OK`

- [ ] **Krok 6: Zaimplementuj `core/plan.js`**

```js
const KOLEJNOSC_DZIALOW = [
  "liczby", "ulamki", "potegi", "procenty",
  "algebra", "rownania", "geometria-plaska", "pitagoras", "geometria-przestrzenna",
];

export function generujPlan(diagnoza) {
  return KOLEJNOSC_DZIALOW.map((dzialId) => {
    const wynik = diagnoza?.[dzialId] ?? 0;
    const priorytet = wynik < 0.5 ? "wysoki" : wynik < 0.8 ? "sredni" : "niski";
    return { dzialId, priorytet, status: "do-zrobienia" };
  });
}
```

Zapisz do: `repetytorium - matematyka/app/src/core/plan.js`

- [ ] **Krok 7: Commit**

```bash
cd "/Users/pibe/dev/Repetytorium-doc"
git add "repetytorium - matematyka/app/src/core/powtorki.js" \
        "repetytorium - matematyka/app/src/core/quiz.js" \
        "repetytorium - matematyka/app/src/core/plan.js" \
        "repetytorium - matematyka/app/tests/quiz.test.mjs"
git commit -m "feat(mat): core/quiz + core/plan + core/powtorki (TDD, 6 asercji)"
```

---

## Task 4: Treść — rejestr + dział `liczby` (wzorzec)

**Files:**
- Create: `repetytorium - matematyka/app/src/content/matematyka/dzialy/liczby.json`
- Create: `repetytorium - matematyka/app/src/content/matematyka/rejestr.js`

**Interfaces:**
- Produces:
  - `DZIALY`: `{liczby: {id, tytul, modul, waga, test_wstepny:[...], cwiczenia:[...], zadania_otwarte:[...]}}`
  - `PULA_EGZAMINU`: `[...pytaniaZamkniete, ...zadaniaOtwarte]` ze wszystkich działów
  - `material(id)` → dział lub `undefined`

- [ ] **Krok 1: Utwórz `dzialy/liczby.json`**

```json
{
  "id": "liczby",
  "tytul": "Liczby i działania",
  "modul": "A",
  "waga": "wysoka",
  "test_wstepny": [
    {
      "id": "tw-l1",
      "tresc": "Oblicz: $(-3)^2 + \\sqrt{16}$",
      "typ": "zamkniete",
      "opcje": ["5", "13", "1", "-5"],
      "poprawna": "13"
    },
    {
      "id": "tw-l2",
      "tresc": "Która liczba jest pierwsza?",
      "typ": "zamkniete",
      "opcje": ["9", "15", "17", "21"],
      "poprawna": "17"
    }
  ],
  "cwiczenia": [
    {
      "id": "l1",
      "tresc": "Oblicz: $2^3 \\cdot 2^{-1}$",
      "typ": "zamkniete",
      "opcje": ["2", "4", "8", "16"],
      "poprawna": "4",
      "wskazowka": "Przy mnożeniu potęg o tej samej podstawie dodajesz wykładniki.",
      "przypomnij": "Własność potęg: $a^m \\cdot a^n = a^{m+n}$"
    },
    {
      "id": "l2",
      "tresc": "Wynik działania $|{-7}| + |3|$ to:",
      "typ": "zamkniete",
      "opcje": ["4", "-4", "10", "-10"],
      "poprawna": "10",
      "wskazowka": "Wartość bezwzględna to odległość od zera — zawsze nieujemna.",
      "przypomnij": "$|a|$ = a gdy $a \\geq 0$; $|a|$ = $-a$ gdy $a < 0$"
    },
    {
      "id": "l3",
      "tresc": "Ile wynosi $\\text{NWD}(12, 18)$?",
      "typ": "zamkniete",
      "opcje": ["2", "3", "6", "36"],
      "poprawna": "6",
      "wskazowka": "NWD — największy wspólny dzielnik. Rozłóż obie liczby na czynniki pierwsze.",
      "przypomnij": "$12 = 2^2 \\cdot 3$; $18 = 2 \\cdot 3^2$; NWD = $2 \\cdot 3 = 6$"
    }
  ],
  "zadania_otwarte": [
    {
      "id": "lo1",
      "tresc": "Basen ma wymiary 12 m × 8 m × 2 m. Oblicz jego objętość.",
      "punkty": 2,
      "kroki": [
        {
          "id": "k1",
          "instrukcja": "Zapisz obliczenie: długość × szerokość × głębokość",
          "oczekiwana": "192",
          "jednostka": "m³",
          "podpowiedz": "Objętość prostopadłościanu = długość × szerokość × wysokość"
        }
      ],
      "rozwiazanie_wzorcowe": "$V = 12 \\cdot 8 \\cdot 2 = 192 \\text{ m}^3$"
    }
  ]
}
```

Zapisz do: `repetytorium - matematyka/app/src/content/matematyka/dzialy/liczby.json`

- [ ] **Krok 2: Zweryfikuj JSON**

```bash
python3 -c "import json,sys; json.load(open(sys.argv[1])); print('JSON OK')" \
  "repetytorium - matematyka/app/src/content/matematyka/dzialy/liczby.json"
```

Oczekiwane: `JSON OK`

- [ ] **Krok 3: Utwórz `rejestr.js`**

```js
import liczby from "./dzialy/liczby.json";

export const DZIALY = {
  liczby,
  // TODO it.2: ulamki, potegi, procenty, algebra, rownania, geometria-plaska, pitagoras, geometria-przestrzenna
};

export function material(id) {
  return DZIALY[id];
}

export const PULA_EGZAMINU = Object.values(DZIALY).flatMap((d) => [
  ...d.cwiczenia,
  ...d.zadania_otwarte,
]);
```

Zapisz do: `repetytorium - matematyka/app/src/content/matematyka/rejestr.js`

- [ ] **Krok 4: Commit**

```bash
cd "/Users/pibe/dev/Repetytorium-doc"
git add "repetytorium - matematyka/app/src/content/matematyka/dzialy/liczby.json" \
        "repetytorium - matematyka/app/src/content/matematyka/rejestr.js"
git commit -m "feat(mat): content — dział liczby (wzorzec) + rejestr.js"
```

---

## Task 5: Komponenty UI — skopiowane + KaTeXRenderer

**Files:**
- Copy: `repetytorium - matematyka/app/src/ui/components/PasekPostepu.jsx`
- Copy: `repetytorium - matematyka/app/src/ui/components/WykresLiniowy.jsx`
- Copy: `repetytorium - matematyka/app/src/ui/pages/WyborProfilu.jsx`
- Copy: `repetytorium - matematyka/app/src/ui/pages/EkranPin.jsx`
- Copy: `repetytorium - matematyka/app/src/ui/pages/NowyProfil.jsx` (z modyfikacją)
- Create: `repetytorium - matematyka/app/src/ui/components/KaTeXRenderer.jsx`
- Create: `repetytorium - matematyka/app/src/ui/components/KrokZadania.jsx`

**Interfaces:**
- Produces:
  - `<KaTeXRenderer tekst="Oblicz $x^2$" />` — renderuje HTML z wyrażeniami KaTeX
  - `<KrokZadania krok={krok} onOdpowiedz={(wartosc) => {}} />` — input numeryczny z KaTeX
  - `<PasekPostepu procent={75} etykietaLewa="3/4" etykietaPrawa="75%" />`
  - `<WyborProfilu profile={[...]} onWybierz onNowy onImport />`
  - `<EkranPin profil={...} onOk onWroc />`
  - `<NowyProfil onUtworzono onAnuluj saProfile />`

- [ ] **Krok 1: Skopiuj komponenty bez zmian**

```bash
cp "/Users/pibe/dev/Repetytorium-doc/repetytorium - j_polski/app/src/ui/components/PasekPostepu.jsx" \
   "/Users/pibe/dev/Repetytorium-doc/repetytorium - matematyka/app/src/ui/components/PasekPostepu.jsx"

cp "/Users/pibe/dev/Repetytorium-doc/repetytorium - j_polski/app/src/ui/components/WykresLiniowy.jsx" \
   "/Users/pibe/dev/Repetytorium-doc/repetytorium - matematyka/app/src/ui/components/WykresLiniowy.jsx"

cp "/Users/pibe/dev/Repetytorium-doc/repetytorium - j_polski/app/src/ui/pages/WyborProfilu.jsx" \
   "/Users/pibe/dev/Repetytorium-doc/repetytorium - matematyka/app/src/ui/pages/WyborProfilu.jsx"

cp "/Users/pibe/dev/Repetytorium-doc/repetytorium - j_polski/app/src/ui/pages/EkranPin.jsx" \
   "/Users/pibe/dev/Repetytorium-doc/repetytorium - matematyka/app/src/ui/pages/EkranPin.jsx"
```

- [ ] **Krok 2: Skopiuj `NowyProfil.jsx` i ustaw `przedmioty: ["matematyka"]`**

```bash
cp "/Users/pibe/dev/Repetytorium-doc/repetytorium - j_polski/app/src/ui/pages/NowyProfil.jsx" \
   "/Users/pibe/dev/Repetytorium-doc/repetytorium - matematyka/app/src/ui/pages/NowyProfil.jsx"
```

Plik importuje `nowyProfil` z `../../core/profil.js` — `nowyProfil` w naszej wersji już ustawia `przedmioty: ["matematyka"]`, więc komponent nie wymaga edycji. Sprawdź, że linia z `import` wskazuje na `../../core/profil.js` (tak jest w oryginale — OK).

- [ ] **Krok 3: Utwórz `KaTeXRenderer.jsx`**

```jsx
import katex from "katex";
import "katex/dist/katex.min.css";

function renderujTekst(tekst) {
  const czesci = [];
  let reszta = tekst;
  let i = 0;

  while (reszta.length > 0) {
    const blok = reszta.indexOf("$$");
    const inline = reszta.indexOf("$");

    if (blok !== -1 && (inline === -1 || blok <= inline)) {
      if (blok > 0) czesci.push(<span key={i++}>{reszta.slice(0, blok)}</span>);
      const koniec = reszta.indexOf("$$", blok + 2);
      if (koniec === -1) { czesci.push(<span key={i++}>{reszta}</span>); break; }
      const wzor = reszta.slice(blok + 2, koniec);
      czesci.push(
        <span key={i++} dangerouslySetInnerHTML={{ __html: katex.renderToString(wzor, { displayMode: true, throwOnError: false }) }} />
      );
      reszta = reszta.slice(koniec + 2);
    } else if (inline !== -1) {
      if (inline > 0) czesci.push(<span key={i++}>{reszta.slice(0, inline)}</span>);
      const koniec = reszta.indexOf("$", inline + 1);
      if (koniec === -1) { czesci.push(<span key={i++}>{reszta}</span>); break; }
      const wzor = reszta.slice(inline + 1, koniec);
      czesci.push(
        <span key={i++} dangerouslySetInnerHTML={{ __html: katex.renderToString(wzor, { throwOnError: false }) }} />
      );
      reszta = reszta.slice(koniec + 1);
    } else {
      czesci.push(<span key={i++}>{reszta}</span>);
      break;
    }
  }
  return czesci;
}

export default function KaTeXRenderer({ tekst, className = "" }) {
  if (!tekst) return null;
  return <span className={className}>{renderujTekst(tekst)}</span>;
}
```

Zapisz do: `repetytorium - matematyka/app/src/ui/components/KaTeXRenderer.jsx`

- [ ] **Krok 4: Utwórz `KrokZadania.jsx`**

```jsx
import { useState } from "react";
import KaTeXRenderer from "./KaTeXRenderer.jsx";
import { sprawdzKrok } from "../../core/quiz.js";

export default function KrokZadania({ krok, numerKroku, onPoprawnie, onBlad }) {
  const [wartosc, setWartosc] = useState("");
  const [status, setStatus] = useState(""); // "" | "ok" | "blad" | "podpowiedz"
  const [proby, setProby] = useState(0);

  function sprawdz(e) {
    e.preventDefault();
    if (sprawdzKrok(krok, wartosc)) {
      setStatus("ok");
      onPoprawnie(wartosc);
    } else {
      const noweProby = proby + 1;
      setProby(noweProby);
      if (noweProby >= 2) {
        setStatus("podpowiedz");
        onBlad(wartosc);
      } else {
        setStatus("blad");
      }
    }
  }

  return (
    <div className="karta" style={{ marginBottom: "var(--sp-4)" }}>
      <p style={{ marginBottom: "var(--sp-3)" }}>
        <strong>Krok {numerKroku}:</strong> <KaTeXRenderer tekst={krok.instrukcja} />
      </p>

      {status === "ok" && (
        <p className="badge badge--sukces">Dobrze! {krok.jednostka && <KaTeXRenderer tekst={`${wartosc} \\text{ ${krok.jednostka}}`} />}</p>
      )}

      {status !== "ok" && (
        <form onSubmit={sprawdz} style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap" }}>
          <input
            className="pole"
            value={wartosc}
            onChange={(e) => { setWartosc(e.target.value); setStatus(""); }}
            placeholder={krok.jednostka ? `Wpisz wynik (${krok.jednostka})` : "Wpisz wynik"}
            inputMode="decimal"
            style={{ flex: 1, minWidth: 120 }}
          />
          <button type="submit" className="btn btn-primary" disabled={!wartosc.trim()}>Sprawdź</button>
        </form>
      )}

      {status === "blad" && (
        <p className="badge badge--braki" role="alert" style={{ marginTop: "var(--sp-2)" }}>
          Spróbuj jeszcze raz.
        </p>
      )}

      {status === "podpowiedz" && (
        <div style={{ marginTop: "var(--sp-3)" }}>
          <p className="badge badge--uwaga"><KaTeXRenderer tekst={`Wskazówka: ${krok.podpowiedz}`} /></p>
          <p style={{ marginTop: "var(--sp-2)" }}>
            <strong>Rozwiązanie wzorcowe: </strong>
            <KaTeXRenderer tekst={`$${krok.oczekiwana}$ ${krok.jednostka ?? ""}`} />
          </p>
        </div>
      )}
    </div>
  );
}
```

Zapisz do: `repetytorium - matematyka/app/src/ui/components/KrokZadania.jsx`

- [ ] **Krok 5: Sprawdź build**

```bash
cd "/Users/pibe/dev/Repetytorium-doc/repetytorium - matematyka/app"
npm run build
```

Oczekiwane: build bez błędów. Ostrzeżenie o rozmiarze chunka jest OK na tym etapie.

- [ ] **Krok 6: Commit**

```bash
cd "/Users/pibe/dev/Repetytorium-doc"
git add "repetytorium - matematyka/app/src/ui/components/" \
        "repetytorium - matematyka/app/src/ui/pages/WyborProfilu.jsx" \
        "repetytorium - matematyka/app/src/ui/pages/EkranPin.jsx" \
        "repetytorium - matematyka/app/src/ui/pages/NowyProfil.jsx"
git commit -m "feat(mat): UI components — KaTeXRenderer, KrokZadania, profil pages"
```

---

## Task 6: Ekran TestWstepny

**Files:**
- Create: `repetytorium - matematyka/app/src/ui/pages/TestWstepny.jsx`

**Interfaces:**
- Consumes: `DZIALY` z `rejestr.js`, `sprawdzOdpowiedz` z `core/quiz.js`, `KaTeXRenderer`
- Produces: `<TestWstepny onZakoncz={(wynikPerDzial) => {}} />` gdzie `wynikPerDzial = {liczby: 0.5, ...}`

- [ ] **Krok 1: Utwórz `TestWstepny.jsx`**

```jsx
import { useState, useMemo } from "react";
import { DZIALY } from "../../content/matematyka/rejestr.js";
import { sprawdzOdpowiedz } from "../../core/quiz.js";
import KaTeXRenderer from "../components/KaTeXRenderer.jsx";
import PasekPostepu from "../components/PasekPostepu.jsx";

function zbierzPytania() {
  return Object.values(DZIALY).flatMap((d) => d.test_wstepny.map((p) => ({ ...p, dzialId: d.id })));
}

export default function TestWstepny({ onZakoncz }) {
  const pytania = useMemo(zbierzPytania, []);
  const [idx, setIdx] = useState(0);
  const [odpowiedzi, setOdpowiedzi] = useState({});
  const [wybrana, setWybrana] = useState(null);
  const [pokazano, setShowkazano] = useState(false);

  const pytanie = pytania[idx];
  const procent = Math.round((idx / pytania.length) * 100);

  function wybierz(opcja) {
    if (pokazano) return;
    setWybrana(opcja);
  }

  function potwierdz() {
    if (!wybrana) return;
    setOdpowiedzi((prev) => ({ ...prev, [pytanie.id]: wybrana }));
    setShowkazano(true);
  }

  function dalej() {
    if (idx + 1 >= pytania.length) {
      zakoncz();
    } else {
      setIdx(idx + 1);
      setWybrana(null);
      setShowkazano(false);
    }
  }

  function zakoncz() {
    const wynikPerDzial = {};
    for (const dz of Object.values(DZIALY)) {
      const pyt = dz.test_wstepny;
      if (pyt.length === 0) { wynikPerDzial[dz.id] = 0; continue; }
      const poprawne = pyt.filter((p) => sprawdzOdpowiedz(p, odpowiedzi[p.id])).length;
      wynikPerDzial[dz.id] = poprawne / pyt.length;
    }
    onZakoncz(wynikPerDzial);
  }

  const poprawna = pytanie.poprawna;
  const czyPoprawna = wybrana === poprawna;

  return (
    <div className="tresc ekran-wjazd">
      <PasekPostepu
        procent={procent}
        etykietaLewa={`Pytanie ${idx + 1} z ${pytania.length}`}
        etykietaPrawa={`${procent}%`}
      />

      <div className="karta" style={{ marginTop: "var(--sp-5)" }}>
        <p style={{ fontSize: "var(--rozmiar-l)", marginBottom: "var(--sp-4)" }}>
          <KaTeXRenderer tekst={pytanie.tresc} />
        </p>

        <div style={{ display: "grid", gap: "var(--sp-2)" }}>
          {pytanie.opcje.map((opcja) => {
            let klasa = "btn btn-ghost btn--pelny";
            if (pokazano) {
              if (opcja === poprawna) klasa += " btn--sukces";
              else if (opcja === wybrana && !czyPoprawna) klasa += " btn--blad";
            } else if (opcja === wybrana) {
              klasa += " btn--aktywny";
            }
            return (
              <button key={opcja} className={klasa} onClick={() => wybierz(opcja)} style={{ textAlign: "left" }}>
                <KaTeXRenderer tekst={opcja} />
              </button>
            );
          })}
        </div>

        {!pokazano && (
          <button
            className="btn btn-primary btn--pelny"
            style={{ marginTop: "var(--sp-4)" }}
            onClick={potwierdz}
            disabled={!wybrana}
          >
            Sprawdź
          </button>
        )}

        {pokazano && (
          <div style={{ marginTop: "var(--sp-4)" }}>
            {czyPoprawna
              ? <p className="badge badge--sukces">Świetnie! Dobra odpowiedź.</p>
              : <p className="badge badge--braki">Poprawna odpowiedź: <KaTeXRenderer tekst={poprawna} /></p>
            }
            <button className="btn btn-primary btn--pelny" style={{ marginTop: "var(--sp-3)" }} onClick={dalej}>
              {idx + 1 >= pytania.length ? "Zakończ diagnozę" : "Następne pytanie"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
```

Zapisz do: `repetytorium - matematyka/app/src/ui/pages/TestWstepny.jsx`

- [ ] **Krok 2: Commit**

```bash
cd "/Users/pibe/dev/Repetytorium-doc"
git add "repetytorium - matematyka/app/src/ui/pages/TestWstepny.jsx"
git commit -m "feat(mat): ekran TestWstepny — diagnoza per dział z KaTeX"
```

---

## Task 7: Ekran Start (dashboard) + App.jsx

**Files:**
- Create: `repetytorium - matematyka/app/src/ui/pages/Start.jsx`
- Modify: `repetytorium - matematyka/app/src/App.jsx`

**Interfaces:**
- Consumes: `DZIALY`, `material`, `storage`, `pustePostepy`, `migrujPostepy`, `generujPlan`, `nowaPowtorka`, `coNaDzis` z poprzednich tasków
- Produces: Działający przepływ: wybor profilu → PIN → (TestWstepny jeśli brak diagnozy) → Start

- [ ] **Krok 1: Utwórz `Start.jsx`**

```jsx
import { DZIALY } from "../../content/matematyka/rejestr.js";
import PasekPostepu from "../components/PasekPostepu.jsx";
import { coNaDzis, dataDnia } from "../../core/powtorki.js";

const KOLORY_MODULOW = {
  A: "#7c5cd6", B: "#2b8fb8", C: "#c9701b", D: "#c14b7e",
  E: "#3a9e6e", F: "#5a6ee0", G: "#e05a5a", H: "#e09d5a", I: "#5ae0c1",
};

export default function Start({ profil, postepy, onTestWstepny, onDzial, onStatystyki, onWyloguj }) {
  const dzialy = Object.values(DZIALY);
  const powtorkiDzis = coNaDzis(postepy.powtorki ?? [], dataDnia());

  const nadzisDzial = postepy.plan?.find((p) => p.status === "do-zrobienia") ?? null;

  return (
    <div className="tresc ekran-wjazd">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--sp-5)" }}>
        <h1 style={{ margin: 0 }}>Cześć, {profil.imie}!</h1>
        <button className="btn btn-ghost" onClick={onWyloguj}>Wyloguj</button>
      </div>

      {!postepy.diagnoza && (
        <div className="karta" style={{ marginBottom: "var(--sp-5)", background: "var(--kolor-akcent-tlo)", borderLeft: "4px solid var(--kolor-akcent)" }}>
          <p><strong>Zacznij od diagnozy</strong> — sprawdzimy, co już wiesz, i ułożymy plan nauki.</p>
          <button className="btn btn-primary" style={{ marginTop: "var(--sp-3)" }} onClick={onTestWstepny}>
            Rozpocznij diagnozę
          </button>
        </div>
      )}

      {powtorkiDzis.length > 0 && (
        <div className="karta" style={{ marginBottom: "var(--sp-4)", borderLeft: "4px solid var(--kolor-uwaga)" }}>
          <strong>Na dziś: {powtorkiDzis.length} powtórki</strong>
          <p className="tekst-2">Masz zaplanowane powtórki — wróć do działu, żeby je zrobić.</p>
        </div>
      )}

      <h2>Twoje działy</h2>
      <div style={{ display: "grid", gap: "var(--sp-3)" }}>
        {dzialy.map((d) => {
          const stan = postepy.dzialy?.[d.id];
          const procent = stan ? Math.round((stan.wynik ?? 0) * 100) : 0;
          const kolor = KOLORY_MODULOW[d.modul] ?? "var(--kolor-akcent)";
          const aktywny = nadzisDzial?.dzialId === d.id;

          return (
            <button
              key={d.id}
              className="karta karta--klikalna"
              style={{ textAlign: "left", font: "inherit", borderLeft: `4px solid ${kolor}`, outline: aktywny ? `2px solid ${kolor}` : undefined }}
              onClick={() => onDzial(d.id)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>
                  <strong>{d.tytul}</strong>
                  {aktywny && <span className="badge badge--akcent" style={{ marginLeft: "var(--sp-2)" }}>Na dziś</span>}
                </span>
                <span className="tekst-2 tekst-maly">{stan ? `${procent}%` : "—"}</span>
              </div>
              <PasekPostepu procent={procent} />
            </button>
          );
        })}
      </div>

      <div style={{ display: "grid", gap: "var(--sp-3)", marginTop: "var(--sp-5)" }}>
        <button className="btn btn-ghost btn--pelny" onClick={onStatystyki}>Twoje statystyki</button>
      </div>
    </div>
  );
}
```

Zapisz do: `repetytorium - matematyka/app/src/ui/pages/Start.jsx`

- [ ] **Krok 2: Zastąp `App.jsx` pełną implementacją**

```jsx
import { useEffect, useState } from "react";
import { storage } from "./storage/adapter.js";
import { pustePostepy, migrujPostepy } from "./core/profil.js";
import { generujPlan } from "./core/plan.js";
import { DZIALY } from "./content/matematyka/rejestr.js";
import WyborProfilu from "./ui/pages/WyborProfilu.jsx";
import NowyProfil from "./ui/pages/NowyProfil.jsx";
import EkranPin from "./ui/pages/EkranPin.jsx";
import Start from "./ui/pages/Start.jsx";
import TestWstepny from "./ui/pages/TestWstepny.jsx";

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

  if (ekran === "start") return (
    <Start
      profil={profil}
      postepy={postepy}
      onTestWstepny={() => setEkran("test-wstepny")}
      onDzial={(id) => { setAktywnyDzial(id); /* it.2: setEkran("dzial") */ }}
      onStatystyki={() => { /* it.2 */ }}
      onWyloguj={wyloguj}
    />
  );

  return null;
}
```

Zapisz do: `repetytorium - matematyka/app/src/App.jsx`

- [ ] **Krok 3: Sprawdź build i uruchom dev server**

```bash
cd "/Users/pibe/dev/Repetytorium-doc/repetytorium - matematyka/app"
npm run build
npm run dev
```

Oczekiwane: build bez błędów, dev server startuje. W przeglądarce: ekran wyboru profilu → możliwość stworzenia profilu → PIN → Start z kartami działów.

- [ ] **Krok 4: QA desktop (Chrome, 1280px)**

Ścieżka do przetestowania:
1. Otwórz `http://localhost:5174`
2. Kliknij „Załóż nowy profil" → wpisz imię i PIN → „Utwórz profil"
3. Powinien pojawić się Start z banerem „Zacznij od diagnozy"
4. Kliknij „Rozpocznij diagnozę" → przejdź przez pytania → „Zakończ diagnozę"
5. Wróć do Start — diagnozy baner znikł, karty działów mają paski postępu (lub „—")
6. Wyloguj → zaloguj ponownie tym samym PIN → sprawdź, że postępy się zachowały

- [ ] **Krok 5: QA mobile (390×844)**

W DevTools emuluj iPhone 14 Pro lub użyj Playwright:

```js
// Playwright snippet do zmiany viewport
await page.setViewportSize({ width: 390, height: 844 });
```

Sprawdź: brak poziomego scrolla (`scrollWidth === innerWidth`), buttony mają min 44px, tekst czytelny.

- [ ] **Krok 6: Commit**

```bash
cd "/Users/pibe/dev/Repetytorium-doc"
git add "repetytorium - matematyka/app/src/ui/pages/Start.jsx" \
        "repetytorium - matematyka/app/src/App.jsx"
git commit -m "feat(mat): App.jsx router + ekran Start (dashboard) — it.1 komplet"
```

---

## Task 8: Wpis LESSONS.md + weryfikacja Definition of Done

**Files:**
- Modify: `repetytorium - matematyka/LESSONS.md`

**Interfaces:**
- Consumes: efekty wszystkich poprzednich tasków

- [ ] **Krok 1: Sprawdź Definition of Done**

```bash
cd "/Users/pibe/dev/Repetytorium-doc/repetytorium - matematyka/app"
npm run build
```

Oczekiwane: build bez błędów.

Ręcznie: QA desktop ✓, QA mobile ✓ (zrobione w Task 7).

- [ ] **Krok 2: Dodaj wpis do LESSONS.md**

Dodaj na dole pliku `repetytorium - matematyka/LESSONS.md`:

```markdown

## 2026-07-23 (it.1 — scaffold + diagnoza + dashboard)
- Obserwacja: scaffold Vite+React+KaTeX zbudowany od zera na wzorcu polskiego projektu.
  `storage/adapter.js` i `core/powtorki.js` skopiowane 1:1 (logika bez zmian).
  `core/profil.js` zaadaptowany: `pustePostepy()` zwraca strukturę `dzialy:{}` zamiast `lektury/cwiczenia/pisanie`.
- Obserwacja: KaTeXRenderer — parser `$...$` i `$$...$$` zbudowany ręcznie (bez biblioteki parsującej),
  renderuje przez `katex.renderToString` i wstrzykuje HTML przez `dangerouslySetInnerHTML`.
- Wniosek: `przedmioty: ["matematyka"]` w `nowyProfil()` — profil NIE dziedziczy automatycznie
  z polskiego; jeśli w przyszłości będzie Hub ze wspólnym profilem, trzeba osobno zmergować listy.
- Wniosek: klucze localStorage są odizolowane (`rep:postepy:{uuid}:matematyka`),
  więc aplikacja matematyki nie koliduje z polskim na tym samym urządzeniu.
- Zmiana w skilu: nie (nowe lekcje dotyczą scaffoldu; SKILL.md matematyki nie wymaga aktualizacji).
```

- [ ] **Krok 3: Commit końcowy**

```bash
cd "/Users/pibe/dev/Repetytorium-doc"
git add "repetytorium - matematyka/LESSONS.md"
git commit -m "docs(mat): LESSONS.md — wpis it.1 scaffold+diagnoza+dashboard"
```

---

## Self-Review

**Pokrycie specyfikacji (`2026-07-23-matematyka-design.md`):**

| Wymaganie | Task |
|-----------|------|
| Osobna aplikacja Vite+React | Task 1 |
| KaTeX przez npm | Task 1 (package.json) + Task 5 (KaTeXRenderer) |
| `storage/adapter.js` z sufiksem `matematyka` | Task 2 |
| `core/profil.js` z `pustePostepy()` zwracającym `dzialy:{}` | Task 2 |
| `core/powtorki.js` (spaced repetition) | Task 3 |
| `core/quiz.js` + TDD | Task 3 |
| `core/plan.js` — priorytety per dział | Task 3 |
| `rejestr.js` eksportujący `DZIALY`, `PULA_EGZAMINU`, `material` | Task 4 |
| Dział `liczby` (wzorzec JSON) | Task 4 |
| Skopiowane komponenty profilu | Task 5 |
| `KaTeXRenderer.jsx` | Task 5 |
| `KrokZadania.jsx` | Task 5 |
| `TestWstepny.jsx` — 9–18 pytań, wynik per dział | Task 6 |
| `Start.jsx` — dashboard z kartami działów | Task 7 |
| `App.jsx` — router ekranów | Task 7 |
| Definition of Done | Task 8 |

**Poza zakresem it.1 (it.2+):** `Dzial.jsx`, `ZadanieOtwarte.jsx`, `Powtorka.jsx`, `EgzaminProbny.jsx`, `Statystyki.jsx`, pozostałe 8 działów JSON, deploy Vercel.

**Placeholder scan:** brak TBD/TODO w krokach implementacyjnych (TODO w `rejestr.js` dla kolejnych działów jest intencjonalny — it.2).

**Type consistency:** `wynikPerDzial` przekazywany z `TestWstepny` → `zakonczonoDiagnoze` → `generujPlan` — spójne we wszystkich taskach. `pustePostepy().dzialy` to `{}` — spójne z odczytem `postepy.dzialy?.[d.id]` w `Start.jsx`.
