import test from "node:test";
import assert from "node:assert/strict";
import { buildInstrument, getFretNote } from "./instrument.js";

test("E + fret 12 == E", () => {
  assert.equal(getFretNote({ tuningNote: "E", fret: 12 }), "E");
});

test("B + fret 2 == C#", () => {
  assert.equal(getFretNote({ tuningNote: "B", fret: 2 }), "C#");
});

test("5 strings preset size", () => {
  const instrument = buildInstrument({ tuning: ["B", "E", "A", "D", "G"] });
  assert.equal(instrument.stringCount, 5);
});

test("fret 0 returns tuning note", () => {
  assert.equal(getFretNote({ tuningNote: "A", fret: 0 }), "A");
});
