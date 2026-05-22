

import { useState, type ChangeEvent } from "react";
import styles from "./DAML.module.css";

function DAML() {

  const [section, setSection] = useState("metrics");
  const [subMode, setSubMode] = useState("basic");

  const [viewMode, setViewMode] = useState("chart");
  const [systemName, setSystemName] = useState("");
  const [executionMessage, setExecutionMessage] = useState("");

  const handleSystemChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSystemName(event.target.value);
  };

  const requiresSystemInput = (): boolean => {
    if (section === "metrics" && subMode === "system") return true;
    if (section === "anomaly") return true;
    if (section === "ml") return true;
    return false;
  };

  const handleRun = (): void => {

    if (requiresSystemInput() && !systemName.trim()) {
      setExecutionMessage("Please provide a valid system name.");
      return;
    }

    const targetSystem = systemName.trim();

    if (section === "metrics") {

      if (subMode === "basic") {
        setExecutionMessage("Basic Metrics report generated.");
        return;
      }

      if (subMode === "station") {
        setExecutionMessage("Station Metrics report generated.");
        return;
      }

      if (subMode === "system") {
        setExecutionMessage(
          `System Metrics report generated for ${targetSystem}.`
        );
        return;
      }

      if (subMode === "energy") {
        setExecutionMessage("Energy Metrics report generated.");
        return;
      }
    }

    if (section === "anomaly") {

      if (subMode === "zscore") {
        setExecutionMessage(
          `Z-Score Analysis report generated for ${targetSystem}.`
        );
        return;
      }

      if (subMode === "detection") {
        setExecutionMessage(
          `Detection Analysis report generated for ${targetSystem}.`
        );
        return;
      }

      if (subMode === "classification") {
        setExecutionMessage(
          `Classification Analysis report generated for ${targetSystem}.`
        );
        return;
      }
    }

    if (section === "ml") {
      setExecutionMessage(
        `Root Cause Pipeline report generated for ${targetSystem}.`
      );
    }
  };

  const handleExportCSV = (): void => {
    setExecutionMessage("CSV report exported successfully.");
  };

  const handleExportPDF = (): void => {
    setExecutionMessage("PDF report exported successfully.");
  };

  const showSystemInput = (): boolean => {
    if (section === "metrics" && subMode === "system") return true;
    if (section === "anomaly") return true;
    if (section === "ml") return true;
    return false;
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

    if (section === "ml") {
      return "Root Cause Pipeline";
    }

    return "Report";
  };

  return (
    <section className={styles.mainPanel}>

      <div className={styles.subTabs}>

        <button
          className={section === "metrics"
            ? styles.tabButtonActive
            : styles.tabButton
          }
          onClick={() => {
            setSection("metrics");
            setSubMode("basic");
          }}
        >
          Metrics
        </button>

        <button
          className={section === "anomaly"
            ? styles.tabButtonActive
            : styles.tabButton
          }
          onClick={() => {
            setSection("anomaly");
            setSubMode("zscore");
          }}
        >
          Anomaly
        </button>

        <button
          className={section === "ml"
            ? styles.tabButtonActive
            : styles.tabButton
          }
          onClick={() => {
            setSection("ml");
            setSubMode("pipeline");
          }}
        >
          ML
        </button>

      </div>

      <section className={styles.chartPanel}>
        <div className={styles.panelHeader}>
          {renderTitle()}
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
              className={viewMode === "chart"
                ? styles.tabButtonActive
                : styles.tabButton
              }
              onClick={() => setViewMode("chart")}
            >
              Chart View
            </button>

            <button
              className={viewMode === "table"
                ? styles.tabButtonActive
                : styles.tabButton
              }
              onClick={() => setViewMode("table")}
            >
              Table View
            </button>

          </div>

          {section === "metrics" && (
            <div className={styles.modeSelector}>

              <button
                className={subMode === "basic"
                  ? styles.tabButtonActive
                  : styles.tabButton
                }
                onClick={() => setSubMode("basic")}
              >
                Basic
              </button>

              <button
                className={subMode === "station"
                  ? styles.tabButtonActive
                  : styles.tabButton
                }
                onClick={() => setSubMode("station")}
              >
                Station
              </button>

              <button
                className={subMode === "system"
                  ? styles.tabButtonActive
                  : styles.tabButton
                }
                onClick={() => setSubMode("system")}
              >
                System
              </button>

              <button
                className={subMode === "energy"
                  ? styles.tabButtonActive
                  : styles.tabButton
                }
                onClick={() => setSubMode("energy")}
              >
                Energy
              </button>

            </div>
          )}

          {section === "anomaly" && (
            <div className={styles.modeSelector}>

              <button
                className={subMode === "zscore"
                  ? styles.tabButtonActive
                  : styles.tabButton
                }
                onClick={() => setSubMode("zscore")}
              >
                Z-Score
              </button>

              <button
                className={subMode === "detection"
                  ? styles.tabButtonActive
                  : styles.tabButton
                }
                onClick={() => setSubMode("detection")}
              >
                Detection
              </button>

              <button
                className={subMode === "classification"
                  ? styles.tabButtonActive
                  : styles.tabButton
                }
                onClick={() => setSubMode("classification")}
              >
                Classification
              </button>

            </div>
          )}
  
          {section === "ml" && (
            <div className={styles.modeSelector}>
              <button className={styles.pipelineLabel}>
                Root Cause Pipeline
              </button>
            </div>
          )}

          {showSystemInput() && (
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
          )}

          <button
            className={styles.runButton}
            onClick={handleRun}
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

          {executionMessage && (
            <div className={styles.executionInfo}>
              <span>Report execution status:</span>
              <strong>{executionMessage}</strong>
            </div>
          )}

        </div>
      </section>

    </section>
  );
}

export default DAML;