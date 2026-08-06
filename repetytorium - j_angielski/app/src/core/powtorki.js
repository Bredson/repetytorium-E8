/**
 * Spaced repetition — czysta logika, zero DOM/React.
 * Interwały: +1 / +3 / +7 / +14 dni; po 14 kolejne powtórki co 14 dni.
 * Kontrakt rekordu: { id, typ: "fiszka"|"quiz", ref, temat, nastepna: "YYYY-MM-DD", interwal, historia: [{data, ocena}] }
 */

export const INTERWALY = [1, 3, 7, 14];

/** Data lokalna jako "YYYY-MM-DD" (bez strefy — porównujemy całe dni). */
export function dataDnia(d = new Date()) {
  const rok = d.getFullYear();
  const mies = String(d.getMonth() + 1).padStart(2, "0");
  const dzien = String(d.getDate()).padStart(2, "0");
  return `${rok}-${mies}-${dzien}`;
}

export function dodajDni(dataStr, dni) {
  const d = new Date(`${dataStr}T12:00:00`);
  d.setDate(d.getDate() + dni);
  return dataDnia(d);
}

/** Tworzy nowy rekord powtórki — pierwsza powtórka jutro (+1). */
export function nowaPowtorka({ id, typ, ref, temat }, dzis = dataDnia()) {
  return {
    id,
    typ,
    ref,
    temat,
    nastepna: dodajDni(dzis, INTERWALY[0]),
    interwal: INTERWALY[0],
    historia: [],
  };
}

/**
 * Ocena powtórki (immutable — zwraca nowy rekord).
 * "umiem" → następny interwał z sekwencji (po 14 zostaje 14);
 * "jeszcze-nie" → reset do +1.
 */
export function oznaczPowtorke(rekord, ocena, dzis = dataDnia()) {
  let interwal;
  if (ocena === "umiem") {
    const idx = INTERWALY.indexOf(rekord.interwal);
    interwal = idx === -1 || idx === INTERWALY.length - 1 ? 14 : INTERWALY[idx + 1];
  } else {
    interwal = INTERWALY[0];
  }
  return {
    ...rekord,
    interwal,
    nastepna: dodajDni(dzis, interwal),
    historia: [...rekord.historia, { data: dzis, ocena }],
  };
}

/** Powtórki na dziś: zaległe + dzisiejsze, najstarsze najpierw. */
export function coNaDzis(powtorki, dzis = dataDnia()) {
  return powtorki
    .filter((p) => p.nastepna <= dzis)
    .sort((a, b) => a.nastepna.localeCompare(b.nastepna));
}

/** Podmienia rekord w liście po id (immutable). */
export function zaktualizujPowtorki(powtorki, nowyRekord) {
  const bez = powtorki.filter((p) => p.id !== nowyRekord.id);
  return [...bez, nowyRekord];
}

/** Czy rekord o danym id już istnieje (nie duplikujemy po ponownym quizie). */
export function maPowtorke(powtorki, id) {
  return powtorki.some((p) => p.id === id);
}
