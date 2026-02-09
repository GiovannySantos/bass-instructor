import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

import { Chord, Interval } from "tonal";

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

  const [nnsMode, setNnsMode] = useState("romanos");

  const value = useMemo(

    () => ({

      rootNote,

      setRootNote,

      scaleMode,

      setScaleMode,

      displayMode,

      setDisplayMode,

      nnsMode,

      setNnsMode,

    }),

    [rootNote, scaleMode, displayMode, nnsMode]

  );

  return <BassTheoryContext.Provider value={value}>{children}</BassTheoryContext.Provider>;

};

const AppShell = () => {

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [coreOpen, setCoreOpen] = useState(false);
  const coreMenuRef = useRef(null);

  const [target, setTarget] = useState(() => randomTarget());

  const [streak, setStreak] = useState(0);

  const [feedback, setFeedback] = useState(null);

  const { rootNote, scaleMode } = useBassTheory();

  const [appMode, setAppMode] = useState(() => {

    if (typeof window === "undefined") return "treino";

    const saved = window.localStorage.getItem("bassdojo:mode");

    return saved === "palco" ? "palco" : "treino";

  });

  const [darkMode, setDarkMode] = useState(() => {

    if (typeof window === "undefined") return false;

    const saved = window.localStorage.getItem("bassdojo:dark");

    if (saved !== null) return saved === "true";

    return window.matchMedia("(prefers-color-scheme: dark)").matches;

  });

  const [bpm, setBpm] = useState(92);

  const [isPlaying, setIsPlaying] = useState(false);

  const [includeEighths, setIncludeEighths] = useState(false);

  const [includeSixteenths, setIncludeSixteenths] = useState(false);

  const [stageNotes, setStageNotes] = useState(() => {

    if (typeof window === "undefined") return "";

    return window.localStorage.getItem("bassdojo:stage-notes") || "";

  });

  const [stageCue, setStageCue] = useState(() => {

    if (typeof window === "undefined") return "";

    return window.localStorage.getItem("bassdojo:stage-cue") || "";

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

  useEffect(() => {

    const root = document.documentElement;

    root.classList.toggle("mode-stage", appMode === "palco");

    window.localStorage.setItem("bassdojo:mode", appMode);

  }, [appMode]);

  useEffect(() => {
    if (!coreOpen) return;
    const handleClickOutside = (event) => {
      if (!coreMenuRef.current) return;
      if (!coreMenuRef.current.contains(event.target)) {
        setCoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [coreOpen]);

  useEffect(() => {

    window.localStorage.setItem("bassdojo:stage-notes", stageNotes);

  }, [stageNotes]);

  useEffect(() => {

    window.localStorage.setItem("bassdojo:stage-cue", stageCue);

  }, [stageCue]);

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

    <div

      className="min-h-screen bg-[#f7f6f3] text-slate-900 transition-colors duration-300 dark:bg-[#0b0f14] dark:text-slate-100"

      data-mode={appMode}

    >

      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 md:px-8 md:py-10">

        <header className="flex flex-col gap-5 border-b border-slate-200 pb-6 dark:border-slate-800">

          <div className="space-y-3">

            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs uppercase tracking-[0.28em] text-slate-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-400">

              Bass Dojo

            </span>

            <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl dark:text-white">

              Mestre do Ritmo v3

            </h1>

            <p className="max-w-xl text-sm text-slate-500 dark:text-slate-400">

              Foco em precisão: teoria aplicada, groove consistente e localização instantânea no

              braço.

            </p>

          </div>

          <div className="flex flex-wrap items-center gap-3 md:justify-between">

            <div className="hidden rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs text-slate-500 md:inline-flex dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-400">

              Tônica atual: {rootNote}

            </div>

            <div className="flex flex-wrap items-center gap-3">

              <ModeToggle appMode={appMode} setAppMode={setAppMode} />

              <div className="relative" ref={coreMenuRef}>

                <button

                  className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"

                  onClick={() => setCoreOpen((prev) => !prev)}

                >

                  Núcleo Musical

                </button>

                <div className={`dropdown-panel ${coreOpen ? "open" : ""}`}>

                  <div className="dropdown-surface">

                    <ControlPanel compact showTitle={false} />

                  </div>

                </div>

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

          </div>

        </header>

        <main className="flex-1 pt-6">

          {appMode === "palco" ? (

            <StageMode

              bpm={bpm}

              setBpm={setBpm}

              rootNote={rootNote}

              scaleMode={scaleMode}

              stageNotes={stageNotes}

              setStageNotes={setStageNotes}

              stageCue={stageCue}

              setStageCue={setStageCue}

            />

          ) : (

            <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">

              <div className="space-y-6">

                <SmartFretboard onNoteSelect={handleGameAnswer} />

                <FlashcardTrainer target={target} streak={streak} feedback={feedback} />

                <StudiesPanel />

              </div>

              <aside className="space-y-6">

                <div className="hidden space-y-6 md:block">

                  <MetronomePanel

                    bpm={bpm}

                    setBpm={setBpm}

                    isPlaying={isPlaying}

                    setIsPlaying={setIsPlaying}

                    includeEighths={includeEighths}

                    setIncludeEighths={setIncludeEighths}

                    includeSixteenths={includeSixteenths}

                    setIncludeSixteenths={setIncludeSixteenths}

                  />

                  <GrooveBriefing />

                </div>

              </aside>

            </section>

          )}

        </main>

        <footer className="mt-10 border-t border-slate-200 pt-6 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

            <span>Bass Dojo v3 • Treino diário com foco em precisão.</span>

            <div className="flex flex-wrap items-center gap-3">

              <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 dark:border-slate-700 dark:bg-slate-900/70">

                Atalhos: clique nas casas

              </span>

              <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 dark:border-slate-700 dark:bg-slate-900/70">

                Dica: ajuste tônica e modo

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

            <ModeToggle appMode={appMode} setAppMode={setAppMode} compact />

            <button

              className="w-full rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"

              onClick={() => {

                setDrawerOpen(false);

                setCoreOpen((prev) => !prev);

              }}

            >

              Núcleo Musical

            </button>

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

            <MetronomePanel

              compact

              bpm={bpm}

              setBpm={setBpm}

              isPlaying={isPlaying}

              setIsPlaying={setIsPlaying}

              includeEighths={includeEighths}

              setIncludeEighths={setIncludeEighths}

              includeSixteenths={includeSixteenths}

              setIncludeSixteenths={setIncludeSixteenths}

            />

            <GrooveBriefing compact />

          </div>

        </div>

      </div>

    </div>

  );

};

const ControlPanel = ({ compact = false, showTitle = true }) => {

  const {

    rootNote,

    setRootNote,

    scaleMode,

    setScaleMode,

    displayMode,

    setDisplayMode,

    nnsMode,

    setNnsMode,

  } = useBassTheory();

  return (

    <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/70">

      {showTitle && (

        <div className="mb-5 flex items-center justify-between">

          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Núcleo Musical</h2>

          {!compact && (

            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400">

              Configuração

            </span>

          )}

        </div>

      )}

      <div className="grid gap-4">

        <div className="grid gap-2">

          <label className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">

            Tônica

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

            Exibição

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

const ModeToggle = ({ appMode, setAppMode, compact = false }) => {

  return (

    <div

      className={`inline-flex rounded-full border border-slate-200 bg-white/80 p-1 text-xs dark:border-slate-700 dark:bg-slate-900/70 ${

        compact ? "w-full" : ""

      }`}

    >

      {["treino", "palco"].map((mode) => (

        <button

          key={mode}

          className={`rounded-full px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] transition md:text-xs ${

            appMode === mode

              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"

              : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"

          } ${compact ? "flex-1" : ""}`}

          onClick={() => setAppMode(mode)}

        >

          {mode}

        </button>

      ))}

    </div>

  );

};

const buildScaleNotes = (rootNote, scaleMode) => {

  const rootIndex = NOTES.indexOf(rootNote);

  return SCALE_LIBRARY[scaleMode].map((interval) => (rootIndex + interval) % 12);

};

const StudiesPanel = () => {

  const { rootNote, nnsMode } = useBassTheory();

  const [tab, setTab] = useState("diatonicas");

  const [copiedKey, setCopiedKey] = useState(null);

  const scaleGroups = {

    diatonicas: ["maior", "menor", "dorico", "mixolidio", "frigio"],

    pentatonicas: ["pentatonicaMaior", "pentatonicaMenor"],

  };

  const roman = ["I", "II", "III", "IV", "V", "VI", "VII"];

  const numbers = ["1", "2", "3", "4", "5", "6", "7"];

  const handleCopy = async (scaleKey, notes) => {

    const text = notes.join(" ");

    try {

      await navigator.clipboard.writeText(text);

      setCopiedKey(scaleKey);

      setTimeout(() => setCopiedKey(null), 1200);

    } catch {

      // no clipboard access; ignore silently

    }

  };

  return (

    <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/70">

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">

        <div>

          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Aba de Estudos</h2>

          <p className="text-xs text-slate-500 dark:text-slate-400">

            Escalas geradas automaticamente a partir da tônica escolhida.

          </p>

        </div>

        <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400">

          Tônica: {rootNote}

        </div>

      </div>

      <div className="mb-5 flex flex-wrap gap-2">

        {[

          { key: "diatonicas", label: "Diatônicas" },

          { key: "pentatonicas", label: "Pentatônicas" },

        ].map((item) => (

          <button

            key={item.key}

            className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${

              tab === item.key

                ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900"

                : "border-slate-200 bg-white text-slate-500 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"

            }`}

            onClick={() => setTab(item.key)}

          >

            {item.label}

          </button>

        ))}

      </div>

      <div className="grid gap-4">

        {scaleGroups[tab].map((scaleKey) => {

          const noteIndexes = buildScaleNotes(rootNote, scaleKey);

          const notes = noteIndexes.map((idx) => NOTES[idx]);

          const intervals = SCALE_LIBRARY[scaleKey].map((value) => Interval.fromSemitones(value));

            const chords = noteIndexes.map((_, index) => {

              const chordNotes = [

                notes[index % notes.length],

                notes[(index + 2) % notes.length],

                notes[(index + 4) % notes.length],

                notes[(index + 6) % notes.length],

              ];

              const detected = Chord.detect(chordNotes);

              return {

                degree:

                  nnsMode === "romanos"

                    ? roman[index] || `${index + 1}`

                    : numbers[index] || `${index + 1}`,

                symbol: detected[0] || chordNotes.join("-"),

              };

            });

          return (

            <div

              key={scaleKey}

              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-950/40"

            >

              <div className="flex flex-wrap items-center justify-between gap-2">

                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">

                  {SCALE_LABELS[scaleKey]}

                </span>

                <div className="flex items-center gap-2">

                  <span className="text-[0.65rem] text-slate-400">

                    {notes.length} notas

                  </span>

                  <button

                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"

                    onClick={() => handleCopy(scaleKey, notes)}

                  >

                    {copiedKey === scaleKey ? "Copiado" : "Copiar notas"}

                  </button>

                </div>

              </div>

              <div className="mt-3 flex flex-wrap gap-2">

                <span className="text-[0.65rem] text-slate-400">Intervalos:</span>

                {intervals.map((interval, idx) => (

                  <span

                    key={`${scaleKey}-int-${interval}-${idx}`}

                    className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[0.65rem] font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"

                  >

                    {interval}

                  </span>

                ))}

              </div>

              <div className="mt-3 flex flex-wrap gap-2">

                {notes.map((note) => (

                  <span

                    key={`${scaleKey}-${note}`}

                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"

                  >

                    {note}

                  </span>

                ))}

              </div>

              <div className="mt-3 flex flex-wrap gap-2">

                <span className="text-[0.65rem] text-slate-400">Campo harmônico:</span>

                {chords.map((chord) => (

                  <span

                    key={`${scaleKey}-chord-${chord.degree}`}

                    className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[0.65rem] font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"

                  >

                    {chord.degree}: {chord.symbol}

                  </span>

                ))}

              </div>

            </div>

          );

        })}

      </div>

    </section>

  );

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

          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Braço Inteligente</h2>

          <p className="text-xs text-slate-500 dark:text-slate-400">

            Notas seguras destacadas. Clique para treinar a posição.

          </p>

        </div>

        <div className="flex flex-wrap items-center gap-2">

          <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400">

            {rootNote} • {SCALE_LABELS[scaleMode]}

          </div>

          <div className="flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">

            <span className="legend-pill legend-root">Tônica</span>

            <span className="legend-pill legend-chord">Acorde</span>

            <span className="legend-pill legend-scale">Escala</span>

          </div>

        </div>

      </div>

      <div className="space-y-4">

        <div className="fret-marker-row">

          {Array.from({ length: FRET_COUNT + 1 }, (_, fret) => {

            const dotFrets = new Set([3, 5, 7, 9, 12]);

            const showDot = dotFrets.has(fret);

            return (

              <div key={`marker-${fret}`} className="fret-marker" data-dot={showDot}>

                {fret === 0 ? "0" : fret}

              </div>

            );

          })}

        </div>

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

                  ? "fret-root border-transparent text-white"

                  : isChord

                  ? "fret-chord border-transparent"

                  : isScale

                  ? "fret-scale border-transparent"

                  : "fret-muted border-transparent";

                const played = playedNote === noteIndex ? "glow-ring" : "";

                return (

                  <button

                    key={`${stringName}-${fret}`}

                    className={`fret-cell rounded-xl border px-2 py-3 text-xs font-semibold transition ${baseClasses} ${highlight} ${played}`}

                    onClick={() => handlePlay(noteIndex, stringIdx)}

                    data-fret={fret}

                    data-string={stringName}

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

const MetronomePanel = ({

  compact = false,

  bpm,

  setBpm,

  isPlaying,

  setIsPlaying,

  includeEighths,

  setIncludeEighths,

  includeSixteenths,

  setIncludeSixteenths,

}) => {

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

        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Treino de Ritmo</h2>

        <span className="text-xs text-slate-400 dark:text-slate-500">{bpm} BPM</span>

      </div>

      <div className="grid gap-4">

        <div className="flex flex-wrap items-center gap-2">

          <button

            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs uppercase tracking-[0.18em] text-slate-500 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"

            onClick={handleTap}

          >

            Bater tempo

          </button>

          <button

            className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${

              isPlaying

                ? "border-emerald-600 bg-emerald-600 text-white"

                : "border-slate-300 bg-slate-900 text-white dark:border-slate-200 dark:bg-white dark:text-slate-900"

            }`}

            onClick={toggleTransport}

          >

            {isPlaying ? "Parar" : "Iniciar"}

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

const StageMode = ({

  bpm,

  setBpm,

  rootNote,

  scaleMode,

  stageNotes,

  setStageNotes,

  stageCue,

  setStageCue,

}) => {

  return (

    <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">

      <div className="space-y-6">

        <div className="stage-card rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.12)] dark:border-slate-800 dark:bg-slate-900/80">

          <div className="flex flex-wrap items-start justify-between gap-4">

            <div>

              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">

                Modo Palco

              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">

                Layout enxuto com informação grande e foco total.

              </p>

            </div>

            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs uppercase tracking-[0.28em] text-slate-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400">

              palco

            </span>

          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">

            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950/40">

              <p className="text-[0.6rem] uppercase tracking-[0.3em] text-slate-400">Tom</p>

              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">

                {rootNote}

              </p>

            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950/40">

              <p className="text-[0.6rem] uppercase tracking-[0.3em] text-slate-400">

                Escala

              </p>

              <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">

                {SCALE_LABELS[scaleMode]}

              </p>

            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950/40">

              <p className="text-[0.6rem] uppercase tracking-[0.3em] text-slate-400">

                BPM

              </p>

              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">

                {bpm}

              </p>

            </div>

          </div>

        </div>

        <StageTempo bpm={bpm} setBpm={setBpm} />

      </div>

      <aside className="space-y-6">

        <div className="stage-card rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.12)] dark:border-slate-800 dark:bg-slate-900/80">

          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Repertório Rápido</h3>

          <textarea

            className="mt-4 min-h-[160px] w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-200"

            placeholder="Ex: 1) Intro em Mi • 2) Ritmo 95 BPM • 3) Solo..."

            value={stageNotes}

            onChange={(event) => setStageNotes(event.target.value)}

          />

          <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">

            Salvo automaticamente no dispositivo.

          </p>

        </div>

        <div className="stage-card rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.12)] dark:border-slate-800 dark:bg-slate-900/80">

          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Próximo Cue</h3>

          <input

            className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-base font-semibold text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-950/50 dark:text-white"

            placeholder="Ex: Ponte • Vira no 2"

            value={stageCue}

            onChange={(event) => setStageCue(event.target.value)}

          />

          <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">

            Visão imediata para transições.

          </p>

        </div>

      </aside>

    </section>

  );

};

const StageTempo = ({ bpm, setBpm }) => {

  const [tapTimes, setTapTimes] = useState([]);

  const handleTap = () => {

    const now = Date.now();

    const updated = [...tapTimes, now].slice(-4);

    setTapTimes(updated);

    if (updated.length >= 2) {

      const intervals = updated.slice(1).map((time, idx) => time - updated[idx]);

      const avg = intervals.reduce((acc, val) => acc + val, 0) / intervals.length;

      const nextBpm = Math.round(60000 / avg);

      setBpm(Math.min(220, Math.max(40, nextBpm)));

    }

  };

  return (

    <div className="stage-card rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.12)] dark:border-slate-800 dark:bg-slate-900/80">

      <div className="flex items-center justify-between">

        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Tempo de Palco</h3>

        <span className="text-sm text-slate-400 dark:text-slate-500">{bpm} BPM</span>

      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">

        <button

          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-500 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"

          onClick={handleTap}

        >

          Bater

        </button>

        <input

          className="accent-slate-900"

          type="range"

          min={40}

          max={220}

          value={bpm}

          onChange={(event) => setBpm(Number(event.target.value))}

        />

      </div>

      <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">

        Ajuste rápido sem distrair do palco.

      </p>

    </div>

  );

};

const FlashcardTrainer = ({ target, streak, feedback }) => {

  const { rootNote } = useBassTheory();

  return (

    <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/70">

      <div className="flex flex-wrap items-center justify-between gap-4">

        <div>

          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Cartões de Treino</h2>

          <p className="text-xs text-slate-500 dark:text-slate-400">

            {target.type === "note"

              ? `Encontre todas as notas ${target.value}`

              : `Toque a ${target.value} de ${rootNote}`}

          </p>

        </div>

        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400">

          <span className="uppercase tracking-[0.2em]">Sequência</span>

          <span className="text-slate-900 dark:text-slate-100">{streak}</span>

        </div>

      </div>

      <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">

        Responda clicando na casa correta do Braço Inteligente.

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

      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Guia de Palco</h2>

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

        Sortear novo guia

      </button>

      {!compact && (

        <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">

          Use o guia para variar ritmos e treinar criatividade.

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

    "Ritmo com notas longas",

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

