import { useOutletContext } from "react-router-dom";
import { SmartFretboard } from "../../components/BassDojo.jsx";

const TrainFretboard = () => {
  const { handleGameAnswer } = useOutletContext();

  return (
    <section className="space-y-6">
      <SmartFretboard onNoteSelect={handleGameAnswer} />
    </section>
  );
};

export default TrainFretboard;
