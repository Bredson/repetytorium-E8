// Walidacja treści ćwiczenia modułowego (content/polski/cwiczenia/*.json).
// Użycie: node scripts/waliduj-cwiczenie.mjs src/content/polski/cwiczenia/ortografia-1.json
import { readFileSync } from "node:fs";

const plik = process.argv[2];
if (!plik) throw new Error("Podaj ścieżkę do JSON-a ćwiczenia.");
const c = JSON.parse(readFileSync(plik, "utf8"));

const bledy = [];
const ok = (warunek, opis) => warunek || bledy.push(opis);

// --- meta ---
ok(typeof c.id === "string" && c.id, "brak id");
ok(["A", "B", "C", "D", "E", "F"].includes(c.modul), "modul spoza A-F");
ok(typeof c.tytul === "string" && c.tytul, "brak tytul");

// --- teoria ---
ok(Array.isArray(c.teoria) && c.teoria.length >= 4 && c.teoria.length <= 6,
  `teoria: ${c.teoria?.length} sekcji (wymagane 4-6)`);
for (const s of c.teoria ?? []) {
  ok(s.id && s.tytul && s.tresc, `sekcja ${s.id}: brak id/tytul/tresc`);
  ok(Array.isArray(s.punkty) && s.punkty.length >= 3, `sekcja ${s.id}: <3 punktów`);
  ok(Number.isFinite(s.czasMin) && s.czasMin > 0, `sekcja ${s.id}: zły czasMin`);
}
ok(new Set((c.teoria ?? []).map((s) => s.id)).size === (c.teoria ?? []).length,
  "teoria: zdublowane id sekcji");

// --- quiz ---
ok(Array.isArray(c.quiz) && c.quiz.length >= 10 && c.quiz.length <= 12,
  `quiz: ${c.quiz?.length} pytań (wymagane 10-12)`);
const rozkladPoprawnych = {};
for (const p of c.quiz ?? []) {
  ok(p.id && p.tresc && p.wyjasnienie, `${p.id}: brak id/tresc/wyjasnienie`);
  ok(p.modul === c.modul, `${p.id}: modul != ${c.modul}`);
  ok([1, 2, 3].includes(p.poziom), `${p.id}: poziom spoza 1-3`);
  ok(p.punkty >= 1, `${p.id}: punkty < 1`);
  ok(Array.isArray(p.opcje) && p.opcje.length >= 3, `${p.id}: <3 opcje`);
  if (p.typ === "single") {
    ok(Number.isInteger(p.poprawna) && p.poprawna >= 0 && p.poprawna < p.opcje.length,
      `${p.id}: poprawna poza zakresem opcji`);
    rozkladPoprawnych[p.poprawna] = (rozkladPoprawnych[p.poprawna] ?? 0) + 1;
  } else if (p.typ === "multi") {
    ok(Array.isArray(p.poprawne) && p.poprawne.length >= 1 &&
      p.poprawne.every((i) => Number.isInteger(i) && i >= 0 && i < p.opcje.length),
      `${p.id}: poprawne poza zakresem opcji`);
  } else if (p.typ === "truefalse") {
    ok(Array.isArray(p.poprawnaMaska) && p.poprawnaMaska.length === p.opcje.length &&
      p.poprawnaMaska.every((v) => typeof v === "boolean"),
      `${p.id}: poprawnaMaska niezgodna z opcjami`);
  } else {
    bledy.push(`${p.id}: nieznany typ ${p.typ}`);
  }
}
ok(new Set((c.quiz ?? []).map((p) => p.id)).size === (c.quiz ?? []).length,
  "quiz: zdublowane id pytań");
const poziomy = new Set((c.quiz ?? []).map((p) => p.poziom));
ok(poziomy.has(1) && poziomy.has(2) && poziomy.has(3), "quiz: brak pełnego zakresu poziomów 1-3");
const maxTejSamej = Math.max(...Object.values(rozkladPoprawnych));
ok(maxTejSamej <= Math.ceil(Object.values(rozkladPoprawnych).reduce((a, b) => a + b, 0) / 2),
  `quiz single: zbyt skupiony klucz odpowiedzi ${JSON.stringify(rozkladPoprawnych)}`);

if (bledy.length) {
  console.error(`✗ ${plik}:\n- ` + bledy.join("\n- "));
  process.exit(1);
}
console.log(`✓ ${c.id}: ${c.teoria.length} sekcji teorii, ${c.quiz.length} pytań, ` +
  `rozkład kluczy single ${JSON.stringify(rozkladPoprawnych)} — OK`);
