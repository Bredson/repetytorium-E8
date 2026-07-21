# DESIGN — Repetytorium Ósmoklasisty

Design system w `app/src/ui/theme.css`. Import w React: `import "./ui/theme.css"`.

## Filozofia

Aplikacja dla 14-15-latka przygotowującego się do egzaminu — czyli osoby pod presją.
Interfejs ma **obniżać napięcie, nie dokładać bodźców**: dużo światła, jedna rzecz
na ekranie, wyraźna typografia, zero infantylnych ozdobników i zero "dashboardu
korporacyjnego". Wzorce: Duolingo (postęp jako bohater ekranu, mikro-nagrody
z umiarem) i Notion (spokój, czytelność, neutralne powierzchnie).

## Paleta i uzasadnienie psychologiczne

| Token | Kolor (jasny) | Dlaczego |
|---|---|---|
| `--kolor-akcent` | indygo `#4f6df5` | Kojarzony ze skupieniem i zaufaniem; energiczny, ale nie krzykliwy. Ciągłość z materiałami HTML projektu. |
| `--kolor-sukces` | zieleń `#2e9e5b` | Ciepła, przygaszona zieleń — nagroda bez neonowego "kasyna". |
| `--kolor-uwaga` | bursztyn `#c98a1b` | **Zamiast czerwieni.** Błąd = informacja do nauki, nie kara. Czerwień u nastolatka pod presją wywołuje reakcję unikania; bursztyn mówi "tu popracujemy". |
| `--kolor-tekst` | `#1d2433` | Prawie-czarny na `#f7f8fb` — wysoki kontrast bez ostrości czystego #000. |
| `--modul-a…f` | 6 rozróżnialnych barw o zbliżonej saturacji | Uczeń buduje mapę mentalną modułów po kolorze; równa saturacja = żaden moduł nie wygląda na "ważniejszy" ani "gorszy". |

Dark mode (`[data-theme="dark"]`): te same relacje, jaśniejsze akcenty dla kontrastu,
powierzchnie granatowo-szare (nie czysta czerń — mniejszy efekt halo przy tekście).

## Layout ekranów Fazy 0

Wspólne: kontener `.tresc` (max 680px, wycentrowany), mobile-first od 375px,
tapy min 44px (`--min-tap`), główne CTA na dole jako `.btn-primary.btn--pelny`.

1. **Wybór profilu** — pionowa lista `.karta--klikalna` (imię + pasek postępu profilu),
   na dole `.btn-ghost` "Dodaj nowy profil". PIN: `.pole--pin`, duże cyfry, autofocus.
2. **Onboarding** — jeden krok = jeden ekran (imię → PIN → data egzaminu → dysleksja).
   Bez ścian tekstu; przełącznik "mam dysleksję" natychmiast zmienia typografię
   (podgląd = zrozumienie). Ekran powitalny: jedno zdanie + jedno CTA.
3. **Quiz (jedno pytanie na ekran)** — góra: `.pasek-postepu-etykieta` ("Pytanie 7 z 18")
   + `.pasek-postepu` przyklejony u góry, zawsze widoczny. Środek: treść pytania
   (`--rozmiar-l`) + lista `.opcja` z `.opcja-litera`. Dół: "Wstecz" (`.btn-ghost`)
   i "Dalej" (`.btn-primary`). Nowe pytanie wjeżdża klasą `.ekran-wjazd`.
   W diagnozie bez feedbacku per pytanie — tylko `.opcja--wybrana`.
4. **Ekran wyniku** — kolejność: (1) ciepłe domknięcie ("Masz za sobą pierwszy krok")
   z `.celebracja`, (2) wynik ogólny, (3) wykres per moduł: wiersz = nazwa modułu +
   `.pasek-postepu` z wypełnieniem `--modul-x` + `.badge--braki/--czesciowy/--solidny`,
   (4) rozwijane wyjaśnienia "dlaczego" do pytań, (5) "Co dalej" + CTA.

## Mikrocopy motywacyjne (growth mindset)

Zasady: chwal **wysiłek i strategię**, nie osobę; błąd = dane; zawsze wskazuj następny
konkretny krok; zero zawstydzania i zero wykrzykników przy błędach.

- Zamiast "ŹLE!": **"Prawidłowa odpowiedź to B. Zobacz dlaczego — to częsta pułapka."**
- Niski wynik: **"Dzięki temu testowi wiemy dokładnie, od czego zacząć. Pierwszy cel: frazeologizmy."**
- Wysoki wynik: **"Solidna praca z lekturami — widać, że je znasz. Teraz wzmocnimy interpunkcję."**
- Domknięcie testu: **"Masz za sobą pierwszy krok. Każda odpowiedź — także ta błędna — ustawia Twój plan nauki."**
- Postęp: **"Tydzień temu: 40%. Dziś: 65%. To robi Twoja regularność."**
- Nigdy: "jesteś zdolny/słaby", porównania z innymi uczniami, "tylko 3/10".

## Dostępność

- Kontrast tekstu ≥ 4.5:1 w obu motywach; stan nigdy tylko kolorem (badge = kolor + słowo).
- `:focus-visible` — wyraźna obwódka 3px na każdym elemencie interaktywnym.
- Tryb dysleksji `[data-dysleksja="true"]`: baza 18px, interlinia 1.75,
  letter-spacing 0.04em, Verdana, wiersz max 60ch, zakaz justowania.
- `prefers-reduced-motion` wyłącza wszystkie animacje (w tym `.celebracja`).
- Fonty systemowe — brak zależności sieciowych, pełne działanie offline.
- Klasa `.sr-only` do etykiet dla czytników ekranu (np. procent paska postępu).
