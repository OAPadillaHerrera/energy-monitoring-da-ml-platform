

import { type ChangeEvent, useState } from "react";
import layoutStyles from "../../../components/shared/styles/layoutStyles.module.css";
import panelStyles from "../../../components/shared/styles/panelStyles.module.css";
import tabStyles from "../../../components/shared/styles/tabStyles.module.css";
import controlStyles from "../../../components/shared/styles/controlStyles.module.css";

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

    <section className={layoutStyles.mainPanel}>

      <section className={panelStyles.chartPanel}>

        <div className={panelStyles.panelHeader}>
          Total Station Energy Consumption
        </div>

        <div className={panelStyles.chartPlaceholder}>

          <div className={panelStyles.chartGrid}></div>

          <span className={panelStyles.placeholderText}>
            Waiting for Simulation execution...
          </span>

        </div>

      </section>

      <section className={panelStyles.controlPanel}>

        <div className={panelStyles.panelHeader}>
          Simulation Configuration
        </div>

        <div className={controlStyles.controlContent}>

          <div className={controlStyles.modeSelector}>

            <button
              className={
                mode === "daily"
                  ? tabStyles.tabButtonActive
                  : tabStyles.tabButton
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
                  ? tabStyles.tabButtonActive
                  : tabStyles.tabButton
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

              <div className={controlStyles.rangeInputs}>

                <div className={controlStyles.inputGroup}>

                  <input
                    type="text"

                    className={controlStyles.input}

                    placeholder="yyyy/mm/dd"

                    value={startDate}

                    onChange={handleStartDateChange}
                  />

                  <div className={controlStyles.inputLabel}>
                    Start Date
                  </div>

                </div>

                <div className={controlStyles.inputGroup}>

                  <input
                    type="text"

                    className={controlStyles.input}

                    placeholder="yyyy/mm/dd"

                    value={endDate}

                    onChange={handleEndDateChange}
                  />

                  <div className={controlStyles.inputLabel}>
                    End Date
                  </div>

                </div>

              </div>

            )
          }

          <button
            className={controlStyles.runButton}

            onClick={handleRunSimulation}
          >
            Run Simulation
          </button>

          {
            executedDate && (

              <div className={controlStyles.executionInfo}>

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







