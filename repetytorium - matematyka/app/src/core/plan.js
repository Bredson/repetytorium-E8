/**
 * Plan nauki ("Na dziś") — czysta logika, zero DOM/importów treści.
 * Kolejność działów buduje UI z rejestru (Object.keys(DZIALY), zachowuje kolejność wstawiania)
 * i podaje argumentem `kolejnosc` — konwencja jak core/egzamin.js (`zbudujArkusz(dzialy, ...)`)
 * i core/statystyki.js (`postepPerDzial(postepy, kolejnosc)`).
 */

function wpisPlanu(dzialId, diagnoza) {
  const wynik = diagnoza?.[dzialId] ?? 0;
  const priorytet = wynik < 0.5 ? "wysoki" : wynik < 0.8 ? "sredni" : "niski";
  return { dzialId, priorytet, status: "do-zrobienia" };
}

/** Buduje świeży plan — po jednym wpisie na każdy dział z `kolejnosc`. */
export function generujPlan(diagnoza, kolejnosc) {
  return kolejnosc.map((dzialId) => wpisPlanu(dzialId, diagnoza));
}

/**
 * Migruje istniejący plan profilu: dopisuje na końcu wpisy dla działów z `kolejnosc`,
 * których w planie jeszcze nie ma (np. nowe działy dodane w kolejnej iteracji).
 * Nie dotyka istniejących wpisów (status/priorytet/kolejność zachowane).
 * Gdy nic nie brakuje, zwraca ten sam `plan` (no-op).
 */
export function migrujPlan(plan, kolejnosc, diagnoza) {
  const obecne = new Set(plan.map((p) => p.dzialId));
  const brakujace = kolejnosc.filter((id) => !obecne.has(id));
  if (brakujace.length === 0) return plan;
  return [...plan, ...brakujace.map((id) => wpisPlanu(id, diagnoza))];
}
