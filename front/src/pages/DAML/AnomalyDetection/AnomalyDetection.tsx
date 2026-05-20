

import { type ChangeEvent, useState } from "react";
import styles from "./AnomalyDetection.module.css";

function AnomalyDetection() {

  const [mode, setMode] = useState("zscore");

  const [systemName, setSystemName] = useState("");

  const [executionMessage, setExecutionMessage] = useState("");

  const handleRunDetection = (): void => {

    if (!systemName.trim()) {

      setExecutionMessage(
        "Please provide a valid system name."
      );

      return;
    }

    if (mode === "zscore") {

      setExecutionMessage(
        `Z-Score Analysis executed for ${systemName}.`
      );
    }

    if (mode === "detection") {

      setExecutionMessage(
        `Detection Analysis executed for ${systemName}.`
      );
    }

    if (mode === "classification") {

      setExecutionMessage(
        `Classification Analysis executed for ${systemName}.`
      );
    }
  };

  const handleSystemChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {

    setSystemName(event.target.value);
  };

  return (

    <section className={styles.mainPanel}>

      <section className={styles.chartPanel}>

        <div className={styles.panelHeader}>

          {
            mode === "zscore" &&
            "Z-Score Visualization"
          }

          {
            mode === "detection" &&
            "Detection Visualization"
          }

          {
            mode === "classification" &&
            "Classification Visualization"
          }

        </div>

        <div className={styles.chartPlaceholder}>

          <div className={styles.chartGrid}></div>

          <span className={styles.placeholderText}>
            Waiting for Detection execution...
          </span>

        </div>

      </section>

      <section className={styles.controlPanel}>

        <div className={styles.panelHeader}>
          Detection Configuration
        </div>

        <div className={styles.controlContent}>

          <div className={styles.modeSelector}>

            <button
              className={
                mode === "zscore"
                  ? styles.tabButtonActive
                  : styles.tabButton
              }

              onClick={() => setMode("zscore")}
            >
              Z-Score
            </button>

            <button
              className={
                mode === "detection"
                  ? styles.tabButtonActive
                  : styles.tabButton
              }

              onClick={() => setMode("detection")}
            >
              Detection
            </button>

            <button
              className={
                mode === "classification"
                  ? styles.tabButtonActive
                  : styles.tabButton
              }

              onClick={() => setMode("classification")}
            >
              Classification
            </button>

          </div>

          <div className={styles.rangeInputs}>

            <div className={styles.inputGroup}>

              <input
                type="text"

                className={styles.input}

                placeholder="Select System"

                value={systemName}

                onChange={handleSystemChange}
              />

              <div className={styles.inputLabel}>
                System Name
              </div>

            </div>

          </div>

          <button
            className={styles.runButton}

            onClick={handleRunDetection}
          >
            Run {
              mode === "zscore"
                ? "Z-Score"
                : mode.charAt(0).toUpperCase() + mode.slice(1)
            }
          </button>

          {
            executionMessage && (

              <div className={styles.executionInfo}>

                <span>
                  Detection execution status:
                </span>

                <strong>
                  {executionMessage}
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