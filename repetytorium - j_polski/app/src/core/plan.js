/**
 * Generator planu nauki z diagnozy — czysta logika, zero DOM/React.
 * Zasady (docs/SPEC-FAZA-1.md):
 *  - moduły z brakami najpierw i z większą liczbą tygodni (braki ×1.5, częściowy ×1.0, solidny ×0.6),
 *  - lektury (A) i tworzenie wypowiedzi (F) w KAŻDYM tygodniu,
 *  - fazy kalendarzowe: 1 fundamenty → 2 rozbudowa → 3 syntezy → 4 tryb końcowy (ostatnie 6 tyg.).
 * Plan jest deterministyczny: ten sam input → ten sam plan.
 */

import { MODULY, poziomZProcent } from "./quiz.js";
import { dataDnia, dodajDni } from "./powtorki.js";

const WAGI = { braki: 1.5, czesciowy: 1.0, solidny: 0.6 };
const MODULY_ROTOWANE = ["B", "C", "D", "E"]; // A i F są stałe co tydzień

export const FAZY = {
  1: "Fundamenty — nadrabianie braków i kanon klas VII-VIII",
  2: "Rozbudowa — trudniejsze zadania i dłuższe formy",
  3: "Syntezy — kanon klas IV-VI i powtórki przekrojowe",
  4: "Tryb końcowy — arkusze, symulacje, szlifowanie",
};

/** Poziom modułu z diagnozy; brak danych w module = traktuj jak braki. */
function poziomModulu(diagnoza, modul) {
  const zapisany = diagnoza?.poziomPerModul?.[modul];
  if (zapisany) return zapisany;
  const dane = diagnoza?.perModul?.[modul];
  if (dane?.maks) return poziomZProcent(Math.round((100 * dane.pkt) / dane.maks));
  return "braki";
}

/** Kolejność modułów rotowanych: braki → częściowy → solidny, remisy alfabetycznie. */
export function kolejnoscModulow(diagnoza) {
  const ranga = { braki: 0, czesciowy: 1, solidny: 2 };
  return [...MODULY_ROTOWANE].sort((a, b) => {
    const r = ranga[poziomModulu(diagnoza, a)] - ranga[poziomModulu(diagnoza, b)];
    return r !== 0 ? r : a.localeCompare(b);
  });
}

/** Sekwencja modułów rotowanych na N tygodni, proporcjonalnie do wag. */
function sekwencjaModulow(diagnoza, tygodni) {
  const kolejnosc = kolejnoscModulow(diagnoza);
  const wagi = kolejnosc.map((m) => WAGI[poziomModulu(diagnoza, m)]);
  const sumaWag = wagi.reduce((s, w) => s + w, 0);

  // Jeden "cykl" ma długość ~sumy wag; moduł dostaje round(waga) slotów, min 1.
  const cykl = [];
  kolejnosc.forEach((m, i) => {
    const sloty = Math.max(1, Math.round((wagi[i] / sumaWag) * Math.max(kolejnosc.length, 4)));
    for (let s = 0; s < sloty; s++) cykl.push(m);
  });

  const wynik = [];
  for (let t = 0; t < tygodni; t++) wynik.push(cykl[t % cykl.length]);
  return wynik;
}

/** Faza dla numeru tygodnia (1-based) przy danej liczbie tygodni ogółem. */
function fazaTygodnia(nr, ogolem) {
  const koncowe = Math.min(6, Math.max(1, Math.floor(ogolem / 4)));
  const doNauki = ogolem - koncowe;
  if (nr > doNauki) return 4;
  if (nr <= Math.ceil(doNauki * 0.4)) return 1;
  if (nr <= Math.ceil(doNauki * 0.7)) return 2;
  return 3;
}

function tematTygodnia(modul, faza) {
  if (faza === 4) return `${MODULY[modul]} — powtórka arkuszowa`;
  return MODULY[modul];
}

/**
 * Generuje plan nauki.
 * @returns {{ wygenerowano: string, tygodnie: Array<{nrTygodnia, od, do, faza, tematy}> }}
 */
export function generujPlan(diagnoza, dataEgzaminu, dzis = dataDnia()) {
  const msDzien = 86400000;
  const start = new Date(`${dzis}T12:00:00`);
  const egzamin = new Date(`${dataEgzaminu}T12:00:00`);
  const dniDoEgzaminu = Math.max(7, Math.ceil((egzamin - start) / msDzien));
  const tygodni = Math.max(1, Math.floor(dniDoEgzaminu / 7));

  const rotacja = sekwencjaModulow(diagnoza, tygodni);
  const tygodnie = [];

  for (let i = 0; i < tygodni; i++) {
    const nr = i + 1;
    const od = dodajDni(dzis, i * 7);
    const doDnia = dodajDni(dzis, i * 7 + 6);
    const faza = fazaTygodnia(nr, tygodni);
    const modulTygodnia = rotacja[i];

    const tematy = [
      { modul: "A", temat: "Lektury — kompendium, quiz i fiszki", typ: "lektura" },
      { modul: modulTygodnia, temat: tematTygodnia(modulTygodnia, faza), typ: "cwiczenia" },
      { modul: "F", temat: "Tworzenie wypowiedzi — krótka forma pisemna", typ: "pisanie" },
    ];

    tygodnie.push({ nrTygodnia: nr, od, do: doDnia, faza, tematy });
  }

  return { wygenerowano: new Date().toISOString(), tygodnie };
}

/** Tydzień planu obejmujący dzisiejszą datę (albo null, gdy plan się skończył). */
export function tydzienBiezacy(plan, dzis = dataDnia()) {
  if (!plan?.tygodnie?.length) return null;
  return plan.tygodnie.find((t) => t.od <= dzis && dzis <= t.do) ?? null;
}

/**
 * Dashboard "co dziś" — maks 3 zadania: zaległe powtórki najpierw, potem bieżąca nauka.
 * Core nie zna contentu: dostępne treści przychodzą mapą `dostepne` (buduje ją UI z rejestru).
 * @param {Array} powtorkiNaDzis — wynik coNaDzis() z powtorki.js
 * @param {object|null} tydzien — wynik tydzienBiezacy()
 * @param {object} stan — { lektury, cwiczenia, pisanie } z postępów (co już przerobione)
 * @param {object} dostepne — { lektury: [{ref,tytul}], cwiczenia: {C:[{ref,tytul}]}, pisanie: [{ref,tytul}] }
 */
export function zadaniaNaDzis(powtorkiNaDzis, tydzien, stan = {}, dostepne = {}) {
  const { lektury = {}, cwiczenia = {}, pisanie = {} } = stan;
  const zadania = powtorkiNaDzis.slice(0, 3).map((p) => ({
    typ: "powtorka",
    ref: p.ref,
    idPowtorki: p.id,
    tytul: `Powtórka: ${p.temat}`,
    czasMin: p.typ === "fiszka" ? 5 : 10,
  }));

  if (zadania.length < 3 && tydzien) {
    for (const t of tydzien.tematy) {
      if (zadania.length >= 3) break;

      if (t.typ === "lektura") {
        const e = (dostepne.lektury ?? []).find((l) => !lektury[l.ref]?.quiz);
        if (e) {
          zadania.push({ typ: "lektura", ref: e.ref, tytul: `Lektura: ${e.tytul} — kompendium i quiz`, czasMin: 25 });
        }
      } else if (t.typ === "cwiczenia") {
        const lista = dostepne.cwiczenia?.[t.modul] ?? [];
        const e = lista.find((c) => !cwiczenia[c.ref]?.quiz);
        if (e) {
          zadania.push({ typ: "cwiczenia", modul: t.modul, ref: e.ref, tytul: e.tytul, czasMin: 15 });
        } else if (lista.length === 0) {
          zadania.push({ typ: "cwiczenia", modul: t.modul, tytul: t.temat, czasMin: 15, wkrotce: true });
        }
      } else if (t.typ === "pisanie") {
        const e = (dostepne.pisanie ?? []).find((p) => !pisanie[p.ref]);
        if (e) {
          zadania.push({ typ: "pisanie", modul: t.modul, ref: e.ref, tytul: `Pisanie: ${e.tytul}`, czasMin: e.czasMin ?? 10 });
        } else if ((dostepne.pisanie ?? []).length === 0) {
          zadania.push({ typ: "pisanie", modul: t.modul, tytul: t.temat, czasMin: 10, wkrotce: true });
        }
      }
    }
  }
  return zadania.slice(0, 3);
}
