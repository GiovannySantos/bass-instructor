import { useMemo } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { TRAIN_SESSIONS } from "../../train/sessions.js";
import { STORAGE_KEYS, getJSON } from "../../infra/storage.js";

const TrainHome = () => {
  const navigate = useNavigate();
  const { session, startSession } = useOutletContext();

  const handleContinue = () => {
    if (session && session.targetTab) {
      navigate(`/train/${session.targetTab}`);
    }
  };

  const history = useMemo(() => {
    const items = getJSON(STORAGE_KEYS.trainHistory, []);
    return Array.isArray(items) ? items.slice(0, 5) : [];
  }, []);

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/70">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Sessões de treino</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-tight">
          Escolha um foco e comece agora.
        </p>

        {session && session.status === "active" && (
          <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[0.6rem] uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-300">
                  Continuar: {session.title}
                </p>
                <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-200">
                  Retomar no mesmo foco.
                </p>
              </div>
              <button
                className="rounded-full border border-emerald-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 transition hover:border-emerald-400 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                onClick={handleContinue}
              >
                Continuar
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {TRAIN_SESSIONS.map((preset) => (
          <div
            key={preset.id}
            className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/70"
          >
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              {preset.title}
            </h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Meta: {preset.goal.description}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Tempo: {preset.durationMin} min
            </p>
            <button
              className="mt-4 rounded-full border border-slate-300 bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white dark:border-slate-200 dark:bg-white dark:text-slate-900"
              onClick={() => startSession(preset)}
            >
              Iniciar
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/70">
        <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
          Histórico recente
        </h3>
        {history.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Nenhuma sessão registrada ainda.
          </p>
        ) : (
          <div className="mt-4 grid gap-3">
            {history.map((item) => {
              const durationMin = Math.max(1, Math.round(item.durationSec / 60));
              return (
                <div
                  key={item.sessionId}
                  className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {item.title}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.2em] text-slate-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400">
                      {item.status === "completed" ? "Concluída" : "Encerrada"}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <span>
                      Duração: {durationMin} min
                    </span>
                    <span>
                      Progresso: {item.progressValue} / {item.goal.target}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default TrainHome;
