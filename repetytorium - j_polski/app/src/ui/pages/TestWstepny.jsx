import { useMemo, useState } from "react";
import testWstepny from "../../content/polski/test-wstepny.json";
import formaPisemna from "../../content/polski/forma-pisemna.json";
import { policzWynikDiagnozy } from "../../core/quiz.js";
import PasekPostepu from "../components/PasekPostepu.jsx";

const LITERY = ["A", "B", "C", "D", "E", "F"];

function OpcjeSingle({ pytanie, odpowiedz, ustaw }) {
  return pytanie.opcje.map((opcja, i) => (
    <button
      key={i}
      className={`opcja${odpowiedz === i ? " opcja--wybrana" : ""}`}
      onClick={() => ustaw(i)}
      aria-pressed={odpowiedz === i}
    >
      <span className="opcja-litera" aria-hidden="true">{LITERY[i]}</span>
      <span>{opcja}</span>
    </button>
  ));
}

function OpcjeMulti({ pytanie, odpowiedz, ustaw }) {
  const wybrane = odpowiedz ?? [];
  const przelacz = (i) =>
    ustaw(wybrane.includes(i) ? wybrane.filter((x) => x !== i) : [...wybrane, i].sort());
  return (
    <>
      <p className="tekst-2 tekst-maly">Możesz zaznaczyć więcej niż jedną odpowiedź.</p>
      {pytanie.opcje.map((opcja, i) => (
        <button
          key={i}
          className={`opcja${wybrane.includes(i) ? " opcja--wybrana" : ""}`}
          onClick={() => przelacz(i)}
          aria-pressed={wybrane.includes(i)}
        >
          <span className="opcja-litera" aria-hidden="true">{LITERY[i]}</span>
          <span>{opcja}</span>
        </button>
      ))}
    </>
  );
}

function OpcjeTrueFalse({ pytanie, odpowiedz, ustaw }) {
  const maska = odpowiedz ?? pytanie.opcje.map(() => null);
  const ustawJedno = (i, wartosc) => {
    const nowa = [...maska];
    nowa[i] = wartosc;
    ustaw(nowa);
  };
  return pytanie.opcje.map((zdanie, i) => (
    <div key={i} className="karta" style={{ padding: "var(--sp-4)", marginBottom: "var(--sp-3)" }}>
      <p style={{ marginBottom: "var(--sp-3)" }}>{zdanie}</p>
      <div style={{ display: "flex", gap: "var(--sp-2)" }}>
        <button
          className={`btn${maska[i] === true ? " btn-primary" : ""}`}
          onClick={() => ustawJedno(i, true)}
          aria-pressed={maska[i] === true}
        >
          Prawda
        </button>
        <button
          className={`btn${maska[i] === false ? " btn-primary" : ""}`}
          onClick={() => ustawJedno(i, false)}
          aria-pressed={maska[i] === false}
        >
          Fałsz
        </button>
      </div>
    </div>
  ));
}

function czyOdpowiedziano(pytanie, odp) {
  if (odp === null || odp === undefined) return false;
  if (pytanie.typ === "single") return typeof odp === "number";
  if (pytanie.typ === "multi") return Array.isArray(odp) && odp.length > 0;
  if (pytanie.typ === "truefalse") return Array.isArray(odp) && odp.every((v) => v === true || v === false);
  return false;
}

export default function TestWstepny({ onGotowe, onPrzerwij }) {
  const pytania = useMemo(() => testWstepny.pytania, []);
  const zadanie = formaPisemna.zadanie;

  // etap: "intro" | indeks pytania (number) | "forma" | "samoocena"
  const [etap, setEtap] = useState("intro");
  const [odpowiedzi, setOdpowiedzi] = useState({});
  const [tekstFormy, setTekstFormy] = useState("");
  const [kryteria, setKryteria] = useState(zadanie.kryteriaSamooceny.map(() => false));

  const razemKrokow = pytania.length + 1;

  function zakoncz(zSamoocena) {
    const forma = zSamoocena
      ? { zadanie, kryteria, tekst: tekstFormy }
      : { zadanie, kryteria: zadanie.kryteriaSamooceny.map(() => false), tekst: tekstFormy };
    onGotowe(policzWynikDiagnozy(pytania, odpowiedzi, forma));
  }

  if (etap === "intro") {
    return (
      <div className="tresc ekran-wjazd" style={{ maxWidth: 560 }}>
        <h1>Test wstępny</h1>
        <div className="karta" style={{ display: "grid", gap: "var(--sp-4)" }}>
          <p style={{ margin: 0 }}>
            Przed Tobą <strong>{pytania.length} pytań</strong> i jedno krótkie zadanie pisemne
            (~20-25 minut). Zaczynamy od łatwiejszych — trudniejsze przyjdą później.
          </p>
          <p className="tekst-2" style={{ margin: 0 }}>
            Odpowiadaj tak, jak umiesz teraz — bez zgadywania „na siłę” i bez sprawdzania w
            książkach. Im szczerszy wynik, tym lepszy plan nauki dla Ciebie. Możesz wracać do
            poprzednich pytań.
          </p>
          <button className="btn btn-primary btn--pelny" onClick={() => setEtap(0)}>
            Start
          </button>
          <button className="btn btn-ghost btn--pelny" onClick={onPrzerwij}>Jednak później</button>
        </div>
      </div>
    );
  }

  if (etap === "forma") {
    const slow = tekstFormy.trim().split(/\s+/).filter(Boolean).length;
    return (
      <div className="tresc ekran-wjazd">
        <PasekPostepu procent={(pytania.length / razemKrokow) * 100}
          etykietaLewa={`Ostatni krok: zadanie pisemne`} etykietaPrawa={`${pytania.length + 1} z ${razemKrokow}`} />
        <div className="karta" style={{ marginTop: "var(--sp-4)", display: "grid", gap: "var(--sp-4)" }}>
          <h2 style={{ margin: 0, fontSize: "var(--rozmiar-l)" }}>{zadanie.tresc}</h2>
          <textarea
            className="pole"
            rows={7}
            value={tekstFormy}
            onChange={(e) => setTekstFormy(e.target.value)}
            placeholder="Pisz tutaj…"
            aria-label="Twoja odpowiedź"
          />
          <p className="tekst-2 tekst-maly" style={{ margin: 0 }}>Liczba słów: {slow}</p>
          <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap" }}>
            <button className="btn" onClick={() => setEtap(pytania.length - 1)}>Wstecz</button>
            <button className="btn btn-primary" style={{ flex: 1 }} disabled={slow < 10}
              onClick={() => setEtap("samoocena")}>
              Gotowe — sprawdzam swoją pracę
            </button>
          </div>
          <button className="btn btn-ghost btn--pelny" onClick={() => zakoncz(false)}>
            Pomiń zadanie pisemne i zakończ test
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
              {tekstFormy}
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
          <button className="btn btn-primary btn--pelny celebracja" onClick={() => zakoncz(true)}>
            Zakończ test i pokaż wynik
          </button>
        </div>
      </div>
    );
  }

  const i = etap;
  const pytanie = pytania[i];
  const odp = odpowiedzi[pytanie.id] ?? null;
  const ustaw = (wartosc) => setOdpowiedzi({ ...odpowiedzi, [pytanie.id]: wartosc });
  const odpowiedziano = czyOdpowiedziano(pytanie, odp);

  return (
    <div className="tresc ekran-wjazd" key={pytanie.id}>
      <PasekPostepu procent={((i + 1) / razemKrokow) * 100}
        etykietaLewa={`Pytanie ${i + 1} z ${pytania.length}`} etykietaPrawa={`+ zadanie pisemne`} />

      <div className="karta" style={{ marginTop: "var(--sp-4)" }}>
        {pytanie.zrodloTekst && (
          <blockquote style={{
            margin: `0 0 var(--sp-4)`, padding: "var(--sp-4)",
            background: "var(--kolor-powierzchnia-2)", borderRadius: "var(--radius-m)",
            fontSize: "var(--rozmiar-s)", borderLeft: "4px solid var(--modul-e)",
          }}>
            {pytanie.zrodloTekst}
          </blockquote>
        )}
        <h2 style={{ fontSize: "var(--rozmiar-l)" }}>{pytanie.tresc}</h2>

        {pytanie.typ === "single" && <OpcjeSingle pytanie={pytanie} odpowiedz={odp} ustaw={ustaw} />}
        {pytanie.typ === "multi" && <OpcjeMulti pytanie={pytanie} odpowiedz={odp} ustaw={ustaw} />}
        {pytanie.typ === "truefalse" && <OpcjeTrueFalse pytanie={pytanie} odpowiedz={odp} ustaw={ustaw} />}

        <div style={{ display: "flex", gap: "var(--sp-2)", marginTop: "var(--sp-4)" }}>
          {i > 0 && (
            <button className="btn" onClick={() => setEtap(i - 1)}>Wstecz</button>
          )}
          <button
            className="btn btn-primary"
            style={{ flex: 1 }}
            disabled={!odpowiedziano}
            onClick={() => setEtap(i + 1 < pytania.length ? i + 1 : "forma")}
          >
            {i + 1 < pytania.length ? "Dalej" : "Ostatni krok: zadanie pisemne"}
          </button>
        </div>
      </div>
    </div>
  );
}
