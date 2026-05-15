

import styles from "./DailyTotals.module.css";
import logo from "../../../assets/logos/logo_ENERGON.png";

function DailyTotals() {
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
            <span className={styles.statusText}>System Online</span>
          </div>
        </div>
      </header>

      <section className={styles.content}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarLogo}>
            <img src={logo} alt="Energon" className={styles.logo} />

            <div className={styles.brandContainer}>
              <div className={styles.brandMain}>ENERGON</div>
              <div className={styles.brandSub}>ANALYTICS</div>
            </div>
          </div>

          <nav className={styles.nav}>
            <button className={styles.navButton}>Dashboard</button>
            <button className={styles.navButton}>Simulation</button>
            <button className={styles.navButton}>DA/ML</button>

            <button className={styles.navButtonActive}>
              Reports
            </button>

            <button className={styles.navButton}>About</button>
          </nav>
        </aside>

        <section className={styles.mainPanel}>
   
          <div className={styles.tabs}>
            <button className={styles.tabButtonActive}>
              Simulation
            </button>

            <button className={styles.tabButton}>
              DA/ML
            </button>
          </div>

          <div className={styles.subTabs}>
            <button className={styles.subTabButton}>
              Hourly Data
            </button>

            <button className={styles.subTabButton}>
              Event Records
            </button>

            <button className={styles.subTabButtonActive}>
              Daily Totals
            </button>

            <button className={styles.subTabButton}>
              Voltage Records
            </button>
          </div>

          <section className={styles.chartPanel}>
            <div className={styles.panelHeader}>
              Daily Totals Chart View
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
              Report Configuration
            </div>

            <div className={styles.controlContent}>
              <div className={styles.modeSelector}>
                <button className={styles.tabButtonActive}>
                  Chart View
                </button>

                <button className={styles.tabButton}>
                  Table View
                </button>
              </div>

              <div className={styles.modeSelector}>
                <button className={styles.exportButton}>
                  Export CSV
                </button>

                <button className={styles.exportButton}>
                  Export PDF
                </button>
              </div>
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}

export default DailyTotals;