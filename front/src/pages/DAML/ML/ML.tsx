

import {
  type ChangeEvent,
  useEffect,
  useState
} from "react";

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

function ML() {
  const [systemName, setSystemName] =
    useState("");

  const [systemNames, setSystemNames] =
    useState<string[]>([]);

  const [executionMessage, setExecutionMessage] =
    useState("");

  const [stableEvents, setStableEvents] =
    useState<PredictionEvent[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [runningAnalysis, setRunningAnalysis] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    const fetchSystems = async (): Promise<void> => {
      try {
        const response =
          await api.get("/metrics/basic");

        const systems =
          Object.keys(
            response.data.consumption_by_system
          );

        setSystemNames(systems);
      } catch (error) {
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
  };

  const handleRunPipeline =
    async (): Promise<void> => {
      try {
        setLoading(true);
        setRunningAnalysis(true);
        setError(null);
        setExecutionMessage("");
        setStableEvents([]);

        const endpoint = systemName.trim()
          ? `/ml/root-cause?name=${encodeURIComponent(
              systemName.trim()
            )}`
          : "/ml/root-cause";

        const response =
          await api.get(endpoint);

        const data: RootCauseData =
          response.data;

        const events: PredictionEvent[] =
          (
            systemName.trim()
              ? data.by_system ?? []
              : Object.values(
                  data.all_systems_prediction ?? {}
                )
                  .flat()
                  .filter(Boolean)
          ).filter(
            (event) =>
              event.prediction &&
              event.prediction !== "normal"
          );

        setStableEvents(events);

        setExecutionMessage(
          "Root Cause Pipeline executed successfully"
        );
      } catch (error: any) {
        console.error(
          "Root Cause Pipeline execution failed:",
          error
        );

        setStableEvents([]);

        setError(
          error?.response?.data?.message ||
          error.message ||
          "Root Cause Pipeline execution failed."
        );
      } finally {
        setLoading(false);
        setRunningAnalysis(false);
      }
    };

  return (
    <>
      <div className={layoutStyles.sectionHeading}>
        <h2>Root Cause Pipeline</h2>
        <span>
          Root cause predictions · Risk and event analysis
        </span>
      </div>

      <section className={panelStyles.chartPanel}>
        <div className={panelStyles.panelHeader}>
          Root Cause Pipeline Visualization
        </div>

        <div
          className={panelStyles.chartPlaceholder}
          style={{
            alignItems: "stretch",
            justifyContent: "flex-start"
          }}
        >
          {loading && (
            <span
              className={panelStyles.placeholderText}
            >
              Loading ML data...
            </span>
          )}

          {error && (
            <span
              className={panelStyles.placeholderText}
            >
              {error}
            </span>
          )}

          {!loading &&
            !error &&
            stableEvents.length === 0 && (
              <span
                className={panelStyles.placeholderText}
              >
                No root cause events detected.
              </span>
            )}

          {!loading &&
            !error &&
            stableEvents.length > 0 && (
              <div style={{ width: "100%" }}>
                <RootCausePredictionChart
                  data={stableEvents}
                />

                <RootCausePredictionTable
                  data={stableEvents}
                  system={
                    systemName.trim() ||
                    undefined
                  }
                />
              </div>
            )}
        </div>
      </section>

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
                {systemName.trim() ||
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
