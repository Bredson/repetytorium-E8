# SPEC — Faza 0: Diagnoza (test wstępny + profil)

## Cel
Uczeń zakłada profil, rozwiązuje test diagnostyczny (15-20 pytań, ~20 min) i dostaje
czytelny wynik per moduł A-F, zapisany trwale w profilu. Wynik kalibruje przyszły plan nauki.

## User stories
1. **Onboarding:** Jako uczeń tworzę profil (imię, PIN 4-cyfrowy, data egzaminu domyślnie 2027-05, opcja "mam dysleksję") i widzę ekran powitalny bez przytłoczenia.
2. **Wybór profilu:** Jako jeden z 2-5 uczniów na wspólnym komputerze wybieram swój profil i wpisuję PIN.
3. **Test wstępny:** Rozwiązuję pytania JEDNO NA EKRAN (pasek postępu "pytanie X/18"), mogę wrócić do poprzednich; na końcu pytanie otwarte (krótka forma) z samooceną wg wzorca.
4. **Wynik:** Widzę wynik ogólny + wykres per moduł (braki/częściowy/solidny) + 2-3 zdania ciepłego podsumowania (growth mindset: chwalimy wysiłek, błędy = informacja) + "co dalej".
5. **Trwałość:** Po zamknięciu przeglądarki wynik jest w profilu; mogę wyeksportować postępy do pliku JSON i zaimportować na innym urządzeniu.

## Zasady metodyczne (z skilla — NIEnegocjowalne)
- Maks. 20 pytań / ~20 minut; poziom łatwe → trudne (start od sukcesu).
- Każde pytanie MA wyjaśnienie "dlaczego" — pokazywane w podsumowaniu wyników (nie w trakcie — to diagnoza).
- Zero czerwonych "ŹLE!" — neutralno-ciepła informacja zwrotna.
- Pasek postępu zawsze widoczny; po teście wyraźne domknięcie ("masz za sobą pierwszy krok").
- Tryb dysleksji: czytelniejszy font/odstępy (flaga w profilu, stylowanie od Fazy 0).

## Zakres pytań (przekrój, mapowanie do modułów)
- A lektury: 4-5 pyt. (kanon VII-VIII: Dziady II, Balladyna, Zemsta, Kamienie na szaniec, Mały Książę / Opowieść wigilijna)
- B nauka o języku: 3-4 pyt. (części mowy/zdania, zdanie złożone, frazeologia)
- C ortografia/interpunkcja: 2-3 pyt. (przecinki w złożonych, "nie" z częściami mowy, tytuły)
- D kształcenie literackie: 3 pyt. (środki stylistyczne + FUNKCJA, narrator vs podmiot liryczny, gatunek)
- E czytanie ze zrozumieniem: 2-3 pyt. do krótkiego tekstu nieliterackiego (teza, fakt vs opinia)
- F tworzenie wypowiedzi: 1 pyt. zamknięte (kryteria/forma) + 1 otwarte krótkie (samoocena wg wzorca)

## Progi kalibracji per moduł
- `braki` < 50% · `czesciowy` 50-79% · `solidny` ≥ 80%

## Poza zakresem Fazy 0
Plan nauki, moduły nauki, spaced repetition, dashboard historii — Faza 1.

## Definition of Done
- [ ] Pełny przepływ: nowy profil → test → wynik → restart przeglądarki → wynik nadal widoczny.
- [ ] Wynik per moduł zgodny z kluczem (weryfikacja merytoryczna kluczy odpowiedzi).
- [ ] Eksport/import JSON działa.
- [ ] Brak błędów w konsoli; działa na mobile (min. 375px).
- [ ] Weryfikacja w przeglądarce przed oddaniem (zasada skilla nr 6).
