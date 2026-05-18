

import styles from "./AnomalyDetection.module.css";

function AnomalyDetection() {
  return (
    <section className={styles.mainPanel}>

      <section className={styles.chartPanel}>

        <div className={styles.panelHeader}>
          Z-Score Visualization
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

            <button className={styles.tabButtonActive}>
              Z-Score
            </button>

            <button className={styles.tabButton}>
              Detection
            </button>

            <button className={styles.tabButton}>
              Classification
            </button>

          </div>

          <div className={styles.rangeInputs}>

            <div className={styles.inputGroup}>

              <input
                type="text"
                className={styles.input}
                placeholder="Select System"
              />

              <div className={styles.inputLabel}>
                System Name
              </div>

            </div>

          </div>

          <button className={styles.runButton}>
            Run Z-Score
          </button>

        </div>

      </section>

    </section>
  );
}

export default AnomalyDetection;