import { NavLink, Outlet, useLocation, useOutletContext } from "react-router-dom";
import { STORAGE_KEYS, getString, setString } from "../../infra/storage.js";

const TABS = [
  { label: "Braco", value: "fretboard" },
  { label: "Ritmo", value: "rhythm" },
  { label: "Cartoes", value: "flashcards" },
  { label: "Estudos", value: "studies" },
];

const TrainLayout = () => {
  const appContext = useOutletContext();
  const location = useLocation();

  const active = location.pathname.split("/")[2];
  if (active && TABS.some((tab) => tab.value === active)) {
    const saved = getString(STORAGE_KEYS.trainLastTab, "");
    if (saved !== active) {
      setString(STORAGE_KEYS.trainLastTab, active);
    }
  }

  return (
    <div className="space-y-6">
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

      <Outlet context={appContext} />
    </div>
  );
};

export default TrainLayout;
