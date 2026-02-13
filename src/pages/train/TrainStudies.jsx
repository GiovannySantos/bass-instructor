import { useOutletContext } from "react-router-dom";
import { StudiesPanel } from "../../components/BassDojo.jsx";

const TrainStudies = () => {
  const { reportProgress, session } = useOutletContext();

  return (
    <section className="space-y-6">
      <StudiesPanel
        onCopy={() => {
          if (session && session.status === "active" && session.goal.type === "studies.copied") {
            reportProgress(1);
          }
        }}
      />
    </section>
  );
};

export default TrainStudies;
