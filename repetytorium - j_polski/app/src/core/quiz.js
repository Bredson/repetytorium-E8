/**
 * Silnik quizu — czysta logika oceniania, zero DOM/React.
 * Typy pytań: single | multi | truefalse | open-short (kontrakt: docs/ARCHITEKTURA.md).
 */

export const MODULY = {
  A: "Lektury obowiązkowe",
  B: "Nauka o języku",
  C: "Ortografia i interpunkcja",
  D: "Kształcenie literackie",
  E: "Czytanie ze zrozumieniem",
  F: "Tworzenie wypowiedzi",
};

const rowneZbiory = (a, b) =>
  a.length === b.length && [...a].sort().every((v, i) => v === [...b].sort()[i]);

/**
 * Ocenia pojedyncze pytanie zamknięte.
 * @param {object} pytanie — obiekt z banku pytań
 * @param {*} odpowiedz — single: number; multi: number[]; truefalse: boolean[]
 * @returns {{poprawne: boolean, pkt: number, maks: number}}
 */
export function ocenOdpowiedz(pytanie, odpowiedz) {
  const maks = pytanie.punkty;
  let poprawne = false;

  if (odpowiedz !== null && odpowiedz !== undefined) {
    if (pytanie.typ === "single") {
      poprawne = odpowiedz === pytanie.poprawna;
    } else if (pytanie.typ === "multi") {
      poprawne = Array.isArray(odpowiedz) && rowneZbiory(odpowiedz, pytanie.poprawne);
    } else if (pytanie.typ === "truefalse") {
      poprawne =
        Array.isArray(odpowiedz) &&
        odpowiedz.length === pytanie.poprawnaMaska.length &&
        odpowiedz.every((v, i) => v === pytanie.poprawnaMaska[i]);
    }
  }
  return { poprawne, pkt: poprawne ? maks : 0, maks };
}

/** Punkty za zadanie otwarte z samooceny: proporcja spełnionych kryteriów. */
export function ocenSamoocene(zadanie, zaznaczoneKryteria) {
  const spelnione = zaznaczoneKryteria.filter(Boolean).length;
  const pkt = Math.round((zadanie.punkty * spelnione) / zadanie.kryteriaSamooceny.length);
  return { pkt, maks: zadanie.punkty, spelnione, wszystkie: zadanie.kryteriaSamooceny.length };
}

/** Progi kalibracji (SPEC-FAZA-0): braki <50% · częściowy 50-79% · solidny ≥80%. */
export function poziomZProcent(procent) {
  if (procent >= 80) return "solidny";
  if (procent >= 50) return "czesciowy";
  return "braki";
}

/**
 * Liczy pełny wynik diagnozy.
 * @param {Array} pytania — bank pytań zamkniętych
 * @param {Map|object} odpowiedzi — idPytania -> odpowiedź ucznia
 * @param {{zadanie: object, kryteria: boolean[], tekst: string}|null} forma — zadanie otwarte
 */
export function policzWynikDiagnozy(pytania, odpowiedzi, forma) {
  const perModul = {};
  const szczegoly = [];
  const dodaj = (modul, pkt, maks) => {
    perModul[modul] ??= { pkt: 0, maks: 0 };
    perModul[modul].pkt += pkt;
    perModul[modul].maks += maks;
  };

  for (const p of pytania) {
    const odp = odpowiedzi instanceof Map ? odpowiedzi.get(p.id) : odpowiedzi[p.id];
    const wynik = ocenOdpowiedz(p, odp);
    dodaj(p.modul, wynik.pkt, wynik.maks);
    szczegoly.push({
      idPytania: p.id,
      odpowiedz: odp ?? null,
      poprawne: wynik.poprawne,
      pkt: wynik.pkt,
      maks: wynik.maks,
    });
  }

  if (forma) {
    const w = ocenSamoocene(forma.zadanie, forma.kryteria);
    dodaj(forma.zadanie.modul, w.pkt, w.maks);
    szczegoly.push({
      idPytania: forma.zadanie.id,
      odpowiedz: forma.tekst,
      samoocena: forma.kryteria,
      poprawne: w.pkt === w.maks,
      pkt: w.pkt,
      maks: w.maks,
    });
  }

  const wynikPkt = szczegoly.reduce((s, o) => s + o.pkt, 0);
  const maksPkt = szczegoly.reduce((s, o) => s + o.maks, 0);
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
    perModul,
    poziomPerModul,
    odpowiedzi: szczegoly,
  };
}

/** Ciepłe podsumowanie diagnozy — growth mindset, bez zawstydzania. */
export function podsumowanieDiagnozy(wynik, imie) {
  const solidne = Object.values(wynik.poziomPerModul).filter((p) => p === "solidny").length;
  const braki = Object.entries(wynik.poziomPerModul)
    .filter(([, p]) => p === "braki")
    .map(([m]) => MODULY[m]);

  const zdania = [
    `${imie}, masz za sobą pierwszy i najważniejszy krok — teraz dokładnie wiemy, od czego zacząć.`,
  ];
  if (solidne > 0) {
    zdania.push(
      `W ${solidne === 1 ? "1 obszarze" : `${solidne} obszarach`} masz już solidne podstawy — to Twoja baza, na której będziemy budować.`
    );
  }
  if (braki.length > 0) {
    zdania.push(
      `Największy potencjał wzrostu: ${braki.join(", ")}. To nie są słabości — to miejsca, gdzie najszybciej zdobędziesz nowe punkty.`
    );
  } else {
    zdania.push("Nie ma obszarów krytycznych — będziemy szlifować szczegóły do perfekcji.");
  }
  return zdania;
}
