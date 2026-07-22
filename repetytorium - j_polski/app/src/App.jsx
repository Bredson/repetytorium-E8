import { useEffect, useState } from "react";
import { storage } from "./storage/adapter.js";
import { pustePostepy, migrujPostepy } from "./core/profil.js";
import { generujPlan } from "./core/plan.js";
import { nowaPowtorka, oznaczPowtorke, zaktualizujPowtorki, maPowtorke } from "./core/powtorki.js";
import { LEKTURY, CWICZENIA, PISANIE, PULA_EGZAMINU, FORMY_EGZAMINU, material } from "./content/polski/rejestr.js";
import WyborProfilu from "./ui/pages/WyborProfilu.jsx";
import NowyProfil from "./ui/pages/NowyProfil.jsx";
import EkranPin from "./ui/pages/EkranPin.jsx";
import Start from "./ui/pages/Start.jsx";
import TestWstepny from "./ui/pages/TestWstepny.jsx";
import Wynik from "./ui/pages/Wynik.jsx";
import Lektura from "./ui/pages/Lektura.jsx";
import Powtorka from "./ui/pages/Powtorka.jsx";
import Cwiczenie from "./ui/pages/Cwiczenie.jsx";
import Pisanie from "./ui/pages/Pisanie.jsx";
import EgzaminProbny from "./ui/pages/EgzaminProbny.jsx";
import Statystyki from "./ui/pages/Statystyki.jsx";

/** Mapy dla ekranu statystyk — budowane raz z rejestru (core nie importuje treści). */
const MAPA_ETYKIET = Object.fromEntries(
  [...Object.values(LEKTURY), ...Object.values(CWICZENIA), ...Object.values(PISANIE)].map((m) => [m.id, m.tytul])
);
const MAPA_MODULOW = Object.fromEntries(Object.values(CWICZENIA).map((c) => [c.id, c.modul]));
const LICZEBNOSCI = {
  lektury: Object.keys(LEKTURY).length,
  cwiczenia: Object.keys(CWICZENIA).length,
  pisanie: Object.keys(PISANIE).length,
};

/** Ustawia atrybuty motywu na <html> zgodnie z preferencjami profilu. */
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
  const [swiezyWynik, setSwiezyWynik] = useState(false);
  const [aktywnaLektura, setAktywnaLektura] = useState(null);
  const [aktywnaPowtorka, setAktywnaPowtorka] = useState(null);
  const [aktywneCwiczenie, setAktywneCwiczenie] = useState(null);
  const [aktywnePisanie, setAktywnePisanie] = useState(null);

  useEffect(() => {
    (async () => {
      const lista = await storage.listProfiles();
      setProfile(lista);
      setEkran(lista.length === 0 ? "nowy" : "wybor");
    })();
  }, []);

  async function zaloguj(p) {
    zastosujPreferencje(p);
    let dane = migrujPostepy((await storage.getPostepy(p.id, "polski")) ?? pustePostepy());
    if (dane.diagnoza && !dane.plan) {
      dane = { ...dane, plan: generujPlan(dane.diagnoza, p.dataEgzaminu) };
    }
    await storage.savePostepy(p.id, "polski", dane);
    setProfil(p);
    setPostepy(dane);
    setEkran("start");
  }

  async function zapiszPostepy(nowe) {
    await storage.savePostepy(profil.id, "polski", nowe);
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
    setSwiezyWynik(false);
    zastosujPreferencje(null);
    setEkran(profile.length === 0 ? "nowy" : "wybor");
  }

  async function zakonczonoDiagnoze(wynik) {
    const nowe = {
      ...postepy,
      diagnoza: wynik,
      plan: generujPlan(wynik, profil.dataEgzaminu),
      sesje: [
        ...postepy.sesje,
        { typ: "diagnoza", data: wynik.data, wynikPkt: wynik.wynikPkt, maksPkt: wynik.maksPkt },
      ],
    };
    await zapiszPostepy(nowe);
    setSwiezyWynik(true);
    setEkran("wynik");
  }

  /** Aktualizuje stan jednej lektury w postępach (immutable). */
  function zLektura(ref, zmiana) {
    const stan = postepy.lektury[ref] ?? { sekcjePrzeczytane: [] };
    return { ...postepy, lektury: { ...postepy.lektury, [ref]: { ...stan, ...zmiana } } };
  }

  async function zapiszSekcje(ref, sekcje) {
    await zapiszPostepy(zLektura(ref, { sekcjePrzeczytane: sekcje }));
  }

  async function zapiszQuizLektury(ref, wynik) {
    const lekt = LEKTURY[ref];
    let nowe = zLektura(ref, { quiz: wynik });
    nowe = {
      ...nowe,
      sesje: [...nowe.sesje, { typ: "quiz-lektury", ref, data: wynik.data, wynikPkt: wynik.wynikPkt, maksPkt: wynik.maksPkt }],
    };
    const id = `${ref}:quiz`;
    if (!maPowtorke(nowe.powtorki, id)) {
      nowe = {
        ...nowe,
        powtorki: [...nowe.powtorki, nowaPowtorka({ id, typ: "quiz", ref, temat: `${lekt.tytul} — quiz` })],
      };
    }
    await zapiszPostepy(nowe);
  }

  async function zapiszFiszkiLektury(ref, wynik) {
    const lekt = LEKTURY[ref];
    let nowe = zLektura(ref, { fiszki: wynik });
    nowe = {
      ...nowe,
      sesje: [...nowe.sesje, { typ: "fiszki-lektury", ref, data: new Date().toISOString().slice(0, 10), umiem: wynik.umiem, razem: wynik.razem }],
    };
    const id = `${ref}:fiszki`;
    if (!maPowtorke(nowe.powtorki, id)) {
      nowe = {
        ...nowe,
        powtorki: [...nowe.powtorki, nowaPowtorka({ id, typ: "fiszka", ref, temat: `${lekt.tytul} — fiszki` })],
      };
    }
    await zapiszPostepy(nowe);
  }

  /** Quiz ćwiczenia modułowego: wynik + sesja + powtórka spaced repetition. */
  async function zapiszQuizCwiczenia(ref, wynik) {
    const cw = CWICZENIA[ref];
    let nowe = {
      ...postepy,
      cwiczenia: { ...postepy.cwiczenia, [ref]: { ...(postepy.cwiczenia[ref] ?? {}), quiz: wynik } },
      sesje: [...postepy.sesje, { typ: "quiz-cwiczenia", ref, data: wynik.data, wynikPkt: wynik.wynikPkt, maksPkt: wynik.maksPkt }],
    };
    const id = `${ref}:quiz`;
    if (!maPowtorke(nowe.powtorki, id)) {
      nowe = {
        ...nowe,
        powtorki: [...nowe.powtorki, nowaPowtorka({ id, typ: "quiz", ref, temat: `${cw.tytul} — quiz` })],
      };
    }
    await zapiszPostepy(nowe);
  }

  /** Krótka forma pisemna: zapis pracy z samooceną (bez powtórek — co tydzień nowa forma). */
  async function zapiszPisanie(ref, wynik) {
    await zapiszPostepy({
      ...postepy,
      pisanie: { ...postepy.pisanie, [ref]: wynik },
      sesje: [...postepy.sesje, { typ: "pisanie", ref, data: wynik.data, wynikPkt: wynik.pkt, maksPkt: wynik.maks }],
    });
  }

  /** Egzamin próbny: pełny wynik do historii + sesja (bez powtórek — omówienie na miejscu). */
  async function zapiszEgzamin(wynik) {
    await zapiszPostepy({
      ...postepy,
      egzaminy: [...(postepy.egzaminy ?? []), wynik],
      sesje: [...postepy.sesje, { typ: "egzamin", data: wynik.data, wynikPkt: wynik.wynikPkt, maksPkt: wynik.maksPkt }],
    });
  }

  /** Ocena powtórki — zwraca nowy rekord (UI pokazuje kolejny interwał). */
  function ocenPowtorke(ocena, wynik) {
    const nowy = oznaczPowtorke(aktywnaPowtorka, ocena);
    const nowe = {
      ...postepy,
      powtorki: zaktualizujPowtorki(postepy.powtorki, nowy),
      sesje: [...postepy.sesje, { typ: "powtorka", id: nowy.id, data: new Date().toISOString().slice(0, 10), ocena, wynik }],
    };
    zapiszPostepy(nowe);
    return nowy;
  }

  async function zmienMotyw() {
    const nowy = {
      ...profil,
      preferencje: { ...profil.preferencje, trybCiemny: !profil.preferencje.trybCiemny },
    };
    await storage.saveProfile(nowy);
    setProfil(nowy);
    setProfile(await storage.listProfiles());
    zastosujPreferencje(nowy);
  }

  if (ekran === "ladowanie") return null;

  if (ekran === "wybor")
    return (
      <WyborProfilu
        profile={profile}
        onWybierz={(p) => { setProfil(p); setEkran("pin"); }}
        onNowy={() => setEkran("nowy")}
        onImport={async (p) => { setProfile(await storage.listProfiles()); setProfil(p); setEkran("pin"); }}
      />
    );

  if (ekran === "nowy")
    return <NowyProfil onUtworzono={utworzono} onAnuluj={wyloguj} saProfile={profile.length > 0} />;

  if (ekran === "pin")
    return <EkranPin profil={profil} onOk={() => zaloguj(profil)} onWroc={wyloguj} />;

  if (ekran === "start")
    return (
      <Start
        profil={profil}
        postepy={postepy}
        onStartTest={() => setEkran("test")}
        onPokazWynik={() => { setSwiezyWynik(false); setEkran("wynik"); }}
        onOtworzLekture={(ref) => { setAktywnaLektura(ref); setEkran("lektura"); }}
        onOtworzPowtorke={(rekord) => { setAktywnaPowtorka(rekord); setEkran("powtorka"); }}
        onOtworzCwiczenie={(ref) => { setAktywneCwiczenie(ref); setEkran("cwiczenie"); }}
        onOtworzPisanie={(ref) => { setAktywnePisanie(ref); setEkran("pisanie"); }}
        onOtworzEgzamin={() => setEkran("egzamin")}
        onOtworzStatystyki={() => setEkran("statystyki")}
        onWyloguj={wyloguj}
        onZmienMotyw={zmienMotyw}
      />
    );

  if (ekran === "lektura" && aktywnaLektura)
    return (
      <Lektura
        lektura={LEKTURY[aktywnaLektura]}
        stan={postepy.lektury[aktywnaLektura]}
        onSekcje={(sekcje) => zapiszSekcje(aktywnaLektura, sekcje)}
        onQuiz={(wynik) => zapiszQuizLektury(aktywnaLektura, wynik)}
        onFiszki={(wynik) => zapiszFiszkiLektury(aktywnaLektura, wynik)}
        onWroc={() => { setAktywnaLektura(null); setEkran("start"); }}
      />
    );

  if (ekran === "powtorka" && aktywnaPowtorka)
    return (
      <Powtorka
        rekord={aktywnaPowtorka}
        material={material(aktywnaPowtorka.ref)}
        onGotowe={ocenPowtorke}
        onWroc={() => { setAktywnaPowtorka(null); setEkran("start"); }}
      />
    );

  if (ekran === "cwiczenie" && aktywneCwiczenie)
    return (
      <Cwiczenie
        cwiczenie={CWICZENIA[aktywneCwiczenie]}
        onQuiz={(wynik) => zapiszQuizCwiczenia(aktywneCwiczenie, wynik)}
        onWroc={() => { setAktywneCwiczenie(null); setEkran("start"); }}
      />
    );

  if (ekran === "pisanie" && aktywnePisanie)
    return (
      <Pisanie
        tresc={PISANIE[aktywnePisanie]}
        onGotowe={(wynik) => zapiszPisanie(aktywnePisanie, wynik)}
        onWroc={() => { setAktywnePisanie(null); setEkran("start"); }}
      />
    );

  if (ekran === "egzamin")
    return (
      <EgzaminProbny
        pula={PULA_EGZAMINU}
        formy={FORMY_EGZAMINU}
        diagnoza={postepy.diagnoza}
        onGotowe={zapiszEgzamin}
        onWroc={() => setEkran("start")}
      />
    );

  if (ekran === "statystyki")
    return (
      <Statystyki
        postepy={postepy}
        mapaEtykiet={MAPA_ETYKIET}
        mapaModulow={MAPA_MODULOW}
        liczebnosci={LICZEBNOSCI}
        onWroc={() => setEkran("start")}
      />
    );

  if (ekran === "test")
    return <TestWstepny onGotowe={zakonczonoDiagnoze} onPrzerwij={() => setEkran("start")} />;

  if (ekran === "wynik")
    return (
      <Wynik
        profil={profil}
        diagnoza={postepy.diagnoza}
        swiezy={swiezyWynik}
        onDalej={() => { setSwiezyWynik(false); setEkran("start"); }}
      />
    );

  return null;
}
