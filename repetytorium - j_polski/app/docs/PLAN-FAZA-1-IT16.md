# Publikacja dla testerów — Vercel (it. 16) — plan implementacji

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aplikacja repetytorium dostępna publicznie na `*.vercel.app` z auto-deployem przy pushu na `main` + materiał startowy dla testerów.

**Architecture:** Zero zmian w kodzie aplikacji. Jeden plik konfiguracyjny (`vercel.json`), smoke-test builda produkcyjnego lokalnie, ręczne podpięcie Vercel przez użytkownika (checkpoint), weryfikacja na produkcyjnym URL i dokumentacja dla testerów.

**Tech Stack:** Vercel (hosting statyczny, plan darmowy, integracja GitHub), Vite build, Playwright MCP do weryfikacji w przeglądarce.

## Global Constraints

- Spec: `app/docs/SPEC-FAZA-1-IT16.md`; katalog appki: `repetytorium - j_polski/app/`
- Zero zmian w `vite.config.js` (Vercel serwuje z korzenia — `base: "/"` domyślne, poprawne) i w kodzie `src/`
- Komunikacja w plikach dla testerów: po polsku, przyjaźnie, konkretnie
- Git root: `/Users/pibe/dev/Repetytorium-doc`; `git add` zawsze jawnymi ścieżkami (nietrackowane katalogi-siostry)
- Vercel: Root Directory = `repetytorium - j_polski/app`, framework preset Vite (build `npm run build`, output `dist`)
- Playwright MCP ma izolowany profil przeglądarki — dane Zosi w realnym Chrome są poza zasięgiem; profil testowy tworzony w QA żyje tylko w kontekście Playwright (LESSONS it. 15)

---

### Task 1: `vercel.json` + smoke-test builda produkcyjnego

**Files:**
- Create: `repetytorium - j_polski/app/vercel.json`
- Test: ręczny przebieg w przeglądarce na `npm run preview` (Playwright MCP)

**Interfaces:**
- Produces: `vercel.json` gotowy do wykrycia przez Vercel przy imporcie (Task 2); potwierdzenie, że build produkcyjny działa w przeglądarce

- [ ] **Step 1: Utwórz `vercel.json`**

Zawartość `repetytorium - j_polski/app/vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "github": { "silent": true }
}
```

- [ ] **Step 2: Build produkcyjny + preview**

Run: `cd "/Users/pibe/dev/Repetytorium-doc/repetytorium - j_polski/app" && npm run build`
Expected: build ✓ (znany warning chunka >500 kB — akceptowalny).

Run w tle: `npm run preview` → serwer na `http://localhost:4173`.

- [ ] **Step 3: Smoke-test w przeglądarce (Playwright MCP)**

Na `http://localhost:4173`:
1. Ekran startowy renderuje się (wybór/tworzenie profilu — Playwright ma czysty localStorage, więc zobaczy ekran nowego profilu)
2. Utwórz profil testowy: imię `Tester`, PIN `9999` (inputy przez natywny setter + dispatchEvent — procedura z LESSONS)
3. Po zalogowaniu: karta „Krok 1: test wstępny" widoczna → kliknij „Zaczynam test wstępny" → pierwsze pytanie diagnozy się renderuje → wróć (przerwij)
4. Sprawdź brak błędów w konsoli przeglądarki (poza ewentualnymi ostrzeżeniami dev-tools)
5. Wyczyść stan testowy: `localStorage` — usuń wszystkie klucze zaczynające się od `rep:`
6. Zatrzymaj serwer preview

Expected: pełna ścieżka bez błędów — build produkcyjny działa.

- [ ] **Step 4: Commit + push**

```bash
cd /Users/pibe/dev/Repetytorium-doc
git add "repetytorium - j_polski/app/vercel.json"
git commit -m "It. 16 (1/3): vercel.json — rewrite SPA + silent GitHub; smoke-test builda prod"
git push
```

(Push nie wyzwala jeszcze deployu — Vercel podpinany w Task 2.)

---

### Task 2: Podpięcie Vercel — CHECKPOINT UŻYTKOWNIKA

**Files:** brak (klikanie w dashboardzie Vercel)

**Interfaces:**
- Consumes: repo z `vercel.json` na `main` (Task 1)
- Produces: produkcyjny URL `https://<projekt>.vercel.app` — potrzebny w Task 3

**To zadanie wykonuje UŻYTKOWNIK.** Kontroler przekazuje instrukcję, czeka na URL i potwierdzenie.

- [ ] **Step 1: Instrukcja dla użytkownika**

1. Wejdź na `https://vercel.com/signup` → **Continue with GitHub** (konto `Bredson`) → autoryzuj Vercel
2. W dashboardzie: **Add New… → Project** → przy repo `Bredson/repetytorium-E8` kliknij **Import** (jeśli repo nie jest widoczne: „Adjust GitHub App Permissions" i nadaj dostęp do tego repo)
3. W konfiguracji projektu:
   - **Root Directory** → kliknij **Edit** → wybierz/wpisz `repetytorium - j_polski/app` ← **najważniejsze ustawienie**
   - Framework Preset: powinno samo wykryć **Vite** (Build `npm run build`, Output `dist` — zostaw domyślne)
   - Project Name: dowolna (np. `repetytorium-e8`) — będzie częścią URL
4. Kliknij **Deploy** → poczekaj ~1-2 min → skopiuj URL produkcyjny (np. `https://repetytorium-e8.vercel.app`)

- [ ] **Step 2: Użytkownik podaje URL produkcyjny**

Kontroler zapisuje URL — wejście do Task 3.

---

### Task 3: Weryfikacja produkcji + TESTERZY.md + domknięcie iteracji

**Files:**
- Create: `repetytorium - j_polski/TESTERZY.md`
- Modify: `repetytorium - j_polski/STAN-PROJEKTU.md`, `repetytorium - j_polski/LESSONS.md`

**Interfaces:**
- Consumes: produkcyjny URL z Task 2 (dalej `<URL>`)

- [ ] **Step 1: Weryfikacja na produkcji (Playwright MCP)**

Na `<URL>`:
1. Ekran startowy się renderuje (HTTPS, brak błędów konsoli)
2. Odśwież stronę na ścieżce innej niż `/` — rewrite SPA działa (brak 404)
3. Utwórz profil `Tester` PIN `9999` → zaloguj → karta testu wstępnego widoczna → localStorage działa na domenie vercel.app
4. Viewport 390x844 → strona bez poziomego scrolla (`scrollWidth === innerWidth`)
5. Wyczyść klucze `rep:` z localStorage

Expected: wszystko ✓. Jeśli COKOLWIEK nie działa — STOP, raport BLOCKED z detalami (nie naprawiać kodu appki na własną rękę).

- [ ] **Step 2: Napisz `repetytorium - j_polski/TESTERZY.md`**

```markdown
# Repetytorium ósmoklasisty — informacje dla testerów

Cześć! Testujesz aplikację do nauki języka polskiego przed egzaminem
ósmoklasisty (2027). Dziękujemy — każda uwaga się liczy. 🙂

## Jak zacząć

1. Wejdź na: **<URL>**
2. Kliknij „Nowy profil" — podaj imię i 4-cyfrowy PIN (zapamiętaj go!)
3. Zrób test wstępny (~20-25 min) — to diagnoza, nie sprawdzian; na jej
   podstawie aplikacja ułoży Twój plan nauki
4. Wracaj codziennie — sekcja „Na dziś" podpowiada, co robić

## Ważne: Twoje postępy

- Postępy zapisują się **w Twojej przeglądarce** (nie na serwerze).
  Używaj tej samej przeglądarki na tym samym urządzeniu.
- **Nie czyść danych przeglądarki** dla tej strony — stracisz postępy.
- Raz na jakiś czas kliknij „Zapisz postępy do pliku" (na dole ekranu
  głównego) — to kopia zapasowa. Plik można wgrać z powrotem na ekranie
  wyboru profilu („Wczytaj z pliku").

## Co testować

Wszystko! W szczególności: test wstępny, lektury (kompendium + quiz),
ćwiczenia, formy pisemne, powtórki, egzamin próbny (150 min — na spokojnie),
statystyki postępu. Na telefonie i na komputerze.

## Jak zgłaszać uwagi

Wszystko, co Cię zaskoczy, zirytuje albo nie zadziała — zapisz:
- co robiłeś/aś (krok po kroku),
- co się stało, a czego się spodziewałeś/aś,
- na jakim urządzeniu/przeglądarce.

Uwagi wysyłaj do Piotra (lub issue na GitHubie:
https://github.com/Bredson/repetytorium-E8/issues).
```

(W miejsce `<URL>` wstaw rzeczywisty URL z Task 2.)

- [ ] **Step 3: Aktualizacja STAN-PROJEKTU.md i LESSONS.md**

`STAN-PROJEKTU.md`:
- nagłówek: „po iteracji 16" + data
- tabela iteracji: wiersz 16 — „Publikacja Vercel: vercel.json, auto-deploy z main, TESTERZY.md"
- sekcja 2 (Stack): dopisz linię „**Produkcja:** <URL> (Vercel, auto-deploy z `main`, Root Directory `repetytorium - j_polski/app`)"
- sekcja 5 (backlog): usuń/odhacz punkt o publikacji, jeśli jest; dopisz „monitoring uwag testerów" jako nowy punkt
- sekcja 6: dopisz procedurę „deploy = push na main; podgląd deployów: dashboard Vercel"

`LESSONS.md` — nowy wpis `## 2026-07-22 (Faza 1 / iteracja 16: publikacja Vercel)` w formacie istniejących wpisów (obserwacje: konfiguracja/deploy, QA na produkcji; zakończ „- Zmiana w skilu: nie (wnioski zapisane tutaj).").

- [ ] **Step 4: Commit + push + weryfikacja auto-deployu**

```bash
cd /Users/pibe/dev/Repetytorium-doc
git add "repetytorium - j_polski/TESTERZY.md" "repetytorium - j_polski/STAN-PROJEKTU.md" "repetytorium - j_polski/LESSONS.md"
git commit -m "It. 16 (3/3): TESTERZY.md + STAN-PROJEKTU + LESSONS — publikacja domknięta"
git push
```

Po pushu: sprawdź (dashboard Vercel lub odświeżenie `<URL>` po ~2 min), że deploy wystartował automatycznie — to potwierdza kryterium ukończenia #2 ze specu. (Ta zmiana nie dotyka `app/`, ale Vercel i tak buduje projekt przy każdym pushu na main — sam start builda wystarczy jako dowód integracji.)

Expected: deploy automatyczny ✓.

---

## Self-review (wykonany)

- **Pokrycie specu:** vercel.json+smoke→T1, podpięcie Vercel→T2, weryfikacja+TESTERZY.md+dokumentacja→T3; kryteria ukończenia: #1→T3.1, #2→T3.4, #3→T3.2-3. ✓
- **Placeholdery:** `<URL>` jest jawnym parametrem przekazywanym z Task 2 do Task 3 (nie placeholderem do „uzupełnienia później" w sensie zakazanym — wartość powstaje w trakcie wykonania). Poza tym brak. ✓
- **Spójność:** nazwy plików i ścieżki jednolite między taskami; Root Directory identyczny w T2 i Global Constraints. ✓
