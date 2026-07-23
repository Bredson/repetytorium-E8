export function sprawdzOdpowiedz(pytanie, odpowiedz) {
  return pytanie.poprawna === odpowiedz;
}

export function sprawdzKrok(krok, wartosc) {
  const oczyszczona = String(wartosc).trim().replace(krok.jednostka ?? "", "").trim();
  return oczyszczona === String(krok.oczekiwana).trim();
}

export function obliczWynikDzialu(pytania, odpowiedzi) {
  const poprawne = pytania.filter((p) => sprawdzOdpowiedz(p, odpowiedzi[p.id])).length;
  const wszystkich = pytania.length;
  return { poprawne, wszystkich, procent: wszystkich === 0 ? 0 : Math.round((poprawne / wszystkich) * 100) };
}
