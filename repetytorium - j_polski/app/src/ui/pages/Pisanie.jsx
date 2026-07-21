import { useState } from "react";
import { ocenSamoocene } from "../../core/quiz.js";

/**
 * Krótka forma pisemna (moduł F): polecenie + plan formy → tekst ucznia →
 * wzorzec + samoocena checklistą → podsumowanie.
 * Wzorzec pokazujemy DOPIERO po napisaniu własnego tekstu.
 */
export default function Pisanie({ tresc, onGotowe, onWroc }) {
  const zadanie = tresc.zadanie;
  const [etap, setEtap] = useState("pisz"); // pisz | samoocena | final
  const [tekst, setTekst] = useState("");
  const [kryteria, setKryteria] = useState(zadanie.kryteriaSamooceny.map(() => false));
  const [wynik, setWynik] = useState(null);

  const minSlow = zadanie.minSlow ?? 20;
  const dlugaForma = minSlow >= 100;
  const slow = tekst.trim().split(/\s+/).filter(Boolean).length;

  function zakoncz() {
    const w = ocenSamoocene(zadanie, kryteria);
    const zapis = {
      data: new Date().toISOString().slice(0, 10),
      pkt: w.pkt,
      maks: w.maks,
      kryteria,
      tekst,
    };
    setWynik(w);
    onGotowe(zapis);
    setEtap("final");
  }

  if (etap === "final") {
    const komplet = wynik.pkt === wynik.maks;
    return (
      <div className="tresc ekran-wjazd" style={{ maxWidth: 560 }}>
        <div className="karta tekst-srodek" style={{ display: "grid", gap: "var(--sp-4)" }}>
          <div className={komplet ? "celebracja" : ""} style={{ fontSize: 48 }} aria-hidden="true">
            {komplet ? "🏆" : "✍️"}
          </div>
          <h1 style={{ margin: 0 }}>{komplet ? "Wzorowa robota!" : "Tekst napisany!"}</h1>
          <p className="tekst-2" style={{ margin: 0 }}>
            Samoocena: <strong>{wynik.spelnione}/{wynik.wszystkie} kryteriów</strong> ({wynik.pkt}/{wynik.maks} pkt).{" "}
            {komplet
              ? "Tak wygląda odpowiedź na pełną punktację egzaminacyjną — zapamiętaj ten schemat."
              : "Zajrzyj jeszcze raz do kryteriów, których zabrakło — na egzaminie każda z tych informacji to punkt. Następna forma pisemna już za tydzień."}
          </p>
          <button className="btn btn-primary btn--pelny" onClick={onWroc}>
            Wróć do planu
          </button>
        </div>
      </div>
    );
  }

  if (etap === "samoocena") {
    return (
      <div className="tresc ekran-wjazd">
        <h2>Porównaj swoją pracę ze wzorcem</h2>
        <div className="karta" style={{ display: "grid", gap: "var(--sp-4)" }}>
          <div>
            <p className="pole-etykieta">Twoja praca:</p>
            <p style={{ whiteSpace: "pre-wrap", background: "var(--kolor-powierzchnia-2)", padding: "var(--sp-4)", borderRadius: "var(--radius-m)", margin: 0 }}>
              {tekst}
            </p>
          </div>
          <div>
            <p className="pole-etykieta">Przykładowa wzorcowa realizacja:</p>
            <p style={{ whiteSpace: "pre-wrap", background: "var(--kolor-sukces-tlo)", padding: "var(--sp-4)", borderRadius: "var(--radius-m)", margin: 0 }}>
              {zadanie.wzorzec}
            </p>
          </div>
          <div>
            <p className="pole-etykieta">Zaznacz uczciwie, co udało Ci się spełnić:</p>
            {zadanie.kryteriaSamooceny.map((k, i) => (
              <label key={i} style={{ display: "flex", gap: "var(--sp-3)", alignItems: "flex-start", minHeight: "var(--min-tap)", cursor: "pointer", padding: "var(--sp-2) 0" }}>
                <input type="checkbox" checked={kryteria[i]} style={{ width: 20, height: 20, marginTop: 2 }}
                  onChange={(e) => setKryteria(kryteria.map((v, j) => (j === i ? e.target.checked : v)))} />
                <span>{k}</span>
              </label>
            ))}
          </div>
          <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap" }}>
            <button className="btn" onClick={() => setEtap("pisz")}>Wracam poprawić tekst</button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={zakoncz}>
              Zapisz samoocenę
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tresc ekran-wjazd">
      <header style={{ marginBottom: "var(--sp-4)" }}>
        <button className="btn btn-ghost" onClick={onWroc} style={{ marginBottom: "var(--sp-3)" }}>
          ← Wróć
        </button>
        <h1 style={{ marginBottom: "var(--sp-1)" }}>{tresc.tytul}</h1>
        <p className="tekst-2" style={{ margin: 0 }}>Moduł F · Tworzenie wypowiedzi</p>
      </header>

      <div className="karta" style={{ display: "grid", gap: "var(--sp-4)" }}>
        <p className="tekst-2" style={{ margin: 0 }}>{tresc.pigulka}</p>
        <div>
          <p className="pole-etykieta">Z czego składa się {tresc.forma}:</p>
          <ul style={{ margin: 0, paddingLeft: "1.2em", display: "grid", gap: "var(--sp-1)" }}>
            {tresc.planFormy.map((p, i) => (
              <li key={i} className="tekst-2">{p}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="karta" style={{ marginTop: "var(--sp-4)", display: "grid", gap: "var(--sp-4)" }}>
        <h2 style={{ margin: 0, fontSize: "var(--rozmiar-l)" }}>{zadanie.tresc}</h2>
        <textarea
          className="pole"
          rows={dlugaForma ? 16 : 7}
          value={tekst}
          onChange={(e) => setTekst(e.target.value)}
          placeholder="Pisz tutaj…"
          aria-label="Twój tekst"
        />
        <p className="tekst-2 tekst-maly" style={{ margin: 0 }}>
          Liczba wyrazów: {slow}
          {slow < minSlow
            ? ` — potrzebujesz co najmniej ${minSlow}${dlugaForma ? " (poniżej tego progu tracisz punkty na egzaminie)" : ""}`
            : " ✓"}
        </p>
        <button className="btn btn-primary btn--pelny" disabled={slow < minSlow} onClick={() => setEtap("samoocena")}>
          Gotowe — porównuję ze wzorcem
        </button>
      </div>
    </div>
  );
}
