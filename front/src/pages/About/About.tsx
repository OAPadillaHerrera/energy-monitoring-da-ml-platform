

import styles from "./About.module.css";
import tabStyles from "../../components/shared/styles/tabStyles.module.css";
import panelStyles from "../../components/shared/styles/panelStyles.module.css";

function About() {
  return (
    <section className={styles.mainPanel}>

      <nav className={tabStyles.tabs}>

        <button className={tabStyles.tabButtonActive}>
          Platform Overview
        </button>

        <button className={tabStyles.tabButton}>
          Architecture
        </button>

        <button className={tabStyles.tabButton}>
          Technologies
        </button>

        <button className={tabStyles.tabButton}>
          Academic Context
        </button>

      </nav>

      <section className={panelStyles.chartPanel}>

        <div className={panelStyles.panelHeader}>
          About Energon Analytics
        </div>

        <div className={panelStyles.chartPlaceholder}>

          <div className={panelStyles.chartGrid}></div>

          <span className={panelStyles.placeholderText}>
            About content under construction...
          </span>

        </div>

      </section>

    </section>
  );
}

export default About;