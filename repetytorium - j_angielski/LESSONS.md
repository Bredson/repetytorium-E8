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
