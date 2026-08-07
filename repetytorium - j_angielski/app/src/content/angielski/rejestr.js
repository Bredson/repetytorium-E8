import funkcje from "./dzialy/funkcje.json";
import czytanie from "./dzialy/czytanie.json";
import srodki from "./dzialy/srodki.json";
import sluchanie from "./dzialy/sluchanie.json";

export const DZIALY = {
  funkcje,
  czytanie,
  srodki,
  sluchanie,
};

export function material(id) {
  return DZIALY[id];
}
