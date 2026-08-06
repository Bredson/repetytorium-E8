import assert from "node:assert/strict";
import { generujPlan, migrujPlan } from "../src/core/plan.js";

// Kolejność jak Object.keys(DZIALY) z rejestr.js — j.angielski it.1: 3 działy
const KOLEJNOSC = ["funkcje", "czytanie", "srodki"];

// generujPlan — wpis dla KAŻDEGO działu z podanej kolejności (parametr, nie hardcoded lista)
{
  const diagnoza = { funkcje: 0.9, czytanie: 0.3 };
  const plan = generujPlan(diagnoza, KOLEJNOSC);
  assert.equal(plan.length, KOLEJNOSC.length, "plan ma wpis dla każdego działu z kolejności");
  assert.deepEqual(plan.map((p) => p.dzialId), KOLEJNOSC, "kolejność wpisów = kolejność podana parametrem");
  assert.equal(plan.find((p) => p.dzialId === "czytanie").priorytet, "wysoki", "0.3 < 0.5 → wysoki");
  assert.equal(plan.find((p) => p.dzialId === "funkcje").priorytet, "niski", "0.9 >= 0.8 → niski");
  assert.equal(plan.find((p) => p.dzialId === "srodki").priorytet, "wysoki", "brak diagnozy → wynik 0 → wysoki");
  for (const wpis of plan) assert.equal(wpis.status, "do-zrobienia");
}

// migrujPlan — dopisuje wpisy dla działów brakujących w istniejącym planie, NIE rusza istniejących
{
  const staryPlan = [
    { dzialId: "funkcje", priorytet: "niski", status: "zrobiony" },
    { dzialId: "czytanie", priorytet: "sredni", status: "do-zrobienia" },
  ];
  const zmigrowany = migrujPlan(staryPlan, KOLEJNOSC, { funkcje: 0.9, czytanie: 0.6 });

  assert.equal(zmigrowany.length, KOLEJNOSC.length, "po migracji plan obejmuje wszystkie działy z rejestru");
  // Istniejące wpisy nietknięte (ten sam obiekt / te same wartości, w tym status/priorytet)
  assert.deepEqual(zmigrowany[0], staryPlan[0], "wpis 'funkcje' bez zmian — status/priorytet zachowane");
  assert.deepEqual(zmigrowany[1], staryPlan[1], "wpis 'czytanie' bez zmian");
  // Nowe działy dopisane na końcu z domyślnym statusem
  const nowe = zmigrowany.slice(2);
  assert.deepEqual(nowe.map((p) => p.dzialId), KOLEJNOSC.slice(2));
  for (const wpis of nowe) assert.equal(wpis.status, "do-zrobienia");
}

// migrujPlan — plan już kompletny: zwraca dane bez zmian (no-op)
{
  const kompletny = KOLEJNOSC.map((id) => ({ dzialId: id, priorytet: "niski", status: "zrobiony" }));
  const wynik = migrujPlan(kompletny, KOLEJNOSC, {});
  assert.deepEqual(wynik, kompletny, "brak brakujących działów → plan niezmieniony");
}

console.log("plan.test.mjs OK");
