

import {
  type ChangeEvent,
  useEffect,
  useState
} from "react";

import {
  Activity,
  Play,
  Search,
  Tags
} from "lucide-react";

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

const anomalyModeHeadings = {
  zscore: {
    title: "Z-Score Analysis",
    subtitle:
      "Consumption deviation measured using Z-Score"
  },
  detection: {
    title: "Anomaly Detection",
    subtitle:
    "Anomalies identified from Z-Score deviation"
  }
};

function AnomalyDetection() {

  const [mode, setMode] = useState("zscore");
  const [systemName, setSystemName] = useState("");
  const [systemNames, setSystemNames] =
    useState<string[]>([]);
  const [executionMessage, setExecutionMessage] = useState("");

  const [zscoreData, setZscoreData] =
    useState<ZScoreData | null>(null);

  const [detectionData, setDetectionData] =
    useState<DetectionData | null>(null);

  const [classificationData, setClassificationData] =
    useState<ClassificationData | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [runningAnalysis, setRunningAnalysis] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {

    const fetchSystems = async (): Promise<void> => {

      try {

        const response =
          await api.get("/metrics/basic");

        const systems =
          Object.keys(
            response.data.consumption_by_system
          );

        setSystemNames(systems);

      } catch (err) {

        console.error(
          "System names loading failed:",
          err
        );
      }
    };

    void fetchSystems();

  }, []);

  const handleRunDetection =
    async (): Promise<void> => {

      try {

        setLoading(true);
        setRunningAnalysis(true);
        setError(null);

        if (mode === "zscore") {

          const endpoint = systemName.trim()
            ? `/anomaly/zscore?name=${encodeURIComponent(systemName)}`
            : "/anomaly/zscore";

          const response =
            await api.get(endpoint);

          setZscoreData(response.data);
        }

        if (mode === "detection") {

          const endpoint = systemName.trim()
            ? `/anomaly/detection?name=${encodeURIComponent(systemName)}`
            : "/anomaly/detection";

          const response =
            await api.get(endpoint);

          setDetectionData(response.data);
        }

        if (mode === "classification") {

          const endpoint = systemName.trim()
            ? `/anomaly/classification?name=${encodeURIComponent(systemName)}`
            : "/anomaly/classification";

          const response =
            await api.get(endpoint);

          setClassificationData(response.data);
        }

        setExecutionMessage(
          `${currentModeLabel} analysis executed successfully`
        );

      } catch (error: any) {

        console.error(
          "Anomaly analysis execution failed:",
          error
        );

        setError(
          error?.response?.data?.message ||
          error.message ||
          "Anomaly analysis execution failed."
        );

        setExecutionMessage("");

      } finally {

        setLoading(false);
        setRunningAnalysis(false);

      }
    };

  const handleModeChange = (newMode: string): void => {
    setMode(newMode);
    setExecutionMessage("");
    setError(null);
  };

  const currentModeLabel =
    mode === "zscore"
      ? "Z-Score"
      : mode.charAt(0).toUpperCase() + mode.slice(1);

  const currentModeHeading =
    anomalyModeHeadings[
      mode as keyof typeof anomalyModeHeadings
    ];

  const handleSystemChange = (
    event: ChangeEvent<HTMLSelectElement>
  ): void => {
    setSystemName(event.target.value);
    setExecutionMessage("");
    setError(null);
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
      ? classificationData.system
        ? Object.values(
            classificationData.context_classification || {}
          ).flat()
        : classificationData.full_pipeline
      : null;

  return (

    <section className={layoutStyles.mainPanel}>

      <div className={layoutStyles.sectionHeading}>

        <h2>{currentModeHeading?.title}</h2>

        <span>
          {currentModeHeading?.subtitle}
        </span>

      </div>

      <section className={panelStyles.chartPanel}>

        <div className={panelStyles.panelHeader}>

          {mode === "zscore" &&
            "Z-Score Over Time"}

          {mode === "detection" &&
            "Detection Score Over Time"}

          {mode === "classification" &&
            "Classification Analysis Visualization"}

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

          {!loading &&
            !error &&
            mode === "zscore" &&
            zscoreChartData && (

              <div
                style={{
                  width: "100%",
                  height: "100%",
                  minHeight: 0,
                  flex: 1
                }}
              >
                <ZScoreChart
                  data={zscoreChartData}
                />
              </div>
            )}

          {!loading &&
            !error &&
            mode === "detection" &&
            detectionChartData && (

              <div
                style={{
                  width: "100%",
                  height: "100%",
                  minHeight: 0,
                  flex: 1
                }}
              >
                <DetectionChart
                  data={detectionChartData}
                />
              </div>
            )}

          {!loading &&
            !error &&
            mode === "classification" &&
            classificationEvents && (

              <div
                style={{
                  width: "100%"
                }}
              >

                <ClassificationRootCauseChart
                  data={classificationEvents}
                />

                <ClassificationEventsTable
                  data={classificationEvents}
                  system={
                    systemName.trim() ||
                    undefined
                  }
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
              className={
                mode === "zscore"
                  ? tabStyles.damlTabButtonActive
                  : tabStyles.damlTabButton
              }
              onClick={() =>
                handleModeChange("zscore")
              }
            >
              <Activity
                className={tabStyles.damlTabIcon}
              />
              Z-Score
            </button>

            <button
              className={
                mode === "detection"
                  ? tabStyles.damlTabButtonActive
                  : tabStyles.damlTabButton
              }
              onClick={() =>
                handleModeChange("detection")
              }
            >
              <Search
                className={tabStyles.damlTabIcon}
              />
              Detection
            </button>

            <button
              className={
                mode === "classification"
                  ? tabStyles.damlTabButtonActive
                  : tabStyles.damlTabButton
              }
              onClick={() =>
                handleModeChange("classification")
              }
            >
              <Tags
                className={tabStyles.damlTabIcon}
              />
              Classification
            </button>

          </div>

          <div className={controlStyles.rangeInputs}>

            <div className={controlStyles.inputGroup}>

              <select
                className={`${controlStyles.input} ${controlStyles.systemSelect}`}
                value={systemName}
                onChange={handleSystemChange}
              >
                <option value="">
                  All Systems
                </option>

                {systemNames.map((name) => (
                  <option
                    key={name}
                    value={name}
                  >
                    {name}
                  </option>
                ))}

              </select>

              <div className={controlStyles.inputLabel}>
                System Name
              </div>

            </div>

          </div>

          <button
            type="button"
            className={`${controlStyles.runButton} ${
              runningAnalysis
                ? controlStyles.runButtonRunning
                : ""
            }`}
            onClick={handleRunDetection}
            disabled={loading}
          >
            <Play
              className={`${controlStyles.runButtonIcon} ${
                runningAnalysis
                  ? controlStyles.runButtonIconRunning
                  : ""
              }`}
            />

            {
              runningAnalysis
                ? `Running ${currentModeLabel}...`
                : `Run ${currentModeLabel}`
            }
          </button>

          {
            executionMessage && (
              <div className={controlStyles.executionInfo}>
                <span>
                  {executionMessage}
                </span>

                <strong>
                  System:{" "}
                  {systemName.trim() || "All Systems"}
                </strong>
              </div>
            )
          }

        </div>

      </section>

    </section>
  );
}

export default AnomalyDetection;
