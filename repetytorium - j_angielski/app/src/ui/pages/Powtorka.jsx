import { useState, useMemo, useEffect, useRef } from "react";
import { material } from "../../content/angielski/rejestr.js";
import { oznaczPowtorke, zaktualizujPowtorki } from "../../core/powtorki.js";

export default function Powtorka({ powtorkiDzis, postepy, onZakoncz, onWroc }) {
  const [aktualny, setAktualny] = useState(0);
  const [wybrana, setWybrana] = useState(null);
  const [pokazOcene, setPokazOcene] = useState(false);
  const [wyniki, setWyniki] = useState({ umiem: 0, jeszczeNie: 0 });
  const [aktualnePowtorki, setAktualnePowtorki] = useState(postepy.powtorki);
  const [zakonczone, setZakonczone] = useState(false);

  // Dla każdej powtórki wybierz losowe pytanie z danego działu
  const pytaniaPerPowtorka = useMemo(() => {
    return powtorkiDzis.map((rek) => {
      const dzialMaterial = material(rek.temat);
      if (!dzialMaterial) return null;
      const cwiczenia = dzialMaterial.cwiczenia;
      return cwiczenia[Math.floor(Math.random() * cwiczenia.length)] ?? null;
    });
  }, [powtorkiDzis]);

  const rekord = powtorkiDzis[aktualny];
  const pytanie = pytaniaPerPowtorka[aktualny];

  function ocen(ocena) {
    const nowyRekord = oznaczPowtorke(rekord, ocena);
    const nowe = zaktualizujPowtorki(aktualnePowtorki, nowyRekord);
    setAktualnePowtorki(nowe);

    const noweWyniki = {
      umiem: wyniki.umiem + (ocena === "umiem" ? 1 : 0),
      jeszczeNie: wyniki.jeszczeNie + (ocena === "jeszcze-nie" ? 1 : 0),
    };
    setWyniki(noweWyniki);

    if (aktualny < powtorkiDzis.length - 1) {
      setAktualny(aktualny + 1);
      setWybrana(null);
      setPokazOcene(false);
    } else {
      setZakonczone(true);
    }
  }

  // Adaptacja (precedens z T2 review): wołanie ocen() (setState) w ciele
  // renderu narusza czystość renderu. Przenosimy pominięcie brakującego
  // pytania (dział usunięty/błąd) do efektu; pomintyRef chroni przed
  // podwójnym odpaleniem w React StrictMode dla tego samego indeksu.
  const pomintyRef = useRef(-1);
  useEffect(() => {
    if (!zakonczone && rekord && !pytanie && pomintyRef.current !== aktualny) {
      pomintyRef.current = aktualny;
      ocen("jeszcze-nie");
    }
  });

  if (powtorkiDzis.length === 0 || zakonczone) {
    return (
      <div className="tresc ekran-wjazd">
        <h2>Powtórki</h2>
        {zakonczone ? (
          <div className="karta" style={{ textAlign: "center", marginBottom: "var(--sp-4)" }}>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Sesja zakończona!</p>
            <p>Umiem: {wyniki.umiem} · Jeszcze nie: {wyniki.jeszczeNie}</p>
          </div>
        ) : (
          <p>Brak powtórek na dziś.</p>
        )}
        <button className="btn btn-primary btn--pelny" onClick={() => onZakoncz(aktualnePowtorki)}>
          Gotowe
        </button>
      </div>
    );
  }

  if (!pytanie) {
    // Dział usunięty lub błąd — pomiń (ocena "jeszcze-nie" wykonana w useEffect powyżej)
    return null;
  }

  function wybierz(opcja) {
    if (wybrana !== null) return;
    setWybrana(opcja);
    setPokazOcene(true);
  }

  return (
    <div className="tresc ekran-wjazd">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--sp-3)" }}>
        <button className="btn btn-ghost" onClick={onWroc}>← Wróć</button>
        <span className="tekst-2 tekst-maly">{aktualny + 1}/{powtorkiDzis.length}</span>
      </div>

      <h2 style={{ marginBottom: "var(--sp-2)" }}>Powtórka: {material(rekord.temat)?.tytul ?? rekord.temat}</h2>

      <div className="karta" style={{ marginBottom: "var(--sp-4)" }}>
        {pytanie.tekst && (
          <p className="karta" style={{ background: "var(--kolor-tlo-2, #f5f5f5)", padding: "var(--sp-3)", marginBottom: "var(--sp-3)", whiteSpace: "pre-wrap", fontStyle: "italic" }}>
            {pytanie.tekst}
          </p>
        )}

        <p style={{ fontWeight: 500, marginBottom: "var(--sp-3)" }}>
          {pytanie.tresc}
        </p>

        <div style={{ display: "grid", gap: "var(--sp-2)" }}>
          {pytanie.opcje.map((opcja) => {
            let klass = "btn btn-ghost btn--pelny";
            if (wybrana !== null) {
              if (opcja === pytanie.poprawna) klass += " btn--sukces";
              else if (opcja === wybrana) klass += " btn--blad";
            }
            return (
              <button
                key={opcja}
                className={klass}
                style={{ textAlign: "left" }}
                onClick={() => wybierz(opcja)}
                disabled={wybrana !== null}
              >
                {opcja}
              </button>
            );
          })}
        </div>
      </div>

      {pokazOcene && (
        <div className="karta" style={{ marginBottom: "var(--sp-3)" }}>
          <p style={{ marginBottom: "var(--sp-3)" }}>Jak ci poszło?</p>
          <div style={{ display: "flex", gap: "var(--sp-3)" }}>
            <button
              className="btn btn-primary"
              style={{ flex: 1, background: "var(--kolor-sukces)", borderColor: "var(--kolor-sukces)" }}
              onClick={() => ocen("umiem")}
            >
              Umiem ✓
            </button>
            <button
              className="btn btn-ghost"
              style={{ flex: 1 }}
              onClick={() => ocen("jeszcze-nie")}
            >
              Jeszcze nie
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
