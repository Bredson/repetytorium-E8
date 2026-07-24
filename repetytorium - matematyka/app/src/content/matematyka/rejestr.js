import liczby from "./dzialy/liczby.json";

export const DZIALY = {
  liczby,
  // TODO it.2: ulamki, potegi, procenty, algebra, rownania, geometria-plaska, pitagoras, geometria-przestrzenna
};

export function material(id) {
  return DZIALY[id];
}

export const PULA_EGZAMINU = Object.values(DZIALY).flatMap((d) => [
  ...d.cwiczenia,
  ...d.zadania_otwarte,
]);
