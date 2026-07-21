import { useRef } from "react";
import { storage } from "../../storage/adapter.js";

export default function WyborProfilu({ profile, onWybierz, onNowy, onImport }) {
  const plikRef = useRef(null);

  async function importujPlik(e) {
    const plik = e.target.files?.[0];
    if (!plik) return;
    try {
      const dane = JSON.parse(await plik.text());
      const profil = await storage.importAll(dane);
      onImport(profil);
    } catch {
      alert("Nie udało się wczytać pliku. Upewnij się, że to eksport z Repetytorium.");
    } finally {
      e.target.value = "";
    }
  }

  return (
    <div className="tresc ekran-wjazd">
      <h1 className="tekst-srodek">Repetytorium ósmoklasisty</h1>
      <p className="tekst-2 tekst-srodek">Kto dziś się uczy? Wybierz swój profil.</p>

      <div style={{ display: "grid", gap: "var(--sp-3)", marginTop: "var(--sp-5)" }}>
        {profile.map((p) => (
          <button
            key={p.id}
            className="karta karta--klikalna"
            style={{ textAlign: "left", font: "inherit", display: "flex", alignItems: "center", gap: "var(--sp-3)" }}
            onClick={() => onWybierz(p)}
          >
            <span
              aria-hidden="true"
              style={{
                width: 44, height: 44, borderRadius: "var(--radius-pelny)",
                background: "var(--kolor-akcent-tlo)", color: "var(--kolor-akcent)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: "var(--rozmiar-l)", flexShrink: 0,
              }}
            >
              {p.imie.charAt(0).toUpperCase()}
            </span>
            <span>
              <strong>{p.imie}</strong>
              <span className="tekst-2 tekst-maly" style={{ display: "block" }}>
                Egzamin: {p.dataEgzaminu}
              </span>
            </span>
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gap: "var(--sp-3)", marginTop: "var(--sp-5)" }}>
        <button className="btn btn-primary btn--pelny" onClick={onNowy}>
          Załóż nowy profil
        </button>
        <button className="btn btn-ghost btn--pelny" onClick={() => plikRef.current?.click()}>
          Przywróć profil z pliku (import)
        </button>
        <input ref={plikRef} type="file" accept="application/json" onChange={importujPlik} className="sr-only" aria-hidden="true" tabIndex={-1} />
      </div>
    </div>
  );
}
