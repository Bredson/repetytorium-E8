# SPEC — Faza 1 / iteracja 15: Statystyki postępu

Data: 2026-07-21 · Bazuje na: `ARCHITEKTURA.md`, stan po it. 14 (`STAN-PROJEKTU.md`)

## Cel iteracji

Zosia widzi swój postęp w czasie — nie tylko wynik ostatniej sesji. Ekran statystyk
odpowiada na cztery pytania: *jak idzie mi w czasie?*, *w których modułach urosłam?*,
*czy ćwiczę regularnie?*, *ile materiału już przerobiłam?* Dane już istnieją
(pełna historia `sesje` + `egzaminy` ze szczegółami) — iteracja to czysta
prezentacja bez zmian schematu postępów (zostaje v4).

## User stories

1. **Trend:** Na karcie „Twoja diagnoza" klikam „Zobacz statystyki postępu" →
   wykres liniowy wyników wszystkich sesji od diagnozy do dziś; egzaminy próbne
   wyróżnione, linia odniesienia na 80% (próg „umiem").
2. **Moduły:** Widzę dla każdego modułu A-F, jak zmienił się mój wynik względem
   diagnozy (delta ▲/▽/= jak na ekranie wyniku egzaminu).
3. **Regularność:** Widzę sesje z ostatnich 8 tygodni i bieżącą serię dni
   z rzędu — komunikat zawsze zachęcający (growth mindset, nigdy kara za przerwę).
4. **Pokrycie:** Widzę, ile lektur / ćwiczeń / form pisania przerobiłam z całości.

## Architektura

Wzorzec warstw bez wyjątków: **core liczy, UI renderuje, App spina**.

### Nowy moduł core: `src/core/statystyki.js` (czysta logika, zero DOM/importów treści)

- `seriaWynikow(postepy, mapaEtykiet)` → `[{ data, procent, typ, etykieta }]` chronologicznie.
  Źródło: `postepy.sesje` o typach z wynikiem punktowym w skali procentowej:
  `diagnoza`, `quiz-lektury`, `quiz-cwiczenia`, `pisanie`, `egzamin`.
  Pomijamy `powtorka` i `fiszki-lektury` (inna skala oceny).
  `procent = round(100 * wynikPkt / maksPkt)`; `etykieta` czytelna dla 14-latki
  (np. „Quiz: Balladyna"), budowana z `ref` przez mapę etykiet podaną w argumencie
  (UI buduje ją z rejestru) — core nie importuje treści.
- `postepPerModul(postepy, mapaModulow)` → `{ A: { diagnoza, teraz, delta }, ... }`
  dla modułów A-F. `diagnoza` = procent z `postepy.diagnoza.perModul`.
  `teraz` = procent z najnowszych dostępnych danych modułu: ostatni wynik każdego
  materiału (lektury→A, ćwiczenia→wg pola modułu z mapy, pisanie→F) oraz
  `perModul` ostatniego egzaminu — średnia ważona punktami (suma pkt / suma maks).
  Moduł bez nowych danych → `teraz = diagnoza`, `delta = 0`.
  `mapaModulow` = `{ ref → modul }` dla ćwiczeń (UI buduje z rejestru).
- `aktywnosc(postepy, dzis)` → `{ tygodnie: [{ od, liczba }] (8 ostatnich), seriaDni }`.
  `seriaDni` = liczba kolejnych dni (wstecz od `dzis` lub wczoraj) z ≥1 sesją;
  dziś bez sesji nie zeruje serii zaczętej wczoraj. Parametr `dzis` dla testów.
- `pokrycie(postepy, liczebnosci)` → `[{ nazwa, zrobione, wszystkie }]` dla
  lektur / ćwiczeń / pisania. Zrobione = mają zapisany wynik (quiz lektury,
  quiz ćwiczenia, praca pisemna). `liczebnosci` z rejestru podaje UI.

### Nowy komponent: `src/ui/components/WykresLiniowy.jsx`

Czysty SVG z `viewBox` (skaluje się do szerokości karty — mobile bez osobnej
logiki). Props: `punkty` (z `seriaWynikow`), `liniaOdniesienia` (80).
Oś Y 0-100%, oś X czas. Egzaminy jako większe punkty. Kolory wyłącznie ze
zmiennych CSS (`--kolor-akcent`, `--kolor-sukces`...) — motyw ciemny działa
automatycznie. Jeden punkt (sama diagnoza) → renderuje punkt + tekst zachęty
przekazany przez rodzica.

### Nowy ekran: `src/ui/pages/Statystyki.jsx`

Cztery sekcje-karty (kolejność jak user stories):

1. **„Twoja droga"** — `WykresLiniowy`; pod nim podpis ostatniego punktu
   i najlepszego wyniku. Pusto (tylko diagnoza) → zachęta „Każda sesja doda
   punkt na tej mapie".
2. **„Moduły A-F"** — 6 wierszy: `PasekPostepu` (wariant `modul-x`, klasy już
   w CSS) z wartością „teraz" + delta ▲/▽/= vs diagnoza.
3. **„Regularność"** — mini-słupki SVG inline (8 tygodni) + komunikat serii:
   „🔥 N dni z rzędu" / „Zacznij dziś nową serię 🌱".
4. **„Pokrycie materiału"** — 3 paski „Przerobione X z Y".

Sekcje zawsze widoczne (puste nie znikają — pokazują, co przed nią).
Props: `postepy` + mapy/liczebności zbudowane z rejestru, `onWroc`.

### Zmiany w istniejących plikach

- `App.jsx`: ekran `"statystyki"`, render `<Statystyki>` (buduje mapy z rejestru),
  przejście ze Start i powrót.
- `Start.jsx`: przycisk „Zobacz statystyki postępu" w karcie „Twoja diagnoza"
  (obok „Zobacz szczegóły i omówienie odpowiedzi"), prop `onOtworzStatystyki`.

**Bez zmian:** schemat postępów (v4), storage, rejestr treści, pozostałe ekrany.

## Testy (node, jak reguła CKE w it. 14)

Syntetyczne `postepy`, przypadki:

- `seriaWynikow`: kolejność chronologiczna; powtórki/fiszki pominięte; procent OK.
- `postepPerModul`: delta ▲ (wzrost), ▽ (spadek), = (brak danych → teraz=diagnoza);
  moduł F liczony z pisania + egzaminu; średnia ważona punktami.
- `aktywnosc`: seria liczona wstecz, przerwa >1 dnia zeruje, dziś bez sesji
  nie zeruje wczorajszej serii; granice tygodni (poniedziałek).
- `pokrycie`: X z Y zgodne z liczebnościami.

## QA (procedura STAN-PROJEKTU §6)

Build ✓ → desktop (login Zosi, wejście z karty diagnozy, 4 sekcje zgodne ze
stanem, oba motywy) → mobile 390×844 (`scrollWidth === innerWidth`) →
przywrócenie stanu Zosi → LESSONS.md → aktualizacja STAN-PROJEKTU.md → commit
jawnymi ścieżkami.

## Poza zakresem (YAGNI)

Filtry zakresu dat, eksport wykresu, statystyki per pojedyncza lektura,
tooltipy na wykresie. Dane są — dodamy, gdy Zosia zgłosi potrzebę.
