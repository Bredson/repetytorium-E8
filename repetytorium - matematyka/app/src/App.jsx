import { useEffect, useMemo, useState } from "react";
import { storage } from "./storage/adapter.js";
import { pustePostepy, migrujPostepy } from "./core/profil.js";
import { generujPlan } from "./core/plan.js";
import { nowaPowtorka, maPowtorke, zaktualizujPowtorki, coNaDzis, dataDnia } from "./core/powtorki.js";
import WyborProfilu from "./ui/pages/WyborProfilu.jsx";
import NowyProfil from "./ui/pages/NowyProfil.jsx";
import EkranPin from "./ui/pages/EkranPin.jsx";
import Start from "./ui/pages/Start.jsx";
import TestWstepny from "./ui/pages/TestWstepny.jsx";
import Dzial from "./ui/pages/Dzial.jsx";
import ZadanieOtwarte from "./ui/pages/ZadanieOtwarte.jsx";
import Powtorka from "./ui/pages/Powtorka.jsx";

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
  const [aktywnyDzial, setAktywnyDzial] = useState(null);
  const [aktywneZadanie, setAktywneZadanie] = useState(null);
  const [wynikZamknietych, setWynikZamknietych] = useState(null);

  // Memoizowane, żeby nie przelosowywać pytań w Powtorka.jsx przy każdym
  // renderze App (Powtorka trzyma `pytaniaPerPowtorka` w useMemo kluczowanym
  // referencją `powtorkiDzis` — nowa tablica przy każdym renderze App
  // wywołałaby ponowne losowanie pytań w trakcie sesji powtórkowej).
  const powtorkiDzis = useMemo(
    () => coNaDzis(postepy?.powtorki ?? [], dataDnia()),
    [postepy?.powtorki]
  );

  useEffect(() => {
    (async () => {
      const lista = await storage.listProfiles();
      setProfile(lista);
      setEkran(lista.length === 0 ? "nowy" : "wybor");
    })();
  }, []);

  async function zaloguj(p) {
    zastosujPreferencje(p);
    let dane = migrujPostepy((await storage.getPostepy(p.id, "matematyka")) ?? pustePostepy());
    if (dane.diagnoza && !dane.plan) {
      dane = { ...dane, plan: generujPlan(dane.diagnoza) };
    }
    await storage.savePostepy(p.id, "matematyka", dane);
    setProfil(p);
    setPostepy(dane);
    setEkran("start");
  }

  async function zapiszPostepy(nowe) {
    await storage.savePostepy(profil.id, "matematyka", nowe);
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
    setEkran(profile.length === 0 ? "nowy" : "wybor");
  }

  async function zakonczonoDiagnoze(wynikPerDzial) {
    const plan = generujPlan(wynikPerDzial);
    const nowe = {
      ...postepy,
      diagnoza: wynikPerDzial,
      plan,
      sesje: [...postepy.sesje, { typ: "diagnoza", data: new Date().toISOString() }],
    };
    await zapiszPostepy(nowe);
    setEkran("start");
  }

  function otworzDzial(id) {
    setAktywnyDzial(id);
    setEkran("dzial");
  }

  function przejdzDoZadaniaOtwartego({ zadanie, wynikZamknietych: wz }) {
    setAktywneZadanie(zadanie);
    setWynikZamknietych(wz);
    setEkran("zadanie-otwarte");
  }

  async function zakonczonoDzial(wynik) {
    const { dzialId, procent } = wynik;
    const nowe = {
      ...postepy,
      dzialy: {
        ...postepy.dzialy,
        [dzialId]: {
          ukonczone: true,
          wynik: procent / 100,
          data: new Date().toISOString().split("T")[0],
        },
      },
      sesje: [
        ...postepy.sesje,
        { typ: "dzial", data: new Date().toISOString(), dzialId, wynik: procent / 100 },
      ],
      plan: postepy.plan
        ? postepy.plan.map((p) => p.dzialId === dzialId ? { ...p, status: "zrobiony" } : p)
        : postepy.plan,
    };
    if (!maPowtorke(nowe.powtorki, dzialId)) {
      const rekord = nowaPowtorka({ id: dzialId, typ: "quiz", ref: dzialId, temat: dzialId });
      nowe.powtorki = zaktualizujPowtorki(nowe.powtorki, rekord);
    }
    await zapiszPostepy(nowe);
    setEkran("start");
  }

  function otworzPowtorke() {
    setEkran("powtorka");
  }

  async function zakonczonoPowtorke(nowePowtorki) {
    const nowe = {
      ...postepy,
      powtorki: nowePowtorki,
      sesje: [...postepy.sesje, { typ: "powtorka", data: new Date().toISOString() }],
    };
    await zapiszPostepy(nowe);
    setEkran("start");
  }

  if (ekran === "ladowanie") return null;

  if (ekran === "wybor") return (
    <WyborProfilu
      profile={profile}
      onWybierz={(p) => { setWybranyProfil(p); setEkran("pin"); }}
      onNowy={() => setEkran("nowy")}
      onImport={async (p) => { setProfile(await storage.listProfiles()); await zaloguj(p); }}
    />
  );

  if (ekran === "nowy") return (
    <NowyProfil
      onUtworzono={utworzono}
      onAnuluj={() => setEkran(profile.length > 0 ? "wybor" : "nowy")}
      saProfile={profile.length > 0}
    />
  );

  if (ekran === "pin") return (
    <EkranPin
      profil={wybranyProfil}
      onOk={() => zaloguj(wybranyProfil)}
      onWroc={() => { setWybranyProfil(null); setEkran("wybor"); }}
    />
  );

  if (ekran === "test-wstepny") return (
    <TestWstepny onZakoncz={zakonczonoDiagnoze} />
  );

  if (ekran === "dzial") return (
    <Dzial
      dzialId={aktywnyDzial}
      postepy={postepy}
      onZakoncz={zakonczonoDzial}
      onZadanieOtwarte={przejdzDoZadaniaOtwartego}
      onWroc={() => setEkran("start")}
    />
  );

  if (ekran === "zadanie-otwarte") return (
    <ZadanieOtwarte
      zadanie={aktywneZadanie}
      wynikZamknietych={wynikZamknietych}
      dzialId={aktywnyDzial}
      onZakoncz={zakonczonoDzial}
      onWroc={() => setEkran("dzial")}
    />
  );

  if (ekran === "powtorka") return (
    <Powtorka
      powtorkiDzis={powtorkiDzis}
      postepy={postepy}
      onZakoncz={zakonczonoPowtorke}
      onWroc={() => setEkran("start")}
    />
  );

  if (ekran === "start") return (
    <Start
      profil={profil}
      postepy={postepy}
      onTestWstepny={() => setEkran("test-wstepny")}
      onDzial={otworzDzial}
      onPowtorka={otworzPowtorke}
      onStatystyki={() => { /* it.3 */ }}
      onWyloguj={wyloguj}
    />
  );

  return null;
}
