

import { type ChangeEvent, useState } from "react";
import styles from "./ML.module.css";

function ML() {

  const [systemName, setSystemName] = useState("");

  const [executionMessage, setExecutionMessage] = useState("");

  const handleRunPipeline = (): void => {

    if (!systemName.trim()) {

      setExecutionMessage(
        "Please provide a valid system name."
      );

      return;
    }

    setExecutionMessage(
      `Root Cause Pipeline executed for ${systemName}.`
    );
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
          Root Cause Pipeline Visualization
        </div>

        <div className={styles.chartPlaceholder}>

          <div className={styles.chartGrid}></div>

          <span className={styles.placeholderText}>
            Waiting for ML execution...
          </span>

        </div>

      </section>

      <section className={styles.controlPanel}>

        <div className={styles.panelHeader}>
          ML Configuration
        </div>

        <div className={styles.controlContent}>

          <div className={styles.modeSelector}>

            <span className={styles.pipelineLabel}>
              Root Cause Pipeline
            </span>

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

            onClick={handleRunPipeline}
          >
            Run Root Cause Pipeline
          </button>

          {
            executionMessage && (

              <div className={styles.executionInfo}>

                <span>
                  ML execution status:
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

export default ML;