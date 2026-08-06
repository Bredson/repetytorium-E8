import { useState } from "react";
import { weryfikujPin } from "../../core/profil.js";

export default function EkranPin({ profil, onOk, onWroc }) {
  const [pin, setPin] = useState("");
  const [blad, setBlad] = useState("");

  async function sprawdz(e) {
    e.preventDefault();
    if (await weryfikujPin(profil, pin)) {
      onOk();
    } else {
      setBlad("To nie ten PIN — spróbuj jeszcze raz, spokojnie.");
      setPin("");
    }
  }

  return (
    <div className="tresc ekran-wjazd" style={{ maxWidth: 420 }}>
      <h1 className="tekst-srodek">Hej, {profil.imie}!</h1>
      <p className="tekst-2 tekst-srodek">Wpisz swój PIN, żeby wejść.</p>
      <form onSubmit={sprawdz} className="karta tekst-srodek" style={{ display: "grid", gap: "var(--sp-4)", justifyItems: "center" }}>
        <input
          className="pole pole--pin"
          value={pin}
          type="password"
          inputMode="numeric"
          maxLength={4}
          autoFocus
          aria-label="PIN"
          placeholder="••••"
          onChange={(e) => { setPin(e.target.value.replace(/\D/g, "")); setBlad(""); }}
        />
        {blad && <p className="badge badge--braki" role="alert" style={{ whiteSpace: "normal" }}>{blad}</p>}
        <button type="submit" className="btn btn-primary btn--pelny" disabled={pin.length !== 4}>
          Wejdź
        </button>
        <button type="button" className="btn btn-ghost" onClick={onWroc}>To nie ja — zmień profil</button>
      </form>
    </div>
  );
}
