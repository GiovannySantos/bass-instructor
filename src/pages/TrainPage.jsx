import {
  FlashcardTrainer,
  GrooveBriefing,
  MetronomePanel,
  SmartFretboard,
  StudiesPanel,
} from "../components/BassDojo.jsx";

const TrainPage = ({
  onNoteSelect,
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
}) => {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        <SmartFretboard onNoteSelect={onNoteSelect} />
        <FlashcardTrainer target={target} streak={streak} feedback={feedback} />
        <StudiesPanel />
      </div>
      <aside className="space-y-6">
        <div className="hidden space-y-6 md:block">
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
        </div>
      </aside>
    </section>
  );
};

export default TrainPage;
