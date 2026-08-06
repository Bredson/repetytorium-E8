# Stan projektu — Repetytorium ósmoklasisty (j. angielski)

> Plik przekazania między sesjami. Aktualizuj po każdej iteracji.
> Ostatnia aktualizacja: **2026-08-06, po sesji it.1 (SPA React — scaffold + 3 działy tekstowe; decyzja architektoniczna z §7.3 rozstrzygnięta)**.

---

## 1. Cel projektu

Webowe/interaktywne repetytorium dla ósmoklasistki (egzamin **maj 2027**, cel wysoki wynik) — j. angielski.
Osobny projekt obok `repetytorium - matematyka/` i `repetytorium - j_polski/`.
Docelowo połączone przez Hub (statyczna strona nawigacyjna) — po ukończeniu wszystkich przedmiotów.

## 2. Model projektu

**SPA React — jak matematyka.** Decyzja architektoniczna rozważana wcześniej jako opcja w §7.3
(„migracja do SPA React vs. pozostanie przy HTML per uczeń") została **rozstrzygnięta w sesji it.1**
na rzecz SPA. Aplikacja to jedna aplikacja React wzorowana wprost na `repetytorium - matematyka/app/`
(ta sama architektura warstw, ten sam wzorzec ekranów, logiki i przechowywania stanu).

**Model skillowy „HTML per uczeń" NIE jest realizowany.** Wcześniejsza koncepcja generowania
plików HTML w `uczniowie/<imie>/materialy/` (quizy, fiszki, listening) została zarzucona.
Skill (`.opencode/skills/repetytorium-angielski/`) oraz katalog `reference/` **pozostają** —
nie jako generator materiałów, lecz jako **źródło treści i metodyki** (kompendium egzaminu E8,
katalog środków językowych, kryteria oceniania, priorytety CKE, metody nauczania), z którego
korzysta się przy tworzeniu contentu JSON dla aplikacji.

Każdy uczeń ma profil w aplikacji (imię, PIN, data egzaminu) — stan trzymany w `localStorage`,
analogicznie do matematyki i polskiego. Katalog `uczniowie/` z poprzedniej koncepcji jest nieużywany.

## 3. Stack i architektura

- **Vite + React 19 SPA**, **bez TypeScript**, bez routera (przełączanie ekranów przez stan w `App.jsx`)
- **Bez KaTeX** — angielski nie wymaga renderowania wzorów matematycznych
- Warstwy: `content/` (JSON) → `core/` (czysta logika, zero DOM) → `storage/` → `ui/`
- Treść w **JSON** w `src/content/angielski/dzialy/`, spinana przez rejestr działów
- **Przechowywanie stanu:** `localStorage` przez adapter w `src/storage/`;
  klucz `rep:postepy:{uuid}:angielski` (odizolowany od matematyki i polskiego)
- **Dev server:** `cd "repetytorium - j_angielski/app" && npm run dev` → `localhost:5175`
- **Deploy Vercel — przyszła iteracja** (brak na razie; wzorem matematyki: auto-deploy z `main`
  po ustabilizowaniu zakresu materiału)
- Lokalizacja appki: `repetytorium - j_angielski/app/` w repo `Repetytorium-doc`
- **Git root:** `/Users/pibe/dev/Repetytorium-doc` — jawne ścieżki przy `git add`
- **Skill i reference:** `.opencode/skills/repetytorium-angielski/` — źródło treści/metodyki,
  nie generator materiałów (patrz sekcja 2)

## 4. Co zostało zrobione

| Element | Status | Opis |
|---------|--------|------|
| Skill (SKILL.md) | ✅ | Pełny skill z flow onboardingu, sesji nauki, treningu sprawności — jako źródło metodyki |
| `reference/egzamin.md` | ✅ | Kompendium E8 — struktura arkusza, katalog środków językowych, kryteria oceniania, pułapki, dane CKE 2025 |
| `reference/metodyka.md` | ✅ | Metody nauczania, spaced repetition, planowanie wsteczne, adaptacja do ucznia |
| `reference/szablon-html.md` | ✅ | Specyfikacja historyczna (model HTML-per-uczeń, niezrealizowany) — zachowana jako materiał źródłowy |
| `zrodla/zrodla-linki.md` | ✅ | 31 linków źródłowych posegregowanych A/B/C (CKE, angielski, ogólne E8) |
| LESSONS.md | ✅ | Wpisy z 2026-07-20 (weryfikacja czasu egzaminu, zakres II.1, priorytety CKE) + it.1 (SPA scaffold) |
| **It.1 — scaffold SPA + 3 działy tekstowe** | ✅ | Vite+React scaffold, `core/` (profil/quiz/plan/powtórki z `sprawdzKrok` i `akceptowane`), 3 działy JSON (funkcje/czytanie/środki, każdy: 2 diagnoza + 5 zamkniętych + 2 otwarte), diagnoza, dashboard, pełny cykl nauki (dział → zadanie otwarte → powtórka); build ✓, testy ✓, QA desktop+mobile ✓ |
| Uczniowie (katalog HTML) | — | Model zmieniony na profile w aplikacji (localStorage); katalog `uczniowie/` z poprzedniej koncepcji nieużywany |

## 5. Kluczowe fakty merytoryczne (z egzamin.md)

- **Egzamin:** 3. dzień sesji (2026: 13 maja); dla 2027 — sprawdzić harmonogram CKE po 20.08.2026
- **Czas:** 110 min (dostosowania: 145 min); starsze źródła podają 90 min — NIEAKTUALNE
- **Punktacja:** maks. 55 pkt; wypowiedź pisemna = 10 pkt; próg zdawalności brak
- **Poziom:** A2 (A2+ rozumienie); podstawa wariant II.1 (uszczuplona od 2025)
- **Usunięte z zakresu:** mowa zależna, pytania pośrednie, strona bierna w Present Perfect, dział "życie społeczne"
- **Priorytety treningowe CKE 2025:** Past Simple (26% poprawnych!), zwroty grzecznościowe, word spotting, zadania otwarte

## 6. Procedury i pułapki (z LESSONS.md)

- **Czas egzaminu:** 110 min (nie 90 min — starsze opracowania błędne); weryfikować z CKE dla bieżącej sesji
- **Zakres II.1:** nie generować materiałów z usuniętych treści (mowa zależna, pytania pośrednie, Present Perfect bierna)
- **Suma 55 pkt:** nie pochodzi z informatora — potwierdzona z realnych arkuszy; trzymać się arkuszy CKE
- **Subagenty:** raport researchowy musi być w OSTATNIEJ wiadomości subagenta
- **Git:** jawne ścieżki przy `git add` (repo ma kilka niepowiązanych projektów)

## 7. Kolejne kroki (priorytety)

1. **It.2 — Słuchanie.** Dział „Słuchanie" z TTS Web Speech API (wbudowany w przeglądarkę, bez
   dodatkowych zależności) — analogicznie do pozostałych działów (JSON + core + UI), z odtwarzaniem
   tekstu na mowę i pytaniami zamkniętymi/otwartymi.
2. **It.3 — Wypowiedź pisemna.** Tryb prowadzony (struktura wypowiedzi, podpowiedzi punktowe) +
   samoocena wg kryteriów oceniania CKE (treść, spójność i logika, zakres i poprawność językowa).
3. **Kolejne iteracje:** egzamin próbny (symulacja pełnego arkusza + zegar), statystyki (postęp
   per dział, aktywność, pokrycie — wzorem matematyki), deploy na Vercel, docelowo Hub łączący
   wszystkie przedmioty.
4. **Sprawdzić harmonogram CKE 2027** — po 20.08.2026, wpisać dokładną datę egzaminu do
   `reference/egzamin.md` i do domyślnej daty egzaminu w profilu aplikacji.

## 8. Jak zacząć nową sesję

1. Przeczytaj ten plik (STAN-PROJEKTU.md)
2. Przeczytaj ostatni wpis w `LESSONS.md`
3. Uruchom dev server: `cd "repetytorium - j_angielski/app" && npm run dev` → `localhost:5175`
4. Sprawdź `git log` dla katalogu `repetytorium - j_angielski/`, aby ustalić, na czym skończyła
   się poprzednia iteracja
5. Skill: `.opencode/skills/repetytorium-angielski/SKILL.md` + `reference/` — wczytaj jako
   źródło treści i metodyki przy tworzeniu nowego materiału (contentu JSON), nie jako generator plików HTML
6. Kolejna iteracja: patrz sekcja 7 (priorytety) — domyślnie it.2 (Słuchanie), jeśli nie wskazano inaczej
