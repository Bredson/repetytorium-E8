import { useState } from "react";
import { nowyProfil, walidujPin } from "../../core/profil.js";

export default function NowyProfil({ onUtworzono, onAnuluj, saProfile }) {
  const [imie, setImie] = useState("");
  const [pin, setPin] = useState("");
  const [pin2, setPin2] = useState("");
  const [dataEgzaminu, setDataEgzaminu] = useState("2027-05-12"); // placeholder — dokładny termin CKE nieznany do 20.08.2026
  const [dysleksja, setDysleksja] = useState(false);
  const [blad, setBlad] = useState("");

  async function utworz(e) {
    e.preventDefault();
    if (imie.trim().length < 2) return setBlad("Podaj swoje imię (min. 2 litery).");
    if (!walidujPin(pin)) return setBlad("PIN to dokładnie 4 cyfry.");
    if (pin !== pin2) return setBlad("PIN-y różnią się od siebie — wpisz je jeszcze raz.");
    const profil = await nowyProfil({ imie, pin, dataEgzaminu, dysleksja });
    onUtworzono(profil);
  }

  return (
    <div className="tresc ekran-wjazd">
      <h1>Cześć! Załóżmy Twój profil</h1>
      <p className="tekst-2">
        Kilka pytań na start — dzięki nim aplikacja dopasuje się do Ciebie.
      </p>

      <form onSubmit={utworz} className="karta" style={{ display: "grid", gap: "var(--sp-4)" }}>
        <div>
          <label className="pole-etykieta" htmlFor="imie">Jak masz na imię?</label>
          <input id="imie" className="pole" value={imie} onChange={(e) => setImie(e.target.value)}
            placeholder="np. Zosia" autoComplete="off" />
        </div>

        <div>
          <label className="pole-etykieta" htmlFor="pin">Ustaw PIN (4 cyfry)</label>
          <input id="pin" className="pole pole--pin" value={pin} inputMode="numeric" type="password"
            maxLength={4} onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))} placeholder="••••" />
          <p className="pole-podpowiedz">PIN chroni Twój profil przed rodzeństwem :)</p>
        </div>

        <div>
          <label className="pole-etykieta" htmlFor="pin2">Powtórz PIN</label>
          <input id="pin2" className="pole pole--pin" value={pin2} inputMode="numeric" type="password"
            maxLength={4} onChange={(e) => setPin2(e.target.value.replace(/\D/g, ""))} placeholder="••••" />
        </div>

        <div>
          <label className="pole-etykieta" htmlFor="data">Data egzaminu</label>
          <input id="data" className="pole" type="date" value={dataEgzaminu}
            onChange={(e) => setDataEgzaminu(e.target.value)} />
          <p className="pole-podpowiedz">Dokładny termin CKE ogłosi w komunikacie — na razie zostaw maj 2027.</p>
        </div>

        <label style={{ display: "flex", gap: "var(--sp-3)", alignItems: "center", minHeight: "var(--min-tap)", cursor: "pointer" }}>
          <input type="checkbox" checked={dysleksja} onChange={(e) => setDysleksja(e.target.checked)}
            style={{ width: 20, height: 20 }} />
          <span>
            Mam dysleksję
            <span className="tekst-2 tekst-maly" style={{ display: "block" }}>
              Włączymy czytelniejszy tekst. Zaznacz, jeśli uczeń ma orzeczenie o dysleksji — wykorzystamy to w kolejnych wersjach przy ocenianiu ortografii.
            </span>
          </span>
        </label>

        {blad && (
          <p className="badge badge--braki" role="alert" style={{ whiteSpace: "normal" }}>{blad}</p>
        )}

        <button type="submit" className="btn btn-primary btn--pelny">Utwórz profil</button>
        {saProfile && (
          <button type="button" className="btn btn-ghost btn--pelny" onClick={onAnuluj}>Wróć do wyboru profilu</button>
        )}
      </form>
    </div>
  );
}
