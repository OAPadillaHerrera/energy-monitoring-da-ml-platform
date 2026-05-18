

import styles from "./DAML.module.css";

function DAML() {
  return (
    <section className={styles.mainPanel}>

      <div className={styles.subTabs}>

        <button className={styles.subTabButtonActive}>
          Metrics
        </button>

        <button className={styles.subTabButton}>
          Anomaly 
        </button>

        <button className={styles.subTabButton}>
          ML
        </button>

      </div>

      <section className={styles.chartPanel}>

        <div className={styles.panelHeader}>
          Metrics Report
        </div>

        <div className={styles.chartPlaceholder}>

          <div className={styles.chartGrid}></div>

          <span className={styles.placeholderText}>
            Waiting for Report generation...
          </span>

        </div>

      </section>

      <section className={styles.controlPanel}>

        <div className={styles.panelHeader}>
          Report Configuration
        </div>

        <div className={styles.controlContent}>

          <div className={styles.modeSelector}>

            <button className={styles.tabButtonActive}>
              Chart View
            </button>

            <button className={styles.tabButton}>
              Table View
            </button>

          </div>

          <div className={styles.modeSelector}>

            <button className={styles.exportButton}>
              Export CSV
            </button>

            <button className={styles.exportButton}>
              Export PDF
            </button>

          </div>

        </div>

      </section>

    </section>
  );
}

export default DAML;