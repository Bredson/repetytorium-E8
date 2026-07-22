# SPEC — Faza 1 / iteracja 16: Publikacja dla testerów (Vercel)

Data: 2026-07-22 · Bazuje na: stan po it. 15 (`STAN-PROJEKTU.md`)

## Cel iteracji

Aplikacja dostępna publicznie przez WWW dla testerów — auto-deploy z GitHuba
przy każdym pushu na `main`. Zero zmian w kodzie aplikacji (SPA + localStorage
nie potrzebuje backendu).

## Decyzje (ustalone z użytkownikiem)

- **Hosting: Vercel** (plan darmowy), integracja z GitHub — auto-deploy z `main`,
  preview dla gałęzi.
- **Dostęp: publiczny URL** (`*.vercel.app`) — bez ochrony hasłem; appka ma
  profile z PIN-em, dane testerów żyją w ich localStorage.
- **Repo zostaje publiczne** — użytkownik świadomie akceptuje obecność danych
  uczennicy (imię, PIN, wyniki diagnozy) w dokumentacji repo.

## Zakres

### 1. Konfiguracja w repo

- `app/vercel.json`: rewrite SPA (`/(.*)` → `/index.html`) + `github.silent: true`.
- **Bez zmian w `vite.config.js`** — Vercel serwuje z korzenia domeny,
  domyślne `base: "/"` poprawne.

### 2. Smoke-test builda produkcyjnego (przed podpięciem Vercel)

`npm run build && npm run preview` → przeklikanie: utworzenie profilu
testowego → PIN → diagnoza (start) → powrót; wejście w statystyki z profilu
testowego. QA dotąd było wyłącznie na dev serwerze — to pierwsza weryfikacja
builda produkcyjnego w przeglądarce. Profil testowy po sprawdzeniu usunąć
(localStorage preview jest lokalny, więc wystarczy wyczyścić klucze `rep:`).

### 3. Podpięcie Vercel (kroki użytkownika — instrukcja w planie)

1. vercel.com → Sign Up przez GitHub (konto Bredson)
2. Add New → Project → import `Bredson/repetytorium-E8`
3. **Root Directory** = `repetytorium - j_polski/app` (framework Vite
   wykryty automatycznie: build `npm run build`, output `dist`)
4. Deploy → publiczny URL (nazwa projektu do wyboru użytkownika)

### 4. Weryfikacja po deployu + materiał dla testerów

- Przejście po opublikowanym URL: nowy profil, PIN, start diagnozy,
  localStorage działa, mobile (przeglądarka w trybie responsive).
- `TESTERZY.md` w `repetytorium - j_polski/`: co to jest, jak zacząć
  (profil + PIN), jak zgłaszać uwagi, jak eksportować/importować postępy
  (ochrona przed utratą danych przy czyszczeniu przeglądarki).
- Aktualizacja `STAN-PROJEKTU.md` (it. 16, URL produkcyjny, procedura deploy)
  i wpis w `LESSONS.md`.

## Poza zakresem (YAGNI)

Własna domena, ochrona hasłem (płatna w Vercel), analityka/monitoring,
migracja do Supabase, code-splitting (warning chunka nie blokuje deployu).

## Kryteria ukończenia

1. Publiczny URL działa: pełna ścieżka nowego użytkownika (profil → diagnoza)
   na desktop i mobile.
2. Push na `main` wyzwala automatyczny deploy.
3. `TESTERZY.md` w repo, STAN-PROJEKTU/LESSONS zaktualizowane.
