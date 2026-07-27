import assert from "node:assert/strict";
import {
  CZAS_EGZAMINU_MIN,
  LICZBA_ZAMKNIETYCH,
  LICZBA_OTWARTYCH,
  tasuj,
  zbudujArkusz,
  punktyZadaniaOtwartego,
  policzWynikEgzaminu,
} from "../src/core/egzamin.js";

// Deterministyczny generator pseudolosowy (LCG) zamiast Math.random
function lcg(seed = 42) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

// Pula testowa jak realny rejestr: 9 działów × (3 zamknięte + 1 otwarte à 2 pkt, 2 kroki)
const dzialy = {};
for (let i = 1; i <= 9; i++) {
  const id = `d${i}`;
  dzialy[id] = {
    id,
    cwiczenia: [1, 2, 3].map((n) => ({
      id: `${id}-c${n}`,
      typ: "zamkniete",
      opcje: ["a", "b"],
      poprawna: "a",
    })),
    zadania_otwarte: [
      { id: `${id}-o1`, punkty: 2, kroki: [{ id: "k1", oczekiwana: "1" }, { id: "k2", oczekiwana: "2" }] },
    ],
  };
}

assert.equal(CZAS_EGZAMINU_MIN, 125);
assert.equal(LICZBA_ZAMKNIETYCH, 15);
assert.equal(LICZBA_OTWARTYCH, 6);

// tasuj — permutacja bez utraty elementów, oryginał nietknięty
const wejscie = [1, 2, 3, 4, 5];
const po = tasuj(wejscie, lcg());
assert.equal(po.length, 5);
assert.deepEqual([...po].sort(), [1, 2, 3, 4, 5]);
assert.deepEqual(wejscie, [1, 2, 3, 4, 5], "tasuj nie mutuje wejścia");

// zbudujArkusz — rozmiary, reprezentacja działów, brak duplikatów, dzialId dopisany
const arkusz = zbudujArkusz(dzialy, lcg());
assert.equal(arkusz.zamkniete.length, LICZBA_ZAMKNIETYCH);
assert.equal(arkusz.otwarte.length, LICZBA_OTWARTYCH);
assert.equal(new Set(arkusz.zamkniete.map((p) => p.dzialId)).size, 9, "każdy dział ≥1 raz w zamkniętych");
const idZamknietych = arkusz.zamkniete.map((p) => p.id);
assert.equal(new Set(idZamknietych).size, idZamknietych.length, "zamknięte bez duplikatów");
assert.equal(new Set(arkusz.otwarte.map((z) => z.id)).size, LICZBA_OTWARTYCH, "otwarte bez duplikatów");
assert.ok(arkusz.zamkniete.every((p) => p.dzialId && p.opcje), "zamknięte mają dzialId i opcje");
assert.ok(arkusz.otwarte.every((z) => z.dzialId && z.kroki), "otwarte mają dzialId i kroki");

// ten sam seed → ten sam arkusz (determinizm dla wstrzykniętego losuj)
assert.deepEqual(
  zbudujArkusz(dzialy, lcg(7)).zamkniete.map((p) => p.id),
  zbudujArkusz(dzialy, lcg(7)).zamkniete.map((p) => p.id)
);

// punktyZadaniaOtwartego — proporcja poprawnych kroków × punkty
const zadanie = { punkty: 2, kroki: [{}, {}] };
assert.equal(punktyZadaniaOtwartego(zadanie, 2), 2);
assert.equal(punktyZadaniaOtwartego(zadanie, 1), 1);
assert.equal(punktyZadaniaOtwartego(zadanie, 0), 0);

// policzWynikEgzaminu — wszystkie zamknięte dobrze, otwarte w połowie kroków
const odpowiedzi = Object.fromEntries(arkusz.zamkniete.map((p) => [p.id, "a"]));
const kroki = Object.fromEntries(arkusz.otwarte.map((z) => [z.id, 1])); // 1 z 2 kroków
const wynik = policzWynikEgzaminu(arkusz, odpowiedzi, kroki);
assert.equal(wynik.pktZamkniete, 15);
assert.equal(wynik.maksZamkniete, 15);
assert.equal(wynik.pktOtwarte, 6, "6 zadań × 1 pkt (połowa z 2)");
assert.equal(wynik.maksOtwarte, 12, "6 zadań × 2 pkt");
assert.equal(wynik.wynikPkt, 21);
assert.equal(wynik.maksPkt, 27);
assert.equal(wynik.procent, 78);

// perDzial sumuje się do całości
assert.equal(Object.values(wynik.perDzial).reduce((a, d) => a + d.pkt, 0), wynik.wynikPkt);
assert.equal(Object.values(wynik.perDzial).reduce((a, d) => a + d.maks, 0), wynik.maksPkt);

// brak odpowiedzi = 0 pkt, bez wyjątków
const zero = policzWynikEgzaminu(arkusz, {}, {});
assert.equal(zero.wynikPkt, 0);
assert.equal(zero.procent, 0);

console.log("egzamin.test.mjs — OK");
