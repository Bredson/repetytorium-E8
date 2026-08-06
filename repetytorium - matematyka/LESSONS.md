# LESSONS — samodoskonalenie skila repetytorium-matematyka

Format wpisu:

```
## RRRR-MM-DD
- Obserwacja: ...
- Wniosek: ...
- Zmiana w skilu: (tak/nie — co zmieniono)
```

<!-- Wpisy dodawane po każdym użyciu skila -->

## 2026-07-20 (utworzenie skila)
- Obserwacja: skill utworzony na wzorcu `repetytorium-polski` z uwzględnieniem lekcji
  z jego LESSONS.md (m.in.: weryfikacja parametrów egzaminu z komunikatami CKE, które
  mają pierwszeństwo nad informatorem; walidacja banków pytań skryptem asercji;
  QA materiałów w przeglądarce wyłapuje realne błędy — nie pomijać).
- Obserwacja: w `zrodla/` (projekt polski) jest na razie tylko raport metodyczny
  j. polskiego — źródła matematyczne będą dostarczone później. Kompendium `egzamin.md`
  wypełniono wiedzą własną; pozycje niepewne oznaczono w sekcji "Do śledzenia"
  (czas dostosowany, zakres cięć reformy 2024).
- Wniosek: po dostarczeniu źródeł matematycznych PIERWSZĄ czynnością ma być weryfikacja
  `reference/egzamin.md` względem źródeł (jak w skilu polskim, gdzie pierwotne kompendium
  wymagało korekt).
- Zmiana w skilu: n/d (wersja początkowa).

## 2026-07-20 (weryfikacja egzamin.md z raportem i źródłami web)
- Obserwacja: raport metodyczny z `zrodla/` miał rację co do 30 pkt i 6 zadań otwartych,
  ale podał BŁĘDNY czas ("110–120 min" — poprawnie 125 min wg oficjalnego materiału
  o egzaminie 2026) i błędnie wymienił prawdopodobieństwo w zakresie (usunięte
  z podstawy w 2024 wraz z zaawansowanym zliczaniem).
- Obserwacja: pierwotne kompendium `egzamin.md` (wiedza własna) opisywało format
  2021-2024 (25 pkt, 19 zadań, 4 otwarte) — od 2025 obowiązuje powrót do formatu
  2019-2020: 30 pkt, 20-21 zadań, 14-15 zamkniętych + 5-6 otwartych po 2-3 pkt
  (w 2025 konkretnie: 15 + 6 = 21). Czas 125 min był poprawny.
- Wniosek: zasada "źródła mają priorytet" wymaga doprecyzowania — źródła z `zrodla/`
  (raporty generowane) weryfikować krzyżowo z oficjalnymi publikacjami CKE/omówieniami
  informatora, gdy podają twarde parametry (czas, punkty, liczba zadań). Przy konflikcie
  raport vs CKE wygrywa CKE; rozbieżność notować w egzamin.md i tutaj.
- Wniosek techniczny: duże PDF-y CKE (>5 MB) nie przechodzą przez webfetch — pobrać
  przez curl i ekstrahować tekst pypdf w venv w katalogu tymczasowym.
- Wniosek: pełna lista ~60 URL-i źródłowych od użytkownika nie została zapisana na czas —
  zachowało się tylko 6 adresów matematycznych (`zrodla/zrodla-url.md`). Nauka: listy
  źródeł od użytkownika zapisywać do pliku NATYCHMIAST po otrzymaniu.
- Zmiana w skilu: tak — `reference/egzamin.md` zaktualizowany (struktura arkusza 30 pkt,
  sekcje "Czego NIE ma na egzaminie" i "Ograniczenia zakresu", koło/okrąg jako nowość
  2025, statystyka bez prawdopodobieństwa, dane 2026: średnia 55%, >90% pkt = 13,6%).

## 2026-07-24 (it.1 — scaffold + diagnoza + dashboard)
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

## 2026-07-27 (it.2 T5 — router App.jsx + Start.jsx + QA końcowe)
- Obserwacja: App.jsx i Start.jsx z brief'a T5 były już zgodne co do treści z uprzednio
  wykonaną pracą (routing dzial/zadanie-otwarte/powtorka, `onPowtorka` w Start.jsx) —
  weryfikacja przez pełne porównanie z docelowym kodem z brief'u potwierdziła zgodność
  1:1, bez potrzeby zmian.
- Obserwacja: `powtorkiDzis` w App.jsx jest memoizowane (`useMemo` kluczowany
  `postepy?.powtorki`) — kluczowe, bo Powtorka.jsx trzyma własny `useMemo` na
  `pytaniaPerPowtorka` kluczowany referencją `powtorkiDzis`; bez memoizacji w App.jsx
  każdy render App przelosowywałby pytania w trakcie sesji powtórkowej. Zweryfikowano
  obecność i poprawność tego zabezpieczenia — bez dodatkowych zmian.
- **Bug znaleziony w QA**: `content/matematyka/dzialy/ulamki.json` — jako jedyny z 8 plików
  działów NIE opakowywał ułamków LaTeX w `$...$` (opcje/poprawna w test_wstepny i
  cwiczenia). Efekt: KaTeXRenderer (który wykrywa matematykę wyłącznie po znaczniku `$`)
  renderował surowy tekst `\frac{a}{b}` zamiast wzoru — widoczne i na desktopie, i na
  mobile (nie jest to bug CSS/responsywności). Zweryfikowano krzyżowo pozostałych 8 plików
  (algebra, geometria-plaska, geometria-przestrzenna, liczby, pitagoras, potegi, procenty,
  rownania) — wszystkie poprawnie opakowują LaTeX i zostawiają czysty tekst bez `$`.
  Naprawiono najmniejszą możliwą zmianą: dodano `$...$` wokół 4 grup opcji/poprawna w
  ulamki.json (tw-u1, u1, u2, u3), bez dotykania żadnego komponentu React (Dzial.jsx,
  TestWstepny.jsx, Powtorka.jsx — wszystkie trzy konsumują tę samą treść i zostały
  naprawione "za darmo" przez poprawkę danych). Zweryfikowano `python3 json.load`
  po edycji + rebuild + ponowne QA (desktop i mobile 390×844).
- Wniosek: przy tworzeniu/edycji plików JSON z treścią LaTeX zawsze porównywać z
  istniejącym wzorcem (np. liczby.json) — brak automatycznej walidacji "czy opcje z
  `\frac` mają `$` dookoła" pozwolił temu bugowi przejść przez T1 niezauważony aż do
  ręcznego QA w T5. Rozważyć w przyszłości prosty skrypt lint sprawdzający, czy `opcje`/
  `poprawna` zawierające `\\` (backslash LaTeX) są opakowane w `$`.
- Wniosek: manualne QA w przeglądarce (Playwright) na realnych danych, a nie tylko na
  jednym dziale, wyłapuje regresje treści, których build/testy jednostkowe nie widzą —
  potwierdza obserwację z 2026-07-20 o repetytorium-polski.
- QA końcowe (desktop 1280×900 + mobile 390×844): golden path (nowy profil → dashboard →
  Ułamki 3/3 poprawnie → ZadanieOtwarte "2.5" → powrót na dashboard z ukończonym działem)
  ✓; fail path (Liczby, 0/3 celowo błędnie → ekran "Spróbuj jeszcze raz"/"Wróć do menu")
  ✓; retry resetuje stan quizu do pytania 1/3 ✓; rekord powtórki tworzy się po ukończeniu
  działu i aktualizuje po sesji powtórkowej (`historia` z ocenami "umiem", `nastepna`
  przesunięta o interwał) — zweryfikowano bezpośrednio w localStorage ✓; konsola
  przeglądarki czysta (0 errors, 0 warnings) przez całą sesję QA ✓; mobile 390×844 —
  brak przelewania się opcji odpowiedzi, KaTeX renderuje się poprawnie po naprawie
  ulamki.json ✓.
- Zmiana w skilu: nie (lekcja dot. konkretnego pliku treści, nie metodyki skila).

## 2026-07-27 (it.3 — egzamin próbny + statystyki)
- Obserwacja: notacja przecinkowa (T1) działa poprawnie w realnym UI — wpisanie „2,5" gdy
  oczekiwana „2.5" w zadaniu otwartym (Ułamki) zalicza krok. Weryfikacja przez Playwright
  na localhost:5173 po zalogowaniu. Brak regresji w istniejących działach.
- Obserwacja: `zbudujArkusz` losuje arkusz przy każdym montowaniu EgzaminProbny — przy 27
  zamkniętych i 9 otwartych w puli (15 z 27, 6 z 9) wariantywność jest niska; kolejne
  egzaminy będą podobne. Nie jest to bug (wystarczy na present), ale warto odnotować jako
  punkt do rozbudowy puli treści.
- Obserwacja: `maksPkt` egzaminu liczy się dynamicznie z arkusza (15 + suma `punkty`
  zadań otwartych = 27 przy obecnej treści) — UI wyświetla „8/27 pkt" a nie hardcodowane
  „30 pkt". Decyzja z planu potwierdzona jako słuszna: gdy pula treści wzrośnie, wynik
  będzie się automatycznie skalował.
- Obserwacja: Statystyki w sekcji „Działy: diagnoza → dziś" pokazują wynik per dział
  z egzaminu (gdy brak ukończonego działu) — logika `postepPerDzial` (priorytet: quiz
  działu > ostatni egzamin > diagnoza) działa poprawnie bez diagnozy wstępnej.
- Wniosek: `onZakoncz` w EgzaminProbny wywołuje `zakonczonoEgzamin` asynchronicznie, ale
  komponent sam przechodzi w etap "wynik" synchronicznie przez `setEtap("wynik")` —
  race condition niemożliwy, bo zapis do localStorage nie blokuje renderowania wyniku.
  Wzorzec `onZakoncz` + własny stan wyniku w komponencie (zamiast czekania na callback)
  to słuszna architektura dla długich ekranów z własnym wynikiem.
- QA desktop (1280×900): golden path egzaminu (intro → 15 zamkniętych z Wstecz/pamięć
  zaznaczenia → 6 otwartych → ekran wyniku pkt/% + per dział) ✓; brak feedbacku
  zielony/czerwony w części zamkniętej ✓; localStorage `egzaminy[0]` + sesja
  `{typ:"egzamin"}` ✓; Statystyki (wykres z punktem egzaminu, działy z deltami,
  regularność słupki, pokrycie) ✓; konsola czysta ✓.
- QA mobile (390×844): intro OK, egzamin zamknięty (opcje czytelne, KaTeX w skalowanych
  opcjach), Wstecz pamięta zaznaczenie, statystyki (wykres SVG i słupki skalują się przez
  viewBox) ✓; konsola czysta ✓.
- Zmiana w skilu: nie (lekcja architektoniczna — wzorzec komponentu z własnym stanem
  wyniku zamiast zależności od callbacku zapisu).

## 2026-07-28 (it.5 — rozbudowa puli zadań)
- Obserwacja: pula rozbudowana z 27 zamkniętych + 9 otwartych do 45 zamkniętych + 18 otwartych
  (+2 zamknięte +1 otwarte per dział, we wszystkich 9 działach). Każdy dział ma teraz ≥5
  zamkniętych i 2 otwarte — cel planu osiągnięty.
- Obserwacja: `sprawdzKrok` akceptuje string listowy (`"11, 13, 17, 19, 23, 29"`) jako `oczekiwana`
  — porównanie jest case-insensitive string equals, więc lista liczb z przecinkami działa
  o ile format odpowiedzi ucznia jest identyczny. Weryfikacja przez QA: odpowiedź "11, 13, 17,
  19, 23, 29" zaliczona poprawnie.
- Obserwacja: zadania otwarte z odpowiedziami numerycznymi (potęgi, geometria przestrzenna —
  walec z π≈3.14) wymagają precyzji `oczekiwana` jako stringa z konkretną wartością;
  `sprawdzKrok` normalizuje przecinek/kropkę, więc "28.26" i "28,26" są równoważne.
- Obserwacja: wariantywność egzaminów po rozbudowie puli wyraźnie wzrosła — dwa kolejne
  egzaminy próbne miały inne zestawy działów i zadań w części zamkniętej (sprawdzone przez
  QA Playwright). Przy 45 zamkniętych los 15 daje znacznie więcej kombinacji niż przy 27.
- Obserwacja: QA Playwright przez `browser_run_code_unsafe` (JS eval) pozwala szybko
  przejść przez 15 pytań zamkniętych klikając zawsze opcję A — przydatne do weryfikacji
  przepływu egzaminu bez ręcznego klikania. Ref-based API (browser_click z konkretnym ref)
  jest konieczne dla pytań otwartych, gdzie trzeba wpisać konkretną odpowiedź.
- Wniosek: prefiks ID w JSON musi pasować do istniejącego wzorca w pliku (np. `gpr`/`gpro`
  dla geometria-przestrzenna, nie `gs`/`gso` jak sugerował plan) — implementer powinien
  sprawdzić istniejące ID przed dodaniem nowych, by zachować spójność.
- Wniosek: `zadania_otwarte` w JSON to osobna tablica top-level, nie podzbiór `cwiczenia`
  — walidacja liczby zadań skryptem Python musi czytać osobno `len(d['cwiczenia'])` i
  `len(d.get('zadania_otwarte', []))`.
- Zmiana w skilu: nie (lekcje dot. zawartości treści i QA procesu; metodyka skila bez zmian).

## 2026-07-28 (it.4 T1-T3 — deploy Vercel)
- Obserwacja: `vercel.json` z dwoma regułami (`rewrites` SPA + `github.silent`) wystarczy do
  pełnego deployu — żadnych zmian w vite.config.js ani package.json.
- Obserwacja: kluczowe pole w Vercel dashboard to **Root Directory** =
  `repetytorium - matematyka/app` — bez niego Vercel szuka package.json w korzeniu repo
  i build się nie powiedzie (repo jest monorepo z kilkoma aplikacjami).
- Wniosek: wzorzec identyczny z `repetytorium - j_polski` (it.16) — można go stosować
  wprost dla kolejnych aplikacji w tym repo (Hub itp.).
- Zmiana w skilu: nie.

## 2026-08-06 (it.6 — nowe działy: statystyka + prawdopodobieństwo)
- Obserwacja: dodanie 2 zupełnie nowych działów wymagało głównie zmian w treści —
  `statystyka.json` + `prawdopodobienstwo.json` wg wzorca istniejących plików działów,
  plus 2-liniowy wpis w `rejestr.js` (import + klucz w `DZIALY`) na dział. Zero zmian w
  komponentach (`Dzial.jsx`, `ZadanieOtwarte.jsx`, `TestWstepny.jsx`, `Start.jsx` — poza
  paletą kolorów modułów, patrz niżej —, `EgzaminProbny.jsx`, `core/egzamin.js`,
  `core/statystyki.js`) — dashboard, quiz, diagnoza, egzamin i statystyki odebrały nowe
  działy „za darmo". **Nieprawdziwe okazało się jednak twierdzenie, że cała logika jest
  „w pełni parametryczna względem `DZIALY`"** — końcowy przegląd kodu (code review) na
  koniec it.6 wykrył `core/plan.js` z osobną, hardkodowaną 9-elementową listą działów
  (`KOLEJNOSC_DZIALOW`), niezależną od rejestru: plan nauki („Na dziś") dla nowych działów
  nigdy by się nie wygenerował, a u istniejących profili plan pozostałby dziurawy na stałe
  (brak automatycznej migracji). Naprawiono w ramach fix-wave po przeglądzie: `generujPlan`
  przyjmuje teraz kolejność działów jako parametr (`Object.keys(DZIALY)` z warstwy App,
  konwencja jak `zbudujArkusz`/`postepPerDzial`), dodano `migrujPlan` dopisujący brakujące
  działy do planu istniejącego profilu bez ruszania dotychczasowych wpisów/statusów.
  Wniosek: „parametryczność względem DZIALY" trzeba weryfikować per moduł, a nie zakładać
  całościowo — hardkodowana lista działów może się ukryć poza główną ścieżką testowaną
  ręcznie (plan nie był sprawdzany w tej sesji QA, bo wymaga wielodniowego use-case'u).
- Obserwacja: diagnoza (`TestWstepny`) na świeżym profilu pokazała dokładnie **22 pytania**
  (2 na każdy z 11 działów) — zweryfikowane bezpośrednio w przeglądarce (Playwright,
  `document.body.innerText` → „Pytanie 1 z 22"). Licznik pytań skaluje się automatycznie
  z liczby działów w `DZIALY`, bez hardkodowania.
- Obserwacja: Egzamin Próbny (`zbudujArkusz`) zbudował arkusz 15 zamkniętych + 6 otwartych
  z reprezentacją nowych działów — ekran wyniku pokazał rozbicie per dział z pozycjami
  „Statystyka" (0/1 pkt) i „Prawdopodobieństwo" (1/3 pkt) obok pozostałych 9 działów,
  czyli oba nowe działy trafiły do części zamkniętej (Prawdopodobieństwo aż 3 razy — zgodnie
  z brakiem górnego limitu w `zbudujArkusz`, gwarantowane jest tylko ≥1 z każdego działu).
  6 losowo dobranych zadań otwartych akurat nie trafiło na sto*/pwo* — to poprawne
  zachowanie losowania przy puli 22 otwartych, nie błąd.
- Obserwacja: wzory LaTeX w opcjach Prawdopodobieństwa ($\frac{1}{2}$ itd.) renderują się
  poprawnie jako ułamki KaTeX (widoczne w drzewie dostępności jako węzły `math` z osobną
  strukturą licznik/mianownik) — brak regresji buga z ulamki.json (it.2).
- Obserwacja: `sprawdzKrok` poprawnie przyjął odpowiedź „0,5" (przecinek) dla kroku
  oczekującego „0.5" w zadaniu otwartym pwo1 — zgodne z normalizacją z it.3.
- Obserwacja drobna (nie z zakresu it.6): rozwiązanie wzorcowe gpo2 (geometria-plaska,
  treść z it.5) pokazuje fragment feedbacku kroku jako surowy tekst `8 \text{ cm}` zamiast
  renderu KaTeX — feedback kroku (`Dobrze!` + wartość) nie przechodzi przez KaTeXRenderer,
  tylko przez `rozwiazanie_wzorcowe` inline. Nie blokuje it.6 (dotyczy istniejącej treści
  sprzed tej iteracji), ale warto zanotować jako kandydat do przeglądu UX w it.7.
- Wniosek: przy kolejnych nowych działach nie trzeba w ogóle dotykać kodu — wystarczy
  plik JSON wg wzorca + 2-liniowy wpis w `rejestr.js`. To najtańsza możliwa rozbudowa
  aplikacji i potwierdza słuszność architektury `content/` → `core/` → `storage/` → `ui/`
  z zerową logiką specyficzną dla działu w warstwie UI.
- Zmiana w skilu: nie (lekcje dot. architektury aplikacji i weryfikacji QA, nie metodyki
  tutoringu opisanej w `SKILL.md`; wzorzec „nowy dział = JSON + 2 linie rejestr.js" jest już
  udokumentowany tutaj i w STAN-PROJEKTU.md, sekcja 2 „Stack i architektura").

## 2026-08-06 (it.7 — UX quizu: pauza po błędzie + fixy KaTeX)
- Obserwacja: przyczyna buga gpo2 (zanotowanego jako kandydat w LESSONS.md it.6) leżała w
  **templacie komponentu**, nie w treści JSON: `KrokZadania.jsx` budował feedback „Dobrze!"
  jako zwykły string interpolowany bez delimiterów `$...$` (np. `` `${wartosc} \text{ ${jednostka}}` ``
  wstawiany bezpośrednio jako tekst), więc `KaTeXRenderer` — który wykrywa matematykę
  wyłącznie po znaczniku `$` — nie miał czego renderować i pokazywał surowy LaTeX. Inaczej niż
  bug ulamki.json z it.2 (tam problem był w danych), tu poprawka poszła w komponencie: string
  feedbacku owinięto w `$...$` i przekazano przez `<KaTeXRenderer tekst={...} />`. Ta sama
  klasa bugu („zapomniane `$` wokół LaTeX-a"), ale dwa różne miejsca, w których może wystąpić
  (dane vs. komponent) — lint sprawdzający wyłącznie pliki JSON (zaproponowany w it.2) nie
  wyłapałby tego wariantu.
- Obserwacja: wzorzec „`open={(warunek) || undefined}`" na `<details>` w `Dzial.jsx` — gdy
  `warunek` jest `false`, atrybut `open` dostaje `undefined` zamiast `false`, więc React nie
  kontroluje stanu natywnego elementu (użytkownik może ręcznie rozwinąć/zwinąć „Przypomnij"
  przed pojawieniem się feedbacku bez walki z re-renderem, który wymuszałby `open={false}`).
  Dopiero gdy `warunek` staje się `true` (błędna odpowiedź), React zaczyna wymuszać `open`.
  Przydatny wzorzec dla każdego `<details>`/`<dialog>`, którego stan ma być „miękko"
  sugerowany, a nie zawsze wymuszony.
- Obserwacja (przeniesiona z Task 2/przeglądu it.7): `Dzial.jsx` zawsze otwiera
  `zadania_otwarte[0]` po ukończeniu części zamkniętej działu — drugie zadanie otwarte per
  dział (`*o2`, np. gpo2, gpro2, uo2...) jest osiągalne w normalnym przepływie użytkownika
  wyłącznie przez losowanie w Egzaminie Próbnym (`zbudujArkusz` losuje z **pełnej** puli
  otwartych, nie tylko `[0]` per dział). Kandydat do rotacji/losowania w przyszłej iteracji,
  żeby `*o2` nie było contentem „martwym" poza egzaminem.
- Obserwacja z własnego QA (Task 3): dokładnie ta ostatnia obserwacja utrudniła weryfikację
  DoD „zadanie otwarte z krokiem z jednostką → feedback renderuje jednostkę" w przeglądarce —
  jedyne zadanie otwarte osiągalne przez zwykły Dzial.jsx (gpo1, jednokrokowe) unmountuje się
  w tym samym renderze, w którym ustawia status „ok" (bo ostatni/jedyny krok wywołuje
  synchronicznie `setZakonczone(true)`), więc badge „Dobrze!" nigdy nie zdąży się wyrenderować
  na ekranie — architektonicznie nieobserwowalne dla jedno- lub ostatnio-krokowych zadań.
  Jedyne zadania z jednostką na kroku NIE-ostatnim to gpo2 i gpro2 (oba osiągalne tylko przez
  Egzamin Próbny). Dwie pełne próby Egzaminu Próbnego (losowanie 6 z ~22 otwartych, szansa na
  pominięcie obu ok. 52% per próba wg C(20,6)/C(22,6)) nie wylosowały żadnego z nich — fix
  zweryfikowano więc przez przegląd kodu źródłowego `KrokZadania.jsx` (delimitery `$...$`
  faktycznie obecne) zamiast bezpośredniej obserwacji w przeglądarce. Nie jest to defekt —
  jest to ograniczenie procesu QA przy losowej selekcji treści; udokumentowane tutaj zamiast
  dalszego, kosztownego czasowo próbowania.
- Obserwacja: transient bug automatyzacji Playwright (nie aplikacji) — kliknięcie w przycisk
  odpowiedzi z ułamkiem czasem timeoutuje z „element intercepts pointer events", bo wewnętrzny
  `<span>` renderu KaTeX przechwytuje wskaźnik. Obejście: `element.click()` bezpośrednio przez
  `browser_evaluate` zamiast `browser_click`. Powtarzało się identycznie na desktopie i mobile —
  warto pamiętać przy przyszłym QA z opcjami-ułamkami.
- Obserwacja: brief Task 3 zakładał, że część zamknięta Egzaminu Próbnego „auto-przechodzi (...)
  bez przycisku Dalej" — w rzeczywistości `EgzaminProbny.jsx` ma manualny przycisk „Dalej"
  (nieaktywny do wyboru odpowiedzi), bez auto-przejścia. To zachowanie jest identyczne przed i
  po it.7 (komponent nie był dotykany) — nie jest to regresja, tylko nieścisłość opisu w
  briefie; istotna część wymagania („brak feedbacku kolor zielony/czerwony") jest potwierdzona.
- QA desktop (1280×900): błędna odpowiedź w środku quizu (Ułamki u1) → pauza + wskazówka jako
  KaTeX + „Przypomnij" rozwinięte + „Dalej" ✓; wskazówka z `$\frac{7}{20}=\frac{35}{100}$`
  (Ułamki u5, ostatnie pytanie) wyrenderowana poprawnie jako ułamek KaTeX, błędna odpowiedź na
  ostatnim pytaniu → „Dalej" kończy quiz (ekran wyniku) ✓; poprawna odpowiedź (u2–u4) →
  auto-przejście po ~1 s ✓; feedback kroku z jednostką zweryfikowany przez przegląd kodu (patrz
  wyżej) zamiast bezpośredniej obserwacji ✓ (z zastrzeżeniem); konsola 0 errors przez całą
  sesję ✓.
- QA mobile (390×844): błędna odpowiedź (Ułamki u1) → wskazówka KaTeX + „Przypomnij" + „Dalej"
  czytelne i klikalne (zrzut ekranu potwierdza), `scrollWidth === clientWidth` (390 = 390, brak
  poziomego scrolla) ✓; „Dalej" poprawnie przechodzi do kolejnego pytania ✓; konsola 0 errors ✓.
- Sanity Egzaminu Próbnego: wybór odpowiedzi (celowo błędnej) w części zamkniętej nie pokazuje
  żadnego koloru poprawności (tylko neutralne podświetlenie „wybrane") — potwierdzony brak
  regresji z Task 1/2 (komponent egzaminu jest osobny i nie był modyfikowany); przerwanie
  egzaminu w połowie (reload strony) wraca czysto do ekranu wyboru profilu, bez błędów konsoli —
  stan egzaminu jest w pamięci (nieprzetrwały reload), co jest oczekiwane i spójne z resztą
  aplikacji (localStorage trzyma tylko ukończone sesje).
- Wniosek: dwie różne warstwy mogą złamać ten sam kontrakt „LaTeX musi mieć `$...$`" — dane
  (JSON) i szablony komponentów (stringi budowane w JSX). Przy przyszłych fixach/audytach
  renderu KaTeX sprawdzać obie warstwy, nie zakładać, że winna jest zawsze treść.
- Zmiana w skilu: nie (lekcje dot. konkretnego kodu komponentów i procesu QA, nie metodyki
  tutoringu w `SKILL.md`; obserwacja o `zadania_otwarte[0]`/rotacji `*o2` przeniesiona do
  STAN-PROJEKTU.md sekcja 9 jako kierunek it.8).
