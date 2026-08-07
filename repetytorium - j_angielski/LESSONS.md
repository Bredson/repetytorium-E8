# LESSONS — repetytorium j. angielski

Wnioski z pracy nad skilem i sesji z uczniami. Każdy wpis: data, obserwacja, zmiana.

## 2026-07-20 — budowa skila i weryfikacja źródeł

1. **Nie ufaj pojedynczemu wydaniu informatora.** Wydanie Pearson 2024 podawało
   90 min, wydanie OKE 2025 i gov.pl — 110 min. Reguła: fakty organizacyjne
   (czas, terminy) weryfikować zawsze z komunikatami CKE/gov.pl dla NAJNOWSZEJ
   sesji, nie z opracowaniami wydawnictw.
2. **Wariant II.1 ≠ pełna podstawa.** Od 2025 usunięto dział "życie społeczne"
   (zostało 13 zakresów), wybrane aspekty innych działów oraz z gramatyki m.in.
   mowę zależną, pytania pośrednie, stronę bierną w Present Perfect. Nie generować
   materiałów z usuniętych treści jako wymaganych.
3. **Suma punktów (55) nie występuje w informatorze** — informator podaje tylko
   zakresy liczby zadań i udziały procentowe. 55 pkt potwierdzone z arkuszy
   2022-2025; przy symulacjach trzymać się realnych arkuszy CKE.
4. **Priorytety treningowe z danych CKE 2025:** pytania w Past Simple (26%
   poprawnych!), zwroty grzecznościowe, word spotting, zadania otwarte (60% vs
   73% zamknięte). Te obszary domyślnie nadreprezentować w quizach.
5. **Subagenty:** raport researchowy musi być wklejony w OSTATNIEJ wiadomości
   subagenta — inaczej treść przepada. Przy zlecaniu researchu zawsze dopisywać:
   "pełny raport umieść w finalnej odpowiedzi".
6. **Do zrobienia po 20.08.2026:** sprawdzić harmonogram CKE na 2027 i wpisać
   dokładną datę egzaminu do `reference/egzamin.md` i profili uczniów.

## 2026-08-06 (it.1 — scaffold SPA + 3 działy tekstowe)

1. **Wzorzec matematyki przeniósł się niemal 1:1.** Warstwy `content → core → storage → ui`,
   adapter `localStorage`, wzorzec ekranów (profil → diagnoza → dashboard → dział → zadanie
   otwarte → powtórki) oraz `core/powtorki.js` (interwały `[1,3,7,14]`) przeniesione bez zmian
   koncepcyjnych — tylko klucz storage (`rep:postepy:{uuid}:angielski`) i port dev servera (5175)
   są inne.
2. **Sprawdzanie odpowiedzi wymagało nowego mechanizmu.** Matematyka porównuje wynik liczbowy;
   angielski potrzebuje dopasowania tekstowego z wariantami pisowni/synonimów i bez wrażliwości
   na wielkość liter (np. "DOES NOT" → `["doesn't", "does not"]`). Stąd `sprawdzKrok` z tablicą
   `akceptowane` per krok zadania otwartego, zamiast pojedynczej odpowiedzi.
3. **Pole `tekst` w pytaniu to nowość względem matematyki.** Dział „Czytanie" wymaga ramki
   z tekstem źródłowym (ogłoszenie, wiadomość, dialog) wyświetlanej nad pytaniem — dodane jako
   opcjonalne pole `tekst` w schemacie JSON pytania, renderowane jednym warunkowym blokiem
   zarówno w widoku działu, jak i w widoku powtórek (ten sam styl: tło, padding, kursywa).
4. **Brak KaTeX upraszcza UI** — angielski nie potrzebuje renderowania wzorów, więc cały ten
   fragment stacku matematyki (biblioteka + komponenty renderujące LaTeX) został pominięty
   od początku, bez próby integracji i późniejszego usuwania.
5. **QA (desktop + mobile) nie wykryło żadnych błędów funkcjonalnych.** Pełna ścieżka: profil →
   diagnoza (6 pytań, w tym z ramką `tekst`) → dashboard → dział „Czytanie" (zamknięte c1–c5,
   w tym celowo błędna odpowiedź → pauza + podpowiedź + „Dalej", ramka `tekst` widoczna nad
   każdym z c1–c5) → zadanie otwarte (dopasowanie wariantu i wielkości liter potwierdzone) →
   powtórki z dashboardu (wymagało ręcznej edycji `nastepna` w localStorage, bo nowe powtórki
   są planowane na jutro) → sesja powtórek działa poprawnie. Mobile 390×844: brak przewijania
   poziomego, czytelność zachowana. Konsola: 0 błędów w obu przebiegach.

Zmiana w skilu: żadna — skill i `reference/` pozostają źródłem treści/metodyki bez zmian;
zmianę architektoniczną (SPA zamiast HTML-per-uczeń) odnotowano wyłącznie w STAN-PROJEKTU.md.

## 2026-08-07 (it.2 — dział Słuchanie z TTS)

1. **Headless Chromium ma domyślnie realne głosy EN — fallback trzeba wymusić.** W przeciwieństwie
   do naiwnego założenia „w CI nie ma głosów", nasz headless Playwright/Chromium zwracał realne
   głosy `en-*` z `getVoices()` od razu. Żeby przetestować tor fallbacku (PL alert + transkrypcja),
   trzeba było `page.addInitScript` (przez `browser_run_code_unsafe`) PRZED nawigacją, nadpisujący
   `getVoices()` tak, by zwracał tylko głos `pl-PL` — dopiero wtedy komponent po ~2 s przełącza się
   na fallback. Sam tor playera (głosy EN dostępne) też przetestowany osobno w Step 3.
2. **Instrumentacja `speechSynthesis.speak/getVoices` z brief-u działa, ale literalny stub z sekcji
   Step 3 wymaga poprawki na realnym Chromium.** Podstawienie fałszywych obiektów-głosów (`{lang,
   name}`, nie prawdziwych `SpeechSynthesisVoice`) i przypisanie ich do `u.voice = glos` w
   `OdtwarzaczTTS.jsx` wywołuje natywny walidator WebIDL Chromium, który rzuca `TypeError: Failed
   to set the 'voice' property... Failed to convert value to 'SpeechSynthesisVoice'`. Wyjątek leci
   w środku `kwestie.forEach(...)`, więc pętla przerywa się w połowie: `speak()` nigdy nie zostaje
   wywołane, a watchdog (`setTimeout` rejestrowany jako OSTATNIA instrukcja `odtworz()`, po pętli)
   też się nie ustawia — przycisk zostaje trwale zablokowany na „Odtwarzanie…". To ograniczenie
   test-harnessu (prawdziwy `getVoices()` zwraca prawdziwe `SpeechSynthesisVoice`, które przechodzą
   walidację bez problemu), NIE bug produkcyjny. Obejście do QA: dodatkowo nadpisać
   `Object.defineProperty(SpeechSynthesisUtterance.prototype, "voice", {get/set})`, żeby ominąć
   natywną walidację i przyjąć fałszywy obiekt. Przy okazji potwierdza to wcześniej odnotowaną
   obserwację (progress.md z it.2), że watchdog rejestrowany PO pętli jest kruchy — wyjątek w
   trakcie pętli (nie tylko stale-onend przy replayu) też go omija; wart rozważenia przy przyszłym
   refaktorze na generation counter.
3. **`key={pytanie.id}` / `key={odtwarzacz-${pytanie.id}}` jako wzorzec resetu stanu.** Odtwarzacz
   TTS musi „zapomnieć" stan (licznik odtworzeń, tryb wolniej, załadowane głosy) przy każdym nowym
   pytaniu — zamiast ręcznie czyścić stan w `useEffect`, komponent jest montowany z kluczem
   zależnym od `pytanie.id`, co wymusza pełny remount i ponowne `zaladuj()`. Prosty i niezawodny
   wzorzec do reużycia przy każdym komponencie „na pytanie", który trzyma wewnętrzny stan.
4. **QA (desktop + mobile) potwierdziło pełną funkcjonalność bez błędów konsoli.** Fallback: diagnoza
   8/8 pytań, tw-sl1/tw-sl2 z transkrypcją, dział Słuchanie sl1–sl5 (poprawne z JSON), oba zadania
   otwarte (slo1 piknik, slo2 muzeum) — kroki `akceptowane` zaliczają warianty. Instrumentacja
   playera: 3 kwestie odczytane (`window.__spoken`), `lang` en-GB/en-US naprzemiennie, `rate` 0.95 →
   po „wolniej" 0.8, licznik odtworzeń = 2 → ostrzeżenie widoczne, „Pokaż transkrypcję" po
   odpowiedzi działa. Mobile 390×844: brak przewijania poziomego, oba przyciski playera klikalne.
5. **Dźwięk NIE był odsłuchany automatycznie.** Cała QA telemetrii TTS opierała się na mockowaniu
   `speechSynthesis` (patrz punkty 1–2) — żaden prawdziwy dźwięk nie został odtworzony ani
   zweryfikowany słuchowo. Ręczny odsłuch (desktop, realny głos systemowy EN, ocena tempa i
   zrozumiałości) pozostaje do wykonania przez użytkownika; wynik do odnotowania w kolejnym wpisie.

Zmiana w skilu: żadna — TTS działa na wbudowanym Web Speech API bez zależności zewnętrznych,
skill i `reference/` pozostają źródłem treści/metodyki; obserwacje o instrumentacji QA i
watchdogu odnotowano wyłącznie tutaj i w `progress.md` iteracji.
