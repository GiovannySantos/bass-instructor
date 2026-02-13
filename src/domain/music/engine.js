export const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const NOTE_INDEX = NOTES.reduce((acc, note, idx) => {
  acc[note] = idx;
  return acc;
}, {});

// V1 limitation: uses sharp spelling only (no enharmonic/bemol resolution).
const MODE_INTERVALS = {
  ionian: [0, 2, 4, 5, 7, 9, 11],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  aeolian: [0, 2, 3, 5, 7, 8, 10],
  locrian: [0, 1, 3, 5, 6, 8, 10],
};

const IONIAN_INTERVALS = MODE_INTERVALS.ionian;

const degreeLabels = ["1", "2", "3", "4", "5", "6", "7"];

export function getScale({ root, mode }) {
  const intervals = MODE_INTERVALS[mode];
  if (!intervals) {
    throw new Error(`Unknown mode: ${mode}`);
  }
  const rootIndex = NOTE_INDEX[root];
  if (rootIndex === undefined) {
    throw new Error(`Unknown root: ${root}`);
  }
  const notes = intervals.map((semi) => NOTES[(rootIndex + semi) % 12]);
  const degrees = intervals.map((semi, idx) => {
    const base = IONIAN_INTERVALS[idx];
    const diff = semi - base;
    if (diff === -1) return `b${degreeLabels[idx]}`;
    if (diff === 1) return `#${degreeLabels[idx]}`;
    return degreeLabels[idx];
  });
  return { root, mode, notes, degrees, intervals };
}

const TRIAD_QUALITIES = {
  "0,4,7": "maj",
  "0,3,7": "min",
  "0,3,6": "dim",
  "0,4,8": "aug",
};

const SEVENTH_QUALITIES = {
  "0,4,7,11": "maj7",
  "0,4,7,10": "7",
  "0,3,7,10": "min7",
  "0,3,6,10": "hdim7",
  "0,3,6,9": "dim7",
  "0,4,8,11": "augmaj7",
};

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII"];

const buildTriadNumeral = (degreeIndex, quality) => {
  const base = ROMAN[degreeIndex] || "";
  if (quality === "maj") return base;
  if (quality === "min") return base.toLowerCase();
  if (quality === "dim") return `${base.toLowerCase()}°`;
  if (quality === "aug") return `${base}+`;
  return base;
};

const buildSeventhNumeral = (degreeIndex, quality) => {
  const base = ROMAN[degreeIndex] || "";
  if (quality === "maj7") return `${base}maj7`;
  if (quality === "7") return `${base}7`;
  if (quality === "min7") return `${base.toLowerCase()}7`;
  if (quality === "hdim7") return `${base.toLowerCase()}ø7`;
  if (quality === "dim7") return `${base.toLowerCase()}°7`;
  if (quality === "augmaj7") return `${base}+maj7`;
  return base;
};

const intervalKey = (root, notes) =>
  notes.map((n) => (n - root + 12) % 12).join(",");


const normalizeQuality = (quality, type) => {
  if (type === "triads") return quality;
  if (quality === "maj7") return "maj";
  if (quality === "7") return "maj";
  if (quality === "min7") return "min";
  if (quality === "hdim7") return "hdim";
  if (quality === "dim7") return "dim";
  if (quality === "augmaj7") return "aug";
  return quality;
};

export function getDiatonicChords({ root, mode, type }) {
  const scale = getScale({ root, mode });
  const degreeCount = scale.notes.length;
  const chords = Array.from({ length: degreeCount }, (_, degreeIndex) => {
    const chordNotes =
      type === "sevenths"
        ? [
            scale.notes[degreeIndex % degreeCount],
            scale.notes[(degreeIndex + 2) % degreeCount],
            scale.notes[(degreeIndex + 4) % degreeCount],
            scale.notes[(degreeIndex + 6) % degreeCount],
          ]
        : [
            scale.notes[degreeIndex % degreeCount],
            scale.notes[(degreeIndex + 2) % degreeCount],
            scale.notes[(degreeIndex + 4) % degreeCount],
          ];
    const rootNote = chordNotes[0];
    const rootIndex = NOTE_INDEX[rootNote];
    const semis = chordNotes.map((note) => NOTE_INDEX[note]);
    const key = intervalKey(rootIndex, semis);
    const quality =
      type === "sevenths"
        ? SEVENTH_QUALITIES[key] || "unknown"
        : TRIAD_QUALITIES[key] || "unknown";
    const numeral =
      type === "sevenths"
        ? buildSeventhNumeral(degreeIndex, quality)
        : buildTriadNumeral(degreeIndex, quality);
    return {
      degree: ROMAN[degreeIndex],
      numeral,
      quality: normalizeQuality(quality, type),
      notes: chordNotes,
    };
  });
  return { type, chords };
}

const INTERVAL_LABELS = {
  0: "1P",
  1: "2m",
  2: "2M",
  3: "3m",
  4: "3M",
  5: "4P",
  6: "4A",
  7: "5P",
  8: "6m",
  9: "6M",
  10: "7m",
  11: "7M",
};

export function getIntervalLabel(semitones) {
  return INTERVAL_LABELS[((semitones % 12) + 12) % 12] || `${semitones}`;
}
