import { useState } from "react";
import QuizLektury from "../components/QuizLektury.jsx";
import FiszkiSesja from "../components/FiszkiSesja.jsx";
import Sekcja from "../components/Sekcja.jsx";

/**
 * Pełna pętla nauki lektury: kompendium → quiz (feedback natychmiastowy) → fiszki → podsumowanie.
 */
export default function Lektura({ lektura, stan, onSekcje, onQuiz, onFiszki, onWroc }) {
  const [etap, setEtap] = useState("kompendium"); // kompendium | quiz | fiszki | final
  const [wynikQuizu, setWynikQuizu] = useState(null);
  const [wynikFiszek, setWynikFiszek] = useState(null);

  const przeczytane = stan?.sekcjePrzeczytane ?? [];
  const wszystkiePrzeczytane = lektura.sekcje.every((s) => przeczytane.includes(s.id));

  if (etap === "quiz") {
    return (
      <div className="tresc">
        <QuizLektury
          pytania={lektura.quiz}
          tytul={`Quiz: ${lektura.tytul}`}
          onGotowe={(wynik) => {
            setWynikQuizu(wynik);
            onQuiz(wynik);
            setEtap("fiszki");
          }}
        />
      </div>
    );
  }

  if (etap === "fiszki") {
    return (
      <div className="tresc">
        {wynikQuizu && (
          <div className="karta ekran-wjazd" style={{ marginBottom: "var(--sp-4)", padding: "var(--sp-4)" }}>
            <p style={{ margin: 0 }}>
              Quiz: <strong>{wynikQuizu.wynikPkt}/{wynikQuizu.maksPkt} pkt ({wynikQuizu.procent}%)</strong>.
              Teraz utrwalimy najważniejsze rzeczy fiszkami.
            </p>
          </div>
        )}
        <FiszkiSesja
          fiszki={lektura.fiszki}
          tytul={`Fiszki: ${lektura.tytul}`}
          onGotowe={(wynik) => {
            setWynikFiszek(wynik);
            onFiszki(wynik);
            setEtap("final");
          }}
        />
      </div>
    );
  }

  if (etap === "final") {
    const dobrze = (wynikQuizu?.procent ?? 0) >= 80;
    return (
      <div className="tresc ekran-wjazd" style={{ maxWidth: 560 }}>
        <div className="karta tekst-srodek" style={{ display: "grid", gap: "var(--sp-4)" }}>
          <div className={dobrze ? "celebracja" : ""} style={{ fontSize: 48 }} aria-hidden="true">
            {dobrze ? "🎉" : "🌱"}
          </div>
          <h1 style={{ margin: 0 }}>{dobrze ? "Lektura przerobiona!" : "Dobry pierwszy krok"}</h1>
          <p className="tekst-2" style={{ margin: 0 }}>
            {lektura.tytul}: quiz {wynikQuizu?.procent}%, fiszki „umiem” od razu:{" "}
            {wynikFiszek?.umiem}/{wynikFiszek?.razem}.{" "}
            {dobrze
              ? "Jutro pojawi się pierwsza powtórka — to właśnie powtórki w odstępach sprawiają, że wiedza zostaje na zawsze."
              : "Nikt nie zna lektury po jednym podejściu — od tego są powtórki, pierwsza już jutro. Wyjaśnienia z quizu już pracują na Twój wynik."}
          </p>
          <button className="btn btn-primary btn--pelny" onClick={onWroc}>
            Wróć do planu
          </button>
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
        <h1 style={{ marginBottom: "var(--sp-1)" }}>{lektura.tytul}</h1>
        <p className="tekst-2" style={{ margin: 0 }}>
          {lektura.autor} · {lektura.gatunek.nazwa}
        </p>
      </header>

      <div style={{ display: "grid", gap: "var(--sp-3)" }}>
        {lektura.sekcje.map((s) => (
          <Sekcja
            key={s.id}
            tytul={s.tytul}
            czasMin={s.czasMin}
            przeczytana={przeczytane.includes(s.id)}
            onPrzeczytana={() => onSekcje([...przeczytane, s.id])}
          >
            <p className="tekst-2" style={{ margin: 0 }}>{s.tresc}</p>
            <ul style={{ margin: 0, paddingLeft: "1.2em", display: "grid", gap: "var(--sp-2)" }}>
              {s.punkty.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </Sekcja>
        ))}

        <Sekcja tytul="Bohaterowie i ich przestrogi" czasMin={4}>
          {lektura.bohaterowie.map((b) => (
            <div key={b.imie} style={{ display: "grid", gap: "var(--sp-1)" }}>
              <p style={{ margin: 0, fontWeight: 600 }}>{b.imie}</p>
              <p className="tekst-2" style={{ margin: 0 }}>{b.kim}</p>
              <ul style={{ margin: 0, paddingLeft: "1.2em" }}>
                {b.scenyDowody.map((s, i) => (
                  <li key={i} className="tekst-2">{s}</li>
                ))}
              </ul>
              {b.przestroga && (
                <p style={{ margin: 0, fontStyle: "italic", color: "var(--kolor-sukces)" }}>
                  „{b.przestroga}”
                </p>
              )}
            </div>
          ))}
        </Sekcja>

        <Sekcja tytul="Motywy — gotowe argumenty do wypracowania" czasMin={4}>
          {lektura.motywy.map((m) => (
            <div key={m.motyw} style={{ display: "grid", gap: "var(--sp-1)" }}>
              <p style={{ margin: 0, fontWeight: 600 }}>{m.motyw}</p>
              <p className="tekst-2" style={{ margin: 0 }}>{m.przyklad}</p>
              <p className="tekst-2 tekst-maly" style={{ margin: 0 }}>W wypracowaniu: {m.wWypracowaniu}</p>
            </div>
          ))}
        </Sekcja>
      </div>

      <div className="karta" style={{ marginTop: "var(--sp-4)", display: "grid", gap: "var(--sp-3)" }}>
        <p style={{ margin: 0 }}>
          {wszystkiePrzeczytane
            ? "Wszystkie sekcje przeczytane — czas sprawdzić się w quizie!"
            : "Przeczytaj sekcje powyżej, a potem sprawdź się w quizie (możesz też od razu, jeśli znasz lekturę)."}
        </p>
        <button className="btn btn-primary btn--pelny" onClick={() => setEtap("quiz")}>
          Start quizu ({lektura.quiz.length} pytań)
        </button>
      </div>
    </div>
  );
}
