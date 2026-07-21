/**
 * Rejestr treści języka polskiego — jedyne miejsce wiedzy o dostępnych materiałach.
 * UI i App importują wyłącznie stąd; core dostaje mapę DOSTEPNE jako argument
 * (warstwa core nie importuje contentu — docs/ARCHITEKTURA.md).
 * Dodanie treści B/D/E = nowy JSON + wpis w mapach poniżej.
 */
import dziady2 from "./lektury/dziady-2.json";
import balladyna from "./lektury/balladyna.json";
import zemsta from "./lektury/zemsta.json";
import opowiescWigilijna from "./lektury/opowiesc-wigilijna.json";
import malyKsiaze from "./lektury/maly-ksiaze.json";
import kamienieNaSzaniec from "./lektury/kamienie-na-szaniec.json";
import gramatyka1 from "./cwiczenia/gramatyka-1.json";
import ortografia1 from "./cwiczenia/ortografia-1.json";
import ortografia2 from "./cwiczenia/ortografia-2.json";
import literackie1 from "./cwiczenia/literackie-1.json";
import literackie2 from "./cwiczenia/literackie-2.json";
import czytanie1 from "./cwiczenia/czytanie-1.json";
import czytanie2 from "./cwiczenia/czytanie-2.json";
import zaproszenie1 from "./pisanie/zaproszenie-1.json";
import rozprawka1 from "./pisanie/rozprawka-1.json";
import opowiadanie1 from "./pisanie/opowiadanie-1.json";

export const LEKTURY = {
  "dziady-2": dziady2,
  balladyna,
  zemsta,
  "opowiesc-wigilijna": opowiescWigilijna,
  "maly-ksiaze": malyKsiaze,
  "kamienie-na-szaniec": kamienieNaSzaniec,
};
export const CWICZENIA = {
  "gramatyka-1": gramatyka1,
  "ortografia-1": ortografia1,
  "ortografia-2": ortografia2,
  "literackie-1": literackie1,
  "literackie-2": literackie2,
  "czytanie-1": czytanie1,
  "czytanie-2": czytanie2,
};
export const PISANIE = {
  "zaproszenie-1": zaproszenie1,
  "rozprawka-1": rozprawka1,
  "opowiadanie-1": opowiadanie1,
};

/** Materiał powtórki (obiekt z .quiz/.fiszki) po ref rekordu powtórki. */
export function material(ref) {
  return LEKTURY[ref] ?? CWICZENIA[ref] ?? null;
}

/** Mapa dostępności treści dla core/plan.zadaniaNaDzis. */
export const DOSTEPNE = {
  lektury: Object.values(LEKTURY).map((l) => ({ ref: l.id, tytul: l.tytul })),
  cwiczenia: Object.values(CWICZENIA).reduce((mapa, c) => {
    (mapa[c.modul] ??= []).push({ ref: c.id, tytul: c.tytul });
    return mapa;
  }, {}),
  pisanie: Object.values(PISANIE).map((p) => ({ ref: p.id, tytul: p.tytul, czasMin: p.czasMin ?? 10 })),
};
