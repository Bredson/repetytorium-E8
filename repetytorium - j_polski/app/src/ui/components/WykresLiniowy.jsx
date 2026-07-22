/**
 * Wykres liniowy wyników w czasie — czysty SVG, skalowanie przez viewBox.
 * Oś X: czas (pierwsza → ostatnia sesja), oś Y: 0-100%.
 * Egzaminy próbne wyróżnione większym punktem w kolorze sukcesu.
 */
const W = 600, H = 240;
const M = { l: 40, r: 16, t: 14, b: 30 };

export default function WykresLiniowy({ punkty, liniaOdniesienia = 80 }) {
  if (!punkty || punkty.length === 0) return null;

  const czasy = punkty.map((p) => Date.parse(p.data));
  const [t0, t1] = [Math.min(...czasy), Math.max(...czasy)];
  const x = (t) => (t1 === t0 ? W / 2 : M.l + ((t - t0) / (t1 - t0)) * (W - M.l - M.r));
  const y = (proc) => H - M.b - (proc / 100) * (H - M.t - M.b);

  const wsp = punkty.map((p, i) => ({ ...p, x: x(czasy[i]), y: y(p.procent) }));
  const sciezka = wsp.map((p) => `${p.x},${p.y}`).join(" ");
  const dataKrotka = (iso) => iso.slice(5, 10).split("-").reverse().join(".");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }} role="img" aria-label="Wykres wyników w czasie">
      {[0, 50, 100].map((v) => (
        <g key={v}>
          <line x1={M.l} y1={y(v)} x2={W - M.r} y2={y(v)} stroke="var(--kolor-obrys)" strokeWidth="1" />
          <text x={M.l - 6} y={y(v) + 4} textAnchor="end" fontSize="11" fill="var(--kolor-tekst-2)">{v}%</text>
        </g>
      ))}
      <line
        x1={M.l} y1={y(liniaOdniesienia)} x2={W - M.r} y2={y(liniaOdniesienia)}
        stroke="var(--kolor-sukces)" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.7"
      />
      <text x={W - M.r} y={y(liniaOdniesienia) - 5} textAnchor="end" fontSize="11" fill="var(--kolor-sukces)">
        {liniaOdniesienia}% — próg „umiem”
      </text>
      {wsp.length > 1 && (
        <polyline points={sciezka} fill="none" stroke="var(--kolor-akcent)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      )}
      {wsp.map((p, i) => (
        <circle
          key={i} cx={p.x} cy={p.y}
          r={p.typ === "egzamin" ? 7 : 4}
          fill={p.typ === "egzamin" ? "var(--kolor-sukces)" : "var(--kolor-akcent)"}
          stroke="var(--kolor-powierzchnia)" strokeWidth="2"
        >
          <title>{`${p.etykieta} — ${p.procent}%`}</title>
        </circle>
      ))}
      <text x={M.l} y={H - 8} fontSize="11" fill="var(--kolor-tekst-2)">{dataKrotka(punkty[0].data)}</text>
      <text x={W - M.r} y={H - 8} textAnchor="end" fontSize="11" fill="var(--kolor-tekst-2)">
        {dataKrotka(punkty[punkty.length - 1].data)}
      </text>
    </svg>
  );
}
