/**
 * Statystyki postępu — czysta logika agregacji, zero DOM/importów treści.
 * Mapy etykiet/modułów/liczebności buduje UI z rejestru i podaje argumentami.
 */

const TYPY_PUNKTOWE = {
  diagnoza: "Test wstępny",
  "quiz-lektury": "Quiz",
  "quiz-cwiczenia": "Ćwiczenie",
  pisanie: "Pisanie",
  egzamin: "Egzamin próbny",
};

/** Chronologiczna seria procentowych wyników sesji (bez powtórek/fiszek — inna skala). */
export function seriaWynikow(postepy, mapaEtykiet = {}) {
  return (postepy.sesje ?? [])
    .filter((s) => s.typ in TYPY_PUNKTOWE && s.maksPkt > 0)
    .map((s) => ({
      data: s.data,
      procent: Math.round((100 * s.wynikPkt) / s.maksPkt),
      typ: s.typ,
      etykieta: s.ref ? `${TYPY_PUNKTOWE[s.typ]}: ${mapaEtykiet[s.ref] ?? s.ref}` : TYPY_PUNKTOWE[s.typ],
    }))
    .sort((a, b) => a.data.localeCompare(b.data));
}
