

import styles from "./DAML.module.css";
import { Outlet, NavLink } from "react-router-dom";

function Daml() {
  return (
    <section className={styles.mainPanel}>

      <div className={styles.tabs}>

        <NavLink
          to="/daml"
          end
          className={({ isActive }) =>
            isActive ? styles.tabButtonActive : styles.tabButton
          }
        >
          Metrics
        </NavLink>

        <NavLink
          to="anomaly-detection"
          className={({ isActive }) =>
            isActive ? styles.tabButtonActive : styles.tabButton
          }
        >
          Detection
        </NavLink>

        <NavLink
          to="ml"
          className={({ isActive }) =>
            isActive ? styles.tabButtonActive : styles.tabButton
          }
        >
          ML
        </NavLink>

      </div>

      <Outlet />

    </section>
  );
}

export default Daml;