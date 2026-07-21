# Specyfikacja interaktywnych materiałów HTML

## Zasady ogólne

- **Jeden plik = jeden samodzielny HTML** (inline CSS + JS, zero zależności zewnętrznych,
  działa offline po otwarciu w przeglądarce).
- Język: polski. Typografia czytelna dla nastolatka (min. 16px, dużo światła).
- Responsywny (uczeń może korzystać z telefonu).
- Nazewnictwo plików: `uczniowie/<imie>/materialy/<typ>-<temat>.html`,
  np. `quiz-srodki-stylistyczne.html`, `lektura-balladyna.html`, `test-wstepny.html`.
- Po wygenerowaniu ZAWSZE zweryfikuj: poprawność merytoryczną odpowiedzi, działanie
  JS (np. otwierając w przeglądarce lub sprawdzając logikę), polskie znaki (UTF-8).

## Wygląd (spójny dla wszystkich materiałów)

- Jasny, przyjazny motyw: tło `#f8f9fb`, karty białe z cieniem, akcent `#4f6df5`,
  poprawna odpowiedź `#2dc653`, błędna `#e63b46`, wyróżnienia `#f7c548`.
- Nagłówek z: tytułem materiału, imieniem ucznia, licznikiem dni do egzaminu.
- Pasek postępu materiału (ile pytań/sekcji ukończono).
- Duże, klikalne przyciski odpowiedzi (min. 44px wysokości).

## Wymagane mechaniki interaktywne

1. **Quiz:** natychmiastowy feedback po każdej odpowiedzi — kolor + WYJAŚNIENIE
   dlaczego (elaboracja). Brak możliwości zmiany po zatwierdzeniu.
2. **Wynik końcowy:** procent + rozbicie na tematy + komunikat motywacyjny zależny
   od wyniku (nigdy zawstydzający; przy niskim wyniku: co konkretnie powtórzyć).
3. **Blok "Do przepisania do postępów":** na końcu każdego testu/quizu wyświetl
   podsumowanie wyniku w formacie do przekazania agentowi, np.
   `WYNIK: test-wstepny | 14/20 | słabe: frazeologizmy, zdania złożone`.
   Dodaj przycisk "Kopiuj wynik" (clipboard API). To jest kanał zwrotny do aktualizacji
   `postepy.json` — poinstruuj ucznia, żeby wkleił wynik w rozmowie.
4. **Fiszki:** odwracane kartą (klik), przyciski "Umiem / Jeszcze nie", licznik talii.
5. **Dopasowanki / prawda-fałsz / luki:** wg potrzeb działu; zawsze z feedbackiem.
6. **Tryb końcowy (symulacje):** widoczny timer, układ zadań jak w arkuszu CKE,
   punktacja jak na egzaminie.

## Struktura materiału działowego (nauka)

1. **Teoria w pigułce** — max 1-2 ekrany, prosty język, przykłady, wizualizacja
   (tabela/schemat).
2. **Przykłady przepracowane** — pokaz rozwiązania z komentarzem.
3. **Ćwiczenia interaktywne** — od łatwych do trudnych (min. 8-12 zadań).
4. **Wplecione powtórki** — 2-3 pytania z wcześniejszych działów (oznaczone
   "Powtórka!").
5. **Mini-test** — 5-8 zadań w formacie egzaminacyjnym + blok wyniku.

## Struktura streszczenia lektury (kompendium egzaminacyjne)

1. Metryczka: autor, gatunek, epoka/kontekst, czas i miejsce akcji.
2. Streszczenie fabuły (zwięzłe, chronologiczne; przy dramacie — akt po akcie).
3. Bohaterowie: tabela/mapa relacji, cechy + przykłady zachowań z tekstu.
4. Problematyka i motywy — każdy motyw z dopiskiem "jak użyć w wypracowaniu".
5. Kluczowe cytaty z kontekstem (kto, kiedy, dlaczego ważne).
6. Sekcja "Pułapki egzaminacyjne" dla tej lektury.
7. Quiz sprawdzający (10-15 pytań) + blok wyniku.

## Formaty stanu ucznia

`postepy.json` (utrzymuj dokładnie tę strukturę):

```json
{
  "uczen": "imie",
  "dataEgzaminu": "RRRR-MM-DD",
  "testWstepny": { "data": "RRRR-MM-DD", "wynik": "14/20", "slabeStrony": ["..."] },
  "dzialy": {
    "nazwa-dzialu": {
      "status": "nierozpoczety | w-trakcie | opanowany",
      "poziom": "braki | czesciowy | solidny",
      "wyniki": [{ "data": "RRRR-MM-DD", "material": "plik.html", "wynik": "8/10" }],
      "powtorkaDnia": "RRRR-MM-DD"
    }
  },
  "lektury": { "tytul": { "status": "...", "wynikQuizu": "..." } },
  "historiaSesji": [{ "data": "RRRR-MM-DD", "zakres": "...", "notatki": "..." }]
}
```

`profil.md` — czytelny dla człowieka: dane ucznia, data egzaminu, wynik diagnozy,
mocne/słabe strony, preferencje nauki, aktualny pasek postępu (np. `█████░░░░░ 50%`),
ostatnia sesja i następny krok.
