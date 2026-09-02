

import {
  type ChangeEvent,
  useEffect,
  useState
} from "react";

import {
  CalendarDays,
  CalendarRange,
  Play
} from "lucide-react";

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

  start_date?: string;

  end_date?: string;

  effective_start_date?: string;

  daily_records_inserted?: number;

  hourly_records_inserted?: number;

  hours_generated?: number;
};

function Consumption() {

  const [mode, setMode] =
    useState<SimulationMode>("range");

  const [chartData, setChartData] =
    useState<Record<string, number> | null>(
      null
    );

  const [simulationInfo, setSimulationInfo] =
    useState<SimulationInfo | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [runningSimulation, setRunningSimulation] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const loadRangeData =
    async (): Promise<void> => {

      try {

        setLoading(true);

        setRunningSimulation(false);

        setError(null);

        const metricsResponse =
          await api.get(
            "/metrics/station/daily"
          );

        const dailyEnergy =
          metricsResponse.data?.daily_energy;

        if (
          dailyEnergy &&
          Object.keys(dailyEnergy).length > 0
        ) {

          setChartData(
            dailyEnergy
          );

        } else {

          setChartData(null);

        }

      } catch (error: any) {

        console.error(
          "Failed to load Range simulation data:",
          error
        );

        setChartData(null);

        setError(
          error?.response?.data?.message ||
          error.message ||
          "Failed to load Range simulation data."
        );

      } finally {

        setLoading(false);

      }
    };

  useEffect(() => {

    if (mode === "range") {

      loadRangeData();

    }

  }, [mode]);

  const handleRunSimulation =
    async (): Promise<void> => {

      try {

        setLoading(true);

        setRunningSimulation(true);

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

        setRunningSimulation(false);

      }
    };

  const handleStartDateChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {

    setStartDate(
      event.target.value
    );

  };

  const handleEndDateChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {

    setEndDate(
      event.target.value
    );

  };

  return (

    <>

      <div className={layoutStyles.sectionHeading}>

        <h2>Consumption</h2>

        <span>
          Station energy consumption over time · Total values
        </span>

      </div>

      <section className={panelStyles.chartPanel}>

        <div className={panelStyles.panelHeader}>

          {
            mode === "daily"
              ? "Hourly Station Energy Consumption"
              : "Daily Station Energy Consumption"
          }

        </div>

        <div className={panelStyles.chartPlaceholder}>

          <div className={panelStyles.chartGrid}></div>

          {
            loading &&
            !runningSimulation && (

              <span className={panelStyles.placeholderText}>
                Loading simulation data...
              </span>

            )
          }

          {
            !loading &&
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

                {
                  mode === "range"
                    ? "No Range simulation data available. Run a simulation."
                    : "Waiting for Simulation execution..."
                }

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
              type="button"

              className={
                mode === "daily"
                  ? tabStyles.simulationModeButtonActive
                  : tabStyles.simulationModeButton
              }

              onClick={() => {

                setMode("daily");

                setChartData(null);

                setSimulationInfo(null);

                setError(null);

                setRunningSimulation(false);

              }}

              disabled={loading}
            >

              <CalendarDays
                className={tabStyles.simulationModeIcon}
              />

              Daily Simulation

            </button>

            <button
              type="button"

              className={
                mode === "range"
                  ? tabStyles.simulationModeButtonActive
                  : tabStyles.simulationModeButton
              }

              onClick={() => {

                setMode("range");

                setChartData(null);

                setSimulationInfo(null);

                setError(null);

                setRunningSimulation(false);

              }}

              disabled={loading}
            >

              <CalendarRange
                className={tabStyles.simulationModeIcon}
              />

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

                    disabled={loading}
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

                    disabled={loading}
                  />

                  <div className={controlStyles.inputLabel}>
                    End Date
                  </div>

                </div>

              </div>

            )
          }

          <button
            type="button"

            className={`${controlStyles.runButton} ${
              runningSimulation
                ? controlStyles.runButtonRunning
                : ""
            }`}

            onClick={handleRunSimulation}

            disabled={loading}
          >

            <Play
              className={`${controlStyles.runButtonIcon} ${
                runningSimulation
                  ? controlStyles.runButtonIconRunning
                  : ""
              }`}
            />

            {
              runningSimulation
                ? "Running Simulation..."
                : "Run Simulation"
            }

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
                  simulationInfo.start_date && (

                    <strong>
                      Start:
                      {" "}
                      {
                        simulationInfo.start_date
                      }
                    </strong>

                  )
                }

                {
                  simulationInfo.end_date && (

                    <strong>
                      End:
                      {" "}
                      {
                        simulationInfo.end_date
                      }
                    </strong>

                  )
                }

                {
                  simulationInfo.hourly_records_inserted !== undefined && (

                    <strong>
                      Hourly records:
                      {" "}
                      {
                        simulationInfo.hourly_records_inserted
                      }
                    </strong>

                  )
                }

                {
                  simulationInfo.daily_records_inserted !== undefined && (

                    <strong>
                      Daily records:
                      {" "}
                      {
                        simulationInfo.daily_records_inserted
                      }
                    </strong>

                  )
                }

              </div>

            )
          }

        </div>

      </section>

    </>

  );
}

export default Consumption;






















