

import styles from "./SystemEvents.module.css";
import panelStyles from "../../../components/shared/styles/panelStyles.module.css";

function SystemEvents() {
  return (
    <section className={styles.mainPanel}>

      <section className={panelStyles.chartPanel}>

        <div className={panelStyles.panelHeader}>
          System Event Records
        </div>

        <div className={panelStyles.chartPlaceholder}>
          <div className={panelStyles.chartGrid}></div>

          <span className={panelStyles.placeholderText}>
            Waiting for Simulation execution...
          </span>
        </div>

      </section>

    </section>
  );
}

export default SystemEvents;