import { useEffect, useState } from "react";
import {
  BassTheoryProvider,
  randomTarget,
  useBassTheory,
  validateTarget,
} from "./components/BassDojo.jsx";
import AppShell from "./shell/AppShell.jsx";
import TrainPage from "./pages/TrainPage.jsx";
import StagePage from "./pages/StagePage.jsx";

const AppContent = () => {
  const [target, setTarget] = useState(() => randomTarget());
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const { rootNote, scaleMode } = useBassTheory();

  const [appMode, setAppMode] = useState(() => {
    if (typeof window === "undefined") return "treino";
    const saved = window.localStorage.getItem("bassdojo:mode");
    return saved === "palco" ? "palco" : "treino";
  });

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = window.localStorage.getItem("bassdojo:dark");
    if (saved !== null) return saved === "true";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [bpm, setBpm] = useState(92);
  const [isPlaying, setIsPlaying] = useState(false);
  const [includeEighths, setIncludeEighths] = useState(false);
  const [includeSixteenths, setIncludeSixteenths] = useState(false);

  const [stageNotes, setStageNotes] = useState(() => {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem("bassdojo:stage-notes") || "";
  });

  const [stageCue, setStageCue] = useState(() => {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem("bassdojo:stage-cue") || "";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    window.localStorage.setItem("bassdojo:dark", String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("mode-stage", appMode === "palco");
    window.localStorage.setItem("bassdojo:mode", appMode);
  }, [appMode]);

  useEffect(() => {
    window.localStorage.setItem("bassdojo:stage-notes", stageNotes);
  }, [stageNotes]);

  useEffect(() => {
    window.localStorage.setItem("bassdojo:stage-cue", stageCue);
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

  return (
    <AppShell
      appMode={appMode}
      setAppMode={setAppMode}
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
      {appMode === "palco" ? (
        <StagePage
          bpm={bpm}
          setBpm={setBpm}
          rootNote={rootNote}
          scaleMode={scaleMode}
          stageNotes={stageNotes}
          setStageNotes={setStageNotes}
          stageCue={stageCue}
          setStageCue={setStageCue}
        />
      ) : (
        <TrainPage
          onNoteSelect={handleGameAnswer}
          target={target}
          streak={streak}
          feedback={feedback}
          bpm={bpm}
          setBpm={setBpm}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          includeEighths={includeEighths}
          setIncludeEighths={setIncludeEighths}
          includeSixteenths={includeSixteenths}
          setIncludeSixteenths={setIncludeSixteenths}
        />
      )}
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
