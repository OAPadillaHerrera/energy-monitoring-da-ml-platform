

import { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import layoutStyles from "../../components/shared/styles/layoutStyles.module.css";
import panelStyles from "../../components/shared/styles/panelStyles.module.css";
import ConsumptionChart from "../../components/charts/SystemConsumptionChart";
import api from "../../services/api";

type DashboardSummary = {

  total_consumption: number;

  average_consumption: number;

  peak_demand: number;

  load_factor: number;

  consumption_by_system: Record<string, number>;
};

function Dashboard() {

  const [summary, setSummary] =
    useState<DashboardSummary | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {

    api
      .get("/dashboard/summary")

      .then((response) => {

        console.log(
          "DASHBOARD RESPONSE:",
          response.data
        );

        const dashboardData = response.data;

        if (
          !dashboardData?.consumption_by_system ||
          Object.keys(
            dashboardData.consumption_by_system
          ).length === 0
        ) {

          throw new Error(
            "consumption_by_system is empty or missing"
          );
        }

        setSummary(dashboardData);
      })

      .catch((error) => {

        console.error(
          "Error loading dashboard summary:",
          error
        );

        setError(
          error.message ||
          "Failed to load dashboard summary"
        );
      })

      .finally(() => {

        setLoading(false);
      });

  }, []);

  return (

    <section className={layoutStyles.mainPanel}>

      <section className={panelStyles.chartPanel}>

        <div className={panelStyles.panelHeader}>
          Energy Consumption by System
        </div>

        <div className={panelStyles.chartPlaceholder}>

          <div className={panelStyles.chartGrid}></div>

          {
            loading && (

              <span className={panelStyles.placeholderText}>
                Loading dashboard data...
              </span>

            )
          }

          {
            error && (

              <span className={panelStyles.placeholderText}>
                Error: {error}
              </span>

            )
          }

          {
            !loading &&
            !error &&
            summary &&
            Object.keys(
              summary.consumption_by_system
            ).length > 0 && (

              <ConsumptionChart
                data={
                  summary.consumption_by_system
                }
              />

            )
          }

        </div>

      </section>

      <div className={styles.kpiRow}>

        <div className={styles.kpiCard}>

          <span className={styles.kpiLabel}>
            Total Consumption
          </span>

          <h2 className={styles.kpiValue}>

            {
              summary
                ? `${summary.total_consumption.toFixed(2)} kWh`
                : "--"
            }

          </h2>

        </div>

        <div className={styles.kpiCard}>

          <span className={styles.kpiLabel}>
            Average Consumption
          </span>

          <h2 className={styles.kpiValue}>

            {
              summary
                ? `${summary.average_consumption.toFixed(2)} kWh`
                : "--"
            }

          </h2>

        </div>

        <div className={styles.kpiCard}>

          <span className={styles.kpiLabel}>
            Peak Demand
          </span>

          <h2 className={styles.kpiValue}>

            {
              summary
                ? `${summary.peak_demand.toFixed(2)} kWh`
                : "--"
            }

          </h2>

        </div>

        <div className={styles.kpiCard}>

          <span className={styles.kpiLabel}>
            Load Factor
          </span>

          <h2 className={styles.kpiValue}>

            {
              summary
                ? summary.load_factor.toFixed(2)
                : "--"
            }

          </h2>

        </div>

      </div>

    </section>

  );
}

export default Dashboard;