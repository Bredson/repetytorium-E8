/**
 * Egzamin próbny — czysta logika, zero DOM/React (docs/ARCHITEKTURA.md).
 * Format egzaminu 2027: 150 min, 45 pkt = 25 pkt test + 20 pkt wypracowanie.
 * Reguła CKE: wypracowanie poniżej 180 wyrazów → ocena tylko za treść (max 7 pkt).
 */
import { ocenOdpowiedz, ocenSamoocene, poziomZProcent } from "./quiz.js";

export const CZAS_EGZAMINU_MIN = 150;
export const MIN_SLOW_WYPRACOWANIA = 200;
export const PROG_SLOW_PELNA_OCENA = 180;
export const MAKS_PKT_PONIZEJ_PROGU = 7;

/** Rozkład 25 pytań testowych po modułach (F ocenia wypracowanie). */
export const ROZKLAD_EGZAMINU = { A: 6, B: 5, C: 4, D: 5, E: 5 };

/** Liczba wyrazów — ta sama logika co licznik w UI pisania. */
export function policzSlowa(tekst) {
  return (tekst ?? "").trim().split(/\s+/).filter(Boolean).length;
}

function tasuj(tablica, rng) {
  const a = [...tablica];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Losuje arkusz 25 pytań z puli wg ROZKLAD_EGZAMINU (kolejność modułów A→E,
 * jak na prawdziwym arkuszu: najpierw lektury, potem język, na końcu czytanie).
 * @param {Array} pula — pytania zamknięte z polem modul ∈ A-E
 * @param {() => number} rng — opcjonalny generator (testy deterministyczne)
 */
export function zbudujArkusz(pula, rng = Math.random) {
  const arkusz = [];
  for (const [modul, ile] of Object.entries(ROZKLAD_EGZAMINU)) {
    const zModulu = pula.filter((p) => p.modul === modul);
    arkusz.push(...tasuj(zModulu, rng).slice(0, ile));
  }
  return arkusz;
}

/**
 * Liczy pełny wynik egzaminu próbnego: test /25 + wypracowanie /20 = /45.
 * @param {Array} pytania — arkusz z zbudujArkusz
 * @param {Map|object} odpowiedzi — idPytania -> odpowiedź ucznia
 * @param {{zadanie: object, kryteria: boolean[], tekst: string, forma: string}} wypracowanie
 */
export function policzWynikEgzaminu(pytania, odpowiedzi, wypracowanie) {
  const perModul = {};
  const szczegoly = [];
  const dodaj = (modul, pkt, maks) => {
    perModul[modul] ??= { pkt: 0, maks: 0 };
    perModul[modul].pkt += pkt;
    perModul[modul].maks += maks;
  };

  for (const p of pytania) {
    const odp = odpowiedzi instanceof Map ? odpowiedzi.get(p.id) : odpowiedzi[p.id];
    const w = ocenOdpowiedz(p, odp);
    dodaj(p.modul, w.pkt, w.maks);
    szczegoly.push({ idPytania: p.id, odpowiedz: odp ?? null, poprawne: w.poprawne, pkt: w.pkt, maks: w.maks });
  }

  const slowa = policzSlowa(wypracowanie.tekst);
  const samoocena = ocenSamoocene(wypracowanie.zadanie, wypracowanie.kryteria);
  const ponizejProgu = slowa < PROG_SLOW_PELNA_OCENA;
  const pktWypracowania = ponizejProgu
    ? Math.min(samoocena.pkt, MAKS_PKT_PONIZEJ_PROGU)
    : samoocena.pkt;
  dodaj("F", pktWypracowania, samoocena.maks);

  const testPkt = szczegoly.reduce((s, o) => s + o.pkt, 0);
  const testMaks = szczegoly.reduce((s, o) => s + o.maks, 0);
  const wynikPkt = testPkt + pktWypracowania;
  const maksPkt = testMaks + samoocena.maks;
  const poziomPerModul = Object.fromEntries(
    Object.entries(perModul).map(([m, { pkt, maks }]) => [
      m,
      poziomZProcent(maks ? Math.round((100 * pkt) / maks) : 0),
    ])
  );

  return {
    data: new Date().toISOString(),
    wynikPkt,
    maksPkt,
    procent: maksPkt ? Math.round((100 * wynikPkt) / maksPkt) : 0,
    testPkt,
    testMaks,
    perModul,
    poziomPerModul,
    odpowiedzi: szczegoly,
    wypracowanie: {
      forma: wypracowanie.forma,
      refZadania: wypracowanie.zadanie.id,
      tekst: wypracowanie.tekst,
      kryteria: wypracowanie.kryteria,
      slowa,
      ponizejProgu,
      pkt: pktWypracowania,
      maks: samoocena.maks,
      spelnione: samoocena.spelnione,
      wszystkie: samoocena.wszystkie,
    },
  };
}
