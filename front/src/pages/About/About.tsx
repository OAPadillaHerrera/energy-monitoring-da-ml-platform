

import styles from "./About.module.css";

function About() {
  return (
    <section className={styles.container}>

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
  );
}

export default About;