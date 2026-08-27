

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
  type LucideIcon,
} from "lucide-react";

type DashboardSummary = {
  total_consumption: number;
  average_consumption: number;
  peak_demand: number;
  load_factor: number;
  consumption_by_system: Record<string, number>;
};

type DashboardKpi = {
  label: string;
  description: string;
  icon: LucideIcon;
  iconClass: string;
  getValue: (summary: DashboardSummary) => string;
  unit: string;
};

const DASHBOARD_KPIS: DashboardKpi[] = [
  {
    label: "Total Consumption",
    description: "Total energy consumed",
    icon: Zap,
    iconClass: kpiStyles.kpiIconConsumption,
    getValue: (summary) =>
      summary.total_consumption.toFixed(2),
    unit: "kWh",
  },
  {
    label: "Average Consumption",
    description: "Average energy consumption",
    icon: Activity,
    iconClass: kpiStyles.kpiIconAverage,
    getValue: (summary) =>
      summary.average_consumption.toFixed(2),
    unit: "kWh",
  },
  {
    label: "Peak Demand",
    description: "Maximum recorded demand",
    icon: TrendingUp,
    iconClass: kpiStyles.kpiIconPeak,
    getValue: (summary) =>
      summary.peak_demand.toFixed(2),
    unit: "kW",
  },
  {
    label: "Load Factor",
    description: "Average / peak demand",
    icon: Gauge,
    iconClass: kpiStyles.kpiIconLoadFactor,
    getValue: (summary) =>
      (summary.load_factor * 100).toFixed(0),
    unit: "%",
  },
];

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
            await api.get<DashboardSummary>(
              "/dashboard/summary"
            );

          const dashboardData =
            response.data;

          if (
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
        } catch (error: unknown) {
          console.error(
            "Error loading dashboard summary:",
            error
          );

          setError(
            error instanceof Error
              ? error.message
              : "Failed to load dashboard summary"
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

        {DASHBOARD_KPIS.map((kpi) => {

          const Icon = kpi.icon;

          return (
            <div
              key={kpi.label}
              className={kpiStyles.kpiCard}
            >

              <div className={kpiStyles.kpiHeader}>

                <Icon
                  className={`${kpiStyles.kpiIcon} ${kpi.iconClass}`}
                />

                <span className={kpiStyles.kpiLabel}>
                  {kpi.label}
                </span>

              </div>

              <h2 className={kpiStyles.kpiValue}>

                {summary ? (
                  <>
                    {kpi.getValue(summary)}

                    <span className={kpiStyles.kpiUnit}>
                      {kpi.unit}
                    </span>
                  </>
                ) : (
                  "--"
                )}

              </h2>

              <p className={kpiStyles.kpiDescription}>
                {kpi.description}
              </p>

            </div>
          );
        })}

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