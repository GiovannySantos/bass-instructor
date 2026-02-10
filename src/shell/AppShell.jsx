import { useEffect, useRef, useState } from "react";
import {
  ControlPanel,
  GrooveBriefing,
  MetronomePanel,
  ModeToggle,
  useBassTheory,
} from "../components/BassDojo.jsx";

const AppShell = ({
  children,
  appMode,
  setAppMode,
  darkMode,
  setDarkMode,
  bpm,
  setBpm,
  isPlaying,
  setIsPlaying,
  includeEighths,
  setIncludeEighths,
  includeSixteenths,
  setIncludeSixteenths,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [coreOpen, setCoreOpen] = useState(false);
  const coreMenuRef = useRef(null);
  const { rootNote } = useBassTheory();

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

        <main className="flex-1 pt-6">{children}</main>

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

export default AppShell;
