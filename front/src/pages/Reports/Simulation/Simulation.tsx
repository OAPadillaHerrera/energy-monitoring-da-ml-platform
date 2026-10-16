

import {
  useEffect,
  useState,
  type ChangeEvent
} from "react";

import {
  Activity,
  Gauge,
  Zap,
  Eye,
  FileSpreadsheet,
  FileText,
  ChartNoAxesCombined,
  Table
} from "lucide-react";

import layoutStyles from "../../../components/shared/styles/layoutStyles.module.css";
import panelStyles from "../../../components/shared/styles/panelStyles.module.css";
import tabStyles from "../../../components/shared/styles/tabStyles.module.css";
import controlStyles from "../../../components/shared/styles/controlStyles.module.css";
import api from "../../../services/api";
import Consumption from "./Consumption";
import SimulationSystemEventsTable from "../../../components/tables/SimulationSystemEventsTable";
import ReportVoltageChart from "../../../components/charts/ReportVoltageChart";
import ReportVoltageTable from "../../../components/tables/ReportVoltageTable";

import {
  exportDailyCSV,
  exportEventCSV,
  exportHourlyCSV,
  exportVoltageCSV
} from "../../../services/reports/simulationExportCSV";

import {
  exportDailyPDF,
  exportEventPDF,
  exportHourlyPDF,
  exportVoltagePDF
} from "../../../services/reports/simulationExportPDF";

import type {
  BasicMetricsData,
  ConsumptionData,
  SimulationMode,
  SystemEventRecord,
  ViewMode,
  VoltageRecord
} from "./types";

type HourlyReportResponse = {
  energy_by_hour?: ConsumptionData | null;
  avg_hourly_profile?: ConsumptionData | null;
};

type DailyReportResponse = {
  daily_energy?: ConsumptionData | null;
};

function Simulation() {
  const [mode, setMode] =
    useState<SimulationMode>("hourly");

  const [viewMode, setViewMode] =
    useState<ViewMode>("chart");

  const [systemName, setSystemName] =
    useState("");

  const [systemNames, setSystemNames] =
    useState<string[]>([]);

  const [executionMessage, setExecutionMessage] =
    useState("");

  const [hourlyData, setHourlyData] =
    useState<ConsumptionData | null>(null);

  const [eventData, setEventData] =
    useState<SystemEventRecord[]>([]);

  const [dailyData, setDailyData] =
    useState<ConsumptionData | null>(null);

  const [voltageData, setVoltageData] =
    useState<VoltageRecord[] | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    const fetchSystemNames = async (): Promise<void> => {
      try {
        const response =
          await api.get<BasicMetricsData>("/metrics/basic");

        setSystemNames(
          Object.keys(
            response.data.consumption_by_system ?? {}
          )
        );
      } catch (err: unknown) {
        console.error("Failed to load system names:", err);
        setSystemNames([]);
      }
    };

    void fetchSystemNames();
  }, []);

  useEffect(() => {
    let cancelled = false;

    const timeoutId = setTimeout(() => {
      const fetchReportData = async (): Promise<void> => {
        try {
          setLoading(true);
          setError(null);

          if (mode === "hourly") {
            const endpoint = systemName.trim()
              ? `/metrics/system?name=${encodeURIComponent(
                  systemName.trim()
                )}`
              : "/metrics/station/hourly";

            const response =
              await api.get<HourlyReportResponse>(endpoint);

            if (cancelled) {
              return;
            }

            setHourlyData(
              response.data.energy_by_hour ??
                response.data.avg_hourly_profile ??
                null
            );

            return;
          }

          if (mode === "events") {
            const response =
              await api.get<SystemEventRecord[]>(
                "/simulation/system-events"
              );

            if (cancelled) {
              return;
            }

            setEventData(response.data ?? []);
            return;
          }

          if (mode === "daily") {
            const endpoint = systemName.trim()
              ? `/metrics/system?name=${encodeURIComponent(
                  systemName.trim()
                )}&interval=daily`
              : "/metrics/station/daily";

            const response =
              await api.get<DailyReportResponse>(endpoint);

            if (cancelled) {
              return;
            }

            setDailyData(
              response.data.daily_energy ?? null
            );

            return;
          }

          if (mode === "voltage") {
            const response =
              await api.get<VoltageRecord[]>(
                "/simulation/voltage"
              );

            if (cancelled) {
              return;
            }

            setVoltageData(response.data ?? []);
          }
        } catch (err: unknown) {
          if (cancelled) {
            return;
          }

          console.error("Failed to load report data:", err);

          setHourlyData(null);
          setEventData([]);
          setDailyData(null);
          setVoltageData(null);

          if (mode === "events") {
            setError("Unable to load event records.");
          } else if (mode === "voltage") {
            setError("Unable to load voltage report data.");
          } else if (mode === "daily") {
            setError(
              systemName.trim()
                ? "System not found."
                : "Unable to load daily report data."
            );
          } else {
            setError(
              systemName.trim()
                ? "System not found."
                : "Unable to load hourly report data."
            );
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      };

      void fetchReportData();
    }, 700);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [mode, systemName]);

  useEffect(() => {
    if (mode === "events") {
      setViewMode("table");
      return;
    }

    setViewMode("chart");
  }, [mode]);

  const handleSystemChange = (
    event: ChangeEvent<HTMLSelectElement>
  ): void => {
    setSystemName(event.target.value);
    setExecutionMessage("");
  };

  const handleGenerateReport = (): void => {
    if (mode === "hourly") {
      setExecutionMessage(
        systemName.trim()
          ? `Hourly Consumption report generated for ${systemName.trim()}.`
          : "Hourly Consumption report generated for all systems."
      );
      return;
    }

    if (mode === "events") {
      setExecutionMessage(
        systemName.trim()
          ? `System Events report generated for ${systemName.trim()}.`
          : "System Events report generated for all systems."
      );
      return;
    }

    if (mode === "daily") {
      setExecutionMessage(
        systemName.trim()
          ? `Daily Consumption report generated for ${systemName.trim()}.`
          : "Daily Consumption report generated for all systems."
      );
      return;
    }

    setExecutionMessage(
      "Voltage report generated successfully."
    );
  };

  const handleExportCSV = (): void => {
    if (mode === "hourly" && hourlyData) {
      exportHourlyCSV(hourlyData);

      setExecutionMessage(
        "Hourly Consumption CSV exported successfully."
      );
      return;
    }

    if (mode === "events" && eventData.length > 0) {
      exportEventCSV(eventData);

      setExecutionMessage(
        "System Events CSV exported successfully."
      );
      return;
    }

    if (mode === "daily" && dailyData) {
      exportDailyCSV(dailyData);

      setExecutionMessage(
        "Daily Consumption CSV exported successfully."
      );
      return;
    }

    if (mode === "voltage" && voltageData) {
      exportVoltageCSV(voltageData);

      setExecutionMessage(
        "Voltage CSV exported successfully."
      );
      return;
    }

    setExecutionMessage(
      "CSV export not implemented for this report yet."
    );
  };

  const handleExportPDF = (): void => {
    if (mode === "hourly" && hourlyData) {
      exportHourlyPDF(hourlyData);

      setExecutionMessage(
        "Hourly Consumption PDF exported successfully."
      );
      return;
    }

    if (mode === "events" && eventData.length > 0) {
      exportEventPDF(eventData);

      setExecutionMessage(
        "System Events PDF exported successfully."
      );
      return;
    }

    if (mode === "daily" && dailyData) {
      exportDailyPDF(dailyData);

      setExecutionMessage(
        "Daily Consumption PDF exported successfully."
      );
      return;
    }

    if (mode === "voltage" && voltageData) {
      exportVoltagePDF(voltageData);

      setExecutionMessage(
        "Voltage PDF exported successfully."
      );
      return;
    }

    setExecutionMessage(
      "PDF export not implemented for this report yet."
    );
  };

  return (
    <>
      <div className={layoutStyles.sectionHeading}>
        <h2>Simulation</h2>
        <span>Reports and Exports</span>
      </div>

      <div className={tabStyles.tabs}>
        <button
          type="button"
          className={
            mode === "hourly"
              ? tabStyles.reportsTabButtonActive
              : tabStyles.reportsTabButton
          }
          onClick={() => setMode("hourly")}
        >
          <Zap className={tabStyles.reportsTabIcon} />
          Hourly Consumption
        </button>

        <button
          type="button"
          className={
            mode === "events"
              ? tabStyles.reportsTabButtonActive
              : tabStyles.reportsTabButton
          }
          onClick={() => setMode("events")}
        >
          <Activity className={tabStyles.reportsTabIcon} />
          System Events
        </button>

        <button
          type="button"
          className={
            mode === "daily"
              ? tabStyles.reportsTabButtonActive
              : tabStyles.reportsTabButton
          }
          onClick={() => setMode("daily")}
        >
          <Zap className={tabStyles.reportsTabIcon} />
          Daily Consumption
        </button>

        <button
          type="button"
          className={
            mode === "voltage"
              ? tabStyles.reportsTabButtonActive
              : tabStyles.reportsTabButton
          }
          onClick={() => setMode("voltage")}
        >
          <Gauge className={tabStyles.reportsTabIcon} />
          Voltage
        </button>
      </div>

      <section className={panelStyles.chartPanel}>
        <div className={panelStyles.panelHeader}>
          {mode === "hourly" && "Hourly Energy Consumption"}
          {mode === "events" && "System Events"}
          {mode === "daily" && "Daily Energy Consumption"}
          {mode === "voltage" && "Voltage"}
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
              Loading report data...
            </span>
          )}

          {error && (
            <span className={panelStyles.placeholderText}>
              {error}
            </span>
          )}

          {!loading &&
            !error &&
            (mode === "hourly" || mode === "daily") && (
              <Consumption
                mode={mode}
                viewMode={viewMode}
                hourlyData={hourlyData}
                dailyData={dailyData}
              />
            )}

          {!loading &&
            !error &&
            mode === "events" && (
              <SimulationSystemEventsTable
                events={eventData}
                dateLabel="Date"
              />
            )}

          {!loading &&
            !error &&
            mode === "voltage" &&
            voltageData &&
            viewMode === "chart" && (
              <div
                style={{
                  width: "100%",
                  height: "100%"
                }}
              >
                <ReportVoltageChart data={voltageData} />
              </div>
            )}

          {!loading &&
            !error &&
            mode === "voltage" &&
            voltageData &&
            viewMode === "table" && (
              <ReportVoltageTable data={voltageData} />
            )}

          {!loading &&
            !error &&
            !hourlyData &&
            mode === "hourly" && (
              <span className={panelStyles.placeholderText}>
                Waiting for report generation...
              </span>
            )}

          {!loading &&
            !error &&
            !dailyData &&
            mode === "daily" && (
              <span className={panelStyles.placeholderText}>
                Waiting for report generation...
              </span>
            )}

          {!loading &&
            !error &&
            !voltageData &&
            mode === "voltage" && (
              <span className={panelStyles.placeholderText}>
                Waiting for report generation...
              </span>
            )}
        </div>
      </section>

      <section className={panelStyles.controlPanel}>
        <div className={panelStyles.panelHeader}>
          Report Configuration
        </div>

        <div className={controlStyles.controlContent}>
          <div className={tabStyles.tabs}>
            {mode !== "events" && (
              <button
                type="button"
                className={
                  viewMode === "chart"
                    ? tabStyles.reportsTabButtonActive
                    : tabStyles.reportsTabButton
                }
                onClick={() => setViewMode("chart")}
              >
                <ChartNoAxesCombined
                  className={tabStyles.reportsTabIcon}
                />
                Chart View
              </button>
            )}

            <button
              type="button"
              className={
                mode === "events"
                  ? tabStyles.reportsTabButtonFixed
                  : viewMode === "table"
                    ? tabStyles.reportsTabButtonActive
                    : tabStyles.reportsTabButton
              }
              onClick={() => setViewMode("table")}
            >
              <Table className={tabStyles.reportsTabIcon} />
              Table View
            </button>
          </div>

          {mode !== "voltage" &&
            mode !== "events" && (
              <div className={controlStyles.rangeInputs}>
                <div className={controlStyles.inputGroup}>
                  <select
                    className={`${controlStyles.input} ${controlStyles.systemSelect}`}
                    value={systemName}
                    onChange={handleSystemChange}
                  >
                    <option value="">All Systems</option>

                    {systemNames.map((name) => (
                      <option key={name} value={name}>
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
            className={controlStyles.damlViewButton}
            onClick={handleGenerateReport}
          >
            <Eye
              className={controlStyles.damlViewButtonIcon}
              color="#000000"
            />
            View Report
          </button>

          <div className={tabStyles.tabs}>
            <button
              type="button"
              className={controlStyles.runButton}
              onClick={handleExportCSV}
            >
              <FileSpreadsheet
                className={controlStyles.runButtonIcon}
                color="#000000"
              />
              Export CSV
            </button>

            <button
              type="button"
              className={controlStyles.runButton}
              onClick={handleExportPDF}
            >
              <FileText
                className={controlStyles.runButtonIcon}
                color="#000000"
              />
              Export PDF
            </button>
          </div>

          {executionMessage && (
            <div className={controlStyles.executionInfo}>
              <span>Report execution status:</span>
              <strong>{executionMessage}</strong>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Simulation;
