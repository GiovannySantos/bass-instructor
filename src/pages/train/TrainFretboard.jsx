import { useOutletContext } from "react-router-dom";
import { NOTES } from "../../domain/music/engine.js";
import {
  INSTRUMENT_PRESETS,
  buildInstrument,
  normalizeNote,
} from "../../domain/instrument/instrument.js";
import { SmartFretboard } from "../../components/BassDojo.jsx";

const TrainFretboard = () => {
  const {
    handleGameAnswer,
    reportProgress,
    session,
    instrument,
    setInstrumentPreset,
    setCustomTuning,
  } = useOutletContext();

  const tuning = instrument?.tuning || ["E", "A", "D", "G"];
  const stringCount = instrument?.stringCount || tuning.length || 4;
  const displayTuning = buildInstrument({ tuning, strings: stringCount }).tuning;
  const isCustom = instrument?.presetId === "custom";

  const handleSelect = (noteIndex) => {
    handleGameAnswer(noteIndex);
    if (session && session.status === "active" && session.goal.type === "fretboard.clicks") {
      reportProgress(1);
    }
  };

  const handlePresetChange = (event) => {
    setInstrumentPreset(event.target.value);
  };

  const handleStringCountChange = (event) => {
    const nextCount = Number(event.target.value);
    const defaults = {
      4: ["E", "A", "D", "G"],
      5: ["B", "E", "A", "D", "G"],
      6: ["B", "E", "A", "D", "G", "C"],
    };
    const base = defaults[nextCount] || defaults[4];
    const merged = displayTuning.slice(0, nextCount).concat(base.slice(displayTuning.length, nextCount));
    setCustomTuning(merged, nextCount);
  };

  const handleCustomChange = (index, value) => {
    const next = [...displayTuning];
    next[index] = normalizeNote(value);
    setCustomTuning(next, stringCount);
  };

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/70">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Configuração do instrumento
            </h2>
            <p className="mt-2 text-sm leading-tight text-slate-500 dark:text-slate-400">
              Ajuste o número de cordas e a afinação.
            </p>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Afinação: {displayTuning.join(" ")}
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
              Preset
            </label>
            <select
              className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              value={instrument?.presetId || "4EADG"}
              onChange={handlePresetChange}
            >
              {INSTRUMENT_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name}
                </option>
              ))}
            </select>
          </div>

          {isCustom && (
            <>
              <div className="grid gap-2">
                <label className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                  Cordas
                </label>
                <select
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  value={stringCount}
                  onChange={handleStringCountChange}
                >
                  {[4, 5, 6].map((count) => (
                    <option key={count} value={count}>
                      {count}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2 md:col-span-2">
                <label className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                  Afinação por corda
                </label>
                <div className="flex flex-wrap gap-2">
                  {displayTuning.map((note, index) => (
                    <select
                      key={`string-${index}`}
                      className="min-w-[3.25rem] rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      value={note}
                      onChange={(event) => handleCustomChange(index, event.target.value)}
                    >
                      {NOTES.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <SmartFretboard onNoteSelect={handleSelect} tuning={displayTuning} />
    </section>
  );
};

export default TrainFretboard;

