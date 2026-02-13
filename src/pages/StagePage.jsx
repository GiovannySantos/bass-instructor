import { useOutletContext } from "react-router-dom";
import { SCALE_LABELS } from "../components/BassDojo.jsx";
import useTapTempo from "../hooks/useTapTempo.js";

const StagePage = () => {
  const {
    bpm,
    setBpm,
    rootNote,
    scaleMode,
    stageNotes,
    setStageNotes,
    stageCue,
    setStageCue,
  } = useOutletContext();

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
  const { tap, setBpm: setTapBpm } = useTapTempo({
    initialBpm: bpm,
    minBpm: 40,
    maxBpm: 220,
  });
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
          onChange={handleRangeChange}
        />
      </div>

      <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
        Ajuste rápido sem distrair do palco.
      </p>
    </div>
  );
};

export default StagePage;
