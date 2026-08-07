import { useState, useMemo } from "react";
import { DZIALY } from "../../content/angielski/rejestr.js";
import { sprawdzOdpowiedz } from "../../core/quiz.js";
import PasekPostepu from "../components/PasekPostepu.jsx";
import OdtwarzaczTTS from "../components/OdtwarzaczTTS.jsx";

function zbierzPytania() {
  return Object.values(DZIALY).flatMap((d) => d.test_wstepny.map((p) => ({ ...p, dzialId: d.id })));
}

export default function TestWstepny({ onZakoncz }) {
  const pytania = useMemo(zbierzPytania, []);
  const [idx, setIdx] = useState(0);
  const [odpowiedzi, setOdpowiedzi] = useState({});
  const [wybrana, setWybrana] = useState(null);
  const [pokazano, setPokazano] = useState(false);

  const pytanie = pytania[idx];
  const procent = Math.round((idx / pytania.length) * 100);

  function wybierz(opcja) {
    if (pokazano) return;
    setWybrana(opcja);
  }

  function potwierdz() {
    if (!wybrana) return;
    setOdpowiedzi((prev) => ({ ...prev, [pytanie.id]: wybrana }));
    setPokazano(true);
  }

  function dalej() {
    if (idx + 1 >= pytania.length) {
      zakoncz();
    } else {
      setIdx(idx + 1);
      setWybrana(null);
      setPokazano(false);
    }
  }

  function zakoncz() {
    const wynikPerDzial = {};
    for (const dz of Object.values(DZIALY)) {
      const pyt = dz.test_wstepny;
      if (pyt.length === 0) { wynikPerDzial[dz.id] = 0; continue; }
      const poprawne = pyt.filter((p) => sprawdzOdpowiedz(p, odpowiedzi[p.id])).length;
      wynikPerDzial[dz.id] = poprawne / pyt.length;
    }
    onZakoncz(wynikPerDzial);
  }

  const poprawna = pytanie.poprawna;
  const czyPoprawna = wybrana === poprawna;

  return (
    <div className="tresc ekran-wjazd">
      <PasekPostepu
        procent={procent}
        etykietaLewa={`Pytanie ${idx + 1} z ${pytania.length}`}
        etykietaPrawa={`${procent}%`}
      />

      <div className="karta" style={{ marginTop: "var(--sp-5)" }}>
        {pytanie.nagranie && (
          <OdtwarzaczTTS
            key={pytanie.id}
            nagranie={pytanie.nagranie}
            pokazTranskrypcje={false}
          />
        )}
        {pytanie.tekst && (
          <p className="karta" style={{ background: "var(--kolor-tlo-2, #f5f5f5)", padding: "var(--sp-3)", marginBottom: "var(--sp-3)", whiteSpace: "pre-wrap", fontStyle: "italic" }}>
            {pytanie.tekst}
          </p>
        )}

        <p style={{ fontSize: "var(--rozmiar-l)", marginBottom: "var(--sp-4)" }}>
          {pytanie.tresc}
        </p>

        <div style={{ display: "grid", gap: "var(--sp-2)" }}>
          {pytanie.opcje.map((opcja) => {
            let klasa = "btn btn-ghost btn--pelny";
            if (pokazano) {
              if (opcja === poprawna) klasa += " btn--sukces";
              else if (opcja === wybrana && !czyPoprawna) klasa += " btn--blad";
            } else if (opcja === wybrana) {
              klasa += " btn--aktywny";
            }
            return (
              <button key={opcja} className={klasa} onClick={() => wybierz(opcja)} style={{ textAlign: "left" }}>
                {opcja}
              </button>
            );
          })}
        </div>

        {!pokazano && (
          <button
            className="btn btn-primary btn--pelny"
            style={{ marginTop: "var(--sp-4)" }}
            onClick={potwierdz}
            disabled={!wybrana}
          >
            Sprawdź
          </button>
        )}

        {pokazano && (
          <div style={{ marginTop: "var(--sp-4)" }}>
            {czyPoprawna
              ? <p className="badge badge--sukces">Świetnie! Dobra odpowiedź.</p>
              : <p className="badge badge--braki">Poprawna odpowiedź: {poprawna}</p>
            }
            <button className="btn btn-primary btn--pelny" style={{ marginTop: "var(--sp-3)" }} onClick={dalej}>
              {idx + 1 >= pytania.length ? "Zakończ diagnozę" : "Następne pytanie"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
