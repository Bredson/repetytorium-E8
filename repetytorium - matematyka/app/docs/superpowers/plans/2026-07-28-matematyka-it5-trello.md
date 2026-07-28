# Trello — it.5 Rozbudowa puli zadań

> Karty do tablicy Trello. Jedna karta = jeden task z planu.

---

## T1 — liczby.json: +2 zamknięte + 1 otwarte

**Cel:** Rozbudowa działu "Liczby i działania" do 5 zamkniętych + 2 otwarte  
**Pliki:** `src/content/matematyka/dzialy/liczby.json`  
**Dodane zadania:** l4 (NWW), l5 ((-2)³), lo2 (liczby pierwsze między 10 a 30 — 2-krokowe)  
**Done:** `python3 json.load` ✓ → 5 zamkniętych, 2 otwarte → commit

---

## T2 — ulamki.json: +2 zamknięte + 1 otwarte

**Cel:** Rozbudowa działu "Ułamki zwykłe i dziesiętne" do 5 zamkniętych + 2 otwarte  
**Pliki:** `src/content/matematyka/dzialy/ulamki.json`  
**Dodane zadania:** u4 (dzielenie ułamków), u5 (zamiana na dziesiętny), uo2 (1¾ + 2½ — 2-krokowe)  
**Done:** `python3 json.load` ✓ → 5 zamkniętych, 2 otwarte → commit

---

## T3 — potegi.json: +2 zamknięte + 1 otwarte

**Cel:** Rozbudowa działu "Potęgi i pierwiastki" do 5 zamkniętych + 2 otwarte  
**Pliki:** `src/content/matematyka/dzialy/potegi.json`  
**Dodane zadania:** p4 (dzielenie potęg), p5 (4⁰ + 2⁻¹), po2 ((2³)² · 2⁻⁴ — 2-krokowe)  
**Done:** `python3 json.load` ✓ → 5 zamkniętych, 2 otwarte → commit

---

## T4 — procenty.json: +2 zamknięte + 1 otwarte

**Cel:** Rozbudowa działu "Procenty" do 5 zamkniętych + 2 otwarte  
**Pliki:** `src/content/matematyka/dzialy/procenty.json`  
**Dodane zadania:** pr4 (wzrost 20% + spadek 20%), pr5 (15% z 80), pro2 (80% z 25 uczniów)  
**Done:** `python3 json.load` ✓ → 5 zamkniętych, 2 otwarte → commit

---

## T5 — algebra.json: +2 zamknięte + 1 otwarte

**Cel:** Rozbudowa działu "Wyrażenia algebraiczne" do 5 zamkniętych + 2 otwarte  
**Pliki:** `src/content/matematyka/dzialy/algebra.json`  
**Dodane zadania:** a4 ((x+2)(x-2)), a5 (wartość 5a-3b), ao2 (wyłącz 3x, oblicz dla x=1 — 2-krokowe)  
**Done:** `python3 json.load` ✓ → 5 zamkniętych, 2 otwarte → commit

---

## T6 — rownania.json: +2 zamknięte + 1 otwarte

**Cel:** Rozbudowa działu "Równania" do 5 zamkniętych + 2 otwarte  
**Pliki:** `src/content/matematyka/dzialy/rownania.json`  
**Dodane zadania:** r4 (2x+5=13), r5 (x/3-1=4), ro2 (układ równań x+y=7, x-y=1 — 2-krokowe)  
**Done:** `python3 json.load` ✓ → 5 zamkniętych, 2 otwarte → commit

---

## T7 — geometria-plaska.json: +2 zamknięte + 1 otwarte

**Cel:** Rozbudowa działu "Geometria płaska" do 5 zamkniętych + 2 otwarte  
**Pliki:** `src/content/matematyka/dzialy/geometria-plaska.json`  
**Dodane zadania:** gp4 (obwód kwadratu), gp5 (pole trójkąta), gpo2 (prostokąt obwód→pole — 2-krokowe)  
**Done:** `python3 json.load` ✓ → 5 zamkniętych, 2 otwarte → commit

---

## T8 — pitagoras.json: +2 zamknięte + 1 otwarte

**Cel:** Rozbudowa działu "Twierdzenie Pitagorasa" do 5 zamkniętych + 2 otwarte  
**Pliki:** `src/content/matematyka/dzialy/pitagoras.json`  
**Dodane zadania:** pi4 (czy trójkąt 5-12-13 prostokątny?), pi5 (przekątna kwadratu), pio2 (drabina 5m — 2-krokowe)  
**Done:** `python3 json.load` ✓ → 5 zamkniętych, 2 otwarte → commit

---

## T9 — geometria-przestrzenna.json: +2 zamknięte + 1 otwarte

**Cel:** Rozbudowa działu "Geometria przestrzenna" do 5 zamkniętych + 2 otwarte  
**Pliki:** `src/content/matematyka/dzialy/geometria-przestrzenna.json`  
**Dodane zadania:** gs4 (objętość sześcianu), gs5 (pole pp 2×3×4), gso2 (walec r=3 h=5 — 2-krokowe)  
**Done:** `python3 json.load` ✓ → 5 zamkniętych, 2 otwarte → commit

---

## T10 — Weryfikacja końcowa + QA

**Cel:** Globalny raport puli + QA w przeglądarce + build  
**Pliki:** STAN-PROJEKTU.md, LESSONS.md  
**Kroki:**
- Skrypt Python: 45 zamkniętych, 18 otwartych (każdy dział ✓)
- Dev server → QA LaTeX w każdym nowym dziale (0 errors w konsoli)
- 2× Egzamin Próbny → zestawy różne (wariantywność)
- `npm run build` ✓
- STAN-PROJEKTU.md + LESSONS.md → commit
**Done:** build ✓ → QA ✓ → docs zaktualizowane → commit
