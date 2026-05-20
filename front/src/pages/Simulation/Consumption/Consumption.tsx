

import { type ChangeEvent, useState } from "react";
import styles from "./Consumption.module.css";

function Consumption() {

  const [mode, setMode] = useState("daily");

  const [executedDate, setExecutedDate] = useState("");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const handleRunSimulation = (): void => {

    if (mode === "daily") {

      const today = new Date();

      const formattedDate =
        today
          .toISOString()
          .split("T")[0]
          .replace(/-/g, "/");

      setExecutedDate(formattedDate);

      return;
    }

    if (mode === "range") {

      if (!startDate.trim() || !endDate.trim()) {

        setExecutedDate("");

        return;
      }

      setExecutedDate(
        `${startDate} → ${endDate}`
      );
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

    <section className={styles.mainPanel}>

      <section className={styles.chartPanel}>

        <div className={styles.panelHeader}>
          Total Station Energy Consumption
        </div>

        <div className={styles.chartPlaceholder}>

          <div className={styles.chartGrid}></div>

          <span className={styles.placeholderText}>
            Waiting for Simulation execution...
          </span>

        </div>

      </section>

      <section className={styles.controlPanel}>

        <div className={styles.panelHeader}>
          Simulation Configuration
        </div>

        <div className={styles.controlContent}>

          <div className={styles.modeSelector}>

            <button

              className={
                mode === "daily"
                  ? styles.tabButtonActive
                  : styles.tabButton
              }

              onClick={() => {

                setMode("daily");

                setExecutedDate("");
              }}
            >
              Daily Simulation
            </button>

            <button

              className={
                mode === "range"
                  ? styles.tabButtonActive
                  : styles.tabButton
              }

              onClick={() => {

                setMode("range");

                setExecutedDate("");
              }}
            >
              Range Simulation
            </button>

          </div>

          {
            mode === "range" && (

              <div className={styles.rangeInputs}>

                <div className={styles.inputGroup}>

                  <input
                    type="text"

                    className={styles.input}

                    placeholder="yyyy/mm/dd"

                    value={startDate}

                    onChange={handleStartDateChange}
                  />

                  <div className={styles.inputLabel}>
                    Start Date
                  </div>

                </div>

                <div className={styles.inputGroup}>

                  <input
                    type="text"

                    className={styles.input}

                    placeholder="yyyy/mm/dd"

                    value={endDate}

                    onChange={handleEndDateChange}
                  />

                  <div className={styles.inputLabel}>
                    End Date
                  </div>

                </div>

              </div>

            )
          }

          <button
            className={styles.runButton}

            onClick={handleRunSimulation}
          >
            Run Simulation
          </button>

          {
            executedDate && (

              <div className={styles.executionInfo}>

                <span>
                  Simulation executed for:
                </span>

                <strong>
                  {executedDate}
                </strong>

              </div>

            )
          }

        </div>

      </section>

    </section>
  );
}

export default Consumption;







