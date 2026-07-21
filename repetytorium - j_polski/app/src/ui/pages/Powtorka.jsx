import { useState } from "react";
import QuizLektury from "../components/QuizLektury.jsx";
import FiszkiSesja from "../components/FiszkiSesja.jsx";

const PROG_UMIEM = 80; // % — od tego progu interwał rośnie

/**
 * Sesja powtórki (spaced repetition): fiszki albo quiz z danego materiału
 * (lektura lub ćwiczenie modułowe — kontrakt: {quiz, fiszki?}).
 * Na końcu wywołuje onGotowe(ocena, wynik) — ocena "umiem" | "jeszcze-nie".
 */
export default function Powtorka({ rekord, material, onGotowe, onWroc }) {
  const [wynik, setWynik] = useState(null);

  if (wynik) {
    const umiem = wynik.ocena === "umiem";
    return (
      <div className="tresc ekran-wjazd" style={{ maxWidth: 560 }}>
        <div className="karta tekst-srodek" style={{ display: "grid", gap: "var(--sp-4)" }}>
          <div className={umiem ? "celebracja" : ""} style={{ fontSize: 48 }} aria-hidden="true">
            {umiem ? "💪" : "🌱"}
          </div>
          <h1 style={{ margin: 0 }}>{umiem ? "Powtórka zaliczona!" : "Dobra robota — rośniemy"}</h1>
          <p className="tekst-2" style={{ margin: 0 }}>
            {umiem
              ? `Świetnie Ci poszło (${wynik.opis}). Następna powtórka za ${wynik.interwal} ${wynik.interwal === 1 ? "dzień" : "dni"} — odstępy rosną, bo pamięć się wzmacnia.`
              : `Wynik: ${wynik.opis}. Nic straconego — wrócimy do tego jutro, krótka powtórka zrobi swoje.`}
          </p>
          <button className="btn btn-primary btn--pelny" onClick={onWroc}>
            Wróć do planu
          </button>
        </div>
      </div>
    );
  }

  function zakonczFiszki(w) {
    const procent = Math.round((100 * w.umiem) / w.razem);
    const ocena = procent >= PROG_UMIEM ? "umiem" : "jeszcze-nie";
    const rec = onGotowe(ocena, { typ: "fiszki", ...w });
    setWynik({ ocena, opis: `${w.umiem}/${w.razem} fiszek od razu`, interwal: rec.interwal });
  }

  function zakonczQuiz(w) {
    const ocena = w.procent >= PROG_UMIEM ? "umiem" : "jeszcze-nie";
    const rec = onGotowe(ocena, { typ: "quiz", ...w });
    setWynik({ ocena, opis: `${w.wynikPkt}/${w.maksPkt} pkt (${w.procent}%)`, interwal: rec.interwal });
  }

  return (
    <div className="tresc">
      <button className="btn btn-ghost" onClick={onWroc} style={{ marginBottom: "var(--sp-3)" }}>
        ← Wróć (powtórka poczeka)
      </button>
      {rekord.typ === "fiszka" ? (
        <FiszkiSesja fiszki={material.fiszki} tytul={rekord.temat} onGotowe={zakonczFiszki} />
      ) : (
        <QuizLektury pytania={material.quiz} tytul={rekord.temat} onGotowe={zakonczQuiz} />
      )}
    </div>
  );
}
