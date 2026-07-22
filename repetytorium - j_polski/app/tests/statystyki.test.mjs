import { test } from "node:test";
import assert from "node:assert/strict";
import { seriaWynikow } from "../src/core/statystyki.js";

const sesje = [
  { typ: "quiz-lektury", ref: "balladyna", data: "2026-07-20", wynikPkt: 9, maksPkt: 12 },
  { typ: "diagnoza", data: "2026-07-15T10:00:00.000Z", wynikPkt: 6, maksPkt: 25 },
  { typ: "powtorka", id: "x:quiz", data: "2026-07-18", ocena: "umiem" },
  { typ: "fiszki-lektury", ref: "dziady-2", data: "2026-07-17", umiem: 5, razem: 8 },
  { typ: "egzamin", data: "2026-07-21T12:00:00.000Z", wynikPkt: 20, maksPkt: 45 },
];

test("seriaWynikow: chronologicznie, tylko typy punktowe, poprawny procent", () => {
  const s = seriaWynikow({ sesje }, { balladyna: "Balladyna" });
  assert.deepEqual(s.map((p) => p.typ), ["diagnoza", "quiz-lektury", "egzamin"]);
  assert.deepEqual(s.map((p) => p.procent), [24, 75, 44]);
  assert.equal(s[1].etykieta, "Quiz: Balladyna");
  assert.equal(s[0].etykieta, "Test wstępny");
});

test("seriaWynikow: brak sesji i brak mapy etykiet nie wywala", () => {
  assert.deepEqual(seriaWynikow({ sesje: [] }), []);
  const s = seriaWynikow({ sesje: [{ typ: "quiz-cwiczenia", ref: "nieznane", data: "2026-07-19", wynikPkt: 1, maksPkt: 2 }] });
  assert.equal(s[0].etykieta, "Ćwiczenie: nieznane");
});
