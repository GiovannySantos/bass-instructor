import { useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { FlashcardTrainer } from "../../components/BassDojo.jsx";

const TrainFlashcards = () => {
  const { target, streak, feedback, reportProgress, session } = useOutletContext();
  const lastFeedbackRef = useRef(null);

  useEffect(() => {
    if (!session || session.status !== "active" || session.goal.type !== "flashcards.correct") return;
    if (feedback === lastFeedbackRef.current) return;
    lastFeedbackRef.current = feedback;
    if (feedback && feedback.ok) {
      reportProgress(1);
    }
  }, [feedback, reportProgress, session]);

  return (
    <section className="space-y-6">
      <FlashcardTrainer target={target} streak={streak} feedback={feedback} />
    </section>
  );
};

export default TrainFlashcards;
