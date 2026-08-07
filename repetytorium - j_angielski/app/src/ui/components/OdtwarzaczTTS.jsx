import { useState, useEffect, useRef } from "react";

// Preferencja głosów: en-GB → en-US → pozostałe en-*
function uporzadkujGlosyEn(wszystkie) {
  const en = wszystkie.filter((g) => (g.lang || "").toLowerCase().startsWith("en"));
  const gb = en.filter((g) => g.lang.toLowerCase().startsWith("en-gb"));
  const us = en.filter((g) => g.lang.toLowerCase().startsWith("en-us"));
  const reszta = en.filter((g) => !gb.includes(g) && !us.includes(g));
  return [...gb, ...us, ...reszta];
}

export default function OdtwarzaczTTS({ nagranie, pokazTranskrypcje }) {
  const kwestie = Array.isArray(nagranie) ? nagranie : [nagranie];
  const [glosy, setGlosy] = useState(null); // null = ładowanie; [] = brak głosów EN
  const [odtworzenia, setOdtworzenia] = useState(0);
  const [wolniej, setWolniej] = useState(false);
  const [odtwarza, setOdtwarza] = useState(false);
  const [transkrypcjaWidoczna, setTranskrypcjaWidoczna] = useState(false);
  const watchdogRef = useRef(null);

  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      setGlosy([]);
      return;
    }
    function zaladuj() {
      const wszystkie = window.speechSynthesis.getVoices();
      if (wszystkie.length > 0) setGlosy(uporzadkujGlosyEn(wszystkie));
    }
    zaladuj();
    window.speechSynthesis.addEventListener("voiceschanged", zaladuj);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", zaladuj);
      window.speechSynthesis.cancel();
      clearTimeout(watchdogRef.current);
    };
  }, []);

  // getVoices() bywa puste i voiceschanged nie zawsze przychodzi (np. headless):
  // po 2 s ładowania uznajemy brak głosów i włączamy fallback
  useEffect(() => {
    if (glosy !== null) return;
    const t = setTimeout(() => setGlosy((g) => (g === null ? [] : g)), 2000);
    return () => clearTimeout(t);
  }, [glosy]);

  const laduje = glosy === null;
  const brakTTS = glosy !== null && glosy.length === 0;

  function odtworz() {
    if (laduje || brakTTS || odtwarza) return;
    setOdtworzenia((n) => n + 1);
    setOdtwarza(true);
    window.speechSynthesis.cancel();
    clearTimeout(watchdogRef.current);
    function zakoncz() {
      clearTimeout(watchdogRef.current);
      setOdtwarza(false);
    }
    // watchdog: niektóre przeglądarki (np. Chromium przy throttlingu karty) potrafią
    // wyciszyć zdarzenia onend/onerror dla ostatniej kwestii — bez tego "Odtwarzanie…"
    // zostałoby zawieszone do końca zamontowania komponentu.
    // Uzbrojony PRZED pętlą, żeby wyjątek w trakcie forEach nie zostawił
    // odtwarza=true bez żadnego zabezpieczenia (zawieszony przycisk).
    const dlugosc = kwestie.join(" ").length;
    const limitMs = Math.max(8000, dlugosc * 150);
    watchdogRef.current = setTimeout(zakoncz, limitMs);
    kwestie.forEach((tekst, i) => {
      const u = new SpeechSynthesisUtterance(tekst);
      // dialog: naprzemienne kwestie dwoma pierwszymi głosami EN (jeśli są)
      const glos = glosy[i % Math.min(glosy.length, 2)];
      u.voice = glos;
      u.lang = glos.lang;
      u.rate = wolniej ? 0.8 : 0.95;
      if (i === kwestie.length - 1) {
        u.onend = zakoncz;
        u.onerror = zakoncz;
      }
      window.speechSynthesis.speak(u);
    });
  }

  const transkrypcja = (
    <div style={{ marginTop: "var(--sp-2)" }}>
      {kwestie.map((k, i) => (
        <p key={i} style={{ fontStyle: "italic", margin: "0 0 4px" }}>
          {kwestie.length > 1 ? `— ${k}` : k}
        </p>
      ))}
      {!brakTTS && (
        <p className="tekst-2 tekst-maly">Posłuchaj jeszcze raz, czytając tekst.</p>
      )}
    </div>
  );

  return (
    <div className="karta" style={{ marginBottom: "var(--sp-3)", padding: "var(--sp-3)" }}>
      {brakTTS ? (
        <>
          <p className="tekst-2" role="alert">
            Twoja przeglądarka nie ma angielskiego głosu do odtworzenia nagrania —
            przeczytaj transkrypcję poniżej.
          </p>
          {transkrypcja}
        </>
      ) : (
        <>
          <div style={{ display: "flex", gap: "var(--sp-2)", alignItems: "center", flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={odtworz} disabled={laduje || odtwarza}>
              {laduje ? "Ładowanie głosów…" : odtwarza ? "Odtwarzanie…" : "▶ Odtwórz nagranie"}
            </button>
            <button
              className={"btn btn-ghost" + (wolniej ? " btn--sukces" : "")}
              onClick={() => setWolniej((w) => !w)}
              aria-pressed={wolniej}
            >
              🐢 wolniej
            </button>
            <span className="tekst-2 tekst-maly">Odtworzenia: {odtworzenia}</span>
          </div>
          {odtworzenia >= 2 && (
            <p className="tekst-2 tekst-maly" style={{ marginTop: "var(--sp-2)", color: "var(--kolor-uwaga)" }}>
              Na egzaminie usłyszysz nagranie tylko 2 razy — spróbuj odpowiedzieć!
            </p>
          )}
          {pokazTranskrypcje && (
            <div style={{ marginTop: "var(--sp-2)" }}>
              {transkrypcjaWidoczna ? (
                transkrypcja
              ) : (
                <button className="btn btn-ghost" onClick={() => setTranskrypcjaWidoczna(true)}>
                  Pokaż transkrypcję
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
