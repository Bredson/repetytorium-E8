function losowyHex(bajty) {
  const arr = new Uint8Array(bajty);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function hashPin(pin, salt) {
  const tekst = `${pin}:${salt}`;
  if (crypto.subtle) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(tekst));
    return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
  }
  let h = 0x811c9dc5;
  for (let i = 0; i < tekst.length; i++) {
    h ^= tekst.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return `fnv:${h.toString(16)}`;
}

export function walidujPin(pin) {
  return /^\d{4}$/.test(pin);
}

export async function nowyProfil({ imie, pin, dataEgzaminu, dysleksja }) {
  const salt = losowyHex(8);
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : losowyHex(16),
    imie: imie.trim(),
    pinHash: await hashPin(pin, salt),
    salt,
    przedmioty: ["angielski"],
    dataEgzaminu: dataEgzaminu || "2027-05-12", // placeholder — dokładny termin CKE nieznany do 20.08.2026
    utworzono: new Date().toISOString(),
    preferencje: { dysleksja: !!dysleksja, trybCiemny: false },
  };
}

export async function weryfikujPin(profil, pin) {
  return (await hashPin(pin, profil.salt)) === profil.pinHash;
}

export function dniDoEgzaminu(profil, teraz = new Date()) {
  const cel = new Date(`${profil.dataEgzaminu}T09:00:00`);
  return Math.max(0, Math.ceil((cel - teraz) / 86400000));
}

export function pustePostepy() {
  return {
    wersjaSchematu: 4,
    diagnoza: null,
    plan: null,
    dzialy: {},
    sesje: [],
    powtorki: [],
    egzaminy: [],
  };
}

export function migrujPostepy(postepy) {
  if (!postepy) return pustePostepy();
  // Schemat startuje od v4 — brak migracji poniżej
  return { ...pustePostepy(), ...postepy, wersjaSchematu: 4 };
}
