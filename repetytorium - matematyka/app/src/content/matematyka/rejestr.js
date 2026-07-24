import liczby from "./dzialy/liczby.json";
import ulamki from "./dzialy/ulamki.json";
import potegi from "./dzialy/potegi.json";
import procenty from "./dzialy/procenty.json";
import algebra from "./dzialy/algebra.json";
import rownania from "./dzialy/rownania.json";
import geometriaPlaska from "./dzialy/geometria-plaska.json";
import pitagoras from "./dzialy/pitagoras.json";
import geometriaPrzestrzenna from "./dzialy/geometria-przestrzenna.json";

export const DZIALY = {
  liczby,
  ulamki,
  potegi,
  procenty,
  algebra,
  rownania,
  "geometria-plaska": geometriaPlaska,
  pitagoras,
  "geometria-przestrzenna": geometriaPrzestrzenna,
};

export function material(id) {
  return DZIALY[id];
}

export const PULA_EGZAMINU = Object.values(DZIALY).flatMap((d) => [
  ...d.cwiczenia,
  ...d.zadania_otwarte,
]);
