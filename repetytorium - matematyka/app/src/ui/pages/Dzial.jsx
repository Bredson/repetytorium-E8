import { useState, useMemo } from "react";
import { material } from "../../content/matematyka/rejestr.js";
import { sprawdzOdpowiedz, obliczWynikDzialu } from "../../core/quiz.js";
import KaTeXRenderer from "../components/KaTeXRenderer.jsx";

export default function Dzial({ dzialId, postepy, onZakoncz, onZadanieOtwarte, onWroc }) {
  const dzial = useMemo(() => material(dzialId), [dzialId]);
  const pytania = dzial.cwiczenia;

  const [aktualny, setAktualny] = useState(0);
  const [odpowiedzi, setOdpowiedzi] = useState({});     // {id: odpowiedz}
  const [wybrana, setWybrana] = useState(null);          // aktualnie zaznaczona opcja
  const [pokazFeedback, setPokazFeedback] = useState(false);
  const [zakonczone, setZakonczone] = useState(false);

  const pytanie = pytania[aktualny];

  function wybierz(opcja) {
    if (wybrana !== null) return; // blokada podwójnego kliknięcia
    const nowe = { ...odpowiedzi, [pytanie.id]: opcja };
    setWybrana(opcja);
    setPokazFeedback(true);
    setOdpowiedzi(nowe);

    setTimeout(() => {
      if (aktualny < pytania.length - 1) {
        setAktualny(aktualny + 1);
        setWybrana(null);
        setPokazFeedback(false);
      } else {
        setZakonczone(true);
      }
    }, 1000);
  }

  function reset() {
    setAktualny(0);
    setOdpowiedzi({});
    setWybrana(null);
    setPokazFeedback(false);
    setZakonczone(false);
  }

  if (zakonczone) {
    const wynik = obliczWynikDzialu(pytania, odpowiedzi);
    const procent = wynik.procent;
    const zdany = procent >= 80;

    if (zdany) {
      // Jeśli są zadania otwarte — idź do ZadanieOtwarte
      if (dzial.zadania_otwarte?.length > 0) {
        onZadanieOtwarte({ zadanie: dzial.zadania_otwarte[0], wynikZamknietych: wynik });
        return null;
      }
      // Brak zadań otwartych — zakończ dział
      onZakoncz({ dzialId, ...wynik });
      return null;
    }

    return (
      <div className="tresc ekran-wjazd">
        <h2>{dzial.tytul}</h2>
        <div className="karta" style={{ textAlign: "center", marginBottom: "var(--sp-4)" }}>
          <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{procent}%</p>
          <p>{wynik.poprawne}/{wynik.wszystkich} poprawnie</p>
          <p style={{ color: "var(--kolor-uwaga)" }}>
            Potrzebujesz 80%, żeby ukończyć dział. Spróbuj jeszcze raz!
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--sp-3)", flexWrap: "wrap" }}>
          <button className="btn btn-primary" onClick={reset} style={{ flex: 1 }}>Spróbuj jeszcze raz</button>
          <button className="btn btn-ghost" onClick={onWroc} style={{ flex: 1 }}>Wróć do menu</button>
        </div>
      </div>
    );
  }

  const poprawna = pytanie.poprawna;
  const czyWybranaPop = wybrana === poprawna;

  return (
    <div className="tresc ekran-wjazd">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--sp-3)" }}>
        <button className="btn btn-ghost" onClick={onWroc}>← Wróć</button>
        <span className="tekst-2 tekst-maly">{aktualny + 1}/{pytania.length}</span>
      </div>

      <h2 style={{ marginBottom: "var(--sp-2)" }}>{dzial.tytul}</h2>

      <div className="karta" style={{ marginBottom: "var(--sp-4)" }}>
        <p style={{ marginBottom: "var(--sp-3)", fontWeight: 500 }}>
          <KaTeXRenderer tekst={pytanie.tresc} />
        </p>

        {pytanie.przypomnij && (
          <details style={{ marginBottom: "var(--sp-3)" }}>
            <summary className="tekst-2 tekst-maly" style={{ cursor: "pointer" }}>Przypomnij</summary>
            <p style={{ marginTop: "var(--sp-2)" }}>
              <KaTeXRenderer tekst={pytanie.przypomnij} />
            </p>
          </details>
        )}

        <div style={{ display: "grid", gap: "var(--sp-2)" }}>
          {pytanie.opcje.map((opcja) => {
            let klass = "btn btn-ghost btn--pelny";
            if (wybrana !== null) {
              if (opcja === poprawna) klass += " btn--sukces";
              else if (opcja === wybrana) klass += " btn--blad";
            }
            return (
              <button
                key={opcja}
                className={klass}
                style={{ textAlign: "left" }}
                onClick={() => wybierz(opcja)}
                disabled={wybrana !== null}
              >
                <KaTeXRenderer tekst={opcja} />
              </button>
            );
          })}
        </div>

        {pokazFeedback && !czyWybranaPop && pytanie.wskazowka && (
          <p className="tekst-2" style={{ marginTop: "var(--sp-3)", color: "var(--kolor-uwaga)" }}>
            {pytanie.wskazowka}
          </p>
        )}
      </div>
    </div>
  );
}
