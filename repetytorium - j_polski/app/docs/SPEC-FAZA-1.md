# SPEC — Faza 1 / iteracja 1: Plan nauki + pierwsza lektura

Data: 2026-07-20 · Bazuje na: `ARCHITEKTURA.md`, `../wklad-merytoryczny-plan-repetytorium.md` (sekcje 3-5)

## Cel iteracji
Uczeń po diagnozie dostaje **plan nauki** i może przejść **pierwszą pełną pętlę nauki**:
kompendium lektury → quiz → fiszki → powtórki wg spaced repetition (+1/+3/+7/+14).
Pierwsza lektura: **Dziady cz. II** (najmocniejszy typ na lekturę wiodącą 2027).

## User stories
1. **Plan:** Jako uczeń po diagnozie widzę plan nauki do egzaminu — kolejność modułów
   wynika z mojej diagnozy (braki → najpierw, +50% czasu), a lektury i wypracowania idą
   równolegle przez cały okres (zasada planu bazowego).
2. **Dashboard "co dziś":** Po zalogowaniu widzę 1-3 zadania na dziś (nie przytłaczamy):
   zaległe powtórki → bieżąca nauka. Każde zadanie ma szacowany czas.
3. **Kompendium:** Otwieram kompendium Dziadów cz. II — sekcje: mapa fabuły (chronologia),
   bohaterowie (cechy + sceny-dowody), problematyka i motywy, gatunek, "lektura
   w wypracowaniu". Czytam sekcjami, oznaczam sekcję jako przeczytaną.
4. **Quiz:** Po kompendium rozwiązuję quiz (10-12 pytań, w tym "uporządkuj kolejność"
   jako single/multi, pułapki kto-co-kiedy przeciw błędowi kardynalnemu). Feedback
   natychmiastowy po każdym pytaniu (inaczej niż w diagnozie!) + wyjaśnienie.
5. **Fiszki:** Po quizie system tworzy talię fiszek (bohater-scena-wartość, pojęcia).
   Sesja fiszek: pokaż przód → odsłoń tył → samoocena "umiem / jeszcze nie".
6. **Powtórki:** Fiszki i quiz wpadają do harmonogramu +1/+3/+7/+14 dni. Zaległe powtórki
   są pierwsze na dashboardzie. "Umiem" → następny interwał; "jeszcze nie" → reset do +1.

## Algorytm planu nauki (core/plan.js — czysta funkcja)
Wejście: `diagnoza.poziomPerModul`, `dataEgzaminu`, `dzis`.
1. Fazy kalendarzowe wg dokumentu bazowego (1: fundamenty+kanon VII-VIII, 2: rozbudowa,
   3: kanon IV-VI+syntezy, 4: tryb końcowy od −6 tyg. przed egzaminem).
2. Wagi czasu per moduł: braki ×1.5, częściowy ×1.0, solidny ×0.6 (szybka powtórka).
3. Stałe równoległe: lektury (A) i tworzenie wypowiedzi (F) w KAŻDYM tygodniu.
4. Wyjście: lista tygodni `{ nrTygodnia, od, do, faza, tematy: [{modul, temat, typ}] }`
   — deterministyczna (ten sam input → ten sam plan), zapisywana do `postepy.plan`.

## Spaced repetition (core/powtorki.js)
- Interwały: `[1, 3, 7, 14]` dni; po 14 → kolejne powtórki co 14 dni.
- Rekord powtórki: `{ id, typ: "fiszka"|"quiz", ref: "<idTalii/idQuizu>", nastepna: "ISO",
  interwal: 1, historia: [{data, ocena}] }` — zgodne z `postepy.powtorki` (ARCHITEKTURA.md).
- `coNaDzis(powtorki, dzis)` → zaległe + dzisiejsze, sort: najstarsze najpierw.
- `oznaczPowtorke(rekord, ocena, dzis)` → nowy rekord (immutable).

## Kontrakt treści — kompendium lektury (`content/polski/lektury/<slug>.json`)
```json
{
  "id": "dziady-2", "tytul": "Dziady cz. II", "autor": "Adam Mickiewicz",
  "gatunek": { "nazwa": "dramat romantyczny", "cechy": ["..."] },
  "sekcje": [ { "id": "fabula", "tytul": "Mapa fabuły", "tresc": "markdown-lite", "punkty": ["..."] } ],
  "bohaterowie": [ { "imie": "Guślarz", "kim": "...", "cechy": ["..."], "scenyDowody": ["..."] } ],
  "motywy": [ { "motyw": "wina i kara", "przyklad": "...", "wWypracowaniu": "do tezy o ..." } ],
  "quiz": [ /* pytania wg kontraktu z ARCHITEKTURA.md, id: dz2-q-01... */ ],
  "fiszki": [ { "id": "dz2-f-01", "przod": "...", "tyl": "...", "kategoria": "bohater|pojecie|cytat|wartosc" } ]
}
```
Wymogi merytoryczne: 10-12 pytań quizu (poziomy 1-3, wyjaśnienia obowiązkowe),
14-18 fiszek, zero treści wykreślonych reformą, sceny-dowody konkretne (anty-błąd kardynalny).

## Rozszerzenie schematu postępów (wersjaSchematu: 2 + migracja z 1)
```json
{
  "plan": { "wygenerowano": "ISO", "tygodnie": [ ... ] },
  "lektury": { "dziady-2": { "sekcjePrzeczytane": ["fabula"], "quiz": {"wynikPkt": 0, "maksPkt": 0, "data": "ISO"} } },
  "powtorki": [ /* jak wyżej */ ]
}
```
Migracja: `wersjaSchematu 1 → 2` dodaje puste `plan: null`, `lektury: {}` (w core, przy odczycie).

## Zasady UX (obowiązują z Fazy 0 + nowe)
- Dashboard: maks 3 pozycje "na dziś"; zaległe powtórki oznaczone łagodnie ("czeka na Ciebie"),
  nie alarmowo. Pasek postępu tygodnia.
- Quiz nauki: feedback natychmiast (zielony/bursztyn + wyjaśnienie), przycisk "Dalej" po feedbacku.
- Fiszki: duża karta, tap = odwrócenie; samoocena dwoma przyciskami; licznik "zostało X".
- Kompendium: sekcje zwijane, checkbox "przeczytane", czas czytania przy sekcji.
- Bez czerwieni; celebracja po ukończeniu quizu/talii; growth mindset w komunikatach.

## Definition of Done
1. Po diagnozie na Starcie pojawia się plan + dashboard "co dziś" (zamiast placeholdera "Co dalej?").
2. Pełna pętla: kompendium → quiz (feedback natychmiastowy) → fiszki → wpisy w `powtorki`.
3. Następnego dnia (symulacja datą) dashboard pokazuje powtórkę +1; oceny przesuwają interwały.
4. Migracja schematu 1→2 nie psuje istniejących profili z diagnozą.
5. QA w przeglądarce: przepływ, trwałość, mobile 375px, konsola czysta; punktacja quizu zweryfikowana.
6. Warstwy: plan/powtórki w `core/` bez importów React; treść w `content/` (czysty JSON).

## Poza zakresem iteracji 1
Kolejne lektury, moduł B (język), trener wypracowań, symulator arkusza, kamienie milowe,
edycja planu przez ucznia.
