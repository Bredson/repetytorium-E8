import { useEffect, useMemo, useState } from "react";
import { DZIALY } from "../../content/matematyka/rejestr.js";
import { CZAS_EGZAMINU_MIN, zbudujArkusz, policzWynikEgzaminu } from "../../core/egzamin.js";
import KaTeXRenderer from "../components/KaTeXRenderer.jsx";
import KrokZadania from "../components/KrokZadania.jsx";
import PasekPostepu from "../components/PasekPostepu.jsx";

const LITERY = ["A", "B", "C", "D"];

/** Zegar egzaminu: informacyjny, bez wymuszania końca (bursztyn <15 min). */
function Zegar({ start }) {
  const [teraz, setTeraz] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setTeraz(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const zostalo = CZAS_EGZAMINU_MIN * 60000 - (teraz - start);
  if (zostalo <= 0) {
    return (
      <p className="tekst-maly" role="status" style={{
        margin: "0 0 var(--sp-3)", padding: "var(--sp-2) var(--sp-3)",
        background: "var(--kolor-uwaga-tlo)", borderRadius: "var(--radius-m)",
      }}>
        ⏱ Czas minął — na prawdziwym egzaminie tu byłby koniec. Dokończ spokojnie, ale zapamiętaj to tempo.
      </p>
    );
  }
  const sek = Math.floor(zostalo / 1000);
  const malo = zostalo < 15 * 60000;
  const format = `${Math.floor(sek / 3600)}:${String(Math.floor((sek % 3600) / 60)).padStart(2, "0")}:${String(sek % 60).padStart(2, "0")}`;
  return (
    <p className="tekst-2 tekst-maly" role="timer" style={{
      margin: "0 0 var(--sp-3)",
      ...(malo ? { color: "var(--kolor-uwaga)", fontWeight: 600 } : {}),
    }}>
      ⏱ Pozostało: {format}{malo ? " — końcówka, sprawdź czy nic nie pominęłaś" : ""}
    </p>
  );
}

/** Jedno zadanie otwarte w egzaminie: kroki sekwencyjnie, na końcu onGotowe(liczbaPoprawnychKrokow). */
function ZadanieEgzaminu({ zadanie, onGotowe }) {
  const [aktualnyKrok, setAktualnyKrok] = useState(0);
  const [poprawne, setPoprawne] = useState(0);
  const kroki = zadanie.kroki;

  function dalej(nowePoprawne) {
    if (aktualnyKrok < kroki.length - 1) setAktualnyKrok(aktualnyKrok + 1);
    else onGotowe(nowePoprawne);
  }

  return (
    <>
      <div className="karta" style={{ marginBottom: "var(--sp-4)" }}>
        <p style={{ fontWeight: 500, margin: 0 }}>
          <KaTeXRenderer tekst={zadanie.tresc} />
        </p>
      </div>
      {kroki.slice(0, aktualnyKrok + 1).map((krok, i) => (
        <KrokZadania
          key={krok.id}
          krok={krok}
          numerKroku={i + 1}
          onPoprawnie={i === aktualnyKrok ? () => { const n = poprawne + 1; setPoprawne(n); dalej(n); } : () => {}}
          onBlad={i === aktualnyKrok ? () => dalej(poprawne) : () => {}}
        />
      ))}
    </>
  );
}

/**
 * Egzamin próbny — symulacja arkusza CKE (format od 2025):
 * 15 zadań zamkniętych (bez feedbacku) + 6 otwartych (kroki), zegar 125 min informacyjny.
 */
export default function EgzaminProbny({ onZakoncz, onWroc }) {
  const arkusz = useMemo(() => zbudujArkusz(DZIALY), []);
  // etap: "intro" | "zamkniete" | "otwarte" | "wynik"; indeks — pozycja w bieżącym etapie
  const [etap, setEtap] = useState("intro");
  const [indeks, setIndeks] = useState(0);
  const [start, setStart] = useState(null);
  const [odpowiedzi, setOdpowiedzi] = useState({});
  const [poprawneKroki, setPoprawneKroki] = useState({});
  const [wynik, setWynik] = useState(null);

  const razem = arkusz.zamkniete.length + arkusz.otwarte.length;

  function zakonczZadanieOtwarte(zadanieId, liczba) {
    const nowe = { ...poprawneKroki, [zadanieId]: liczba };
    setPoprawneKroki(nowe);
    if (indeks < arkusz.otwarte.length - 1) {
      setIndeks(indeks + 1);
    } else {
      const w = policzWynikEgzaminu(arkusz, odpowiedzi, nowe);
      setWynik(w);
      onZakoncz(w);
      setEtap("wynik");
    }
  }

  if (etap === "intro") {
    return (
      <div className="tresc ekran-wjazd" style={{ maxWidth: 560 }}>
        <h1>Egzamin próbny</h1>
        <div className="karta" style={{ display: "grid", gap: "var(--sp-4)" }}>
          <p style={{ margin: 0 }}>
            Pełna symulacja egzaminu ósmoklasisty z matematyki:{" "}
            <strong>{arkusz.zamkniete.length} zadań zamkniętych</strong> +{" "}
            <strong>{arkusz.otwarte.length} otwartych</strong> ze wszystkich działów.
          </p>
          <ul className="tekst-2" style={{ margin: 0, paddingLeft: "1.2em", display: "grid", gap: "var(--sp-1)" }}>
            <li>Masz <strong>{CZAS_EGZAMINU_MIN} minut</strong> — zegar jest informacyjny, nikt Cię nie wyrzuci po czasie.</li>
            <li>W części zamkniętej nie zobaczysz odpowiedzi w trakcie — wynik na końcu, jak na egzaminie.</li>
            <li>Zadania otwarte rozwiązujesz krok po kroku, jak w działach.</li>
            <li>Bez kalkulatora — na egzaminie wolno mieć tylko linijkę.</li>
          </ul>
          <button className="btn btn-primary btn--pelny" onClick={() => { setStart(Date.now()); setEtap("zamkniete"); }}>
            Zaczynam egzamin
          </button>
          <button className="btn btn-ghost btn--pelny" onClick={onWroc}>Jednak później</button>
        </div>
      </div>
    );
  }

  if (etap === "zamkniete") {
    const pytanie = arkusz.zamkniete[indeks];
    const odp = odpowiedzi[pytanie.id] ?? null;
    return (
      <div className="tresc ekran-wjazd" key={pytanie.id}>
        <Zegar start={start} />
        <PasekPostepu
          procent={((indeks + 1) / razem) * 100}
          etykietaLewa={`Zadanie ${indeks + 1} z ${arkusz.zamkniete.length}`}
          etykietaPrawa={`+ ${arkusz.otwarte.length} otwartych`}
        />
        <div className="karta" style={{ marginTop: "var(--sp-4)" }}>
          <p className="tekst-2 tekst-maly" style={{ margin: "0 0 var(--sp-2)" }}>
            {DZIALY[pytanie.dzialId]?.tytul ?? pytanie.dzialId}
          </p>
          <p style={{ fontWeight: 500, fontSize: "var(--rozmiar-l)", marginBottom: "var(--sp-3)" }}>
            <KaTeXRenderer tekst={pytanie.tresc} />
          </p>
          <div style={{ display: "grid", gap: "var(--sp-2)" }}>
            {pytanie.opcje.map((opcja, i) => (
              <button
                key={opcja}
                className={`opcja${odp === opcja ? " opcja--wybrana" : ""}`}
                onClick={() => setOdpowiedzi({ ...odpowiedzi, [pytanie.id]: opcja })}
                aria-pressed={odp === opcja}
              >
                <span className="opcja-litera" aria-hidden="true">{LITERY[i]}</span>
                <span><KaTeXRenderer tekst={opcja} /></span>
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: "var(--sp-2)", marginTop: "var(--sp-4)" }}>
            {indeks > 0 && (
              <button className="btn" onClick={() => setIndeks(indeks - 1)}>Wstecz</button>
            )}
            <button
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={odp === null}
              onClick={() => {
                if (indeks + 1 < arkusz.zamkniete.length) setIndeks(indeks + 1);
                else { setIndeks(0); setEtap("otwarte"); }
              }}
            >
              {indeks + 1 < arkusz.zamkniete.length ? "Dalej" : "Część 2: zadania otwarte"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (etap === "otwarte") {
    const zadanie = arkusz.otwarte[indeks];
    return (
      <div className="tresc ekran-wjazd" key={zadanie.id}>
        <Zegar start={start} />
        <PasekPostepu
          procent={((arkusz.zamkniete.length + indeks + 1) / razem) * 100}
          etykietaLewa={`Zadanie otwarte ${indeks + 1} z ${arkusz.otwarte.length}`}
          etykietaPrawa={`${zadanie.punkty ?? zadanie.kroki.length} pkt`}
        />
        <p className="tekst-2 tekst-maly" style={{ margin: "var(--sp-3) 0 var(--sp-2)" }}>
          {DZIALY[zadanie.dzialId]?.tytul ?? zadanie.dzialId}
        </p>
        <ZadanieEgzaminu zadanie={zadanie} onGotowe={(n) => zakonczZadanieOtwarte(zadanie.id, n)} />
      </div>
    );
  }

  if (etap === "wynik") {
    const dobrze = wynik.procent >= 80;
    return (
      <div className="tresc ekran-wjazd">
        <div className="tekst-srodek celebracja" style={{ fontSize: 48, marginBottom: "var(--sp-2)" }} aria-hidden="true">
          {dobrze ? "🎉" : "🌱"}
        </div>
        <h1 className="tekst-srodek">Egzamin próbny za Tobą!</h1>

        <section className="karta" style={{ display: "grid", gap: "var(--sp-4)" }}>
          <PasekPostepu
            procent={wynik.procent}
            etykietaLewa={`${wynik.wynikPkt}/${wynik.maksPkt} pkt`}
            etykietaPrawa={`${wynik.procent}%`}
            wariant={dobrze ? "sukces" : ""}
          />
          <p className="tekst-2" style={{ margin: 0 }}>
            Zamknięte: <strong>{wynik.pktZamkniete}/{wynik.maksZamkniete} pkt</strong> ·
            Otwarte: <strong>{wynik.pktOtwarte}/{wynik.maksOtwarte} pkt</strong>
          </p>
          <p className="tekst-2" style={{ margin: 0 }}>
            {dobrze
              ? "Taki wynik w maju to bardzo mocna pozycja. Tak trzymaj!"
              : "Egzamin próbny to mapa — wiesz już, które działy powtórzyć przed następnym podejściem."}
          </p>
        </section>

        <section className="karta" style={{ marginTop: "var(--sp-4)", display: "grid", gap: "var(--sp-3)" }}>
          <h2 style={{ margin: 0, fontSize: "var(--rozmiar-l)" }}>Wynik według działów</h2>
          {Object.entries(wynik.perDzial).map(([id, { pkt, maks }]) => (
            <PasekPostepu
              key={id}
              procent={maks ? Math.round((100 * pkt) / maks) : 0}
              etykietaLewa={DZIALY[id]?.tytul ?? id}
              etykietaPrawa={`${pkt}/${maks} pkt`}
            />
          ))}
        </section>

        <button className="btn btn-primary btn--pelny" style={{ marginTop: "var(--sp-5)" }} onClick={onWroc}>
          Wróć do startu
        </button>
      </div>
    );
  }

  return null;
}
