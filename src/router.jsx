import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import App from "./App.jsx";
import TrainPage from "./pages/TrainPage.jsx";
import StagePage from "./pages/StagePage.jsx";
import { STORAGE_KEYS, getString, migrateIfNeeded } from "./infra/storage.js";

const RedirectHome = () => {
  const saved = getString(STORAGE_KEYS.mode, "treino");
  const target = saved === "palco" ? "/stage" : "/train";
  return <Navigate to={target} replace />;
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
          <Route path="/train" element={<TrainPage />} />
          <Route path="/stage" element={<StagePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default RouterRoot;
