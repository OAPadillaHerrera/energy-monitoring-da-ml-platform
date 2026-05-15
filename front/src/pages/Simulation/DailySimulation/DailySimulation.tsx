

import styles from "./DailySimulation.module.css";
import logo from "../../../assets/logos/logo_ENERGON.png";

function DailySimulation() {
  return (
    <main className={styles.container}>
      <div className={styles.overlay}></div>

      <header className={styles.topbar}>
        <div className={styles.stationBlock}>
          <span className={styles.stationLabel}>
            Station
          </span>

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
              Daily Station Energy Consumption
            </div>

            <div className={styles.chartPlaceholder}>
              <div className={styles.chartGrid}></div>

              <span className={styles.placeholderText}>
                Waiting for daily simulation execution...
              </span>
            </div>
          </section>

          <section className={styles.controlPanel}>
            <div className={styles.panelHeader}>
              Daily Simulation Configuration
            </div>

            <div className={styles.controlContent}>

              <div className={styles.modeSelector}>
                <button className={styles.tabButton}>
                  Range Simulation
                </button>

                <button className={styles.tabButtonActive}>
                  Daily Simulation
                </button>
              </div>

              <div className={styles.modeStatus}>
                Daily Simulation Mode Active
              </div>

              <div className={styles.modeDescription}>
                Executes current system day simulation.
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

export default DailySimulation;