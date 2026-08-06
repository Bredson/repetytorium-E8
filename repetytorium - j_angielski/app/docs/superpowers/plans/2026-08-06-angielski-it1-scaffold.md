# Angielski it.1 — scaffold SPA + 3 działy tekstowe — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Działająca SPA do nauki angielskiego (E8) z profilem, diagnozą, dashboardem i pełnym cyklem nauki dla 3 działów tekstowych: Funkcje językowe, Czytanie, Środki językowe.

**Architecture:** Kopiujemy wzorzec `repetytorium - matematyka/app/` (Vite + React 19, bez TS, bez routera; warstwy content→core→storage→ui; localStorage). Różnice: bez KaTeX (czysty tekst), walidacja zadań otwartych przez tablicę `akceptowane` (stringi, case-insensitive), port 5175, klucz `rep:postepy:{uuid}:angielski`. Spec: `docs/superpowers/specs/2026-08-06-angielski-it1-scaffold-design.md`.

**Tech Stack:** Vite, React 19, vanilla CSS (kopiowany z matematyki), testy `node:assert/strict` przez `node tests/*.test.mjs`.

## Global Constraints

- **Źródło wzorców:** `repetytorium - matematyka/app/` — przy każdym kopiowanym pliku podana dokładna ścieżka źródłowa; czytaj źródło przed adaptacją
- **Bez KaTeX**: żadnych importów `katex`, żadnego `KaTeXRenderer` — tekst renderowany wprost
- Klucz localStorage: przedmiot **`angielski`** (adapter parametryczny jak w matematyce)
- Dev port: **5175** (`vite.config.js` → `server: { port: 5175 }`)
- Treść zgodna z wariantem **II.1**: NIE używać mowy zależnej, pytań pośrednich, strony biernej w Present Perfect
- Zadania otwarte: pole **`akceptowane`** (tablica stringów) zamiast `oczekiwana`; walidacja trim + case-insensitive, bez fuzzy matchingu
- Tylko ASCII `"` w JSON; apostrofy `'` w treści angielskiej są OK
- Walidacja po każdym pliku JSON: `python3 -c "import json,sys; json.load(open(sys.argv[1]))" <plik>`
- Wzorce UX z matematyki po it.7/it.8 **od razu**: pauza + „Dalej" po błędnej odpowiedzi, losowe zadanie otwarte, `key={pytanie.id}` na `<details>`, functional updater, `clearTimeout` w `reset()`
- `core/plan.js` parametryczny względem rejestru (lekcja z review mat it.6)
- Git root: `/Users/pibe/dev/Repetytorium-doc` — jawne, cytowane ścieżki przy `git add`
- Lokalizacja apki: `repetytorium - j_angielski/app/`

---

## Task 1: Scaffold Vite + React + storage + profil

**Files:**
- Create: `repetytorium - j_angielski/app/` — `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/index.css`, `src/App.jsx` (placeholder), `src/storage/adapter.js`, `src/core/profil.js`
- Source (czytaj i adaptuj): `repetytorium - matematyka/app/package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/index.css`, `src/storage/adapter.js`, `src/core/profil.js`

**Interfaces:**
- Produces: `zapiszPostepy(uuid, dane)` / `wczytajPostepy(uuid)` (adapter, przedmiot `angielski`); `pustePostepy()`, funkcje profilu z `core/profil.js`; działający `npm run dev` na 5175 i `npm run build`

- [ ] **Step 1: Zainicjuj projekt**

Skopiuj z matematyki i zaadaptuj:
- `package.json` — name `repetytorium-angielski`, **usuń zależność `katex`**, skrypt `test` ustaw docelowo: `node tests/quiz.test.mjs && node tests/plan.test.mjs && node tests/powtorki.test.mjs` (pliki powstaną w T2 — do tego czasu `npm test` może failować, nie uruchamiaj go w tym tasku)
- `vite.config.js` — `server: { port: 5175 }`
- `index.html` — tytuł `Repetytorium ósmoklasisty — angielski`, **usuń linki/importy KaTeX** jeśli są
- `src/main.jsx`, `src/index.css` — kopiuj (usuń ewentualny import css KaTeX)
- `src/App.jsx` — na razie placeholder: `export default function App() { return <div className="tresc"><h1>Repetytorium — angielski</h1></div>; }`

```bash
cd "repetytorium - j_angielski/app" && npm install
```

- [ ] **Step 2: storage/adapter.js + core/profil.js**

Kopiuj z `repetytorium - matematyka/app/src/storage/adapter.js` i `src/core/profil.js`.
Adaptacje: wszędzie gdzie adapter/profil przyjmuje lub hardkoduje przedmiot —
ustaw `"angielski"` (klucz `rep:postepy:{uuid}:angielski`). `pustePostepy()`
zachowuje strukturę `{ dzialy: {}, ... }` jak w źródle.

- [ ] **Step 3: Weryfikacja dev + build**

```bash
cd "repetytorium - j_angielski/app" && npm run build && (npm run dev &) && sleep 3 && curl -s http://localhost:5175 | head -5; pkill -f "vite.*5175" || true
```

Oczekiwane: build ✓; dev serwuje HTML z tytułem angielskiego na 5175.

- [ ] **Step 4: Commit**

```bash
git add "repetytorium - j_angielski/app/package.json" "repetytorium - j_angielski/app/package-lock.json" \
  "repetytorium - j_angielski/app/vite.config.js" "repetytorium - j_angielski/app/index.html" \
  "repetytorium - j_angielski/app/src" "repetytorium - j_angielski/app/.gitignore" 2>/dev/null || \
git add "repetytorium - j_angielski/app"
git commit -m "feat(eng): scaffold Vite+React + storage + profil (it.1 T1)"
```

(Jeśli `npm create vite` wygenerował `.gitignore` z `node_modules` — dobrze; upewnij się, że `node_modules` NIE wchodzi do commita.)

---

## Task 2: core — quiz (TDD), plan, powtorki

**Files:**
- Create: `repetytorium - j_angielski/app/src/core/quiz.js`, `src/core/plan.js`, `src/core/powtorki.js`, `tests/quiz.test.mjs`, `tests/plan.test.mjs`, `tests/powtorki.test.mjs`
- Source: `repetytorium - matematyka/app/src/core/{quiz,plan,powtorki}.js` + `tests/{quiz,plan}.test.mjs`

**Interfaces:**
- Consumes: brak (czysta logika)
- Produces: `obliczWynikDzialu(pytania, odpowiedzi)` → `{poprawne, wszystkich, procent}`; **`sprawdzKrok(krok, wartosc)`** → boolean (nowa semantyka: `krok.akceptowane`); `generujPlan(diagnoza, kolejnosc)`, `migrujPlan(plan, kolejnosc, diagnoza)`; `nowaPowtorka`, `coNaDzis`, `oznaczPowtorke`

- [ ] **Step 1: Napisz failujący test sprawdzKrok (nowa semantyka)**

`tests/quiz.test.mjs` — skopiuj strukturę z matematyki, dla `sprawdzKrok` użyj:

```js
import assert from "node:assert/strict";
import { sprawdzKrok, obliczWynikDzialu } from "../src/core/quiz.js";

const krok = { akceptowane: ["went", "walked"] };
assert.equal(sprawdzKrok(krok, "went"), true, "wariant 1");
assert.equal(sprawdzKrok(krok, "walked"), true, "wariant 2");
assert.equal(sprawdzKrok(krok, "  WENT "), true, "trim + case-insensitive");
assert.equal(sprawdzKrok(krok, "gone"), false, "zly wyraz odrzucony");
assert.equal(sprawdzKrok(krok, "wend"), false, "literowka odrzucona (pisownia sie liczy)");
assert.equal(sprawdzKrok({ akceptowane: ["doesn't", "does not"] }, "does not"), true, "wariant wielowyrazowy");
```

- [ ] **Step 2: Uruchom test — musi failować**

```bash
cd "repetytorium - j_angielski/app" && node tests/quiz.test.mjs
```

Oczekiwane: błąd (brak `src/core/quiz.js`).

- [ ] **Step 3: Zaimplementuj quiz.js**

`obliczWynikDzialu` — skopiuj z matematyki bez zmian. `sprawdzKrok` — nowa implementacja:

```js
export function sprawdzKrok(krok, wartosc) {
  const odp = String(wartosc).trim().toLowerCase();
  return (krok.akceptowane ?? []).some(
    (a) => String(a).trim().toLowerCase() === odp
  );
}
```

- [ ] **Step 4: plan.js + powtorki.js + ich testy**

Kopiuj `plan.js` z matematyki (stan PO it.6 — już parametryczny: `generujPlan(diagnoza, kolejnosc)`, `migrujPlan`, `wpisPlanu`) oraz `powtorki.js` bez zmian koncepcyjnych. Testy: skopiuj `tests/plan.test.mjs` z matematyki i dostosuj fixture do 3 działów (`["funkcje","czytanie","srodki"]`); `tests/powtorki.test.mjs` — jeśli matematyka nie ma tego testu, napisz minimalny: `nowaPowtorka` tworzy rekord z datą, `coNaDzis` zwraca rekordy z datą ≤ dziś, `oznaczPowtorke("umiem")` przesuwa datę do przodu.

- [ ] **Step 5: Testy zielone**

```bash
cd "repetytorium - j_angielski/app" && npm test
```

Oczekiwane: 3 suity OK.

- [ ] **Step 6: Commit**

```bash
git add "repetytorium - j_angielski/app/src/core" "repetytorium - j_angielski/app/tests"
git commit -m "feat(eng): core quiz/plan/powtorki z TDD — sprawdzKrok z akceptowane (it.1 T2)"
```

---

## Task 3: Treść — 3 działy JSON + rejestr.js

**Files:**
- Create: `repetytorium - j_angielski/app/src/content/angielski/dzialy/funkcje.json`, `czytanie.json`, `srodki.json`, `src/content/angielski/rejestr.js`

**Interfaces:**
- Consumes: schemat z Global Constraints
- Produces: `DZIALY` (3 klucze: `funkcje`, `czytanie`, `srodki`), `material(id)`; ID: `f/fo/tw-f`, `c/co/tw-c`, `s/so/tw-s`

- [ ] **Step 1: funkcje.json**

```json
{
  "id": "funkcje",
  "tytul": "Funkcje językowe",
  "modul": "A",
  "waga": "wysoka",
  "test_wstepny": [
    {
      "id": "tw-f1",
      "tresc": "Kolega mówi: 'Thank you so much for your help!' Co odpowiesz?",
      "typ": "zamkniete",
      "opcje": ["You're welcome.", "Yes, please.", "Never mind.", "Here you are."],
      "poprawna": "You're welcome."
    },
    {
      "id": "tw-f2",
      "tresc": "Chcesz zaproponować koledze wspólne wyjście do kina. Co powiesz?",
      "typ": "zamkniete",
      "opcje": ["How about going to the cinema?", "Do you like the cinema?", "I must go to the cinema.", "Where is the cinema?"],
      "poprawna": "How about going to the cinema?"
    }
  ],
  "cwiczenia": [
    {
      "id": "f1",
      "tresc": "Prosisz nauczyciela o powtórzenie pytania. Co powiesz?",
      "typ": "zamkniete",
      "opcje": ["Could you repeat the question, please?", "Repeat, now!", "What did you do?", "I don't know the question."],
      "poprawna": "Could you repeat the question, please?",
      "wskazowka": "Grzeczna prośba zaczyna się od Could you...? / Can you...? i kończy please.",
      "przypomnij": "Prośby: Could you + czasownik...? (grzeczniejsze niż Can you...?). Zwroty grzecznościowe to priorytet CKE!"
    },
    {
      "id": "f2",
      "tresc": "Kolega pyta: 'Would you like some tea?' Jak grzecznie odmówisz?",
      "typ": "zamkniete",
      "opcje": ["No, thank you.", "No!", "I like tea.", "You're welcome."],
      "poprawna": "No, thank you.",
      "wskazowka": "Odmawiając propozycji, zawsze dodaj thank you.",
      "przypomnij": "Przyjęcie: Yes, please. Odmowa: No, thank you (thanks)."
    },
    {
      "id": "f3",
      "tresc": "Przepraszasz za spóźnienie na lekcję. Co powiesz?",
      "typ": "zamkniete",
      "opcje": ["I'm sorry I'm late.", "I'm late, so what?", "Excuse me, where is the class?", "It's late now."],
      "poprawna": "I'm sorry I'm late.",
      "wskazowka": "Przepraszanie: I'm sorry (for)...",
      "przypomnij": "I'm sorry = przepraszam (za coś); Excuse me = przepraszam (zaczepiając kogoś)."
    },
    {
      "id": "f4",
      "tresc": "Kolega właśnie zdał ważny egzamin. Co mu powiesz?",
      "typ": "zamkniete",
      "opcje": ["Congratulations!", "Good luck!", "Never mind!", "What a pity!"],
      "poprawna": "Congratulations!",
      "wskazowka": "Good luck mówimy PRZED próbą, Congratulations PO sukcesie.",
      "przypomnij": "Gratulacje: Congratulations! Pocieszenie: Never mind. / What a pity."
    },
    {
      "id": "f5",
      "tresc": "Nie dosłyszałeś, co powiedział rozmówca. Jak zareagujesz?",
      "typ": "zamkniete",
      "opcje": ["Sorry, could you say that again?", "I understand everything.", "You are wrong.", "Speak, please!"],
      "poprawna": "Sorry, could you say that again?",
      "wskazowka": "Prośba o powtórzenie: Sorry? / Could you say that again? / Pardon?",
      "przypomnij": "Gdy nie rozumiesz: Sorry, could you repeat that? / Could you speak more slowly, please?"
    }
  ],
  "zadania_otwarte": [
    {
      "id": "fo1",
      "tresc": "Uzupełnij mini-dialogi jednym słowem po angielsku.",
      "punkty": 2,
      "kroki": [
        {
          "id": "k1",
          "instrukcja": "– ___ you like a sandwich? – Yes, please. (wpisz brakujące słowo)",
          "akceptowane": ["would"],
          "podpowiedz": "Propozycja: Would you like...? = Czy chciałbyś...?"
        },
        {
          "id": "k2",
          "instrukcja": "– Thank you for your help! – You're ___. (wpisz brakujące słowo)",
          "akceptowane": ["welcome"],
          "podpowiedz": "Odpowiedź na podziękowanie: You're welcome. = Nie ma za co."
        }
      ],
      "rozwiazanie_wzorcowe": "Would you like a sandwich? / You're welcome."
    },
    {
      "id": "fo2",
      "tresc": "Uzupełnij reakcje odpowiednim słowem po angielsku.",
      "punkty": 2,
      "kroki": [
        {
          "id": "k1",
          "instrukcja": "Kolega: 'I've got a new bike!' Ty: 'That's great ___!' (nowina, wiadomość)",
          "akceptowane": ["news"],
          "podpowiedz": "That's great news! = Świetna wiadomość!"
        },
        {
          "id": "k2",
          "instrukcja": "Koleżanka: 'I failed my test.' Ty: 'What a ___!' (szkoda)",
          "akceptowane": ["pity", "shame"],
          "podpowiedz": "What a pity! / What a shame! = Jaka szkoda!"
        }
      ],
      "rozwiazanie_wzorcowe": "That's great news! / What a pity! (lub: What a shame!)"
    }
  ]
}
```

- [ ] **Step 2: czytanie.json**

```json
{
  "id": "czytanie",
  "tytul": "Czytanie",
  "modul": "B",
  "waga": "wysoka",
  "test_wstepny": [
    {
      "id": "tw-c1",
      "tresc": "What time does the bus leave?",
      "tekst": "Dear students, the school trip to the museum is on Friday. Remember to bring your lunch and wear comfortable shoes. The bus leaves at 8 a.m.",
      "typ": "zamkniete",
      "opcje": ["At 8 a.m.", "On Friday afternoon", "At the museum", "After lunch"],
      "poprawna": "At 8 a.m."
    },
    {
      "id": "tw-c2",
      "tresc": "Where can you see this text?",
      "tekst": "SALE! All winter jackets 50% off. Only this weekend!",
      "typ": "zamkniete",
      "opcje": ["In a clothes shop", "At a bus stop", "In a school canteen", "At a doctor's"],
      "poprawna": "In a clothes shop"
    }
  ],
  "cwiczenia": [
    {
      "id": "c1",
      "tresc": "What does this sign mean?",
      "tekst": "NO FOOD OR DRINKS IN THE LIBRARY",
      "typ": "zamkniete",
      "opcje": ["You can't eat or drink here.", "You can buy food here.", "The library is closed.", "Drinks are cheap here."],
      "poprawna": "You can't eat or drink here.",
      "wskazowka": "Znaki i tabliczki: NO + rzeczownik = zakaz.",
      "przypomnij": "NO FOOD = zakaz jedzenia; szukaj, czego dotyczy zakaz, nie pojedynczych słów."
    },
    {
      "id": "c2",
      "tresc": "Why can't Alex play football today?",
      "tekst": "Hi Tom! I can't play football today because I have to visit my grandma. Can we meet tomorrow after school? Alex",
      "typ": "zamkniete",
      "opcje": ["He is visiting his grandmother.", "He is ill.", "He has a lot of homework.", "He is meeting Tom."],
      "poprawna": "He is visiting his grandmother.",
      "wskazowka": "Szukaj w tekście powodu po słowie because.",
      "przypomnij": "because = ponieważ — po nim zwykle stoi odpowiedź na pytanie Why...?"
    },
    {
      "id": "c3",
      "tresc": "What does Kate do on Saturdays?",
      "tekst": "Kate loves animals. She has two cats and a dog. Every Saturday she helps at the animal shelter near her house.",
      "typ": "zamkniete",
      "opcje": ["She helps at an animal shelter.", "She buys new pets.", "She visits her friends.", "She walks in the park."],
      "poprawna": "She helps at an animal shelter.",
      "wskazowka": "Znajdź w tekście fragment o sobocie (Every Saturday...).",
      "przypomnij": "Pytanie o szczegół — szukaj słowa-klucza z pytania (Saturdays) w tekście."
    },
    {
      "id": "c4",
      "tresc": "Why did Emma write this text?",
      "tekst": "Come to my birthday party on Saturday at 5 p.m.! My address is 12 Green Street. Please let me know if you can come. Emma",
      "typ": "zamkniete",
      "opcje": ["To invite a friend to her party.", "To thank a friend for a present.", "To ask about homework.", "To say sorry for missing a party."],
      "poprawna": "To invite a friend to her party.",
      "wskazowka": "Pytanie o intencję autora: PO CO powstał tekst, nie o szczegóły.",
      "przypomnij": "Intencje: to invite (zaprosić), to thank (podziękować), to apologise (przeprosić), to inform (poinformować)."
    },
    {
      "id": "c5",
      "tresc": "Which title is the best for this text?",
      "tekst": "Mix flour, eggs and milk. Fry on both sides until golden. Serve with fruit or honey.",
      "typ": "zamkniete",
      "opcje": ["How to make pancakes", "My favourite restaurant", "Healthy fruit salad", "A shopping list"],
      "poprawna": "How to make pancakes",
      "wskazowka": "Dobieranie nagłówka: o czym jest CAŁY tekst, nie jedno zdanie.",
      "przypomnij": "Czasowniki w trybie rozkazującym (Mix, Fry, Serve) = instrukcja/przepis."
    }
  ],
  "zadania_otwarte": [
    {
      "id": "co1",
      "tresc": "Przeczytaj tekst i uzupełnij notatkę po angielsku.\n\nTekst: 'Hi Anna! The English club meets on Tuesdays in room 14. We watch films and play games. You can join us - it's free!'",
      "punkty": 2,
      "kroki": [
        {
          "id": "k1",
          "instrukcja": "The club meets on ___. (dzień tygodnia, po angielsku)",
          "akceptowane": ["tuesdays", "tuesday"],
          "podpowiedz": "Szukaj w tekście: meets on..."
        },
        {
          "id": "k2",
          "instrukcja": "The meetings are in room ___. (numer)",
          "akceptowane": ["14", "fourteen"],
          "podpowiedz": "Szukaj w tekście: in room..."
        }
      ],
      "rozwiazanie_wzorcowe": "The club meets on Tuesdays in room 14."
    },
    {
      "id": "co2",
      "tresc": "Przeczytaj tekst i uzupełnij odpowiedzi jednym słowem po angielsku.\n\nTekst: 'Sam usually cycles to school, but when it rains, he takes the bus.'",
      "punkty": 2,
      "kroki": [
        {
          "id": "k1",
          "instrukcja": "How does Sam usually get to school? By ___.",
          "akceptowane": ["bike", "bicycle"],
          "podpowiedz": "cycles = jeździ rowerem; by bike = rowerem"
        },
        {
          "id": "k2",
          "instrukcja": "What does he take when it rains? The ___.",
          "akceptowane": ["bus"],
          "podpowiedz": "Szukaj w tekście: when it rains, he takes..."
        }
      ],
      "rozwiazanie_wzorcowe": "By bike. / The bus."
    }
  ]
}
```

- [ ] **Step 3: srodki.json**

```json
{
  "id": "srodki",
  "tytul": "Środki językowe",
  "modul": "C",
  "waga": "wysoka",
  "test_wstepny": [
    {
      "id": "tw-s1",
      "tresc": "Yesterday I ___ to the cinema with my friends.",
      "typ": "zamkniete",
      "opcje": ["went", "go", "goes", "going"],
      "poprawna": "went"
    },
    {
      "id": "tw-s2",
      "tresc": "There ___ a lot of people at the concert last night.",
      "typ": "zamkniete",
      "opcje": ["were", "was", "is", "are"],
      "poprawna": "were"
    }
  ],
  "cwiczenia": [
    {
      "id": "s1",
      "tresc": "She ___ TV every evening.",
      "typ": "zamkniete",
      "opcje": ["watches", "watch", "watching", "watched"],
      "poprawna": "watches",
      "wskazowka": "every evening = czynność powtarzalna; ona = 3. osoba liczby pojedynczej.",
      "przypomnij": "Present Simple, 3. os. l.poj.: czasownik + -s/-es (she watches, he goes)."
    },
    {
      "id": "s2",
      "tresc": "Last summer we ___ our grandparents in Krakow.",
      "typ": "zamkniete",
      "opcje": ["visited", "visit", "visits", "are visiting"],
      "poprawna": "visited",
      "wskazowka": "Last summer = przeszłość zakończona → Past Simple.",
      "przypomnij": "Past Simple: czasownik + -ed (regularne) lub 2. forma (nieregularne). Past Simple to najsłabszy punkt uczniów wg CKE — ćwicz go!"
    },
    {
      "id": "s3",
      "tresc": "Tom is ___ than his brother.",
      "typ": "zamkniete",
      "opcje": ["taller", "tall", "the tallest", "more tall"],
      "poprawna": "taller",
      "wskazowka": "Porównanie dwóch osób + than → stopień wyższy.",
      "przypomnij": "Krótkie przymiotniki: -er + than (taller than); najwyższy: the + -est (the tallest)."
    },
    {
      "id": "s4",
      "tresc": "I'm really interested ___ history.",
      "typ": "zamkniete",
      "opcje": ["in", "on", "at", "for"],
      "poprawna": "in",
      "wskazowka": "interested łączy się zawsze z jednym przyimkiem.",
      "przypomnij": "Stałe połączenia: interested in, good at, afraid of, listen to."
    },
    {
      "id": "s5",
      "tresc": "___ you ever been to London?",
      "typ": "zamkniete",
      "opcje": ["Have", "Has", "Did", "Are"],
      "poprawna": "Have",
      "wskazowka": "ever + been = doświadczenie życiowe → Present Perfect.",
      "przypomnij": "Present Perfect: have/has + 3. forma. Have you ever been to...? = Czy kiedykolwiek byłeś w...?"
    }
  ],
  "zadania_otwarte": [
    {
      "id": "so1",
      "tresc": "Przetłumacz fragmenty zdań na angielski (wpisz jedno słowo lub krótką formę).",
      "punkty": 2,
      "kroki": [
        {
          "id": "k1",
          "instrukcja": "Wczoraj kupiłem nową książkę. → I ___ a new book yesterday. (czasownik)",
          "akceptowane": ["bought"],
          "podpowiedz": "buy → bought (2. forma, Past Simple)"
        },
        {
          "id": "k2",
          "instrukcja": "Ona nie lubi kawy. → She ___ like coffee. (forma przecząca)",
          "akceptowane": ["doesn't", "does not"],
          "podpowiedz": "Present Simple, 3. os.: doesn't + czasownik bez -s"
        }
      ],
      "rozwiazanie_wzorcowe": "I bought a new book yesterday. / She doesn't like coffee."
    },
    {
      "id": "so2",
      "tresc": "Parafraza: uzupełnij drugie zdanie tak, żeby znaczyło to samo co pierwsze.",
      "punkty": 2,
      "kroki": [
        {
          "id": "k1",
          "instrukcja": "Mike is younger than Tom. → Tom is ___ than Mike. (przymiotnik)",
          "akceptowane": ["older"],
          "podpowiedz": "młodszy ↔ starszy: young → old, stopień wyższy: older"
        },
        {
          "id": "k2",
          "instrukcja": "The film was boring for me. → I was ___ with the film. (przymiotnik na -ed)",
          "akceptowane": ["bored"],
          "podpowiedz": "boring (nudny) → bored (znudzony): I was bored."
        }
      ],
      "rozwiazanie_wzorcowe": "Tom is older than Mike. / I was bored with the film."
    }
  ]
}
```

- [ ] **Step 4: rejestr.js**

```js
import funkcje from "./dzialy/funkcje.json";
import czytanie from "./dzialy/czytanie.json";
import srodki from "./dzialy/srodki.json";

export const DZIALY = {
  funkcje,
  czytanie,
  srodki,
};

export function material(id) {
  return DZIALY[id];
}
```

- [ ] **Step 5: Walidacja JSON + liczby**

```bash
for f in funkcje czytanie srodki; do
  python3 -c "
import json
d=json.load(open('repetytorium - j_angielski/app/src/content/angielski/dzialy/$f.json'))
assert len(d['test_wstepny'])==2 and len(d['cwiczenia'])==5 and len(d['zadania_otwarte'])==2
assert all('wskazowka' in z and 'przypomnij' in z for z in d['cwiczenia'])
assert all(all(k.get('akceptowane') for k in z['kroki']) for z in d['zadania_otwarte'])
print('$f OK')
"
done
```

Oczekiwane: `funkcje OK`, `czytanie OK`, `srodki OK`

- [ ] **Step 6: Build + commit**

```bash
cd "repetytorium - j_angielski/app" && npm run build
git add "repetytorium - j_angielski/app/src/content"
git commit -m "content(eng): 3 działy — funkcje, czytanie, środki (it.1 T3)"
```

---

## Task 4: UI — profil, diagnoza, dashboard

**Files:**
- Create: `repetytorium - j_angielski/app/src/ui/pages/{WyborProfilu,EkranPin,NowyProfil,TestWstepny,Start}.jsx` + ewentualne komponenty wspólne, `src/App.jsx` (router: profil → diagnoza → start)
- Source: te same pliki w `repetytorium - matematyka/app/src/ui/pages/` + `src/App.jsx`

**Interfaces:**
- Consumes: `DZIALY`/`material` (T3), core i storage (T1–T2)
- Produces: działający przepływ profil → PIN → diagnoza (6 pytań) → dashboard (3 karty + banner + „Na dziś")

- [ ] **Step 1: Ekrany profilu**

Kopiuj `WyborProfilu.jsx`, `EkranPin.jsx`, `NowyProfil.jsx` z matematyki. Adaptacje: importy ścieżek, brak KaTeX (jeśli był importowany — usuń), teksty bez zmian.

- [ ] **Step 2: TestWstepny.jsx**

Kopiuj z matematyki. Adaptacje: import `DZIALY` z `../../content/angielski/rejestr.js`; **render pola `tekst`** — jeśli pytanie ma `tekst`, wyświetl je nad treścią w ramce:

```jsx
{pytanie.tekst && (
  <p className="karta" style={{ background: "var(--kolor-tlo-2, #f5f5f5)", padding: "var(--sp-3)", marginBottom: "var(--sp-3)", whiteSpace: "pre-wrap", fontStyle: "italic" }}>
    {pytanie.tekst}
  </p>
)}
```

Wszędzie gdzie matematyka używała `<KaTeXRenderer tekst={...} />` — zamień na zwykły render `{...}` (tekst w `<span>` lub bezpośrednio).

- [ ] **Step 3: Start.jsx (dashboard)**

Kopiuj z matematyki. Adaptacje: rejestr angielski; `KOLORY_MODULOW` tylko `A`,`B`,`C` (trzy kolory z palety matematyki); teksty nagłówka („Repetytorium — angielski").

- [ ] **Step 4: App.jsx — router część 1**

Kopiuj z matematyki i przytnij do stanów: `wybor-profilu`, `pin`, `nowy-profil`, `test-wstepny`, `start` (stany `dzial`/`zadanie-otwarte`/`powtorka` dodamy w T5 — na razie kliknięcie karty działu może być no-op lub alert). Zachowaj: `KOLEJNOSC_DZIALOW = Object.keys(DZIALY)`, `generujPlan`/`migrujPlan` przy wczytaniu profilu (wzorzec po it.6).

- [ ] **Step 5: Build + smoke**

```bash
cd "repetytorium - j_angielski/app" && npm run build
```

Dev server → utwórz profil → przejdź diagnozę (6 pytań, teksty czytania widoczne w ramce) → dashboard z 3 kartami. Konsola 0 errors. Zabij server.

- [ ] **Step 6: Commit**

```bash
git add "repetytorium - j_angielski/app/src/ui" "repetytorium - j_angielski/app/src/App.jsx"
git commit -m "feat(eng): ekrany profilu + diagnoza + dashboard (it.1 T4)"
```

---

## Task 5: UI — Dzial, ZadanieOtwarte, Powtorka + pełny router

**Files:**
- Create: `repetytorium - j_angielski/app/src/ui/pages/{Dzial,ZadanieOtwarte,Powtorka}.jsx`, `src/ui/components/KrokZadania.jsx`
- Modify: `src/App.jsx` (stany `dzial`/`zadanie-otwarte`/`powtorka`)
- Source: te same pliki w matematyce (stan PO it.7+it.8!)

**Interfaces:**
- Consumes: `sprawdzKrok` (semantyka `akceptowane`), `material`, ekrany z T4
- Produces: pełny cykl nauki

- [ ] **Step 1: Dzial.jsx**

Kopiuj z matematyki (aktualny stan — zawiera już pauzę po błędzie + „Dalej",
losowe zadanie otwarte, `key={pytanie.id}`, functional updater, `clearTimeout`
w `reset()`). Adaptacje:
- rejestr angielski; KaTeXRenderer → zwykły tekst
- render `pytanie.tekst` nad treścią (ta sama ramka co w TestWstepny — Step 2 z T4)

- [ ] **Step 2: KrokZadania.jsx**

Kopiuj z matematyki. Adaptacje:
- KaTeXRenderer → zwykły tekst (instrukcja, podpowiedź)
- feedback „Dobrze!": `Dobrze! {wartosc}` (bez KaTeX, bez jednostek — pole `jednostka` nie występuje w angielskim; usuń logikę jednostki i placeholder inputa ustaw na "Wpisz odpowiedź")
- **sekcja podpowiedzi po 2 błędach**: zamiast `krok.oczekiwana` pokaż `krok.akceptowane[0]` jako rozwiązanie
- `inputMode` zostaw domyślny tekstowy (usuń `inputMode="decimal"`)

- [ ] **Step 3: ZadanieOtwarte.jsx + Powtorka.jsx**

Kopiuj z matematyki. Adaptacje: rejestr angielski, KaTeXRenderer → zwykły tekst; w Powtorka render `pytanie.tekst` jeśli obecne (ta sama ramka).

- [ ] **Step 4: App.jsx — pełny router**

Dodaj stany `dzial`/`zadanie-otwarte`/`powtorka` (wzorzec z matematyki: zapis `postepy.dzialy`, `nowaPowtorka` po ukończeniu działu, aktualizacja planu).

- [ ] **Step 5: Testy + build + smoke**

```bash
cd "repetytorium - j_angielski/app" && npm test && npm run build
```

Dev → golden path: dashboard → dział Funkcje → quiz (błędna odpowiedź → pauza + wskazówka + „Dalej"; poprawne → auto) → ≥80% → zadanie otwarte (wpisz wariant z `akceptowane` — zaliczone) → dashboard z powtórką „Na dziś". Konsola 0 errors. Zabij server.

- [ ] **Step 6: Commit**

```bash
git add "repetytorium - j_angielski/app/src/ui" "repetytorium - j_angielski/app/src/App.jsx"
git commit -m "feat(eng): Dzial + ZadanieOtwarte + Powtorka + pełny router (it.1 T5)"
```

---

## Task 6: QA końcowe + docs

**Files:**
- Modify: `repetytorium - j_angielski/STAN-PROJEKTU.md` (sekcje 2–4, 7–8 — nowy model!), `repetytorium - j_angielski/LESSONS.md`
- Run: testy, build, dev, przeglądarka

**Interfaces:**
- Consumes: cała apka z T1–T5
- Produces: potwierdzone DoD it.1, docs odzwierciedlające decyzję SPA

- [ ] **Step 1: Testy + build**

```bash
cd "repetytorium - j_angielski/app" && npm test && npm run build
```

- [ ] **Step 2: QA desktop — pełny golden path**

Świeży profil → diagnoza 6 pytań (2×3 działy; teksty czytania w ramce) →
dashboard 3 karty → dział Czytanie: quiz (c1–c5, poprawne odpowiedzi z JSON;
jedna odpowiedź celowo błędna → pauza + wskazówka + „Dalej") → zadanie otwarte:
- co1 k1: wpisz `Tuesday` (wariant 2) → zaliczone; k2: wpisz `czternaście` → odrzucone, potem `14` → zaliczone
- lub co2 analogicznie (`bicycle` jako wariant)
→ powtórka na dashboardzie („Na dziś") → sesja powtórki działa.
Dodatkowo dział Środki: so1 k2 wpisz `DOES NOT` (case-insensitive, wariant 2) → zaliczone.
Konsola: 0 errors.

- [ ] **Step 3: QA mobile 390×844**

Diagnoza z tekstem czytania + quiz z pauzą — czytelne, bez poziomego scrolla.

- [ ] **Step 4: Aktualizacja STAN-PROJEKTU.md (angielski)**

To duża zmiana modelu — przepisz:
1. Nagłówek: `2026-08-06, po sesji it.1 (SPA React — scaffold + 3 działy tekstowe; decyzja architektoniczna z §7.3 rozstrzygnięta)`
2. Sekcja 2 „Model projektu": **SPA React jak matematyka** (wzorzec z `repetytorium - matematyka/app/`); model skillowy HTML-per-uczeń NIE jest realizowany — skill i reference pozostają jako źródło treści i metodyki
3. Sekcja 3 „Stack": Vite+React 19 bez TS, content JSON → core → storage → ui, klucz `rep:postepy:{uuid}:angielski`, port 5175, bez KaTeX, deploy Vercel — przyszła iteracja
4. Sekcja 4: tabela stanu — dodaj it.1 (scaffold, 3 działy: funkcje/czytanie/srodki po 2+5+2, diagnoza, dashboard, pełny cykl nauki)
5. Sekcja 7 „Kolejne kroki": it.2 = Słuchanie (TTS Web Speech API), it.3 = Wypowiedź pisemna (tryb prowadzony + samoocena wg kryteriów CKE), potem egzamin próbny + statystyki + deploy + Hub
6. Sekcja 8 „Jak zacząć nową sesję": zaktualizuj pod nowy model (dev server, STAN, LESSONS)

- [ ] **Step 5: Wpis LESSONS.md (angielski)**

`## 2026-08-06 (it.1 — scaffold SPA + 3 działy tekstowe)` — obserwacje
(m.in.: co z wzorca matematyki przeniosło się wprost, a co wymagało adaptacji —
`sprawdzKrok` z `akceptowane`, pole `tekst`, brak KaTeX; wnioski z QA).
Zakończ `Zmiana w skilu: ...`.

- [ ] **Step 6: Commit końcowy**

```bash
git add "repetytorium - j_angielski/STAN-PROJEKTU.md" "repetytorium - j_angielski/LESSONS.md"
git commit -m "docs(eng): STAN-PROJEKTU + LESSONS — it.1 ukończona (SPA, 3 działy)"
```
