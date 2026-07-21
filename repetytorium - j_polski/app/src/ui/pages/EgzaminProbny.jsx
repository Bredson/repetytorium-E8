import { useEffect, useMemo, useState } from "react";
import {
  CZAS_EGZAMINU_MIN,
  MIN_SLOW_WYPRACOWANIA,
  PROG_SLOW_PELNA_OCENA,
  MAKS_PKT_PONIZEJ_PROGU,
  zbudujArkusz,
  policzWynikEgzaminu,
  policzSlowa,
} from "../../core/egzamin.js";
import { MODULY } from "../../core/quiz.js";
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

/** Pasek czasu egzaminu: informacyjny, bez wymuszania końca (bursztyn <30 min). */
function Zegar({ start }) {
  const [teraz, setTeraz] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setTeraz(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const zostalo = CZAS_EGZAMINU_MIN * 60000 - (teraz - start);
  if (zostalo <= 0) {
    return (
      <p className="tekst-maly" role="status" style={{
        margin: "0 0 var(--sp-3)", padding: "var(--sp-2) var(--sp-3)",
        background: "var(--kolor-uwaga-tlo, #fdf3d7)", borderRadius: "var(--radius-m)",
      }}>
        ⏱ Czas minął — na prawdziwym egzaminie tu byłby koniec. Dokończ spokojnie, ale zapamiętaj to tempo.
      </p>
    );
  }
  const sek = Math.floor(zostalo / 1000);
  const malo = zostalo < 30 * 60000;
  const format = `${Math.floor(sek / 3600)}:${String(Math.floor((sek % 3600) / 60)).padStart(2, "0")}:${String(sek % 60).padStart(2, "0")}`;
  return (
    <p className="tekst-2 tekst-maly" role="timer" style={{
      margin: "0 0 var(--sp-3)",
      ...(malo ? { color: "var(--kolor-uwaga, #a86500)", fontWeight: 600 } : {}),
    }}>
      ⏱ Pozostało: {format}{malo ? " — spokojnie, zdążysz, ale zbieraj się do pisania" : ""}
    </p>
  );
}

/**
 * Egzamin próbny — pełna symulacja arkusza 2027: 25 pytań (bez feedbacku,
 * timer 150 min informacyjny) → wybór formy wypowiedzi → wypracowanie →
 * samoocena → wynik /45 z porównaniem do diagnozy.
 */
export default function EgzaminProbny({ pula, formy, diagnoza, onGotowe, onWroc }) {
  const pytania = useMemo(() => zbudujArkusz(pula), [pula]);

  // etap: "intro" | indeks pytania | "wyborFormy" | "pisanie" | "samoocena" | "wynik"
  const [etap, setEtap] = useState("intro");
  const [start, setStart] = useState(null);
  const [odpowiedzi, setOdpowiedzi] = useState({});
  const [wybranaForma, setWybranaForma] = useState(null);
  const [tekst, setTekst] = useState("");
  const [kryteria, setKryteria] = useState([]);
  const [wynik, setWynik] = useState(null);

  const razemKrokow = pytania.length + 1;

  function zakoncz() {
    const zadanie = formy[wybranaForma].zadanie;
    const w = policzWynikEgzaminu(pytania, odpowiedzi, {
      zadanie,
      kryteria,
      tekst,
      forma: formy[wybranaForma].forma,
    });
    setWynik(w);
    onGotowe(w);
    setEtap("wynik");
  }

  if (etap === "intro") {
    return (
      <div className="tresc ekran-wjazd" style={{ maxWidth: 560 }}>
        <h1>Egzamin próbny</h1>
        <div className="karta" style={{ display: "grid", gap: "var(--sp-4)" }}>
          <p style={{ margin: 0 }}>
            Pełna symulacja egzaminu ósmoklasisty: <strong>25 pytań</strong> ze wszystkich
            obszarów + <strong>wypracowanie</strong> (min. {MIN_SLOW_WYPRACOWANIA} wyrazów).
            Razem <strong>45 punktów</strong>, tak jak na prawdziwym arkuszu.
          </p>
          <ul className="tekst-2" style={{ margin: 0, paddingLeft: "1.2em", display: "grid", gap: "var(--sp-1)" }}>
            <li>Masz <strong>{CZAS_EGZAMINU_MIN} minut</strong> — zegar jest informacyjny, nikt Cię nie wyrzuci po czasie.</li>
            <li>Nie zobaczysz odpowiedzi w trakcie — omówienie będzie na końcu, jak na egzaminie.</li>
            <li>Wypracowanie poniżej {PROG_SLOW_PELNA_OCENA} wyrazów = maksymalnie {MAKS_PKT_PONIZEJ_PROGU} pkt (reguła CKE).</li>
            <li>Przygotuj sobie spokojne miejsce i coś do picia. Powodzenia!</li>
          </ul>
          <button className="btn btn-primary btn--pelny" onClick={() => { setStart(Date.now()); setEtap(0); }}>
            Zaczynam egzamin
          </button>
          <button className="btn btn-ghost btn--pelny" onClick={onWroc}>Jednak później</button>
        </div>
      </div>
    );
  }

  if (etap === "wyborFormy") {
    return (
      <div className="tresc ekran-wjazd" style={{ maxWidth: 560 }}>
        <Zegar start={start} />
        <h2>Część 2: wypracowanie</h2>
        <div className="karta" style={{ display: "grid", gap: "var(--sp-3)" }}>
          <p className="tekst-2" style={{ margin: 0 }}>
            Na egzaminie wybierasz jeden z dwóch tematów. Tutaj wybierz formę, w której
            chcesz dziś napisać wypracowanie (min. {MIN_SLOW_WYPRACOWANIA} wyrazów, 20 pkt):
          </p>
          {Object.entries(formy).map(([ref, f]) => (
            <button
              key={ref}
              className={`opcja${wybranaForma === ref ? " opcja--wybrana" : ""}`}
              onClick={() => setWybranaForma(ref)}
              aria-pressed={wybranaForma === ref}
            >
              <span style={{ display: "grid", gap: "var(--sp-1)", textAlign: "left" }}>
                <strong style={{ textTransform: "capitalize" }}>{f.forma}</strong>
                <span className="tekst-2 tekst-maly">{f.zadanie.tresc}</span>
              </span>
            </button>
          ))}
          <button
            className="btn btn-primary btn--pelny"
            disabled={!wybranaForma}
            onClick={() => {
              setKryteria(formy[wybranaForma].zadanie.kryteriaSamooceny.map(() => false));
              setEtap("pisanie");
            }}
          >
            Piszę ten temat
          </button>
        </div>
      </div>
    );
  }

  if (etap === "pisanie") {
    const f = formy[wybranaForma];
    const slow = policzSlowa(tekst);
    return (
      <div className="tresc ekran-wjazd">
        <Zegar start={start} />
        <div className="karta" style={{ display: "grid", gap: "var(--sp-4)" }}>
          <h2 style={{ margin: 0, fontSize: "var(--rozmiar-l)" }}>{f.zadanie.tresc}</h2>
          <details>
            <summary className="tekst-2" style={{ cursor: "pointer" }}>
              Przypomnij plan formy: {f.forma}
            </summary>
            <ul style={{ margin: "var(--sp-2) 0 0", paddingLeft: "1.2em", display: "grid", gap: "var(--sp-1)" }}>
              {f.planFormy.map((p, i) => (
                <li key={i} className="tekst-2">{p}</li>
              ))}
            </ul>
          </details>
          <textarea
            className="pole"
            rows={16}
            value={tekst}
            onChange={(e) => setTekst(e.target.value)}
            placeholder="Pisz tutaj…"
            aria-label="Twoje wypracowanie"
          />
          <p className="tekst-2 tekst-maly" style={{ margin: 0 }}>
            Liczba wyrazów: {slow}
            {slow < PROG_SLOW_PELNA_OCENA
              ? ` — poniżej ${PROG_SLOW_PELNA_OCENA} egzaminator oceni tylko treść (max ${MAKS_PKT_PONIZEJ_PROGU}/20 pkt)`
              : slow < MIN_SLOW_WYPRACOWANIA
                ? ` — celuj w co najmniej ${MIN_SLOW_WYPRACOWANIA}`
                : " ✓"}
          </p>
          <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap" }}>
            <button className="btn" onClick={() => setEtap("wyborFormy")}>Zmień temat</button>
            <button
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={slow < 30}
              onClick={() => setEtap("samoocena")}
            >
              Skończone — sprawdzam swoją pracę
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (etap === "samoocena") {
    const zadanie = formy[wybranaForma].zadanie;
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
          <button className="btn btn-primary btn--pelny celebracja" onClick={zakoncz}>
            Zakończ egzamin i pokaż wynik
          </button>
        </div>
      </div>
    );
  }

  if (etap === "wynik") {
    const dobrze = wynik.procent >= 80;
    return (
      <div className="tresc ekran-wjazd">
        <div className="tekst-srodek celebracja" style={{ fontSize: 48, marginBottom: "var(--sp-2)" }} aria-hidden="true">
          {dobrze ? "🎉" : "🌱"}
        </div>
        <h1 className="tekst-srodek">Egzamin próbny za Tobą!</h1>

        <section className="karta" style={{ display: "grid", gap: "var(--sp-4)" }}>
          <PasekPostepu
            procent={wynik.procent}
            etykietaLewa={`${wynik.wynikPkt}/${wynik.maksPkt} pkt`}
            etykietaPrawa={`${wynik.procent}%`}
            wariant={dobrze ? "sukces" : ""}
          />
          <p className="tekst-2" style={{ margin: 0 }}>
            Test: <strong>{wynik.testPkt}/{wynik.testMaks} pkt</strong> · Wypracowanie
            ({wynik.wypracowanie.forma}): <strong>{wynik.wypracowanie.pkt}/{wynik.wypracowanie.maks} pkt</strong>
            {" "}({wynik.wypracowanie.slowa} wyrazów{wynik.wypracowanie.ponizejProgu
              ? ` — poniżej ${PROG_SLOW_PELNA_OCENA}, punkty ścięte do ${MAKS_PKT_PONIZEJ_PROGU}`
              : ""}).
          </p>
          <p className="tekst-2" style={{ margin: 0 }}>
            {dobrze
              ? "Ten wynik na prawdziwym egzaminie to bardzo mocna pozycja. Tak trzymaj!"
              : "Każdy egzamin próbny to mapa — wiesz już dokładnie, co powtórzyć przed następnym podejściem."}
          </p>
        </section>

        <section className="karta" style={{ marginTop: "var(--sp-4)", display: "grid", gap: "var(--sp-3)" }}>
          <h2 style={{ margin: 0, fontSize: "var(--rozmiar-l)" }}>Wynik według obszarów</h2>
          {Object.entries(wynik.perModul).sort(([a], [b]) => a.localeCompare(b)).map(([m, { pkt, maks }]) => {
            const teraz = maks ? Math.round((100 * pkt) / maks) : 0;
            const d = diagnoza?.perModul?.[m];
            const wtedy = d && d.maks ? Math.round((100 * d.pkt) / d.maks) : null;
            const delta = wtedy === null ? null : teraz - wtedy;
            return (
              <div key={m} style={{ display: "grid", gap: "var(--sp-1)" }}>
                <PasekPostepu
                  procent={teraz}
                  etykietaLewa={`${m} · ${MODULY[m]}`}
                  etykietaPrawa={`${pkt}/${maks} pkt`}
                  wariant={`modul-${m.toLowerCase()}`}
                />
                {delta !== null && (
                  <span className="tekst-2 tekst-maly">
                    {delta > 0 ? `▲ +${delta} p.p. od diagnozy — widać Twoją pracę!`
                      : delta < 0 ? `▽ ${delta} p.p. od diagnozy — wróć do tego obszaru w powtórkach`
                        : "= tyle samo co w diagnozie"}
                  </span>
                )}
              </div>
            );
          })}
        </section>

        <button className="btn btn-primary btn--pelny" style={{ marginTop: "var(--sp-5)" }} onClick={onWroc}>
          Wróć do startu
        </button>
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
      <Zegar start={start} />
      <PasekPostepu
        procent={((i + 1) / razemKrokow) * 100}
        etykietaLewa={`Pytanie ${i + 1} z ${pytania.length}`}
        etykietaPrawa="+ wypracowanie"
      />

      <div className="karta" style={{ marginTop: "var(--sp-4)" }}>
        <p className="tekst-2 tekst-maly" style={{ margin: "0 0 var(--sp-2)" }}>
          {pytanie.modul} · {MODULY[pytanie.modul]}
        </p>
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
            onClick={() => setEtap(i + 1 < pytania.length ? i + 1 : "wyborFormy")}
          >
            {i + 1 < pytania.length ? "Dalej" : "Część 2: wypracowanie"}
          </button>
        </div>
      </div>
    </div>
  );
}
