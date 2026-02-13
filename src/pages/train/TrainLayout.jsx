import { NavLink, Outlet, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  STORAGE_KEYS,
  getJSON,
  getString,
  setJSON,
  setString,
} from "../../infra/storage.js";
import { useBassTheory } from "../../components/BassDojo.jsx";

const TABS = [
  { label: "Braco", value: "fretboard" },
  { label: "Ritmo", value: "rhythm" },
  { label: "Cartoes", value: "flashcards" },
  { label: "Estudos", value: "studies" },
];

const DEFAULT_GOALS = {
  fretboard: {
    type: "fretboard.clicks",
    target: 20,
    description: "Fazer 20 cliques no braco",
  },
  rhythm: {
    type: "rhythm.bpmReached",
    target: 120,
    description: "Chegar a 120 BPM",
  },
  flashcards: {
    type: "flashcards.correct",
    target: 10,
    description: "Acertar 10 cartoes",
  },
  studies: {
    type: "studies.copied",
    target: 1,
    description: "Copiar uma secao de notas",
  },
};

const normalizeSession = (raw) => {
  if (!raw || !raw.targetTab) return null;
  if (raw.goal && raw.progress && raw.status) return raw;
  const goal = raw.goal || DEFAULT_GOALS[raw.targetTab];
  if (!goal) return null;
  return {
    sessionId: raw.sessionId || `legacy-${Date.now()}`,
    title: raw.title || raw.name || "Sessao",
    targetTab: raw.targetTab,
    goal,
    progress: raw.progress || { value: 0, target: goal.target },
    startedAt: raw.startedAt || Date.now(),
    endedAt: raw.endedAt || null,
    status: raw.endedAt ? "ended" : "active",
    snapshot: raw.snapshot || raw.settings || null,
  };
};

const TrainLayout = () => {
  const appContext = useOutletContext();
  const location = useLocation();
  const navigate = useNavigate();
  const { rootNote, scaleMode, displayMode, nnsMode } = useBassTheory();
  const [session, setSession] = useState(() =>
    normalizeSession(getJSON(STORAGE_KEYS.trainLastSession, null))
  );

  const activeTab = location.pathname.split("/")[2];
  useEffect(() => {
    if (activeTab && TABS.some((tab) => tab.value === activeTab)) {
      const saved = getString(STORAGE_KEYS.trainLastTab, "");
      if (saved !== activeTab) {
        setString(STORAGE_KEYS.trainLastTab, activeTab);
      }
    }
  }, [activeTab]);

  useEffect(() => {
    if (session) {
      setJSON(STORAGE_KEYS.trainLastSession, session);
    }
  }, [session]);

  const pushHistory = useCallback((entry) => {
    const current = getJSON(STORAGE_KEYS.trainHistory, []);
    const next = [entry, ...current].slice(0, 20);
    setJSON(STORAGE_KEYS.trainHistory, next);
  }, []);

  const finishSession = useCallback(
    (status) => {
      if (!session) return;
      if (session.status !== "active" && session.status !== "completed") return;
      const endedAt = Date.now();
      const durationSec = Math.max(
        1,
        Math.round((endedAt - session.startedAt) / 1000)
      );
      const finalStatus =
        status || (session.progress.value >= session.progress.target ? "completed" : "ended");
      const nextSession = {
        ...session,
        status: finalStatus,
        endedAt,
      };
      setSession(nextSession);
      pushHistory({
        sessionId: nextSession.sessionId,
        title: nextSession.title,
        status: finalStatus,
        startedAt: nextSession.startedAt,
        endedAt,
        durationSec,
        goal: {
          type: nextSession.goal.type,
          target: nextSession.goal.target,
        },
        progressValue: nextSession.progress.value,
      });
      if (finalStatus !== "completed") {
        navigate("/train");
      }
    },
    [navigate, pushHistory, session]
  );

  const startSession = useCallback(
    (preset) => {
      const nextSession = {
        sessionId: `${preset.id}-${Date.now()}`,
        title: preset.title,
        targetTab: preset.targetTab,
        goal: preset.goal,
        progress: { value: 0, target: preset.goal.target },
        startedAt: Date.now(),
        endedAt: null,
        status: "active",
        snapshot: {
          rootNote,
          scaleMode,
          displayMode,
          nnsMode,
        },
      };
      setSession(nextSession);
      navigate(`/train/${preset.targetTab}`);
    },
    [displayMode, navigate, nnsMode, rootNote, scaleMode]
  );

  const reportProgress = useCallback(
    (value, mode = "increment") => {
      if (!session || session.status !== "active") return;
      if (activeTab !== session.targetTab) return;
      const nextValue =
        mode === "set" ? value : session.progress.value + Number(value || 0);
      const clamped = Math.min(session.progress.target, Math.max(0, nextValue));
      if (clamped === session.progress.value) return;
      const updated = {
        ...session,
        progress: {
          ...session.progress,
          value: clamped,
        },
      };
      setSession(updated);
      if (clamped >= session.progress.target) {
        const completed = {
          ...updated,
          status: "completed",
          endedAt: Date.now(),
        };
        setSession(completed);
        pushHistory({
          sessionId: completed.sessionId,
          title: completed.title,
          status: "completed",
          startedAt: completed.startedAt,
          endedAt: completed.endedAt,
          durationSec: Math.max(
            1,
            Math.round((completed.endedAt - completed.startedAt) / 1000)
          ),
          goal: {
            type: completed.goal.type,
            target: completed.goal.target,
          },
          progressValue: completed.progress.value,
        });
      }
    },
    [activeTab, pushHistory, session]
  );

  const activeSession = useMemo(() => {
    if (!session) return null;
    if (session.status === "ended") return null;
    return session;
  }, [session]);

  return (
    <div className="space-y-6">
      {activeSession && (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-xs text-emerald-700 shadow-[0_14px_30px_rgba(16,185,129,0.15)] dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold uppercase tracking-[0.22em]">
                  Sessao
                </span>
                {activeSession.status === "completed" && (
                  <span className="rounded-full border border-emerald-300 bg-white px-2 py-0.5 text-[0.55rem] font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                    Concluida
                  </span>
                )}
              </div>
              <div className="text-[0.65rem] uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">
                {activeSession.title}
              </div>
              <div className="text-[0.65rem] text-emerald-700 dark:text-emerald-200">
                {activeSession.goal.description}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-emerald-300 bg-white px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                {activeSession.progress.value} / {activeSession.progress.target}
              </span>
              {activeSession.status === "completed" ? (
                <button
                  className="rounded-full border border-emerald-300 bg-white px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-emerald-700 transition hover:border-emerald-400 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                  onClick={() => {
                    setSession({ ...activeSession, status: "ended" });
                    navigate("/train");
                  }}
                >
                  Voltar para Sessoes
                </button>
              ) : (
                <button
                  className="rounded-full border border-emerald-300 bg-white px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-emerald-700 transition hover:border-emerald-400 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                  onClick={() => finishSession("ended")}
                >
                  Finalizar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-2 shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/70">
        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <NavLink
              key={tab.value}
              to={`/train/${tab.value}`}
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.22em] transition md:text-xs ${
                  isActive
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
      </div>

      <Outlet
        context={{
          ...appContext,
          session: activeSession,
          startSession,
          finishSession,
          reportProgress,
        }}
      />
    </div>
  );
};

export default TrainLayout;
