

import { type ChangeEvent, useState } from "react";
import styles from "./Metrics.module.css";

function Metrics() {

  const [mode, setMode] = useState("basic");

  const [systemName, setSystemName] = useState("");

  const [executionMessage, setExecutionMessage] = useState("");

  const handleRunMetrics = (): void => {

    if (mode === "basic") {

      setExecutionMessage(
        "Basic metrics executed successfully."
      );
    }

    if (mode === "station") {

      setExecutionMessage(
        "Station metrics executed successfully."
      );
    }

    if (mode === "system") {

      if (!systemName.trim()) {

        setExecutionMessage(
          "Please provide a valid system name."
        );

        return;
      }

      setExecutionMessage(
        `System metrics executed for ${systemName}.`
      );
    }

    if (mode === "energy") {

      setExecutionMessage(
        "Energy metrics executed successfully."
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
            mode === "basic" &&
            "Basic Metrics Visualization"
          }

          {
            mode === "station" &&
            "Station Metrics Visualization"
          }

          {
            mode === "system" &&
            "System Metrics Visualization"
          }

          {
            mode === "energy" &&
            "Energy Metrics Visualization"
          }

        </div>

        <div className={styles.chartPlaceholder}>

          <div className={styles.chartGrid}></div>

          <span className={styles.placeholderText}>
            Waiting for Metrics execution...
          </span>

        </div>

      </section>

      <section className={styles.controlPanel}>

        <div className={styles.panelHeader}>
          Metrics Configuration
        </div>

        <div className={styles.controlContent}>

          <div className={styles.modeSelector}>

            <button
              className={
                mode === "basic"
                  ? styles.tabButtonActive
                  : styles.tabButton
              }

              onClick={() => setMode("basic")}
            >
              Basic
            </button>

            <button
              className={
                mode === "station"
                  ? styles.tabButtonActive
                  : styles.tabButton
              }

              onClick={() => setMode("station")}
            >
              Station
            </button>

            <button
              className={
                mode === "system"
                  ? styles.tabButtonActive
                  : styles.tabButton
              }

              onClick={() => setMode("system")}
            >
              System
            </button>

            <button
              className={
                mode === "energy"
                  ? styles.tabButtonActive
                  : styles.tabButton
              }

              onClick={() => setMode("energy")}
            >
              Energy
            </button>

          </div>

          {
            mode === "system" && (

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

            )
          }

          <button
            className={styles.runButton}

            onClick={handleRunMetrics}
          >
            Run {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>

          {
            executionMessage && (

              <div className={styles.executionInfo}>

                <span>
                  Metrics execution status:
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

export default Metrics;