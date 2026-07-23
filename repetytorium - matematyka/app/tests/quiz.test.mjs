import { sprawdzOdpowiedz, sprawdzKrok, obliczWynikDzialu } from "../src/core/quiz.js";

const pytanieZamkniete = {
  id: "tw-l1",
  typ: "zamkniete",
  opcje: ["5", "13", "1", "-5"],
  poprawna: "13",
};

const krok = {
  id: "k1",
  oczekiwana: "192",
  jednostka: "m³",
};

// sprawdzOdpowiedz
console.assert(sprawdzOdpowiedz(pytanieZamkniete, "13") === true, "FAIL: poprawna odpowiedź");
console.assert(sprawdzOdpowiedz(pytanieZamkniete, "5") === false, "FAIL: błędna odpowiedź");

// sprawdzKrok — tolerancja whitespace i jednostki
console.assert(sprawdzKrok(krok, "192") === true, "FAIL: krok poprawny");
console.assert(sprawdzKrok(krok, " 192 ") === true, "FAIL: krok z whitespace");
console.assert(sprawdzKrok(krok, "192 m³") === true, "FAIL: krok z jednostką");
console.assert(sprawdzKrok(krok, "193") === false, "FAIL: krok błędny");

// obliczWynikDzialu
const pytania = [pytanieZamkniete, { ...pytanieZamkniete, id: "tw-l2", poprawna: "5" }];
const odpowiedzi = { "tw-l1": "13", "tw-l2": "1" };
const wynik = obliczWynikDzialu(pytania, odpowiedzi);
console.assert(wynik.poprawne === 1, `FAIL: poprawne=${wynik.poprawne}`);
console.assert(wynik.wszystkich === 2, `FAIL: wszystkich=${wynik.wszystkich}`);
console.assert(wynik.procent === 50, `FAIL: procent=${wynik.procent}`);

console.log("quiz.test.mjs — OK");
