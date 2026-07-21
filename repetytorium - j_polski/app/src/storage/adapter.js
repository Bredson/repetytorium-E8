/**
 * StorageAdapter — implementacja localStorage.
 * Kontrakt async: przyszła implementacja Supabase podmienia ten moduł 1:1,
 * UI i core nie zauważą różnicy (patrz docs/ARCHITEKTURA.md, ADR-1).
 */

const P = "rep:";

function czytaj(klucz) {
  const raw = localStorage.getItem(klucz);
  return raw ? JSON.parse(raw) : null;
}

function zapisz(klucz, dane) {
  localStorage.setItem(klucz, JSON.stringify(dane));
}

export const storage = {
  async listProfiles() {
    const profile = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(`${P}profil:`)) profile.push(czytaj(k));
    }
    return profile.sort((a, b) => a.utworzono.localeCompare(b.utworzono));
  },

  async getProfile(id) {
    return czytaj(`${P}profil:${id}`);
  },

  async saveProfile(profil) {
    zapisz(`${P}profil:${profil.id}`, profil);
    return profil;
  },

  async deleteProfile(id) {
    localStorage.removeItem(`${P}profil:${id}`);
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && k.startsWith(`${P}postepy:${id}:`)) localStorage.removeItem(k);
    }
  },

  async getPostepy(profilId, przedmiot) {
    return czytaj(`${P}postepy:${profilId}:${przedmiot}`);
  },

  async savePostepy(profilId, przedmiot, dane) {
    zapisz(`${P}postepy:${profilId}:${przedmiot}`, dane);
    return dane;
  },

  /** Eksport profilu + wszystkich postępów do jednego obiektu (backup / przenosiny). */
  async exportAll(profilId) {
    const profil = await this.getProfile(profilId);
    if (!profil) throw new Error("Brak profilu");
    const postepy = {};
    for (const przedmiot of profil.przedmioty) {
      postepy[przedmiot] = await this.getPostepy(profilId, przedmiot);
    }
    return { wersjaEksportu: 1, wyeksportowano: new Date().toISOString(), profil, postepy };
  },

  async importAll(dane) {
    if (!dane || dane.wersjaEksportu !== 1 || !dane.profil?.id) {
      throw new Error("Nieprawidłowy plik eksportu");
    }
    await this.saveProfile(dane.profil);
    for (const [przedmiot, p] of Object.entries(dane.postepy || {})) {
      if (p) await this.savePostepy(dane.profil.id, przedmiot, p);
    }
    return dane.profil;
  },
};
