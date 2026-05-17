

import styles from "./Voltage.module.css";

function Voltage() {
  return (
    <section className={styles.mainPanel}>

      <section className={styles.chartPanel}>

        <div className={styles.panelHeader}>
          Voltage Monitoring Records
        </div>

        <div className={styles.chartPlaceholder}>
          <div className={styles.chartGrid}></div>

          <span className={styles.placeholderText}>
            Waiting for Simulation execution...
          </span>
        </div>

      </section>

    </section>
  );
}

export default Voltage;