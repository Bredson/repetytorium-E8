import { useState } from "react";
import PasekPostepu from "./PasekPostepu.jsx";

/**
 * Sesja fiszek: duża karta, tap = odwrócenie, samoocena dwoma przyciskami.
 * "Jeszcze nie" wraca na koniec talii. onGotowe({umiem, jeszczeNie, razem}).
 */
export default function FiszkiSesja({ fiszki, tytul, onGotowe }) {
  const [kolejka, setKolejka] = useState(fiszki.map((f) => f.id));
  const [odwrocona, setOdwrocona] = useState(false);
  const [oceny, setOceny] = useState({}); // id -> "umiem" | "jeszcze-nie" (pierwsza ocena się liczy)
  const [zrobione, setZrobione] = useState(0);

  const mapa = Object.fromEntries(fiszki.map((f) => [f.id, f]));
  const aktualnaId = kolejka[0];
  const fiszka = mapa[aktualnaId];

  function ocen(ocena) {
    const noweOceny = oceny[aktualnaId] ? oceny : { ...oceny, [aktualnaId]: ocena };
    const reszta = kolejka.slice(1);
    setOdwrocona(false);

    if (ocena === "jeszcze-nie") {
      // wraca na koniec kolejki — utrwalamy w tej samej sesji
      setOceny(noweOceny);
      setKolejka([...reszta, aktualnaId]);
      return;
    }

    setZrobione(zrobione + 1);
    if (reszta.length === 0) {
      const wartosci = Object.values(noweOceny);
      onGotowe({
        umiem: wartosci.filter((o) => o === "umiem").length,
        jeszczeNie: wartosci.filter((o) => o === "jeszcze-nie").length,
        razem: fiszki.length,
      });
      return;
    }
    setOceny(noweOceny);
    setKolejka(reszta);
  }

  return (
    <div className="ekran-wjazd">
      <PasekPostepu
        procent={(zrobione / fiszki.length) * 100}
        etykietaLewa={tytul}
        etykietaPrawa={`zostało ${kolejka.length}`}
      />

      <button
        className="karta"
        onClick={() => setOdwrocona(!odwrocona)}
        aria-label={odwrocona ? "Pokaż pytanie" : "Pokaż odpowiedź"}
        style={{
          marginTop: "var(--sp-4)",
          width: "100%",
          minHeight: 220,
          display: "grid",
          placeItems: "center",
          textAlign: "center",
          cursor: "pointer",
          font: "inherit",
          color: "inherit",
          background: odwrocona ? "var(--kolor-sukces-tlo)" : "var(--kolor-powierzchnia)",
        }}
      >
        <div style={{ display: "grid", gap: "var(--sp-3)" }}>
          <span className="tekst-2 tekst-maly" style={{ textTransform: "uppercase", letterSpacing: 1 }}>
            {odwrocona ? "Odpowiedź" : fiszka.kategoria}
          </span>
          <span style={{ fontSize: "var(--rozmiar-l)", fontWeight: 600 }}>
            {odwrocona ? fiszka.tyl : fiszka.przod}
          </span>
          {!odwrocona && <span className="tekst-2 tekst-maly">dotknij, aby odwrócić</span>}
        </div>
      </button>

      {odwrocona && (
        <div style={{ display: "flex", gap: "var(--sp-2)", marginTop: "var(--sp-4)" }}>
          <button className="btn" style={{ flex: 1 }} onClick={() => ocen("jeszcze-nie")}>
            Jeszcze nie
          </button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => ocen("umiem")}>
            Umiem!
          </button>
        </div>
      )}
    </div>
  );
}
