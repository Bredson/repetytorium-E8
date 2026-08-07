import { useState } from "react";
import KrokZadania from "../components/KrokZadania.jsx";
import OdtwarzaczTTS from "../components/OdtwarzaczTTS.jsx";

export default function ZadanieOtwarte({ zadanie, wynikZamknietych, dzialId, onZakoncz, onWroc }) {
  const [aktualnyKrok, setAktualnyKrok] = useState(0);
  const [poprawneKroki, setPoprawneKroki] = useState(0);
  const [zakonczone, setZakonczone] = useState(false);

  const kroki = zadanie.kroki;
  const maxPunkty = zadanie.punkty ?? kroki.length;

  function krokPoprawnie() {
    const nowe = poprawneKroki + 1;
    setPoprawneKroki(nowe);
    przejdzDalej();
  }

  function krokBlad() {
    przejdzDalej();
  }

  function przejdzDalej() {
    if (aktualnyKrok < kroki.length - 1) {
      setAktualnyKrok(aktualnyKrok + 1);
    } else {
      setZakonczone(true);
    }
  }

  if (zakonczone) {
    const punktyOtwarte = Math.round((poprawneKroki / kroki.length) * maxPunkty);

    return (
      <div className="tresc ekran-wjazd">
        <h2>Zadanie ukończone!</h2>

        {zadanie.nagranie && (
          <OdtwarzaczTTS nagranie={zadanie.nagranie} pokazTranskrypcje={zakonczone} />
        )}

        <div className="karta" style={{ marginBottom: "var(--sp-4)", textAlign: "center" }}>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            {punktyOtwarte}/{maxPunkty} {maxPunkty === 1 ? "punkt" : "punkty"}
          </p>
          {wynikZamknietych && (
            <p className="tekst-2">Pytania zamknięte: {wynikZamknietych.poprawne}/{wynikZamknietych.wszystkich}</p>
          )}
        </div>

        <div className="karta" style={{ marginBottom: "var(--sp-4)" }}>
          <p className="tekst-2 tekst-maly" style={{ marginBottom: "var(--sp-2)" }}>Rozwiązanie wzorcowe:</p>
          <p>{zadanie.rozwiazanie_wzorcowe}</p>
        </div>

        <button
          className="btn btn-primary btn--pelny"
          onClick={() => onZakoncz({
            dzialId,
            ...wynikZamknietych,
            punktyOtwarte,
            maxPunktyOtwarte: maxPunkty,
          })}
        >
          Zakończ dział
        </button>
      </div>
    );
  }

  return (
    <div className="tresc ekran-wjazd">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--sp-3)" }}>
        <button className="btn btn-ghost" onClick={onWroc}>← Wróć</button>
        <span className="tekst-2 tekst-maly">Zadanie otwarte</span>
      </div>

      {zadanie.nagranie && (
        <OdtwarzaczTTS nagranie={zadanie.nagranie} pokazTranskrypcje={zakonczone} />
      )}

      <div className="karta" style={{ marginBottom: "var(--sp-4)" }}>
        <p style={{ fontWeight: 500 }}>
          {zadanie.tresc}
        </p>
      </div>

      {kroki.slice(0, aktualnyKrok + 1).map((krok, i) => (
        <KrokZadania
          key={krok.id}
          krok={krok}
          numerKroku={i + 1}
          onPoprawnie={i === aktualnyKrok ? krokPoprawnie : () => {}}
          onBlad={i === aktualnyKrok ? krokBlad : () => {}}
        />
      ))}
    </div>
  );
}
