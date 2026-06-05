

import {
  type ChangeEvent,
  useEffect,
  useState
} from "react";

import layoutStyles from "../../../components/shared/styles/layoutStyles.module.css";
import panelStyles from "../../../components/shared/styles/panelStyles.module.css";
import tabStyles from "../../../components/shared/styles/tabStyles.module.css";
import controlStyles from "../../../components/shared/styles/controlStyles.module.css";
import api from "../../../services/api";
import ZScoreChart from "../../../components/charts/ZScoreChart";
import DetectionChart from "../../../components/charts/DetectionChart";
import ClassificationRootCauseChart from "../../../components/charts/ClassificationRootCauseChart";
import ClassificationEventsTable from "../../../components/tables/ClassificationEventsTable";

type ZScoreData = {
  system?: string;
  z_score_consumption: Record<string, number>;
  z_score_by_system: Record<string, number>;
};

type DetectionData = {
  system?: string;
  all_systems_detection: Record<string, Record<string, number>>;
  by_system: Record<string, number>;
};

type ClassificationEvent = {
  system_name?: string;
  timestamp: string;
  anomaly_type: string;
  root_cause: string;
  z_score: number;
};

type ClassificationData = {
  system?: string;
  full_pipeline: ClassificationEvent[];
  context_classification: Record<string, ClassificationEvent[]>;
};

function AnomalyDetection() {

  const [mode, setMode] = useState("zscore");
  const [systemName, setSystemName] = useState("");
  const [executionMessage, setExecutionMessage] = useState("");

  const [zscoreData, setZscoreData] = useState<ZScoreData | null>(null);
  const [detectionData, setDetectionData] = useState<DetectionData | null>(null);
  const [classificationData, setClassificationData] = useState<ClassificationData | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const timeoutId = setTimeout(() => {

      const fetchAnomaly = async (): Promise<void> => {

        try {
          setLoading(true);
          setError(null);

          if (mode === "zscore") {

            const endpoint = systemName.trim()
              ? `/anomaly/zscore?name=${encodeURIComponent(systemName)}`
              : "/anomaly/zscore";

            const response = await api.get(endpoint);
            setZscoreData(response.data);
          }

          if (mode === "detection") {

            const endpoint = systemName.trim()
              ? `/anomaly/detection?name=${encodeURIComponent(systemName)}`
              : "/anomaly/detection";

            const response = await api.get(endpoint);
            setDetectionData(response.data);
          }

          if (mode === "classification") {

            const endpoint = systemName.trim()
              ? `/anomaly/classification?name=${encodeURIComponent(systemName)}`
              : "/anomaly/classification";

            const response = await api.get(endpoint);
            setClassificationData(response.data);
          }

        } catch (err) {
          console.error(err);
          setError("System not found.");
        } finally {
          setLoading(false);
        }
      };

      void fetchAnomaly();

    }, 700);

    return () => clearTimeout(timeoutId);

  }, [mode, systemName]);

  const handleRunDetection = (): void => {

    setExecutionMessage(
      systemName.trim()
        ? `${mode.toUpperCase()} Analysis executed for ${systemName}.`
        : `${mode.toUpperCase()} Analysis executed for all systems.`
    );
  };

  const handleSystemChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSystemName(event.target.value);
  };

  const zscoreChartData = zscoreData
    ? (zscoreData.system
        ? zscoreData.z_score_by_system
        : zscoreData.z_score_consumption)
    : null;

  const detectionChartData = detectionData
    ? (detectionData.system
        ? detectionData.by_system
        : detectionData.all_systems_detection)
    : null;

  const classificationEvents: ClassificationEvent[] | null =
    classificationData
      ? systemName.trim()
        ? Object.values(classificationData.context_classification || {}).flat()
        : classificationData.full_pipeline
      : null;

  return (

    <section className={layoutStyles.mainPanel}>

      <section className={panelStyles.chartPanel}>

        <div className={panelStyles.panelHeader}>

          {mode === "zscore" && "Z-Score Analysis Visualization"}
          {mode === "detection" && "Detection Analysis Visualization"}
          {mode === "classification" && "Classification Analysis Visualization"}

        </div>

        <div
          className={panelStyles.chartPlaceholder}
          style={{
            alignItems: "stretch",
            justifyContent: "flex-start"
          }}
        >

          {loading && (
            <span className={panelStyles.placeholderText}>
              Loading anomaly data...
            </span>
          )}

          {error && (
            <span className={panelStyles.placeholderText}>
              {error}
            </span>
          )}

          {!loading && !error && mode === "zscore" && zscoreChartData && (
            <div style={{ width: "100%", height: "320px" }}>
              <ZScoreChart data={zscoreChartData} />
            </div>
          )}

          {!loading && !error && mode === "detection" && detectionChartData && (
            <div style={{ width: "100%", height: "320px" }}>
              <DetectionChart data={detectionChartData} />
            </div>
          )}

          {!loading &&
            !error &&
            mode === "classification" &&
            classificationEvents && (

              <div style={{ width: "100%" }}>

                <ClassificationRootCauseChart
                  data={classificationEvents}
                />

                <ClassificationEventsTable
                  data={classificationEvents}
                  system={systemName.trim() || undefined}
                />

              </div>
            )}

        </div>

      </section>

      <section className={panelStyles.controlPanel}>

        <div className={panelStyles.panelHeader}>
          Anomaly Configuration
        </div>

        <div className={controlStyles.controlContent}>

          <div className={tabStyles.tabs}>

            <button
              className={mode === "zscore"
                ? tabStyles.tabButtonActive
                : tabStyles.tabButton}
              onClick={() => setMode("zscore")}
            >
              Z-Score
            </button>

            <button
              className={mode === "detection"
                ? tabStyles.tabButtonActive
                : tabStyles.tabButton}
              onClick={() => setMode("detection")}
            >
              Detection
            </button>

            <button
              className={mode === "classification"
                ? tabStyles.tabButtonActive
                : tabStyles.tabButton}
              onClick={() => setMode("classification")}
            >
              Classification
            </button>

          </div>

          <div className={controlStyles.rangeInputs}>

            <div className={controlStyles.inputGroup}>

              <input
                type="text"
                className={controlStyles.input}
                placeholder="Optional System"
                value={systemName}
                onChange={handleSystemChange}
              />

              <div className={controlStyles.inputLabel}>
                System Name
              </div>

            </div>

          </div>

          <button
            className={controlStyles.runButton}
            onClick={handleRunDetection}
          >
            Run {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>

          {executionMessage && (
            <div className={controlStyles.executionInfo}>
              <span>Status:</span>
              <strong>{executionMessage}</strong>
            </div>
          )}

        </div>

      </section>

    </section>
  );
}

export default AnomalyDetection;



