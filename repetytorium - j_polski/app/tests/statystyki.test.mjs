import { test } from "node:test";
import assert from "node:assert/strict";
import { seriaWynikow, postepPerModul, aktywnosc, pokrycie } from "../src/core/statystyki.js";

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

const s = (data) => ({ typ: "powtorka", data });

test("aktywnosc: seria liczona wstecz, dziś bez sesji nie zeruje wczorajszej", () => {
  const dzis = new Date("2026-07-21T14:00:00Z"); // wtorek
  // sesje: 18, 19, 20 (pn) — dziś (21) brak → seria 3
  const a = aktywnosc({ sesje: [s("2026-07-18"), s("2026-07-19T08:00:00Z"), s("2026-07-20")] }, dzis);
  assert.equal(a.seriaDni, 3);
  // z sesją dziś → 4
  assert.equal(aktywnosc({ sesje: [s("2026-07-18"), s("2026-07-19"), s("2026-07-20"), s("2026-07-21")] }, dzis).seriaDni, 4);
  // przerwa (brak 20) → seria 0 (dziś też brak)
  assert.equal(aktywnosc({ sesje: [s("2026-07-18"), s("2026-07-19")] }, dzis).seriaDni, 0);
});

test("aktywnosc: 8 tygodni od poniedziałku, zliczanie per tydzień", () => {
  const dzis = new Date("2026-07-21T14:00:00Z"); // wtorek, tydzień od pn 2026-07-20
  const a = aktywnosc({ sesje: [s("2026-07-20"), s("2026-07-21"), s("2026-07-15"), s("2026-05-01")] }, dzis);
  assert.equal(a.tygodnie.length, 8);
  assert.equal(a.tygodnie[7].od, "2026-07-20"); // bieżący tydzień ostatni
  assert.equal(a.tygodnie[7].liczba, 2);
  assert.equal(a.tygodnie[6].od, "2026-07-13");
  assert.equal(a.tygodnie[6].liczba, 1);
  assert.equal(a.tygodnie[0].liczba, 0); // 2026-05-01 poza oknem 8 tygodni
});

test("pokrycie: zrobione = quiz/praca zapisana, X z Y", () => {
  const postepy = {
    lektury: { "dziady-2": { quiz: { wynikPkt: 10, maksPkt: 12 } }, balladyna: { sekcjePrzeczytane: ["a"] } },
    cwiczenia: { "ortografia-1": { quiz: { wynikPkt: 9, maksPkt: 12 } } },
    pisanie: { "zaproszenie-1": { pkt: 3, maks: 3 } },
  };
  assert.deepEqual(pokrycie(postepy, { lektury: 6, cwiczenia: 16, pisanie: 6 }), [
    { nazwa: "Lektury", zrobione: 1, wszystkie: 6 },
    { nazwa: "Ćwiczenia", zrobione: 1, wszystkie: 16 },
    { nazwa: "Pisanie", zrobione: 1, wszystkie: 6 },
  ]);
});
