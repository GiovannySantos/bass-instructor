import { createContext, useContext, useEffect, useMemo, useState } from "react";

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

const BassTheoryProvider = ({ children }) => {
  const [rootNote, setRootNote] = useState("E");
  const [scaleMode, setScaleMode] = useState("menor");
  const [displayMode, setDisplayMode] = useState("intervalos");

  const value = useMemo(
    () => ({
      rootNote,
      setRootNote,
      scaleMode,
      setScaleMode,
      displayMode,
      setDisplayMode,
    }),
    [rootNote, scaleMode, displayMode]
  );

  return <BassTheoryContext.Provider value={value}>{children}</BassTheoryContext.Provider>;
};

const AppShell = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [target, setTarget] = useState(() => randomTarget());
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const { rootNote } = useBassTheory();
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = window.localStorage.getItem("bassdojo:dark");
    if (saved !== null) return saved === "true";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    window.localStorage.setItem("bassdojo:dark", String(darkMode));
  }, [darkMode]);

  const handleGameAnswer = (noteIndex) => {
    const result = validateTarget(target, noteIndex, rootNote);
    if (result.correct) {
      setStreak((prev) => prev + 1);
      setFeedback({ ok: true, message: "Boa!" });
      setTarget(randomTarget());
    } else {
      setStreak(0);
      setFeedback({ ok: false, message: `Era ${result.expectedLabel}` });
    }
    setTimeout(() => setFeedback(null), 900);
  };

  return (
    <div className="min-h-screen bg-[#f7f6f3] text-slate-900 transition-colors duration-300 dark:bg-[#0b0f14] dark:text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 md:px-8 md:py-10">
        <header className="flex flex-col gap-6 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between dark:border-slate-800">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs uppercase tracking-[0.28em] text-slate-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-400">
              Bass Dojo
            </span>
            <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl dark:text-white">
              Mestre do Groove v3
            </h1>
            <p className="max-w-xl text-sm text-slate-500 dark:text-slate-400">
              Foco em precisão: teoria aplicada, groove consistente e localização instantânea no
              braço.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs text-slate-500 md:flex dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-400">
              Root atual: {rootNote}
            </div>
            <button
              className="hidden rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-slate-700 md:inline-flex dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              onClick={() => setDarkMode((prev) => !prev)}
              aria-label={darkMode ? "Modo claro" : "Modo escuro"}
            >
              <span className="mr-2 inline-flex h-4 w-4 items-center justify-center">
                {darkMode ? (
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                    <path d="M12 4.5a1 1 0 0 1 1 1V7a1 1 0 1 1-2 0V5.5a1 1 0 0 1 1-1zm0 11a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7zm8.5-3.5a1 1 0 0 1-1 1H18a1 1 0 1 1 0-2h1.5a1 1 0 0 1 1 1zM6 12a1 1 0 0 1-1 1H3.5a1 1 0 1 1 0-2H5a1 1 0 0 1 1 1zm11.78 5.28a1 1 0 0 1 0 1.42l-1.06 1.06a1 1 0 0 1-1.42-1.42l1.06-1.06a1 1 0 0 1 1.42 0zM8.7 6.2a1 1 0 0 1 0 1.42L7.64 8.68A1 1 0 1 1 6.22 7.26l1.06-1.06a1 1 0 0 1 1.42 0zm9.08-1.4a1 1 0 0 1 0 1.42l-1.06 1.06a1 1 0 0 1-1.42-1.42l1.06-1.06a1 1 0 0 1 1.42 0zM8.7 17.8a1 1 0 0 1 0 1.42l-1.06 1.06a1 1 0 1 1-1.42-1.42l1.06-1.06a1 1 0 0 1 1.42 0zM12 17a1 1 0 0 1 1 1v1.5a1 1 0 1 1-2 0V18a1 1 0 0 1 1-1z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                    <path d="M21 14.5A8.5 8.5 0 1 1 9.5 3a7 7 0 1 0 11.5 11.5z" />
                  </svg>
                )}
              </span>
            </button>
            <button
              className="rounded-full border border-slate-300 bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white md:hidden dark:border-slate-700 dark:bg-slate-100 dark:text-slate-900"
              onClick={() => setDrawerOpen(true)}
            >
              Menu
            </button>
          </div>
        </header>

        <main className="flex-1 pt-6">
          <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <SmartFretboard onNoteSelect={handleGameAnswer} />
              <FlashcardTrainer target={target} streak={streak} feedback={feedback} />
            </div>

            <aside className="space-y-6">
              <div className="hidden space-y-6 md:block">
                <ControlPanel />
                <MetronomePanel />
                <GrooveBriefing />
              </div>
            </aside>
          </section>
        </main>

        <footer className="mt-10 border-t border-slate-200 pt-6 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <span>Bass Dojo v3 • Treino diário com foco em precisão.</span>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 dark:border-slate-700 dark:bg-slate-900/70">
                Atalhos: clique nas casas
              </span>
              <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 dark:border-slate-700 dark:bg-slate-900/70">
                Dica: ajuste root e modo
              </span>
            </div>
          </div>
        </footer>
      </div>

      <div className={`drawer fixed inset-x-0 bottom-0 z-40 md:hidden ${drawerOpen ? "open" : ""}`}>
        <div className="rounded-t-3xl border border-slate-200 bg-white/95 p-6 shadow-[0_-20px_60px_rgba(15,23,42,0.15)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
              Painel Rápido
            </h2>
            <button
              className="text-xs text-slate-500 dark:text-slate-400"
              onClick={() => setDrawerOpen(false)}
            >
              Fechar
            </button>
          </div>
          <div className="space-y-4">
            <button
              className="w-full rounded-full border border-slate-300 bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white dark:border-slate-700 dark:bg-slate-100 dark:text-slate-900"
              onClick={() => setDarkMode((prev) => !prev)}
              aria-label={darkMode ? "Modo claro" : "Modo escuro"}
            >
              <span className="mr-2 inline-flex h-4 w-4 items-center justify-center">
                {darkMode ? (
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                    <path d="M12 4.5a1 1 0 0 1 1 1V7a1 1 0 1 1-2 0V5.5a1 1 0 0 1 1-1zm0 11a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7zm8.5-3.5a1 1 0 0 1-1 1H18a1 1 0 1 1 0-2h1.5a1 1 0 0 1 1 1zM6 12a1 1 0 0 1-1 1H3.5a1 1 0 1 1 0-2H5a1 1 0 0 1 1 1zm11.78 5.28a1 1 0 0 1 0 1.42l-1.06 1.06a1 1 0 0 1-1.42-1.42l1.06-1.06a1 1 0 0 1 1.42 0zM8.7 6.2a1 1 0 0 1 0 1.42L7.64 8.68A1 1 0 1 1 6.22 7.26l1.06-1.06a1 1 0 0 1 1.42 0zm9.08-1.4a1 1 0 0 1 0 1.42l-1.06 1.06a1 1 0 0 1-1.42-1.42l1.06-1.06a1 1 0 0 1 1.42 0zM8.7 17.8a1 1 0 0 1 0 1.42l-1.06 1.06a1 1 0 1 1-1.42-1.42l1.06-1.06a1 1 0 0 1 1.42 0zM12 17a1 1 0 0 1 1 1v1.5a1 1 0 1 1-2 0V18a1 1 0 0 1 1-1z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                    <path d="M21 14.5A8.5 8.5 0 1 1 9.5 3a7 7 0 1 0 11.5 11.5z" />
                  </svg>
                )}
              </span>
            </button>
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
    rootNote,
    setRootNote,
    scaleMode,
    setScaleMode,
    displayMode,
    setDisplayMode,
  } = useBassTheory();

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/70">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Core Musical</h2>
        {!compact && (
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400">
            Configuração
          </span>
        )}
      </div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <label className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
            Root
          </label>
          <select
            className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
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
          <label className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
            Modo
          </label>
          <select
            className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
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
          <label className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
            Display
          </label>
          <div className="flex gap-2">
            {["notas", "intervalos"].map((mode) => (
              <button
                key={mode}
                className={`flex-1 rounded-2xl border px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                  displayMode === mode
                    ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900"
                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
                }`}
                onClick={() => setDisplayMode(mode)}
              >
                {mode === "notas" ? "Notas" : "Intervalos"}
              </button>
            ))}
          </div>
        </div>
        {!compact && (
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Sem áudio: apenas guia visual e interação.
          </p>
        )}
      </div>
    </section>
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
  const scaleNotes = buildScaleNotes(rootNote, scaleMode);
  const chordNotes = CHORD_DEGREES.map((degree) => scaleNotes[degree]).filter(Boolean);
  const [activeString, setActiveString] = useState(null);
  const [playedNote, setPlayedNote] = useState(null);

  const handlePlay = (noteIndex, stringIndex) => {
    setActiveString(stringIndex);
    setPlayedNote(noteIndex);
    setTimeout(() => setActiveString(null), 300);
    if (onNoteSelect) onNoteSelect(noteIndex);
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/70">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Smart Fretboard</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Notas seguras destacadas. Clique para treinar a posição.
          </p>
        </div>
        <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400">
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
                const label =
                  displayMode === "notas"
                    ? NOTES[noteIndex]
                    : isRoot
                    ? "R"
                    : isChord
                    ? ["3", "5", "7"][chordNotes.indexOf(noteIndex) - 1] || ""
                    : "";

                const baseClasses = isScale
                  ? "border-slate-200 dark:border-slate-700"
                  : "border-transparent opacity-25";
                const highlight = isRoot
                  ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white"
                  : isChord
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-900"
                  : isScale
                  ? "bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  : "bg-slate-50 text-slate-400 dark:bg-slate-800/70 dark:text-slate-500";
                const played = playedNote === noteIndex ? "glow-ring" : "";

                return (
                  <button
                    key={`${stringName}-${fret}`}
                    className={`fret-cell rounded-xl border px-2 py-3 text-xs font-semibold transition ${baseClasses} ${highlight} ${played}`}
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
    </section>
  );
};

const MetronomePanel = ({ compact = false }) => {
  const [bpm, setBpm] = useState(90);
  const [isPlaying, setIsPlaying] = useState(false);
  const [includeEighths, setIncludeEighths] = useState(false);
  const [includeSixteenths, setIncludeSixteenths] = useState(false);
  const [tapTimes, setTapTimes] = useState([]);

  const toggleTransport = () => {
    setIsPlaying((prev) => !prev);
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
    <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/70">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Groove Trainer</h2>
        <span className="text-xs text-slate-400 dark:text-slate-500">{bpm} BPM</span>
      </div>
      <div className="grid gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs uppercase tracking-[0.18em] text-slate-500 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
            onClick={handleTap}
          >
            Tap Tempo
          </button>
          <button
            className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${
              isPlaying
                ? "border-emerald-600 bg-emerald-600 text-white"
                : "border-slate-300 bg-slate-900 text-white dark:border-slate-200 dark:bg-white dark:text-slate-900"
            }`}
            onClick={toggleTransport}
          >
            {isPlaying ? "Stop" : "Play"}
          </button>
        </div>
        <input
          className="accent-slate-900"
          type="range"
          min={40}
          max={200}
          value={bpm}
          onChange={(event) => setBpm(Number(event.target.value))}
        />
        <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeEighths}
              onChange={(event) => setIncludeEighths(event.target.checked)}
            />
            Colcheias
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeSixteenths}
              onChange={(event) => setIncludeSixteenths(event.target.checked)}
            />
            Semicolcheias
          </label>
        </div>
        {!compact && (
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Marque o tempo visualmente. Sem reprodução de áudio.
          </p>
        )}
      </div>
    </section>
  );
};

const FlashcardTrainer = ({ target, streak, feedback }) => {
  const { rootNote } = useBassTheory();
  return (
    <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/70">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Flashcards</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {target.type === "note"
              ? `Encontre todas as notas ${target.value}`
              : `Toque a ${target.value} de ${rootNote}`}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400">
          <span className="uppercase tracking-[0.2em]">Streak</span>
          <span className="text-slate-900 dark:text-slate-100">{streak}</span>
        </div>
      </div>
      <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
        Responda clicando na casa correta do Smart Fretboard.
      </p>
      {feedback && (
        <div
          className={`mt-4 rounded-2xl px-3 py-2 text-sm font-semibold ${
            feedback.ok
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200"
              : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-200"
          }`}
        >
          {feedback.message}
        </div>
      )}
    </section>
  );
};

const GrooveBriefing = ({ compact = false }) => {
  const [briefing, setBriefing] = useState(() => createBriefing());

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/70">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Briefing de Gig</h2>
      <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
        <p>
          <span className="text-slate-400 dark:text-slate-500">Estilo:</span> {briefing.style}
        </p>
        <p>
          <span className="text-slate-400 dark:text-slate-500">Progressão:</span>{" "}
          {briefing.progression}
        </p>
        <p>
          <span className="text-slate-400 dark:text-slate-500">Técnica:</span>{" "}
          {briefing.technique}
        </p>
      </div>
      <button
        className="mt-5 w-full rounded-full border border-slate-300 bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white dark:border-slate-200 dark:bg-white dark:text-slate-900"
        onClick={() => setBriefing(createBriefing())}
      >
        Sortear novo briefing
      </button>
      {!compact && (
        <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
          Use o briefing para variar grooves e treinar criatividade.
        </p>
      )}
    </section>
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

export default App;
