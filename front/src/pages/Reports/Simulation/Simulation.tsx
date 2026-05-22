

import {
  type ChangeEvent,
  useState
} from "react";

import styles from "./Simulation.module.css";

function Simulation() {

  const [mode, setMode] = useState("hourly");

  const [viewMode, setViewMode] = useState("chart");

  const [systemName, setSystemName] = useState("");

  const [executionMessage, setExecutionMessage] =
    useState("");

  const handleSystemChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {

    setSystemName(event.target.value);
  };

  const handleGenerateReport = (): void => {

    const requiresSystem =
      mode !== "voltage";

    if (
      requiresSystem &&
      !systemName.trim()
    ) {

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

    <section className={styles.mainPanel}>

      <div className={styles.subTabs}>

        <button
          className={
            mode === "hourly"
              ? styles.tabButtonActive
              : styles.tabButton
          }

          onClick={() => setMode("hourly")}
        >
          Hourly Data
        </button>

        <button
          className={
            mode === "events"
              ? styles.tabButtonActive
              : styles.tabButton
          }

          onClick={() => setMode("events")}
        >
          Event Records
        </button>

        <button
          className={
            mode === "daily"
              ? styles.tabButtonActive
              : styles.tabButton
          }

          onClick={() => setMode("daily")}
        >
          Daily Totals
        </button>

        <button
          className={
            mode === "voltage"
              ? styles.tabButtonActive
              : styles.tabButton
          }

          onClick={() => setMode("voltage")}
        >
          Voltage Records
        </button>

      </div>

      <section className={styles.chartPanel}>

        <div className={styles.panelHeader}>

          {
            mode === "hourly" &&
            "Hourly Energy Consumption Report"
          }

          {
            mode === "events" &&
            "Event Records Report"
          }

          {
            mode === "daily" &&
            "Daily Energy Totals Report"
          }

          {
            mode === "voltage" &&
            "Voltage Records Report"
          }

        </div>

        <div className={styles.chartPlaceholder}>

          <div className={styles.chartGrid}></div>

          <span className={styles.placeholderText}>
            Waiting for report generation...
          </span>

        </div>

      </section>

      <section className={styles.controlPanel}>

        <div className={styles.panelHeader}>
          Report Configuration
        </div>

        <div className={styles.controlContent}>

          <div className={styles.modeSelector}>

            <button
              className={
                viewMode === "chart"
                  ? styles.tabButtonActive
                  : styles.tabButton
              }

              onClick={() => setViewMode("chart")}
            >
              Chart View
            </button>

            <button
              className={
                viewMode === "table"
                  ? styles.tabButtonActive
                  : styles.tabButton
              }

              onClick={() => setViewMode("table")}
            >
              Table View
            </button>

          </div>

          {
            mode !== "voltage" && (

              <div className={styles.rangeInputs}>

                <div className={styles.inputGroup}>

                  <input
                    type="text"

                    className={styles.input}

                    placeholder="Select System"

                    value={systemName}

                    onChange={handleSystemChange}
                  />

                  <div className={styles.inputLabel}>
                    System Name
                  </div>

                </div>

              </div>

            )
          }

          <button
            className={styles.runButton}

            onClick={handleGenerateReport}
          >
            Generate Report
          </button>

          <div className={styles.modeSelector}>

            <button
              className={styles.exportButton}

              onClick={handleExportCSV}
            >
              Export CSV
            </button>

            <button
              className={styles.exportButton}

              onClick={handleExportPDF}
            >
              Export PDF
            </button>

          </div>

          {
            executionMessage && (

              <div className={styles.executionInfo}>

                <span>
                  Report execution status:
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

export default Simulation;