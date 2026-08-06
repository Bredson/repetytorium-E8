export default function PasekPostepu({ procent, etykietaLewa, etykietaPrawa, wariant = "" }) {
  const klasa = wariant ? ` pasek-postepu-wypelnienie--${wariant}` : "";
  return (
    <div>
      {(etykietaLewa || etykietaPrawa) && (
        <div className="pasek-postepu-etykieta">
          <span>{etykietaLewa}</span>
          <span>{etykietaPrawa}</span>
        </div>
      )}
      <div
        className="pasek-postepu"
        role="progressbar"
        aria-valuenow={Math.round(procent)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`pasek-postepu-wypelnienie${klasa}`}
          style={{ width: `${Math.min(100, Math.max(0, procent))}%` }}
        />
      </div>
    </div>
  );
}
