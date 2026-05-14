

import styles from "./ML.module.css";
import logo from "../../../assets/logos/logo_ENERGON.png";

function ML() {
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
            <button className={styles.tabButton}>Anomaly Detection</button>
            <button className={styles.tabButtonActive}>ML</button>
          </div>

          <section className={styles.chartPanel}>
            <div className={styles.panelHeader}>
              Root Cause Pipeline Visualization
            </div>

            <div className={styles.chartPlaceholder}>
              <div className={styles.chartGrid}></div>
              <span className={styles.placeholderText}>
                Waiting for Root Cause Pipeline execution...
              </span>
            </div>
          </section>

          <section className={styles.controlPanel}>
            <div className={styles.panelHeader}>
              ML Configuration
            </div>

            <div className={styles.controlContent}>

              <div className={styles.modeSelector}>
                <span className={styles.pipelineLabel}>
                  Root Cause Pipeline
                </span>
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
                Run Root Cause Pipeline
              </button>

            </div>
          </section>

        </section>

      </section>

    </main>
  );
}

export default ML;