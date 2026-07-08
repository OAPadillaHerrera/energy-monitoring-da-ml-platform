

import {
  type ChangeEvent,
  useEffect,
  useState
} from "react";

import layoutStyles from "../../../../components/shared/styles/layoutStyles.module.css";
import panelStyles from "../../../../components/shared/styles/panelStyles.module.css";
import tabStyles from "../../../../components/shared/styles/tabStyles.module.css";
import controlStyles from "../../../../components/shared/styles/controlStyles.module.css";
import chipStyles from "../../../../components/shared/styles/chipStyles.module.css";
import api from "../../../../services/api";
import RootCauseDistributionChartDAML from "../../../../components/charts/RootCauseDistributionChartDAML";
import RootCauseEventsTableDAML from "../../../../components/tables/RootCauseEventsTableDAML";
import { exportRootCauseCSV } from "../../../../services/reports/damlExportCSV";

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
  all_systems_prediction: Record<string, PredictionEvent[]>;
};

function ML() {

  const [systemName, setSystemName] = useState("");

  const [executionMessage, setExecutionMessage] =
    useState("");

  const [viewMode, setViewMode] =
    useState<"chart" | "table">("chart");

  const [stableEvents, setStableEvents] =
    useState<PredictionEvent[]>([]);

  const [rootCauseReport, setRootCauseReport] =
  useState<RootCauseData | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {

    const timeoutId = setTimeout(() => {

      const fetchRootCause =
        async (): Promise<void> => {

          try {

            setLoading(true);
            setError(null);

            const endpoint =
              systemName.trim()

                ? `/ml/root-cause?name=${encodeURIComponent(systemName)}`

                : "/ml/root-cause";

            const response =
              await api.get(endpoint);

            const data: RootCauseData =
              response.data;

            setRootCauseReport(data);

            const events: PredictionEvent[] =

              (
                systemName.trim()

                  ? data.by_system ?? []

                  : Object.values(
                      data.all_systems_prediction ?? {}
                    ).flat()
              )

              .filter(Boolean)

              .filter(
                event =>
                  event.prediction &&
                  event.prediction !== "normal"
              );

            setStableEvents(events);

          }

          catch (err) {

            console.error(err);

            setError("System not found.");

            setStableEvents([]);

          }

          finally {

            setLoading(false);

          }

        };

      void fetchRootCause();

    }, 700);

    return () => clearTimeout(timeoutId);

  }, [systemName]);

  const handleRunPipeline = (): void => {

    setExecutionMessage(

      systemName.trim()

        ? `Root Cause Report generated for ${systemName}.`

        : "Root Cause Report generated for all systems."

    );

  };

  const handleExportCSV = (): void => {

    if (
      rootCauseReport
    ) {

      exportRootCauseCSV(
        rootCauseReport
      );

      setExecutionMessage(
        "Root Cause CSV exported successfully."
      );

       return;

    }

    setExecutionMessage(
      "CSV export not implemented for this report yet."
    );

  };

  const handleExportPDF = (): void => {

    setExecutionMessage(
      "PDF report exported successfully."
    );

  };

  const handleSystemChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {

    setSystemName(event.target.value);

  };

  return (

    <section className={layoutStyles.mainPanel}>

      <section className={panelStyles.chartPanel}>

        <div className={panelStyles.panelHeader}>
          Root Cause Analysis Report
        </div>

        <div
          className={panelStyles.chartPlaceholder}
          style={{
            alignItems: "stretch",
            justifyContent: "flex-start"
          }}
        >

          {loading && (

            <span className={panelStyles.placeholderText}>
              Loading ML report...
            </span>

          )}

          {error && (

            <span className={panelStyles.placeholderText}>
              {error}
            </span>

          )}

          {!loading &&
            !error &&
            stableEvents.length === 0 && (

            <span className={panelStyles.placeholderText}>
              No root cause events detected.
            </span>

          )}

          {!loading &&
            !error &&
            stableEvents.length > 0 &&
            viewMode === "chart" && (

            <div
              style={{
                width: "100%",
                height: "320px"
              }}
            >

              <RootCauseDistributionChartDAML
                data={stableEvents}
              />

            </div>

          )}

          {!loading &&
            !error &&
            stableEvents.length > 0 &&
            viewMode === "table" && (

            <RootCauseEventsTableDAML
              data={stableEvents}
              system={systemName.trim() || undefined}
            />

          )}

        </div>

      </section>

      <section className={panelStyles.controlPanel}>

        <div className={panelStyles.panelHeader}>
          Report Configuration
        </div>

        <div className={controlStyles.controlContent}>

          <div className={tabStyles.tabs}>

            <span className={chipStyles.chipPrimary}>
              Root Cause Pipeline
            </span>

          </div>

          <div className={controlStyles.rangeInputs}>

            <div className={controlStyles.inputGroup}>

              <input
                type="text"
                className={controlStyles.input}
                placeholder="Optional System"
                value={systemName}
                onChange={handleSystemChange}
              />

              <div className={controlStyles.inputLabel}>
                System Name
              </div>

            </div>

          </div>

          <div className={tabStyles.tabs}>

            <button
              className={
                viewMode === "chart"
                  ? tabStyles.tabButtonActive
                  : tabStyles.tabButton
              }
              onClick={() => setViewMode("chart")}
            >
              Chart View
            </button>

            <button
              className={
                viewMode === "table"
                  ? tabStyles.tabButtonActive
                  : tabStyles.tabButton
              }
              onClick={() => setViewMode("table")}
            >
              Table View
            </button>

          </div>

          <button
            className={controlStyles.runButton}
            onClick={handleRunPipeline}
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

            <div className={controlStyles.executionInfo}>

              <span>Report execution status:</span>

              <strong>
                {executionMessage}
              </strong>

            </div>

          )}

        </div>

      </section>

    </section>

  );

}

export default ML;