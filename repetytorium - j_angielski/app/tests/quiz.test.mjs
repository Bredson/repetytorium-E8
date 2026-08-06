import assert from "node:assert/strict";
import { sprawdzOdpowiedz, sprawdzKrok, obliczWynikDzialu } from "../src/core/quiz.js";

const pytanieZamkniete = {
  id: "fun-l1",
  typ: "zamkniete",
  opcje: ["went", "goed", "gone", "going"],
  poprawna: "went",
};

const krok = { akceptowane: ["went", "walked"] };

// sprawdzOdpowiedz
assert.equal(sprawdzOdpowiedz(pytanieZamkniete, "went"), true, "poprawna odpowiedź");
assert.equal(sprawdzOdpowiedz(pytanieZamkniete, "goed"), false, "błędna odpowiedź");

// sprawdzKrok — nowa semantyka: lista akceptowanych wariantów, trim + case-insensitive
assert.equal(sprawdzKrok(krok, "went"), true, "wariant 1");
assert.equal(sprawdzKrok(krok, "walked"), true, "wariant 2");
assert.equal(sprawdzKrok(krok, "  WENT "), true, "trim + case-insensitive");
assert.equal(sprawdzKrok(krok, "gone"), false, "zly wyraz odrzucony");
assert.equal(sprawdzKrok(krok, "wend"), false, "literowka odrzucona (pisownia sie liczy)");
assert.equal(sprawdzKrok({ akceptowane: ["doesn't", "does not"] }, "does not"), true, "wariant wielowyrazowy");

// obliczWynikDzialu
const pytania = [pytanieZamkniete, { ...pytanieZamkniete, id: "fun-l2", poprawna: "gone" }];
const odpowiedzi = { "fun-l1": "went", "fun-l2": "going" };
const wynik = obliczWynikDzialu(pytania, odpowiedzi);
assert.equal(wynik.poprawne, 1);
assert.equal(wynik.wszystkich, 2);
assert.equal(wynik.procent, 50);

console.log("quiz.test.mjs — OK");
