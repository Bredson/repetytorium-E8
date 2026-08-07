# Angielski it.2 — Słuchanie (TTS) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Czwarty dział „Słuchanie" (20–25% arkusza E8) z odtwarzaczem TTS (Web Speech API): komponent `OdtwarzaczTTS`, treść `sluchanie.json`, integracja w 4 ekranach, diagnoza rośnie do 8 pytań.

**Architecture:** Zero zmian w `core/` (TTS to czysto UI). Nowy komponent + nowy JSON + wpis w rejestrze + warunkowy render playera w `Dzial`/`TestWstepny`/`Powtorka`/`ZadanieOtwarte` (analogicznie do pola `tekst`). Spec: `docs/superpowers/specs/2026-08-07-angielski-it2-sluchanie-design.md`.

**Tech Stack:** React 19, Web Speech API (`speechSynthesis`), Playwright do QA (tor fallbacku + instrumentacja `speak`).

## Global Constraints

- Zero zmian w `src/core/`, `src/storage/`; `npm test` musi pozostać zielony
- Pole `nagranie`: string (monolog) LUB tablica stringów (kwestie dialogu); transkrypcja = tekst nagrania (jedno źródło)
- Głosy: preferencja `en-GB` → `en-US` → dowolny `en-*`; asynchroniczny `voiceschanged`; nie odtwarzać przed załadowaniem
- Fallback (brak `speechSynthesis` lub głosu EN): polski komunikat + transkrypcja widoczna od razu
- Licznik odtworzeń z łagodnym ostrzeżeniem po 2 — bez blokowania
- Tempo 0.95, przełącznik „🐢 wolniej" → 0.8
- `speechSynthesis.cancel()` przy odmontowaniu
- Treść: poziom A2, wariant II.1 (bez mowy zależnej, pytań pośrednich, strony biernej w Present Perfect); tylko ASCII `"` w JSON
- Prefiksy ID: `sl`/`slo`/`tw-sl`; moduł `D`
- Git root: `/Users/pibe/dev/Repetytorium-doc` — jawne, cytowane ścieżki; dev port 5175

---

## Task 1: Komponent OdtwarzaczTTS

**Files:**
- Create: `repetytorium - j_angielski/app/src/ui/components/OdtwarzaczTTS.jsx`

**Interfaces:**
- Produces: `<OdtwarzaczTTS nagranie={string|string[]} pokazTranskrypcje={bool} />`

- [ ] **Step 1: Utwórz komponent**

```jsx
import { useState, useEffect } from "react";

// Preferencja głosów: en-GB → en-US → pozostałe en-*
function uporzadkujGlosyEn(wszystkie) {
  const en = wszystkie.filter((g) => (g.lang || "").toLowerCase().startsWith("en"));
  const gb = en.filter((g) => g.lang.toLowerCase().startsWith("en-gb"));
  const us = en.filter((g) => g.lang.toLowerCase().startsWith("en-us"));
  const reszta = en.filter((g) => !gb.includes(g) && !us.includes(g));
  return [...gb, ...us, ...reszta];
}

export default function OdtwarzaczTTS({ nagranie, pokazTranskrypcje }) {
  const kwestie = Array.isArray(nagranie) ? nagranie : [nagranie];
  const [glosy, setGlosy] = useState(null); // null = ładowanie; [] = brak głosów EN
  const [odtworzenia, setOdtworzenia] = useState(0);
  const [wolniej, setWolniej] = useState(false);
  const [odtwarza, setOdtwarza] = useState(false);
  const [transkrypcjaWidoczna, setTranskrypcjaWidoczna] = useState(false);

  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      setGlosy([]);
      return;
    }
    function zaladuj() {
      const wszystkie = window.speechSynthesis.getVoices();
      if (wszystkie.length > 0) setGlosy(uporzadkujGlosyEn(wszystkie));
    }
    zaladuj();
    window.speechSynthesis.addEventListener("voiceschanged", zaladuj);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", zaladuj);
      window.speechSynthesis.cancel();
    };
  }, []);

  // getVoices() bywa puste i voiceschanged nie zawsze przychodzi (np. headless):
  // po 2 s ładowania uznajemy brak głosów i włączamy fallback
  useEffect(() => {
    if (glosy !== null) return;
    const t = setTimeout(() => setGlosy((g) => (g === null ? [] : g)), 2000);
    return () => clearTimeout(t);
  }, [glosy]);

  const laduje = glosy === null;
  const brakTTS = glosy !== null && glosy.length === 0;

  function odtworz() {
    if (laduje || brakTTS || odtwarza) return;
    setOdtworzenia((n) => n + 1);
    setOdtwarza(true);
    window.speechSynthesis.cancel();
    kwestie.forEach((tekst, i) => {
      const u = new SpeechSynthesisUtterance(tekst);
      // dialog: naprzemienne kwestie dwoma pierwszymi głosami EN (jeśli są)
      const glos = glosy[i % Math.min(glosy.length, 2)];
      u.voice = glos;
      u.lang = glos.lang;
      u.rate = wolniej ? 0.8 : 0.95;
      if (i === kwestie.length - 1) {
        u.onend = () => setOdtwarza(false);
        u.onerror = () => setOdtwarza(false);
      }
      window.speechSynthesis.speak(u);
    });
  }

  const transkrypcja = (
    <div style={{ marginTop: "var(--sp-2)" }}>
      {kwestie.map((k, i) => (
        <p key={i} style={{ fontStyle: "italic", margin: "0 0 4px" }}>
          {kwestie.length > 1 ? `— ${k}` : k}
        </p>
      ))}
      {!brakTTS && (
        <p className="tekst-2 tekst-maly">Posłuchaj jeszcze raz, czytając tekst.</p>
      )}
    </div>
  );

  return (
    <div className="karta" style={{ marginBottom: "var(--sp-3)", padding: "var(--sp-3)" }}>
      {brakTTS ? (
        <>
          <p className="tekst-2" role="alert">
            Twoja przeglądarka nie ma angielskiego głosu do odtworzenia nagrania —
            przeczytaj transkrypcję poniżej.
          </p>
          {transkrypcja}
        </>
      ) : (
        <>
          <div style={{ display: "flex", gap: "var(--sp-2)", alignItems: "center", flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={odtworz} disabled={laduje || odtwarza}>
              {laduje ? "Ładowanie głosów…" : odtwarza ? "Odtwarzanie…" : "▶ Odtwórz nagranie"}
            </button>
            <button
              className={"btn btn-ghost" + (wolniej ? " btn--sukces" : "")}
              onClick={() => setWolniej((w) => !w)}
              aria-pressed={wolniej}
            >
              🐢 wolniej
            </button>
            <span className="tekst-2 tekst-maly">Odtworzenia: {odtworzenia}</span>
          </div>
          {odtworzenia >= 2 && (
            <p className="tekst-2 tekst-maly" style={{ marginTop: "var(--sp-2)", color: "var(--kolor-uwaga)" }}>
              Na egzaminie usłyszysz nagranie tylko 2 razy — spróbuj odpowiedzieć!
            </p>
          )}
          {pokazTranskrypcje && (
            <div style={{ marginTop: "var(--sp-2)" }}>
              {transkrypcjaWidoczna ? (
                transkrypcja
              ) : (
                <button className="btn btn-ghost" onClick={() => setTranskrypcjaWidoczna(true)}>
                  Pokaż transkrypcję
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Build**

```bash
cd "repetytorium - j_angielski/app" && npm run build
```

Oczekiwane: `✓ built` (komponent jeszcze nieużywany — sprawdzamy tylko składnię).

- [ ] **Step 3: Commit**

```bash
git add "repetytorium - j_angielski/app/src/ui/components/OdtwarzaczTTS.jsx"
git commit -m "feat(eng): komponent OdtwarzaczTTS — Web Speech API z fallbackiem (it.2 T1)"
```

---

## Task 2: Treść — sluchanie.json + rejestr + kolor D

**Files:**
- Create: `repetytorium - j_angielski/app/src/content/angielski/dzialy/sluchanie.json`
- Modify: `src/content/angielski/rejestr.js`, `src/ui/pages/Start.jsx` (KOLORY_MODULOW + D)

**Interfaces:**
- Produces: dział `sluchanie` w `DZIALY` (4 działy); pytania/zadania z polem `nagranie`

- [ ] **Step 1: sluchanie.json**

```json
{
  "id": "sluchanie",
  "tytul": "Słuchanie",
  "modul": "D",
  "waga": "wysoka",
  "test_wstepny": [
    {
      "id": "tw-sl1",
      "tresc": "Which platform does the train to London leave from?",
      "nagranie": "Attention, passengers. The train to London leaves from platform four at half past nine.",
      "typ": "zamkniete",
      "opcje": ["Platform 4", "Platform 9", "Platform 2", "Platform 5"],
      "poprawna": "Platform 4"
    },
    {
      "id": "tw-sl2",
      "tresc": "What time must the girl be back home?",
      "nagranie": ["Mum, can I go to the cinema with Kasia tonight?", "Yes, but come back home before nine, please."],
      "typ": "zamkniete",
      "opcje": ["Before 9 p.m.", "After 9 p.m.", "At 10 p.m.", "Before 8 p.m."],
      "poprawna": "Before 9 p.m."
    }
  ],
  "cwiczenia": [
    {
      "id": "sl1",
      "tresc": "When will the students write the test?",
      "nagranie": "Good morning, class. Tomorrow's test is cancelled because I will be at the doctor's. We will write it next Monday instead.",
      "typ": "zamkniete",
      "opcje": ["Next Monday", "Tomorrow", "On Friday", "Today"],
      "poprawna": "Next Monday",
      "wskazowka": "Uważaj na pułapkę: słowo 'tomorrow' pada w nagraniu, ale test jest odwołany. Słuchaj, co jest po 'instead'.",
      "przypomnij": "Word spotting to pułapka egzaminacyjna: pojedyncze słowo z nagrania w opcji nie oznacza, że to poprawna odpowiedź. Słuchaj całego sensu."
    },
    {
      "id": "sl2",
      "tresc": "Why can't Tom go to football practice?",
      "nagranie": ["Hi Tom! Are you coming to football practice today?", "I can't. I have a guitar lesson at five.", "OK, see you tomorrow then."],
      "typ": "zamkniete",
      "opcje": ["He has a music lesson.", "He is ill.", "He plays a match.", "He must do his homework."],
      "poprawna": "He has a music lesson.",
      "wskazowka": "W opcjach rzadko powtarza się dokładne słowo z nagrania — 'guitar lesson' to rodzaj 'music lesson'.",
      "przypomnij": "Poprawna odpowiedź to często PARAFRAZA nagrania (guitar lesson → music lesson), nie dosłowny cytat."
    },
    {
      "id": "sl3",
      "tresc": "What can you buy cheaper today?",
      "nagranie": "Welcome to Green Park Shopping Centre. Today all sports shoes are twenty percent cheaper. The offer ends at six p.m.",
      "typ": "zamkniete",
      "opcje": ["Sports shoes", "All clothes", "Sports bags", "Everything in the shop"],
      "poprawna": "Sports shoes",
      "wskazowka": "Promocja dotyczy jednej konkretnej rzeczy — której?",
      "przypomnij": "Komunikaty w sklepie/na dworcu: słuchaj CO, GDZIE i KIEDY — to o nie zwykle pytają."
    },
    {
      "id": "sl4",
      "tresc": "What does the boy have to buy?",
      "nagranie": ["What are we cooking for dinner, Dad?", "Spaghetti. Can you buy tomatoes and cheese on your way home?", "Sure, anything else?", "No, we have everything else."],
      "typ": "zamkniete",
      "opcje": ["Tomatoes and cheese", "Spaghetti and cheese", "Tomatoes and pasta", "Nothing"],
      "poprawna": "Tomatoes and cheese",
      "wskazowka": "Tata prosi o dwie rzeczy — które dokładnie?",
      "przypomnij": "Przy listach (zakupy, plany) notuj w głowie KAŻDY element — dystraktory mieszają elementy z nagrania."
    },
    {
      "id": "sl5",
      "tresc": "Where does Kate want to meet?",
      "nagranie": "Hi Emma, it's Kate. I'm calling about our history project. Can we meet at the library on Thursday at four? Call me back!",
      "typ": "zamkniete",
      "opcje": ["At the library", "At school", "At Kate's house", "At the museum"],
      "poprawna": "At the library",
      "wskazowka": "Wiadomość głosowa: gdzie proponuje spotkanie?",
      "przypomnij": "W wiadomościach głosowych klucz to: kto dzwoni, po co, gdzie i kiedy proponuje spotkanie."
    }
  ],
  "zadania_otwarte": [
    {
      "id": "slo1",
      "tresc": "Posłuchaj ogłoszenia i uzupełnij notatkę po angielsku.",
      "nagranie": "Hello everyone! The school picnic is on Saturday. We meet at the school gate at ten o'clock. Remember to bring sandwiches and water. See you there!",
      "punkty": 2,
      "kroki": [
        {
          "id": "k1",
          "instrukcja": "The picnic is on ___. (dzień tygodnia)",
          "akceptowane": ["saturday"],
          "podpowiedz": "Posłuchaj początku: The school picnic is on..."
        },
        {
          "id": "k2",
          "instrukcja": "We meet at the school ___ at 10. (miejsce, jedno słowo)",
          "akceptowane": ["gate"],
          "podpowiedz": "gate = brama; spotkanie przy szkolnej bramie"
        }
      ],
      "rozwiazanie_wzorcowe": "The picnic is on Saturday. We meet at the school gate at 10."
    },
    {
      "id": "slo2",
      "tresc": "Posłuchaj rozmowy w muzeum i uzupełnij informacje.",
      "nagranie": ["Excuse me, what time does the museum close today?", "At seven in the evening, but the last entry is at six.", "Thank you! And how much is a student ticket?", "It's five pounds."],
      "punkty": 2,
      "kroki": [
        {
          "id": "k1",
          "instrukcja": "The last entry to the museum is at ___. (godzina)",
          "akceptowane": ["6", "six"],
          "podpowiedz": "Muzeum zamykają o 7, ale ostatnie wejście jest wcześniej — kiedy?"
        },
        {
          "id": "k2",
          "instrukcja": "A student ticket costs ___ pounds. (liczba)",
          "akceptowane": ["5", "five"],
          "podpowiedz": "It's five pounds. = Kosztuje 5 funtów."
        }
      ],
      "rozwiazanie_wzorcowe": "The last entry is at 6. A student ticket costs 5 pounds."
    }
  ]
}
```

- [ ] **Step 2: rejestr.js — dodaj sluchanie**

Import po `srodki` + wpis `sluchanie,` w `DZIALY` po `srodki,`.

- [ ] **Step 3: Start.jsx — kolor modułu D**

Do `KOLORY_MODULOW` dodaj wpis `D` (kolor spójny stylistycznie z A/B/C, różny od nich, np. `D: "#0e9f8a"` — dopasuj format do istniejących wartości).

- [ ] **Step 4: Walidacja + build**

```bash
python3 -c "
import json
d=json.load(open('repetytorium - j_angielski/app/src/content/angielski/dzialy/sluchanie.json'))
assert len(d['test_wstepny'])==2 and len(d['cwiczenia'])==5 and len(d['zadania_otwarte'])==2
assert all('nagranie' in z for z in d['test_wstepny']+d['cwiczenia']+d['zadania_otwarte'])
assert all('wskazowka' in z and 'przypomnij' in z for z in d['cwiczenia'])
assert all(all(k.get('akceptowane') for k in z['kroki']) for z in d['zadania_otwarte'])
print('sluchanie OK')
"
cd "repetytorium - j_angielski/app" && npm run build
```

- [ ] **Step 5: Commit**

```bash
git add "repetytorium - j_angielski/app/src/content" "repetytorium - j_angielski/app/src/ui/pages/Start.jsx"
git commit -m "content(eng): dział Słuchanie — 2+5+2 z polem nagranie + rejestr + kolor D (it.2 T2)"
```

---

## Task 3: Integracja playera w 4 ekranach

**Files:**
- Modify: `repetytorium - j_angielski/app/src/ui/pages/Dzial.jsx`, `TestWstepny.jsx`, `Powtorka.jsx`, `ZadanieOtwarte.jsx`

**Interfaces:**
- Consumes: `OdtwarzaczTTS` (T1), pole `nagranie` (T2)
- Produces: player widoczny wszędzie tam, gdzie pytanie/zadanie ma `nagranie`

- [ ] **Step 1: Dzial.jsx**

Import `OdtwarzaczTTS`; nad blokiem `pytanie.tekst` (lub w tym samym miejscu) dodaj:

```jsx
        {pytanie.nagranie && (
          <OdtwarzaczTTS
            key={pytanie.id}
            nagranie={pytanie.nagranie}
            pokazTranskrypcje={pokazFeedback}
          />
        )}
```

(`key={pytanie.id}` — reset licznika odtworzeń i transkrypcji między pytaniami.)

- [ ] **Step 2: TestWstepny.jsx**

Analogicznie, z `pokazTranskrypcje={false}` (diagnoza bez transkrypcji; fallback i tak pokaże tekst gdy brak TTS). Też `key={pytanie.id}`.

- [ ] **Step 3: Powtorka.jsx**

Analogicznie do Dzial: `pokazTranskrypcje={pokazFeedback}` — dopasuj do nazwy stanu feedbacku w tym komponencie (sprawdź w pliku; jeśli feedback nazywa się inaczej, użyj właściwego). Też `key`.

- [ ] **Step 4: ZadanieOtwarte.jsx**

Player na górze zadania gdy `zadanie.nagranie`:

```jsx
      {zadanie.nagranie && (
        <OdtwarzaczTTS nagranie={zadanie.nagranie} pokazTranskrypcje={ukonczone} />
      )}
```

gdzie `ukonczone` = stan „wszystkie kroki zakończone" (sprawdź nazwę w pliku — komponent ma stan sterujący ekranem podsumowania).

- [ ] **Step 5: Testy + build + smoke**

```bash
cd "repetytorium - j_angielski/app" && npm test && npm run build
```

Dev → dział Słuchanie: player widoczny (w headless prawdopodobnie fallback z transkrypcją — to OK), quiz przechodzi, zadanie otwarte z playerem. Konsola 0 errors. Zabij server.

- [ ] **Step 6: Commit**

```bash
git add "repetytorium - j_angielski/app/src/ui"
git commit -m "feat(eng): player TTS w Dzial/TestWstepny/Powtorka/ZadanieOtwarte (it.2 T3)"
```

---

## Task 4: QA + docs

**Files:**
- Modify: `repetytorium - j_angielski/STAN-PROJEKTU.md`, `LESSONS.md`

**Interfaces:**
- Consumes: całość it.2
- Produces: DoD potwierdzone (poza ręcznym odsłuchem — krok użytkownika), docs

- [ ] **Step 1: Testy + build**

```bash
cd "repetytorium - j_angielski/app" && npm test && npm run build
```

- [ ] **Step 2: QA — tor fallbacku (headless bez głosów EN)**

Dev + Playwright, świeży profil:
1. Diagnoza ma **8 pytań**; pytania słuchane (tw-sl1/tw-sl2) pokazują player LUB fallback z transkrypcją
2. Dział Słuchanie: jeśli fallback — komunikat PL + transkrypcja widoczna; quiz sl1–sl5 przechodzi (poprawne odpowiedzi z JSON); zadanie otwarte slo1/slo2 — kroki z `akceptowane` zaliczają
3. Konsola 0 errors

- [ ] **Step 3: QA — instrumentacja TTS**

Przez `browser_evaluate` PRZED wejściem w dział podmień:

```js
() => {
  window.__spoken = [];
  const org = window.speechSynthesis.getVoices.bind(window.speechSynthesis);
  // sztuczne głosy EN, żeby wymusić tor playera
  window.speechSynthesis.getVoices = () => [
    { lang: "en-GB", name: "TestGB" },
    { lang: "en-US", name: "TestUS" }
  ];
  window.speechSynthesis.speak = (u) => { window.__spoken.push({ tekst: u.text, rate: u.rate, lang: u.voice?.lang }); };
  window.speechSynthesis.cancel = () => {};
  window.dispatchEvent && window.speechSynthesis.dispatchEvent && window.speechSynthesis.dispatchEvent(new Event("voiceschanged"));
}
```

Uwaga: `speechSynthesis.addEventListener` nasłuchuje na obiekcie speechSynthesis —
jeśli dispatch nie zadziała, wystarczy odczekać 2 s (timeout w komponencie nie
przełączy na fallback, bo getVoices zwraca głosy przy pierwszym `zaladuj()`).
Następnie:
1. Kliknij „▶ Odtwórz nagranie" na pytaniu z dialogiem (sl2) → `window.__spoken` ma 3 wpisy (3 kwestie), `lang` en-GB/en-US naprzemiennie, `rate` 0.95
2. Włącz „🐢 wolniej", odtwórz ponownie → nowe wpisy z `rate` 0.8; licznik odtworzeń = 2 → widoczne ostrzeżenie o 2 odtworzeniach
3. Po odpowiedzi: przycisk „Pokaż transkrypcję" → transkrypcja + zachęta

- [ ] **Step 4: QA mobile 390×844**

Player (przyciski ▶ / 🐢) klikalne, bez poziomego scrolla, na pytaniu słuchanym.

- [ ] **Step 5: Aktualizacja STAN-PROJEKTU.md**

1. Nagłówek: `2026-08-07, po sesji it.2 (dział Słuchanie z TTS — 4 działy; diagnoza 8 pytań)`
2. Sekcja 4: wiersz it.2 (OdtwarzaczTTS, sluchanie.json 2+5+2, integracja 4 ekranów)
3. Sekcja 7: it.3 = Wypowiedź pisemna (następne), potem egzamin próbny/statystyki/deploy/Hub; **dopisz: ręczny odsłuch TTS przez użytkownika — zaplanowany, wynik do odnotowania w LESSONS**
4. Sekcja 8 bez zmian koncepcyjnych (zaktualizuj liczbę działów)

- [ ] **Step 6: Wpis LESSONS.md**

`## 2026-08-07 (it.2 — dział Słuchanie z TTS)` — obserwacje (m.in.: zachowanie
głosów w headless — który tor QA zadziałał; wzorzec instrumentacji speak;
`key={pytanie.id}` na playerze jako reset stanu). Zaznacz wprost: **dźwięk
nie był odsłuchany automatycznie — czeka na ręczny odsłuch użytkownika.**
Zakończ `Zmiana w skilu: ...`.

- [ ] **Step 7: Commit**

```bash
git add "repetytorium - j_angielski/STAN-PROJEKTU.md" "repetytorium - j_angielski/LESSONS.md"
git commit -m "docs(eng): STAN-PROJEKTU + LESSONS — it.2 ukończona (Słuchanie, TTS)"
```
