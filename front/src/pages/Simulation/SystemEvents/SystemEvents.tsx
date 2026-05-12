

import styles from "./SystemEvents.module.css";
import logo from "../../../assets/logos/logo_ENERGON.png";

function SystemEvents() {
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

            <button className={styles.tabButton}>
              Consumption
            </button>

            <button className={styles.tabButtonActive}>
              System Events
            </button>

            <button className={styles.tabButton}>
              Voltage
            </button>

          </div>

          <section className={styles.chartPanel}>

            <div className={styles.panelHeader}>
              System Event Records
            </div>

            <div className={styles.chartPlaceholder}>
              <div className={styles.chartGrid}></div>

              <span className={styles.placeholderText}>
                Waiting for simulation execution...
              </span>
            </div>

          </section>

        </section>

      </section>
    </main>
  );
}

export default SystemEvents;