import React, { createContext, useContext, useEffect, useMemo, useState } from "https://esm.sh/react@18.2.0";
import { createRoot } from "https://esm.sh/react-dom@18.2.0/client";
import { motion } from "https://esm.sh/framer-motion@11.0.3";
import * as Tone from "https://esm.sh/tone@14.7.77";

const BassTheoryContext = createContext(null);

const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const STRING_TUNING = ["G", "D", "A", "E"];
const STRING_INDEX = [7, 2, 9, 4];
const FRET_COUNT = 12;

const SCALE_LIBRARY = {
  maior: [0, 2, 4, 5, 7, 9, 11],
  menor: [0, 2, 3, 5, 7, 8, 10],
  dorico: [0, 2, 3, 5, 7, 9, 10],
  mixolidio: [0, 2, 4, 5, 7, 9, 10],
  frigio: [0, 1, 3, 5, 7, 8, 10],
  pentatonicaMenor: [0, 3, 5, 7, 10],
  pentatonicaMaior: [0, 2, 4, 7, 9],
};

const SCALE_LABELS = {
  maior: "Maior",
  menor: "Menor",
  dorico: "Dórico",
  mixolidio: "Mixolídio",
  frigio: "Frígio",
  pentatonicaMenor: "Pentatônica Menor",
  pentatonicaMaior: "Pentatônica Maior",
};

const CHORD_DEGREES = [0, 2, 4, 6];

const useBassTheory = () => useContext(BassTheoryContext);

const createMetronome = () => {
  const highSynth = new Tone.MembraneSynth({
    pitchDecay: 0.02,
    octaves: 2,
    envelope: { attack: 0.001, decay: 0.12, sustain: 0.0, release: 0.1 },
  }).toDestination();
  const clickSynth = new Tone.MetalSynth({
    frequency: 250,
    envelope: { attack: 0.001, decay: 0.08, release: 0.02 },
    harmonicity: 5.1,
    modulationIndex: 32,
    resonance: 4000,
    octaves: 1.5,
  }).toDestination();

  return { highSynth, clickSynth };
};

const BassTheoryProvider = ({ children }) => {
  const [masterVolume, setMasterVolume] = useState(-6);
  const [metronomeVolume, setMetronomeVolume] = useState(-8);
  const [rootNote, setRootNote] = useState("E");
  const [scaleMode, setScaleMode] = useState("menor");
  const [displayMode, setDisplayMode] = useState("intervalos");

  const value = useMemo(
    () => ({
      masterVolume,
      setMasterVolume,
      metronomeVolume,
      setMetronomeVolume,
      rootNote,
      setRootNote,
      scaleMode,
      setScaleMode,
      displayMode,
      setDisplayMode,
    }),
    [masterVolume, metronomeVolume, rootNote, scaleMode, displayMode]
  );

  return <BassTheoryContext.Provider value={value}>{children}</BassTheoryContext.Provider>;
};

const useAudioEngine = () => {
  const { masterVolume, metronomeVolume } = useBassTheory();
  const [engine] = useState(() => {
    const master = new Tone.Volume(masterVolume).toDestination();
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0.2, release: 0.8 },
    }).connect(master);
    const drone = new Tone.Oscillator("E2", "sine").connect(master);
    const metronomeBus = new Tone.Volume(metronomeVolume).connect(master);
    const { highSynth, clickSynth } = createMetronome();
    highSynth.connect(metronomeBus);
    clickSynth.connect(metronomeBus);
    return { master, synth, drone, metronomeBus, highSynth, clickSynth };
  });

  engine.master.volume.value = masterVolume;
  engine.metronomeBus.volume.value = metronomeVolume;

  return engine;
};

const AppShell = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [target, setTarget] = useState(() => randomTarget());
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const { rootNote } = useBassTheory();
  const engine = useAudioEngine();

  const handleGameAnswer = (noteIndex) => {
    const result = validateTarget(target, noteIndex, rootNote);
    if (result.correct) {
      engine.synth.triggerAttackRelease("C5", "16n");
      setStreak((prev) => prev + 1);
      setFeedback({ ok: true, message: "Boa!" });
      setTarget(randomTarget());
    } else {
      engine.synth.triggerAttackRelease("A2", "8n");
      setStreak(0);
      setFeedback({ ok: false, message: `Era ${result.expectedLabel}` });
    }
    setTimeout(() => setFeedback(null), 900);
  };

  return (
    <div className="min-h-screen px-4 py-6 md:px-10">
      <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Bass Dojo</p>
          <h1 className="text-3xl font-semibold text-studio-neon md:text-4xl">
            Mestre do Groove v3
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-400">
            PWA de prática para baixistas: teoria aplicada, groove e localização instantânea.
          </p>
        </div>
        <button
          className="rounded-xl border border-studio-neon/40 bg-studio-700/60 px-4 py-2 text-sm font-semibold text-studio-neon shadow-glow md:hidden"
          onClick={() => setDrawerOpen(true)}
        >
          Configurações
        </button>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <SmartFretboard onNoteSelect={handleGameAnswer} />
          <FlashcardTrainer target={target} streak={streak} feedback={feedback} />
        </div>

        <div className="space-y-6">
          <div className="hidden space-y-6 md:block">
            <ControlPanel />
            <MetronomePanel />
            <GrooveBriefing />
          </div>
        </div>
      </div>

      <div className={`drawer fixed inset-x-0 bottom-0 z-40 md:hidden ${drawerOpen ? "open" : ""}`}>
        <div className="rounded-t-3xl border border-studio-600 bg-studio-800/95 p-6 shadow-soft backdrop-blur">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-studio-neon">Configurações rápidas</h2>
            <button className="text-sm text-slate-400" onClick={() => setDrawerOpen(false)}>
              Fechar
            </button>
          </div>
          <div className="space-y-4">
            <ControlPanel compact />
            <MetronomePanel compact />
            <GrooveBriefing compact />
          </div>
        </div>
      </div>
    </div>
  );
};

const ControlPanel = ({ compact = false }) => {
  const {
    masterVolume,
    setMasterVolume,
    metronomeVolume,
    setMetronomeVolume,
    rootNote,
    setRootNote,
    scaleMode,
    setScaleMode,
    displayMode,
    setDisplayMode,
  } = useBassTheory();

  return (
    <motion.section
      className="rounded-2xl border border-studio-600 bg-studio-800/80 p-5 shadow-soft"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="mb-4 text-lg font-semibold text-studio-neon">Core Musical</h2>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Root</label>
          <select
            className="rounded-xl border border-studio-600 bg-studio-700/60 px-3 py-2 text-sm"
            value={rootNote}
            onChange={(event) => setRootNote(event.target.value)}
          >
            {NOTES.map((note) => (
              <option key={note} value={note}>
                {note}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Modo</label>
          <select
            className="rounded-xl border border-studio-600 bg-studio-700/60 px-3 py-2 text-sm"
            value={scaleMode}
            onChange={(event) => setScaleMode(event.target.value)}
          >
            {Object.entries(SCALE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Display</label>
          <div className="flex gap-2">
            {["notas", "intervalos"].map((mode) => (
              <button
                key={mode}
                className={`flex-1 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                  displayMode === mode
                    ? "border-studio-neon bg-studio-neon/20 text-studio-neon"
                    : "border-studio-600 bg-studio-700/60 text-slate-300"
                }`}
                onClick={() => setDisplayMode(mode)}
              >
                {mode === "notas" ? "Notas" : "Intervalos"}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-2">
          <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Master Volume</label>
          <input
            type="range"
            min={-24}
            max={0}
            value={masterVolume}
            onChange={(event) => setMasterVolume(Number(event.target.value))}
          />
        </div>
        <div className="grid gap-2">
          <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Metronome Volume</label>
          <input
            type="range"
            min={-24}
            max={0}
            value={metronomeVolume}
            onChange={(event) => setMetronomeVolume(Number(event.target.value))}
          />
        </div>
        {!compact && <DroneToggle />}
      </div>
    </motion.section>
  );
};

const DroneToggle = () => {
  const { rootNote } = useBassTheory();
  const [active, setActive] = useState(false);
  const engine = useAudioEngine();

  const toggleDrone = async () => {
    await Tone.start();
    if (!active) {
      engine.drone.frequency.value = `${rootNote}2`;
      engine.drone.start();
    } else {
      engine.drone.stop();
    }
    setActive(!active);
  };

  return (
    <button
      className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
        active
          ? "border-studio-neon bg-studio-neon/20 text-studio-neon glow-ring"
          : "border-studio-600 bg-studio-700/60 text-slate-300"
      }`}
      onClick={toggleDrone}
    >
      {active ? "Drone Ativo" : "Toggle Drone"}
    </button>
  );
};

const buildScaleNotes = (rootNote, scaleMode) => {
  const rootIndex = NOTES.indexOf(rootNote);
  return SCALE_LIBRARY[scaleMode].map((interval) => (rootIndex + interval) % 12);
};

const randomTarget = () => {
  const note = NOTES[Math.floor(Math.random() * NOTES.length)];
  const interval = ["R", "3", "5", "7"][Math.floor(Math.random() * 4)];
  return Math.random() > 0.5
    ? { type: "note", value: note }
    : { type: "interval", value: interval };
};

const validateTarget = (target, noteIndex, rootNote) => {
  if (target.type === "note") {
    return {
      correct: NOTES[noteIndex] === target.value,
      expectedLabel: target.value,
    };
  }
  const rootIndex = NOTES.indexOf(rootNote);
  const intervals = { R: 0, 3: 4, 5: 7, 7: 11 };
  const expected = (rootIndex + intervals[target.value]) % 12;
  return {
    correct: noteIndex === expected,
    expectedLabel: NOTES[expected],
  };
};

const SmartFretboard = ({ onNoteSelect }) => {
  const { rootNote, scaleMode, displayMode } = useBassTheory();
  const engine = useAudioEngine();
  const scaleNotes = buildScaleNotes(rootNote, scaleMode);
  const chordNotes = CHORD_DEGREES.map((degree) => scaleNotes[degree]).filter(Boolean);
  const [activeString, setActiveString] = useState(null);
  const [playedNote, setPlayedNote] = useState(null);

  const handlePlay = async (noteIndex, stringIndex) => {
    await Tone.start();
    const noteName = NOTES[noteIndex];
    engine.synth.triggerAttackRelease(`${noteName}3`, "8n");
    setActiveString(stringIndex);
    setPlayedNote(noteIndex);
    setTimeout(() => setActiveString(null), 300);
    if (onNoteSelect) onNoteSelect(noteIndex);
  };

  return (
    <motion.section
      className="rounded-3xl border border-studio-600 bg-studio-800/80 p-6 shadow-soft"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-studio-neon">Smart Fretboard</h2>
          <p className="text-xs text-slate-400">
            Safe notes destacadas. Clique para ouvir e treinar percepção.
          </p>
        </div>
        <div className="rounded-xl bg-studio-700/70 px-3 py-2 text-xs text-slate-300">
          {rootNote} • {SCALE_LABELS[scaleMode]}
        </div>
      </div>
      <div className="space-y-4">
        {STRING_TUNING.map((stringName, stringIdx) => (
          <div
            key={stringName}
            className={`string-row ${activeString === stringIdx ? "vibrate" : ""}`}
          >
            <div className="fretboard-grid">
              {Array.from({ length: FRET_COUNT + 1 }, (_, fret) => {
                const noteIndex = (STRING_INDEX[stringIdx] + fret) % 12;
                const isScale = scaleNotes.includes(noteIndex);
                const isChord = chordNotes.includes(noteIndex);
                const isRoot = noteIndex === NOTES.indexOf(rootNote);
                const label = displayMode === "notas"
                  ? NOTES[noteIndex]
                  : isRoot
                  ? "R"
                  : isChord
                  ? ["3", "5", "7"][chordNotes.indexOf(noteIndex) - 1] || ""
                  : "";

                const baseClasses = isScale
                  ? "border-studio-neon/20"
                  : "border-transparent opacity-20";
                const highlight = isChord
                  ? "bg-studio-neon/20 text-studio-neon border-studio-neon"
                  : isScale
                  ? "bg-studio-700/60 text-slate-200"
                  : "bg-studio-900/80 text-slate-500";
                const played = playedNote === noteIndex ? "glow-ring" : "";

                return (
                  <button
                    key={`${stringName}-${fret}`}
                    className={`fret-cell rounded-lg border px-2 py-3 text-xs font-semibold transition ${baseClasses} ${highlight} ${played}`}
                    onClick={() => handlePlay(noteIndex, stringIdx)}
                  >
                    {fret === 0 ? stringName : label || "•"}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
};

const MetronomePanel = ({ compact = false }) => {
  const [bpm, setBpm] = useState(90);
  const [isPlaying, setIsPlaying] = useState(false);
  const [includeEighths, setIncludeEighths] = useState(false);
  const [includeSixteenths, setIncludeSixteenths] = useState(false);
  const [tapTimes, setTapTimes] = useState([]);
  const engine = useAudioEngine();

  const scheduleMetronome = () => {
    Tone.Transport.cancel();
    Tone.Transport.bpm.value = bpm;
    let step = 0;

    Tone.Transport.scheduleRepeat((time) => {
      const isDownbeat = step % 4 === 0;
      if (isDownbeat) {
        engine.highSynth.triggerAttackRelease("C2", "8n", time);
      } else {
        engine.clickSynth.triggerAttackRelease("16n", time);
      }

      if (includeEighths) {
        engine.clickSynth.triggerAttackRelease("32n", time + Tone.Time("8n").toSeconds() / 2);
      }
      if (includeSixteenths) {
        const offset = Tone.Time("16n").toSeconds();
        engine.clickSynth.triggerAttackRelease("32n", time + offset);
        engine.clickSynth.triggerAttackRelease("32n", time + offset * 2);
        engine.clickSynth.triggerAttackRelease("32n", time + offset * 3);
      }

      step += 1;
    }, "4n");
  };

  const toggleTransport = async () => {
    await Tone.start();
    if (!isPlaying) {
      scheduleMetronome();
      Tone.Transport.start();
    } else {
      Tone.Transport.stop();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTap = () => {
    const now = Date.now();
    const updated = [...tapTimes, now].slice(-4);
    setTapTimes(updated);
    if (updated.length >= 2) {
      const intervals = updated.slice(1).map((time, idx) => time - updated[idx]);
      const avg = intervals.reduce((acc, val) => acc + val, 0) / intervals.length;
      const nextBpm = Math.round(60000 / avg);
      setBpm(Math.min(200, Math.max(40, nextBpm)));
    }
  };

  return (
    <motion.section
      className="rounded-2xl border border-studio-600 bg-studio-800/80 p-5 shadow-soft"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <h2 className="mb-4 text-lg font-semibold text-studio-neon">Groove Trainer</h2>
      <div className="grid gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-300">{bpm} BPM</span>
          <div className="flex gap-2">
            <button
              className="rounded-xl border border-studio-neon/40 bg-studio-700/60 px-3 py-2 text-xs text-studio-neon"
              onClick={handleTap}
            >
              Tap Tempo
            </button>
            <button
              className={`rounded-xl border px-3 py-2 text-xs font-semibold ${
                isPlaying
                  ? "border-studio-neon bg-studio-neon/20 text-studio-neon"
                  : "border-studio-600 bg-studio-700/60 text-slate-300"
              }`}
              onClick={toggleTransport}
            >
              {isPlaying ? "Stop" : "Play"}
            </button>
          </div>
        </div>
        <input
          type="range"
          min={40}
          max={200}
          value={bpm}
          onChange={(event) => setBpm(Number(event.target.value))}
        />
        <div className="flex flex-wrap gap-2 text-xs text-slate-300">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeEighths}
              onChange={(event) => setIncludeEighths(event.target.checked)}
            />
            Colcheias (1/8)
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeSixteenths}
              onChange={(event) => setIncludeSixteenths(event.target.checked)}
            />
            Semicolcheias (1/16)
          </label>
        </div>
        {!compact && (
          <p className="text-xs text-slate-400">
            Tempo 1 com som de kick, subdivisões com click metálico.
          </p>
        )}
      </div>
    </motion.section>
  );
};

const FlashcardTrainer = ({ target, streak, feedback }) => {
  const { rootNote } = useBassTheory();
  return (
    <motion.section
      className="rounded-2xl border border-studio-600 bg-studio-800/80 p-5 shadow-soft"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-studio-neon">Flashcards de Localização</h2>
          <p className="text-xs text-slate-400">
            {target.type === "note"
              ? `Encontre todas as notas ${target.value}`
              : `Toque a ${target.value} de ${rootNote}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Streak</span>
          <span className="rounded-full bg-studio-700/70 px-3 py-1 text-sm text-studio-neon">
            {streak}
          </span>
        </div>
      </div>
      <p className="mt-4 text-xs text-slate-400">
        Responda clicando na casa correta do Smart Fretboard acima.
      </p>
      {feedback && (
        <div
          className={`mt-3 rounded-xl px-3 py-2 text-sm font-semibold ${
            feedback.ok ? "bg-studio-green/20 text-studio-green" : "bg-studio-red/20 text-studio-red"
          }`}
        >
          {feedback.message}
        </div>
      )}
    </motion.section>
  );
};

const GrooveBriefing = ({ compact = false }) => {
  const [briefing, setBriefing] = useState(() => createBriefing());

  return (
    <motion.section
      className="rounded-2xl border border-studio-600 bg-studio-800/80 p-5 shadow-soft"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="mb-4 text-lg font-semibold text-studio-neon">Briefing de Gig</h2>
      <div className="space-y-2 text-sm text-slate-300">
        <p><span className="text-slate-400">Estilo:</span> {briefing.style}</p>
        <p><span className="text-slate-400">Progressão:</span> {briefing.progression}</p>
        <p><span className="text-slate-400">Técnica:</span> {briefing.technique}</p>
      </div>
      <button
        className="mt-4 w-full rounded-xl border border-studio-neon/40 bg-studio-700/60 px-4 py-2 text-sm font-semibold text-studio-neon"
        onClick={() => setBriefing(createBriefing())}
      >
        Sortear Novo Briefing
      </button>
      {!compact && (
        <p className="mt-2 text-xs text-slate-400">
          Use o briefing para simular um gig real e variar suas linhas.
        </p>
      )}
    </motion.section>
  );
};

const createBriefing = () => {
  const styles = ["Funk", "Rock", "Motown", "Reggae", "Neo Soul", "Pop"];
  const progressions = [
    "ii - V - I em Sol Maior",
    "I - bVII - IV em Lá",
    "i - bVI - bVII em Dó menor",
    "I - IV - V em Mi",
  ];
  const techniques = [
    "Use Ghost Notes",
    "Apenas tríades",
    "Foco no Slap",
    "Walking Bass",
    "Groove com notas longas",
  ];

  return {
    style: styles[Math.floor(Math.random() * styles.length)],
    progression: progressions[Math.floor(Math.random() * progressions.length)],
    technique: techniques[Math.floor(Math.random() * techniques.length)],
  };
};

const App = () => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }
  }, []);

  return (
    <BassTheoryProvider>
      <AppShell />
    </BassTheoryProvider>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);
