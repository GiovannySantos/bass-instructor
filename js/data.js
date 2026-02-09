export const notes = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

export const scales = [
  {
    id: "major",
    label: "Maior",
    intervals: [0, 2, 4, 5, 7, 9, 11],
    degrees: ["1", "2", "3", "4", "5", "6", "7"],
    triad: [0, 2, 4],
    tetrad: [0, 2, 4, 6],
  },
  {
    id: "naturalMinor",
    label: "Menor Natural",
    intervals: [0, 2, 3, 5, 7, 8, 10],
    degrees: ["1", "2", "b3", "4", "5", "b6", "b7"],
    triad: [0, 2, 4],
    tetrad: [0, 2, 4, 6],
  },
  {
    id: "minorPentatonic",
    label: "Pentatônica Menor",
    intervals: [0, 3, 5, 7, 10],
    degrees: ["1", "b3", "4", "5", "b7"],
    triad: [0, 1, 3],
    tetrad: [0, 1, 3, 4],
  },
];

export const stringTuning = [7, 2, 9, 4];
export const fretCount = 12;
