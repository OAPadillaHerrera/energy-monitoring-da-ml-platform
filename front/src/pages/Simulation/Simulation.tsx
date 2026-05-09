

import styles from "./Simulation.module.css";
import logo from "../../assets/logos/logo_ENERGON.png";

function Simulation() {
  return (
    <main className={styles.container}>
      <div className={styles.overlay}></div>

      <header className={styles.topbar}>
        <div className={styles.stationBlock}>
          <span className={styles.stationLabel}>Station</span>

          <h1 className={styles.stationName}>
            Vehicular Fuel Service Station
          </h1>
        </div>

        <div className={styles.systemBlock}>
          <span className={styles.systemTitle}>
            Energy DA/ML Engine
          </span>

          <div className={styles.systemStatus}>
            <span className={styles.statusDot}></span>

            <span className={styles.statusText}>
              System Online
            </span>
          </div>
        </div>
      </header>

      <section className={styles.content}>
        <aside className={styles.sidebar}>

          <div className={styles.sidebarLogo}>
            <img
              src={logo}
              alt="Energon"
              className={styles.logo}
            />

            <div className={styles.brandContainer}>
              <div className={styles.brandMain}>
                ENERGON
              </div>

              <div className={styles.brandSub}>
                ANALYTICS
              </div>
            </div>
          </div>

          <nav className={styles.nav}>
            <button className={styles.navButton}>
              Dashboard
            </button>

            <button className={styles.navButtonActive}>
              Simulation
            </button>

            <button className={styles.navButton}>
              DA/ML
            </button>

            <button className={styles.navButton}>
              Reports
            </button>

            <button className={styles.navButton}>
              About
            </button>
          </nav>
        </aside>

        <section className={styles.mainPanel}>

          <div className={styles.tabs}>
            <button className={styles.tabButtonActive}>
              Consumption
            </button>

            <button className={styles.tabButton}>
              System Events
            </button>

            <button className={styles.tabButton}>
              Voltage
            </button>
          </div>

          <section className={styles.chartPanel}>
            <div className={styles.panelHeader}>
              Total Station Energy Consumption
            </div>

            <div className={styles.chartPlaceholder}>
              <div className={styles.chartGrid}></div>

              <span className={styles.placeholderText}>
                Waiting for simulation execution...
              </span>
            </div>
          </section>

          <section className={styles.controlPanel}>
            <div className={styles.panelHeader}>
              Simulation Configuration
            </div>

            <div className={styles.controlContent}>

              <div className={styles.modeSelector}>
                <button className={styles.tabButtonActive}>
                  Range Simulation
                </button>

                <button className={styles.tabButton}>
                  Daily Simulation
                </button>
              </div>

              <div className={styles.rangeInputs}>

                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="yyyy/mm/dd"
                    pattern="\d{4}/\d{2}/\d{2}"
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
                    pattern="\d{4}/\d{2}/\d{2}"
                  />

                  <div className={styles.inputLabel}>
                    End Date
                  </div>
                </div>
              </div>

              <button className={styles.runButton}>
                Run Simulation
              </button>

            </div>
          </section>

        </section>
      </section>
    </main>
  );
}

export default Simulation;