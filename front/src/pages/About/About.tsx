

import styles from "./About.module.css";
import logo from "../../assets/logos/logo_ENERGON.png";

function About() {
  return (
    <main className={styles.container}>

      <div className={styles.overlay}></div>

      <header className={styles.topbar}>

        <div className={styles.stationBlock}>

          <span className={styles.stationLabel}>
            Platform
          </span>

          <h1 className={styles.stationName}>
            Energon Analytics Architecture
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

            <button className={styles.navButton}>
              Simulation
            </button>

            <button className={styles.navButton}>
              DA/ML
            </button>

            <button className={styles.navButton}>
              Reports
            </button>

            <button className={styles.navButtonActive}>
              About
            </button>

          </nav>

        </aside>

        <section className={styles.mainPanel}>

          <div className={styles.tabs}>

            <button className={styles.tabButtonActive}>
              Platform Overview
            </button>

            <button className={styles.tabButton}>
              Architecture
            </button>

            <button className={styles.tabButton}>
              Technologies
            </button>

            <button className={styles.tabButton}>
              Academic Context
            </button>

          </div>

          <section className={styles.chartPanel}>

            <div className={styles.panelHeader}>
              About Energon Analytics
            </div>

            <div className={styles.chartPlaceholder}>

              <div className={styles.chartGrid}></div>

              <span className={styles.placeholderText}>
                About content under construction...
              </span>

            </div>

          </section>

        </section>

      </section>

    </main>
  );
}

export default About;