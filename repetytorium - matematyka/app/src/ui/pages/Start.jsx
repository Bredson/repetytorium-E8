import { DZIALY } from "../../content/matematyka/rejestr.js";
import PasekPostepu from "../components/PasekPostepu.jsx";
import { coNaDzis, dataDnia } from "../../core/powtorki.js";

const KOLORY_MODULOW = {
  A: "#7c5cd6", B: "#2b8fb8", C: "#c9701b", D: "#c14b7e",
  E: "#3a9e6e", F: "#5a6ee0", G: "#e05a5a", H: "#e09d5a", I: "#5ae0c1",
};

export default function Start({ profil, postepy, onTestWstepny, onDzial, onStatystyki, onWyloguj }) {
  const dzialy = Object.values(DZIALY);
  const powtorkiDzis = coNaDzis(postepy.powtorki ?? [], dataDnia());

  const nadzisDzial = postepy.plan?.find((p) => p.status === "do-zrobienia") ?? null;

  return (
    <div className="tresc ekran-wjazd">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--sp-5)" }}>
        <h1 style={{ margin: 0 }}>Cześć, {profil.imie}!</h1>
        <button className="btn btn-ghost" onClick={onWyloguj}>Wyloguj</button>
      </div>

      {!postepy.diagnoza && (
        <div className="karta" style={{ marginBottom: "var(--sp-5)", background: "var(--kolor-akcent-tlo)", borderLeft: "4px solid var(--kolor-akcent)" }}>
          <p><strong>Zacznij od diagnozy</strong> — sprawdzimy, co już wiesz, i ułożymy plan nauki.</p>
          <button className="btn btn-primary" style={{ marginTop: "var(--sp-3)" }} onClick={onTestWstepny}>
            Rozpocznij diagnozę
          </button>
        </div>
      )}

      {powtorkiDzis.length > 0 && (
        <div className="karta" style={{ marginBottom: "var(--sp-4)", borderLeft: "4px solid var(--kolor-uwaga)" }}>
          <strong>Na dziś: {powtorkiDzis.length} powtórki</strong>
          <p className="tekst-2">Masz zaplanowane powtórki — wróć do działu, żeby je zrobić.</p>
        </div>
      )}

      <h2>Twoje działy</h2>
      <div style={{ display: "grid", gap: "var(--sp-3)" }}>
        {dzialy.map((d) => {
          const stan = postepy.dzialy?.[d.id];
          const procent = stan ? Math.round((stan.wynik ?? 0) * 100) : 0;
          const kolor = KOLORY_MODULOW[d.modul] ?? "var(--kolor-akcent)";
          const aktywny = nadzisDzial?.dzialId === d.id;

          return (
            <button
              key={d.id}
              className="karta karta--klikalna"
              style={{ textAlign: "left", font: "inherit", borderLeft: `4px solid ${kolor}`, outline: aktywny ? `2px solid ${kolor}` : undefined }}
              onClick={() => onDzial(d.id)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>
                  <strong>{d.tytul}</strong>
                  {aktywny && <span className="badge badge--akcent" style={{ marginLeft: "var(--sp-2)" }}>Na dziś</span>}
                </span>
                <span className="tekst-2 tekst-maly">{stan ? `${procent}%` : "—"}</span>
              </div>
              <PasekPostepu procent={procent} />
            </button>
          );
        })}
      </div>

      <div style={{ display: "grid", gap: "var(--sp-3)", marginTop: "var(--sp-5)" }}>
        <button className="btn btn-ghost btn--pelny" onClick={onStatystyki}>Twoje statystyki</button>
      </div>
    </div>
  );
}
