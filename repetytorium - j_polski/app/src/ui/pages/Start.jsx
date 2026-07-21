import { useState } from "react";
import { dniDoEgzaminu } from "../../core/profil.js";
import { MODULY } from "../../core/quiz.js";
import { coNaDzis } from "../../core/powtorki.js";
import { tydzienBiezacy, zadaniaNaDzis, FAZY } from "../../core/plan.js";
import { storage } from "../../storage/adapter.js";
import { DOSTEPNE } from "../../content/polski/rejestr.js";
import PasekPostepu from "../components/PasekPostepu.jsx";

const IKONY_ZADAN = { powtorka: "🔁", lektura: "📖", cwiczenia: "✏️", pisanie: "📝" };

export default function Start({ profil, postepy, onStartTest, onPokazWynik, onOtworzLekture, onOtworzPowtorke, onOtworzCwiczenie, onOtworzPisanie, onWyloguj, onZmienMotyw }) {
  const dni = dniDoEgzaminu(profil);
  const diagnoza = postepy?.diagnoza;
  const [pokazPlan, setPokazPlan] = useState(false);

  const powtorkiDzis = coNaDzis(postepy?.powtorki ?? []);
  const tydzien = tydzienBiezacy(postepy?.plan);
  const zadania = diagnoza
    ? zadaniaNaDzis(
        powtorkiDzis,
        tydzien,
        {
          lektury: postepy?.lektury ?? {},
          cwiczenia: postepy?.cwiczenia ?? {},
          pisanie: postepy?.pisanie ?? {},
        },
        DOSTEPNE
      )
    : [];

  function otworzZadanie(z) {
    if (z.typ === "powtorka") {
      const rekord = powtorkiDzis.find((p) => p.id === z.idPowtorki);
      if (rekord) onOtworzPowtorke(rekord);
    } else if (z.typ === "lektura") {
      onOtworzLekture(z.ref);
    } else if (z.typ === "cwiczenia") {
      onOtworzCwiczenie(z.ref);
    } else if (z.typ === "pisanie") {
      onOtworzPisanie(z.ref);
    }
  }

  async function eksportuj() {
    const dane = await storage.exportAll(profil.id);
    const blob = new Blob([JSON.stringify(dane, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `repetytorium-${profil.imie.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="tresc ekran-wjazd">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--sp-5)" }}>
        <div>
          <h1 style={{ marginBottom: "var(--sp-1)" }}>Cześć, {profil.imie}!</h1>
          <p className="tekst-2" style={{ margin: 0 }}>
            Do egzaminu: <strong>{dni} dni</strong> · Język polski
          </p>
        </div>
        <button className="btn btn-ghost" onClick={onWyloguj} title="Zmień profil">Wyjdź</button>
      </header>

      {!diagnoza ? (
        <section className="karta" style={{ display: "grid", gap: "var(--sp-4)" }}>
          <h2 style={{ margin: 0 }}>Krok 1: test wstępny</h2>
          <p className="tekst-2" style={{ margin: 0 }}>
            18 pytań + jedno krótkie zadanie pisemne, około 20-25 minut. To nie jest sprawdzian —
            to mapa, która pokaże, od czego zaczniemy. Nie da się go „oblać”.
          </p>
          <button className="btn btn-primary btn--pelny" onClick={onStartTest}>
            Zaczynam test wstępny
          </button>
        </section>
      ) : (
        <>
          <section className="karta" style={{ display: "grid", gap: "var(--sp-4)" }}>
            <h2 style={{ margin: 0 }}>Twoja diagnoza</h2>
            <PasekPostepu
              procent={diagnoza.procent}
              etykietaLewa={`Wynik: ${diagnoza.wynikPkt}/${diagnoza.maksPkt} pkt`}
              etykietaPrawa={`${diagnoza.procent}%`}
              wariant={diagnoza.procent >= 80 ? "sukces" : ""}
            />
            <div style={{ display: "grid", gap: "var(--sp-3)" }}>
              {Object.entries(diagnoza.perModul).sort(([a], [b]) => a.localeCompare(b)).map(([m, { pkt, maks }]) => (
                <div key={m} style={{ display: "grid", gap: "var(--sp-1)" }}>
                  <PasekPostepu
                    procent={maks ? (100 * pkt) / maks : 0}
                    etykietaLewa={`${m} · ${MODULY[m]}`}
                    etykietaPrawa={`${pkt}/${maks}`}
                    wariant={`modul-${m.toLowerCase()}`}
                  />
                </div>
              ))}
            </div>
            <button className="btn btn--pelny" onClick={onPokazWynik}>
              Zobacz szczegóły i omówienie odpowiedzi
            </button>
          </section>

          <section className="karta" style={{ marginTop: "var(--sp-4)", display: "grid", gap: "var(--sp-3)" }}>
            <h3 style={{ margin: 0 }}>Na dziś</h3>
            {powtorkiDzis.length > 0 && (
              <p className="tekst-2 tekst-maly" style={{ margin: 0 }}>
                {powtorkiDzis.length === 1 ? "Powtórka czeka" : "Powtórki czekają"} na Ciebie —
                zrób je najpierw, zajmą tylko chwilę.
              </p>
            )}
            {zadania.length === 0 && (
              <p className="tekst-2" style={{ margin: 0 }}>
                Wszystko na dziś zrobione — możesz odpocząć albo wrócić do kompendium lektury.
              </p>
            )}
            {zadania.map((z, i) => (
              <button
                key={i}
                className="opcja"
                onClick={() => otworzZadanie(z)}
                disabled={z.wkrotce}
                style={{ justifyContent: "space-between" }}
              >
                <span style={{ display: "flex", gap: "var(--sp-3)", alignItems: "center" }}>
                  <span aria-hidden="true">{IKONY_ZADAN[z.typ] ?? "•"}</span>
                  <span>{z.tytul}{z.wkrotce ? " (wkrótce)" : ""}</span>
                </span>
                <span className="tekst-2 tekst-maly" style={{ whiteSpace: "nowrap" }}>~{z.czasMin} min</span>
              </button>
            ))}
          </section>

          {postepy.plan && tydzien && (
            <section className="karta" style={{ marginTop: "var(--sp-4)", display: "grid", gap: "var(--sp-3)" }}>
              <h3 style={{ margin: 0 }}>
                Tydzień {tydzien.nrTygodnia} z {postepy.plan.tygodnie.length}
              </h3>
              <p className="tekst-2 tekst-maly" style={{ margin: 0 }}>{FAZY[tydzien.faza]}</p>
              <ul style={{ margin: 0, paddingLeft: "1.2em", display: "grid", gap: "var(--sp-1)" }}>
                {tydzien.tematy.map((t, i) => (
                  <li key={i} className="tekst-2">
                    <strong>{t.modul}</strong> · {t.temat}
                  </li>
                ))}
              </ul>
              <button className="btn btn-ghost" onClick={() => setPokazPlan(!pokazPlan)}>
                {pokazPlan ? "Zwiń pełny plan" : "Pokaż pełny plan do egzaminu"}
              </button>
              {pokazPlan && (
                <div style={{ display: "grid", gap: "var(--sp-2)" }}>
                  {postepy.plan.tygodnie.map((t) => (
                    <div
                      key={t.nrTygodnia}
                      className="tekst-2 tekst-maly"
                      style={{
                        padding: "var(--sp-2) var(--sp-3)",
                        borderRadius: "var(--radius-m)",
                        background: t.nrTygodnia === tydzien.nrTygodnia ? "var(--kolor-sukces-tlo)" : "var(--kolor-powierzchnia-2)",
                      }}
                    >
                      <strong>Tydz. {t.nrTygodnia}</strong> ({t.od} – {t.do}) · faza {t.faza} ·{" "}
                      {t.tematy.map((x) => x.modul).join(" + ")}
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </>
      )}

      <footer style={{ display: "flex", gap: "var(--sp-2)", marginTop: "var(--sp-5)", flexWrap: "wrap" }}>
        <button className="btn btn-ghost" onClick={onZmienMotyw}>
          {profil.preferencje.trybCiemny ? "Jasny motyw" : "Ciemny motyw"}
        </button>
        <button className="btn btn-ghost" onClick={eksportuj}>Zapisz postępy do pliku</button>
      </footer>
    </div>
  );
}
