

import styles from "./Reports.module.css";
import { Outlet, NavLink } from "react-router-dom";

function Reports() {
  return (
    <section className={styles.mainPanel}>

      <div className={styles.tabs}>

        <NavLink
          to="/reports"
          end
          className={({ isActive }) =>
            isActive ? styles.tabButtonActive : styles.tabButton
          }
        >
          Simulation
        </NavLink>

        <NavLink
          to="daml"
          className={({ isActive }) =>
            isActive ? styles.tabButtonActive : styles.tabButton
          }
        >
          DA/ML
        </NavLink>

      </div>

      <Outlet />

    </section>
  );
}

export default Reports;