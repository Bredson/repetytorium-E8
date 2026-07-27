import { DZIALY } from "../../content/matematyka/rejestr.js";
import { seriaWynikow, postepPerDzial, aktywnosc, pokrycie } from "../../core/statystyki.js";
import PasekPostepu from "../components/PasekPostepu.jsx";
import WykresLiniowy from "../components/WykresLiniowy.jsx";

function Delta({ delta }) {
  if (delta > 0) return <span style={{ color: "var(--kolor-sukces)", whiteSpace: "nowrap" }}>▲ +{delta} pp</span>;
  if (delta < 0) return <span style={{ color: "var(--kolor-uwaga)", whiteSpace: "nowrap" }}>▽ {delta} pp</span>;
  return <span className="tekst-2" style={{ whiteSpace: "nowrap" }}>=</span>;
}

export default function Statystyki({ postepy, onWroc }) {
  const kolejnosc = Object.keys(DZIALY);
  const mapaEtykiet = Object.fromEntries(kolejnosc.map((id) => [id, DZIALY[id].tytul]));
  const seria = seriaWynikow(postepy, mapaEtykiet);
  const dzialy = postepPerDzial(postepy, kolejnosc);
  const { tygodnie, seriaDni } = aktywnosc(postepy);
  const { dzialy: pokrycieDzialow, egzaminy } = pokrycie(postepy, kolejnosc.length);

  const ostatni = seria[seria.length - 1];
  const najlepszy = seria.length > 0 ? seria.reduce((a, b) => (b.procent > a.procent ? b : a), seria[0]) : null;
  const maksTydzien = Math.max(1, ...tygodnie.map((t) => t.liczba));

  return (
    <div className="tresc ekran-wjazd">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--sp-5)" }}>
        <h1 style={{ margin: 0 }}>📊 Twoje statystyki</h1>
        <button className="btn btn-ghost" onClick={onWroc}>Wróć</button>
      </header>

      <section className="karta" style={{ display: "grid", gap: "var(--sp-4)" }}>
        <h2 style={{ margin: 0 }}>Twoja droga</h2>
        <WykresLiniowy punkty={seria} liniaOdniesienia={80} />
        {seria.length <= 1 ? (
          <p className="tekst-2" style={{ margin: 0 }}>
            Każda sesja doda punkt na tej mapie — diagnoza, działy, egzaminy próbne. Zobaczysz tu swoją drogę do celu.
          </p>
        ) : (
          <p className="tekst-2 tekst-maly" style={{ margin: 0 }}>
            Ostatnio: <strong>{ostatni.etykieta} — {ostatni.procent}%</strong> · Najlepszy wynik:{" "}
            <strong>{najlepszy.etykieta} — {najlepszy.procent}%</strong>
          </p>
        )}
      </section>

      <section className="karta" style={{ marginTop: "var(--sp-4)", display: "grid", gap: "var(--sp-3)" }}>
        <h2 style={{ margin: 0 }}>Działy: diagnoza → dziś</h2>
        {kolejnosc.map((id) => (
          <div key={id} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "var(--sp-3)", alignItems: "end" }}>
            <PasekPostepu
              procent={dzialy[id].teraz}
              etykietaLewa={DZIALY[id].tytul}
              etykietaPrawa={`${dzialy[id].diagnoza}% → ${dzialy[id].teraz}%`}
            />
            <Delta delta={dzialy[id].delta} />
          </div>
        ))}
        <p className="tekst-2 tekst-maly" style={{ margin: 0 }}>pp = punkty procentowe względem testu wstępnego</p>
      </section>

      <section className="karta" style={{ marginTop: "var(--sp-4)", display: "grid", gap: "var(--sp-3)" }}>
        <h2 style={{ margin: 0 }}>Regularność</h2>
        <p style={{ margin: 0 }}>
          {seriaDni > 0
            ? <>🔥 <strong>{seriaDni} {seriaDni === 1 ? "dzień" : "dni"} z rzędu</strong> — tak trzymaj!</>
            : <>Zacznij dziś nową serię 🌱</>}
        </p>
        <svg viewBox="0 0 600 120" style={{ width: "100%", height: "auto", display: "block" }} role="img" aria-label="Sesje w ostatnich 8 tygodniach">
          {tygodnie.map((t, i) => {
            const wys = t.liczba === 0 ? 3 : 12 + (t.liczba / maksTydzien) * 80;
            return (
              <g key={t.od}>
                <rect
                  x={20 + i * 72} y={100 - wys} width="48" height={wys} rx="6"
                  fill={t.liczba === 0 ? "var(--kolor-powierzchnia-2)" : "var(--kolor-akcent)"}
                />
                {t.liczba > 0 && (
                  <text x={44 + i * 72} y={100 - wys - 6} textAnchor="middle" fontSize="12" fill="var(--kolor-tekst-2)">{t.liczba}</text>
                )}
                <text x={44 + i * 72} y={116} textAnchor="middle" fontSize="10" fill="var(--kolor-tekst-2)">
                  {t.od.slice(5, 10).split("-").reverse().join(".")}
                </text>
              </g>
            );
          })}
        </svg>
        <p className="tekst-2 tekst-maly" style={{ margin: 0 }}>Sesje w kolejnych tygodniach (data = poniedziałek)</p>
      </section>

      <section className="karta" style={{ marginTop: "var(--sp-4)", display: "grid", gap: "var(--sp-3)" }}>
        <h2 style={{ margin: 0 }}>Pokrycie materiału</h2>
        <PasekPostepu
          procent={pokrycieDzialow.wszystkie ? (100 * pokrycieDzialow.zrobione) / pokrycieDzialow.wszystkie : 0}
          etykietaLewa="Ukończone działy"
          etykietaPrawa={`${pokrycieDzialow.zrobione} z ${pokrycieDzialow.wszystkie}`}
          wariant={pokrycieDzialow.zrobione === pokrycieDzialow.wszystkie && pokrycieDzialow.wszystkie > 0 ? "sukces" : ""}
        />
        <p className="tekst-2" style={{ margin: 0 }}>
          Egzaminy próbne: <strong>{egzaminy}</strong>
        </p>
      </section>
    </div>
  );
}
