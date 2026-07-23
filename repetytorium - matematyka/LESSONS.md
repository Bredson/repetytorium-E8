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
