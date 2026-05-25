

import styles from "./Dashboard.module.css";
import layoutStyles from "../../components/shared/styles/layoutStyles.module.css";
import panelStyles from "../../components/shared/styles/panelStyles.module.css";

function Dashboard() {
  return (
    <section className={layoutStyles.mainPanel}>

      <section className={panelStyles.chartPanel}>

        <div className={panelStyles.panelHeader}>
          Total Station Energy Consumption
        </div>

        <div className={panelStyles.chartPlaceholder}>

          <div className={panelStyles.chartGrid}></div>

          <span className={panelStyles.placeholderText}>
            Waiting for simulation data...
          </span>

        </div>

      </section>

      <div className={styles.kpiRow}>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>
            Total Consumption
          </span>

          <h2 className={styles.kpiValue}>--</h2>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>
            Peak Demand
          </span>

          <h2 className={styles.kpiValue}>--</h2>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>
            Active Systems
          </span>

          <h2 className={styles.kpiValue}>--</h2>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>
            Alert Status
          </span>

          <h2 className={styles.kpiValue}>--</h2>
        </div>

      </div>

    </section>
  );
}

export default Dashboard;