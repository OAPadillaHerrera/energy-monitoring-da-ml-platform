

import {
  type ChangeEvent,
  useEffect,
  useState
} from "react";

import {
  isAxiosError
} from "axios";

import {
  BrainCircuit,
  Play
} from "lucide-react";

import layoutStyles from "../../../components/shared/styles/layoutStyles.module.css";
import panelStyles from "../../../components/shared/styles/panelStyles.module.css";
import tabStyles from "../../../components/shared/styles/tabStyles.module.css";
import chipStyles from "../../../components/shared/styles/chipStyles.module.css";
import controlStyles from "../../../components/shared/styles/controlStyles.module.css";
import api from "../../../services/api";
import RootCausePredictionChart from "../../../components/charts/RootCauseDistributionChart";
import RootCausePredictionTable from "../../../components/tables/RootCauseEventsTable";

type Alert = {
  level: string;
  message: string;
};

type PredictionEvent = {
  timestamp: string;
  system_name?: string;
  prediction: string;
  risk_level: string;
  action: string;
  alerts: Alert[];
};

type RootCauseData = {
  system?: string;
  by_system: PredictionEvent[];
  all_systems_prediction: Record<
    string,
    PredictionEvent[]
  >;
};

type MetricsBasicData = {
  consumption_by_system: Record<
    string,
    number
  >;
};

type MetricsBasicResponse = {
  consumption_by_system: Record<
    string,
    number
  >;
};

function ML() {
  const [systemName, setSystemName] =
    useState("");

  const [systemNames, setSystemNames] =
    useState<string[]>([]);

  const [executionMessage, setExecutionMessage] =
    useState("");

  const [stableEvents, setStableEvents] =
    useState<PredictionEvent[] | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [runningAnalysis, setRunningAnalysis] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const selectedSystem =
    systemName.trim();

  useEffect(() => {
    const fetchSystems = async (): Promise<void> => {
      try {
        const response =
          await api.get<MetricsBasicResponse>(
            "/metrics/basic"
          );

        const systems =
          Object.keys(
            response.data.consumption_by_system
          );

        setSystemNames(systems);
      } catch (error: unknown) {
        console.error(
          "System names loading failed:",
          error
        );
      }
    };

    void fetchSystems();
  }, []);

  const handleSystemChange = (
    event: ChangeEvent<HTMLSelectElement>
  ): void => {
    setSystemName(event.target.value);
    setExecutionMessage("");
    setError(null);
    setStableEvents(null);
  };

  const handleRunPipeline =
    async (): Promise<void> => {
      try {
        setLoading(true);
        setRunningAnalysis(true);
        setError(null);
        setExecutionMessage("");
        setStableEvents([]);

        const endpoint = selectedSystem
          ? `/ml/root-cause?name=${encodeURIComponent(
              selectedSystem
            )}`
          : "/ml/root-cause";

        const response =
          await api.get<RootCauseData>(
            endpoint
          );

        const data =
          response.data;

        const sourceEvents =
          selectedSystem
            ? data.by_system ?? []
            : Object.values(
                data.all_systems_prediction ?? {}
              ).flat();

        const events =
          sourceEvents.filter(
            (event) =>
              event.prediction &&
              event.prediction !== "normal"
          );

        setStableEvents(events);

        setExecutionMessage(
          "Root Cause Pipeline executed successfully"
        );
      } catch (error: unknown) {
        console.error(
          "Root Cause Pipeline execution failed:",
          error
        );

        setStableEvents([]);

        if (isAxiosError(error)) {
          setError(
            error.response?.data?.message ||
            error.message ||
            "Root Cause Pipeline execution failed."
          );
        } else if (error instanceof Error) {
          setError(
            error.message ||
            "Root Cause Pipeline execution failed."
          );
        } else {
          setError(
            "Root Cause Pipeline execution failed."
          );
        }
      } finally {
        setLoading(false);
        setRunningAnalysis(false);
      }
    };

  const hasEvents =
    stableEvents !== null &&
    stableEvents.length > 0;

  const hasNoEvents =
    stableEvents !== null &&
    stableEvents.length === 0;

  return (
    <>
      <div className={layoutStyles.sectionHeading}>
        <h2>
          Root Cause Pipeline
        </h2>

        <span>
          Root cause predictions · Risk and event analysis
        </span>
      </div>

      <section className={panelStyles.chartPanel}>
        <div className={panelStyles.panelHeader}>
          Root Cause Predictions
        </div>

        <div
          className={panelStyles.chartPlaceholder}
          style={{
            alignItems: "stretch",
            justifyContent: "flex-start"
          }}
        >
          {loading && (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <span
                className={panelStyles.placeholderText}
              >
                Loading ML data...
              </span>
            </div>
          )}

          {error && (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <span
                className={panelStyles.placeholderText}
              >
                {error}
              </span>
            </div>
          )}

          {!loading &&
            !error &&
            hasNoEvents && (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <span
                  className={panelStyles.placeholderText}
                >
                  No root cause data available
                </span>
              </div>
            )}

          {!loading &&
            !error &&
            hasEvents && (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  minHeight: 0,
                  flex: 1
                }}
              >
                <RootCausePredictionChart
                  data={stableEvents}
                />
              </div>
            )}
        </div>
      </section>

      {!loading &&
        !error &&
        hasEvents && (
          <section className={panelStyles.tablePanel}>
            <div className={panelStyles.panelHeader}>
              Root Cause Events
            </div>

            <div className={panelStyles.tableContainer}>
              <RootCausePredictionTable
                data={stableEvents}
                system={
                  selectedSystem ||
                  undefined
                }
              />
            </div>
          </section>
        )}

      <section className={panelStyles.controlPanel}>
        <div className={panelStyles.panelHeader}>
          ML Configuration
        </div>

        <div className={controlStyles.controlContent}>
          <div className={tabStyles.tabs}>
            <span
              className={chipStyles.chipPrimary}
            >
              <BrainCircuit
                className={chipStyles.chipIcon}
                style={{ color: "#A78BFA" }}
              />

              Root Cause Pipeline
            </span>
          </div>

          <div className={controlStyles.rangeInputs}>
            <div className={controlStyles.inputGroup}>
              <select
                className={`${controlStyles.input} ${controlStyles.systemSelect}`}
                value={systemName}
                onChange={handleSystemChange}
              >
                <option value="">
                  All Systems
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

              <div
                className={controlStyles.inputLabel}
              >
                System Name
              </div>
            </div>
          </div>

          <button
            type="button"
            className={`${controlStyles.runButton} ${
              runningAnalysis
                ? controlStyles.runButtonRunning
                : ""
            }`}
            onClick={handleRunPipeline}
            disabled={loading}
          >
            <Play
              className={`${controlStyles.runButtonIcon} ${
                runningAnalysis
                  ? controlStyles.runButtonIconRunning
                  : ""
              }`}
            />

            {runningAnalysis
              ? "Running Root Cause Pipeline..."
              : "Run Root Cause Pipeline"}
          </button>

          {executionMessage && (
            <div
              className={
                controlStyles.executionInfo
              }
            >
              <span>
                {executionMessage}
              </span>

              <strong>
                System:{" "}
                {selectedSystem ||
                  "All Systems"}
              </strong>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default ML;

