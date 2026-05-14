

import styles from "./AnomalyDetection.module.css";
import logo from "../../../assets/logos/logo_ENERGON.png";

function AnomalyDetection() {
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
            <button className={styles.navButtonActive}>DA/ML</button>
            <button className={styles.navButton}>Reports</button>
            <button className={styles.navButton}>About</button>
          </nav>

        </aside>

        <section className={styles.mainPanel}>

          <div className={styles.tabs}>
            <button className={styles.tabButton}>Metrics</button>
            <button className={styles.tabButtonActive}>
              Anomaly Detection
            </button>
            <button className={styles.tabButton}>ML Intelligence</button>
          </div>

          <section className={styles.chartPanel}>
            <div className={styles.panelHeader}>
              Z-Score Visualization
            </div>

            <div className={styles.chartPlaceholder}>
              <div className={styles.chartGrid}></div>
              <span className={styles.placeholderText}>
                Waiting for Z-Score execution...
              </span>
            </div>
          </section>

          <section className={styles.controlPanel}>
            <div className={styles.panelHeader}>
              Anomaly Configuration
            </div>

            <div className={styles.controlContent}>

              <div className={styles.modeSelector}>
                <button className={styles.tabButtonActive}>Z-Score</button>
                <button className={styles.tabButton}>Detection</button>
                <button className={styles.tabButton}>Classification</button>
              </div>

              <div className={styles.rangeInputs}>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Select System"
                  />
                  <div className={styles.inputLabel}>
                    System Name
                  </div>
                </div>
              </div>

              <button className={styles.runButton}>
                Run Z-Score
              </button>

            </div>
          </section>

        </section>

      </section>

    </main>
  );
}

export default AnomalyDetection;