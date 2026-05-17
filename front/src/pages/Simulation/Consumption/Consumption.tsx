

import styles from "./Consumption.module.css";

function Consumption() {
  return (
    <section className={styles.mainPanel}>

      <section className={styles.chartPanel}>
        <div className={styles.panelHeader}>
          Total Station Energy Consumption
        </div>

        <div className={styles.chartPlaceholder}>
          <div className={styles.chartGrid}></div>

          <span className={styles.placeholderText}>
            Waiting for Simulation execution...
          </span>
        </div>
      </section>

      <section className={styles.controlPanel}>
        <div className={styles.panelHeader}>
          Simulation Configuration
        </div>

        <div className={styles.controlContent}>

          <div className={styles.modeSelector}>
            <button className={styles.tabButtonActive}>
              Daily Simulation
            </button>

            <button className={styles.tabButton}>
              Range Simulation
            </button>
          </div>

          <div className={styles.rangeInputs}>
            <div className={styles.inputGroup}>
              <input className={styles.input} placeholder="yyyy/mm/dd" />
              <div className={styles.inputLabel}>Start Date</div>
            </div>

            <div className={styles.inputGroup}>
              <input className={styles.input} placeholder="yyyy/mm/dd" />
              <div className={styles.inputLabel}>End Date</div>
            </div>
          </div>

          <button className={styles.runButton}>
            Run Simulation
          </button>

        </div>
      </section>

    </section>
  );
}

export default Consumption;