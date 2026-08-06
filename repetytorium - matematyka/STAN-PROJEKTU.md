# Stan projektu — Repetytorium ósmoklasisty (matematyka)

> Plik przekazania między sesjami. Aktualizuj po każdej iteracji.
> Ostatnia aktualizacja: **2026-08-06, po sesji it.8** (rotacja zadań otwartych + hardeningi z review it.7; build ✓; QA ✓).

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
- **Rozbudowa puli zadań** ✅ — 45 zamkniętych + 18 otwartych (it.5); arkusz losował 15 z 45 i 6 z 18
- **Nowe działy (it.6)** ✅ — statystyka + prawdopodobieństwo; pula 55 zamkniętych + 22 otwarte;
  arkusz losuje 15 z 55 i 6 z 22
- **UX quizu (it.7)** ✅ — pauza po błędnej odpowiedzi + wskazówka/Przypomnij + Dalej; fix renderu
  wskazówki i kroku z jednostką (gpo2)
- **Rotacja + hardeningi (it.8)** ✅ — losowe zadanie otwarte po quizie (odblokowane *o2), functional
  updater/clearTimeout/key, jednostka poza $...$
- **Hub** — statyczny po ukończeniu angielskiego

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

## 8b. Iteracja 6 — plan i stan

**Status: UKOŃCZONA ✅**

Task briefy: `.superpowers/sdd/2026-08-06-matematyka-it6-nowe-dzialy/task-{1,2,3}-brief.md`

### 3 taski it.6:

| Task | Co robi | Status |
|------|---------|--------|
| T1 | `statystyka.json` — 5 zamkniętych (st1–st5: średnia, mediana, dominanta, liczność, suma z średniej) + 2 otwarte (sto1, sto2) + wpis w `rejestr.js` | ✅ |
| T2 | `prawdopodobienstwo.json` — 5 zamkniętych (pw1–pw5: klasyczna definicja, reguła mnożenia, warunkowe) + 2 otwarte (pwo1, pwo2) + wpis w `rejestr.js` | ✅ |
| T3 | Weryfikacja końcowa: skrypt puli (55 zamkniętych + 22 otwarte, 11 działów) ✓; `npm test` + `npm run build` ✓; QA dashboard (11 kart) ✓; QA Statystyka (5/5 zamkniętych, sto1 3/3 kroki) ✓; QA Prawdopodobieństwo (5/5 zamkniętych, LaTeX $\frac{}{}$ render ✓, pwo1 3/3 kroki, przecinek „0,5" zaakceptowany) ✓; Egzamin Próbny (oba nowe działy reprezentowane w wyniku per dział) ✓; diagnoza na świeżym profilu = 22 pytania ✓; konsola 0 errors ✓; docs + commit | ✅ |

**Definition of done it.6:** skrypt puli ✓ (55+22, 11/11 OK) → `npm test` + `npm run build` ✓ →
QA obu nowych działów w przeglądarce (0 errors) ✓ → Egzamin Próbny z reprezentacją nowych działów ✓ →
diagnoza świeżego profilu = 22 pytania ✓ → docs → commit ✓

## 8c. Iteracja 7 — plan i stan

**Status: UKOŃCZONA ✅**

Task briefy: `.superpowers/sdd/2026-08-06-matematyka-it7-ux-quizu/task-{1,2,3}-brief.md`

### 3 taski it.7:

| Task | Co robi | Status |
|------|---------|--------|
| T1 | `Dzial.jsx` — pauza po błędnej odpowiedzi (bez auto-przejścia), wskazówka + „Przypomnij" rozwinięte, przycisk „Dalej" (błędna na ostatnim pytaniu kończy quiz); poprawna odpowiedź nadal auto-przechodzi po ~1 s | ✅ |
| T2 | `KrokZadania.jsx` — fix delimiterów `$...$` w feedbacku „Dobrze!" dla kroku z jednostką (`\text{...}`); rendering wskazówki przez KaTeXRenderer wprowadzony w T1 | ✅ |
| T3 | QA końcowe (desktop + mobile 390×844 + sanity egzaminu) + docs (STAN-PROJEKTU.md, LESSONS.md) + commit | ✅ |

**Definition of done it.7:** `npm test` + `npm run build` ✓ → QA desktop (pauza+wskazówka KaTeX+Dalej,
błędna na ostatnim pytaniu kończy quiz, poprawna auto-przechodzi, feedback kroku z jednostką, 0
console errors) ✓ → QA mobile 390×844 (wskazówka + Dalej czytelne/klikalne, brak poziomego scrolla)
✓ → sanity Egzaminu Próbnego (brak regresji — część zamknięta nadal bez feedbacku
zielony/czerwony) ✓ → docs ✓ → commit ✓

### Zrealizowane w it.7
- `Dzial.jsx` — błędna odpowiedź zatrzymuje quiz (bez `setTimeout`), pokazuje wskazówkę
  (renderowaną przez `KaTeXRenderer` — wprowadzone w tym tasku, T1) i rozwija „Przypomnij"
  (`<details open={(pokazFeedback && !czyWybranaPop) || undefined}>`),
  przycisk „Dalej" przechodzi do kolejnego pytania albo (na ostatnim) kończy quiz; poprawna
  odpowiedź zachowuje auto-przejście `setTimeout(dalej, 1000)`
- `KrokZadania.jsx` — feedback „Dobrze!" naprawiony delimiterami `$...$` przez `KaTeXRenderer`,
  w tym `\text{jednostka}` dla kroków z jednostką (np. gpo2 k1 „cm")
- QA w przeglądarce (Playwright): potwierdzone wszystkie scenariusze z DoD; korzeń przyczyny
  gpo2 potwierdzony w kodzie źródłowym (patrz LESSONS.md 2026-08-06) — bezpośrednia obserwacja
  „Dobrze! + jednostka" na kroku nie-ostatnim nie była osiągalna przez zwykły przepływ Dzial.jsx
  (zawsze otwiera `zadania_otwarte[0]`), a dwie próby Egzaminu Próbnego (losowanie 6 z ~22
  otwartych) nie wylosowały gpo2/gpro2 w Tasku 3 — udokumentowane jako ograniczenie procesu QA,
  nie jako defekt (patrz LESSONS.md); **wizualnie ten krok był już potwierdzony wcześniej w
  Tasku 2** — „Dobrze! 8 cm" jako KaTeX na gpo2 k1, przez tymczasowe (zrewertowane przed
  commitem) przełożenie kolejności `zadania_otwarte`

## 8d. Iteracja 8 — plan i stan

**Status: UKOŃCZONA ✅**

Task briefy: `.superpowers/sdd/2026-08-06-matematyka-it8-rotacja-hardeningi/task-{1,2,3}-brief.md`

### 3 taski it.8:

| Task | Co robi | Status |
|------|---------|--------|
| T1 | `Dzial.jsx` — losowe zadanie otwarte z `zadania_otwarte` po ukończeniu części zamkniętej (zamiast zawsze `[0]`), odblokowuje `*o2` w normalnym przepływie; hardeningi z review it.7: functional updater `setAktualny(a => a + 1)`, `clearTimeout` w `reset()`, `key={pytanie.id}` na `<details>` | ✅ |
| T2 | `KrokZadania.jsx` — jednostka wyjęta poza `$...$` w feedbacku „Dobrze!" (`` $${wartosc}$ ${jednostka}` `` zamiast `\text{...}` w trybie math) — usuwa ostrzeżenia konsoli KaTeX „Unrecognized Unicode character" dla `cm²`/`m³` | ✅ |
| T3 | QA końcowe (desktop + mobile 390×844) + docs (STAN-PROJEKTU.md, LESSONS.md) + commit | ✅ |

**Definition of done it.8:** `npm test` + `npm run build` ✓ → QA desktop (rotacja gpo1/gpo2 w ≤6
próbach, feedback „Dobrze! 8 cm" krok nie-ostatni bez ostrzeżeń KaTeX, „Przypomnij" rozwinięte
ręcznie na pytaniu N zwija się na N+1, regresja it.7 — błędna odpowiedź → pauza + wskazówka +
Dalej, 0 console errors) ✓ → QA mobile 390×844 (wskazówka + Dalej czytelne, brak poziomego
scrolla) ✓ → docs ✓ → commit ✓

### Zrealizowane w it.8
- `Dzial.jsx` — `dzial.zadania_otwarte[Math.floor(Math.random() * dzial.zadania_otwarte.length)]`
  zamiast zawsze `zadania_otwarte[0]`; drugie zadanie otwarte per dział (`*o2`, np. gpo2, gpro2)
  jest teraz osiągalne w normalnym przepływie ucznia, nie tylko przez losowanie w Egzaminie
  Próbnym (ograniczenie odnotowane w LESSONS.md it.7)
- Hardeningi z finalnego review it.7 wdrożone: `setAktualny(a => a + 1)` (functional updater,
  bez zależności od stale closure), `clearTimeout(timerRef.current)` w `reset()` (zapobiega
  odpalonemu timerowi auto-przejścia po resecie quizu), `key={pytanie.id}` na `<details>`
  (stan `open` natywnego elementu nie przecieka między pytaniami — ręcznie rozwinięte
  „Przypomnij" na pytaniu N zwija się poprawnie na N+1)
- `KrokZadania.jsx` — jednostka w feedbacku „Dobrze!" przeniesiona poza tryb math KaTeX
  (`` `$${wartosc}$ ${jednostka}` `` zamiast `` `$${wartosc} \text{ ${jednostka}}$` ``) — usuwa
  ostrzeżenia konsoli „Unrecognized Unicode character" dla znaków `²`/`³` w jednostkach typu
  `cm²`, `m³`, które KaTeX w trybie math nie renderował poprawnie
- QA w przeglądarce (Playwright): rotacja potwierdzona bezpośrednio — 6 kolejnych ukończeń
  quizu Geometria płaska dało naprzemiennie gpo2/gpo1/gpo2/gpo1/gpo2/gpo1 (oba zadania
  zaobserwowane już w pierwszych 2 próbach); feedback „Dobrze! 8 cm" (gpo2 k1, krok
  nie-ostatni) zaobserwowany bezpośrednio jako poprawny render KaTeX z jednostką jako czysty
  tekst obok, 0 ostrzeżeń konsoli w całej sesji; „Przypomnij" rozwinięte ręcznie na pytaniu 1
  poprawnie zwinięte na pytaniu 2 (weryfikacja `key`); regresja it.7 (błędna odpowiedź → pauza
  + wskazówka + Dalej) potwierdzona bez zmian; konsola 0 errors / 0 warnings przez całą sesję
  QA (desktop + mobile 390×844)

## 7. Procedury i pułapki (z LESSONS.md)

- **Polskie cudzysłowy w JSON**: po zapisie zawsze weryfikuj `python3 -c "import json,sys; json.load(open(sys.argv[1]))" plik.json`
- **KaTeX render**: `katex.renderToString(wzor, { throwOnError: false })` — `throwOnError: false` żeby błędy LaTeX nie crashowały UI
- **Git**: jawne ścieżki przy `git add` (w repo są inne nietrackowane katalogi-siostry)
- **Dev port**: 5173 może być zajęty przez polskiego — matematyka startuje na 5174
- **localStorage izolacja**: klucz `matematyka` odizolowany od `polski` — nie kolidują na tym samym urządzeniu
- **LaTeX w JSON**: każdy wzór w `opcje`/`poprawna`/`tresc` musi być opakowany w `$...$` — bez delimiterów KaTeXRenderer pokazuje surowy tekst (bug ulamki.json z it.2)

## 9. Jak zacząć nową sesję

### It.8 jest ukończona (aktualny stan) — zacznij it.9:
1. Przeczytaj ten plik + ostatni wpis w `LESSONS.md` (2026-08-06 — it.8 rotacja + hardeningi)
2. Pula zadań: **55 zamkniętych + 22 otwarte** w **11 działach** (bez zmian treściowych w it.8 —
   iteracja czysto komponentowa: rotacja zadania otwartego + hardeningi z review it.7)
3. Produkcja działa: `https://repetytorium-matematyka.vercel.app` — auto-deploy z `main`
4. Możliwe kierunki it.9:
   - **Angielski + Hub** (rekomendowany następny duży kierunek) — nowa aplikacja
     `repetytorium - j_angielski/` obok matematyki i polskiego, docelowo spięta z nimi przez
     statyczny Hub nawigacyjny; największy nieotwarty obszar zakresu repetytorium
   - Pole `wyjasnienie` per zadanie (osobne od `podpowiedz`/`przypomnij`) — pełne wyjaśnienie
     błędnej odpowiedzi, nie tylko wskazówka przed próbą
   - Tryb nauki (bez presji wyniku — nieograniczone próby, bez wpływu na postęp/próg 80%)
   - Dalsza rozbudowa puli (więcej zadań per dział)
5. Dev server: `cd "repetytorium - matematyka/app" && npm run dev` → localhost:5174
   (lub 5173 jeśli 5174 zajęty)
