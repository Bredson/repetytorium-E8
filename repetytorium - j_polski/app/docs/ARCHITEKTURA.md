# Architektura — Repetytorium Ósmoklasisty

## Cel produktu
Aplikacja webowa wspierająca uczniów klasy 8 w przygotowaniu do egzaminu ósmoklasisty 2027
(cel: 95-100%). Start: język polski. Docelowo: + matematyka, + angielski.

## Decyzje architektoniczne (ADR)

### ADR-1: React SPA (Vite) + adapter storage
- **Teraz:** localStorage (profile lokalne z PIN, eksport/import JSON).
- **Później:** Supabase (auth + Postgres) przez podmianę adaptera — bez przepisywania UI/logiki.
- Build = statyczne pliki (GitHub Pages / lokalnie).

### ADR-2: Trzy warstwy o rozdzielonych odpowiedzialnościach
```
src/content/   TREŚĆ    — banki pytań, kompendia (czysty JSON; przenośne w 100%)
src/core/      LOGIKA   — silnik quizu, punktacja, spaced repetition, model profilu
                          (czyste moduły JS, zero DOM, zero React — testowalne unit)
src/storage/   ZAPIS    — interfejs StorageAdapter + implementacja localStorage
src/ui/        WIDOK    — komponenty React (jedyna warstwa "wymienialna")
```
Reguła: `ui` importuje z `core`/`storage`/`content`. Nigdy odwrotnie.

### ADR-3: Struktura treści per przedmiot
`src/content/polski/`, później `src/content/matematyka/`, `src/content/angielski/`.
Silnik quizu jest wspólny — treść jest wymienna.

## Kontrakt danych

### Pytanie quizowe (bank pytań)
```json
{
  "id": "tw-01",
  "modul": "A|B|C|D|E|F",
  "typ": "single|multi|truefalse|open-short",
  "poziom": 1,
  "tresc": "...",
  "zrodloTekst": "opcjonalny tekst źródłowy / fragment",
  "opcje": ["...", "..."],
  "poprawna": 0,
  "poprawne": [0, 2],
  "wzorzec": "dla open-short: wzorcowa odpowiedź do samooceny",
  "kryteriaSamooceny": ["czy zawiera X", "czy zawiera Y"],
  "wyjasnienie": "OBOWIĄZKOWE: dlaczego ta odpowiedź (błąd = informacja)",
  "punkty": 1
}
```
- `poziom`: 1 (łatwe) → 3 (trudne). Test wstępny układany łatwe→trudne.
- `truefalse`: `opcje` = stwierdzenia, `poprawne` = maska [true,false,...] w polu `poprawnaMaska`.
- `open-short`: uczeń pisze odpowiedź → widzi wzorzec + kryteria → samoocena 0/1/2.

### Profil ucznia (klucz: `rep:profil:<id>`)
```json
{
  "id": "uuid",
  "imie": "Zosia",
  "pinHash": "sha256(pin+salt)",
  "salt": "...",
  "przedmioty": ["polski"],
  "dataEgzaminu": "2027-05-11",
  "utworzono": "ISO",
  "preferencje": { "dysleksja": false, "trybCiemny": true }
}
```

### Postępy (klucz: `rep:postepy:<id>:polski`) — schemat "pod backend"
```json
{
  "wersjaSchematu": 1,
  "diagnoza": {
    "data": "ISO",
    "wynikPkt": 0, "maksPkt": 0, "procent": 0,
    "perModul": { "A": {"pkt": 0, "maks": 0}, "B": {} },
    "poziomPerModul": { "A": "braki|czesciowy|solidny" },
    "odpowiedzi": [ { "idPytania": "tw-01", "odpowiedz": [0], "poprawne": true, "pkt": 1 } ]
  },
  "sesje": [ { "data": "ISO", "typ": "quiz|powtorka|symulacja", "modul": "A", "wynik": {} } ],
  "powtorki": [ { "temat": "...", "nastepna": "ISO", "interwal": 1 } ],
  "kamienieMilowe": { "X2026": null, "I2027": null, "III2027": null, "IV2027": null }
}
```

### StorageAdapter (interfejs)
```js
// src/storage/adapter.js — kontrakt async (pod przyszłe API)
listProfiles(); getProfile(id); saveProfile(p); deleteProfile(id);
getPostepy(profilId, przedmiot); savePostepy(profilId, przedmiot, dane);
exportAll(profilId); importAll(json);
```
Wszystkie metody `async` — implementacja localStorage zwraca natychmiast,
implementacja Supabase będzie sieciowa. UI nie zauważy różnicy.

## Fazy produktu
- **Faza 0 (TERAZ):** profile + test wstępny (diagnoza 15-20 pytań) + zapis wyniku + ekran wyniku per moduł.
- **Faza 1+:** dashboard postępów, moduły nauki A-G, kompendia lektur, spaced repetition,
  trener wypracowań, symulator 150 min, strażnik błędu kardynalnego.

## Źródła merytoryczne
- `../wklad-merytoryczny-plan-repetytorium.md` — dokument bazowy (moduły A-G, plan faz, kamienie milowe)
- `../.opencode/skills/repetytorium-polski/reference/` — egzamin.md, metodyka.md, szablon-html.md
- `../zrodla/` — raport metodyczny (priorytet nad wiedzą własną)
