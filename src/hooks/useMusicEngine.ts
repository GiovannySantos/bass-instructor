import { useMemo } from "react";
import { Chord, Interval, Note, Scale } from "tonal";

export type ChordShape = {
  degree: number;
  symbol: string;
  notes: string[];
};

export type FretPosition = {
  stringName: string;
  stringIndex: number;
  fret: number;
  note: string;
  pitchClass: string;
  isScaleNote: boolean;
};

export type FretboardString = {
  stringName: string;
  positions: FretPosition[];
};

export type MusicEngineResult = {
  scaleNotes: string[];
  intervals: string[];
  chords: ChordShape[];
  fretboardData: () => FretboardString[];
};

const STRINGS = ["E2", "A2", "D3", "G3"];
const MAX_FRET = 12;

const buildTetrads = (scaleNotes: string[]): ChordShape[] => {
  if (!scaleNotes.length) return [];
  return scaleNotes.map((_, index) => {
    const chordNotes = [
      scaleNotes[index % scaleNotes.length],
      scaleNotes[(index + 2) % scaleNotes.length],
      scaleNotes[(index + 4) % scaleNotes.length],
      scaleNotes[(index + 6) % scaleNotes.length],
    ];
    const detected = Chord.detect(chordNotes);
    return {
      degree: index + 1,
      symbol: detected[0] || chordNotes.join("-"),
      notes: chordNotes,
    };
  });
};

const buildFretboard = (scaleSet: Set<string>): FretboardString[] => {
  return STRINGS.map((openNote, stringIndex) => {
    const stringName = openNote.replace(/\d+/g, "");
    const positions: FretPosition[] = Array.from({ length: MAX_FRET + 1 }, (_, fret) => {
      const note = Note.transpose(openNote, Interval.fromSemitones(fret));
      const pitchClass = Note.pitchClass(note);
      return {
        stringName,
        stringIndex,
        fret,
        note,
        pitchClass,
        isScaleNote: scaleSet.has(pitchClass),
      };
    });

    return { stringName, positions };
  });
};

const useMusicEngine = (rootNote: string, scaleType: string): MusicEngineResult => {
  return useMemo(() => {
    const scale = Scale.get(`${rootNote} ${scaleType}`);
    const scaleNotes = scale.notes ?? [];
    const intervals = scale.intervals ?? [];
    const chords = buildTetrads(scaleNotes);
    const scaleSet = new Set(scaleNotes.map((note) => Note.pitchClass(note)));
    const fretboardData = () => buildFretboard(scaleSet);

    return {
      scaleNotes,
      intervals,
      chords,
      fretboardData,
    };
  }, [rootNote, scaleType]);
};

export default useMusicEngine;
