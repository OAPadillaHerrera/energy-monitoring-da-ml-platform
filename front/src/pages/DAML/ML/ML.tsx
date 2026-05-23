

import { type ChangeEvent, useState } from "react";
import styles from "./ML.module.css";
import panelStyles from "../../../components/shared/styles/panelStyles.module.css";
import tabStyles from "../../../components/shared/styles/tabStyles.module.css";
import controlStyles from "../../../components/shared/styles/controlStyles.module.css";

function ML() {

  const [systemName, setSystemName] = useState("");
  const [executionMessage, setExecutionMessage] = useState("");

  const handleRunPipeline = (): void => {

    if (!systemName.trim()) {
      setExecutionMessage("Please provide a valid system name.");
      return;
    }

    setExecutionMessage(
      `Root Cause Pipeline executed for ${systemName}.`
    );
  };

  const handleSystemChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSystemName(event.target.value);
  };

  return (

    <section className={styles.mainPanel}>

      <section className={panelStyles.chartPanel}>

        <div className={panelStyles.panelHeader}>
          Root Cause Pipeline Visualization
        </div>

        <div className={panelStyles.chartPlaceholder}>
          <div className={panelStyles.chartGrid}></div>

          <span className={panelStyles.placeholderText}>
            Waiting for ML execution...
          </span>
        </div>

      </section>

      <section className={controlStyles.controlContent}>

        <div className={panelStyles.panelHeader}>
          ML Configuration
        </div>

        <div className={tabStyles.tabs}>

          <span className={styles.pipelineLabel}>
            Root Cause Pipeline
          </span>

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
          onClick={handleRunPipeline}
        >
          Run Root Cause Pipeline
        </button>

        {executionMessage && (
          <div className={controlStyles.executionInfo}>
            <span>ML execution status:</span>
            <strong>{executionMessage}</strong>
          </div>
        )}

      </section>

    </section>
  );
}

export default ML;