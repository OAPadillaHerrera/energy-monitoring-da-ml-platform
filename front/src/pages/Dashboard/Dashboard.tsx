

import { useEffect, useState } from "react";
import layoutStyles from "../../components/shared/styles/layoutStyles.module.css";
import panelStyles from "../../components/shared/styles/panelStyles.module.css";
import tabStyles from "../../components/shared/styles/tabStyles.module.css";
import chipStyles from "../../components/shared/styles/chipStyles.module.css";
import kpiStyles from "../../components/shared/styles/kpiStyles.module.css";
import ConsumptionChart from "../../components/charts/SystemConsumptionChart";
import api from "../../services/api";
import {
  Activity,
  BarChart,
  Gauge,
  TrendingUp,
  Zap,
} from "lucide-react";

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

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard =
      async (): Promise<void> => {
        try {
          setLoading(true);
          setError(null);

          const response =
            await api.get(
              "/dashboard/summary"
            );

          const dashboardData =
            response.data;

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

          setSummary(
            dashboardData
          );
        } catch (error: any) {
          console.error(
            "Error loading dashboard summary:",
            error
          );

          setError(
            error.message ??
              "Failed to load dashboard summary"
          );
        } finally {
          setLoading(false);
        }
      };

    void fetchDashboard();
  }, []);

  return (
    <section className={layoutStyles.mainPanel}>

      <div className={tabStyles.tabs}>
        <span className={chipStyles.chipPrimary}>
          <BarChart
            className={chipStyles.chipIcon}
          />
          Overview
        </span>
      </div>

      <div className={layoutStyles.sectionHeading}>
        <h1>DA/ML Metrics</h1>
        <span>Station-level metrics</span>
      </div>

      <div className={kpiStyles.kpiRow}>

        <div className={kpiStyles.kpiCard}>
          <div className={kpiStyles.kpiHeader}>
            <Zap
              className={`${kpiStyles.kpiIcon} ${kpiStyles.kpiIconConsumption}`}
            />

            <span className={kpiStyles.kpiLabel}>
              Total Consumption
            </span>
          </div>

          <h2 className={kpiStyles.kpiValue}>
            {summary
              ? `${summary.total_consumption.toFixed(2)} kWh`
              : "--"}
          </h2>

          <p className={kpiStyles.kpiDescription}>
            Total energy consumed
          </p>

        </div>

        <div className={kpiStyles.kpiCard}>
          <div className={kpiStyles.kpiHeader}>
            <Activity
              className={`${kpiStyles.kpiIcon} ${kpiStyles.kpiIconAverage}`}
            />

            <span className={kpiStyles.kpiLabel}>
              Average Consumption
            </span>
          </div>

          <h2 className={kpiStyles.kpiValue}>
            {summary
              ? `${summary.average_consumption.toFixed(2)} kWh`
              : "--"}
          </h2>

          <p className={kpiStyles.kpiDescription}>
            Average energy consumption
          </p>

        </div>

        <div className={kpiStyles.kpiCard}>
          <div className={kpiStyles.kpiHeader}>
            <TrendingUp
              className={`${kpiStyles.kpiIcon} ${kpiStyles.kpiIconPeak}`}
            />

            <span className={kpiStyles.kpiLabel}>
              Peak Demand
            </span>
          </div>

          <h2 className={kpiStyles.kpiValue}>
            {summary
              ? `${summary.peak_demand.toFixed(2)} kW`
              : "--"}
          </h2>

          <p className={kpiStyles.kpiDescription}>
            Maximum recorded demand
          </p>

        </div>

        <div className={kpiStyles.kpiCard}>
          <div className={kpiStyles.kpiHeader}>
            <Gauge
              className={`${kpiStyles.kpiIcon} ${kpiStyles.kpiIconLoadFactor}`}
            />

            <span className={kpiStyles.kpiLabel}>
              Load Factor
            </span>
          </div>

          <h2 className={kpiStyles.kpiValue}>
            {summary
              ? summary.load_factor.toFixed(2)
              : "--"}
          </h2>

          <p className={kpiStyles.kpiDescription}>
            Average / peak demand
          </p>

        </div>

      </div>

      <section className={panelStyles.chartPanel}>

        <div className={panelStyles.panelHeader}>
          Energy Consumption by System
        </div>

        <div className={panelStyles.chartPlaceholder}>

          <div
            className={
              panelStyles.chartGrid
            }
          />

          {loading && (
            <span
              className={
                panelStyles.placeholderText
              }
            >
              Loading dashboard data...
            </span>
          )}

          {error && (
            <span
              className={
                panelStyles.placeholderText
              }
            >
              Error: {error}
            </span>
          )}

          {!loading &&
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
            )}

        </div>

      </section>

    </section>
  );
}

export default Dashboard;