

import { useState, type ChangeEvent } from "react";
import layoutStyles from "../../../components/shared/styles/layoutStyles.module.css";
import chipStyles from "../../../components/shared/styles/chipStyles.module.css";
import panelStyles from "../../../components/shared/styles/panelStyles.module.css";
import tabStyles from "../../../components/shared/styles/tabStyles.module.css";
import controlStyles from "../../../components/shared/styles/controlStyles.module.css";

function DAML() {

  const [section, setSection] = useState("metrics");
  const [subMode, setSubMode] = useState("basic");
  const [viewMode, setViewMode] = useState("chart");
  const [systemName, setSystemName] = useState("");
  const [executionMessage, setExecutionMessage] = useState("");

  const handleSystemChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSystemName(event.target.value);
  };

  const requiresSystemInput = (): boolean => {
    return (
      (section === "metrics" && subMode === "system") ||
      section === "anomaly" ||
      section === "ml"
    );
  };

  const handleRun = (): void => {

    if (requiresSystemInput() && !systemName.trim()) {
      setExecutionMessage("Please provide a valid system name.");
      return;
    }

    const target = systemName.trim();

    if (section === "metrics") {
      if (subMode === "basic")
        return setExecutionMessage("Basic Metrics report generated.");

      if (subMode === "station")
        return setExecutionMessage("Station Metrics report generated.");

      if (subMode === "system")
        return setExecutionMessage(
          `System Metrics report generated for ${target}.`
        );

      if (subMode === "energy")
        return setExecutionMessage("Energy Metrics report generated.");
    }

    if (section === "anomaly") {
      if (subMode === "zscore")
        return setExecutionMessage(
          `Z-Score Analysis report generated for ${target}.`
        );

      if (subMode === "detection")
        return setExecutionMessage(
          `Detection Analysis report generated for ${target}.`
        );

      if (subMode === "classification")
        return setExecutionMessage(
          `Classification Analysis report generated for ${target}.`
        );
    }

    if (section === "ml") {
      return setExecutionMessage(
        `Root Cause Pipeline report generated for ${target}.`
      );
    }
  };

  const handleExportCSV = (): void => {
    setExecutionMessage("CSV report exported successfully.");
  };

  const handleExportPDF = (): void => {
    setExecutionMessage("PDF report exported successfully.");
  };

  const renderTitle = (): string => {

    if (section === "metrics") {
      if (subMode === "basic") return "Basic Metrics Report";
      if (subMode === "station") return "Station Metrics Report";
      if (subMode === "system") return "System Metrics Report";
      if (subMode === "energy") return "Energy Metrics Report";
    }

    if (section === "anomaly") {
      if (subMode === "zscore") return "Z-Score Analysis";
      if (subMode === "detection") return "Detection Analysis";
      if (subMode === "classification") return "Classification Analysis";
    }

    return "Root Cause Pipeline";
  };

  const showSystemInput = (): boolean => {
    return (
      (section === "metrics" && subMode === "system") ||
      section === "anomaly" ||
      section === "ml"
    );
  };

  return (
    <section className={layoutStyles.mainPanel}>

      <div className={tabStyles.tabs}>

        <button
          className={
            section === "metrics"
              ? tabStyles.tabButtonActive
              : tabStyles.tabButton
          }
          onClick={() => {
            setSection("metrics");
            setSubMode("basic");
          }}
        >
          Metrics
        </button>

        <button
          className={
            section === "anomaly"
              ? tabStyles.tabButtonActive
              : tabStyles.tabButton
          }
          onClick={() => {
            setSection("anomaly");
            setSubMode("zscore");
          }}
        >
          Anomaly
        </button>

        <button
          className={
            section === "ml"
              ? tabStyles.tabButtonActive
              : tabStyles.tabButton
          }
          onClick={() => setSection("ml")}
        >
          ML
        </button>

      </div>

      <section className={panelStyles.chartPanel}>

        <div className={panelStyles.panelHeader}>
          {renderTitle()}
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

        {section === "metrics" && (
          <div className={tabStyles.tabs}>
            <button
              className={
                subMode === "basic"
                  ? tabStyles.tabButtonActive
                  : tabStyles.tabButton
              }
              onClick={() => setSubMode("basic")}
            >
              Basic
            </button>

            <button
              className={
                subMode === "station"
                  ? tabStyles.tabButtonActive
                  : tabStyles.tabButton
              }
              onClick={() => setSubMode("station")}
            >
              Station
            </button>

            <button
              className={
                subMode === "system"
                  ? tabStyles.tabButtonActive
                  : tabStyles.tabButton
              }
              onClick={() => setSubMode("system")}
            >
              System
            </button>

            <button
              className={
                subMode === "energy"
                  ? tabStyles.tabButtonActive
                  : tabStyles.tabButton
              }
              onClick={() => setSubMode("energy")}
            >
              Energy
            </button>
          </div>
        )}

        {section === "anomaly" && (
          <div className={tabStyles.tabs}>
            <button
              className={
                subMode === "zscore"
                  ? tabStyles.tabButtonActive
                  : tabStyles.tabButton
              }
              onClick={() => setSubMode("zscore")}
            >
              Z-Score
            </button>

            <button
              className={
                subMode === "detection"
                  ? tabStyles.tabButtonActive
                  : tabStyles.tabButton
              }
              onClick={() => setSubMode("detection")}
            >
              Detection
            </button>

            <button
              className={
                subMode === "classification"
                  ? tabStyles.tabButtonActive
                  : tabStyles.tabButton
              }
              onClick={() => setSubMode("classification")}
            >
              Classification
            </button>
          </div>
        )}

        {section === "ml" && (
          <div className={chipStyles.chipPrimary}>
            Root Cause Pipeline
          </div>
        )}

        {showSystemInput() && (
          <div className={controlStyles.rangeInputs}>
            <div className={controlStyles.inputGroup}>
              <input
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
        )}

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
          <div className={controlStyles.executionInfo}>
            <span>Report execution status:</span>
            <strong>{executionMessage}</strong>
          </div>
        )}

      </section>

    </section>
  );
}

export default DAML;

