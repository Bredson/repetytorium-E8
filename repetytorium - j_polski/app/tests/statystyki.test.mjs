import { test } from "node:test";
import assert from "node:assert/strict";
import { seriaWynikow, postepPerModul } from "../src/core/statystyki.js";

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

const diagnoza = {
  perModul: {
    A: { pkt: 0, maks: 6 }, B: { pkt: 3, maks: 5 }, C: { pkt: 0, maks: 3 },
    D: { pkt: 1, maks: 4 }, E: { pkt: 0, maks: 3 }, F: { pkt: 2, maks: 4 },
  },
};

test("postepPerModul: delta ▲ z quizów, = bez danych, F z pisania+egzaminu", () => {
  const postepy = {
    diagnoza,
    lektury: { "dziady-2": { quiz: { wynikPkt: 10, maksPkt: 12 } }, balladyna: { sekcjePrzeczytane: [] } },
    cwiczenia: { "ortografia-1": { quiz: { wynikPkt: 9, maksPkt: 12 } } },
    pisanie: { "zaproszenie-1": { pkt: 3, maks: 3 } },
    egzaminy: [{ perModul: { A: { pkt: 3, maks: 6 }, F: { pkt: 14, maks: 20 } } }],
  };
  const p = postepPerModul(postepy, { "ortografia-1": "C" });
  // A: quiz 10/12 + egzamin 3/6 = 13/18 → 72%; diagnoza 0%
  assert.deepEqual(p.A, { diagnoza: 0, teraz: 72, delta: 72 });
  // C: 9/12 → 75%; diagnoza 0%
  assert.deepEqual(p.C, { diagnoza: 0, teraz: 75, delta: 75 });
  // B: bez nowych danych → teraz = diagnoza (60%)
  assert.deepEqual(p.B, { diagnoza: 60, teraz: 60, delta: 0 });
  // F: pisanie 3/3 + egzamin 14/20 = 17/23 → 74%; diagnoza 50%
  assert.deepEqual(p.F, { diagnoza: 50, teraz: 74, delta: 24 });
});

test("postepPerModul: delta ujemna i brak diagnozy w module", () => {
  const postepy = {
    diagnoza: { perModul: { B: { pkt: 5, maks: 5 } } },
    lektury: {}, cwiczenia: { "gramatyka-1": { quiz: { wynikPkt: 1, maksPkt: 10 } } },
    pisanie: {}, egzaminy: [],
  };
  const p = postepPerModul(postepy, { "gramatyka-1": "B" });
  assert.deepEqual(p.B, { diagnoza: 100, teraz: 10, delta: -90 });
  assert.deepEqual(p.A, { diagnoza: 0, teraz: 0, delta: 0 });
});
