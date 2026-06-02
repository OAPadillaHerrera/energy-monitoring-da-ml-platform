

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

type ZScoreData = {
  system?: string;
  z_score_consumption: Record<string, number>;
  z_score_by_system: Record<string, number>;
};

function AnomalyDetection() {

  const [mode, setMode] = useState("zscore");

  const [systemName, setSystemName] = useState("");

  const [executionMessage, setExecutionMessage] = useState("");

  const [zscoreData, setZscoreData] =
    useState<ZScoreData | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {

  const timeoutId = setTimeout(() => {

    const fetchZScore = async (): Promise<void> => {

      if (mode !== "zscore") {
        return;
      }

      try {

        setLoading(true);
        setError(null);

        const endpoint = systemName.trim()
          ? `/anomaly/zscore?name=${encodeURIComponent(systemName)}`
          : "/anomaly/zscore";

        const response = await api.get(endpoint);

        console.log(response.data);

        setZscoreData(response.data);

      } catch (err) {

  console.error(err);

  setZscoreData(null);

  setError(
    "System not found."
  );


      } finally {

        setLoading(false);
      }
    };

    void fetchZScore();

  }, 700);

  return () => clearTimeout(timeoutId);

}, [mode, systemName]);

  const handleRunDetection = (): void => {

    if (mode === "zscore") {

      setExecutionMessage(

        systemName.trim()

          ? `Z-Score Analysis executed for ${systemName}.`

          : "Z-Score Analysis executed for station consumption."
      );
    }

    if (mode === "detection") {

      setExecutionMessage(
        "Detection Analysis executed."
      );
    }

    if (mode === "classification") {

      setExecutionMessage(
        "Classification Analysis executed."
      );
    }
  };

  const handleSystemChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {

    setSystemName(event.target.value);
  };

  const chartData = zscoreData
  ? (
      zscoreData.system
        ? zscoreData.z_score_by_system
        : zscoreData.z_score_consumption
    )
  : null;

  return (

    <section className={layoutStyles.mainPanel}>

      <section className={panelStyles.chartPanel}>

        <div className={panelStyles.panelHeader}>

          {mode === "zscore" &&
            "Z-Score Analysis Visualization"}

          {mode === "detection" &&
            "Detection Analysis Visualization"}

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

          <div className={panelStyles.chartGrid}></div>

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
            chartData && (

            <div
              style={{
                width: "100%",
                height: "320px"
              }}
            >

              <ZScoreChart
                data={chartData}
              />

            </div>

          )}

          {!loading &&
            !error &&
            mode !== "zscore" && (

            <span className={panelStyles.placeholderText}>
              Waiting for Anomaly execution...
            </span>

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
                  ? tabStyles.tabButtonActive
                  : tabStyles.tabButton
              }

              onClick={() => setMode("zscore")}
            >
              Z-Score
            </button>

            <button
              className={
                mode === "detection"
                  ? tabStyles.tabButtonActive
                  : tabStyles.tabButton
              }

              onClick={() => setMode("detection")}
            >
              Detection
            </button>

            <button
              className={
                mode === "classification"
                  ? tabStyles.tabButtonActive
                  : tabStyles.tabButton
              }

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
            Run {
              mode === "zscore"
                ? "Z-Score"
                : mode.charAt(0).toUpperCase() +
                  mode.slice(1)
            }
          </button>

          {executionMessage && (

            <div
              className={
                controlStyles.executionInfo
              }
            >

              <span>
                Detection execution status:
              </span>

              <strong>
                {executionMessage}
              </strong>

            </div>

          )}

        </div>

      </section>

    </section>
  );
}

export default AnomalyDetection;