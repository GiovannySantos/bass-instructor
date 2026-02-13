export const TRAIN_SESSIONS = [
  {
    id: "fretboard-notes-10",
    title: "Braço - notas do tom (10 min)",
    durationMin: 10,
    targetTab: "fretboard",
    goal: {
      type: "fretboard.clicks",
      target: 20,
      description: "Fazer 20 cliques no braço",
    },
  },
  {
    id: "rhythm-eighths-8",
    title: "Ritmo - colcheias 80→120 (8 min)",
    durationMin: 8,
    targetTab: "rhythm",
    goal: {
      type: "rhythm.bpmReached",
      target: 120,
      description: "Chegar a 120 BPM",
    },
  },
  {
    id: "flashcards-intervals-6",
    title: "Cartões - intervalos (6 min)",
    durationMin: 6,
    targetTab: "flashcards",
    goal: {
      type: "flashcards.correct",
      target: 10,
      description: "Acertar 10 cartões",
    },
  },
  {
    id: "studies-harmony-5",
    title: "Estudos - campo harmônico (5 min)",
    durationMin: 5,
    targetTab: "studies",
    goal: {
      type: "studies.copied",
      target: 1,
      description: "Copiar uma seção de notas",
    },
  },
];
