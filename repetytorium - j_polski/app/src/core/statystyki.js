/**
 * Statystyki postępu — czysta logika agregacji, zero DOM/importów treści.
 * Mapy etykiet/modułów/liczebności buduje UI z rejestru i podaje argumentami.
 */

const TYPY_PUNKTOWE = {
  diagnoza: "Test wstępny",
  "quiz-lektury": "Quiz",
  "quiz-cwiczenia": "Ćwiczenie",
  pisanie: "Pisanie",
  egzamin: "Egzamin próbny",
};

/** Chronologiczna seria procentowych wyników sesji (bez powtórek/fiszek — inna skala). */
export function seriaWynikow(postepy, mapaEtykiet = {}) {
  return (postepy.sesje ?? [])
    .filter((s) => s.typ in TYPY_PUNKTOWE && s.maksPkt > 0)
    .map((s) => ({
      data: s.data,
      procent: Math.round((100 * s.wynikPkt) / s.maksPkt),
      typ: s.typ,
      etykieta: s.ref ? `${TYPY_PUNKTOWE[s.typ]}: ${mapaEtykiet[s.ref] ?? s.ref}` : TYPY_PUNKTOWE[s.typ],
    }))
    .sort((a, b) => a.data.localeCompare(b.data));
}

export const MODULY_KOLEJNOSC = ["A", "B", "C", "D", "E", "F"];

/**
 * Postęp per moduł: procent z diagnozy vs "teraz" (ostatnie wyniki materiałów
 * + ostatni egzamin, średnia ważona punktami). Bez nowych danych → teraz = diagnoza.
 * @param {object} mapaModulow — ref ćwiczenia → moduł (z rejestru, buduje UI)
 */
export function postepPerModul(postepy, mapaModulow = {}) {
  const suma = {};
  const dodaj = (modul, pkt, maks) => {
    if (!modul || !maks) return;
    suma[modul] ??= { pkt: 0, maks: 0 };
    suma[modul].pkt += pkt;
    suma[modul].maks += maks;
  };

  for (const stan of Object.values(postepy.lektury ?? {}))
    if (stan.quiz) dodaj("A", stan.quiz.wynikPkt, stan.quiz.maksPkt);
  for (const [ref, stan] of Object.entries(postepy.cwiczenia ?? {}))
    if (stan.quiz) dodaj(mapaModulow[ref], stan.quiz.wynikPkt, stan.quiz.maksPkt);
  for (const praca of Object.values(postepy.pisanie ?? {}))
    dodaj("F", praca.pkt, praca.maks);
  const egzaminy = postepy.egzaminy ?? [];
  const ostatni = egzaminy[egzaminy.length - 1];
  if (ostatni)
    for (const [m, { pkt, maks }] of Object.entries(ostatni.perModul ?? {})) dodaj(m, pkt, maks);

  const procent = (x) => (x && x.maks ? Math.round((100 * x.pkt) / x.maks) : 0);
  return Object.fromEntries(
    MODULY_KOLEJNOSC.map((m) => {
      const diagnoza = procent(postepy.diagnoza?.perModul?.[m]);
      const teraz = suma[m] ? procent(suma[m]) : diagnoza;
      return [m, { diagnoza, teraz, delta: teraz - diagnoza }];
    })
  );
}
