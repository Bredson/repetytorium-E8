const KOLEJNOSC_DZIALOW = [
  "liczby", "ulamki", "potegi", "procenty",
  "algebra", "rownania", "geometria-plaska", "pitagoras", "geometria-przestrzenna",
];

export function generujPlan(diagnoza) {
  return KOLEJNOSC_DZIALOW.map((dzialId) => {
    const wynik = diagnoza?.[dzialId] ?? 0;
    const priorytet = wynik < 0.5 ? "wysoki" : wynik < 0.8 ? "sredni" : "niski";
    return { dzialId, priorytet, status: "do-zrobienia" };
  });
}
