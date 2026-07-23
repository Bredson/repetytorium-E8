# Design: Repetytorium — Matematyka (Faza 1)

**Data:** 2026-07-23  
**Autor:** sesja brainstormingowa  
**Status:** zatwierdzone przez użytkownika

---

## 1. Cel i kontekst

Druga aplikacja w rodzinie Repetytorium ósmoklasisty. Cel: doprowadzenie Zosi (egzamin maj 2027, cel 95–100%) do pewnego zdania egzaminu z matematyki.

Relacja do polskiego: **osobna aplikacja** (opcja B), osobny deploy Vercel. Docelowo połączone przez Hub (prosta strona nawigacyjna bez współdzielonego stanu). Konsolidacja w jedno SPA odłożona do momentu ukończenia angielskiego.

---

## 2. Decyzje projektowe

| Temat | Decyzja | Uzasadnienie |
|---|---|---|
| Relacja do polskiego | Osobna aplikacja (B) | Polski u testerów — zero ryzyka regresji |
| Zakres treści faza 1 | 9 priorytetowych działów | Szybsza wartość; reszta po diagnozie Zosi |
| Wzory matematyczne | KaTeX przez npm (C) | Offline, no-CDN, czysty zapis `$...$` w JSON |
| Zadania otwarte | Prowadzony tok rozumowania (B) | Uczy etapowego myślenia, punktacja cząstkowa per krok |
| Teoria | Inline `przypomnij` przy zadaniu (A) | Retrieval practice — teoria w kontekście zadania |
| Architektura | Czysty scaffold, selektywne przenoszenie (2) | Brak martwego kodu, świadome decyzje per plik |
| Hub | Statyczny, po ukończeniu matematyki i angielskiego | Osobna strona nawigacyjna, zero stanu |

---

## 3. Struktura katalogów

```
Repetytorium-doc/
├── repetytorium - j_polski/app/     ← bez zmian
├── repetytorium - matematyka/
│   ├── app/                         ← nowe SPA (ten projekt)
│   │   ├── src/
│   │   │   ├── content/matematyka/
│   │   │   │   ├── rejestr.js
│   │   │   │   └── dzialy/          ← 9 plików JSON
│   │   │   ├── core/
│   │   │   │   ├── profil.js        ← skopiowany z polskiego (schemat v4)
│   │   │   │   ├── powtorki.js      ← skopiowany z polskiego
│   │   │   │   ├── plan.js          ← nowy
│   │   │   │   ├── quiz.js          ← nowy (obsługa kroków)
│   │   │   │   └── statystyki.js    ← nowy (per dział)
│   │   │   ├── storage/
│   │   │   │   └── adapter.js       ← skopiowany, klucz "matematyka"
│   │   │   ├── ui/
│   │   │   │   ├── components/
│   │   │   │   │   ├── PasekPostepu.jsx    ← skopiowany
│   │   │   │   │   ├── WykresLiniowy.jsx   ← skopiowany
│   │   │   │   │   └── KrokZadania.jsx     ← nowy
│   │   │   │   ├── pages/
│   │   │   │   │   ├── WyborProfilu.jsx    ← skopiowany
│   │   │   │   │   ├── NowyProfil.jsx      ← skopiowany
│   │   │   │   │   ├── EkranPin.jsx        ← skopiowany
│   │   │   │   │   ├── Start.jsx           ← nowy
│   │   │   │   │   ├── TestWstepny.jsx     ← nowy
│   │   │   │   │   ├── Dzial.jsx           ← nowy
│   │   │   │   │   ├── ZadanieOtwarte.jsx  ← nowy
│   │   │   │   │   ├── Powtorka.jsx        ← zaadaptowany
│   │   │   │   │   ├── EgzaminProbny.jsx   ← nowy
│   │   │   │   │   ├── Statystyki.jsx      ← zaadaptowany
│   │   │   │   │   └── Wynik.jsx           ← skopiowany
│   │   │   │   └── theme.css               ← skopiowany
│   │   │   ├── App.jsx                     ← nowy
│   │   │   └── main.jsx                    ← skopiowany
│   │   ├── tests/
│   │   ├── docs/
│   │   ├── package.json
│   │   └── vite.config.js
│   ├── zrodla/                      ← materiały źródłowe (już istnieje)
│   └── LESSONS.md                   ← (już istnieje)
└── repetytorium - j_angielski/      ← na przyszłość
```

---

## 4. Model treści

### Schemat działu (`dzialy/*.json`)

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
          "instrukcja": "Zapisz obliczenie objętości",
          "oczekiwana": "192",
          "jednostka": "m³",
          "podpowiedz": "Objętość = długość × szerokość × głębokość"
        }
      ],
      "rozwiazanie_wzorcowe": "$V = 12 \\cdot 8 \\cdot 2 = 192 \\text{ m}^3$"
    }
  ]
}
```

### 9 działów fazy 1 (wg `rejestr.js`)

| ID | Tytuł | Moduł |
|---|---|---|
| `liczby` | Liczby i działania | A |
| `ulamki` | Ułamki zwykłe i dziesiętne | B |
| `potegi` | Potęgi i pierwiastki | C |
| `procenty` | Procenty | D |
| `algebra` | Wyrażenia algebraiczne | E |
| `rownania` | Równania | F |
| `geometria-plaska` | Geometria płaska | G |
| `pitagoras` | Twierdzenie Pitagorasa | H |
| `geometria-przestrzenna` | Geometria przestrzenna | I |

### `rejestr.js` — jedyne źródło treści dla UI

```js
export { DZIALY, PULA_EGZAMINU, material }
// DZIALY: mapa id → obiekt działu
// PULA_EGZAMINU: płaska lista wszystkich pytań zamkniętych i otwartych
// material(id): helper zwracający dział po id
```

---

## 5. Model danych (localStorage)

### Klucze

- `rep:profil:{uuid}` — schemat profilu v4 (identyczny z polskim)
- `rep:postepy:{uuid}:matematyka` — postępy matematyki (oddzielne od `:polski`)

### Schemat postępów

```js
{
  wersja: 4,
  diagnoza: null,      // {liczby: 0.6, ulamki: 0.4, ...} wynik per dział z TestWstepny
  plan: null,          // [{dzialId, priorytet, status}] generowany po diagnozie
  dzialy: {},          // {liczby: {ukonczone: true, wynik: 0.85, data: "2026-07-23"}}
  sesje: [],           // [{data, wynik, rodzaj: "dzial"|"powtorka"|"egzamin"}]
  powtorki: [],        // identyczny format jak w polskim (interwały [1,3,7,14] dni)
  egzaminy: []         // [{data, wynik, punkty, max}]
}
```

---

## 6. Architektura aplikacji

### Warstwy (identyczne zasady jak w polskim)

```
content/  (JSON)  →  core/  (czysta logika, zero DOM)  →  storage/  →  ui/
```

- `core/` nie importuje nic z `content/` — dostaje dane jako argumenty
- UI i App importują treść **wyłącznie** z `rejestr.js`
- `core/quiz.js` obsługuje logikę kroków zadań otwartych (walidacja, punktacja cząstkowa)

### KaTeX

- Zainstalowany przez npm (`katex` pakiet)
- Komponent `KrokZadania.jsx` odpowiada za render `$...$` i `$$...$$`
- Wszystkie pola treści w JSON mogą zawierać wyrażenia KaTeX
- Render po stronie klienta, zero CDN

### Skopiowane z polskiego (bez modyfikacji)

- `storage/adapter.js` — zmiana tylko sufiksu przedmiotu (`"matematyka"`)
- `ui/theme.css` — identyczny motyw
- `core/profil.js` — **zaadaptowany**: schemat profilu użytkownika identyczny (v4), ale `pustePostepy()` zwraca nową strukturę z `dzialy` zamiast `lektury/cwiczenia`
- `core/powtorki.js` — logika spaced repetition (interwały [1,3,7,14])
- `ui/components/PasekPostepu.jsx`, `WykresLiniowy.jsx`
- `ui/pages/WyborProfilu.jsx`, `NowyProfil.jsx`, `EkranPin.jsx`, `Wynik.jsx`
- `main.jsx`

---

## 7. Kluczowe ekrany

### `TestWstepny.jsx`
- 9–18 pytań zamkniętych (1–2 per dział), ~25 minut
- Treści przez KaTeX
- Wynik per dział → `diagnoza` w postępach → automatyczny plan

### `Dzial.jsx`
- Pytania zamknięte z rozwijalnym `przypomnij` (teoria inline)
- Po serii zamkniętych: przejście do `ZadanieOtwarte.jsx`
- Próg ukończenia działu: 80% pytań zamkniętych poprawnie

### `ZadanieOtwarte.jsx`
- Kroki renderowane przez KaTeX
- Uczeń wpisuje wartość numeryczną per krok
- Błąd → `podpowiedz` → druga próba → wzorcowy krok
- Podsumowanie: X/Y punktów cząstkowych

### `EgzaminProbny.jsx`
- 21 zadań: 15 zamkniętych + 6 otwartych
- Limit czasu: 125 minut
- Zadania otwarte w trybie uproszczonym (wynik końcowy)
- Wynik: punkty + procent + delta vs diagnoza per dział

### `Start.jsx` (dashboard)
- Karty 9 działów z paskiem postępu
- "Na dziś": powtórki + następny nieukończony dział
- Linki: Egzamin próbny, Statystyki

### `Statystyki.jsx`
- Wykres wyników w czasie (reużyty `WykresLiniowy.jsx`)
- Per dział: diagnoza → dziś (delta ▲/▽/=)
- Regularność: seria dni + 8 tygodni sesji
- Pokrycie: X/9 działów ukończonych

---

## 8. Hub (po ukończeniu matematyki i angielskiego)

Statyczny `index.html` w `hub/` na poziomie repo root. Trzy przyciski nawigacyjne do deployów Vercel per przedmiot. Zero stanu, zero localStorage. Osobny projekt Vercel.

**Uwaga do rozstrzygnięcia przed Hub:** zmiana URL polskiego (obecny `repetytorium-e8.vercel.app` → nowy subdomain) dotknie testerów — omówić osobno.

---

## 9. Definition of done iteracji (identyczne jak w polskim)

Build ✓ → QA desktop ✓ → QA mobile ✓ → przywrócenie stanu Zosi → wpis w LESSONS.md → commit

---

## 10. Poza zakresem fazy 1

- Działy o wadze średniej/niskiej (proporcjonalność, układ współrzędnych, statystyka, symetrie, prawdopodobieństwo)
- Hub (po angielskim)
- Migracja do Supabase
- Code-splitting (do rozważenia gdy bundle > 500 kB)
