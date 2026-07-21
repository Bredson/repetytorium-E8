import { useState } from "react";
import { ocenOdpowiedz } from "../../core/quiz.js";
import PasekPostepu from "./PasekPostepu.jsx";

const LITERY = ["A", "B", "C", "D", "E", "F"];

function czyOdpowiedziano(pytanie, odp) {
  if (odp === null || odp === undefined) return false;
  if (pytanie.typ === "single") return typeof odp === "number";
  if (pytanie.typ === "multi") return Array.isArray(odp) && odp.length > 0;
  if (pytanie.typ === "truefalse")
    return Array.isArray(odp) && odp.every((v) => v === true || v === false);
  return false;
}

/** Klasa opcji w trybie feedbacku: poprawna zawsze zielona, błędny wybór — bursztyn. */
function klasaOpcji(wybrana, poprawna, feedback) {
  if (!feedback) return `opcja${wybrana ? " opcja--wybrana" : ""}`;
  if (poprawna) return "opcja opcja--poprawna";
  if (wybrana) return "opcja opcja--niepoprawna";
  return "opcja";
}

/**
 * Quiz z natychmiastowym feedbackiem (tryb nauki — inaczej niż diagnoza).
 * Po każdym pytaniu: Sprawdź → kolory + wyjaśnienie → Dalej.
 */
export default function QuizLektury({ pytania, tytul, onGotowe }) {
  const [idx, setIdx] = useState(0);
  const [odp, setOdp] = useState(null);
  const [feedback, setFeedback] = useState(false);
  const [szczegoly, setSzczegoly] = useState([]);

  const pytanie = pytania[idx];
  const odpowiedziano = czyOdpowiedziano(pytanie, odp);

  function sprawdz() {
    const wynik = ocenOdpowiedz(pytanie, odp);
    setSzczegoly([
      ...szczegoly,
      { idPytania: pytanie.id, odpowiedz: odp, poprawne: wynik.poprawne, pkt: wynik.pkt, maks: wynik.maks },
    ]);
    setFeedback(true);
  }

  function dalej() {
    if (idx + 1 < pytania.length) {
      setIdx(idx + 1);
      setOdp(null);
      setFeedback(false);
    } else {
      const wynikPkt = szczegoly.reduce((s, o) => s + o.pkt, 0);
      const maksPkt = szczegoly.reduce((s, o) => s + o.maks, 0);
      onGotowe({
        data: new Date().toISOString(),
        wynikPkt,
        maksPkt,
        procent: maksPkt ? Math.round((100 * wynikPkt) / maksPkt) : 0,
        odpowiedzi: szczegoly,
      });
    }
  }

  const ostatni = szczegoly[szczegoly.length - 1];

  return (
    <div key={pytanie.id} className="ekran-wjazd">
      <PasekPostepu
        procent={((idx + (feedback ? 1 : 0)) / pytania.length) * 100}
        etykietaLewa={tytul}
        etykietaPrawa={`${idx + 1} z ${pytania.length}`}
      />

      <div className="karta" style={{ marginTop: "var(--sp-4)" }}>
        {pytanie.zrodloTekst && (
          <blockquote
            style={{
              margin: "0 0 var(--sp-4)",
              padding: "var(--sp-4)",
              background: "var(--kolor-powierzchnia-2)",
              borderRadius: "var(--radius-m)",
              fontSize: "var(--rozmiar-s)",
              borderLeft: "4px solid var(--modul-e)",
            }}
          >
            {pytanie.zrodloTekst}
          </blockquote>
        )}
        <h2 style={{ fontSize: "var(--rozmiar-l)" }}>{pytanie.tresc}</h2>

        {pytanie.typ === "single" &&
          pytanie.opcje.map((opcja, i) => (
            <button
              key={i}
              className={klasaOpcji(odp === i, pytanie.poprawna === i, feedback)}
              onClick={() => !feedback && setOdp(i)}
              disabled={feedback}
              aria-pressed={odp === i}
            >
              <span className="opcja-litera" aria-hidden="true">{LITERY[i]}</span>
              <span>{opcja}</span>
            </button>
          ))}

        {pytanie.typ === "multi" && (
          <>
            {!feedback && <p className="tekst-2 tekst-maly">Możesz zaznaczyć więcej niż jedną odpowiedź.</p>}
            {pytanie.opcje.map((opcja, i) => {
              const wybrane = odp ?? [];
              return (
                <button
                  key={i}
                  className={klasaOpcji(wybrane.includes(i), pytanie.poprawne.includes(i), feedback)}
                  onClick={() =>
                    !feedback &&
                    setOdp(wybrane.includes(i) ? wybrane.filter((x) => x !== i) : [...wybrane, i].sort())
                  }
                  disabled={feedback}
                  aria-pressed={wybrane.includes(i)}
                >
                  <span className="opcja-litera" aria-hidden="true">{LITERY[i]}</span>
                  <span>{opcja}</span>
                </button>
              );
            })}
          </>
        )}

        {pytanie.typ === "truefalse" &&
          pytanie.opcje.map((zdanie, i) => {
            const maska = odp ?? pytanie.opcje.map(() => null);
            const dobrze = feedback && maska[i] === pytanie.poprawnaMaska[i];
            return (
              <div
                key={i}
                className="karta"
                style={{
                  padding: "var(--sp-4)",
                  marginBottom: "var(--sp-3)",
                  ...(feedback && {
                    borderColor: dobrze ? "var(--kolor-sukces)" : "var(--kolor-uwaga)",
                    background: dobrze ? "var(--kolor-sukces-tlo)" : "var(--kolor-uwaga-tlo)",
                  }),
                }}
              >
                <p style={{ marginBottom: "var(--sp-3)" }}>{zdanie}</p>
                <div style={{ display: "flex", gap: "var(--sp-2)", alignItems: "center" }}>
                  <button
                    className={`btn${maska[i] === true ? " btn-primary" : ""}`}
                    onClick={() => {
                      const nowa = [...maska];
                      nowa[i] = true;
                      setOdp(nowa);
                    }}
                    disabled={feedback}
                    aria-pressed={maska[i] === true}
                  >
                    Prawda
                  </button>
                  <button
                    className={`btn${maska[i] === false ? " btn-primary" : ""}`}
                    onClick={() => {
                      const nowa = [...maska];
                      nowa[i] = false;
                      setOdp(nowa);
                    }}
                    disabled={feedback}
                    aria-pressed={maska[i] === false}
                  >
                    Fałsz
                  </button>
                  {feedback && (
                    <span className="tekst-2 tekst-maly">
                      Poprawnie: {pytanie.poprawnaMaska[i] ? "Prawda" : "Fałsz"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

        {feedback && (
          <div
            style={{
              marginTop: "var(--sp-4)",
              padding: "var(--sp-4)",
              borderRadius: "var(--radius-m)",
              background: ostatni?.poprawne ? "var(--kolor-sukces-tlo)" : "var(--kolor-uwaga-tlo)",
            }}
          >
            <p style={{ margin: 0, fontWeight: 600 }}>
              {ostatni?.poprawne ? "Dobrze!" : "Prawie — zobacz dlaczego:"}
            </p>
            <p className="tekst-2" style={{ margin: "var(--sp-2) 0 0" }}>{pytanie.wyjasnienie}</p>
          </div>
        )}

        <div style={{ display: "flex", gap: "var(--sp-2)", marginTop: "var(--sp-4)" }}>
          {!feedback ? (
            <button className="btn btn-primary btn--pelny" disabled={!odpowiedziano} onClick={sprawdz}>
              Sprawdź
            </button>
          ) : (
            <button className="btn btn-primary btn--pelny" onClick={dalej}>
              {idx + 1 < pytania.length ? "Dalej" : "Zakończ quiz"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
