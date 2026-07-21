import { useState } from "react";

/** Zwijana sekcja treści (kompendium lektury, teoria ćwiczeń) z opcjonalnym „przeczytane". */
export default function Sekcja({ tytul, czasMin, przeczytana, onPrzeczytana, children }) {
  const [otwarta, setOtwarta] = useState(false);
  return (
    <div className="karta" style={{ padding: "var(--sp-4)" }}>
      <button
        onClick={() => setOtwarta(!otwarta)}
        aria-expanded={otwarta}
        style={{
          all: "unset",
          cursor: "pointer",
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "var(--sp-3)",
          minHeight: "var(--min-tap)",
          boxSizing: "border-box",
        }}
      >
        <span style={{ fontWeight: 600 }}>
          {przeczytana ? "✓ " : ""}{tytul}
        </span>
        <span className="tekst-2 tekst-maly" style={{ whiteSpace: "nowrap" }}>
          {czasMin ? `~${czasMin} min ` : ""}{otwarta ? "▴" : "▾"}
        </span>
      </button>
      {otwarta && (
        <div style={{ marginTop: "var(--sp-3)", display: "grid", gap: "var(--sp-3)" }}>
          {children}
          {onPrzeczytana && !przeczytana && (
            <button className="btn btn--pelny" onClick={onPrzeczytana}>
              Przeczytane — zaznacz
            </button>
          )}
        </div>
      )}
    </div>
  );
}
