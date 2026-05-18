

import styles from "./Dashboard.module.css";

function Dashboard() {
  return (
    <section className={styles.container}>

      <div className={styles.overlay}></div>

      <section className={styles.pageHeader}></section>

      <section className={styles.mainPanel}>

        <section className={styles.chartPanel}>

          <div className={styles.panelHeader}>
            Total Station Energy Consumption
          </div>

          <div className={styles.chartPlaceholder}>

            <div className={styles.chartGrid}></div>

            <span className={styles.placeholderText}>
              Waiting for simulation data...
            </span>

          </div>

        </section>

        <div className={styles.kpiRow}>

          <div className={styles.kpiCard}>
            <span className={styles.kpiLabel}>Total Consumption</span>
            <h2 className={styles.kpiValue}>--</h2>
          </div>

          <div className={styles.kpiCard}>
            <span className={styles.kpiLabel}>Peak Demand</span>
            <h2 className={styles.kpiValue}>--</h2>
          </div>

          <div className={styles.kpiCard}>
            <span className={styles.kpiLabel}>Active Systems</span>
            <h2 className={styles.kpiValue}>--</h2>
          </div>

          <div className={styles.kpiCard}>
            <span className={styles.kpiLabel}>Alert Status</span>
            <h2 className={styles.kpiValue}>--</h2>
          </div>

        </div>

      </section>

    </section>
  );
}

export default Dashboard;