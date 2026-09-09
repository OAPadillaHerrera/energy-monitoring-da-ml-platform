

import {
  useEffect,
  useState
} from "react";

import {
  Activity,
  BarChart3,
  Building2,
  Cpu,
  Eye,
  Zap
} from "lucide-react";

import layoutStyles from "../../../components/shared/styles/layoutStyles.module.css";
import panelStyles from "../../../components/shared/styles/panelStyles.module.css";
import tabStyles from "../../../components/shared/styles/tabStyles.module.css";
import controlStyles from "../../../components/shared/styles/controlStyles.module.css";
import dashboardStyles from "../../Dashboard/Dashboard.module.css";
import kpiStyles from "../../../components/shared/styles/kpiStyles.module.css";
import api from "../../../services/api";
import BasicMetricsTable from "../../../components/tables/BasicMetricsTable";
import StationEnergyByHourChart from "../../../components/charts/StationEnergyByHourChart";
import SystemEnergyByHourChart from "../../../components/charts/SystemEnergyByHourChart";
import EnergySystemRankingPieChart from "../../../components/charts/EnergySystemRanlkingPieChart";
import EnergyLoadFactorTable from "../../../components/tables/EnergyLoadFactorTable";

type BasicMetricsData = {
  total_consumption: number;
  average_consumption: number;
  consumption_by_system: Record<string, number>;
};

type StationMetricsData = {
  total_energy: number;
  average_consumption: number;
  peak_consumption: number;
  min_consumption: number;
  std_consumption: number;
  avg_daily_energy: number;
  energy_by_hour: Record<string, number>;
  daily_energy: Record<string, number>;
};

type SystemMetricsData = {
  total_energy: number;
  average_consumption: number;
  peak_consumption: number;
  min_consumption: number;
  std_consumption: number;
  avg_daily_energy: number;
  avg_hourly_profile: Record<string, number>;
};

type EnergyMetricsData = {
  load_factor: number;
  load_factor_by_system: Record<string, number>;
  system_ranking: Record<string, number>;
};

function Metrics() {

  const [mode, setMode] = useState("basic");
  const [systemName, setSystemName] = useState("");
  const [systemNames, setSystemNames] =
    useState<string[]>([]);
  const [executionMessage, setExecutionMessage] = useState("");

  const [basicMetrics, setBasicMetrics] =
    useState<BasicMetricsData | null>(null);

  const [stationMetrics, setStationMetrics] =
    useState<StationMetricsData | null>(null);

  const [systemMetrics, setSystemMetrics] =
    useState<SystemMetricsData | null>(null);

  const [energyMetrics, setEnergyMetrics] =
    useState<EnergyMetricsData | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const fetchMetrics = async (): Promise<void> => {

      try {
        setLoading(true);
        setError(null);

        if (mode === "energy") {
          const response =
            await api.get("/metrics/energy");

          setEnergyMetrics(response.data);
        }

        if (mode === "system") {
          const response =
            await api.get("/metrics/basic");

          const systems =
            Object.keys(
              response.data.consumption_by_system
            );

          setSystemNames(systems);
        }

      } catch (error: any) {

        console.error(
          "Metrics data loading failed:",
          error
        );

      } finally {
        setLoading(false);
      }
    };

    void fetchMetrics();

  }, [mode]);

  const handleRunMetrics = async (): Promise<void> => {

    if (mode === "basic") {

      try {
        setLoading(true);
        setError(null);
        setExecutionMessage("");
        setBasicMetrics(null);

        const response =
          await api.get("/metrics/basic");

        setBasicMetrics(response.data);

        setExecutionMessage(
          "Basic Metrics loaded successfully."
        );

      } catch (error: any) {

        console.error(
          "Basic Metrics loading failed:",
          error
        );

        setBasicMetrics(null);

        setError(
          error?.response?.data?.message ||
          error.message ||
          "Basic Metrics loading failed."
        );

      } finally {
        setLoading(false);
      }

      return;
    }

    if (mode === "station") {

      try {
        setLoading(true);
        setError(null);
        setExecutionMessage("");
        setStationMetrics(null);

        const response =
          await api.get("/metrics/station");

        setStationMetrics(response.data);

        setExecutionMessage(
          "Station Metrics loaded successfully."
        );

      } catch (error: any) {

        console.error(
          "Station Metrics loading failed:",
          error
        );

        setStationMetrics(null);

        setError(
          error?.response?.data?.message ||
          error.message ||
          "Station Metrics loading failed."
        );

      } finally {
        setLoading(false);
      }

      return;
    }

    if (mode === "system") {

      if (!systemName.trim()) {
        setError("Please select a system.");
        setExecutionMessage("");
        setSystemMetrics(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setExecutionMessage("");
        setSystemMetrics(null);

        const response = await api.get(
          `/metrics/system?name=${encodeURIComponent(
            systemName.trim()
          )}`
        );

        setSystemMetrics(response.data);

        setExecutionMessage(
          "System Metrics loaded successfully."
        );

      } catch (error: any) {

        console.error(
          "System Metrics loading failed:",
          error
        );

        setSystemMetrics(null);

        setError(
          error?.response?.data?.message ||
          error.message ||
          "System Metrics loading failed."
        );

      } finally {
        setLoading(false);
      }

      return;
    }

    if (mode === "energy") {
      setExecutionMessage(
        "Energy Metrics executed successfully."
      );
    }
  };

  const currentModeLabel =
    mode.charAt(0).toUpperCase() + mode.slice(1);

  return (

    <>

      {mode === "basic" && (
        <div className={layoutStyles.sectionHeading}>
          <h2>Basic Metrics</h2>
          <span>Station-level metrics</span>
        </div>
      )}

      {mode === "station" && (
        <div className={layoutStyles.sectionHeading}>
          <h2>Station Metrics</h2>
          <span>
            Station energy consumption over time · Average values
          </span>
        </div>
      )}

      {mode === "system" && (
        <div className={layoutStyles.sectionHeading}>
          <h2>System Metrics</h2>
          <span>
            System energy consumption over time · Average values
          </span>
        </div>
      )}

      {mode === "basic" && basicMetrics && (
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
              {basicMetrics.total_consumption.toFixed(2)}

              <span className={kpiStyles.kpiUnit}>
                kWh
              </span>
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
              {basicMetrics.average_consumption.toFixed(2)}

              <span className={kpiStyles.kpiUnit}>
                kWh
              </span>
            </h2>

            <p className={kpiStyles.kpiDescription}>
              Average energy consumption
            </p>

          </div>

        </div>
      )}

      <section className={panelStyles.chartPanel}>

        <div className={panelStyles.panelHeader}>
          {mode === "basic" && "Energy Consumption by System"}
          {mode === "station" && "Station Energy Consumption by Hour"}
          {mode === "system" && "System Energy Consumption by Hour"}
          {mode === "energy" && "Energy Metrics Visualization"}
        </div>

        <div
          className={panelStyles.chartPlaceholder}
          style={{
            alignItems: "stretch",
            justifyContent: "flex-start"
          }}
        >

          <div className={panelStyles.chartGrid}></div>

          {error && (
            <span className={panelStyles.placeholderText}>
              Error: {error}
            </span>
          )}

          {!loading && !error && mode === "basic" && basicMetrics && (
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "18px"
              }}
            >

              <BasicMetricsTable
                data={basicMetrics.consumption_by_system}
              />

            </div>
          )}

          {!loading && !error && mode === "station" && stationMetrics && (
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "18px"
              }}
            >

              <div style={{ height: "260px", width: "100%" }}>
                <StationEnergyByHourChart
                  data={stationMetrics.energy_by_hour}
                />
              </div>

              <div className={dashboardStyles.kpiRow}>

                <div className={dashboardStyles.kpiCard}>
                  <span className={dashboardStyles.kpiLabel}>
                    Total Energy
                  </span>

                  <h2 className={dashboardStyles.kpiValue}>
                    {stationMetrics.total_energy.toFixed(2)} kWh
                  </h2>
                </div>

                <div className={dashboardStyles.kpiCard}>
                  <span className={dashboardStyles.kpiLabel}>
                    Avg Load
                  </span>

                  <h2 className={dashboardStyles.kpiValue}>
                    {stationMetrics.average_consumption.toFixed(2)} kWh
                  </h2>
                </div>

                <div className={dashboardStyles.kpiCard}>
                  <span className={dashboardStyles.kpiLabel}>
                    Peak Demand
                  </span>

                  <h2 className={dashboardStyles.kpiValue}>
                    {stationMetrics.peak_consumption.toFixed(2)} kWh
                  </h2>
                </div>

              </div>

              <div className={dashboardStyles.kpiRow}>

                <div className={dashboardStyles.kpiCard}>
                  <span className={dashboardStyles.kpiLabel}>
                    Min Consumption
                  </span>

                  <h2 className={dashboardStyles.kpiValue}>
                    {stationMetrics.min_consumption.toFixed(2)} kWh
                  </h2>
                </div>

                <div className={dashboardStyles.kpiCard}>
                  <span className={dashboardStyles.kpiLabel}>
                    Std Consumption
                  </span>

                  <h2 className={dashboardStyles.kpiValue}>
                    {stationMetrics.std_consumption.toFixed(2)}
                  </h2>
                </div>

                <div className={dashboardStyles.kpiCard}>
                  <span className={dashboardStyles.kpiLabel}>
                    Avg Daily Energy
                  </span>

                  <h2 className={dashboardStyles.kpiValue}>
                    {stationMetrics.avg_daily_energy.toFixed(2)} kWh
                  </h2>
                </div>

              </div>

            </div>
          )}

          {!loading && !error && mode === "system" && systemMetrics && (
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "18px"
              }}
            >

              <div style={{ height: "260px", width: "100%" }}>
                <SystemEnergyByHourChart
                  data={systemMetrics.avg_hourly_profile}
                  systemName={systemName}
                />
              </div>

              <div className={dashboardStyles.kpiRow}>

                <div className={dashboardStyles.kpiCard}>
                  <span className={dashboardStyles.kpiLabel}>
                    Total Energy
                  </span>

                  <h2 className={dashboardStyles.kpiValue}>
                    {systemMetrics.total_energy.toFixed(2)} kWh
                  </h2>
                </div>

                <div className={dashboardStyles.kpiCard}>
                  <span className={dashboardStyles.kpiLabel}>
                    Avg Load
                  </span>

                  <h2 className={dashboardStyles.kpiValue}>
                    {systemMetrics.average_consumption.toFixed(2)} kWh
                  </h2>
                </div>

                <div className={dashboardStyles.kpiCard}>
                  <span className={dashboardStyles.kpiLabel}>
                    Peak Demand
                  </span>

                  <h2 className={dashboardStyles.kpiValue}>
                    {systemMetrics.peak_consumption.toFixed(2)} kWh
                  </h2>
                </div>

              </div>

            </div>
          )}

          {!loading && !error && mode === "energy" && energyMetrics && (

            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "18px"
              }}
            >

              <div style={{ height: "320px", width: "100%" }}>
                <EnergySystemRankingPieChart
                  data={energyMetrics.system_ranking}
                />
              </div>

              <div className={dashboardStyles.kpiRow}>

                <div className={dashboardStyles.kpiCard}>

                  <span className={dashboardStyles.kpiLabel}>
                    Load Factor
                  </span>

                  <h2 className={dashboardStyles.kpiValue}>
                    {(energyMetrics.load_factor * 100).toFixed(1)}%
                  </h2>

                </div>

              </div>

              <EnergyLoadFactorTable
                data={energyMetrics.load_factor_by_system}
              />

            </div>
          )}

        </div>

      </section>

      <section className={panelStyles.controlPanel}>

        <div className={panelStyles.panelHeader}>
          Metrics Configuration
        </div>

        <div className={controlStyles.controlContent}>

          <div className={tabStyles.tabs}>

            <button
              className={
                mode === "basic"
                  ? tabStyles.damlTabButtonActive
                  : tabStyles.damlTabButton
              }
              onClick={() => setMode("basic")}
            >
              <BarChart3
                className={tabStyles.damlTabIcon}
              />
              Basic
            </button>

            <button
              className={
                mode === "station"
                  ? tabStyles.damlTabButtonActive
                  : tabStyles.damlTabButton
              }
              onClick={() => setMode("station")}
            >
              <Building2
                className={tabStyles.damlTabIcon}
              />
              Station
            </button>

            <button
              className={
                mode === "system"
                  ? tabStyles.damlTabButtonActive
                  : tabStyles.damlTabButton
              }
              onClick={() => setMode("system")}
            >
              <Cpu
                className={tabStyles.damlTabIcon}
              />
              System
            </button>

            <button
              className={
                mode === "energy"
                  ? tabStyles.damlTabButtonActive
                  : tabStyles.damlTabButton
              }
              onClick={() => setMode("energy")}
            >
              <Zap
                className={tabStyles.damlTabIcon}
              />
              Energy
            </button>

          </div>

          {mode === "system" && (
            <div className={controlStyles.rangeInputs}>
              <div className={controlStyles.inputGroup}>

                <select
                  className={`${controlStyles.input} ${controlStyles.systemSelect}`}
                  value={systemName}
                  onChange={(event) =>
                    setSystemName(event.target.value)
                  }
                >
                  <option value="">
                    Select System
                  </option>

                  {systemNames.map((name) => (
                    <option
                      key={name}
                      value={name}
                    >
                      {name}
                    </option>
                  ))}
                </select>

                <div className={controlStyles.inputLabel}>
                  System Name
                </div>

              </div>
            </div>
          )}

          <button
            type="button"
            className={`${controlStyles.damlViewButton} ${
              loading
                ? controlStyles.damlViewButtonLoading
                : ""
            }`}
            onClick={handleRunMetrics}
            disabled={loading}
          >
            <Eye
              className={`${controlStyles.damlViewButtonIcon} ${
                loading
                  ? controlStyles.damlViewButtonIconLoading
                  : ""
              }`}
            />

            {
              loading
                ? `Loading ${currentModeLabel}...`
                : `View ${currentModeLabel}`
            }
          </button>

          {executionMessage && (
            <div className={controlStyles.executionInfo}>
              <span>Status:</span>
              <strong>{executionMessage}</strong>
            </div>
          )}

        </div>

      </section>

    </>
  );
}

export default Metrics;







