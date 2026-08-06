# Trello — it.7 UX quizu: pauza po błędzie + fixy KaTeX

> Karty do tablicy Trello. Jedna karta = jeden task z planu
> `2026-08-06-matematyka-it7-ux-quizu.md`.

---

## T1 — Dzial.jsx: pauza po błędnej odpowiedzi + wskazówka przez KaTeX

**Cel:** Po błędnej odpowiedzi quiz zatrzymuje się (wskazówka KaTeX + „Przypomnij" rozwinięte + przycisk „Dalej") zamiast auto-przejścia po 1 s; poprawna odpowiedź bez zmian (auto po 1 s)
**Pliki:** `src/ui/pages/Dzial.jsx`
**Zmiany:** `wybierz()` ustawia timer tylko przy poprawnej; nowa funkcja `dalej()`; `<details open>` po błędzie; `wskazowka` przez `KaTeXRenderer`; przycisk „Dalej"
**Done:** `npm test` + build ✓ → smoke w przeglądarce (błędna → pauza+Dalej; poprawna → auto) → commit

---

## T2 — KrokZadania.jsx: delimitery `$...$` w feedbacku kroku (fix gpo2)

**Cel:** Feedback „Dobrze!" kroku z jednostką renderuje KaTeX zamiast surowego `8 \text{ cm}`
**Pliki:** `src/ui/components/KrokZadania.jsx`
**Zmiany:** jedna linia — opakowanie template stringa w `$...$`
**Done:** build ✓ → weryfikacja kroku z jednostką w przeglądarce → commit

---

## T3 — QA końcowe + docs

**Cel:** Potwierdzić DoD it.7 i domknąć iterację
**Pliki:** `STAN-PROJEKTU.md`, `LESSONS.md`
**Kroki:** `npm test` + build → QA desktop (błędna w środku i na końcu quizu, wskazówka z LaTeX-em np. u5, krok z jednostką) → QA mobile 390×844 → sanity egzaminu (bez regresji) → aktualizacja STAN-PROJEKTU (sekcja it.7, „Jak zacząć" → it.8) → wpis LESSONS → commit
**Done:** wszystkie QA ✓, konsola 0 errors, docs zaktualizowane, commit
