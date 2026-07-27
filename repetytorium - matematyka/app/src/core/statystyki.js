/**
 * Statystyki postępu — czysta logika agregacji, zero DOM/importów treści.
 * Etykiety i kolejność działów buduje UI z rejestru i podaje argumentami.
 * (Adaptacja core/statystyki.js z repetytorium-polski do struktur matematyki.)
 */

/** Chronologiczna seria procentowych wyników sesji (diagnoza, działy, egzaminy; bez powtórek — inna skala). */
export function seriaWynikow(postepy, mapaEtykiet = {}) {
  const punkty = [];
  for (const s of postepy.sesje ?? []) {
    if (s.typ === "diagnoza" && postepy.diagnoza) {
      const ratio = Object.values(postepy.diagnoza);
      if (ratio.length > 0) {
        punkty.push({
          data: s.data,
          procent: Math.round((100 * ratio.reduce((a, b) => a + b, 0)) / ratio.length),
          typ: "diagnoza",
          etykieta: "Test wstępny",
        });
      }
    }
    if (s.typ === "dzial" && typeof s.wynik === "number") {
      punkty.push({
        data: s.data,
        procent: Math.round(s.wynik * 100),
        typ: "dzial",
        etykieta: `Dział: ${mapaEtykiet[s.dzialId] ?? s.dzialId}`,
      });
    }
    if (s.typ === "egzamin" && s.maksPkt > 0) {
      punkty.push({
        data: s.data,
        procent: Math.round((100 * s.wynikPkt) / s.maksPkt),
        typ: "egzamin",
        etykieta: "Egzamin próbny",
      });
    }
  }
  return punkty.sort((a, b) => a.data.localeCompare(b.data));
}

/**
 * Postęp per dział: % z diagnozy vs "teraz".
 * "Teraz" = wynik quizu działu, a gdy brak — wynik działu z ostatniego egzaminu,
 * a gdy brak — diagnoza (bez nowych danych delta = 0).
 * @param {string[]} kolejnosc — lista dzialId (z rejestru, buduje UI)
 */
export function postepPerDzial(postepy, kolejnosc) {
  const egzaminy = postepy.egzaminy ?? [];
  const ostatniEgzamin = egzaminy[egzaminy.length - 1];
  return Object.fromEntries(
    kolejnosc.map((id) => {
      const diagnoza = Math.round((postepy.diagnoza?.[id] ?? 0) * 100);
      const zDzialu = postepy.dzialy?.[id]?.wynik;
      const zEgzaminu = ostatniEgzamin?.perDzial?.[id];
      const teraz =
        typeof zDzialu === "number" ? Math.round(zDzialu * 100)
        : zEgzaminu?.maks ? Math.round((100 * zEgzaminu.pkt) / zEgzaminu.maks)
        : diagnoza;
      return [id, { diagnoza, teraz, delta: teraz - diagnoza }];
    })
  );
}

const dzienISO = (d) => d.toISOString().slice(0, 10);

/** Regularność: sesje per tydzień (8 ostatnich, pn-nd) + seria dni z rzędu. */
export function aktywnosc(postepy, dzis = new Date()) {
  const sesje = postepy.sesje ?? [];
  const dniZSesja = new Set(sesje.map((x) => x.data.slice(0, 10)));

  const kursor = new Date(dzis);
  if (!dniZSesja.has(dzienISO(kursor))) kursor.setUTCDate(kursor.getUTCDate() - 1);
  let seriaDni = 0;
  while (dniZSesja.has(dzienISO(kursor))) {
    seriaDni++;
    kursor.setUTCDate(kursor.getUTCDate() - 1);
  }

  const poniedzialek = new Date(dzis);
  poniedzialek.setUTCDate(poniedzialek.getUTCDate() - ((poniedzialek.getUTCDay() + 6) % 7));
  const tygodnie = [];
  for (let i = 7; i >= 0; i--) {
    const od = new Date(poniedzialek);
    od.setUTCDate(od.getUTCDate() - 7 * i);
    const koniec = new Date(od);
    koniec.setUTCDate(koniec.getUTCDate() + 6);
    const [odISO, koniecISO] = [dzienISO(od), dzienISO(koniec)];
    tygodnie.push({
      od: odISO,
      liczba: sesje.filter((x) => {
        const d = x.data.slice(0, 10);
        return d >= odISO && d <= koniecISO;
      }).length,
    });
  }
  return { tygodnie, seriaDni };
}

/** Pokrycie materiału: ukończone działy X z Y + liczba egzaminów próbnych. */
export function pokrycie(postepy, liczbaDzialow) {
  const ukonczone = Object.values(postepy.dzialy ?? {}).filter((s) => s.ukonczone).length;
  return {
    dzialy: { zrobione: ukonczone, wszystkie: liczbaDzialow },
    egzaminy: (postepy.egzaminy ?? []).length,
  };
}
