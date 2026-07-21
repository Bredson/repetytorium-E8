import { useState } from "react";
import { MODULY } from "../../core/quiz.js";
import QuizLektury from "../components/QuizLektury.jsx";
import Sekcja from "../components/Sekcja.jsx";

/**
 * Ćwiczenie modułowe (B/C/D/E): teoria w pigułce → quiz (feedback natychmiastowy) → podsumowanie.
 * Ten sam rytm co pętla lektury — spójność buduje nawyk.
 */
export default function Cwiczenie({ cwiczenie, onQuiz, onWroc }) {
  const [etap, setEtap] = useState("teoria"); // teoria | quiz | final
  const [wynikQuizu, setWynikQuizu] = useState(null);

  if (etap === "quiz") {
    return (
      <div className="tresc">
        <QuizLektury
          pytania={cwiczenie.quiz}
          tytul={`Quiz: ${cwiczenie.tytul}`}
          onGotowe={(wynik) => {
            setWynikQuizu(wynik);
            onQuiz(wynik);
            setEtap("final");
          }}
        />
      </div>
    );
  }

  if (etap === "final") {
    const dobrze = wynikQuizu?.procent >= 80;
    return (
      <div className="tresc ekran-wjazd" style={{ maxWidth: 560 }}>
        <div className="karta tekst-srodek" style={{ display: "grid", gap: "var(--sp-4)" }}>
          <div className={dobrze ? "celebracja" : ""} style={{ fontSize: 48 }} aria-hidden="true">
            {dobrze ? "🎉" : "🌱"}
          </div>
          <h1 style={{ margin: 0 }}>{dobrze ? "Ćwiczenie zaliczone!" : "Pierwsze podejście za Tobą"}</h1>
          <p className="tekst-2" style={{ margin: 0 }}>
            {cwiczenie.tytul}: quiz {wynikQuizu?.wynikPkt}/{wynikQuizu?.maksPkt} pkt ({wynikQuizu?.procent}%).{" "}
            {dobrze
              ? "Jutro pojawi się powtórka — krótkie wracanie do zasad sprawia, że stają się odruchem."
              : "Zasady same wejdą do głowy przez powtórki — pierwsza już jutro. Wyjaśnienia z quizu zrobiły większą robotę, niż czujesz."}
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
        <h1 style={{ marginBottom: "var(--sp-1)" }}>{cwiczenie.tytul}</h1>
        <p className="tekst-2" style={{ margin: 0 }}>
          Moduł {cwiczenie.modul} · {MODULY[cwiczenie.modul]}
        </p>
      </header>

      <div style={{ display: "grid", gap: "var(--sp-3)" }}>
        {cwiczenie.teoria.map((s) => (
          <Sekcja key={s.id} tytul={s.tytul} czasMin={s.czasMin}>
            <p className="tekst-2" style={{ margin: 0 }}>{s.tresc}</p>
            <ul style={{ margin: 0, paddingLeft: "1.2em", display: "grid", gap: "var(--sp-2)" }}>
              {s.punkty.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </Sekcja>
        ))}
      </div>

      <div className="karta" style={{ marginTop: "var(--sp-4)", display: "grid", gap: "var(--sp-3)" }}>
        <p style={{ margin: 0 }}>
          Przejrzyj zasady powyżej, a potem sprawdź się w quizie — każde pytanie od razu
          pokaże Ci wyjaśnienie.
        </p>
        <button className="btn btn-primary btn--pelny" onClick={() => setEtap("quiz")}>
          Start quizu ({cwiczenie.quiz.length} pytań)
        </button>
      </div>
    </div>
  );
}
