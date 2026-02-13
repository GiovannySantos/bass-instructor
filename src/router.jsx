import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import App from "./App.jsx";
import StagePage from "./pages/StagePage.jsx";
import TrainLayout from "./pages/train/TrainLayout.jsx";
import TrainFretboard from "./pages/train/TrainFretboard.jsx";
import TrainRhythm from "./pages/train/TrainRhythm.jsx";
import TrainFlashcards from "./pages/train/TrainFlashcards.jsx";
import TrainStudies from "./pages/train/TrainStudies.jsx";
import { STORAGE_KEYS, getString, migrateIfNeeded } from "./infra/storage.js";

const getTrainTarget = () => {
  const saved = getString(STORAGE_KEYS.trainLastTab, "fretboard");
  const allowed = new Set(["fretboard", "rhythm", "flashcards", "studies"]);
  return allowed.has(saved) ? saved : "fretboard";
};

const RedirectHome = () => {
  const saved = getString(STORAGE_KEYS.mode, "treino");
  const target = saved === "palco" ? "/stage" : "/train";
  return <Navigate to={target} replace />;
};

const RedirectTrainIndex = () => {
  return <Navigate to={getTrainTarget()} replace />;
};

const RouterRoot = () => {
  useEffect(() => {
    migrateIfNeeded();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RedirectHome />} />
        <Route element={<App />}>
          <Route path="/train" element={<TrainLayout />}>
            <Route index element={<RedirectTrainIndex />} />
            <Route path="fretboard" element={<TrainFretboard />} />
            <Route path="rhythm" element={<TrainRhythm />} />
            <Route path="flashcards" element={<TrainFlashcards />} />
            <Route path="studies" element={<TrainStudies />} />
          </Route>
          <Route path="/stage" element={<StagePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default RouterRoot;
