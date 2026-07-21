# SPEC — Faza 1 / iteracja 2: Ćwiczenia modułowe (C) + krótka forma pisemna (F)

Data: 2026-07-20 · Bazuje na: `SPEC-FAZA-1.md`, `../wklad-merytoryczny-plan-repetytorium.md`

## Cel iteracji
Zadania tygodnia planu przestają być placeholderami "(wkrótce)": uczeń może zrobić
**ćwiczenia z ortografii i interpunkcji** (moduł C — tydzień 1 planu Zosi) oraz
**krótką formę pisemną** (moduł F, co tydzień). Ten sam mechanizm posłuży później
modułom B/D/E — iteracja dostarcza silnik + pierwszą treść.

## User stories
1. **Ćwiczenia:** Klikam zadanie modułowe na dashboardzie → teoria w pigułce (sekcje
   zwijane jak w kompendium) → quiz z natychmiastowym feedbackiem → wynik wpada do
   powtórek (+1/+3/+7/+14). Zrobione ćwiczenie znika z "na dziś".
2. **Pisanie:** Klikam zadanie F → widzę polecenie + plan formy (z czego składa się
   zaproszenie) → piszę tekst (licznik wyrazów) → porównuję ze wzorcem → samoocena
   checklistą kryteriów → punkty i ciepłe podsumowanie. Zrobione znika z "na dziś".
3. **Rozszerzalność:** Dodanie treści dla B/D/E = nowy JSON + wpis w rejestrze treści
   (zero zmian w core/ui).

## Kontrakt treści — ćwiczenia (`content/polski/cwiczenia/<slug>.json`)
```json
{
  "id": "ortografia-1", "modul": "C",
  "tytul": "Ortografia i interpunkcja — pewniaki egzaminacyjne",
  "teoria": [ { "id": "rz-z", "tytul": "...", "tresc": "...", "punkty": ["..."], "czasMin": 3 } ],
  "quiz": [ /* pytania wg kontraktu ARCHITEKTURA.md, id: c1-q-01..., wyjaśnienia obowiązkowe */ ]
}
```
Wymogi: 4-6 sekcji teorii, 10-12 pytań (poziomy 1-3), tylko zakres po reformie 2024.

## Kontrakt treści — pisanie (`content/polski/pisanie/<slug>.json`)
```json
{
  "id": "zaproszenie-1", "modul": "F", "forma": "zaproszenie",
  "tytul": "Zaproszenie — krótka forma użytkowa",
  "planFormy": ["kto zaprasza", "kogo", "na co", "kiedy", "gdzie", "zachęta"],
  "zadanie": { "id": "f1-open-01", "modul": "F", "typ": "open-short",
    "tresc": "...", "wzorzec": "...", "kryteriaSamooceny": ["..."], "punkty": 3 }
}
```
`zadanie` zgodne z kontraktem diagnozy → ocena przez `ocenSamoocene` (bez zmian w core).

## Rejestr treści (`content/polski/rejestr.js`)
Jedyne miejsce wiedzy "co jest dostępne": `LEKTURY`, `CWICZENIA` (mapa modul→[slug]),
`PISANIE`, `material(ref)` (lookup dla powtórek). UI/App importują tylko rejestr.

## Zmiany w core
- `profil.js`: `wersjaSchematu: 3` — migracja 2→3 dodaje `cwiczenia: {}`, `pisanie: {}`.
- `plan.js` / `zadaniaNaDzis(powtorki, tydzien, stan, dostepne)`: przyjmuje mapę
  dostępności treści (buduje ją UI z rejestru — core nie importuje contentu).
  Zadanie bez treści → `wkrotce: true`; zadanie zrobione → pomijane.
  `stan` = `{ lektury, cwiczenia, pisanie }` z postępów.

## Postępy (schemat 3)
```json
{
  "cwiczenia": { "ortografia-1": { "quiz": { "data", "wynikPkt", "maksPkt", "procent" } } },
  "pisanie":   { "zaproszenie-1": { "data", "pkt", "maks", "kryteria": [true, ...] } }
}
```
Powtórka po ćwiczeniu: `{"id": "ortografia-1:quiz", "typ": "quiz", "ref": "ortografia-1"}`.
Pisanie bez powtórek (kolejne formy = kolejne treści tygodniowe).

## UX
- Ćwiczenia: identyczny rytm jak lektura (sekcje → quiz → celebracja) — spójność uczy nawyku.
- Pisanie: jedno zadanie na ekranie; wzorzec pokazywany DOPIERO po napisaniu własnego
  tekstu (min. 20 wyrazów, łagodna walidacja); samoocena bez czerwieni; growth mindset.
- Dashboard: bez zmian wizualnych — zadania po prostu stają się klikalne.

## Definition of Done
1. Zadanie C z dashboardu prowadzi przez teorię → quiz → powtórka `ortografia-1:quiz` w postępach.
2. Zadanie F prowadzi przez polecenie → tekst → wzorzec + samoocena → zapis w `postepy.pisanie`.
3. Zrobione zadania znikają z "na dziś"; powtórka quizu C działa w cyklu interwałów.
4. Migracja 2→3 nie psuje profilu Zosi (plan i powtórki zostają).
5. QA w przeglądarce: przepływ, trwałość po reloadzie, mobile 375px (emulacja), konsola czysta.
6. Bank pytań C zwalidowany skryptem asercji (klucz, poziomy, rozkład poprawnych).

## Poza zakresem
Treści B/D/E, ocena tekstu ucznia przez AI, dłuższe formy (rozprawka), edycja planu.
