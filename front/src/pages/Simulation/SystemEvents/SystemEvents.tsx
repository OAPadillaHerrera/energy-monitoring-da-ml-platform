

import styles from "./SystemEvents.module.css";

function SystemEvents() {
  return (
    <section className={styles.mainPanel}>

      <section className={styles.chartPanel}>

        <div className={styles.panelHeader}>
          System Event Records
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

export default SystemEvents;