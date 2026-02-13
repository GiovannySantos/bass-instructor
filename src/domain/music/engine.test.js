import test from "node:test";
import assert from "node:assert/strict";
import { getScale, getDiatonicChords } from "./engine.js";

test("C Ionian notes", () => {
  const scale = getScale({ root: "C", mode: "ionian" });
  assert.deepEqual(scale.notes, ["C", "D", "E", "F", "G", "A", "B"]);
});

test("D Dorian notes", () => {
  const scale = getScale({ root: "D", mode: "dorian" });
  assert.deepEqual(scale.notes, ["D", "E", "F", "G", "A", "B", "C"]);
});

test("A Aeolian notes", () => {
  const scale = getScale({ root: "A", mode: "aeolian" });
  assert.deepEqual(scale.notes, ["A", "B", "C", "D", "E", "F", "G"]);
});

test("C Ionian triads qualities", () => {
  const chords = getDiatonicChords({ root: "C", mode: "ionian", type: "triads" });
  const qualities = chords.chords.map((ch) => ch.quality);
  assert.deepEqual(qualities, ["maj", "min", "min", "maj", "maj", "min", "dim"]);
});

test("C Ionian sevenths numerals", () => {
  const chords = getDiatonicChords({ root: "C", mode: "ionian", type: "sevenths" });
  const numerals = chords.chords.map((ch) => ch.numeral);
  assert.deepEqual(numerals, ["Imaj7", "ii7", "iii7", "IVmaj7", "V7", "vi7", "viiø7"]);
});

test("Locrian degrees and chord quality", () => {
  const scale = getScale({ root: "B", mode: "locrian" });
  assert.equal(scale.degrees[1], "b2");
  const chords = getDiatonicChords({ root: "B", mode: "locrian", type: "sevenths" });
  assert.equal(chords.chords[0].numeral, "iø7");
});
