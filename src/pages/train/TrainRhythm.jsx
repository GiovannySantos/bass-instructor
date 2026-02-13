import { useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { MetronomePanel, GrooveBriefing } from "../../components/BassDojo.jsx";

const TrainRhythm = () => {
  const {
    bpm,
    setBpm,
    isPlaying,
    setIsPlaying,
    includeEighths,
    setIncludeEighths,
    includeSixteenths,
    setIncludeSixteenths,
    reportProgress,
    session,
  } = useOutletContext();

  const reachedRef = useRef(false);

  useEffect(() => {
    if (!session || session.status !== "active" || session.goal.type !== "rhythm.bpmReached") return;
    reachedRef.current = false;
  }, [session]);

  useEffect(() => {
    if (!session || session.status !== "active" || session.goal.type !== "rhythm.bpmReached") return;
    if (reachedRef.current) return;
    if (bpm >= session.goal.target) {
      reachedRef.current = true;
      reportProgress(session.goal.target, "set");
    }
  }, [bpm, reportProgress, session]);

  return (
    <section className="space-y-6">
      <MetronomePanel
        bpm={bpm}
        setBpm={setBpm}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        includeEighths={includeEighths}
        setIncludeEighths={setIncludeEighths}
        includeSixteenths={includeSixteenths}
        setIncludeSixteenths={setIncludeSixteenths}
      />
      <GrooveBriefing />
    </section>
  );
};

export default TrainRhythm;
