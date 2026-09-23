

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

const anomalyModes = [
  {
    value: "zscore",
    label: "Z-Score",
    icon: Activity
  },
  {
    value: "detection",
    label: "Detection",
    icon: Search
  },
  {
    value: "classification",
    label: "Classification",
    icon: Tags
  }
];

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
  },
  classification: {
    title: "Anomaly Classification",
    subtitle:
      "Anomaly classification by type and root cause"
  }
};

function AnomalyDetection() {

  const [mode, setMode] = useState("zscore");
  const [systemName, setSystemName] = useState("");
  const [systemNames, setSystemNames] =
    useState<string[]>([]);
  const [executionMessage, setExecutionMessage] =
    useState("");

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
    ? (
        zscoreData.system
          ? zscoreData.z_score_by_system
          : zscoreData.z_score_consumption
      )
    : null;

  const detectionChartData = detectionData
    ? (
        detectionData.system
          ? detectionData.by_system
          : detectionData.all_systems_detection
      )
    : null;

  const hasDetectionData =
    detectionChartData &&
    (
      Array.isArray(detectionChartData)
        ? detectionChartData.length > 0
        : Object.values(detectionChartData).some(
            (values) =>
              typeof values === "object"
                ? Object.keys(values).length > 0
                : true
          )
    );

  const classificationEvents:
    ClassificationEvent[] | null =
    classificationData
      ? (
          classificationData.system
            ? Object.values(
                classificationData.context_classification || {}
              ).flat()
            : classificationData.full_pipeline
        )
      : null;

  return (

    <section className={layoutStyles.mainPanel}>

      <div className={layoutStyles.sectionHeading}>

        <h2>
          {currentModeHeading?.title}
        </h2>

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
            "Root Cause Frequency"}

        </div>

        <div
          className={panelStyles.chartPlaceholder}
          style={{
            alignItems: "stretch",
            justifyContent: "flex-start"
          }}
        >

          {loading && (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <span className={panelStyles.placeholderText}>
                Loading anomaly data...
              </span>
            </div>
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
            detectionData &&
            !hasDetectionData && (

              <span className={panelStyles.placeholderText}>
                No detection data available
              </span>
            )}

          {!loading &&
            !error &&
            mode === "detection" &&
            hasDetectionData && (

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
                  width: "100%",
                  height: "100%",
                  minHeight: 0,
                  flex: 1
                }}
              >
                <ClassificationRootCauseChart
                  data={classificationEvents}
                />
              </div>
            )}

        </div>

      </section>

      {!loading &&
        !error &&
        mode === "classification" &&
        classificationEvents && (

          <section className={panelStyles.tablePanel}>

            <div className={panelStyles.panelHeader}>
              Classification Events
            </div>

            <div className={panelStyles.tableContainer}>

              <ClassificationEventsTable
                data={classificationEvents}
                system={
                  systemName.trim() ||
                  undefined
                }
              />

            </div>

          </section>

        )}

      <section className={panelStyles.controlPanel}>

        <div className={panelStyles.panelHeader}>
          Anomaly Configuration
        </div>

        <div className={controlStyles.controlContent}>

          <div className={tabStyles.tabs}>

            {anomalyModes.map(
              (anomalyMode) => {

                const Icon =
                  anomalyMode.icon;

                return (
                  <button
                    key={anomalyMode.value}
                    type="button"
                    className={
                      mode === anomalyMode.value
                        ? tabStyles.damlTabButtonActive
                        : tabStyles.damlTabButton
                    }
                    onClick={() =>
                      handleModeChange(
                        anomalyMode.value
                      )
                    }
                  >
                    <Icon
                      className={
                        tabStyles.damlTabIcon
                      }
                    />

                    {anomalyMode.label}

                  </button>
                );

              }
            )}

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

                {systemNames.map(
                  (name) => (
                    <option
                      key={name}
                      value={name}
                    >
                      {name}
                    </option>
                  )
                )}

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

          {executionMessage && (
            <div className={controlStyles.executionInfo}>

              <span>
                {executionMessage}
              </span>

              <strong>
                System:{" "}
                {systemName.trim() || "All Systems"}
              </strong>

            </div>
          )}

        </div>

      </section>

    </section>
  );
}

export default AnomalyDetection;
