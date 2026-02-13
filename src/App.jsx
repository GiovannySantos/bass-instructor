import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  STORAGE_KEYS,
  getBool,
  getString,
  setBool,
  setString,
} from "./infra/storage.js";
import {
  BassTheoryProvider,
  randomTarget,
  useBassTheory,
  validateTarget,
} from "./components/BassDojo.jsx";
import AppShell from "./shell/AppShell.jsx";

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [target, setTarget] = useState(() => randomTarget());
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const { rootNote, scaleMode } = useBassTheory();

  const appMode = location.pathname.startsWith("/stage") ? "palco" : "treino";

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = getBool(STORAGE_KEYS.dark, null);
    if (saved !== null) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [bpm, setBpm] = useState(92);
  const [isPlaying, setIsPlaying] = useState(false);
  const [includeEighths, setIncludeEighths] = useState(false);
  const [includeSixteenths, setIncludeSixteenths] = useState(false);

  const [stageNotes, setStageNotes] = useState(() => {
    if (typeof window === "undefined") return "";
    return getString(STORAGE_KEYS.stageNotes, "");
  });

  const [stageCue, setStageCue] = useState(() => {
    if (typeof window === "undefined") return "";
    return getString(STORAGE_KEYS.stageCue, "");
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    setBool(STORAGE_KEYS.dark, darkMode);
  }, [darkMode]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("mode-stage", appMode === "palco");
    setString(STORAGE_KEYS.mode, appMode);
  }, [appMode]);

  useEffect(() => {
    setString(STORAGE_KEYS.stageNotes, stageNotes);
  }, [stageNotes]);

  useEffect(() => {
    setString(STORAGE_KEYS.stageCue, stageCue);
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

  const handleModeChange = (mode) => {
    navigate(mode === "palco" ? "/stage" : "/train");
  };

  return (
    <AppShell
      appMode={appMode}
      setAppMode={handleModeChange}
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      bpm={bpm}
      setBpm={setBpm}
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
      includeEighths={includeEighths}
      setIncludeEighths={setIncludeEighths}
      includeSixteenths={includeSixteenths}
      setIncludeSixteenths={setIncludeSixteenths}
    >
      <Outlet
        context={{
          appMode,
          target,
          streak,
          feedback,
          bpm,
          setBpm,
          isPlaying,
          setIsPlaying,
          includeEighths,
          setIncludeEighths,
          includeSixteenths,
          setIncludeSixteenths,
          rootNote,
          scaleMode,
          stageNotes,
          setStageNotes,
          stageCue,
          setStageCue,
          handleGameAnswer,
        }}
      />
    </AppShell>
  );
};

const App = () => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }
  }, []);

  return (
    <BassTheoryProvider>
      <AppContent />
    </BassTheoryProvider>
  );
};

export default App;
