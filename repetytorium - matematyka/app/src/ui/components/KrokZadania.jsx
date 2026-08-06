import { useState } from "react";
import KaTeXRenderer from "./KaTeXRenderer.jsx";
import { sprawdzKrok } from "../../core/quiz.js";

export default function KrokZadania({ krok, numerKroku, onPoprawnie, onBlad }) {
  const [wartosc, setWartosc] = useState("");
  const [status, setStatus] = useState(""); // "" | "ok" | "blad" | "podpowiedz"
  const [proby, setProby] = useState(0);

  function sprawdz(e) {
    e.preventDefault();
    if (sprawdzKrok(krok, wartosc)) {
      setStatus("ok");
      onPoprawnie(wartosc);
    } else {
      const noweProby = proby + 1;
      setProby(noweProby);
      if (noweProby >= 2) {
        setStatus("podpowiedz");
        onBlad(wartosc);
      } else {
        setStatus("blad");
      }
    }
  }

  return (
    <div className="karta" style={{ marginBottom: "var(--sp-4)" }}>
      <p style={{ marginBottom: "var(--sp-3)" }}>
        <strong>Krok {numerKroku}:</strong> <KaTeXRenderer tekst={krok.instrukcja} />
      </p>

      {status === "ok" && (
        <p className="badge badge--sukces">Dobrze! {krok.jednostka && <KaTeXRenderer tekst={`$${wartosc} \\text{ ${krok.jednostka}}$`} />}</p>
      )}

      {status !== "ok" && (
        <form onSubmit={sprawdz} style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap" }}>
          <input
            className="pole"
            value={wartosc}
            onChange={(e) => { setWartosc(e.target.value); setStatus(""); }}
            placeholder={krok.jednostka ? `Wpisz wynik (${krok.jednostka})` : "Wpisz wynik"}
            inputMode="decimal"
            style={{ flex: 1, minWidth: 120 }}
          />
          <button type="submit" className="btn btn-primary" disabled={!wartosc.trim()}>Sprawdź</button>
        </form>
      )}

      {status === "blad" && (
        <p className="badge badge--braki" role="alert" style={{ marginTop: "var(--sp-2)" }}>
          Spróbuj jeszcze raz.
        </p>
      )}

      {status === "podpowiedz" && (
        <div style={{ marginTop: "var(--sp-3)" }}>
          <p className="badge badge--uwaga"><KaTeXRenderer tekst={`Wskazówka: ${krok.podpowiedz}`} /></p>
          <p style={{ marginTop: "var(--sp-2)" }}>
            <strong>Rozwiązanie wzorcowe: </strong>
            <KaTeXRenderer tekst={`$${krok.oczekiwana}$ ${krok.jednostka ?? ""}`} />
          </p>
        </div>
      )}
    </div>
  );
}
