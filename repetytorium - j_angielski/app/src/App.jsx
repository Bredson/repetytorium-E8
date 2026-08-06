import { useEffect, useState } from "react";
import { storage } from "./storage/adapter.js";
import { pustePostepy, migrujPostepy } from "./core/profil.js";
import { generujPlan, migrujPlan } from "./core/plan.js";
import { DZIALY } from "./content/angielski/rejestr.js";
import WyborProfilu from "./ui/pages/WyborProfilu.jsx";
import NowyProfil from "./ui/pages/NowyProfil.jsx";
import EkranPin from "./ui/pages/EkranPin.jsx";
import TestWstepny from "./ui/pages/TestWstepny.jsx";
import Start from "./ui/pages/Start.jsx";

// Kolejność działów w planie nauki — pochodzi z rejestru (Object.keys zachowuje kolejność
// wstawiania), nie z osobnej hardkodowanej listy. Nowe działy dodane w rejestrze wchodzą
// do planu automatycznie.
const KOLEJNOSC_DZIALOW = Object.keys(DZIALY);

function zastosujPreferencje(profil) {
  const el = document.documentElement;
  el.dataset.theme = profil?.preferencje?.trybCiemny ? "dark" : "light";
  el.dataset.dysleksja = profil?.preferencje?.dysleksja ? "true" : "false";
}

export default function App() {
  const [ekran, setEkran] = useState("ladowanie");
  const [profile, setProfile] = useState([]);
  const [profil, setProfil] = useState(null);
  const [postepy, setPostepy] = useState(null);
  const [wybranyProfil, setWybranyProfil] = useState(null);

  useEffect(() => {
    (async () => {
      const lista = await storage.listProfiles();
      setProfile(lista);
      setEkran(lista.length === 0 ? "nowy-profil" : "wybor-profilu");
    })();
  }, []);

  async function zaloguj(p) {
    zastosujPreferencje(p);
    let dane = migrujPostepy((await storage.getPostepy(p.id, "angielski")) ?? pustePostepy());
    if (dane.diagnoza && !dane.plan) {
      dane = { ...dane, plan: generujPlan(dane.diagnoza, KOLEJNOSC_DZIALOW) };
    } else if (dane.plan) {
      // Migracja istniejącego profilu: dopisz działy dodane w rejestrze po wygenerowaniu
      // tego planu, bez ruszania dotychczasowych wpisów/statusów.
      dane = { ...dane, plan: migrujPlan(dane.plan, KOLEJNOSC_DZIALOW, dane.diagnoza) };
    }
    await storage.savePostepy(p.id, "angielski", dane);
    setProfil(p);
    setPostepy(dane);
    setEkran("start");
  }

  async function zapiszPostepy(nowe) {
    await storage.savePostepy(profil.id, "angielski", nowe);
    setPostepy(nowe);
  }

  async function utworzono(p) {
    await storage.saveProfile(p);
    setProfile(await storage.listProfiles());
    await zaloguj(p);
  }

  function wyloguj() {
    setProfil(null);
    setPostepy(null);
    zastosujPreferencje(null);
    setEkran(profile.length === 0 ? "nowy-profil" : "wybor-profilu");
  }

  async function zakonczonoDiagnoze(wynikPerDzial) {
    const plan = generujPlan(wynikPerDzial, KOLEJNOSC_DZIALOW);
    const nowe = {
      ...postepy,
      diagnoza: wynikPerDzial,
      plan,
      sesje: [...postepy.sesje, { typ: "diagnoza", data: new Date().toISOString() }],
    };
    await zapiszPostepy(nowe);
    setEkran("start");
  }

  // Działy/powtórki — ekrany dodamy w kolejnych iteracjach (T5+).
  // Na razie karty w Start.jsx nie prowadzą jeszcze donikąd.
  function otworzDzial() {}
  function otworzPowtorke() {}

  if (ekran === "ladowanie") return null;

  if (ekran === "wybor-profilu") return (
    <WyborProfilu
      profile={profile}
      onWybierz={(p) => { setWybranyProfil(p); setEkran("pin"); }}
      onNowy={() => setEkran("nowy-profil")}
      onImport={async (p) => { setProfile(await storage.listProfiles()); await zaloguj(p); }}
    />
  );

  if (ekran === "nowy-profil") return (
    <NowyProfil
      onUtworzono={utworzono}
      onAnuluj={() => setEkran(profile.length > 0 ? "wybor-profilu" : "nowy-profil")}
      saProfile={profile.length > 0}
    />
  );

  if (ekran === "pin") return (
    <EkranPin
      profil={wybranyProfil}
      onOk={() => zaloguj(wybranyProfil)}
      onWroc={() => { setWybranyProfil(null); setEkran("wybor-profilu"); }}
    />
  );

  if (ekran === "test-wstepny") return (
    <TestWstepny onZakoncz={zakonczonoDiagnoze} />
  );

  if (ekran === "start") return (
    <Start
      profil={profil}
      postepy={postepy}
      onTestWstepny={() => setEkran("test-wstepny")}
      onDzial={otworzDzial}
      onPowtorka={otworzPowtorke}
      onWyloguj={wyloguj}
    />
  );

  return null;
}
