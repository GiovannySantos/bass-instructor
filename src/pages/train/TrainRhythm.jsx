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
  } = useOutletContext();

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
