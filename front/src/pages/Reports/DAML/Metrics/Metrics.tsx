

import { useEffect, useState, type ChangeEvent } from "react";
import api from "../../../../services/api";
import layoutStyles from "../../../../components/shared/styles/layoutStyles.module.css";
import panelStyles from "../../../../components/shared/styles/panelStyles.module.css";
import tabStyles from "../../../../components/shared/styles/tabStyles.module.css";
import controlStyles from "../../../../components/shared/styles/controlStyles.module.css";
import BasicMetricsChartDAML from "../../../../components/charts/SystemConsumptionChartDAML";
import BasicMetricsTableDAML from "../../../../components/tables/BasicMetricsTableDAML";
import StationEnergyByHourChart from "../../../../components/charts/StationEnergyByHourChartDAML";
import StationEnergyByHourTableDAML from "../../../../components/tables/StationEnergyByHourTableDAML";
import SystemEnergyByHourChart from "../../../../components/charts/SystemEnergyByHourChart";
import SystemEnergyByHourTable from "../../../../components/tables/SystemEnergyByHourTableDAML";
import EnergySystemRankingChartDAML from "../../../../components/charts/EnergySystemRanlkingPieChartDAML";
import EnergyLoadFactorTableDAML from "../../../../components/tables/EnergyLoadFactorTableDAML";

type BasicMetricsData = Record<string, number>;

type Mode = "basic" | "station" | "system" | "energy";

function Metrics() {
  const [mode, setMode] = useState<Mode>("basic");
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart");

  const [systemName, setSystemName] = useState("");
  const [executionMessage, setExecutionMessage] = useState("");

  const [data, setData] = useState<BasicMetricsData | null>(null);

  const [energyData, setEnergyData] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleSystemChange = (
    e: ChangeEvent<HTMLInputElement>
  ): void => {
    setSystemName(e.target.value);
  };

  const requiresSystem = mode === "system";

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        let response;

        if (mode === "basic") {
          response = await api.get("/metrics/basic");

          setData(
            response.data?.consumption_by_system ?? {}
          );
        }

        if (mode === "station") {
          response = await api.get("/metrics/station/hourly");

          setData(
            response.data?.energy_by_hour ?? {}
          );
        }        

        if (
          mode === "system" &&
          systemName.trim()
        ) {
          response = await api.get(
            `/metrics/system?name=${systemName}`
          );

          setData(
            response.data?.avg_hourly_profile ?? {}
          );
        }

        if (mode === "energy") {
          response = await api.get("/metrics/energy");

          setEnergyData(response.data);
        }

      } catch (err) {
        console.error(err);

        setError("Failed to load metrics");
      } finally {
        setLoading(false);
      }
    };

    void fetchData();

  }, [mode, systemName]);

  const handleRun = (): void => {

    if (
      requiresSystem &&
      !systemName.trim()
    ) {
      setExecutionMessage(
        "Please provide a valid system name."
      );

      return;
    }

    const target = systemName.trim();

    if (mode === "basic") {
      return setExecutionMessage(
        "Basic Metrics report generated."
      );
    }

    if (mode === "station") {
      return setExecutionMessage(
        "Station Metrics report generated."
      );
    }

    if (mode === "system") {
      return setExecutionMessage(
        `System Metrics report generated for ${target}.`
      );
    }

    if (mode === "energy") {
      return setExecutionMessage(
        "Energy Metrics report generated."
      );
    }
  };

  const handleExportCSV = (): void => {
    setExecutionMessage(
      "CSV report exported successfully."
    );
  };

  const handleExportPDF = (): void => {
    setExecutionMessage(
      "PDF report exported successfully."
    );
  };

  return (
    <section className={layoutStyles.mainPanel}>

      <section className={panelStyles.chartPanel}>

        <div className={panelStyles.panelHeader}>
          {mode === "basic" &&
            "Basic Metrics Report"}

          {mode === "station" &&
            "Station Metrics Report"}

          {mode === "system" &&
            "System Metrics Report"}

          {mode === "energy" &&
            "Energy Metrics Report"}
        </div>

        <div className={panelStyles.chartPlaceholder}>

          {loading && (
            <span
              className={
                panelStyles.placeholderText
              }
            >
              Loading metrics...
            </span>
          )}

          {error && (
            <span
              className={
                panelStyles.placeholderText
              }
            >
              {error}
            </span>
          )}

          {!loading &&
            !error &&
            data &&
            mode === "basic" &&
            viewMode === "chart" && (
              <BasicMetricsChartDAML
                data={data}
              />
            )}

          {!loading &&
            !error &&
            data &&
            mode === "basic" &&
            viewMode === "table" && (
              <BasicMetricsTableDAML
                data={data}
              />
            )}

          {!loading &&
            !error &&
            data &&
            mode === "station" &&
            viewMode === "chart" && (
              <StationEnergyByHourChart
                data={data}
              />
            )}

          {!loading &&
            !error &&
            data &&
            mode === "station" &&
            viewMode === "table" && (
              <StationEnergyByHourTableDAML
                data={data}
              />
            )}

          {!loading &&
           !error &&
           data &&
           mode === "system" &&
           viewMode === "chart" && (
             <SystemEnergyByHourChart
               data={data}
             />
            )}              

          {!loading &&
           !error &&
           data &&
           mode === "system" &&
           viewMode === "table" && (
             <SystemEnergyByHourTable
               data={data}
             />
            )}                                                                

          {!loading &&
              !error &&
              energyData &&
              mode === "energy" &&
              viewMode === "chart" && (
                <EnergySystemRankingChartDAML
                  data={energyData.system_ranking}
                />
            )}

          {!loading &&
            !error &&
            energyData &&
            mode === "energy" &&
            viewMode === "table" && (
              <EnergyLoadFactorTableDAML
                data={energyData.load_factor_by_system}
              />
            )}   
  
          {!loading &&
            !error &&
            !data && (
              <span
                className={
                  panelStyles.placeholderText
                }
              >
                Waiting for report generation...
              </span>
            )}

        </div>

      </section>

      <section
        className={controlStyles.controlContent}
      >

        <div className={panelStyles.panelHeader}>
          Report Configuration
        </div>

        <div className={tabStyles.tabs}>

          <button
            className={
              mode === "basic"
                ? tabStyles.tabButtonActive
                : tabStyles.tabButton
            }
            onClick={() => setMode("basic")}
          >
            Basic
          </button>

          <button
            className={
              mode === "station"
                ? tabStyles.tabButtonActive
                : tabStyles.tabButton
            }
            onClick={() => setMode("station")}
          >
            Station
          </button>

          <button
            className={
              mode === "system"
                ? tabStyles.tabButtonActive
                : tabStyles.tabButton
            }
            onClick={() => setMode("system")}
          >
            System
          </button>

          <button
            className={
              mode === "energy"
                ? tabStyles.tabButtonActive
                : tabStyles.tabButton
            }
            onClick={() => setMode("energy")}
          >
            Energy
          </button>

        </div>

        {mode === "system" && (
          <div
            className={
              controlStyles.rangeInputs
            }
          >
            <input
              className={
                controlStyles.input
              }
              value={systemName}
              onChange={handleSystemChange}
              placeholder="Select System"
            />
          </div>
        )}

        <div className={tabStyles.tabs}>

          <button
            className={
              viewMode === "chart"
                ? tabStyles.tabButtonActive
                : tabStyles.tabButton
            }
            onClick={() =>
              setViewMode("chart")
            }
          >
            Chart View
          </button>

          <button
            className={
              viewMode === "table"
                ? tabStyles.tabButtonActive
                : tabStyles.tabButton
            }
            onClick={() =>
              setViewMode("table")
            }
          >
            Table View
          </button>

        </div>

        <button
          className={controlStyles.runButton}
          onClick={handleRun}
        >
          Generate Report
        </button>

        <div className={tabStyles.tabs}>

          <button
            className={controlStyles.runButton}
            onClick={handleExportCSV}
          >
            Export CSV
          </button>

          <button
            className={controlStyles.runButton}
            onClick={handleExportPDF}
          >
            Export PDF
          </button>

        </div>

        {executionMessage && (
          <div
            className={
              controlStyles.executionInfo
            }
          >
            <span>
              Report execution status:
            </span>

            <strong>
              {executionMessage}
            </strong>
          </div>
        )}

      </section>

    </section>
  );
}

export default Metrics;