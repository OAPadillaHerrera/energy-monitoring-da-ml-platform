

import { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import layoutStyles from "../../components/shared/styles/layoutStyles.module.css";
import panelStyles from "../../components/shared/styles/panelStyles.module.css";
import ConsumptionChart from "../../components/charts/ConsumptionChart";

function Dashboard() {

  const [data, setData] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    fetch("http://localhost:5001/metrics/basic")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error: ${res.status}`);
        }
        return res.json();
      })
      .then((json) => {

        console.log("API RESPONSE:", json);

        const hourly = json?.consumption_by_hour;

        if (!hourly || Object.keys(hourly).length === 0) {
          throw new Error("consumption_by_hour is empty or missing");
        }

        setData(hourly);
      })
      .catch((err) => {
        console.error("Error loading metrics:", err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });

  }, []);

  return (
    <section className={layoutStyles.mainPanel}>

      <section className={panelStyles.chartPanel}>

        <div className={panelStyles.panelHeader}>
          Total Station Energy Consumption
        </div>

        <div className={panelStyles.chartPlaceholder}>

          <div className={panelStyles.chartGrid}></div>

          {loading && (
            <span className={panelStyles.placeholderText}>
              Loading consumption data...
            </span>
          )}

          {error && (
            <span className={panelStyles.placeholderText}>
              Error: {error}
            </span>
          )}

          {!loading && !error && data && Object.keys(data).length > 0 && (
            <ConsumptionChart data={data} />
          )}

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
  );
}

export default Dashboard;