# Stan projektu — Repetytorium ósmoklasisty (matematyka)

> Plik przekazania między sesjami. Aktualizuj po każdej iteracji.
> Ostatnia aktualizacja: **2026-07-28, po sesji it.5** (9 tasków T1-T9: rozbudowa puli — +2 zamknięte +1 otwarte per dział, łącznie 45 zamkniętych + 18 otwartych; build ✓; QA 2× Egzamin Próbny ✓).

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
- **Produkcja:** Vercel — `https://repetytorium-matematyka.vercel.app` — auto-deploy z `main` (od it.4)

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

**Status: UKOŃCZONA ✅**

Plan: `app/docs/superpowers/plans/2026-07-24-matematyka-it2-dzialy-i-ekrany.md`
Karty Trello: `app/docs/superpowers/plans/2026-07-24-matematyka-it2-trello.md`

### 5 tasków it.2:

| Task | Co robi | Status |
|------|---------|--------|
| T1 | 8 działów JSON (ułamki…geometria-przestrzenna) + rejestr.js | ✅ |
| T2 | `Dzial.jsx` (quiz zamknięty, próg 80%, przejście do ZadanieOtwarte) | ✅ |
| T3 | `ZadanieOtwarte.jsx` (kroki sekwencyjne przez KrokZadania) | ✅ |
| T4 | `Powtorka.jsx` (sesja spaced-repetition, ocena umiem/jeszcze-nie) | ✅ |
| T5 | `App.jsx` router (stany dzial/zadanie-otwarte/powtorka) + Start.jsx + LESSONS + STAN | ✅ |

**Definition of done it.2:** build ✓ → QA desktop ✓ (golden path + fail path + retry) →
QA mobile 390×844 ✓ → rekord powtórki zweryfikowany w localStorage ✓ → konsola czysta ✓ →
wpis LESSONS.md ✓ → commit ✓

### Zrealizowane w it.2
- 8 działów JSON (ułamki, potęgi, procenty, algebra, równania, geometria płaska,
  Pitagoras, geometria przestrzenna) wg wzorca `liczby.json`
- `Dzial.jsx` — quiz zamknięty z feedbackiem, próg zaliczenia 80%, przejście do
  ZadanieOtwarte lub bezpośrednie zakończenie działu
- `ZadanieOtwarte.jsx` — kroki sekwencyjne (KrokZadania), podsumowanie, rozwiązanie wzorcowe
- `Powtorka.jsx` — sesja spaced-repetition (coNaDzis/oznaczPowtorke), ocena umiem/jeszcze-nie,
  memoizacja `pytaniaPerPowtorka` żeby nie przelosowywać pytań w trakcie sesji
- `App.jsx` — router rozszerzony o stany `dzial`/`zadanie-otwarte`/`powtorka`, zapis
  `postepy.dzialy`, tworzenie rekordu powtórki po ukończeniu działu (`nowaPowtorka`)
- `Start.jsx` — prop `onPowtorka` + przycisk „Rozpocznij powtórki” w bannerze „Na dziś”
- **Bug fix (znaleziony w QA T5):** `ulamki.json` — opcje/poprawna z LaTeX nie były
  opakowane w `$...$`, więc KaTeXRenderer pokazywał surowy tekst zamiast wzoru; naprawiono
  w danych (4 miejsca), bez zmian w komponentach — patrz LESSONS.md 2026-07-27


## 6. Iteracja 3 — plan i stan

**Status: UKOŃCZONA ✅**

Plan: `app/docs/superpowers/plans/2026-07-27-matematyka-it3-egzamin-statystyki.md`
Karty Trello: `app/docs/superpowers/plans/2026-07-27-matematyka-it3-trello.md`

### 6 tasków it.3:

| Task | Co robi | Status |
|------|---------|--------|
| T1 | `sprawdzKrok` — przecinek dziesiętny ≡ kropka + testy `node:assert/strict` | ✅ |
| T2 | `core/egzamin.js` — budowa arkusza 15+6 i liczenie wyniku, TDD | ✅ |
| T3 | `core/statystyki.js` — agregacje (seria wyników, postęp per dział, aktywność, pokrycie), TDD | ✅ |
| T4 | `EgzaminProbny.jsx` — symulacja arkusza, zegar 125 min, etapy zamknięte/otwarte/wynik | ✅ |
| T5 | `Statystyki.jsx` — wykres, działy z deltami, regularność, pokrycie | ✅ |
| T6 | Router App.jsx + Start.jsx (przycisk egzaminu) + QA desktop+mobile + docs | ✅ |

**Definition of done it.3:** `npm test` ✓ → `npm run build` ✓ → QA desktop ✓ → QA mobile (390×844) ✓ → rekord egzaminu w localStorage ✓ → konsola czysta ✓ → wpis LESSONS.md ✓ → commit ✓

### Zrealizowane w it.3
- `sprawdzKrok` normalizuje przecinek/kropkę dziesiętną po obu stronach porównania
- `core/egzamin.js` — `zbudujArkusz` (Fisher-Yates, gwarantowana reprezentacja wszystkich
  działów w zamkniętych), `policzWynikEgzaminu` z `perDzial`, `maksPkt` dynamiczny
- `core/statystyki.js` — `seriaWynikow`, `postepPerDzial` (priorytet: quiz > egzamin > diagnoza),
  `aktywnosc` (8 tygodni + seria dni), `pokrycie`
- `EgzaminProbny.jsx` — intro → 15 zamkniętych (Wstecz/pamięć, brak feedbacku) → 6 otwartych
  (KrokZadania) → ekran wyniku; zegar informacyjny z ostrzeżeniem <15 min
- `Statystyki.jsx` — WykresLiniowy, paski per dział z deltami (▲/▽ pp), słupki tygodni SVG,
  pokrycie działów + liczba egzaminów próbnych
- Router: stany `egzamin`/`statystyki`, `zakonczonoEgzamin` zapisuje do `postepy.egzaminy[]`
  i `postepy.sesje`; Start.jsx ma przycisk „🎓 Egzamin próbny"

## 7. Kolejne kroki

- **Deploy Vercel** ✅ — `https://repetytorium-matematyka.vercel.app` — auto-deploy z `main` (it.4 T1-T3)
- **Rozbudowa puli zadań** ✅ — 45 zamkniętych + 18 otwartych (it.5); arkusz losuje 15 z 45 i 6 z 18
- **Hub** — statyczny po ukończeniu angielskiego
- **it.6 — kolejna rozbudowa treści** lub nowe działy (statystyka, prawdopodobieństwo) wg potrzeb

## 8. Iteracja 5 — plan i stan

**Status: UKOŃCZONA ✅**

Plan: `app/docs/superpowers/plans/2026-07-28-matematyka-it5-rozbudowa-puli.md`
Karty Trello: `app/docs/superpowers/plans/2026-07-28-matematyka-it5-trello.md`

### 9 tasków it.5 + T10 weryfikacja:

| Task | Co robi | Status |
|------|---------|--------|
| T1 | liczby.json: +l4 (NWW), +l5 ((-2)³), +lo2 (liczby pierwsze) | ✅ |
| T2 | ulamki.json: +u4 (dzielenie), +u5 (zamiana na dziesiętny), +uo2 (suma mieszanych) | ✅ |
| T3 | potegi.json: +p4 (dzielenie potęg), +p5 (4⁰+2⁻¹), +po2 ((2³)²) | ✅ |
| T4 | procenty.json: +pr4 (wzrost+spadek), +pr5 (15% z 80), +pro2 (80% z 25) | ✅ |
| T5 | algebra.json: +a4 ((x+2)(x-2)), +a5 (wartość wyraż.), +ao2 (wyłącz+oblicz) | ✅ |
| T6 | rownania.json: +r4 (2x+5=13), +r5 (x/3-1=4), +ro2 (układ x+y=7, x-y=1) | ✅ |
| T7 | geometria-plaska.json: +gp4 (obwód kwadratu), +gp5 (pole trójkąta), +gpo2 (prostokąt) | ✅ |
| T8 | pitagoras.json: +pi4 (5-12-13), +pi5 (przekątna), +pio2 (drabina 5m) | ✅ |
| T9 | geometria-przestrzenna.json: +gpr4 (sześcian), +gpr5 (pp prostopadłościanu), +gpro2 (walec) | ✅ |
| T10 | Weryfikacja: 45 zamknięte + 18 otwarte ✓; QA Równania + Potęgi ✓; 2× Egzamin ✓; build ✓ | ✅ |

**Definition of done it.5:** skrypt puli ✓ → QA nowych zadań w przeglądarce (0 errors) ✓ →
2× Egzamin Próbny (wariantywność ✓, 12/12 otwarte ✓) → `npm run build` ✓ → docs → commit ✓

## 7. Procedury i pułapki (z LESSONS.md)

- **Polskie cudzysłowy w JSON**: po zapisie zawsze weryfikuj `python3 -c "import json,sys; json.load(open(sys.argv[1]))" plik.json`
- **KaTeX render**: `katex.renderToString(wzor, { throwOnError: false })` — `throwOnError: false` żeby błędy LaTeX nie crashowały UI
- **Git**: jawne ścieżki przy `git add` (w repo są inne nietrackowane katalogi-siostry)
- **Dev port**: 5173 może być zajęty przez polskiego — matematyka startuje na 5174
- **localStorage izolacja**: klucz `matematyka` odizolowany od `polski` — nie kolidują na tym samym urządzeniu
- **LaTeX w JSON**: każdy wzór w `opcje`/`poprawna`/`tresc` musi być opakowany w `$...$` — bez delimiterów KaTeXRenderer pokazuje surowy tekst (bug ulamki.json z it.2)

## 9. Jak zacząć nową sesję

### It.5 jest ukończona (aktualny stan) — zacznij it.6:
1. Przeczytaj ten plik + ostatni wpis w `LESSONS.md` (2026-07-28 — it.5 rozbudowa puli)
2. Pula zadań: **45 zamkniętych + 18 otwartych** (5+ zamkniętych i 2 otwarte per dział ✓)
3. Produkcja działa: `https://repetytorium-matematyka.vercel.app` — auto-deploy z `main`
4. Możliwe kierunki it.6: dalsza rozbudowa puli, lepsza UX (podpowiedzi, wyjaśnienia),
   nowe działy (statystyka), powtórki z kart (flashcards)
5. Dev server: `cd "repetytorium - matematyka/app" && npm run dev` → localhost:5174
   (lub 5173 jeśli 5174 zajęty)
