import { useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { SmartFretboard } from "../../components/BassDojo.jsx";

const TrainFretboard = () => {
  const { handleGameAnswer, reportProgress, session } = useOutletContext();

  const handleSelect = useCallback(
    (noteIndex) => {
      handleGameAnswer(noteIndex);
      if (session && session.status === "active" && session.goal.type === "fretboard.clicks") {
        reportProgress(1);
      }
    },
    [handleGameAnswer, reportProgress, session]
  );

  return (
    <section className="space-y-6">
      <SmartFretboard onNoteSelect={handleSelect} />
    </section>
  );
};

export default TrainFretboard;
