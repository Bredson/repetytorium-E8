import assert from "node:assert/strict";
import { nowaPowtorka, coNaDzis, oznaczPowtorke } from "../src/core/powtorki.js";

const DZIS = "2026-08-06";

// nowaPowtorka — tworzy rekord z datą (pierwsza powtórka jutro, +1)
{
  const rekord = nowaPowtorka({ id: "fiszka-1", typ: "fiszka", ref: "funkcje", temat: "irregular verbs" }, DZIS);
  assert.equal(rekord.id, "fiszka-1");
  assert.equal(rekord.nastepna, "2026-08-07", "pierwsza powtórka to +1 dzień");
  assert.equal(rekord.interwal, 1);
  assert.deepEqual(rekord.historia, []);
}

// coNaDzis — zwraca rekordy z datą <= dziś, najstarsze najpierw
{
  const powtorki = [
    { id: "a", nastepna: "2026-08-10" },
    { id: "b", nastepna: "2026-08-01" },
    { id: "c", nastepna: "2026-08-06" },
  ];
  const dzisiejsze = coNaDzis(powtorki, DZIS);
  assert.deepEqual(dzisiejsze.map((p) => p.id), ["b", "c"], "tylko zaległe + dzisiejsze, posortowane rosnąco");
}

// oznaczPowtorke("umiem") — przesuwa datę do przodu (kolejny interwał z sekwencji)
{
  const rekord = nowaPowtorka({ id: "fiszka-2", typ: "fiszka", ref: "czytanie", temat: "skimming" }, DZIS);
  const po = oznaczPowtorke(rekord, "umiem", DZIS);
  assert.equal(po.interwal, 3, "po 'umiem' od interwału 1 → 3");
  assert.equal(po.nastepna, "2026-08-09", "+3 dni od dziś");
  assert.equal(po.historia.length, 1);
  assert.equal(po.historia[0].ocena, "umiem");
}

console.log("powtorki.test.mjs OK");
