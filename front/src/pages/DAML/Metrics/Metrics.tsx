

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

type BasicMetricsData = {

  total_consumption: number;

  average_consumption: number;

  consumption_by_system: Record<string, number>;
};

function Metrics() {

  const [mode, setMode] =
    useState("basic");

  const [systemName, setSystemName] =
    useState("");

  const [executionMessage, setExecutionMessage] =
    useState("");

  const [basicMetrics, setBasicMetrics] =
    useState<BasicMetricsData | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {

    const fetchBasicMetrics =
      async (): Promise<void> => {

        if (mode !== "basic") {
          return;
        }

        try {

          setLoading(true);

          setError(null);

          const response =
            await api.get(
              "/metrics/basic"
            );

          setBasicMetrics(
            response.data
          );

        } catch (error: any) {

          console.error(
            "Failed loading basic metrics:",
            error
          );

          setError(
            error?.response?.data?.message ||
            error.message ||
            "Failed loading basic metrics."
          );

        } finally {

          setLoading(false);
        }
      };

    void fetchBasicMetrics();

  }, [mode]);

  const handleRunMetrics = (): void => {

    if (mode === "basic") {

      setExecutionMessage(
        "Basic Metrics executed successfully."
      );
    }

    if (mode === "station") {

      setExecutionMessage(
        "Station Metrics executed successfully."
      );
    }

    if (mode === "system") {

      if (!systemName.trim()) {

        setExecutionMessage(
          "Please provide a valid system name."
        );

        return;
      }

      setExecutionMessage(
        `System Metrics executed for ${systemName}.`
      );
    }

    if (mode === "energy") {

      setExecutionMessage(
        "Energy Metrics executed successfully."
      );
    }
  };

  const handleSystemChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {

    setSystemName(
      event.target.value
    );
  };

  return (

    <section className={layoutStyles.mainPanel}>

      <section className={panelStyles.chartPanel}>

        <div className={panelStyles.panelHeader}>

          {
            mode === "basic" &&
            "Basic Metrics Visualization"
          }

          {
            mode === "station" &&
            "Station Metrics Visualization"
          }

          {
            mode === "system" &&
            "System Metrics Visualization"
          }

          {
            mode === "energy" &&
            "Energy Metrics Visualization"
          }

        </div>

        <div className={panelStyles.chartPlaceholder}>

          <div className={panelStyles.chartGrid}></div>

          {
            loading && (

              <span className={panelStyles.placeholderText}>
                Loading metrics...
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
            mode === "basic" &&
            basicMetrics && (

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                  zIndex: 2
                }}
              >

                <div className={dashboardStyles.kpiRow}>

                  <div className={dashboardStyles.kpiCard}>

                    <span className={dashboardStyles.kpiLabel}>
                      Total Consumption
                    </span>

                    <h2 className={dashboardStyles.kpiValue}>

                      {
                        basicMetrics.total_consumption
                          .toFixed(2)
                      }
                      {" "}
                      kWh

                    </h2>

                  </div>

                  <div className={dashboardStyles.kpiCard}>

                    <span className={dashboardStyles.kpiLabel}>
                      Average Consumption
                    </span>

                    <h2 className={dashboardStyles.kpiValue}>

                      {
                        basicMetrics.average_consumption
                          .toFixed(2)
                      }
                      {" "}
                      kWh

                    </h2>

                  </div>

                </div>

                <BasicMetricsTable
                  data={
                    basicMetrics.consumption_by_system
                  }
                />

              </div>

            )
          }

          {
            !loading &&
            !error &&
            mode !== "basic" && (

              <span className={panelStyles.placeholderText}>
                Waiting for Metrics execution...
              </span>

            )
          }

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
                  ? tabStyles.tabButtonActive
                  : tabStyles.tabButton
              }

              onClick={() =>
                setMode("basic")
              }
            >
              Basic
            </button>

            <button
              className={
                mode === "station"
                  ? tabStyles.tabButtonActive
                  : tabStyles.tabButton
              }

              onClick={() =>
                setMode("station")
              }
            >
              Station
            </button>

            <button
              className={
                mode === "system"
                  ? tabStyles.tabButtonActive
                  : tabStyles.tabButton
              }

              onClick={() =>
                setMode("system")
              }
            >
              System
            </button>

            <button
              className={
                mode === "energy"
                  ? tabStyles.tabButtonActive
                  : tabStyles.tabButton
              }

              onClick={() =>
                setMode("energy")
              }
            >
              Energy
            </button>

          </div>

          {
            mode === "system" && (

              <div className={controlStyles.rangeInputs}>

                <div className={controlStyles.inputGroup}>

                  <input
                    type="text"

                    className={controlStyles.input}

                    placeholder="Select System"

                    value={systemName}

                    onChange={
                      handleSystemChange
                    }
                  />

                  <div className={controlStyles.inputLabel}>
                    System Name
                  </div>

                </div>

              </div>

            )
          }

          <button
            className={controlStyles.runButton}

            onClick={handleRunMetrics}
          >
            Run
            {" "}
            {
              mode.charAt(0)
                .toUpperCase() +
              mode.slice(1)
            }
          </button>

          {
            executionMessage && (

              <div className={controlStyles.executionInfo}>

                <span>
                  Metrics execution status:
                </span>

                <strong>
                  {executionMessage}
                </strong>

              </div>

            )
          }

        </div>

      </section>

    </section>
  );
}

export default Metrics;