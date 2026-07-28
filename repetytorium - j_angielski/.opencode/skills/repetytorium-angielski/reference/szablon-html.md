# Specyfikacja interaktywnych materiałów HTML

## Zasady ogólne

- **Jeden plik = jeden samodzielny HTML** (inline CSS + JS, zero zależności zewnętrznych,
  działa offline po otwarciu w przeglądarce; jedyny "zewnętrzny" mechanizm to wbudowana
  w przeglądarkę synteza mowy — patrz sekcja TTS).
- Język: instrukcje i wyjaśnienia po polsku, treść zadań po angielsku (jak w arkuszu E8).
  Typografia czytelna dla nastolatka (min. 16px, dużo światła).
- Responsywny (uczeń może korzystać z telefonu).
- Nazewnictwo plików: `uczniowie/<imie>/materialy/<typ>-<temat>.html`,
  np. `quiz-past-simple.html`, `listening-travel.html`, `fiszki-food.html`,
  `pisanie-email.html`, `test-wstepny.html`.
- Po wygenerowaniu ZAWSZE zweryfikuj: poprawność językową (naturalna angielszczyzna,
  poziom A2/A2+), poprawność odpowiedzi w quizach, działanie JS i TTS, polskie znaki (UTF-8).

## Wygląd (spójny dla wszystkich materiałów)

- Jasny, przyjazny motyw: tło `#f8f9fb`, karty białe z cieniem, akcent `#4f6df5`,
  poprawna odpowiedź `#2dc653`, błędna `#e63b46`, wyróżnienia `#f7c548`.
- Nagłówek z: tytułem materiału, imieniem ucznia, licznikiem dni do egzaminu.
- Pasek postępu materiału (ile pytań/sekcji ukończono).
- Duże, klikalne przyciski odpowiedzi (min. 44px wysokości).

## Rozumienie ze słuchu — TTS (Web Speech API)

Część słuchana korzysta z wbudowanej syntezy mowy przeglądarki (`speechSynthesis`).

Wymagania implementacyjne:
1. **Odtwarzacz zadania:** przycisk ▶ "Odtwórz nagranie" + licznik odtworzeń.
   Jak na egzaminie: sugeruj maks. 2 odtworzenia (po 2. przycisk pokazuje łagodne
   ostrzeżenie, ale nie blokuj — nauka > rygor).
2. **Głos:** wybieraj głos angielski przez `speechSynthesis.getVoices()` —
   preferencja: `en-GB`, fallback `en-US`, fallback dowolny `en-*`. Ładowanie głosów
   jest asynchroniczne — obsłuż `voiceschanged` i nie odtwarzaj przed załadowaniem.
3. **Tempo:** domyślnie `rate: 0.95`; przełącznik "🐢 wolniej" (`0.8`) dla uczniów
   z poziomem "braki". W trybie końcowym tylko tempo normalne.
4. **Dialogi:** rozdzielaj kwestie rozmówców osobnymi wywołaniami `SpeechSynthesisUtterance`
   z krótką pauzą; jeśli dostępne ≥2 głosy angielskie, przydziel różne głosy rozmówcom.
5. **Transkrypcja:** ukryta podczas rozwiązywania; przycisk "Pokaż transkrypcję" odblokowuje
   się dopiero PO zatwierdzeniu odpowiedzi. Po odkryciu: zachęta "posłuchaj jeszcze raz,
   czytając" (trening dekodowania).
6. **Fallback:** jeśli `speechSynthesis` niedostępne / brak głosu EN — pokaż komunikat
   po polsku i automatycznie udostępnij transkrypcję, żeby zadanie dało się zrobić
   jako czytanie.
7. **Wymowa słówek w fiszkach:** ikona 🔊 przy każdym angielskim haśle (pojedynczy utterance).

## Wymagane mechaniki interaktywne

1. **Quiz:** natychmiastowy feedback po każdej odpowiedzi — kolor + WYJAŚNIENIE po polsku
   dlaczego (elaboracja; przy gramatyce: reguła + kontrast z polskim). Brak możliwości
   zmiany po zatwierdzeniu.
2. **Zadania otwarte (wpisywanie):** pole tekstowe + sprawdzanie odpowiedzi tolerujące
   wielkość liter i nadmiarowe spacje, ale NIE błędy pisowni (pisownia liczy się na
   egzaminie). Akceptuj listę poprawnych wariantów (np. "don't" i "do not").
   Przy błędzie pokaż poprawny zapis i wyjaśnienie.
3. **Wynik końcowy:** procent + rozbicie na sprawności/tematy + komunikat motywacyjny
   zależny od wyniku (nigdy zawstydzający; przy niskim wyniku: co konkretnie powtórzyć).
4. **Blok "Do przepisania do postępów":** na końcu każdego testu/quizu wyświetl
   podsumowanie wyniku w formacie do przekazania agentowi, np.
   `WYNIK: test-wstepny | 14/20 | słabe: Present Perfect, listening-dobieranie`.
   Dodaj przycisk "Kopiuj wynik" (clipboard API). To jest kanał zwrotny do aktualizacji
   `postepy.json` — poinstruuj ucznia, żeby wkleił wynik w rozmowie.
5. **Fiszki:** odwracane kartą (klik), przyciski "Umiem / Jeszcze nie", licznik talii,
   ikona 🔊 (TTS wymowy). Awers: słowo EN + kolokacja; rewers: znaczenie PL + zdanie
   przykładowe. Opcja odwrócenia kierunku (PL→EN = trudniejszy, produkcyjny).
6. **Dopasowanki / P-F / luki / kolejność:** wg potrzeb działu; zawsze z feedbackiem.
7. **Trener pisania:** polecenie jak w arkuszu (forma + 3 kropki), licznik słów na żywo
   (podświetlenie: <50 czerwone, 50-120 zielone, >120 żółte), rozwijany bank zwrotów,
   checklista samooceny (3 podpunkty rozwinięte? łączniki? czasy? pisownia?).
   Praca ucznia trafia do agenta (wklejona w rozmowie) do oceny wg kryteriów CKE.
8. **Tryb końcowy (symulacje):** widoczny timer (110 min lub proporcjonalnie dla części),
   układ i typy zadań jak w arkuszu CKE, punktacja jak na egzaminie, sekcja słuchana
   z TTS na początku.

## Struktura materiału działowego (nauka)

1. **Teoria w pigułce** — max 1-2 ekrany, reguła prostym językiem po polsku, angielskie
   przykłady, wizualizacja (oś czasu dla czasów, tabela kontrastowa).
2. **Przykłady przepracowane** — pokaz rozwiązania z komentarzem (przy pisaniu: wzorcowy
   e-mail z adnotacjami "za co punkty").
3. **Ćwiczenia interaktywne** — od rozpoznawania do produkcji, od łatwych do trudnych
   (min. 8-12 zadań, w tym min. 2-3 otwarte z wpisywaniem).
4. **Wplecione powtórki** — 2-3 pytania z wcześniejszych działów + porcja słownictwa
   do powtórki (oznaczone "Powtórka!").
5. **Mini-test** — 5-8 zadań w formacie egzaminacyjnym + blok wyniku.

## Struktura materiału listening

1. Strategia w pigułce (po polsku: co robić przed/w trakcie/po nagraniu).
2. Rozgrzewka słownictwa z nagrania (4-6 kluczowych słów z TTS).
3. Zadania w formatach egzaminacyjnych (dobieranie, wybór, uzupełnianie notatki) —
   każde z własnym odtwarzaczem TTS.
4. Transkrypcje odkrywane po odpowiedzi + ponowne odsłuchanie z tekstem.
5. Mini-test + blok wyniku.

## Formaty stanu ucznia

`postepy.json` (utrzymuj dokładnie tę strukturę):

```json
{
  "uczen": "imie",
  "dataEgzaminu": "RRRR-MM-DD",
  "testWstepny": { "data": "RRRR-MM-DD", "wynik": "14/20", "slabeStrony": ["..."] },
  "sprawnosci": {
    "sluchanie": "braki | czesciowy | solidny",
    "czytanie": "...",
    "srodkiJezykowe": "...",
    "funkcjeJezykowe": "...",
    "pisanie": "..."
  },
  "dzialy": {
    "nazwa-dzialu": {
      "status": "nierozpoczety | w-trakcie | opanowany",
      "poziom": "braki | czesciowy | solidny",
      "wyniki": [{ "data": "RRRR-MM-DD", "material": "plik.html", "wynik": "8/10" }],
      "powtorkaDnia": "RRRR-MM-DD"
    }
  },
  "slownictwo": {
    "opanowane": 120,
    "doPowtorki": [{ "temat": "travel", "powtorkaDnia": "RRRR-MM-DD" }]
  },
  "pisanie": [{ "data": "RRRR-MM-DD", "forma": "e-mail", "ocena": "7/10", "uwagi": "..." }],
  "historiaSesji": [{ "data": "RRRR-MM-DD", "zakres": "...", "notatki": "..." }]
}
```

`profil.md` — czytelny dla człowieka: dane ucznia, data egzaminu, wynik diagnozy,
mocne/słabe strony per sprawność, kontakt z angielskim poza szkołą i zainteresowania
(do personalizacji zadań), preferencje nauki, aktualny pasek postępu
(np. `█████░░░░░ 50%`), ostatnia sesja i następny krok.
