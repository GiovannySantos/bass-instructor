import { useOutletContext } from "react-router-dom";
import { FlashcardTrainer } from "../../components/BassDojo.jsx";

const TrainFlashcards = () => {
  const { target, streak, feedback } = useOutletContext();

  return (
    <section className="space-y-6">
      <FlashcardTrainer target={target} streak={streak} feedback={feedback} />
    </section>
  );
};

export default TrainFlashcards;
