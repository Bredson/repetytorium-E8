import { useState } from "react";
import testWstepny from "../../content/polski/test-wstepny.json";
import formaPisemna from "../../content/polski/forma-pisemna.json";
import { MODULY, podsumowanieDiagnozy } from "../../core/quiz.js";
import PasekPostepu from "../components/PasekPostepu.jsx";

const LITERY = ["A", "B", "C", "D", "E", "F"];
const NAZWA_POZIOMU = { braki: "do nadrobienia", czesciowy: "częściowo opanowane", solidny: "solidnie!" };

function opiszOdpowiedz(pytanie, odp) {
  if (odp === null || odp === undefined) return "(brak odpowiedzi)";
  if (pytanie.typ === "single") return `${LITERY[odp]}. ${pytanie.opcje[odp]}`;
  if (pytanie.typ === "multi")
    return odp.map((i) => `${LITERY[i]}. ${pytanie.opcje[i]}`).join("; ");
  if (pytanie.typ === "truefalse")
    return odp.map((v, i) => `${i + 1}: ${v ? "Prawda" : "Fałsz"}`).join(" · ");
  return String(odp);
}

function opiszPoprawna(pytanie) {
  if (pytanie.typ === "single")
    return `${LITERY[pytanie.poprawna]}. ${pytanie.opcje[pytanie.poprawna]}`;
  if (pytanie.typ === "multi")
    return pytanie.poprawne.map((i) => `${LITERY[i]}. ${pytanie.opcje[i]}`).join("; ");
  if (pytanie.typ === "truefalse")
    return pytanie.poprawnaMaska.map((v, i) => `${i + 1}: ${v ? "Prawda" : "Fałsz"}`).join(" · ");
  return "";
}

function PozycjaOmowienia({ pytanie, szczegol, nr }) {
  const [otwarte, setOtwarte] = useState(false);
  const klasaBadge = szczegol.poprawne ? "badge--solidny" : "badge--czesciowy";
  return (
    <div className="karta" style={{ padding: "var(--sp-4)" }}>
      <button
        onClick={() => setOtwarte(!otwarte)}
        aria-expanded={otwarte}
        style={{
          all: "unset", cursor: "pointer", display: "flex", width: "100%",
          justifyContent: "space-between", alignItems: "center", gap: "var(--sp-3)",
          minHeight: "var(--min-tap)", boxSizing: "border-box",
        }}
      >
        <span><strong>{nr}.</strong> {pytanie.tresc}</span>
        <span className={`badge ${klasaBadge}`} style={{ flexShrink: 0 }}>
          {szczegol.pkt}/{szczegol.maks} pkt
        </span>
      </button>
      {otwarte && (
        <div style={{ marginTop: "var(--sp-3)", display: "grid", gap: "var(--sp-2)", fontSize: "var(--rozmiar-s)" }}>
          <p style={{ margin: 0 }}>
            <strong>Twoja odpowiedź:</strong> {opiszOdpowiedz(pytanie, szczegol.odpowiedz)}
          </p>
          {!szczegol.poprawne && (
            <p style={{ margin: 0 }}>
              <strong>Poprawna odpowiedź:</strong> {opiszPoprawna(pytanie)}
            </p>
          )}
          {pytanie.wyjasnienie && (
            <p className="tekst-2" style={{ margin: 0, padding: "var(--sp-3)", background: "var(--kolor-akcent-tlo)", borderRadius: "var(--radius-m)" }}>
              {pytanie.wyjasnienie}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function Wynik({ profil, diagnoza, swiezy, onDalej }) {
  const [pokazOmowienie, setPokazOmowienie] = useState(false);
  const zdania = podsumowanieDiagnozy(diagnoza, profil.imie);
  const pytaniaMapa = Object.fromEntries(testWstepny.pytania.map((p) => [p.id, p]));

  return (
    <div className="tresc ekran-wjazd">
      {swiezy && (
        <div className="tekst-srodek celebracja" style={{ fontSize: 48, marginBottom: "var(--sp-2)" }} aria-hidden="true">
          🎉
        </div>
      )}
      <h1 className="tekst-srodek">{swiezy ? "Masz to za sobą!" : "Twoja diagnoza"}</h1>

      <section className="karta" style={{ display: "grid", gap: "var(--sp-4)" }}>
        <PasekPostepu
          procent={diagnoza.procent}
          etykietaLewa={`${diagnoza.wynikPkt}/${diagnoza.maksPkt} pkt`}
          etykietaPrawa={`${diagnoza.procent}%`}
          wariant={diagnoza.procent >= 80 ? "sukces" : ""}
        />
        {zdania.map((z, i) => (
          <p key={i} style={{ margin: 0 }} className={i === 0 ? "" : "tekst-2"}>{z}</p>
        ))}
      </section>

      <section className="karta" style={{ marginTop: "var(--sp-4)", display: "grid", gap: "var(--sp-3)" }}>
        <h2 style={{ margin: 0, fontSize: "var(--rozmiar-l)" }}>Wynik według obszarów</h2>
        {Object.entries(diagnoza.perModul).sort(([a], [b]) => a.localeCompare(b)).map(([m, { pkt, maks }]) => (
          <div key={m} style={{ display: "grid", gap: "var(--sp-1)" }}>
            <PasekPostepu
              procent={maks ? (100 * pkt) / maks : 0}
              etykietaLewa={`${m} · ${MODULY[m]}`}
              etykietaPrawa={`${pkt}/${maks} pkt`}
              wariant={`modul-${m.toLowerCase()}`}
            />
            <span className={`badge badge--${diagnoza.poziomPerModul[m]}`} style={{ justifySelf: "start" }}>
              {NAZWA_POZIOMU[diagnoza.poziomPerModul[m]]}
            </span>
          </div>
        ))}
      </section>

      <section style={{ marginTop: "var(--sp-4)" }}>
        {!pokazOmowienie ? (
          <button className="btn btn--pelny" onClick={() => setPokazOmowienie(true)}>
            Pokaż omówienie wszystkich odpowiedzi
          </button>
        ) : (
          <div style={{ display: "grid", gap: "var(--sp-3)" }}>
            <h2 style={{ margin: 0, fontSize: "var(--rozmiar-l)" }}>Omówienie odpowiedzi</h2>
            <p className="tekst-2 tekst-maly" style={{ margin: 0 }}>
              Kliknij pytanie, żeby zobaczyć wyjaśnienie. To najcenniejsza część — tu się uczysz.
            </p>
            {diagnoza.odpowiedzi
              .filter((s) => pytaniaMapa[s.idPytania])
              .map((s, i) => (
                <PozycjaOmowienia key={s.idPytania} nr={i + 1} pytanie={pytaniaMapa[s.idPytania]} szczegol={s} />
              ))}
            {diagnoza.odpowiedzi.some((s) => s.idPytania === formaPisemna.zadanie.id) && (
              <div className="karta" style={{ padding: "var(--sp-4)" }}>
                <strong>Zadanie pisemne ({formaPisemna.zadanie.forma}):</strong>{" "}
                {(() => {
                  const s = diagnoza.odpowiedzi.find((x) => x.idPytania === formaPisemna.zadanie.id);
                  return (
                    <span className="tekst-2">
                      {s.pkt}/{s.maks} pkt według Twojej samooceny.
                    </span>
                  );
                })()}
              </div>
            )}
          </div>
        )}
      </section>

      <button className="btn btn-primary btn--pelny" style={{ marginTop: "var(--sp-5)" }} onClick={onDalej}>
        {swiezy ? "Super, idziemy dalej" : "Wróć do startu"}
      </button>
    </div>
  );
}
