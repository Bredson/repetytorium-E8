# Angielski it.2 — Słuchanie (TTS) (design)

> Data: 2026-08-07. Zatwierdzony w brainstormingu.
> Kontekst: it.1 ukończona (SPA, 3 działy tekstowe: funkcje, czytanie, srodki).
> Baza: `repetytorium - j_angielski/app/` (Vite+React 19, port 5175, bez KaTeX).

## Cel

Czwarty dział — **Słuchanie** (20–25% arkusza E8) — z odtwarzaczem TTS przez
Web Speech API, wg specyfikacji z `reference/szablon-html.md` skilla,
zaadoptowanej do Reacta.

## Decyzje (z pytań brainstormingu)

| Temat | Decyzja |
|-------|---------|
| Diagnoza | Słuchanie WCHODZI do diagnozy (8 pytań, po 2 z 4 działów) — player TTS w TestWstepny; brak realnych profili → zmiana bezpieczna |
| Specyfikacja TTS | Adopcja wprost z reference skilla (głosy, tempo, dialogi, transkrypcja, fallback) |
| Zakres | Tylko dział Słuchanie + komponent; Wypowiedź pisemna → it.3 |

## Nowy komponent: `src/ui/components/OdtwarzaczTTS.jsx`

Props: `nagranie` (string LUB tablica stringów — kwestie dialogu),
`pokazTranskrypcje` (boolean — czy przycisk transkrypcji jest odblokowany).

Zachowanie (wg reference/szablon-html.md):
1. **Player:** przycisk ▶ „Odtwórz nagranie" + licznik odtworzeń; po 2.
   odtworzeniu łagodne ostrzeżenie („Na egzaminie usłyszysz nagranie tylko
   2 razy") — bez blokowania (nauka > rygor)
2. **Głos:** `speechSynthesis.getVoices()` — preferencja `en-GB`, fallback
   `en-US`, fallback dowolny `en-*`; ładowanie asynchroniczne — obsłużyć
   `voiceschanged`, nie odtwarzać przed załadowaniem głosów
3. **Tempo:** domyślnie `rate: 0.95`; przełącznik „🐢 wolniej" → `0.8`
4. **Dialogi:** tablica kwestii → osobne `SpeechSynthesisUtterance` z krótką
   pauzą; jeśli ≥2 głosy EN — różne głosy dla naprzemiennych kwestii
5. **Transkrypcja:** przycisk „Pokaż transkrypcję" aktywny tylko gdy
   `pokazTranskrypcje === true` (po zatwierdzeniu odpowiedzi); po odkryciu
   zachęta „Posłuchaj jeszcze raz, czytając"
6. **Fallback:** `speechSynthesis` niedostępne / brak głosu EN → polski
   komunikat + transkrypcja widoczna od razu (zadanie robialne jako czytanie)
7. Sprzątanie: `speechSynthesis.cancel()` przy odmontowaniu komponentu

## Treść: `sluchanie.json` (moduł D, prefiksy `sl`/`slo`/`tw-sl`)

Schemat jak pozostałe działy (2 test_wstepny + 5 cwiczenia + 2 zadania_otwarte)
z nowym polem **`nagranie`** na pytaniu/zadaniu:

- `nagranie`: string (monolog/komunikat) lub tablica stringów (dialog)
- transkrypcja = tekst nagrania (jedno źródło prawdy)
- typy z arkusza: wybór wielokrotny po odsłuchu (zamknięte), uzupełnianie
  notatki po odsłuchu (otwarte, kroki z `akceptowane`)
- poziom A2, teksty krótkie (2–4 zdania / 4–6 kwestii dialogu), tematyka
  z 13 zakresów II.1

## Integracja (bez zmian w core!)

- `rejestr.js`: +`sluchanie` (4 działy) — plan, dashboard, powtórki podążają
  automatycznie
- `Dzial.jsx`, `TestWstepny.jsx`, `Powtorka.jsx`: render `OdtwarzaczTTS` gdy
  `pytanie.nagranie` (analogicznie do `pytanie.tekst`); w Dzial
  `pokazTranskrypcje = pokazFeedback` (po odpowiedzi), w TestWstepny
  `pokazTranskrypcje = false` (diagnoza — szybkie tempo, bez transkrypcji;
  fallback nadal pokazuje transkrypcję gdy brak TTS), w Powtorka po ocenie
- `ZadanieOtwarte.jsx`: player na górze gdy `zadanie.nagranie`;
  `pokazTranskrypcje = true` po ukończeniu wszystkich kroków (lub od razu
  po pierwszym kroku — decyzja implementacyjna: po ukończeniu)
- `Start.jsx`: `KOLORY_MODULOW` + kolor `D`

## QA — ograniczenie środowiska

Headless Chromium zwykle nie ma głosów EN. QA w Playwright weryfikuje:
1. **Tor fallbacku:** brak głosów → komunikat PL + transkrypcja widoczna
2. **Instrumentację:** podmiana `speechSynthesis.speak` przez
   `browser_evaluate` → licznik wywołań rośnie, utterance ma poprawny tekst
   i `lang`/`voice`
3. Pełny cykl działu Słuchanie (quiz + otwarte) na torze fallbacku

**Odsłuch dźwięku = ręczny krok użytkownika** przed uznaniem iteracji za
domkniętą (wpis w DoD).

## Definition of Done

1. `npm test` ✓ (core bez zmian — regresja) + `npm run build` ✓
2. QA desktop (Playwright): fallback + instrumentacja speak + pełny cykl
   działu Słuchanie + diagnoza 8 pytań na świeżym profilu; konsola 0 errors
3. QA mobile 390×844 (player klikalny, bez poziomego scrolla)
4. **Ręczny odsłuch użytkownika** (prawdziwy dźwięk, tempo, przełącznik wolniej)
5. STAN-PROJEKTU + LESSONS
6. Commity (jawne ścieżki)

## Poza zakresem

- Wypowiedź pisemna (it.3), egzamin próbny, statystyki, deploy, Hub
- Wymowa słówek w fiszkach (fiszek nie ma w apce)
- Nagrania audio (pliki) — tylko TTS
