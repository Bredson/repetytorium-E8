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
