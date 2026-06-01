

import {
  type ChangeEvent,
  useEffect,
  useState
} from "react";

import layoutStyles from "../../../components/shared/styles/layoutStyles.module.css";
import panelStyles from "../../../components/shared/styles/panelStyles.module.css";
import tabStyles from "../../../components/shared/styles/tabStyles.module.css";
import controlStyles from "../../../components/shared/styles/controlStyles.module.css";
import dashboardStyles from "../../Dashboard/Dashboard.module.css";
import api from "../../../services/api";
import BasicMetricsTable from "../../../components/tables/BasicMetricsTable";
import StationEnergyByHourChart from "../../../components/charts/StationEnergyByHourChart";
import SystemEnergyByHourChart from "../../../components/charts/SystemEnergyByHourChart";

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

function Metrics() {

  const [mode, setMode] = useState("basic");
  const [systemName, setSystemName] = useState("");
  const [executionMessage, setExecutionMessage] = useState("");

  const [basicMetrics, setBasicMetrics] =
    useState<BasicMetricsData | null>(null);

  const [stationMetrics, setStationMetrics] =
    useState<StationMetricsData | null>(null);

  const [systemMetrics, setSystemMetrics] =
    useState<SystemMetricsData | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

  const fetchMetrics = async (): Promise<void> => {

    try {
      setLoading(true);
      setError(null);

      if (mode === "basic") {
        const response = await api.get("/metrics/basic");
        setBasicMetrics(response.data);
      }

      if (mode === "station") {
        const response = await api.get("/metrics/station");
        setStationMetrics(response.data);
      }
      
      if (mode === "system" && systemName.trim()) {
        const response = await api.get(
          `/metrics/system?name=${systemName}`
        );

        setSystemMetrics(response.data);
      }      

    } catch (error: any) {
      
    } finally {
      setLoading(false);
    }
  };

  void fetchMetrics();

}, [mode, systemName]);

  const handleRunMetrics = async (): Promise<void> => {

    if (mode === "basic") {
      setExecutionMessage("Basic Metrics executed successfully.");
    }

    if (mode === "station") {
      setExecutionMessage("Station Metrics executed successfully.");
    }

    if (mode === "system" && systemName.trim()) {
      const response = await api.get(
        `/metrics/system?name=${systemName}`
      );

      setSystemMetrics(response.data);
    }

    if (mode === "energy") {
      setExecutionMessage("Energy Metrics executed successfully.");
    }
  };

  const handleSystemChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSystemName(event.target.value);
  };

  return (

    <section className={layoutStyles.mainPanel}>

      <section className={panelStyles.chartPanel}>

        <div className={panelStyles.panelHeader}>
          {mode === "basic" && "Basic Metrics Visualization"}
          {mode === "station" && "Station Metrics Visualization"}
          {mode === "system" && "System Metrics Visualization"}
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

          {loading && (
            <span className={panelStyles.placeholderText}>
              Loading metrics...
            </span>
          )}

          {error && (
            <span className={panelStyles.placeholderText}>
              Error: {error}
            </span>
          )}

          {!loading && !error && mode === "basic" && basicMetrics && (
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "18px" }}>

              <div className={dashboardStyles.kpiRow}>

                <div className={dashboardStyles.kpiCard}>
                  <span className={dashboardStyles.kpiLabel}>Total Consumption</span>
                  <h2 className={dashboardStyles.kpiValue}>
                    {basicMetrics.total_consumption.toFixed(2)} kWh
                  </h2>
                </div>

                <div className={dashboardStyles.kpiCard}>
                  <span className={dashboardStyles.kpiLabel}>Average Consumption</span>
                  <h2 className={dashboardStyles.kpiValue}>
                    {basicMetrics.average_consumption.toFixed(2)} kWh
                  </h2>
                </div>

              </div>

              <BasicMetricsTable data={basicMetrics.consumption_by_system} />

            </div>
          )}

          {!loading && !error && mode === "station" && stationMetrics && (
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "18px" }}>

              <div style={{ height: "260px", width: "100%" }}>
                <StationEnergyByHourChart data={stationMetrics.energy_by_hour} />
              </div>

              <div className={dashboardStyles.kpiRow}>

                <div className={dashboardStyles.kpiCard}>
                  <span className={dashboardStyles.kpiLabel}>Total Energy</span>
                  <h2 className={dashboardStyles.kpiValue}>
                    {stationMetrics.total_energy.toFixed(2)} kWh
                  </h2>
                </div>

                <div className={dashboardStyles.kpiCard}>
                  <span className={dashboardStyles.kpiLabel}>Avg Load</span>
                  <h2 className={dashboardStyles.kpiValue}>
                    {stationMetrics.average_consumption.toFixed(2)} kWh
                  </h2>
                </div>

                <div className={dashboardStyles.kpiCard}>
                  <span className={dashboardStyles.kpiLabel}>Peak Demand</span>
                  <h2 className={dashboardStyles.kpiValue}>
                    {stationMetrics.peak_consumption.toFixed(2)} kWh
                  </h2>
                </div>

              </div>

              <div className={dashboardStyles.kpiRow}>

                <div className={dashboardStyles.kpiCard}>
                  <span className={dashboardStyles.kpiLabel}>Min Consumption</span>
                  <h2 className={dashboardStyles.kpiValue}>
                    {stationMetrics.min_consumption.toFixed(2)} kWh
                  </h2>
                </div>

                <div className={dashboardStyles.kpiCard}>
                  <span className={dashboardStyles.kpiLabel}>Std Consumption</span>
                  <h2 className={dashboardStyles.kpiValue}>
                    {stationMetrics.std_consumption.toFixed(2)}
                  </h2>
                </div>

                <div className={dashboardStyles.kpiCard}>
                  <span className={dashboardStyles.kpiLabel}>Avg Daily Energy</span>
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

              <div className={dashboardStyles.kpiRow}>

                <div className={dashboardStyles.kpiCard}>
                  <span className={dashboardStyles.kpiLabel}>
                    Min Consumption
                  </span>
                  <h2 className={dashboardStyles.kpiValue}>
                    {systemMetrics.min_consumption.toFixed(2)} kWh
                  </h2>
                </div>

                <div className={dashboardStyles.kpiCard}>
                  <span className={dashboardStyles.kpiLabel}>
                    Std Consumption
                  </span>
                  <h2 className={dashboardStyles.kpiValue}>
                    {systemMetrics.std_consumption.toFixed(2)}
                  </h2>
                </div>

                <div className={dashboardStyles.kpiCard}>
                  <span className={dashboardStyles.kpiLabel}>
                    Avg Daily Energy
                  </span>
                  <h2 className={dashboardStyles.kpiValue}>
                    {systemMetrics.avg_daily_energy.toFixed(2)} kWh
                  </h2>
                </div>

              </div>

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

            <button className={mode === "basic" ? tabStyles.tabButtonActive : tabStyles.tabButton} onClick={() => setMode("basic")}>Basic</button>
            <button className={mode === "station" ? tabStyles.tabButtonActive : tabStyles.tabButton} onClick={() => setMode("station")}>Station</button>
            <button className={mode === "system" ? tabStyles.tabButtonActive : tabStyles.tabButton} onClick={() => setMode("system")}>System</button>
            <button className={mode === "energy" ? tabStyles.tabButtonActive : tabStyles.tabButton} onClick={() => setMode("energy")}>Energy</button>

          </div>

          {mode === "system" && (
            <div className={controlStyles.rangeInputs}>
              <div className={controlStyles.inputGroup}>
                <input
                  className={controlStyles.input}
                  placeholder="Select System"
                  value={systemName}
                  onChange={handleSystemChange}
                />
                <div className={controlStyles.inputLabel}>System Name</div>
              </div>
            </div>
          )}

          <button className={controlStyles.runButton} onClick={handleRunMetrics}>
            Run {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>

          {executionMessage && (
            <div className={controlStyles.executionInfo}>
              <span>Metrics execution status:</span>
              <strong>{executionMessage}</strong>
            </div>
          )}

        </div>

      </section>

    </section>
  );
}

export default Metrics;
