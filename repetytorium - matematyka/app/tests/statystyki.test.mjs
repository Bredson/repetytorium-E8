import assert from "node:assert/strict";
import { seriaWynikow, postepPerDzial, aktywnosc, pokrycie } from "../src/core/statystyki.js";

const postepy = {
  diagnoza: { liczby: 0.5, ulamki: 0.7 },
  dzialy: { liczby: { ukonczone: true, wynik: 0.9, data: "2026-07-25" } },
  egzaminy: [
    {
      data: "2026-07-26T10:00:00.000Z",
      wynikPkt: 21,
      maksPkt: 27,
      procent: 78,
      perDzial: { ulamki: { pkt: 1, maks: 2 }, potegi: { pkt: 2, maks: 3 } },
    },
  ],
  sesje: [
    { typ: "diagnoza", data: "2026-07-20T10:00:00.000Z" },
    { typ: "dzial", data: "2026-07-25T10:00:00.000Z", dzialId: "liczby", wynik: 0.9 },
    { typ: "powtorka", data: "2026-07-25T18:00:00.000Z" },
    { typ: "egzamin", data: "2026-07-26T10:00:00.000Z", wynikPkt: 21, maksPkt: 27 },
  ],
};

// seriaWynikow — 3 punkty (powtórka pominięta — inna skala), chronologicznie
const seria = seriaWynikow(postepy, { liczby: "Liczby i działania" });
assert.equal(seria.length, 3);
assert.deepEqual(seria.map((p) => p.typ), ["diagnoza", "dzial", "egzamin"]);
assert.equal(seria[0].procent, 60, "diagnoza = średnia ratio (0.5, 0.7)");
assert.equal(seria[0].etykieta, "Test wstępny");
assert.equal(seria[1].procent, 90);
assert.equal(seria[1].etykieta, "Dział: Liczby i działania");
assert.equal(seria[2].procent, 78);
assert.equal(seria[2].etykieta, "Egzamin próbny");

// seriaWynikow — brak etykiety w mapie → fallback na dzialId
assert.equal(seriaWynikow(postepy)[1].etykieta, "Dział: liczby");

// postepPerDzial — priorytet źródeł: dział (quiz) > ostatni egzamin > diagnoza
const dzialy = postepPerDzial(postepy, ["liczby", "ulamki", "potegi", "procenty"]);
assert.deepEqual(dzialy.liczby, { diagnoza: 50, teraz: 90, delta: 40 });
assert.deepEqual(dzialy.ulamki, { diagnoza: 70, teraz: 50, delta: -20 });
assert.deepEqual(dzialy.potegi, { diagnoza: 0, teraz: 67, delta: 67 });
assert.deepEqual(dzialy.procenty, { diagnoza: 0, teraz: 0, delta: 0 });

// aktywnosc — deterministyczne "dzis" (2026-07-26 to niedziela)
const { tygodnie, seriaDni } = aktywnosc(postepy, new Date("2026-07-26T12:00:00.000Z"));
assert.equal(tygodnie.length, 8);
assert.equal(seriaDni, 2, "sesje 25.07 i 26.07 → seria 2 dni");
assert.equal(tygodnie.reduce((a, t) => a + t.liczba, 0), 4, "wszystkie 4 sesje w oknie 8 tygodni");
assert.equal(tygodnie[7].liczba, 4, "bieżący tydzień (pn 20.07 – nd 26.07) ma 4 sesje");

// pokrycie
const pok = pokrycie(postepy, 9);
assert.deepEqual(pok.dzialy, { zrobione: 1, wszystkie: 9 });
assert.equal(pok.egzaminy, 1);

// puste postepy — bez wyjątków
const puste = { diagnoza: null, dzialy: {}, sesje: [], egzaminy: [] };
assert.deepEqual(seriaWynikow(puste), []);
assert.deepEqual(pokrycie(puste, 9).dzialy, { zrobione: 0, wszystkie: 9 });
assert.equal(aktywnosc(puste, new Date("2026-07-26T12:00:00.000Z")).seriaDni, 0);

console.log("statystyki.test.mjs — OK");
