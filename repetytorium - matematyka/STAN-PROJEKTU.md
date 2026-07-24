# Stan projektu — Repetytorium ósmoklasisty (matematyka)

> Plik przekazania między sesjami. Aktualizuj po każdej iteracji.
> Ostatnia aktualizacja: **2026-07-24, po sesji it.1** (9 commitów: scaffold → storage → core → content → UI → TestWstepny → Start+App → LESSONS → fix).

---

## 1. Cel projektu

Webowa aplikacja-repetytorium dla ósmoklasistki (Zosia, egzamin **maj 2027**, cel 95–100%) — matematyka.
Osobna aplikacja obok `repetytorium - j_polski/` (ta jest u testerów od it.16).
Docelowo połączone przez Hub (statyczna strona nawigacyjna) — po ukończeniu angielskiego.

## 2. Stack i architektura

- **React 19 SPA** (Vite), bez TypeScript, bez routera (ekrany przez `useState` w `App.jsx`)
- **KaTeX przez npm** — render wyrażeń `$...$` i `$$...$$` po stronie klienta, zero CDN
- **localStorage** przez adapter w `src/storage/` — migracja do Supabase = podmiana adaptera
- Treść w **JSON** w `src/content/matematyka/`, spinana przez `rejestr.js`
- Warstwy: `content/` (JSON) → `core/` (czysta logika, **zero DOM**) → `storage/` → `ui/`
- Klucz postępów: `rep:postepy:{uuid}:matematyka` (odizolowane od polskiego)
- Lokalizacja appki: `repetytorium - matematyka/app/` w katalogu `Repetytorium-doc`
- Git root: `/Users/pibe/dev/Repetytorium-doc` — jawne ścieżki przy `git add`
- Dev server: `cd "repetytorium - matematyka/app" && npm run dev` → localhost:5174
- **Produkcja:** jeszcze nie — deploy Vercel zaplanowany po ukończeniu it.1 (lub osobno)

## 3. Co zostało zrobione

| Etap | Status | Opis |
|------|--------|------|
| Skill `repetytorium-matematyka` | ✅ | `.opencode/skills/` (wzorowany na polskim) |
| `LESSONS.md` | ✅ | Wpisy z 2026-07-20 — weryfikacja egzamin.md CKE, format 30 pkt / 125 min |
| `zrodla/` | ✅ | Raport metodyczny (.docx + .txt) + `zrodla-url.md` (6 URL-i) |
| Design spec it.1 | ✅ | `app/docs/superpowers/specs/2026-07-23-matematyka-design.md` — zatwierdzony |
| Plan it.1 | ✅ | `app/docs/superpowers/plans/2026-07-23-matematyka-it1-scaffold.md` — gotowy |
| Karty Trello it.1 | ✅ | `app/docs/superpowers/plans/2026-07-23-matematyka-it1-trello.md` — gotowe |
| **It.1 — scaffold + diagnoza + dashboard** | ✅ | 9 commitów (2ac959d..d2b515e); build ✓; QA desktop+mobile ✓ |

### Kluczowe decyzje projektowe (z design spec)

| Temat | Decyzja |
|-------|---------|
| Relacja do polskiego | Osobna aplikacja — zero ryzyka regresji |
| Wzory matematyczne | KaTeX przez npm |
| Zadania otwarte | Prowadzony tok rozumowania (kroki z walidacją numeryczną) |
| Teoria | Inline `przypomnij` przy zadaniu |
| Zakres it.1 | 9 działów priorytetowych (liczby, ułamki, potęgi, procenty, algebra, równania, geometria płaska, Pitagoras, geometria przestrzenna) |

## 4. Iteracja 1 — plan i stan

**Status: UKOŃCZONA ✅**

Plan: `app/docs/superpowers/plans/2026-07-23-matematyka-it1-scaffold.md`
Karty Trello: `app/docs/superpowers/plans/2026-07-23-matematyka-it1-trello.md`

### 8 tasków it.1:

| Task | Co robi | Status |
|------|---------|--------|
| T1 | Scaffold: Vite + React + KaTeX, `npm run dev` | ✅ |
| T2 | `storage/adapter.js` + `core/profil.js` (struktura `dzialy`) | ✅ |
| T3 | `core/quiz.js` (TDD), `core/plan.js`, `core/powtorki.js` | ✅ |
| T4 | `dzialy/liczby.json` (wzorzec JSON) + `rejestr.js` | ✅ |
| T5 | Komponenty skopiowane z polskiego + `KaTeXRenderer` + `KrokZadania` | ✅ |
| T6 | Ekran `TestWstepny` (diagnoza per dział) | ✅ |
| T7 | `Start.jsx` (dashboard) + `App.jsx` router | ✅ |
| T8 | `LESSONS.md` + Definition of Done | ✅ |

**Definition of done it.1:** build ✓ → QA desktop ✓ → QA mobile (390×844) ✓ → wpis LESSONS.md → commit ✓

### Zrealizowane (9 commitów: 2ac959d..d2b515e)
- Vite+React+KaTeX scaffold działający na localhost:5174
- `storage/adapter.js` (localStorage, parametryczny przedmiot)
- `core/profil.js` — profil, PIN, `pustePostepy()` ze strukturą `dzialy:{}`
- `core/quiz.js` (TDD, 9 asercji), `core/plan.js`, `core/powtorki.js`
- `content/matematyka/dzialy/liczby.json` (wzorzec: 2 tw + 3 ćw + 1 otwarte) + `rejestr.js`
- `KaTeXRenderer.jsx` (parser `$...$` i `$$...$$`), `KrokZadania.jsx`
- Ekrany profilu skopiowane z polskiego: `WyborProfilu`, `EkranPin`, `NowyProfil`
- `TestWstepny.jsx` — diagnoza per dział, wynik jako ratio 0–1
- `Start.jsx` dashboard (9 kart działów, banner diagnozy, „Na dziś" powtórki)
- `App.jsx` — router stanowy wszystkich ekranów

## 5. Iteracja 2 — plan i stan

**Status: GOTOWY DO WYKONANIA**

Plan: `app/docs/superpowers/plans/2026-07-24-matematyka-it2-dzialy-i-ekrany.md`
Karty Trello: `app/docs/superpowers/plans/2026-07-24-matematyka-it2-trello.md`

### 5 tasków it.2:

| Task | Co robi | Status |
|------|---------|--------|
| T1 | 8 działów JSON (ułamki…geometria-przestrzenna) + rejestr.js | ⏳ |
| T2 | `Dzial.jsx` (quiz zamknięty, próg 80%, przejście do ZadanieOtwarte) | ⏳ |
| T3 | `ZadanieOtwarte.jsx` (kroki sekwencyjne przez KrokZadania) | ⏳ |
| T4 | `Powtorka.jsx` (sesja spaced-repetition, ocena umiem/jeszcze-nie) | ⏳ |
| T5 | `App.jsx` router (stany dzial/zadanie-otwarte/powtorka) + Start.jsx + LESSONS + STAN | ⏳ |

### Jak zacząć it.2:

1. Przeczytaj ten plik
2. Uruchom: `superpowers:subagent-driven-development`
3. Plan: `app/docs/superpowers/plans/2026-07-24-matematyka-it2-dzialy-i-ekrany.md`
4. Ledger: `.superpowers/sdd/progress.md` (sprawdź — może być częściowo wykonany)
5. Dev server: `cd "repetytorium - matematyka/app" && npm run dev` → localhost:5174

## 6. Kolejne kroki (po it.2)

- **It.3:** `EgzaminProbny.jsx` (21 zadań, 125 min), `Statystyki.jsx`
- **Deploy Vercel** — analogicznie jak w polskim (`vercel.json` + auto-deploy z `main`)
- **Hub** — statyczny po ukończeniu angielskiego

## 7. Procedury i pułapki (z LESSONS.md)

- **Polskie cudzysłowy w JSON**: po zapisie zawsze weryfikuj `python3 -c "import json,sys; json.load(open(sys.argv[1]))" plik.json`
- **KaTeX render**: `katex.renderToString(wzor, { throwOnError: false })` — `throwOnError: false` żeby błędy LaTeX nie crashowały UI
- **Git**: jawne ścieżki przy `git add` (w repo są inne nietrackowane katalogi-siostry)
- **Dev port**: 5173 może być zajęty przez polskiego — matematyka startuje na 5174
- **localStorage izolacja**: klucz `matematyka` odizolowany od `polski` — nie kolidują na tym samym urządzeniu

## 8. Jak zacząć nową sesję

### Jeśli it.2 NIE jest ukończona (aktualny stan):
1. Przeczytaj ten plik
2. Sprawdź ledger: `cat ".superpowers/sdd/progress.md"` — które taski są już zrobione
3. Uruchom `superpowers:subagent-driven-development` z planem `app/docs/superpowers/plans/2026-07-24-matematyka-it2-dzialy-i-ekrany.md`
4. Dev server: `cd "repetytorium - matematyka/app" && npm run dev` → localhost:5174

### Jeśli it.2 jest ukończona:
1. Przeczytaj ten plik + ostatni wpis w `LESSONS.md`
2. Napisz plan it.3 (skill `superpowers:writing-plans`) — EgzaminProbny + Statystyki
3. Uruchom skill `superpowers:subagent-driven-development`
