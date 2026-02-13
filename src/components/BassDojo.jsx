import { createContext, useContext, useMemo, useState } from "react";



import { Chord, Interval } from "tonal";
import useTapTempo from "../hooks/useTapTempo.js";



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



const StudiesPanel = ({ onCopy } = {}) => {



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
      if (onCopy) onCopy();



      setTimeout(() => setCopiedKey(null), 1200);



    } catch {



      // no clipboard access; ignore silently



    }



  };



  return (



    <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/70">



      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">



        <div>



          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Estudos</h2>



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
  const { tap, setBpm: setTapBpm } = useTapTempo({
    initialBpm: bpm,
    minBpm: 40,
    maxBpm: 200,
  });
  const toggleTransport = () => {
    setIsPlaying((prev) => !prev);
  };
  const handleTap = () => {
    const next = tap();
    if (next !== null) {
      setBpm(next);
    }
  };
  const handleRangeChange = (event) => {
    const value = Number(event.target.value);
    setBpm(value);
    setTapBpm(value);
  };
  return (



    <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/70">



      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">



        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Treino de ritmo</h2>



        <span className="text-xs text-slate-400 dark:text-slate-500 tabular-nums whitespace-nowrap min-w-[7ch] leading-none sm:ml-auto sm:flex-none">{bpm} BPM</span>



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



          onChange={handleRangeChange}



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



          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Cartões de treino</h2>



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




export {
  BassTheoryProvider,
  useBassTheory,
  NOTES,
  SCALE_LIBRARY,
  SCALE_LABELS,
  CHORD_DEGREES,
  buildScaleNotes,
  randomTarget,
  validateTarget,
  ControlPanel,
  ModeToggle,
  StudiesPanel,
  SmartFretboard,
  MetronomePanel,
  FlashcardTrainer,
  GrooveBriefing,
};
