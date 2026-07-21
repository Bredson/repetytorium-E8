# LESSONS — samodoskonalenie skila repetytorium-polski

Format wpisu:

```
## RRRR-MM-DD
- Obserwacja: ...
- Wniosek: ...
- Zmiana w skilu: (tak/nie — co zmieniono)
```

<!-- Wpisy dodawane po każdym użyciu skila -->

## 2026-07-20
- Obserwacja: NotebookLM jest nieosiągalny dla agenta (webfetch → login Google; automatyzowana
  przeglądarka blokowana przy logowaniu). Źródła trzeba dostarczać jako pliki w `zrodla/`
  lub listę publicznych URL-i.
- Obserwacja: `reference/egzamin.md` w pierwotnej wersji zawierał nieaktualne dane
  (120 min zamiast 150; lista lektur sprzed pełnej operacjonalizacji reformy — brak kanonu
  IV-VI, Syzyfowych prac, Artysty Mrożka, ksiąg Pana Tadeusza I/II/IV/X/XI/XII).
- Obserwacja: informator CKE P1 sam jest wewnętrznie nieaktualny (podaje 120 min) —
  komunikaty CKE mają pierwszeństwo nad informatorem.
- Wniosek: przed każdą sesją merytoryczną weryfikować parametry egzaminu z najnowszym
  komunikatem CKE (publikacja do 20 sierpnia roku szkolnego); dla rocznika 2027 sprawdzić:
  datę egzaminu, status lektur IV-VI (całość vs fragment), potwierdzenie 150 min.
- Wniosek: przy celu 95-100% nie pomija się żadnego działu — test wstępny różnicuje tylko
  głębokość i czas, nie zakres.
- Zmiana w skilu: TAK — przepisano `reference/egzamin.md` (150 min, punktacja 25+20,
  pełna zweryfikowana lista lektur z podziałem VII-VIII / IV-VI / wykreślone, limity błędów
  w kryteriach, błąd kardynalny, rotacja lektur wiodących, sekcja "Do śledzenia").
  Powstał dokument bazowy `wklad-merytoryczny-plan-repetytorium.md` (root projektu) —
  moduły A-G, plan faz 0-4, wymagania dla aplikacji.

## 2026-07-20 (bank pytań testu wstępnego)
- Obserwacja: wygenerowano `app/src/content/polski/test-wstepny.json` (18 pytań, 22 pkt)
  i `forma-pisemna.json` (ogłoszenie, 3 pkt) wg kontraktu z ARCHITEKTURA.md i rozkładu
  SPEC-FAZA-0. Klucz zweryfikowany skryptem: rozkład modułów, monotoniczność poziomów,
  punktacja poziom↔pkt, indeksy w zakresie, równomierny rozkład poprawnych (3/4/4/3).
- Wniosek: przy bankach pytań zawsze uruchamiać skrypt asercji (moduły, poziomy, punkty,
  zakresy indeksów, wspólny zrodloTekst dla wiązki E) — ręczna weryfikacja klucza nie
  wystarcza. Dwa pytania E trzymać obok siebie w kolejności (wspólny tekst źródłowy).
- Wniosek: unikać duplikacji formy między pytaniem zamkniętym F a zadaniem open-short
  (test: zaproszenie → forma pisemna: ogłoszenie), by diagnoza pokryła szerzej moduł F.
- Zmiana w skilu: nie (wnioski zapisane tutaj; do rozważenia sekcja "walidacja banków
  pytań" w SKILL.md po Fazie 0).

## 2026-07-20 (UI Fazy 0 + QA w przeglądarce)
- Obserwacja: zbudowano pełny przepływ React (wybór profilu → PIN → start → test 18 pytań
  → forma pisemna z samooceną → wynik). QA w Chrome DevTools przeszło: trwałość po
  reloadzie, błędny/poprawny PIN, dark mode zapisany w profilu, mobile 375px, konsola
  bez błędów. Punktacja zweryfikowana ręcznie (forma 4/5 kryteriów → 2/3 pkt; suma 6/25).
- Obserwacja: `Object.entries(perModul)` zwraca moduły w kolejności wstawiania (kolejność
  pytań), nie A-F — trzeba jawnie sortować w UI.
- Obserwacja (QA): narzędziowy `fill` na textarea ustawia wartość DOM, ale React nie
  dostaje zdarzenia input (licznik słów = 0). Do testów kontrolowanych pól Reacta używać
  `type_text` po focusie albo natywnego settera + `dispatchEvent(new Event("input"))`.
  Analogicznie: kilka kliknięć w jednym ticku nadpisuje stan (stale closure) — klikać
  sekwencyjnie z przerwą na re-render.
- Wniosek: weryfikacja w przeglądarce (zasada 6) wyłapała realny błąd sortowania, którego
  nie widać w kodzie na pierwszy rzut oka — nie pomijać tego kroku.
- Zmiana w skilu: nie (wnioski o technikach QA zapisane tutaj).

## 2026-07-20 (Faza 1 / iteracja 1: plan + Dziady II + spaced repetition)
- Obserwacja: subagent `task` DWUKROTNIE zwrócił pusty wynik przy generowaniu kompendium
  lektury (utworzył tylko katalog, bez pliku treści). Kompendium napisano ręcznie w głównym
  wątku i zwalidowano skryptem asercji — zadziałało od razu.
- Wniosek: generowanie treści merytorycznych (kompendia, banki pytań, fiszki) robić
  w głównym wątku; subagentów używać do researchu i eksploracji, nie do tworzenia
  plików z treścią edukacyjną.
- Obserwacja (QA): pełna pętla przeszła w przeglądarce: migracja schematu 1→2 profilu
  Zosi, plan 42 tygodni z diagnozy (moduł C z brakami rotowany pierwszy), dashboard maks
  3 zadania (powtórki przed nauką, zrobiona lektura znika z listy), quiz z natychmiastowym
  feedbackiem (zielony/bursztyn + wyjaśnienie), fiszki ("jeszcze nie" wraca na koniec talii),
  powtórka po symulacji +1 dnia (interwał 1→3, historia zapisana), wyjście z powtórki bez
  kończenia nie psuje rekordu. Mobile 375px bez overflow, konsola czysta.
- Obserwacja (QA): `resize_page` w Chrome DevTools MCP nie zszedł poniżej ~500px
  (minimalna szerokość okna) — do testów mobile używać `emulate` z viewportem
  (`375x700x2,mobile,touch`); emulacja przeładowuje stronę (stan Reacta ginie).
- Wniosek: symulację upływu dni robić przez edycję pól `nastepna` w localStorage
  + reload — czyste funkcje z parametrem `dzis` ułatwiają też testy jednostkowe.
- Zmiana w skilu: do rozważenia — reguła "treść merytoryczna tylko w głównym wątku"
  w SKILL.md (na razie wniosek tutaj).

## 2026-07-20 (Faza 1 / iteracja 2: ćwiczenia C + pisanie F + rejestr treści)
- Obserwacja: wprowadzenie `rejestr.js` (LEKTURY/CWICZENIA/PISANIE/material()/DOSTEPNE)
  jako jedynego punktu wiedzy o treści opłaciło się od razu: App/Start/Powtorka przestały
  znać konkretne pliki JSON, a `zadaniaNaDzis` dostaje mapę dostępności jako argument —
  dodanie treści B/D/E to nowy JSON + wpis w rejestrze, zero zmian w core i UI.
- Obserwacja (metodyka): pierwszy szkic ekranu final ćwiczenia celebrował "Ćwiczenie
  zaliczone! 🎉" niezależnie od wyniku — przy 8% to fałszywy komunikat. Poprawiono:
  próg 80% różnicuje celebrację (🎉) od growth-mindset (🌱 "Pierwsze podejście za Tobą").
  Ten sam wzorzec co w Powtorka.jsx. UWAGA: Lektura.jsx final nadal celebruje
  bezwarunkowo — do wyrównania przy iteracji 3.
- Obserwacja (QA): pełny przepływ przeszedł: teoria→quiz→final (C), pigułka+plan formy→
  tekst→wzorzec+samoocena→final (F), oba zadania znikają z "Na dziś", powtórka
  `ortografia-1:quiz` powstaje na jutro (interwał 1), po symulacji dnia otwiera quiz
  ćwiczenia przez `material()`, powtórki lektur działają po renamie propa
  lektura→material. Migracja schematu 2→3 profilu Zosi bezszwowa. Mobile 375px OK,
  konsola czysta, build przechodzi.
- Obserwacja (QA, technika): React deduplikuje wartość kontrolowanego pola — natywny
  setter + `dispatchEvent(input)` z TĄ SAMĄ wartością nie odpala re-rendera (value
  tracker). Trzeba najpierw ustawić inną wartość (np. ""), wyemitować input, potem
  docelową. Uzupełnienie lekcji z QA Fazy 0.
- Wniosek: przy automatyzacji przeklikiwania quizów w QA pytania wielowierszowe (PF)
  wymagają osobnej obsługi (przyciski "Prawda"/"Fałsz" per wiersz) — skrypt klikający
  tylko `button.opcja` utknie na disabled "Sprawdź".
- Zmiana w skilu: nie (wnioski zapisane tutaj).

## 2026-07-21 (Faza 1 / iteracja 3: treści B/D/E + wyrównanie finału Lektury)
- Obserwacja: dodanie trzech ćwiczeń (gramatyka-1, literackie-1, czytanie-1) wymagało
  wyłącznie nowych JSON-ów + wpisów w `rejestr.js` — zero zmian w core i UI. Architektura
  rejestru z iteracji 2 potwierdzona w praktyce.
- Obserwacja (metodyka): w module E dwa teksty źródłowe w `zrodloTekst` (popularnonaukowy
  o śnie, publicystyczny o automatach) niosą po 3-4 pytania wiązki — dokładnie jak na
  arkuszu. Pytanie e1-q-12 uczy wprost najczęstszego błędu zerującego ("odpowiedź z głowy"
  sprzeczna z tekstem). Ten wzorzec (pytanie o błąd ucznia) warto powtarzać w B/D.
- Obserwacja (QA): walidator przepuścił rozkład kluczy {1:5} (max = połowa singli), ale
  5×B to wciąż zgadywalny wzorzec — przetasowano do {0:1,1:3,2:3,3:3}. Wniosek: po
  walidacji patrzeć na rozkład, nie tylko na wynik OK/FAIL.
- Obserwacja (QA): pełny przepływ E przeszedł: teoria (5 sekcji) → quiz 12 pytań
  z blockquote tekstu źródłowego (desktop i mobile 375px bez overflow) → final 🎉 przy
  100% → powtórka na jutro → zadanie znika z "Na dziś". Final Lektury po wyrównaniu:
  quiz 0% → 🌱 "Dobry pierwszy krok" (bez fałszywej celebracji), komunikat wprost
  odnosi się do "fiszki umiem od razu 18/18" — spójnie z Cwiczenie/Powtorka.
- Obserwacja (QA, technika): automat quizowy z zebranymi wcześniej referencjami przycisków
  gubi kliknięcia po re-renderze Reacta — przy PF każdy wiersz klikać po ŚWIEŻYM
  querySelectorAll z pauzą ~120 ms. Fiszki: tylko PIERWSZA karta ma przycisk
  "Pokaż odpowiedź"; kolejne odwraca się klikając przycisk-kartę (tekst "dotknij, aby
  odwrócić"). Duży JSON do localStorage najprościej wstrzyknąć przez tymczasowy plik
  w `public/` + `fetch()` (Vite serwuje statycznie), potem plik usunąć.
- Obserwacja (QA, higiena): QA na profilu testowym zostawia artefakty (sesje 0%, powtórki,
  nadpisane wyniki) — przed QA robić backup postępów przez `evaluate_script` z `filePath`,
  po QA przywracać stan bazowy (backup minus artefakty). Zosia wróciła do stanu wyjściowego.
- Zmiana w skilu: nie (wnioski zapisane tutaj).

## 2026-07-21 (Faza 1 / iteracja 4: rozprawka w module F + lektura Balladyna)
- Obserwacja: druga lektura (balladyna.json) i długa forma pisemna (rozprawka-1.json)
  weszły bez żadnych zmian w core poza dwoma uogólnieniami: `zadanie.minSlow ?? 20`
  w Pisanie.jsx i `e.czasMin ?? 10` w plan.js (czas z rejestru zamiast sztywnych 10 min).
  Kontrakty treści z iteracji 1-2 pokryły 100% potrzeb — to sygnał, że schematy JSON
  są stabilne i można skalować treść bez dotykania kodu.
- Obserwacja (metodyka): rozprawka dostała progi egzaminacyjne wprost w pigułce
  (min. 200 wyrazów, <180 = tylko treść, błąd kardynalny zeruje kompetencje literackie)
  i 8 kryteriów samooceny odwzorowujących kryteria CKE. Wzorzec (216 wyrazów) łączy
  argumenty z obu dostępnych lektur (Balladyna + Dziady II) — uczy przenoszenia wiedzy
  między modułami A i F. Komunikat licznika przy długiej formie tłumaczy KONSEKWENCJĘ
  progu ("poniżej tracisz punkty"), nie tylko sam próg.
- Obserwacja (QA): pełne przepływy przeszły na dev serwerze: Balladyna kompendium
  (7 sekcji zwijanych) → quiz 12/12 → fiszki 18/18 → 🎉 → powtórki quiz+fiszki
  na 2026-07-22; rozprawka: przycisk zablokowany poniżej 200 wyrazów, tekst 215 wyrazów
  → samoocena 8 kryteriów ze wzorcem → 🏆 20/20 pkt zapisane w postępach. Mobile 390px
  bez poziomego overflow. Po zrobieniu lektury i pisania "Na dziś" poprawnie dosypuje
  kolejne zadania z tygodnia (limit 3 slotów: powtórki najpierw — zgodnie z projektem).
- Obserwacja (QA, technika): karta fiszki to `button.karta` z aria-label "Pokaż
  odpowiedź" — a11y snapshot pokazuje label, ale szukanie po textContent zawodzi;
  w automacie klikać `document.querySelector("button.karta")`. Ostatnie pytanie quizu
  ma przycisk "Zakończ quiz" zamiast "Dalej" — pętla automatu musi to przewidzieć.
  Zmiana emulacji viewportu (chrome-devtools) przeładowuje stronę i wylogowuje
  z profilu — sekwencja QA: najpierw wszystkie kroki desktop, potem dopiero mobile.
- Zmiana w skilu: nie (wnioski zapisane tutaj).

## 2026-07-21 (Faza 1 / iteracja 5: Zemsta + Opowieść wigilijna + ortografia-2 + czytanie-2)
- Obserwacja: iteracja "sam JSON, zero zmian w kodzie" potwierdzona w 100% — cztery nowe
  treści (2 lektury + 2 ćwiczenia) weszły wyłącznie przez pliki JSON + 4 wpisy
  w `rejestr.js`. Build 50 modułów bez ostrzeżeń. Architektura rejestru skaluje się
  zgodnie z założeniem z iteracji 2.
- Obserwacja (metodyka): duet argumentacyjny Zemsta ↔ Opowieść wigilijna (przemiana
  człowieka/sporu na dobre) zapisany symetrycznie w sekcjach "wypracowanie" OBU lektur —
  uczeń dostaje gotową parę dowodów do rozprawki niezależnie od tego, którą lekturę
  otworzy pierwszą. Ostrzeżenia przed błędem kardynalnym sformułowane jako konkretne
  zdania-pułapki („Rejent zabił Cześnika" — NIKT nie ginie; „Tim umarł" — Tim ŻYJE).
- Obserwacja (QA): pełne przepływy desktop: Zemsta quiz 12/12 + fiszki 18/18 → 🎉;
  ortografia-2 teoria (6 sekcji) + quiz 12/12; Opowieść wigilijna quiz 12/12 + fiszki
  18/18; czytanie-2 quiz 12/12 z poprawnym renderem OBU tekstów źródłowych
  (`zrodloTekst`: apel o plastiku przy q04-07, ironia „Cóż za odkrycie!" przy q09-12).
  Wszystkie klucze odpowiedzi zgodne z UI. Dashboard po ukończeniu Zemsty natychmiast
  podstawia Opowieść wigilijną w slot A. Mobile 390x844: lektura i quiz bez poziomego
  overflow. Stan Zosi przywrócony z backupu (2 powtórki + Balladyna na dziś).
- Obserwacja (QA, technika): pola rekordu powtórki to `nastepna` (nie `termin`) —
  przy manipulacji localStorage sprawdzić strukturę PRZED edycją, nie zgadywać nazw pól.
  Dostęp do treści spoza bieżącego tygodnia planu: podmienić `plan.tygodnie[0].tematy[1]`
  na docelowy moduł (np. C→E) w postępach + reload — prostsze niż sztuczne powtórki.
  `zadaniaNaDzis` bierze PIERWSZE nieprzerobione ćwiczenie modułu, więc żeby pokazać
  czytanie-2, trzeba oznaczyć czytanie-1 jako przerobione (kopia kształtu rekordu quiz).
  Skrypty `evaluate_script` czytające DOM zaraz po `click()` widzą stary render —
  React renderuje asynchronicznie; każdy odczyt po kliku opakować w `setTimeout`/await.
- Zmiana w skilu: nie (wnioski zapisane tutaj).

## 2026-07-21 (Faza 1 / iteracja 6: Mały Książę + Kamienie na szaniec)
- Obserwacja: wzorzec "sam JSON, zero zmian w kodzie" potwierdzony trzeci raz z rzędu —
  2 lektury weszły przez 2 pliki JSON + 2 wpisy w `rejestr.js`. Build 52 moduły
  bez błędów. Kanon lektur obowiązkowych VII-VIII ukończony: 6/6 (Dziady II, Balladyna,
  Zemsta, Opowieść wigilijna, Mały Książę, Kamienie na szaniec).
- Obserwacja (metodyka): nowy duet argumentacyjny przyjaźń: Mały Książę (oswajanie
  Lisa) ↔ Kamienie na szaniec (akcja pod Arsenałem) — zapisany symetrycznie w sekcjach
  "wypracowanie" obu lektur. Trzeci duet: Bankier ↔ Scrooge (pieniądze nie dają
  szczęścia) spina Małego Księcia z Opowieścią wigilijną. W literaturze faktu błędy
  kardynalne są najgroźniejsze — zapisane wprost jako zdania-pułapki: „Rudy zginął pod
  Arsenałem" (NIE — odbity, zmarł 4 dni później z ran po torturach), „Zośka poległ pod
  Arsenałem" (NIE — pod Sieczychami VIII 1943), „pilot podróżował z Księciem po
  planetach" (NIE — poznał go na Saharze).
- Obserwacja (QA): desktop: Mały Książę quiz 12/12 + fiszki 18/18 → 🎉; Kamienie na
  szaniec quiz 12/12 + fiszki 18/18 → 🎉; dashboard po ukończeniu Małego Księcia
  natychmiast podstawił Kamienie w slot A. Mobile 390x844: dashboard, lektura i quiz
  bez poziomego overflow. Stan Zosi przywrócony z backupu (2 powtórki + Balladyna).
- Obserwacja (QA, technika): przycisk fiszki to dokładnie "Umiem!" (z wykrzyknikiem) —
  matcher `trim() === "Umiem"` zawodzi; w skryptach QA używać `startsWith("Umiem")`.
  Cały przepływ lektury (otwarcie z "Na dziś" + quiz 12 pytań + 18 fiszek) da się
  przejść dwoma skryptami `evaluate_script` z planem kroków i waitami 200-400 ms.
  Cofnięcie "przerobienia" lektury (delete z `p.lektury` + filtr powtórek) to najprostszy
  sposób na ponowne pokazanie jej w "Na dziś" do testu mobile.
- Zmiana w skilu: nie (wnioski zapisane tutaj).
