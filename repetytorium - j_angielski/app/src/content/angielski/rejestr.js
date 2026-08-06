import funkcje from "./dzialy/funkcje.json";
import czytanie from "./dzialy/czytanie.json";
import srodki from "./dzialy/srodki.json";

export const DZIALY = {
  funkcje,
  czytanie,
  srodki,
};

export function material(id) {
  return DZIALY[id];
}
