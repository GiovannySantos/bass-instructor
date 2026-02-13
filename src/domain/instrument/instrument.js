import { NOTES } from "../music/engine.js";

export const INSTRUMENT_PRESETS = [
  {
    id: "4EADG",
    name: "4 cordas (EADG)",
    tuning: ["E", "A", "D", "G"],
  },
  {
    id: "5BEADG",
    name: "5 cordas (BEADG)",
    tuning: ["B", "E", "A", "D", "G"],
  },
  {
    id: "dropD",
    name: "Drop D (DADG)",
    tuning: ["D", "A", "D", "G"],
  },
  {
    id: "custom",
    name: "Custom",
    tuning: ["E", "A", "D", "G"],
  },
];


const DEFAULT_TUNINGS = {
  4: ["E", "A", "D", "G"],
  5: ["B", "E", "A", "D", "G"],
  6: ["B", "E", "A", "D", "G", "C"],
};

const NOTE_INDEX = NOTES.reduce((acc, note, idx) => {
  acc[note] = idx;
  return acc;
}, {});

const FLAT_TO_SHARP = {
  DB: "C#",
  EB: "D#",
  GB: "F#",
  AB: "G#",
  BB: "A#",
};

export function normalizeNote(note) {
  if (!note) return "C";
  const raw = String(note).trim().toUpperCase();
  if (FLAT_TO_SHARP[raw]) return FLAT_TO_SHARP[raw];
  if (NOTE_INDEX[raw] !== undefined) return raw;
  return "C";
}

export function buildInstrument({ strings, tuning, name } = {}) {
  const normalized = (tuning && tuning.length ? tuning : []).map(normalizeNote);
  const requested = Number(strings || normalized.length || 4);
  const stringCount = Math.min(6, Math.max(4, requested));
  const fallback = DEFAULT_TUNINGS[stringCount] || DEFAULT_TUNINGS[4];
  const safeTuning = normalized.length
    ? normalized.slice(0, stringCount).concat(fallback.slice(normalized.length, stringCount))
    : fallback.slice(0, stringCount);
  return {
    stringCount: safeTuning.length,
    tuning: safeTuning,
    name,
  };
}

export function getFretNote({ tuningNote, fret }) {
  const base = normalizeNote(tuningNote);
  const index = NOTE_INDEX[base] ?? 0;
  const next = (index + (Number(fret) || 0)) % 12;
  return NOTES[next];
}
