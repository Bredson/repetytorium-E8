# Trello — iteracja 16: Publikacja dla testerów (Vercel)

> Karty do tablicy. Kolejność = zależności. Karta 2 jest po stronie użytkownika!
> Źródło: `PLAN-FAZA-1-IT16.md` · Spec: `SPEC-FAZA-1-IT16.md`

---

## Karta 1/3 — vercel.json + smoke-test builda produkcyjnego

**Opis:**
Konfiguracja Vercel w repo: `app/vercel.json` (rewrite SPA → index.html, silent GitHub). Pierwszy test builda produkcyjnego w przeglądarce: `npm run build && npm run preview` → utworzenie profilu testowego, wejście w diagnozę, czysta konsola, sprzątnięcie localStorage.

**Checklista:**
- [ ] `vercel.json` utworzony
- [ ] Build ✓ (warning chunka OK)
- [ ] Smoke-test na preview: profil → PIN → diagnoza startuje
- [ ] Stan testowy wyczyszczony
- [ ] Commit `It. 16 (1/3)` + push

---

## Karta 2/3 — Podpięcie Vercel (⚠️ ręcznie: Piotr)

**Opis:**
Założenie konta Vercel (login przez GitHub `Bredson`), import repo `repetytorium-E8`, **Root Directory = `repetytorium - j_polski/app`** (kluczowe!), framework Vite (auto), Deploy. Wynik: produkcyjny URL `https://<projekt>.vercel.app`.

**Checklista:**
- [ ] Konto Vercel przez GitHub
- [ ] Import repo + Root Directory ustawiony
- [ ] Pierwszy deploy zielony
- [ ] URL przekazany do karty 3

---

## Karta 3/3 — Weryfikacja produkcji + TESTERZY.md + domknięcie

**Opis:**
QA na produkcyjnym URL (HTTPS, rewrite SPA przy odświeżeniu, profil+PIN+localStorage na domenie vercel.app, mobile 390×844). `TESTERZY.md` — instrukcja startowa dla testerów (jak zacząć, ochrona postępów przez eksport, jak zgłaszać uwagi). Aktualizacja STAN-PROJEKTU.md (URL produkcyjny, procedura deploy) i LESSONS.md. Push + potwierdzenie, że auto-deploy ruszył.

**Checklista:**
- [ ] QA na produkcji ✓ (desktop + mobile)
- [ ] TESTERZY.md z prawdziwym URL-em
- [ ] STAN-PROJEKTU.md + LESSONS.md zaktualizowane
- [ ] Commit `It. 16 (3/3)` + push
- [ ] Auto-deploy po pushu potwierdzony
