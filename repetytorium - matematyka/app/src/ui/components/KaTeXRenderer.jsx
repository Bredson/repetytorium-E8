import katex from "katex";
import "katex/dist/katex.min.css";

function renderujTekst(tekst) {
  const czesci = [];
  let reszta = tekst;
  let i = 0;

  while (reszta.length > 0) {
    const blok = reszta.indexOf("$$");
    const inline = reszta.indexOf("$");

    if (blok !== -1 && (inline === -1 || blok <= inline)) {
      if (blok > 0) czesci.push(<span key={i++}>{reszta.slice(0, blok)}</span>);
      const koniec = reszta.indexOf("$$", blok + 2);
      if (koniec === -1) { czesci.push(<span key={i++}>{reszta}</span>); break; }
      const wzor = reszta.slice(blok + 2, koniec);
      czesci.push(
        <span key={i++} dangerouslySetInnerHTML={{ __html: katex.renderToString(wzor, { displayMode: true, throwOnError: false }) }} />
      );
      reszta = reszta.slice(koniec + 2);
    } else if (inline !== -1) {
      if (inline > 0) czesci.push(<span key={i++}>{reszta.slice(0, inline)}</span>);
      const koniec = reszta.indexOf("$", inline + 1);
      if (koniec === -1) { czesci.push(<span key={i++}>{reszta}</span>); break; }
      const wzor = reszta.slice(inline + 1, koniec);
      czesci.push(
        <span key={i++} dangerouslySetInnerHTML={{ __html: katex.renderToString(wzor, { throwOnError: false }) }} />
      );
      reszta = reszta.slice(koniec + 1);
    } else {
      czesci.push(<span key={i++}>{reszta}</span>);
      break;
    }
  }
  return czesci;
}

export default function KaTeXRenderer({ tekst, className = "" }) {
  if (!tekst) return null;
  return <span className={className}>{renderujTekst(tekst)}</span>;
}
