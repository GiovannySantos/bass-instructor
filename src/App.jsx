import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  STORAGE_KEYS,
  getBool,
  getJSON,
  getString,
  setBool,
  setJSON,
  setString,
} from "./infra/storage.js";
import {
  BassTheoryProvider,
  randomTarget,
  useBassTheory,
  validateTarget,
} from "./components/BassDojo.jsx";
import { INSTRUMENT_PRESETS, buildInstrument } from "./domain/instrument/instrument.js";
import AppShell from "./shell/AppShell.jsx";

const DEFAULT_INSTRUMENT = {
  presetId: "4EADG",
  stringCount: 4,
  tuning: ["E", "A", "D", "G"],
};

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

  const [instrument, setInstrument] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_INSTRUMENT;
    const saved = getJSON(STORAGE_KEYS.instrument, null);
    if (!saved || !Array.isArray(saved.tuning)) return DEFAULT_INSTRUMENT;
    const built = buildInstrument({ tuning: saved.tuning, strings: saved.stringCount });
    return {
      presetId: saved.presetId || DEFAULT_INSTRUMENT.presetId,
      stringCount: built.stringCount,
      tuning: built.tuning,
    };
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

  useEffect(() => {
    setJSON(STORAGE_KEYS.instrument, instrument);
  }, [instrument]);

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

  const setInstrumentPreset = (presetId) => {
    const preset = INSTRUMENT_PRESETS.find((item) => item.id === presetId);
    if (!preset) return;
    if (presetId === "custom") {
      setInstrument((prev) => ({ ...prev, presetId: "custom" }));
      return;
    }
    const built = buildInstrument({ tuning: preset.tuning, strings: preset.tuning.length });
    setInstrument({
      presetId: preset.id,
      stringCount: built.stringCount,
      tuning: built.tuning,
    });
  };

  const setCustomTuning = (tuning, stringCount) => {
    const built = buildInstrument({ tuning, strings: stringCount });
    setInstrument({
      presetId: "custom",
      stringCount: built.stringCount,
      tuning: built.tuning,
    });
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
          instrument,
          setInstrumentPreset,
          setCustomTuning,
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

