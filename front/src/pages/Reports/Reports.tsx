

import styles from "./Reports.module.css";

function Reports() {
  return (
    <section className={styles.container}>
      <div className={styles.overlay}></div>

      <section className={styles.mainPanel}>

        <div className={styles.tabs}>

          <button className={styles.tabButtonActive}>
            Simulation
          </button>

          <button className={styles.tabButton}>
            DA/ML
          </button>

        </div>

        <div className={styles.subTabs}>

          <button className={styles.tabButtonActive}>
            Hourly Data
          </button>

          <button className={styles.tabButton}>
            Event Records
          </button>

          <button className={styles.tabButton}>
            Daily Totals
          </button>

          <button className={styles.tabButton}>
            Voltage Records
          </button>

        </div>

        <section className={styles.chartPanel}>

          <div className={styles.panelHeader}>
            Hourly Energy Consumption Report
          </div>

          <div className={styles.chartPlaceholder}>

            <div className={styles.chartGrid}></div>

            <span className={styles.placeholderText}>
              Waiting for report generation...
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
    </section>
  );
}

export default Reports;