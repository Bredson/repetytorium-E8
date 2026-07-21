/**
 * Model profilu ucznia — czysta logika, zero DOM/React.
 */

function losowyHex(bajty) {
  const arr = new Uint8Array(bajty);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

/** SHA-256 przez WebCrypto; fallback FNV-1a gdy brak secure context (np. file://). */
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

export async function nowyProfil({ imie, pin, dataEgzaminu, dysleksja, trybCiemny }) {
  const salt = losowyHex(8);
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : losowyHex(16),
    imie: imie.trim(),
    pinHash: await hashPin(pin, salt),
    salt,
    przedmioty: ["polski"],
    dataEgzaminu: dataEgzaminu || "2027-05-11",
    utworzono: new Date().toISOString(),
    preferencje: { dysleksja: !!dysleksja, trybCiemny: !!trybCiemny },
  };
}

export async function weryfikujPin(profil, pin) {
  return (await hashPin(pin, profil.salt)) === profil.pinHash;
}

export function dniDoEgzaminu(profil, teraz = new Date()) {
  const cel = new Date(`${profil.dataEgzaminu}T09:00:00`);
  return Math.max(0, Math.ceil((cel - teraz) / 86400000));
}

/** Pusty stan postępów — schemat wg docs/ARCHITEKTURA.md + rozszerzenia Fazy 1 (SPEC-FAZA-1, -IT2). */
export function pustePostepy() {
  return {
    wersjaSchematu: 4,
    diagnoza: null,
    plan: null,
    lektury: {},
    cwiczenia: {},
    pisanie: {},
    egzaminy: [],
    sesje: [],
    powtorki: [],
    kamienieMilowe: { X2026: null, I2027: null, III2027: null, IV2027: null },
  };
}

/** Migracja schematu postępów do bieżącej wersji (idempotentna, immutable). */
export function migrujPostepy(postepy) {
  if (!postepy) return pustePostepy();
  let dane = postepy;
  if (dane.wersjaSchematu < 2) {
    // 1 → 2: dodaj plan nauki i stan lektur
    dane = { ...dane, wersjaSchematu: 2, plan: null, lektury: {} };
  }
  if (dane.wersjaSchematu < 3) {
    // 2 → 3: dodaj stan ćwiczeń modułowych i form pisemnych
    dane = { ...dane, wersjaSchematu: 3, cwiczenia: {}, pisanie: {} };
  }
  if (dane.wersjaSchematu < 4) {
    // 3 → 4: dodaj historię egzaminów próbnych
    dane = { ...dane, wersjaSchematu: 4, egzaminy: [] };
  }
  return dane;
}
