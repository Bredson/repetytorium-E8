import assert from "node:assert/strict";
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
assert.equal(sprawdzOdpowiedz(pytanieZamkniete, "13"), true, "poprawna odpowiedź");
assert.equal(sprawdzOdpowiedz(pytanieZamkniete, "5"), false, "błędna odpowiedź");

// sprawdzKrok — tolerancja whitespace i jednostki
assert.equal(sprawdzKrok(krok, "192"), true, "krok poprawny");
assert.equal(sprawdzKrok(krok, " 192 "), true, "krok z whitespace");
assert.equal(sprawdzKrok(krok, "192 m³"), true, "krok z jednostką");
assert.equal(sprawdzKrok(krok, "193"), false, "krok błędny");

// sprawdzKrok — notacja dziesiętna: przecinek i kropka równoważne (it.3 T1)
const krokDziesietny = { id: "k2", oczekiwana: "2.5" };
assert.equal(sprawdzKrok(krokDziesietny, "2,5"), true, "przecinek ucznia vs kropka oczekiwana");
assert.equal(sprawdzKrok(krokDziesietny, "2.5"), true, "kropka ucznia vs kropka oczekiwana");
assert.equal(sprawdzKrok({ id: "k3", oczekiwana: "2,5" }, "2.5"), true, "kropka ucznia vs przecinek oczekiwany");
assert.equal(sprawdzKrok(krokDziesietny, "2,6"), false, "błędna wartość z przecinkiem");
assert.equal(sprawdzKrok({ id: "k4", oczekiwana: "0.75", jednostka: "kg" }, "0,75 kg"), true, "przecinek + jednostka");

// obliczWynikDzialu
const pytania = [pytanieZamkniete, { ...pytanieZamkniete, id: "tw-l2", poprawna: "5" }];
const odpowiedzi = { "tw-l1": "13", "tw-l2": "1" };
const wynik = obliczWynikDzialu(pytania, odpowiedzi);
assert.equal(wynik.poprawne, 1);
assert.equal(wynik.wszystkich, 2);
assert.equal(wynik.procent, 50);

console.log("quiz.test.mjs — OK");
