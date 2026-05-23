

import { type ChangeEvent, useState } from "react";
import styles from "./AnomalyDetection.module.css";
import panelStyles from "../../../components/shared/styles/panelStyles.module.css";
import tabStyles from "../../../components/shared/styles/tabStyles.module.css";
import controlStyles from "../../../components/shared/styles/controlStyles.module.css";

function AnomalyDetection() {

  const [mode, setMode] = useState("zscore");
  const [systemName, setSystemName] = useState("");
  const [executionMessage, setExecutionMessage] = useState("");

  const handleRunDetection = (): void => {

    if (!systemName.trim()) {
      setExecutionMessage("Please provide a valid system name.");
      return;
    }

    if (mode === "zscore") {
      setExecutionMessage(`Z-Score Analysis executed for ${systemName}.`);
    }

    if (mode === "detection") {
      setExecutionMessage(`Detection Analysis executed for ${systemName}.`);
    }

    if (mode === "classification") {
      setExecutionMessage(`Classification Analysis executed for ${systemName}.`);
    }
  };

  const handleSystemChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSystemName(event.target.value);
  };

  return (
    <section className={styles.mainPanel}>

      <section className={panelStyles.chartPanel}>

        <div className={panelStyles.panelHeader}>
          {mode === "zscore" && "Z-Score Analysis Visualization"}
          {mode === "detection" && "Detection Analysis Visualization"}
          {mode === "classification" && "Classification Analysis Visualization"}
        </div>

        <div className={panelStyles.chartPlaceholder}>
          <div className={panelStyles.chartGrid}></div>

          <span className={panelStyles.placeholderText}>
            Waiting for Anomaly execution...
          </span>
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
                placeholder="Select System"
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
                : mode.charAt(0).toUpperCase() + mode.slice(1)
            }
          </button>

          {executionMessage && (
            <div className={controlStyles.executionInfo}>
              <span>Detection execution status:</span>
              <strong>{executionMessage}</strong>
            </div>
          )}

        </div>

      </section>

    </section>
  );
}

export default AnomalyDetection;