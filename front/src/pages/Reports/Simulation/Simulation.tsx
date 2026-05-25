

import { type ChangeEvent, useState } from "react";
import layoutStyles from "../../../components/shared/styles/layoutStyles.module.css";
import panelStyles from "../../../components/shared/styles/panelStyles.module.css";
import tabStyles from "../../../components/shared/styles/tabStyles.module.css";
import controlStyles from "../../../components/shared/styles/controlStyles.module.css";

function Simulation() {

  const [mode, setMode] = useState("hourly");

  const [viewMode, setViewMode] = useState("chart");

  const [systemName, setSystemName] = useState("");

  const [executionMessage, setExecutionMessage] = useState("");

  const handleSystemChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {

    setSystemName(event.target.value);
  };

  const handleGenerateReport = (): void => {

    const requiresSystem = mode !== "voltage";

    if (requiresSystem && !systemName.trim()) {

      setExecutionMessage(
        "Please provide a valid system name."
      );

      return;
    }

    if (mode === "hourly") {

      setExecutionMessage(
        `Hourly Data report generated for ${systemName}.`
      );
    }

    if (mode === "events") {

      setExecutionMessage(
        `Event Records report generated for ${systemName}.`
      );
    }

    if (mode === "daily") {

      setExecutionMessage(
        `Daily Totals report generated for ${systemName}.`
      );
    }

    if (mode === "voltage") {

      setExecutionMessage(
        "Voltage Records report generated."
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

      <div className={tabStyles.tabs}>

        <button
          className={
            mode === "hourly"
              ? tabStyles.tabButtonActive
              : tabStyles.tabButton
          }

          onClick={() => setMode("hourly")}
        >
          Hourly Data
        </button>

        <button
          className={
            mode === "events"
              ? tabStyles.tabButtonActive
              : tabStyles.tabButton
          }

          onClick={() => setMode("events")}
        >
          Event Records
        </button>

        <button
          className={
            mode === "daily"
              ? tabStyles.tabButtonActive
              : tabStyles.tabButton
          }

          onClick={() => setMode("daily")}
        >
          Daily Totals
        </button>

        <button
          className={
            mode === "voltage"
              ? tabStyles.tabButtonActive
              : tabStyles.tabButton
          }

          onClick={() => setMode("voltage")}
        >
          Voltage Records
        </button>

      </div>

      <section className={panelStyles.chartPanel}>

        <div className={panelStyles.panelHeader}>

          {mode === "hourly" &&
            "Hourly Energy Consumption Report"}

          {mode === "events" &&
            "Event Records Report"}

          {mode === "daily" &&
            "Daily Energy Totals Report"}

          {mode === "voltage" &&
            "Voltage Records Report"}

        </div>

        <div className={panelStyles.chartPlaceholder}>

          <div className={panelStyles.chartGrid}></div>

          <span className={panelStyles.placeholderText}>
            Waiting for report generation...
          </span>

        </div>

      </section>

      <section className={controlStyles.controlContent}>

        <div className={panelStyles.panelHeader}>
          Report Configuration
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

        {
          mode !== "voltage" && (

            <div className={controlStyles.rangeInputs}>

              <div className={controlStyles.inputGroup}>

                <input
                  type="text"

                  className={controlStyles.input}

                  placeholder="Select System"

                  value={systemName}

                  onChange={handleSystemChange}
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

          onClick={handleGenerateReport}
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

        {
          executionMessage && (

            <div className={controlStyles.executionInfo}>

              <span>
                Report execution status:
              </span>

              <strong>
                {executionMessage}
              </strong>

            </div>

          )
        }

      </section>

    </section>
  );
}

export default Simulation;