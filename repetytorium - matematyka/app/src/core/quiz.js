export function sprawdzOdpowiedz(pytanie, odpowiedz) {
  return pytanie.poprawna === odpowiedz;
}

export function sprawdzKrok(krok, wartosc) {
  // Przecinek dziesiętny ≡ kropka („2,5" = „2.5") — normalizujemy obie strony.
  const norm = (s) => String(s).trim().replace(",", ".");
  const oczyszczona = norm(String(wartosc).replace(krok.jednostka ?? "", ""));
  return oczyszczona === norm(krok.oczekiwana);
}

export function obliczWynikDzialu(pytania, odpowiedzi) {
  const poprawne = pytania.filter((p) => sprawdzOdpowiedz(p, odpowiedzi[p.id])).length;
  const wszystkich = pytania.length;
  return { poprawne, wszystkich, procent: wszystkich === 0 ? 0 : Math.round((poprawne / wszystkich) * 100) };
}
