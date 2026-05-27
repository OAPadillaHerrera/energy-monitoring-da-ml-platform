

import {
  type ChangeEvent,
  useState
} from "react";

import layoutStyles from "../../../components/shared/styles/layoutStyles.module.css";
import panelStyles from "../../../components/shared/styles/panelStyles.module.css";
import tabStyles from "../../../components/shared/styles/tabStyles.module.css";
import controlStyles from "../../../components/shared/styles/controlStyles.module.css";
import SimulationConsumptionChart from "../../../components/charts/SimulationConsumptionChart";
import api from "../../../services/api";

type SimulationMode =
  | "daily"
  | "range";

type SimulationInfo = {

  status: string;

  simulation_date?: string;

  daily_records_inserted?: number;

  hourly_records_inserted?: number;

  hours_generated?: number;
};

function Consumption() {

  const [mode, setMode] =
    useState<SimulationMode>("daily");

  const [chartData, setChartData] =
    useState<Record<string, number> | null>(
      null
    );

  const [simulationInfo, setSimulationInfo] =
    useState<SimulationInfo | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const handleRunSimulation =
    async (): Promise<void> => {

      try {

        setLoading(true);

        setError(null);

        setChartData(null);

        if (mode === "daily") {

          const simulationResponse =
            await api.post(
              "/simulation/daily"
            );

          setSimulationInfo(
            simulationResponse.data
          );

          const metricsResponse =
            await api.get(
              "/metrics/station/hourly"
            );

          setChartData(
            metricsResponse.data
              .energy_by_hour
          );
        }

        if (mode === "range") {

          if (
            !startDate.trim() ||
            !endDate.trim()
          ) {

            setError(
              "Start date and end date are required."
            );

            return;
          }

          const simulationResponse =
            await api.post(
              "/simulation/range",
              {
                start_date: startDate,
                end_date: endDate
              }
            );

          setSimulationInfo(
            simulationResponse.data
          );

          const metricsResponse =
            await api.get(
              "/metrics/station/daily"
            );

          setChartData(
            metricsResponse.data
              .daily_energy
          );
        }

      } catch (error: any) {

        console.error(
          "Simulation execution failed:",
          error
        );

        setError(
          error?.response?.data?.message ||
          error.message ||
          "Simulation execution failed."
        );

      } finally {

        setLoading(false);
      }
    };

  const handleStartDateChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {

    setStartDate(event.target.value);
  };

  const handleEndDateChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {

    setEndDate(event.target.value);
  };

  return (

    <section className={layoutStyles.mainPanel}>

      <section className={panelStyles.chartPanel}>

        <div className={panelStyles.panelHeader}>

          {
            mode === "daily"
              ? "Hourly Station Consumption"
              : "Daily Station Consumption"
          }

        </div>

        <div className={panelStyles.chartPlaceholder}>

          <div className={panelStyles.chartGrid}></div>

          {
            loading && (

              <span className={panelStyles.placeholderText}>
                Running simulation...
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
            !chartData && (

              <span className={panelStyles.placeholderText}>
                Waiting for Simulation execution...
              </span>

            )
          }

          {
            !loading &&
            !error &&
            chartData && (

              <SimulationConsumptionChart
                data={chartData}
                mode={mode}
              />

            )
          }

        </div>

      </section>

      <section className={panelStyles.controlPanel}>

        <div className={panelStyles.panelHeader}>
          Simulation Configuration
        </div>

        <div className={controlStyles.controlContent}>

          <div className={controlStyles.modeSelector}>

            <button
              className={
                mode === "daily"
                  ? tabStyles.tabButtonActive
                  : tabStyles.tabButton
              }

              onClick={() => {

                setMode("daily");

                setChartData(null);

                setSimulationInfo(null);

                setError(null);
              }}
            >
              Daily Simulation
            </button>

            <button
              className={
                mode === "range"
                  ? tabStyles.tabButtonActive
                  : tabStyles.tabButton
              }

              onClick={() => {

                setMode("range");

                setChartData(null);

                setSimulationInfo(null);

                setError(null);
              }}
            >
              Range Simulation
            </button>

          </div>

          {
            mode === "range" && (

              <div className={controlStyles.rangeInputs}>

                <div className={controlStyles.inputGroup}>

                  <input
                    type="date"

                    className={controlStyles.input}

                    value={startDate}

                    onChange={
                      handleStartDateChange
                    }
                  />

                  <div className={controlStyles.inputLabel}>
                    Start Date
                  </div>

                </div>

                <div className={controlStyles.inputGroup}>

                  <input
                    type="date"

                    className={controlStyles.input}

                    value={endDate}

                    onChange={
                      handleEndDateChange
                    }
                  />

                  <div className={controlStyles.inputLabel}>
                    End Date
                  </div>

                </div>

              </div>

            )
          }

          <button
            className={controlStyles.runButton}

            onClick={handleRunSimulation}
          >
            Run Simulation
          </button>

          {
            simulationInfo && (

              <div className={controlStyles.executionInfo}>

                <span>
                  Simulation executed successfully
                </span>

                {
                  simulationInfo.simulation_date && (

                    <strong>
                      Date:
                      {" "}
                      {
                        simulationInfo.simulation_date
                      }
                    </strong>

                  )
                }

                {
                  simulationInfo.hourly_records_inserted && (

                    <strong>
                      Hourly records:
                      {" "}
                      {
                        simulationInfo.hourly_records_inserted
                      }
                    </strong>

                  )
                }

              </div>

            )
          }

        </div>

      </section>

    </section>
  );
}

export default Consumption;






