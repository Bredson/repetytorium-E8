/**
 * Egzamin próbny — czysta logika budowy arkusza i liczenia wyniku, zero DOM.
 * Format CKE od 2025: 15 zadań zamkniętych ×1 pkt + 6 otwartych (pkt z zadania), 125 min.
 * Losowość wstrzykiwana parametrem `losuj` — testy podają generator deterministyczny.
 */
import { sprawdzOdpowiedz } from "./quiz.js";

export const CZAS_EGZAMINU_MIN = 125;
export const LICZBA_ZAMKNIETYCH = 15;
export const LICZBA_OTWARTYCH = 6;

/** Fisher-Yates na kopii — nie mutuje wejścia. */
export function tasuj(tablica, losuj = Math.random) {
  const kopia = [...tablica];
  for (let i = kopia.length - 1; i > 0; i--) {
    const j = Math.floor(losuj() * (i + 1));
    [kopia[i], kopia[j]] = [kopia[j], kopia[i]];
  }
  return kopia;
}

/**
 * Buduje arkusz z mapy działów (DZIALY z rejestr.js).
 * Zamknięte: najpierw po 1 z każdego działu (reprezentacja), potem losowe dopełnienie do 15.
 * Otwarte: losowe 6 z całej puli. Każdy element dostaje pole `dzialId`.
 */
export function zbudujArkusz(dzialy, losuj = Math.random) {
  const lista = tasuj(Object.values(dzialy), losuj);

  const poJednym = [];
  const reszta = [];
  for (const d of lista) {
    const cwiczenia = tasuj(d.cwiczenia, losuj).map((p) => ({ ...p, dzialId: d.id }));
    if (cwiczenia.length > 0) poJednym.push(cwiczenia[0]);
    reszta.push(...cwiczenia.slice(1));
  }
  const dopelnienie = tasuj(reszta, losuj).slice(0, Math.max(0, LICZBA_ZAMKNIETYCH - poJednym.length));
  const zamkniete = tasuj([...poJednym.slice(0, LICZBA_ZAMKNIETYCH), ...dopelnienie], losuj);

  const pulaOtwartych = lista.flatMap((d) => d.zadania_otwarte.map((z) => ({ ...z, dzialId: d.id })));
  const otwarte = tasuj(pulaOtwartych, losuj).slice(0, LICZBA_OTWARTYCH);

  return { zamkniete, otwarte };
}

/** Punkty za zadanie otwarte: proporcja poprawnych kroków × punkty zadania (zaokrąglenie). */
export function punktyZadaniaOtwartego(zadanie, poprawneKroki) {
  if (zadanie.kroki.length === 0) return 0;
  const maks = zadanie.punkty ?? zadanie.kroki.length;
  return Math.round((poprawneKroki / zadanie.kroki.length) * maks);
}

/**
 * Liczy wynik egzaminu z rozbiciem per dział.
 * @param {{zamkniete: Array, otwarte: Array}} arkusz — z zbudujArkusz
 * @param {object} odpowiedziZamkniete — {pytanieId: wybranaOpcja}
 * @param {object} poprawneKrokiPerZadanie — {zadanieId: liczbaPoprawnychKrokow}
 */
export function policzWynikEgzaminu(arkusz, odpowiedziZamkniete, poprawneKrokiPerZadanie) {
  const perDzial = {};
  const dodaj = (dzialId, pkt, maks) => {
    perDzial[dzialId] ??= { pkt: 0, maks: 0 };
    perDzial[dzialId].pkt += pkt;
    perDzial[dzialId].maks += maks;
  };

  let pktZamkniete = 0;
  for (const p of arkusz.zamkniete) {
    const pkt = sprawdzOdpowiedz(p, odpowiedziZamkniete[p.id]) ? 1 : 0;
    pktZamkniete += pkt;
    dodaj(p.dzialId, pkt, 1);
  }

  let pktOtwarte = 0;
  let maksOtwarte = 0;
  for (const z of arkusz.otwarte) {
    const maks = z.punkty ?? z.kroki.length;
    const pkt = punktyZadaniaOtwartego(z, poprawneKrokiPerZadanie[z.id] ?? 0);
    pktOtwarte += pkt;
    maksOtwarte += maks;
    dodaj(z.dzialId, pkt, maks);
  }

  const wynikPkt = pktZamkniete + pktOtwarte;
  const maksPkt = arkusz.zamkniete.length + maksOtwarte;
  return {
    pktZamkniete,
    maksZamkniete: arkusz.zamkniete.length,
    pktOtwarte,
    maksOtwarte,
    wynikPkt,
    maksPkt,
    procent: maksPkt === 0 ? 0 : Math.round((100 * wynikPkt) / maksPkt),
    perDzial,
  };
}
