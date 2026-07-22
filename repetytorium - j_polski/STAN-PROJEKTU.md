# Stan projektu — Repetytorium ósmoklasisty (język polski)

> Plik przekazania między sesjami. Aktualizuj po każdej iteracji.
> Ostatnia aktualizacja: **2026-07-22, po iteracji 16** (commity `ecad594`..`HEAD`).

---

## 1. Cel projektu

Webowa aplikacja-repetytorium dla ósmoklasistki (Zosia, egzamin **2027**, cel 95-100%).
Start: język polski. Docelowo: + matematyka, + angielski (osobne katalogi już istnieją obok, puste/wczesne).

Kluczowe zasady metodyczne (pełen opis: skill `repetytorium-polski` w `.opencode/skills/`):
- komunikacja w aplikacji po polsku, dla 14-latka, growth mindset (🎉 ≥80% vs 🌱, bursztyn zamiast czerwieni)
- jedno pytanie na ekran, spaced repetition (interwały [1, 3, 7, 14] dni, próg "umiem" = 80%)
- plan nauki 42 tygodnie budowany z wyniku diagnozy

## 2. Stack i architektura

- **React 19 SPA** (Vite), bez TypeScript, bez routera (ekrany przez `useState` w `App.jsx`)
- **localStorage** przez adapter w `src/storage/` — migracja do Supabase w przyszłości = podmiana adaptera
- Treść w **JSON** w `src/content/polski/`, spinana przez `rejestr.js`
- Warstwy: `content/` (JSON) → `core/` (czysta logika, **zero DOM, zero importów treści** — dostaje mapy jako argumenty) → `storage/` → `ui/`
- UI i App importują treść **wyłącznie** z `rejestr.js`
- Lokalizacja appki: `app/` w tym katalogu; git root: `/Users/pibe/dev/Repetytorium-doc`
- Dev server: `npm run dev` w `app/` → localhost:5173
- **Produkcja:** https://repetytorium-e8.vercel.app (Vercel, auto-deploy z `main`, Root Directory `repetytorium - j_polski/app`)

## 3. Co zostało zrobione (iteracje + commity)

| It. | Commit | Zakres |
|-----|--------|--------|
| 0-5 | `8d95922` | Scaffold, profile+PIN, test wstępny (diagnoza), plan 42 tyg., pierwsze lektury |
| 6 | `7d449d4` | Kolejne lektury/ćwiczenia |
| 7 | `f530d75` | jw. |
| 8 | `cfb6a9f` | jw. |
| 9 | `730c803` | Spaced repetition (powtórki) |
| 10 | `bbdf3d9` | jw. + treść |
| 11 | `13808f0` | Treść |
| 12 | `e482599` | Fonetyka (B komplet) + przemówienie (druga długa forma) |
| 13 | `2cc1675` | Poezja (D komplet) + streszczenie z lukami (E komplet) |
| 14 | `4da0261` | Egzamin próbny — pełna symulacja arkusza |
| 15 | `ecad594`..`98c6381` | Statystyki postępu — wykres, moduły, regularność, pokrycie + QA (8/8, domknięte) |
| **16** | **`6bf7ddd`..`HEAD`** | **Publikacja Vercel: vercel.json, auto-deploy z main, TESTERZY.md** |

### Stan treści (komplet wg planu merytorycznego, chyba że zaznaczono)

- **Lektury (kanon 6/6):** dziady-2, balladyna, zemsta, opowiesc-wigilijna, maly-ksiaze, kamienie-na-szaniec — każda: kompendium + quiz
- **Ćwiczenia:** B gramatyka ×5 ✓, C ortografia ×3 ✓, D literackie ×4 ✓, E czytanie ×4 ✓
- **Pisanie (moduł F):** zaproszenie, ogloszenie, notatka (krótkie) + rozprawka, opowiadanie, przemowienie (długie, open-long: 200 słów, 20 pkt, 8 kryteriów samooceny)
- **Egzamin próbny (it. 14):** arkusz 25 pytań losowany z puli 264 (rozkład A:6 B:5 C:4 D:5 E:5) + wypracowanie (wybór z 3 form), 45 pkt, zegar 150 min, reguła CKE <180 słów → cap 7/20 pkt, wynik z deltami per moduł vs diagnoza
- **Statystyki postępu (it. 15):** ekran „📊 Twoje statystyki" (4 sekcje) — Twoja droga (wykres SVG wyników w czasie + linia progu 80%), Moduły: diagnoza→dziś (delty ▲/▽/= per A-F), Regularność (seria dni + 8 tygodni sesji), Pokrycie materiału (X z Y per lektury/ćwiczenia/pisanie); wejście z karty „Twoja diagnoza" na dashboardzie

### Kluczowe pliki

- `app/src/App.jsx` — router ekranów, zapis sesji/postępów
- `app/src/content/polski/rejestr.js` — jedyne źródło treści dla UI (`PULA_EGZAMINU`, `FORMY_EGZAMINU`, quizy, lektury...)
- `app/src/core/` — `profil.js` (schemat postępów **v4** + migracje), `plan.js`, `quiz.js`, `powtorki.js`, `egzamin.js`, `statystyki.js` (agregacja: seriaWynikow, postepPerModul, aktywnosc, pokrycie)
- `app/src/ui/pages/` — ekrany (Start, TestWstepny, Lektura, Cwiczenie, Pisanie, Powtorka, EgzaminProbny, Statystyki...)
- `app/src/ui/components/WykresLiniowy.jsx` — wykres SVG wyników w czasie (bez biblioteki), reużyty w ekranie Statystyki
- `app/tests/statystyki.test.mjs` — testy node dla `core/statystyki.js` (7 testów)
- `LESSONS.md` — dziennik lekcji per iteracja (obowiązkowy wpis po każdej sesji!)
- `wklad-merytoryczny-plan-repetytorium.md` — plan merytoryczny treści
- `.opencode/skills/repetytorium-polski/SKILL.md` — rola metodyka, proces pracy

## 4. Stan uczennicy (Zosia)

- Klucz localStorage: `rep:postepy:31221cbe-3f18-4699-9759-09d123eec434:polski`, PIN **1234**
- Diagnoza: 6/25 (24%): A 0/6, B 3/5, C 0/3, D 1/4, E 0/3, F 2/4
- Stan bazowy (po QA przywrócony ✓): schemat v3→v4 po zalogowaniu, przerobione: lektura dziady-2, ćwiczenie ortografia-1, 3 powtórki w kolejce, `egzaminy:[]`
- "Na dziś" bazowe: 2 powtórki + Lektura: Balladyna

## 5. Kolejne kroki (backlog, kolejność do ustalenia z użytkownikiem)

1. **Dedykacja/podziękowanie** — personalny akcent w aplikacji
2. **Code-splitting** — chunk 658 kB (warning Vite >500 kB); `React.lazy` per ekran
3. **Fiszki dla ćwiczeń** — tryb szybkiej powtórki teorii
4. **Migracja do Supabase** — podmiana adaptera storage (architektura gotowa)
5. **Matematyka / angielski** — nowe przedmioty (katalogi-siostry już istnieją)
6. **Monitoring uwag testerów** — zbieranie i priorytetyzacja zgłoszeń po publikacji (Vercel, it. 16)

## 6. Procedury i pułapki (skrót — pełne wpisy w LESSONS.md)

- **Nowa treść = "sam JSON"**: plik JSON + wpis w `rejestr.js` (wzorzec potwierdzony 10×)
- **Polskie cudzysłowy w JSON**: po zapisie pliku zawsze `python3 -c "json.loads(...)"`; naprawa regexem `„([^"„”]*)"` → `„\1”`
- **QA w przeglądarce (Chrome DevTools MCP lub Playwright MCP)**:
  - login jednym skryptem: Zosia → PIN 1234 → Wejdź; input przez natywny setter `HTMLInputElement.prototype.value` + `dispatchEvent(input, bubbles)`
  - `emulate`/`reload`/navigate wylogowują (niespójnie — czasem sam resize viewportu też) → re-login w skrypcie po każdej takiej operacji, na wszelki wypadek
  - klik PF/multi: **re-query przycisków przed KAŻDYM klikiem** + sleep ~250 ms (React re-render unieważnia referencje)
  - pułapka CSS `capitalize`: textContent ma małą literę mimo wielkiej na ekranie
  - mobile: viewport 390×844, sprawdzać `scrollWidth === innerWidth` przez `browser_evaluate`
  - **Playwright MCP startuje z pustym, izolowanym kontekstem przeglądarki** — brak stanu Zosi z poprzednich sesji w localStorage (inaczej niż Chrome DevTools MCP z trwałym profilem). Jeśli backup "sprzed QA" wychodzi pusty, odtwórz stan bazowy przez dynamiczny `import()` prawdziwych modułów `core/` w `browser_evaluate` (Vite serwuje ES moduły live) — gwarantuje zgodność ze schematem
- **Backup/restore stanu Zosi**: backup przez `evaluate_script` z `filePath` + weryfikacja pythonem; restore przez tymczasowy `app/public/backup-tmp.json` + `fetch` (odpakowanie `while typeof v === "string"`), plik **usunąć** po. Alternatywnie (Playwright, bez dostępu do `evaluate_script`/`filePath`): `localStorage.setItem` bezpośrednio z pełną treścią backupu w `browser_evaluate` — **uważać na ręczne przepisywanie dużych struktur** (np. `plan.tygodnie` z 41 pozycjami) — łatwo przypadkiem obciąć; zawsze zweryfikować długość/treść po zapisie (`JSON.parse(...).plan.tygodnie.length === 41` itp.)
- **Git**: w repo są nietrackowane katalogi-siostry → `git add` zawsze jawnymi ścieżkami plików
- **Definition of done iteracji**: build ✓ → QA desktop ✓ → QA mobile ✓ → przywrócenie stanu Zosi → wpis w LESSONS.md → commit
- **Deploy**: deploy = push na main; podgląd deployów: dashboard Vercel

## 7. Jak zacząć nową sesję

1. Przeczytaj ten plik + ostatni wpis w `LESSONS.md`
2. Załaduj skill `repetytorium-polski`
3. Uruchom dev server: `cd app && npm run dev` (jeśli nie działa)
4. Ustal z użytkownikiem, który punkt backlogu (sekcja 5) realizujemy
5. Po skończeniu iteracji: przejdź procedurę "definition of done" (sekcja 6) i **zaktualizuj ten plik**
