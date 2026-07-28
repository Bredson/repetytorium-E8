# Stan projektu — Repetytorium ósmoklasisty (j. angielski)

> Plik przekazania między sesjami. Aktualizuj po każdej iteracji.
> Ostatnia aktualizacja: **2026-07-28, po sesji setup** (infrastruktura skila gotowa, brak uczniów i aplikacji).

---

## 1. Cel projektu

Webowe/interaktywne repetytorium dla ósmoklasistki (egzamin **maj 2027**, cel wysoki wynik) — j. angielski.
Osobny projekt obok `repetytorium - matematyka/` i `repetytorium - j_polski/`.
Docelowo połączone przez Hub (statyczna strona nawigacyjna) — po ukończeniu wszystkich przedmiotów.

## 2. Model projektu

**Inny niż matematyka i j. polski.** Projekt angielskiego NIE buduje jednej SPA React — skill generuje
**pliki HTML per uczeń** (`uczniowie/<imie>/materialy/`) z quizami, fiszkami i listeningiem (TTS Web Speech API).

Każdy uczeń ma własny katalog z:
- `profil.md` — dane ucznia, data egzaminu, wynik diagnozy, mocne/słabe strony
- `postepy.json` — maszynowy stan: działy, wyniki, daty sesji, słownictwo do powtórki
- `plan-nauki.md` — aktualny plan dostosowany do czasu i poziomu
- `materialy/` — wygenerowane pliki HTML (quizy, fiszki, listening, testy)

## 3. Stack i architektura

- **Materiały:** pliki HTML (vanilla JS + CSS) generowane w rozmowie przez skill
- **TTS:** Web Speech API (wbudowany w przeglądarkę) — dla zadań listening
- **Przechowywanie stanu:** pliki Markdown/JSON w `uczniowie/<imie>/` (lokalnie)
- **Skill:** `.opencode/skills/repetytorium-angielski/` — SKILL.md + 3 pliki reference
- **Git root:** `/Users/pibe/dev/Repetytorium-doc` — jawne ścieżki przy `git add`
- **Brak Vercel** — materiały HTML uruchamiane lokalnie (lub mogą być serwowane statycznie)

## 4. Co zostało zrobione

| Element | Status | Opis |
|---------|--------|------|
| Skill (SKILL.md) | ✅ | Pełny skill z flow onboardingu, sesji nauki, treningu sprawności |
| `reference/egzamin.md` | ✅ | Kompendium E8 — struktura arkusza, katalog środków językowych, kryteria oceniania, pułapki, dane CKE 2025 |
| `reference/metodyka.md` | ✅ | Metody nauczania, spaced repetition, planowanie wsteczne, adaptacja do ucznia |
| `reference/szablon-html.md` | ✅ | Specyfikacja materiałów HTML — quiz, fiszki, listening (TTS), test pisania |
| `zrodla/zrodla-linki.md` | ✅ | 31 linków źródłowych posegregowanych A/B/C (CKE, angielski, ogólne E8) |
| LESSONS.md | ✅ | 6 wpisów z 2026-07-20 (weryfikacja czasu egzaminu, zakres II.1, priorytety CKE) |
| Uczniowie | ❌ | Katalog `uczniowie/` pusty — nikt nie przeszedł onboardingu |
| Materiały HTML | ❌ | Brak — nie generowano żadnych materiałów |

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

1. **Onboarding pierwszego ucznia** — przeprowadzić przez flow A z SKILL.md: profil, test wstępny HTML, plan nauki
2. **Sprawdzić harmonogram CKE 2027** — po 20.08.2026, wpisać dokładną datę egzaminu do `egzamin.md`
3. **Opcjonalnie:** decyzja o architekturze — pozostać przy HTML per uczeń vs. migracja do SPA React (jak matematyka)

## 8. Jak zacząć nową sesję

1. Przeczytaj ten plik
2. Przeczytaj ostatni wpis w `LESSONS.md`
3. Sprawdź katalog `uczniowie/` — ustal o którego ucznia chodzi (lub: onboarding nowego)
4. Skill: `.opencode/skills/repetytorium-angielski/SKILL.md` — wczytaj na początku sesji
5. Dla nowego ucznia: flow A (onboarding) → test wstępny → profil → plan nauki
6. Dla istniejącego ucznia: wczytaj `profil.md` + `postepy.json`, policz dni do egzaminu, zaplanuj sesję
