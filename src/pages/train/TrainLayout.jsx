import { NavLink, Outlet, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { STORAGE_KEYS, getJSON, getString, setJSON, setString } from "../../infra/storage.js";
import { useBassTheory } from "../../components/BassDojo.jsx";

const TABS = [
  { label: "Braco", value: "fretboard" },
  { label: "Ritmo", value: "rhythm" },
  { label: "Cartoes", value: "flashcards" },
  { label: "Estudos", value: "studies" },
];

const TrainLayout = () => {
  const appContext = useOutletContext();
  const location = useLocation();
  const navigate = useNavigate();
  const { rootNote, scaleMode, displayMode, nnsMode } = useBassTheory();
  const [session, setSession] = useState(() =>
    getJSON(STORAGE_KEYS.trainLastSession, null)
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

  const startSession = (preset) => {
    const nextSession = {
      sessionId: `${preset.id}-${Date.now()}`,
      name: preset.title,
      targetTab: preset.targetTab,
      startedAt: Date.now(),
      endedAt: null,
      settings: {
        rootNote,
        scaleMode,
        displayMode,
        nnsMode,
      },
    };
    setSession(nextSession);
    navigate(`/train/${preset.targetTab}`);
  };

  const endSession = () => {
    if (!session || session.endedAt) return;
    setSession({ ...session, endedAt: Date.now() });
    navigate("/train");
  };

  const activeSession = useMemo(() => {
    if (!session || session.endedAt) return null;
    return session;
  }, [session]);

  return (
    <div className="space-y-6">
      {activeSession && (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-xs text-emerald-700 shadow-[0_14px_30px_rgba(16,185,129,0.15)] dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-semibold uppercase tracking-[0.22em]">
              Sessao ativa
            </span>
            <span className="text-[0.65rem] uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">
              {activeSession.name}
            </span>
            <button
              className="rounded-full border border-emerald-300 bg-white px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-emerald-700 transition hover:border-emerald-400 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
              onClick={endSession}
            >
              Finalizar
            </button>
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
          endSession,
        }}
      />
    </div>
  );
};

export default TrainLayout;
