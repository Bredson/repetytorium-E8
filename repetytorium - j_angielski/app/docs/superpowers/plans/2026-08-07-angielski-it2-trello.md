# Trello — angielski it.2 Słuchanie (TTS)

> Karty do tablicy Trello. Jedna karta = jeden task z planu
> `2026-08-07-angielski-it2-sluchanie.md`.

---

## T1 — Komponent OdtwarzaczTTS

**Cel:** Odtwarzacz Web Speech API: ▶ + licznik odtworzeń (ostrzeżenie po 2), głosy en-GB→en-US→en-*, `voiceschanged`, tempo 0.95 / 🐢 0.8, dialogi osobnymi utterance (2 głosy), transkrypcja po odpowiedzi, fallback bez TTS → komunikat PL + transkrypcja, `cancel()` przy unmount
**Pliki:** `src/ui/components/OdtwarzaczTTS.jsx` (nowy)
**Done:** build ✓ → commit

---

## T2 — Treść: sluchanie.json + rejestr + kolor D

**Cel:** Dział Słuchanie (moduł D): 2 diagnoza + 5 MC + 2 otwarte, każde z polem `nagranie` (monolog lub dialog); pułapki word-spotting i parafrazy (priorytety CKE)
**Pliki:** `src/content/angielski/dzialy/sluchanie.json`, `rejestr.js`, `Start.jsx` (kolor D)
**Done:** walidacja python ✓, build ✓ → commit

---

## T3 — Integracja playera w 4 ekranach

**Cel:** Player przy pytaniach z `nagranie` w Dzial (transkrypcja po feedbacku), TestWstepny (bez transkrypcji), Powtorka, ZadanieOtwarte (transkrypcja po ukończeniu kroków); `key={pytanie.id}` resetuje stan między pytaniami
**Pliki:** `src/ui/pages/{Dzial,TestWstepny,Powtorka,ZadanieOtwarte}.jsx`
**Done:** `npm test` + build ✓, smoke ✓ → commit

---

## T4 — QA + docs

**Cel:** DoD it.2 (poza ręcznym odsłuchem)
**Pliki:** `STAN-PROJEKTU.md`, `LESSONS.md`
**Kroki:** testy+build → QA fallback (diagnoza 8 pytań, dział, otwarte) → QA instrumentacja speak (3 kwestie dialogu, rate 0.95/0.8, naprzemienne głosy, ostrzeżenie po 2, transkrypcja) → QA mobile → STAN + LESSONS (zaznaczyć: dźwięk czeka na ręczny odsłuch) → commit
**Done:** QA ✓, konsola 0 errors, docs, commit

---

## Krok ręczny (użytkownik) — odsłuch TTS

**Cel:** Potwierdzenie w prawdziwej przeglądarce: dźwięk działa, tempo OK, 🐢 wolniej działa, głosy dialogu się różnią
**Done:** wynik odnotowany w LESSONS (następna sesja lub od razu po deployu iteracji)
