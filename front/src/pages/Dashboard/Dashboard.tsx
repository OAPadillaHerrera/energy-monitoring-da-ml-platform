

import styles from "./Dashboard.module.css";
import logo from "../../assets/logos/logo_ENERGON.png";

function Dashboard() {
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

            <span className={styles.logoText}>
              ENERGON
            </span>

          </div>

          <nav className={styles.nav}>

            <button className={styles.navButtonActive}>
              Dashboard
            </button>

            <button className={styles.navButton}>
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

          <section className={styles.chartPanel}>

            <div className={styles.panelHeader}>
              Total Station Energy Consumption
            </div>

            <div className={styles.chartPlaceholder}>

              <div className={styles.chartGrid}></div>

              <span className={styles.placeholderText}>
                Waiting for simulation data...
              </span>

            </div>

          </section>

          <div className={styles.kpiRow}>

            <div className={styles.kpiCard}>

              <span className={styles.kpiLabel}>
                Total Consumption
              </span>

              <h2 className={styles.kpiValue}>
                --
              </h2>

            </div>

            <div className={styles.kpiCard}>

              <span className={styles.kpiLabel}>
                Peak Demand
              </span>

              <h2 className={styles.kpiValue}>
                --
              </h2>

            </div>

            <div className={styles.kpiCard}>

              <span className={styles.kpiLabel}>
                Active Systems
              </span>

              <h2 className={styles.kpiValue}>
                --
              </h2>

            </div>

            <div className={styles.kpiCard}>

              <span className={styles.kpiLabel}>
                Alert Status
              </span>

              <h2 className={styles.kpiValue}>
                --
              </h2>

            </div>

          </div>

        </section>

      </section>

    </main>
  );
}

export default Dashboard;