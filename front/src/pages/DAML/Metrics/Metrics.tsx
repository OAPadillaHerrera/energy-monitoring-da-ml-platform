

import styles from "./Metrics.module.css";

function Metrics() {
  return (
    <section className={styles.mainPanel}>

      <section className={styles.chartPanel}>
        <div className={styles.panelHeader}>
          Basic Metrics Visualization
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

            <button className={styles.tabButtonActive}>
              Basic
            </button>

            <button className={styles.tabButton}>
              Station
            </button>

            <button className={styles.tabButton}>
              System
            </button>

            <button className={styles.tabButton}>
              Energy
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
            Run Basic
          </button>

        </div>
      </section>

    </section>
  );
}

export default Metrics;